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

    // Loop
    if ('loop' in this.element.dataset) {
      const slides = this.element.querySelectorAll('.swiper-slide');
      this.options.loop = true;
      this.options.loopAdditionalSlides = 2;

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

    this.options.on = {
      init: (swiper) => {
        if (swiper.pagination && swiper.pagination.render) {
          swiper.pagination.render();
          swiper.pagination.update();
        }
      },
      slideChange: (swiper) => {
        if (swiper.pagination && swiper.pagination.update) {
          swiper.pagination.update();
        }
      },
      slideChangeTransitionEnd: (swiper) => {
        if (swiper.pagination && swiper.pagination.update) {
          swiper.pagination.update();
        }
      },
      touchStart: (swiper) => {
        if (swiper.autoplay && swiper.autoplay.running) {
          swiper.autoplay.stop();
        }
      },
      click: (swiper) => {
        if (swiper.autoplay && swiper.autoplay.running) {
          swiper.autoplay.stop();
        }
      },
    };
  }

  init() {
    this.setOptions();
    this.swiper = new Swiper(this.element, this.options);

    setTimeout(() => {
      if (this.swiper && this.swiper.pagination) {
        this.swiper.pagination.update();
      }
    }, 100);
  }
}
