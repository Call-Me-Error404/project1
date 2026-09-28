/* ==========================================================================
   BRUH FREELANCING - BUTTER-SMOOTH 3D TILT ENGINE (REQUESTANIMATIONFRAME)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const tiltElements = document.querySelectorAll('[data-tilt]');
  const heroStage = document.querySelector('.hero-3d-stage');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ticking = false;

  // 1. Smooth 3D Tilt for Interactive Cards
  tiltElements.forEach(el => {
    const maxTilt = parseFloat(el.getAttribute('data-tilt-max') || '10');
    let isHovered = false;

    function onMouseMove(e) {
      if (!isHovered) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(1)}deg) rotateY(${rotateY.toFixed(1)}deg) translate3d(0, -2px, 0)`;
    }

    el.addEventListener('mouseenter', () => {
      isHovered = true;
    }, { passive: true });

    el.addEventListener('mousemove', onMouseMove, { passive: true });

    el.addEventListener('mouseleave', () => {
      isHovered = false;
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)';
    }, { passive: true });
  });

  // 2. Parallax mouse tracking for Hero 3D Stage (RAF batched)
  if (heroStage) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!ticking) {
        requestAnimationFrame(() => {
          const x = (mouseX - window.innerWidth / 2) / 40;
          const y = (mouseY - window.innerHeight / 2) / 40;
          heroStage.style.transform = `rotateY(${x.toFixed(1)}deg) rotateX(${(-y).toFixed(1)}deg)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // 3. Mobile Device Orientation (Gyroscope 3D Parallax)
  if (window.DeviceOrientationEvent && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    let gyroTicking = false;

    window.addEventListener('deviceorientation', (event) => {
      if (gyroTicking) return;
      gyroTicking = true;

      requestAnimationFrame(() => {
        const gamma = event.gamma;
        const beta = event.beta;

        if (gamma !== null && beta !== null && heroStage) {
          const clampedGamma = Math.max(-20, Math.min(20, gamma));
          const clampedBeta = Math.max(-20, Math.min(20, beta - 45));
          heroStage.style.transform = `rotateY(${(clampedGamma * 0.4).toFixed(1)}deg) rotateX(${(-clampedBeta * 0.3).toFixed(1)}deg)`;
        }
        gyroTicking = false;
      });
    }, { passive: true });
  }
});
