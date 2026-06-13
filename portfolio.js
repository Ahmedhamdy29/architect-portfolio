/**
 * Portfolio JavaScript
 * Project filtering and lightbox modal
 */

(function () {
  'use strict';

  const filterBar = document.getElementById('filterBar');
  const portfolioGrid = document.getElementById('portfolioGrid');
  const portfolioEmpty = document.getElementById('portfolioEmpty');
  const lightbox = document.getElementById('lightbox');

  if (!portfolioGrid || !lightbox) return;

  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxYear = document.getElementById('lightboxYear');
  const lightboxLocation = document.getElementById('lightboxLocation');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  const projects = [
    {
      title: 'Aurora Residence',
      category: 'Residential',
      categoryKey: 'residential',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
      description: 'A contemporary hillside residence featuring floor-to-ceiling glazing, cantilevered terraces, and a seamless indoor-outdoor living experience. The design prioritizes natural light and panoramic views while integrating sustainable passive cooling strategies.',
      year: 'Year: 2024',
      location: 'Location: Mykonos, Greece'
    },
    {
      title: 'Meridian Tower',
      category: 'Commercial',
      categoryKey: 'commercial',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
      description: 'A 24-story corporate headquarters with a distinctive diagrid facade system. The tower features flexible open-plan offices, a sky garden atrium, and LEED Platinum certification for energy efficiency and environmental performance.',
      year: 'Year: 2023',
      location: 'Location: London, UK'
    },
    {
      title: 'Serenity Loft',
      category: 'Interior',
      categoryKey: 'interior',
      description: 'An urban loft transformation combining raw industrial elements with refined contemporary furnishings. Custom millwork, curated art installations, and a monochromatic palette create a serene sanctuary in the city center.',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
      year: 'Year: 2024',
      location: 'Location: Athens, Greece'
    },
    {
      title: 'Zen Garden Pavilion',
      category: 'Landscape',
      categoryKey: 'landscape',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80',
      description: 'A meditative garden pavilion set within a Japanese-inspired landscape. Features include a reflecting pool, stone pathways, native plantings, and a timber structure that frames views of the surrounding natural terrain.',
      year: 'Year: 2023',
      location: 'Location: Kyoto, Japan'
    },
    {
      title: 'Cliffside Villa',
      category: 'Residential',
      categoryKey: 'residential',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
      description: 'Perched on a dramatic coastal cliff, this villa employs a series of stacked volumes that follow the natural topography. Infinity pool, private spa, and locally sourced stone cladding blend the structure into its rugged environment.',
      year: 'Year: 2022',
      location: 'Location: Santorini, Greece'
    },
    {
      title: 'Nexus Innovation Hub',
      category: 'Commercial',
      categoryKey: 'commercial',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
      description: 'A collaborative workspace campus designed for a technology company. Open innovation labs, maker spaces, and biophilic design elements foster creativity while achieving net-zero energy consumption through solar integration.',
      year: 'Year: 2022',
      location: 'Location: Berlin, Germany'
    },
    {
      title: 'Atelier Studio',
      category: 'Interior',
      categoryKey: 'interior',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80',
      description: 'A dual-purpose live-work studio for a ceramic artist. The open floor plan features a dedicated workshop with kiln ventilation, gallery display walls, and a loft sleeping area suspended above the creative workspace.',
      year: 'Year: 2023',
      location: 'Location: Florence, Italy'
    },
    {
      title: 'Mediterranean Terrace',
      category: 'Landscape',
      categoryKey: 'landscape',
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80',
      description: 'A terraced outdoor living space cascading down a hillside property. Olive groves, lavender borders, an outdoor kitchen, and a shaded pergola dining area celebrate the Mediterranean climate and lifestyle.',
      year: 'Year: 2024',
      location: 'Location: Provence, France'
    },
    {
      title: 'Horizon House',
      category: 'Residential',
      categoryKey: 'residential',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80',
      description: 'A minimalist single-story dwelling with a flat roof and expansive horizontal windows. The linear plan organizes public and private zones along a central courtyard, maximizing cross-ventilation and garden views.',
      year: 'Year: 2021',
      location: 'Location: Costa Brava, Spain'
    }
  ];

  let currentIndex = 0;
  let activeFilter = 'all';
  let visibleProjects = [];

  /* ------------------------------------------
     Filter functionality
     ------------------------------------------ */
  function getVisibleCards() {
    return Array.from(portfolioGrid.querySelectorAll('.portfolio-card')).filter(function (card) {
      return !card.classList.contains('hidden');
    });
  }

  function updateVisibleProjects() {
    visibleProjects = projects.filter(function (project) {
      return activeFilter === 'all' || project.categoryKey === activeFilter;
    });
  }

  function filterProjects(filter) {
    activeFilter = filter;
    const cards = portfolioGrid.querySelectorAll('.portfolio-card');
    let visibleCount = 0;

    cards.forEach(function (card) {
      const category = card.getAttribute('data-category');
      const show = filter === 'all' || category === filter;

      if (show) {
        card.classList.remove('hidden');
        card.style.animation = 'none';
        card.offsetHeight;
        card.style.animation = '';
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    if (portfolioEmpty) {
      portfolioEmpty.hidden = visibleCount > 0;
    }

    updateVisibleProjects();
  }

  function initFilters() {
    if (!filterBar) return;

    const filterBtns = filterBar.querySelectorAll('.filter-btn');

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        filterProjects(btn.getAttribute('data-filter'));
      });
    });

    updateVisibleProjects();
  }

  /* ------------------------------------------
     Lightbox functionality
     ------------------------------------------ */
  function openLightbox(index) {
    const project = projects[index];
    if (!project) return;

    currentIndex = index;

    lightboxImage.src = project.image;
    lightboxImage.alt = project.title;
    lightboxCategory.textContent = project.category;
    lightboxTitle.textContent = project.title;
    lightboxDesc.textContent = project.description;
    lightboxYear.textContent = project.year;
    lightboxLocation.textContent = project.location;

    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');

    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    lightboxImage.src = '';
  }

  function getFilteredIndex(direction) {
    const currentProject = projects[currentIndex];
    const filtered = projects
      .map(function (p, i) { return { project: p, index: i }; })
      .filter(function (item) {
        return activeFilter === 'all' || item.project.categoryKey === activeFilter;
      });

    const currentPos = filtered.findIndex(function (item) {
      return item.index === currentIndex;
    });

    let newPos = currentPos + direction;
    if (newPos < 0) newPos = filtered.length - 1;
    if (newPos >= filtered.length) newPos = 0;

    return filtered[newPos].index;
  }

  function navigateLightbox(direction) {
    const newIndex = getFilteredIndex(direction);
    openLightbox(newIndex);
  }

  function initLightbox() {
    const triggers = portfolioGrid.querySelectorAll('.portfolio-card__trigger');

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        const index = parseInt(trigger.getAttribute('data-index'), 10);
        openLightbox(index);
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxBackdrop.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', function () { navigateLightbox(-1); });
    lightboxNext.addEventListener('click', function () { navigateLightbox(1); });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('active')) return;

      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigateLightbox(-1);
          break;
        case 'ArrowRight':
          navigateLightbox(1);
          break;
      }
    });

    lightboxImage.addEventListener('load', function () {
      lightboxImage.style.opacity = '1';
    });
  }

  /* ------------------------------------------
     Initialize
     ------------------------------------------ */
  function init() {
    initFilters();
    initLightbox();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
