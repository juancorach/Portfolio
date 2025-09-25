import Swiper from 'swiper/bundle';

export default class Carousel {
  constructor(element) {
    this.element = element;
    this.options = {
      slidesPerView: 1,
      spaceBetween: 16,
      pagination: {
        el: this.element.querySelector('.swiper-pagination'),
      },
      navigation: {
        nextEl: this.element.querySelector('.swiper-button-next'),
        prevEl: this.element.querySelector('.swiper-button-prev'),
      },
      centeredSlides: true,
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

    //Autoplay (carousel 1)
    if ('autoplay' in this.element.dataset) {
      this.options.autoplay = {
        autoplay: {
          delay: 3000,
          pauseOnMouseEnter: true,
          enabled: false,
        },
      };
    }

    // Loop (carousel 2)
    if ('loop' in this.element.dataset) {
      this.options.loop = {
        loop: true,
      };
    }

    // Slides (carousel 2)
    if ('slides' in this.element.dataset) {
      this.options.slidesPerView =
        parseFloat(this.element.dataset.slides, 10) ||
        this.options.slidesPerView;
    }
  }

  init() {
    this.setOptions();
    new Swiper(this.element, this.options);
    console.log('Initialisation de ma composante Carousel');
  }
}
