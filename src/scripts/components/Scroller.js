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
    this.horizScrollTriggers = [];
    this.smoother = null;
    this.isMobile = this.checkIfMobile();

    this.setOptions();
    this.init();
    this.handleResize();
  }

  checkIfMobile() {
    return (
      window.innerWidth <= 1024 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
  }

  init() {
    if (this.isMobile) {
      console.log('Mobile détecté - ScrollSmoother désactivé');
      this.handleAnchors();
      return;
    }

    this.smoother = ScrollSmoother.create({
      smooth: 2,
      effects: true,
      smoothTouch: false,
      onUpdate: this.onUpdateScroll.bind(this),
      onStop: this.onStopScroll.bind(this),
      ease: 'expo.out',
    });

    this.handleAnchors();
  }

  onUpdateScroll(self) {
    if (this.options.hasSkew && !this.isMobile) this.updateSkew(self);
  }

  onStopScroll(self) {
    if (this.options.hasSkew && !this.isMobile) this.stopSkew(self);
  }

  // Skew controls

  initSkew() {
    if (!this.isMobile) {
      this.skewSetter = gsap.quickTo('img', 'skewY');
    }
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

  // Pin controls

  initPins() {
    const pinnedItems = this.element.querySelectorAll('.js-pinned');
    for (let i = 0; i < pinnedItems.length; i++) {
      const pinnedItem = pinnedItems[i];

      ScrollTrigger.create({
        pin: pinnedItem,
        trigger: pinnedItem.parentElement,
        start: 'center center',
        end: '80% center',
        markers: false,
      });
    }
  }

  // Section horizontal

  initHoriz() {
    this.killHorizScrollTriggers();

    if (window.innerWidth <= 1024) {
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

      this.horizScrollTriggers.push(tween.scrollTrigger);
    });
  }

  killHorizScrollTriggers() {
    this.horizScrollTriggers.forEach((st) => {
      if (st) st.kill();
    });
    this.horizScrollTriggers = [];

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
        const wasMobile = this.isMobile;
        this.isMobile = this.checkIfMobile();

        if (wasMobile !== this.isMobile) {
          if (this.smoother) {
            this.smoother.kill();
            this.smoother = null;
          }
          this.init();
        }

        this.initHoriz();
        ScrollTrigger.refresh();
      }, 250);
    });
  }

  handleAnchors() {
    const hash = window.location.hash;

    if (hash) {
      setTimeout(() => {
        const target = document.querySelector(hash);

        if (target) {
          if (this.smoother) {
            this.smoother.scrollTo(target, true, 'top top');
          } else {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 100);
    }

    document.querySelectorAll('a[href*="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');

        if (href.includes('#') && !href.includes('.html#')) {
          e.preventDefault();
          const targetId = href.split('#')[1];
          const target = document.getElementById(targetId);

          if (target) {
            if (this.smoother) {
              this.smoother.scrollTo(target, true, 'top top');
            } else {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        }
      });
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
