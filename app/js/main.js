// Imports
import '../scss/main.scss';

// Global Variables
const headerNav = document.querySelector('[data-js="header-nav"]');

// Event Listeners
headerNav.addEventListener('click', filterHeaderNavClick);

// Helper Functions
function filterHeaderNavClick({ target, currentTarget }) {
  const timer = 200;

  switch (target.dataset.js) {
    case 'nav-toggle':
      if (verifyDropdownStatus(isMediumScreen())) {
        return setTimeout(toggleHeaderNav, timer, target, currentTarget);
      }
      return toggleHeaderNav(target, currentTarget);
    case 'dropdown-toggle':
      if (verifyHeaderNavStatus()) {
        return setTimeout(toggleDropdown, timer, target);
      }
      return toggleDropdown(target);
  }
}

function closing(element) {
  element.classList.add('closing');
  element.addEventListener(
    'animationend',
    () => {
      const isSmallDevice = document.documentElement.offsetWidth < 768;
      element.classList.remove('closing');

      if (element === headerNav && isSmallDevice) {
        verifyDropdownStatus(isSmallDevice);
      }
    },
    { once: true }
  );
}

function isActive(element) {
  return element?.classList.contains('active');
}

function isMediumScreen() {
  const { offsetWidth } = document.documentElement;
  return offsetWidth >= 768 && offsetWidth < 1024;
}

// Header Navigation Functions
function toggleHeaderNav(toggle, nav) {
  const active = nav.classList.contains('active');

  nav.classList.toggle('active');
  active && closing(nav);
  toggle.setAttribute('aria-pressed', !active);
  toggle.setAttribute('aria-expanded', !active);
}

function verifyHeaderNavStatus() {
  if (!isMediumScreen() || !isActive(headerNav)) return;

  const navToggle = headerNav.querySelector('[data-js="nav-toggle"]');
  toggleHeaderNav(navToggle, headerNav);
  return true;
}

// Dropdown Functions
function toggleDropdown(toggle) {
  const currentDropdown = toggle.closest('[data-js="dropdown"]');
  const previousDropdown = document.querySelector('[data-js="dropdown"].active');
  const active = currentDropdown.classList.contains('active');

  if (active) {
    closing(currentDropdown);
    return configureDropdown(toggle, currentDropdown, !active, 0);
  }

  if (previousDropdown) {
    const previousToggle = previousDropdown.querySelector('[data-js="dropdown-toggle"]');

    closing(previousDropdown);
    configureDropdown(previousToggle, previousDropdown, active, 0);

    if (document.documentElement.offsetWidth >= 768) {
      return setTimeout(configureDropdown, 200, toggle, currentDropdown, !active);
    }
  }

  configureDropdown(toggle, currentDropdown, !active);
}

function configureDropdown(toggle, dropdown, active, height) {
  const dropdownWrapper = dropdown.querySelector('[data-js="dropdown-wrapper"]');
  const dropdownList = dropdown.querySelector('[data-js="dropdown-list"]');
  const marginBS = parseInt(getComputedStyle(dropdownList).marginBlockStart);
  height = height ?? dropdownList.offsetHeight + marginBS;

  dropdown.classList.toggle('active');
  dropdownWrapper.style.height = `${height}px`;
  toggle.setAttribute('aria-pressed', active);
  toggle.setAttribute('aria-expanded', active);
}

function verifyDropdownStatus(isValidScreen) {
  if (!isValidScreen) return;

  const currentDropdown = document.querySelector('[data-js="dropdown"].active');

  if (!isActive(currentDropdown)) return;

  const dropdownToggle = currentDropdown.querySelector('[data-js="dropdown-toggle"]');
  toggleDropdown(dropdownToggle);
  return true;
}
