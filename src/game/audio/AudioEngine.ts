import type { EmotionalState } from '../types';

interface DroneConfig {
  frequencies: number[];
  waveforms: OscillatorType[];
  gainLevels: number[];
  filterFreq: number;
  reverbDecay: number;
}

// Much gentler, ambient pad-like drones — all sine waves, very low gains
const DRONE_CONFIGS: Record<EmotionalState, DroneConfig> = {
  dormant: {
    frequencies: [55, 82.41, 110],
    waveforms: ['sine', 'sine', 'sine'],
    gainLevels: [0.04, 0.025, 0.015],
    filterFreq: 300,
    reverbDecay: 5,
  },
  wonder: {
    frequencies: [130.81, 196, 261.63, 329.63],
    waveforms: ['sine', 'sine', 'sine', 'sine'],
    gainLevels: [0.035, 0.025, 0.018, 0.01],
    filterFreq: 800,
    reverbDecay: 4,
  },
  preparation: {
    frequencies: [110, 164.81, 220, 277.18],
    waveforms: ['sine', 'sine', 'sine', 'sine'],
    gainLevels: [0.03, 0.022, 0.018, 0.012],
    filterFreq: 1000,
    reverbDecay: 3,
  },
  restoration: {
    frequencies: [146.83, 220, 293.66, 369.99],
    waveforms: ['sine', 'sine', 'sine', 'sine'],
    gainLevels: [0.035, 0.025, 0.018, 0.012],
    filterFreq: 1200,
    reverbDecay: 3.5,
  },
  triumph: {
    frequencies: [196, 261.63, 329.63, 392],
    waveforms: ['sine', 'sine', 'sine', 'sine'],
    gainLevels: [0.04, 0.03, 0.02, 0.015],
    filterFreq: 1400,
    reverbDecay: 4,
  },
};

const SFX_DEFINITIONS = {
  tick: { freq: 2400, duration: 0.015, type: 'sine' as OscillatorType, ramp: 1800, gain: 0.012 },
  select: { freq: 660, duration: 0.1, type: 'sine' as OscillatorType, ramp: 880, gain: 0.08 },
  confirm: { freq: 523.25, duration: 0.18, type: 'sine' as OscillatorType, ramp: 783.99, gain: 0.1 },
  apply: { freq: 440, duration: 0.25, type: 'sine' as OscillatorType, ramp: 660, gain: 0.08 },
  success: { freq: 523.25, duration: 0.4, type: 'sine' as OscillatorType, ramp: 1046.5, gain: 0.1 },
  combo: { freq: 659.25, duration: 0.2, type: 'sine' as OscillatorType, ramp: 987.77, gain: 0.08 },
  error: { freq: 220, duration: 0.15, type: 'sine' as OscillatorType, ramp: 165, gain: 0.06 },
  triumph: { freq: 392, duration: 0.6, type: 'sine' as OscillatorType, ramp: 783.99, gain: 0.12 },
  whoosh: { freq: 400, duration: 0.25, type: 'sine' as OscillatorType, ramp: 80, gain: 0.04 },
  sparkle: { freq: 1800, duration: 0.12, type: 'sine' as OscillatorType, ramp: 3200, gain: 0.03 },
};

