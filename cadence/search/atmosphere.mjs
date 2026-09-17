// One action-driven light field; no animation loop, query collection or tracking.
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const pointer = matchMedia('(pointer: fine)');
const layer = document.querySelector('.atmosphere');
let frame = 0;
function move(event) {
  if (!layer || motion.matches || !pointer.matches || frame) return;
  frame = requestAnimationFrame(() => {
    layer.style.setProperty('--light-x', `${Math.round(event.clientX / innerWidth * 100)}%`);
    layer.style.setProperty('--light-y', `${Math.round(event.clientY / innerHeight * 100)}%`);
    frame = 0;
  });
}
document.addEventListener('pointermove', move, { passive: true });
document.addEventListener('visibilitychange', () => {
  if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
});
