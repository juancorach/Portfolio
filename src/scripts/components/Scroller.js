import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother.js';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';

export default class Scroller {
  constructor(element) {
    gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
    this.options = {
      hasSkew: false,
      hasPinItems: false,
    };
    this.element = element;
    this.horizScrollTriggers = []; // Stocke les ScrollTriggers horizontaux

    this.setOptions();
    this.init();
    this.handleResize();
  }

  init() {
    const scroller = ScrollSmoother.create({
      smooth: 2,
      effects: true,
      smoothTouch: 0.1,
      onUpdate: this.onUpdateScroll.bind(this),
      onStop: this.onStopScroll.bind(this),
      ease: 'expo.out',
    });
  }

  onUpdateScroll(self) {
    if (this.options.hasSkew) this.updateSkew(self);
  }
  onStopScroll(self) {
    if (this.options.hasSkew) this.stopSkew(self);
  }

  // SKEW CONTROLS

  initSkew() {
    this.skewSetter = gsap.quickTo('img', 'skewY');
  }

  updateSkew(self) {
    const velocity = self.getVelocity();
    const force = 5;
    let skew = gsap.utils.mapRange(-1000, 1000, -force, force, velocity);
    skew = gsap.utils.clamp(-force, force, skew);

    this.skewSetter(skew);
  }

  stopSkew(self) {
    this.skewSetter(0);
  }

  // PIN CONTROLS

  initPins() {
    const pinnedItems = this.element.querySelectorAll('.js-pinned');
    for (let i = 0; i < pinnedItems.length; i++) {
      const pinnedItem = pinnedItems[i];

      ScrollTrigger.create({
        pin: pinnedItem,
        trigger: pinnedItem.parentElement,
        start: 'center center',
        end: '80% center',
        markers: true,
      });
    }
  }

  // SECTION HORIZONTAL

  initHoriz() {
    // Détruire les anciens ScrollTriggers
    this.killHorizScrollTriggers();

    // Désactiver sur mobile
    if (window.innerWidth <= 768) {
      return;
    }

    const sectionsHoriz = this.element.querySelectorAll('.js-horiz');

    sectionsHoriz.forEach((sectionHoriz) => {
      const panels = sectionHoriz.querySelectorAll('.js-panel');
      const nbPanels = panels.length - 1;
      const buffer = 200;

      const tween = gsap.to(panels, {
        xPercent: -100 * nbPanels,
        ease: 'none',
        scrollTrigger: {
          pin: true,
          trigger: sectionHoriz,
          scrub: 1,
          end: () => '+=' + (sectionHoriz.offsetWidth + buffer),
          markers: false,
        },
      });

      // Stocker le ScrollTrigger
      this.horizScrollTriggers.push(tween.scrollTrigger);
    });
  }

  killHorizScrollTriggers() {
    // Détruire tous les ScrollTriggers horizontaux
    this.horizScrollTriggers.forEach((st) => {
      if (st) st.kill();
    });
    this.horizScrollTriggers = [];

    // Réinitialiser la position des panels
    const sectionsHoriz = this.element.querySelectorAll('.js-horiz');
    sectionsHoriz.forEach((sectionHoriz) => {
      const panels = sectionHoriz.querySelectorAll('.js-panel');
      gsap.set(panels, { clearProps: 'all' });
    });
  }

  handleResize() {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.initHoriz();
        ScrollTrigger.refresh();
      }, 250);
    });
  }

  setOptions() {
    if ('skew' in this.element.dataset) {
      this.options.hasSkew = true;
      this.initSkew();
    }
    if ('pinItems' in this.element.dataset) {
      this.options.hasPinItems = true;
      this.initPins();
    }

    if (this.element.querySelector('.js-horiz')) {
      this.initHoriz();
    }
  }
}
