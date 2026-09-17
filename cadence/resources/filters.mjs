const filterLinks = [...document.querySelectorAll('[data-resource-filter]')];
const topics = [...document.querySelectorAll('[data-resource-topic]')];
const status = document.querySelector('[data-resource-status]');
const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

if (filterLinks.length > 0 && topics.length > 0) {
  document.documentElement.dataset.resourceFilters = 'ready';

  const selectFilter = (filter) => {
    const showAll = filter === 'all';
    let visibleCount = 0;

    for (const topic of topics) {
      const visible = showAll || topic.dataset.resourceTopic === filter;
      topic.hidden = !visible;
      if (visible) visibleCount += topic.querySelectorAll('[data-resource-card]').length;
    }

    for (const link of filterLinks) {
      if (link.dataset.resourceFilter === filter) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }

    if (status) {
      status.textContent = showAll
        ? `Showing all ${visibleCount} new resources.`
        : `Showing ${visibleCount} resources for ${filter}.`;
    }

  };

  for (const link of filterLinks) {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const filter = link.dataset.resourceFilter;
      selectFilter(filter);
      history.replaceState(null, '', link.getAttribute('href'));
      document.querySelector('#resource-list')?.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  }

  const hashLink = filterLinks.find((link) => link.getAttribute('href') === window.location.hash);
  if (hashLink) selectFilter(hashLink.dataset.resourceFilter);
}
