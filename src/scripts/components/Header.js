export default class Header {
  constructor(element) {
    this.element = element;
    this.options = {
      threshold: 0.1,
      alwaysShow: false,
    };
    this.scrollPosition = 0;
    this.lastScrollPosition = 0;
    this.html = document.documentElement;

    this.init();
    this.initNavMobile();
  }

  init() {
    this.setOptions();

    if (!this.options.alwaysShow) {
      window.addEventListener('scroll', this.onScroll.bind(this));
    }
  }

  setOptions() {
    if ('threshold' in this.element.dataset) {
      this.options.threshold =
        parseFloat(this.element.dataset.threshold, 10) ||
        this.options.threshold;
    }

    if ('alwaysShow' in this.element.dataset) {
      this.options.alwaysShow = true;
    }
  }

  onScroll() {
    this.lastScrollPosition = this.scrollPosition;
    this.scrollPosition = document.scrollingElement.scrollTop;

    this.setHeaderState();
    this.setDirections();
  }

  setHeaderState() {
    if (
      this.scrollPosition >
      document.scrollingElement.scrollHeight * this.options.threshold
    ) {
      this.html.classList.add('header-is-hidden');
    } else {
      this.html.classList.remove('header-is-hidden');
    }
  }

  setDirections() {
    if (this.scrollPosition >= this.lastScrollPosition) {
      this.html.classList.add('is-scrolling-down');
      this.html.classList.remove('is-scrolling-up');
    } else {
      this.html.classList.remove('is-scrolling-down');
      this.html.classList.add('is-scrolling-up');
    }
  }

  initNavMobile() {
    const toggle = this.element.querySelector('.js-toggle');
    toggle.addEventListener('click', this.onToggleNav.bind(this));

    const navLinks = this.element.querySelectorAll('.nav-primary__item');
    navLinks.forEach((link) => {
      link.addEventListener('click', this.closeNav.bind(this));
    });
  }

  onToggleNav() {
    this.html.classList.toggle('nav-is-active');
  }

  closeNav() {
    this.html.classList.remove('nav-is-active');
  }
}
