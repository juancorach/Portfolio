import Swiper from 'swiper/bundle';

export default class Carousel {
  constructor(element) {
    this.element = element;
    this.swiper = null;
    this.options = {
      slidesPerView: 1,
      pagination: {
        el: this.element.querySelector('.swiper-pagination'),
        clickable: true,
        type: 'bullets',
        renderBullet: function (index, className) {
          return '<span class="' + className + '"></span>';
        },
      },
      navigation: {
        nextEl: this.element.querySelector('.swiper-button-next'),
        prevEl: this.element.querySelector('.swiper-button-prev'),
      },
      centeredSlides: true,
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
    };

    this.init();
  }

  setOptions() {
    // Split (carousel 2)
    if ('split' in this.element.dataset) {
      this.options.breakpoints = {
        0: {
          slidesPerView: 1.1,
        },
        530: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 2.5,
        },
        1200: {
          slidesPerView: 3.5,
        },
      };
    }

    // Autoplay
    if ('autoplay' in this.element.dataset) {
      this.options.autoplay = {
        delay: 3000,
        pauseOnMouseEnter: true,
        disableOnInteraction: true,
      };
    }

    // Loop - avec configuration améliorée
    if ('loop' in this.element.dataset) {
      const slides = this.element.querySelectorAll('.swiper-slide');
      this.options.loop = true;
      this.options.loopAdditionalSlides = 2;

      // Désactiver loop si moins de 3 slides
      if (slides.length < 3) {
        this.options.loop = false;
      }
    }

    // Slides (carousel 2)
    if ('slides' in this.element.dataset) {
      this.options.slidesPerView =
        parseFloat(this.element.dataset.slides, 10) ||
        this.options.slidesPerView;
    }

    // Événements pour gérer l'autoplay et la pagination
    this.options.on = {
      init: (swiper) => {
        // Forcer la mise à jour de la pagination à l'initialisation
        if (swiper.pagination && swiper.pagination.render) {
          swiper.pagination.render();
          swiper.pagination.update();
        }
      },
      slideChange: (swiper) => {
        // Mettre à jour la pagination à chaque changement
        if (swiper.pagination && swiper.pagination.update) {
          swiper.pagination.update();
        }
      },
      slideChangeTransitionEnd: (swiper) => {
        // Double vérification après la transition
        if (swiper.pagination && swiper.pagination.update) {
          swiper.pagination.update();
        }
      },
      touchStart: (swiper) => {
        // Arrêter l'autoplay quand l'utilisateur touche/clique
        if (swiper.autoplay && swiper.autoplay.running) {
          swiper.autoplay.stop();
        }
      },
      click: (swiper) => {
        // Arrêter l'autoplay sur clic de navigation
        if (swiper.autoplay && swiper.autoplay.running) {
          swiper.autoplay.stop();
        }
      },
    };
  }

  init() {
    this.setOptions();
    this.swiper = new Swiper(this.element, this.options);

    // Forcer une mise à jour de la pagination après l'initialisation
    setTimeout(() => {
      if (this.swiper && this.swiper.pagination) {
        this.swiper.pagination.update();
      }
    }, 100);

    console.log('Initialisation de ma composante Carousel');
  }
}
