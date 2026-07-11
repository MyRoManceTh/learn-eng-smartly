// A single shared AudioContext, reused across every sound. Creating a fresh
// `new AudioContext()` per play (the previous behaviour) hit Chrome's hard cap
// on live contexts (~6) after a handful of quiz answers and then threw, so
// sound silently died for the rest of the session. One shared, resumed context
// avoids that entirely.
let sharedCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    if (!sharedCtx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      sharedCtx = new Ctor();
    }
    // Browsers start/suspend the context based on autoplay policy and tab state.
    if (sharedCtx.state === "suspended") void sharedCtx.resume();
    return sharedCtx;
  } catch {
    return null;
  }
}

export const playCorrect = () => {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    gain.gain.value = 0.3;
    osc.frequency.setValueAtTime(523, ctx.currentTime);
    osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
    osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch {}
};

export const playWrong = () => {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "square";
    gain.gain.value = 0.2;
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.setValueAtTime(200, ctx.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {}
};

export const playLevelUp = () => {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    // Ascending fanfare: C5→E5→G5→C6 (fast) then sustained C6 chord
    const notes = [523, 659, 784, 1047, 1319, 1568];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = i < 4 ? "sine" : "triangle";
      const t = ctx.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(i < 4 ? 0.25 : 0.15, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.01, t + (i < 4 ? 0.2 : 0.6));
      osc.frequency.value = freq;
      osc.start(t);
      osc.stop(t + (i < 4 ? 0.25 : 0.7));
    });
  } catch {}
};

export const playComplete = () => {
  try {
    const ctx = getCtx();
    if (!ctx) return;
    [523, 659, 784, 1047].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      gain.gain.value = 0.25;
      osc.frequency.value = freq;
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.2);
      osc.start(ctx.currentTime + i * 0.15);
      osc.stop(ctx.currentTime + i * 0.15 + 0.25);
    });
  } catch {}
};
