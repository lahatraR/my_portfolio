const root = document.documentElement;
const modeButtons = document.querySelectorAll('[data-mode-button]');
const projects = document.querySelectorAll('[data-project-modes]');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav__menu');

const modeContent = {
  overview: {
    heroTitle: 'Software Engineer',
    heroLead: 'Je conçois et développe des applications web fiables, avec une attention particulière portée aux APIs, à la qualité du code et à la livraison.',
    primaryCta: 'Voir les projets',
    secondaryCta: 'Télécharger le CV',
    cv: 'CV_RAMANAMPAMONJY_Riantsoa_Fullstack_Alternance.pdf',
    skillPrimaryTitle: 'Software Engineering',
    skillPrimaryText: 'Applications web, APIs et livraison logicielle.',
    skillSecondaryTitle: 'Architecture & Cloud Native',
    skillSecondaryText: 'Des fondations cloud-native en cours d’approfondissement.'
  },
  software: {
    heroTitle: 'Software Engineer orienté produit',
    heroLead: 'Je développe des applications web maintenables, de l’API Symfony à l’interface React, avec Docker et CI/CD.',
    primaryCta: 'Voir mes projets logiciels',
    secondaryCta: 'Télécharger le CV',
    cv: 'CV_RAMANAMPAMONJY_Riantsoa_Fullstack_Alternance.pdf',
    skillPrimaryTitle: 'Software Engineering',
    skillPrimaryText: 'Une pratique orientée produit, API et mise en production.',
    skillSecondaryTitle: 'Qualité & delivery',
    skillSecondaryText: 'Docker, CI/CD, tests et pratiques Agile.'
  },
  architecture: {
    heroTitle: 'Software Engineer · Architecture Cloud',
    heroLead: 'Je construis mon expertise en architecture logicielle et cloud-native pour concevoir des services évolutifs, observables et faciles à livrer.',
    primaryCta: 'Voir les projets logiciels',
    secondaryCta: 'Télécharger le CV',
    cv: 'CV_RAMANAMPAMONJY_Riantsoa_Fullstack_Alternance.pdf',
    skillPrimaryTitle: 'Architecture logicielle',
    skillPrimaryText: 'Découpage des services, APIs et conception maintenable.',
    skillSecondaryTitle: 'Cloud Native',
    skillSecondaryText: 'Docker, CI/CD et fondamentaux des environnements cloud.'
  }
};

function setMode(mode, updateUrl = true) {
  const selectedMode = modeContent[mode] ? mode : 'overview';
  const content = modeContent[selectedMode];
  root.dataset.mode = selectedMode;

  if (updateUrl) {
    const url = new URL(window.location.href);
    if (selectedMode === 'overview') url.searchParams.delete('mode');
    else url.searchParams.set('mode', selectedMode);
    window.history.replaceState({}, '', url);
  }

  modeButtons.forEach(button => {
    const isActive = button.dataset.modeButton === selectedMode;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  document.querySelectorAll('[data-copy]').forEach(element => {
    const value = content[element.dataset.copy];
    if (value) element.textContent = value;
  });

  document.querySelectorAll('[data-cv-link]').forEach(link => {
    link.setAttribute('href', content.cv);
  });

  projects.forEach(project => {
    project.classList.toggle('is-hidden', !project.dataset.projectModes.split(' ').includes(selectedMode));
  });
}

modeButtons.forEach(button => {
  button.addEventListener('click', () => setMode(button.dataset.modeButton));
});

menuToggle?.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.querySelector('[aria-hidden]')?.replaceChildren(document.createTextNode(isOpen ? 'Fermer' : 'Menu'));
});

navMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.querySelector('[aria-hidden]')?.replaceChildren(document.createTextNode('Menu'));
  });
});

const requestedMode = new URLSearchParams(window.location.search).get('mode');
setMode(requestedMode || 'overview', false);