export type SfxName = keyof typeof SFX_DEFINITIONS;

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private activeFilter: BiquadFilterNode | null = null;
  private convolver: ConvolverNode | null = null;
  private currentState: EmotionalState | null = null;
  private crossfadeDuration = 3;
  private _masterVolume = 0.4;
  private unlocked = false;

  async unlock(): Promise<void> {
    if (this.unlocked) return;
    try {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this._masterVolume;
      this.masterGain.connect(this.ctx.destination);

      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.value = 0;
      this.droneGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.6;
      this.sfxGain.connect(this.masterGain);

      this.convolver = this.createReverb(4);
      this.convolver.connect(this.masterGain);

      if (this.ctx.state === 'suspended') await this.ctx.resume();
      this.unlocked = true;
    } catch {
      console.warn('AudioEngine: Web Audio API unavailable');
    }
  }

  private createReverb(decay: number): ConvolverNode {
    const ctx = this.ctx!;
    const rate = ctx.sampleRate;
    const length = rate * decay;
    const buffer = ctx.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buffer.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay * 1.5);
      }
    }
    const conv = ctx.createConvolver();
    conv.buffer = buffer;
    return conv;
  }

  async transitionTo(state: EmotionalState, volume = 0.35): Promise<void> {
    if (!this.unlocked || !this.ctx || !this.droneGain) return;
    if (state === this.currentState) return;

    const now = this.ctx.currentTime;

    // Gentle whoosh for transitions
    this.playSfx('whoosh');

    // Slow fade out current
    this.droneGain.gain.cancelScheduledValues(now);
    this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, now);
    this.droneGain.gain.linearRampToValueAtTime(0, now + this.crossfadeDuration * 0.5);

    // Stop old oscillators after fade
    const oldOscs = [...this.activeOscillators];
    const oldFilter = this.activeFilter;
    setTimeout(() => {
      oldOscs.forEach((o) => { try { o.stop(); o.disconnect(); } catch {} });
      if (oldFilter) oldFilter.disconnect();
    }, this.crossfadeDuration * 500 + 200);

    this.activeOscillators = [];
    this.currentState = state;

    const config = DRONE_CONFIGS[state];

    // New filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = config.filterFreq;
    filter.Q.value = 0.7; // Gentle, no resonance peak
    filter.connect(this.droneGain);
    this.activeFilter = filter;

    // Heavy reverb send for ambient wash
    const reverbSend = this.ctx.createGain();
    reverbSend.gain.value = 0.35;
    reverbSend.connect(this.convolver!);

    // Create oscillators with slow LFO-like detuning for warmth
    config.frequencies.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      osc.type = config.waveforms[i] || 'sine';
      osc.frequency.value = freq;
      // Slow gentle detuning for organic feel
      osc.detune.value = Math.sin(i * 2.1) * 5;

      const oscGain = this.ctx!.createGain();
      oscGain.gain.value = config.gainLevels[i] || 0.02;

      osc.connect(oscGain);
      oscGain.connect(filter);
      oscGain.connect(reverbSend);
      osc.start(now + this.crossfadeDuration * 0.4);
      this.activeOscillators.push(osc);
    });

    // Very slow fade in for smooth ambient feel
    setTimeout(() => {
      if (!this.droneGain || !this.ctx) return;
      const t = this.ctx.currentTime;
      this.droneGain.gain.cancelScheduledValues(t);
      this.droneGain.gain.setValueAtTime(0, t);
      this.droneGain.gain.linearRampToValueAtTime(volume, t + this.crossfadeDuration * 0.8);
    }, this.crossfadeDuration * 400);
  }

  playSfx(name: SfxName): void {
    if (!this.unlocked || !this.ctx || !this.sfxGain) return;
    const def = SFX_DEFINITIONS[name];
    if (!def) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = def.type;
    osc.frequency.setValueAtTime(def.freq, now);
    osc.frequency.exponentialRampToValueAtTime(def.ramp, now + def.duration);

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(def.gain, now);
    env.gain.exponentialRampToValueAtTime(0.001, now + def.duration);

    osc.connect(env);
    env.connect(this.sfxGain);

    // Reverb for ambient SFX (not tick)
    if (this.convolver && name !== 'tick') {
      const reverbSend = this.ctx.createGain();
      reverbSend.gain.value = 0.15;
      env.connect(reverbSend);
      reverbSend.connect(this.convolver);
    }

    osc.start(now);
    osc.stop(now + def.duration + 0.05);
  }

  setMasterVolume(v: number): void {
    this._masterVolume = v;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(v, this.ctx.currentTime);
    }
  }

  stopAll(): void {
    if (!this.ctx || !this.droneGain) return;
    const now = this.ctx.currentTime;
    this.droneGain.gain.linearRampToValueAtTime(0, now + 0.5);
    setTimeout(() => {
      this.activeOscillators.forEach((o) => { try { o.stop(); o.disconnect(); } catch {} });
      this.activeOscillators = [];
      this.currentState = null;
    }, 600);
  }

  dispose(): void {
    this.stopAll();
    setTimeout(() => {
      this.ctx?.close();
      this.ctx = null;
      this.unlocked = false;
    }, 700);
  }
}

// Singleton
let _instance: AudioEngine | null = null;
export function getAudioEngine(): AudioEngine {
  if (!_instance) _instance = new AudioEngine();
  return _instance;
}
