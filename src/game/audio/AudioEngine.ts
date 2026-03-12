import type { EmotionalState } from '../types';

interface DroneConfig {
  frequencies: number[];
  waveforms: OscillatorType[];
  gainLevels: number[];
  filterFreq: number;
  reverbDecay: number;
  arpeggio?: number[];
  arpeggioSpeed?: number;
  /** Secondary melody pattern for richer soundtrack */
  melody?: number[];
  melodySpeed?: number;
  melodyGain?: number;
}

const DRONE_CONFIGS: Record<EmotionalState, DroneConfig> = {
  dormant: {
    frequencies: [55, 82.41, 110, 165],
    waveforms: ['sine', 'triangle', 'sine', 'sine'],
    gainLevels: [0.35, 0.25, 0.18, 0.12],
    filterFreq: 900,
    reverbDecay: 5,
    melody: [0, 3, 7, 3, 0, -2, 0, 3],
    melodySpeed: 1.2,
    melodyGain: 0.12,
  },
  wonder: {
    frequencies: [130.81, 196, 261.63, 329.63, 392],
    waveforms: ['sine', 'triangle', 'sine', 'sine', 'sine'],
    gainLevels: [0.35, 0.26, 0.20, 0.16, 0.12],
    filterFreq: 2800,
    reverbDecay: 4,
    arpeggio: [0, 7, 12, 16, 19, 24, 19, 16],
    arpeggioSpeed: 0.45,
    melody: [0, 4, 7, 12, 11, 7, 4, 0],
    melodySpeed: 0.9,
    melodyGain: 0.18,
  },
  preparation: {
    frequencies: [110, 164.81, 220, 277.18, 330],
    waveforms: ['sine', 'triangle', 'sine', 'sine', 'sine'],
    gainLevels: [0.32, 0.24, 0.18, 0.14, 0.10],
    filterFreq: 2400,
    reverbDecay: 3,
    arpeggio: [0, 3, 7, 12, 15, 12, 7, 3],
    arpeggioSpeed: 0.35,
    melody: [0, 5, 7, 12, 10, 7, 5, 3],
    melodySpeed: 0.7,
    melodyGain: 0.15,
  },
  restoration: {
    frequencies: [146.83, 220, 293.66, 369.99, 440],
    waveforms: ['sine', 'triangle', 'sine', 'sine', 'sine'],
    gainLevels: [0.35, 0.26, 0.20, 0.15, 0.11],
    filterFreq: 3200,
    reverbDecay: 3.5,
    arpeggio: [0, 4, 7, 11, 12, 16, 12, 11],
    arpeggioSpeed: 0.3,
    melody: [0, 4, 7, 12, 16, 12, 7, 4],
    melodySpeed: 0.6,
    melodyGain: 0.16,
  },
  triumph: {
    frequencies: [196, 261.63, 329.63, 392, 523.25],
    waveforms: ['sine', 'triangle', 'sine', 'sine', 'sine'],
    gainLevels: [0.38, 0.28, 0.22, 0.16, 0.12],
    filterFreq: 4000,
    reverbDecay: 4,
    arpeggio: [0, 4, 7, 12, 16, 19, 24, 19],
    arpeggioSpeed: 0.25,
    melody: [0, 7, 12, 16, 19, 24, 19, 16, 12, 7],
    melodySpeed: 0.5,
    melodyGain: 0.20,
  },
};

