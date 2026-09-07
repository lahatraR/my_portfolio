const root = document.documentElement;
const modeButtons = document.querySelectorAll('[data-mode-button]');
const projects = document.querySelectorAll('[data-project-modes]');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav__menu');

const modeContent = {
  overview: {
    heroTitle: 'Software Engineer orienté données',
    heroLead: 'Je conçois des applications web et des flux de données fiables, de la modélisation PostgreSQL au déploiement automatisé.',
    primaryCta: 'Voir les projets',
    secondaryCta: 'Télécharger le CV',
    cv: 'CV_RAMANAMPAMONJY_Developpeur.pdf',
    skillPrimaryTitle: 'Software Engineering',
    skillPrimaryText: 'Applications web, APIs et livraison logicielle.',
    skillSecondaryTitle: 'Data Engineering',
    skillSecondaryText: 'Modèles fiables et traitements automatisés.'
  },
  software: {
    heroTitle: 'Software Engineer back-end / full-stack',
    heroLead: 'Je développe des applications web maintenables, de l’API Symfony à l’interface React, avec Docker et CI/CD.',
    primaryCta: 'Voir mes projets logiciels',
    secondaryCta: 'Télécharger le CV développeur',
    cv: 'CV_RAMANAMPAMONJY_Developpeur.pdf',
    skillPrimaryTitle: 'Software Engineering',
    skillPrimaryText: 'Une pratique orientée produit, API et mise en production.',
    skillSecondaryTitle: 'Fondations data',
    skillSecondaryText: 'Des bases solides pour des applications fiables.'
  },
  data: {
    heroTitle: 'Data Engineer en spécialisation',
    heroLead: 'Je construis des chaînes d’ingestion et des modèles relationnels qui rendent les données exploitables et maintenables.',
    primaryCta: 'Voir mes projets data',
    secondaryCta: 'Télécharger le CV data',
    cv: 'CV_RAMANAMPAMONJY_DataEngineer.pdf',
    skillPrimaryTitle: 'Data Engineering',
    skillPrimaryText: 'Ingestion, modélisation SQL et automatisation des traitements.',
    skillSecondaryTitle: 'Software Engineering',
    skillSecondaryText: 'Le socle applicatif nécessaire pour livrer ces flux.'
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