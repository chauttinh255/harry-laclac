class SoundManager {
  private audioCtx: AudioContext | null = null;
  public enabled = true;

  private init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.1) {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
    
    gain.gain.setValueAtTime(vol, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    
    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }

  playClick() {
    this.playTone(600, 'sine', 0.1, 0.05);
  }

  playSuccess() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;
    
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 0.4);
  }

  playError() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;
    
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.3);
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 0.3);
  }

  playComplete() {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;
    
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(440, now); // A4
    osc.frequency.setValueAtTime(554.37, now + 0.15); // C#5
    osc.frequency.setValueAtTime(659.25, now + 0.3); // E5
    osc.frequency.setValueAtTime(880, now + 0.45); // A5
    
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.8);
    
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 0.8);
  }
}

export const sounds = new SoundManager();
