// AudioHaptics.js: Handles Web Audio API synthesis for confirm/dismiss sounds
export function playConfirmSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  // Sub-bass 60Hz tone for 0.18s
  const sub = ctx.createOscillator();
  sub.type = 'sine';
  sub.frequency.value = 60;
  const gain = ctx.createGain();
  gain.gain.value = 0.25;
  sub.connect(gain).connect(ctx.destination);
  sub.start();
  sub.stop(ctx.currentTime + 0.18);

  // 2kHz click (short burst)
  const click = ctx.createOscillator();
  click.type = 'square';
  click.frequency.value = 2000;
  const clickGain = ctx.createGain();
  clickGain.gain.value = 0.4;
  click.connect(clickGain).connect(ctx.destination);
  click.start(ctx.currentTime + 0.18);
  click.stop(ctx.currentTime + 0.2);

  setTimeout(() => ctx.close(), 220);
}

export function playDismissSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  // 120Hz thud (with fast decay)
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.value = 120;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.4, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.2);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.22);

  setTimeout(() => ctx.close(), 250);
}
