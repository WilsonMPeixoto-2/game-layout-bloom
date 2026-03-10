import type { EmotionalState } from '../types';

interface DroneConfig {
  frequencies: number[];
  waveforms: OscillatorType[];
  gainLevels: number[];
  filterFreq: number;
  reverbDecay: number;
}

const DRONE_CONFIGS: Record<EmotionalState, DroneConfig> = {
  dormant: {
    frequencies: [55, 82.41, 110],
    waveforms: ['sine', 'sine', 'triangle'],
    gainLevels: [0.12, 0.08, 0.04],
    filterFreq: 400,
    reverbDecay: 4,
  },
  wonder: {
    frequencies: [130.81, 196, 261.63, 329.63],
    waveforms: ['sine', 'triangle', 'sine', 'sine'],
    gainLevels: [0.1, 0.07, 0.05, 0.03],
    filterFreq: 1200,
    reverbDecay: 3,
  },
  preparation: {
    frequencies: [110, 164.81, 220, 277.18],
    waveforms: ['triangle', 'square', 'sine', 'triangle'],
    gainLevels: [0.09, 0.06, 0.07, 0.04],
    filterFreq: 1800,
    reverbDecay: 2,
  },
  restoration: {
    frequencies: [146.83, 220, 293.66, 369.99, 440],
    waveforms: ['sine', 'triangle', 'sine', 'triangle', 'sine'],
    gainLevels: [0.1, 0.08, 0.06, 0.04, 0.03],
    filterFreq: 2400,
    reverbDecay: 2.5,
  },
  triumph: {
    frequencies: [196, 261.63, 329.63, 392, 523.25],
    waveforms: ['sine', 'sine', 'triangle', 'sine', 'sine'],
    gainLevels: [0.1, 0.08, 0.07, 0.05, 0.04],
    filterFreq: 3000,
    reverbDecay: 3.5,
  },
};

const SFX_DEFINITIONS = {
  tick: { freq: 1800, duration: 0.03, type: 'sine' as OscillatorType, ramp: 1200, gain: 0.06 },
  select: { freq: 880, duration: 0.08, type: 'sine' as OscillatorType, ramp: 1100, gain: 0.2 },
  confirm: { freq: 523.25, duration: 0.2, type: 'sine' as OscillatorType, ramp: 783.99, gain: 0.25 },
  apply: { freq: 440, duration: 0.3, type: 'triangle' as OscillatorType, ramp: 880, gain: 0.2 },
  success: { freq: 523.25, duration: 0.5, type: 'sine' as OscillatorType, ramp: 1046.5, gain: 0.25 },
  combo: { freq: 659.25, duration: 0.25, type: 'sine' as OscillatorType, ramp: 1318.5, gain: 0.2 },
  error: { freq: 220, duration: 0.2, type: 'sawtooth' as OscillatorType, ramp: 110, gain: 0.15 },
  triumph: { freq: 392, duration: 0.8, type: 'sine' as OscillatorType, ramp: 783.99, gain: 0.3 },
  whoosh: { freq: 300, duration: 0.35, type: 'sine' as OscillatorType, ramp: 100, gain: 0.12 },
  sparkle: { freq: 2000, duration: 0.15, type: 'sine' as OscillatorType, ramp: 4000, gain: 0.08 },
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
  private crossfadeDuration = 2.5;
  private _masterVolume = 0.5;
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
      this.sfxGain.gain.value = 0.7;
      this.sfxGain.connect(this.masterGain);

      this.convolver = this.createReverb(3);
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
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    const conv = ctx.createConvolver();
    conv.buffer = buffer;
    return conv;
  }

  async transitionTo(state: EmotionalState, volume = 0.5): Promise<void> {
    if (!this.unlocked || !this.ctx || !this.droneGain) return;
    if (state === this.currentState) return;

    const now = this.ctx.currentTime;

    // Play whoosh for scene transitions
    this.playSfx('whoosh');

    // Fade out current
    this.droneGain.gain.cancelScheduledValues(now);
    this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, now);
    this.droneGain.gain.linearRampToValueAtTime(0, now + this.crossfadeDuration * 0.4);

    // Stop old oscillators after fade
    const oldOscs = [...this.activeOscillators];
    const oldFilter = this.activeFilter;
    setTimeout(() => {
      oldOscs.forEach((o) => { try { o.stop(); o.disconnect(); } catch {} });
      if (oldFilter) oldFilter.disconnect();
    }, this.crossfadeDuration * 400 + 100);

    this.activeOscillators = [];
    this.currentState = state;

    const config = DRONE_CONFIGS[state];

    // New filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = config.filterFreq;
    filter.Q.value = 1.5;
    filter.connect(this.droneGain);
    this.activeFilter = filter;

    // Reverb send
    const reverbSend = this.ctx.createGain();
    reverbSend.gain.value = 0.2;
    reverbSend.connect(this.convolver!);

    // Create oscillators
    config.frequencies.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      osc.type = config.waveforms[i] || 'sine';
      osc.frequency.value = freq;
      osc.detune.value = Math.sin(i * 1.7) * 8;

      const oscGain = this.ctx!.createGain();
      oscGain.gain.value = config.gainLevels[i] || 0.05;

      osc.connect(oscGain);
      oscGain.connect(filter);
      oscGain.connect(reverbSend);
      osc.start(now + this.crossfadeDuration * 0.3);
      this.activeOscillators.push(osc);
    });

    // Fade in new
    setTimeout(() => {
      if (!this.droneGain || !this.ctx) return;
      const t = this.ctx.currentTime;
      this.droneGain.gain.cancelScheduledValues(t);
      this.droneGain.gain.setValueAtTime(0, t);
      this.droneGain.gain.linearRampToValueAtTime(volume, t + this.crossfadeDuration * 0.6);
    }, this.crossfadeDuration * 300);
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

    // Also send to reverb for sparkle (except tick which should be dry)
    if (this.convolver && name !== 'tick') {
      const reverbSend = this.ctx.createGain();
      reverbSend.gain.value = 0.12;
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