const SFX_DEFINITIONS = {
  tick: { freq: 2400, duration: 0.02, type: 'sine' as OscillatorType, ramp: 1800, gain: 0.08 },
  select: { freq: 660, duration: 0.12, type: 'sine' as OscillatorType, ramp: 880, gain: 0.30 },
  confirm: { freq: 523.25, duration: 0.25, type: 'sine' as OscillatorType, ramp: 783.99, gain: 0.35 },
  apply: { freq: 440, duration: 0.25, type: 'sine' as OscillatorType, ramp: 660, gain: 0.30 },
  success: { freq: 523.25, duration: 0.5, type: 'sine' as OscillatorType, ramp: 1046.5, gain: 0.35 },
  combo: { freq: 659.25, duration: 0.25, type: 'sine' as OscillatorType, ramp: 987.77, gain: 0.30 },
  error: { freq: 220, duration: 0.18, type: 'sine' as OscillatorType, ramp: 165, gain: 0.25 },
  triumph: { freq: 392, duration: 0.8, type: 'sine' as OscillatorType, ramp: 783.99, gain: 0.40 },
  whoosh: { freq: 400, duration: 0.3, type: 'sine' as OscillatorType, ramp: 80, gain: 0.18 },
  sparkle: { freq: 1800, duration: 0.15, type: 'sine' as OscillatorType, ramp: 3200, gain: 0.15 },
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
  private _masterVolume = 1.0;
  private unlocked = false;
  private arpeggioTimers: number[] = [];
  private compressor: DynamicsCompressorNode | null = null;

  async unlock(): Promise<void> {
    if (this.unlocked) return;
    try {
      this.ctx = new AudioContext();

      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.value = -6;
      this.compressor.knee.value = 6;
      this.compressor.ratio.value = 6;
      this.compressor.attack.value = 0.002;
      this.compressor.release.value = 0.15;
      this.compressor.connect(this.ctx.destination);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this._masterVolume;
      this.masterGain.connect(this.compressor);

      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.value = 0;
      this.droneGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.85;
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
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay * 1.2);
      }
    }
    const conv = ctx.createConvolver();
    conv.buffer = buffer;
    return conv;
  }

  private startArpeggio(
    rootFreq: number,
    intervals: number[],
    speed: number,
    filter: BiquadFilterNode,
    gain: number = 0.10,
  ): void {
    if (!this.ctx) return;
    let step = 0;
    const play = () => {
      if (!this.ctx || !this.droneGain) return;
      const now = this.ctx.currentTime;
      const interval = intervals[step % intervals.length];
      const freq = rootFreq * Math.pow(2, interval / 12);

      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const env = this.ctx.createGain();
      const noteLength = speed * 0.85;
      env.gain.setValueAtTime(0, now);
      env.gain.linearRampToValueAtTime(gain, now + 0.04);
      env.gain.setValueAtTime(gain, now + noteLength * 0.6);
      env.gain.exponentialRampToValueAtTime(0.001, now + noteLength);

      osc.connect(env);
      env.connect(filter);

      if (this.convolver) {
        const reverbSend = this.ctx.createGain();
        reverbSend.gain.value = 0.5;
        env.connect(reverbSend);
        reverbSend.connect(this.convolver);
      }

      osc.start(now);
      osc.stop(now + noteLength + 0.1);

      step++;
    };

    play();
    const timerId = window.setInterval(play, speed * 1000);
    this.arpeggioTimers.push(timerId);
  }

  /**
   * Start a secondary melody line — octave higher, triangle wave for contrast
   */
  private startMelody(
    rootFreq: number,
    intervals: number[],
    speed: number,
    filter: BiquadFilterNode,
    gain: number = 0.08,
  ): void {
    if (!this.ctx) return;
    let step = 0;
    const melodyRoot = rootFreq * 2; // One octave up

    const play = () => {
      if (!this.ctx || !this.droneGain) return;
      const now = this.ctx.currentTime;
      const interval = intervals[step % intervals.length];
      const freq = melodyRoot * Math.pow(2, interval / 12);

      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;

      const env = this.ctx.createGain();
      const noteLength = speed * 0.75;
      env.gain.setValueAtTime(0, now);
      env.gain.linearRampToValueAtTime(gain, now + 0.06);
      env.gain.setValueAtTime(gain * 0.8, now + noteLength * 0.5);
      env.gain.exponentialRampToValueAtTime(0.001, now + noteLength);

      osc.connect(env);
      env.connect(filter);

      if (this.convolver) {
        const rs = this.ctx.createGain();
        rs.gain.value = 0.6;
        env.connect(rs);
        rs.connect(this.convolver);
      }

      osc.start(now);
      osc.stop(now + noteLength + 0.15);

      step++;
    };

    // Offset melody start slightly for rhythmic interest
    setTimeout(() => {
      play();
      const timerId = window.setInterval(play, speed * 1000);
      this.arpeggioTimers.push(timerId);
    }, speed * 500);
  }

  async transitionTo(state: EmotionalState, volume = 0.8): Promise<void> {
    if (!this.unlocked || !this.ctx || !this.droneGain) return;
    if (state === this.currentState) return;

    const now = this.ctx.currentTime;

    this.playSfx('whoosh');

    this.arpeggioTimers.forEach(t => clearInterval(t));
    this.arpeggioTimers = [];

    this.droneGain.gain.cancelScheduledValues(now);
    this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, now);
    this.droneGain.gain.linearRampToValueAtTime(0, now + this.crossfadeDuration * 0.4);

    const oldOscs = [...this.activeOscillators];
    const oldFilter = this.activeFilter;
    setTimeout(() => {
      oldOscs.forEach((o) => { try { o.stop(); o.disconnect(); } catch {} });
      if (oldFilter) oldFilter.disconnect();
    }, this.crossfadeDuration * 400 + 200);

    this.activeOscillators = [];
    this.currentState = state;

    const config = DRONE_CONFIGS[state];

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = config.filterFreq;
    filter.Q.value = 1.5;
    filter.connect(this.droneGain);
    this.activeFilter = filter;

    const reverbSend = this.ctx.createGain();
    reverbSend.gain.value = 0.35;
    reverbSend.connect(this.convolver!);

    config.frequencies.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      osc.type = config.waveforms[i] || 'sine';
      osc.frequency.value = freq;
      osc.detune.value = Math.sin(i * 2.1) * 10;

      const oscGain = this.ctx!.createGain();
      oscGain.gain.value = config.gainLevels[i] || 0.10;

      osc.connect(oscGain);
      oscGain.connect(filter);
      oscGain.connect(reverbSend);
      osc.start(now + this.crossfadeDuration * 0.35);
      this.activeOscillators.push(osc);

      // Vibrato on first two oscillators
      if (i < 2) {
        const lfo = this.ctx!.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.2 + Math.random() * 0.5;
        const lfoGain = this.ctx!.createGain();
        lfoGain.gain.value = 4;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.detune);
        lfo.start(now);
        this.activeOscillators.push(lfo);
      }
    });

    // Fade in louder
    setTimeout(() => {
      if (!this.droneGain || !this.ctx) return;
      const t = this.ctx.currentTime;
      this.droneGain.gain.cancelScheduledValues(t);
      this.droneGain.gain.setValueAtTime(0, t);
      this.droneGain.gain.linearRampToValueAtTime(volume, t + this.crossfadeDuration * 0.6);
    }, this.crossfadeDuration * 350);

    // Start arpeggio
    if (config.arpeggio && config.arpeggioSpeed) {
      setTimeout(() => {
        if (this.currentState !== state) return;
        this.startArpeggio(
          config.frequencies[0],
          config.arpeggio!,
          config.arpeggioSpeed!,
          filter,
          0.12,
        );
      }, this.crossfadeDuration * 500);
    }

    // Start melody line for musical richness
    if (config.melody && config.melodySpeed) {
      setTimeout(() => {
        if (this.currentState !== state) return;
        this.startMelody(
          config.frequencies[0],
          config.melody!,
          config.melodySpeed!,
          filter,
          config.melodyGain || 0.08,
        );
      }, this.crossfadeDuration * 800);
    }
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

    if (this.convolver && name !== 'tick') {
      const reverbSend = this.ctx.createGain();
      reverbSend.gain.value = 0.25;
      env.connect(reverbSend);
      reverbSend.connect(this.convolver);
    }

    if (name === 'confirm') {
      this.playChord([523.25, 659.25, 783.99], 0.28, 0.15);
    } else if (name === 'triumph') {
      this.playChord([392, 493.88, 587.33, 783.99, 1046.5], 0.9, 0.18);
    } else if (name === 'success') {
      this.playChord([523.25, 659.25, 783.99, 1046.5], 0.55, 0.15);
    }

    osc.start(now);
    osc.stop(now + def.duration + 0.05);
  }

  private playChord(freqs: number[], duration: number, gain: number): void {
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    freqs.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;

      const env = this.ctx!.createGain();
      env.gain.setValueAtTime(0, now + i * 0.035);
      env.gain.linearRampToValueAtTime(gain, now + i * 0.035 + 0.025);
      env.gain.setValueAtTime(gain, now + duration * 0.7);
      env.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(env);
      env.connect(this.sfxGain!);

      if (this.convolver) {
        const rs = this.ctx!.createGain();
        rs.gain.value = 0.3;
        env.connect(rs);
        rs.connect(this.convolver!);
      }

      osc.start(now + i * 0.035);
      osc.stop(now + duration + 0.1);
    });
  }

  setMasterVolume(v: number): void {
    this._masterVolume = v;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(v, this.ctx.currentTime);
    }
  }

  stopAll(): void {
    if (!this.ctx || !this.droneGain) return;
    this.arpeggioTimers.forEach(t => clearInterval(t));
    this.arpeggioTimers = [];
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

let _instance: AudioEngine | null = null;
export function getAudioEngine(): AudioEngine {
  if (!_instance) _instance = new AudioEngine();
  return _instance;
}
