/* ==========================================================================
   BRUH FREELANCING - ULTRA-SMOOTH CUSTOM CURSOR (HARDWARE ACCELERATED)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Only enable on non-touch desktop devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  document.body.appendChild(dot);

  const follower = document.createElement('div');
  follower.className = 'cursor-follower';
  document.body.appendChild(follower);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Direct GPU translate for immediate pinpoint response
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate3d(-50%, -50%, 0)`;

    if (!isMoving) {
      isMoving = true;
      requestAnimationFrame(render);
    }
  }, { passive: true });

  // Smooth lerp follower loop running in sync with screen refresh rate
  function render() {
    const ease = 0.22;
    followerX += (mouseX - followerX) * ease;
    followerY += (mouseY - followerY) * ease;

    follower.style.transform = `translate3d(${followerX.toFixed(2)}px, ${followerY.toFixed(2)}px, 0) translate3d(-50%, -50%, 0)`;

    const dx = Math.abs(mouseX - followerX);
    const dy = Math.abs(mouseY - followerY);

    if (dx > 0.1 || dy > 0.1) {
      requestAnimationFrame(render);
    } else {
      isMoving = false;
    }
  }

  // Hover states over interactive elements
  const interactiveTargets = 'a, button, input, textarea, select, .service-card, .founder-card, [data-tilt]';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveTargets)) {
      follower.classList.add('hovered');
      dot.style.opacity = '0.5';
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveTargets)) {
      follower.classList.remove('hovered');
      dot.style.opacity = '1';
    }
  }, { passive: true });
});
