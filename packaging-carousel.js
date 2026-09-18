document.querySelectorAll('.packaging-carousel').forEach(carousel => {
  const track = carousel.querySelector('.packaging-track');
  const slides = Array.from(track.querySelectorAll('.packaging-slide'));
  const previous = carousel.querySelector('[data-previous]');
  const next = carousel.querySelector('[data-next]');
  const counter = carousel.querySelector('[data-counter]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  function update(index) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    previous.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    counter.textContent = `${current + 1} / ${slides.length}`;
  }
  function go(index) {
    if (!track.clientWidth) return;
    update(index);
    track.scrollTo({
      left: current * track.clientWidth,
      behavior: motion.matches ? 'instant' : 'smooth'
    });
  }
  previous.addEventListener('click', () => go(current - 1));
  next.addEventListener('click', () => go(current + 1));
  track.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const offsets = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: slides.length - 1 };
    if (!(event.key in offsets)) return;
    event.preventDefault();
    go(offsets[event.key]);
  });
  let scrollFrame;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = requestAnimationFrame(() => {
      if (track.clientWidth) update(Math.round(track.scrollLeft / track.clientWidth));
    });
  }, { passive: true });
  // Keep the selected image when rotating the phone or returning from a filter.
  new ResizeObserver(() => {
    if (track.clientWidth) track.scrollTo({ left: current * track.clientWidth, behavior: 'instant' });
  }).observe(track);
  previous.hidden = false;
  next.hidden = false;
  update(0);
});
