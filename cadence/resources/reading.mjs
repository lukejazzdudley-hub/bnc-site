// Progressive enhancement: all content and navigation work without JavaScript.
const sections = [...document.querySelectorAll('.article-section, .field-note')];
const links = [...document.querySelectorAll('.article-rail nav a')];
if (sections.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const entry = entries.filter(item => item.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (!entry) return;
    for (const link of links) {
      if (link.getAttribute('href') === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }, {rootMargin: '-15% 0px -55% 0px', threshold: 0});
  sections.forEach(section => observer.observe(section));
}
