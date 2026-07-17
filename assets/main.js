document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof SplitText === 'undefined') return;

  gsap.registerPlugin(SplitText);
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  /* Entrance animation — cans stagger in from each side one by one,
     logo pops in centered, replayed on every slide change */

  function animateSlideIn(slideEl) {
    if (!slideEl) return;

    const leftCans = slideEl.querySelectorAll('.hero-cans-left .hero-can');
    const rightCans = slideEl.querySelectorAll('.hero-cans-right .hero-can');
    const logo = slideEl.querySelector('.hero-logo-img');

    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from(leftCans, { opacity: 0, x: 40, duration: 0.5, stagger: 0.15 })
      .from(rightCans, { opacity: 0, x: 40, duration: 0.5, stagger: 0.15 }, '<')
      .fromTo(logo,
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' },
        '-=0.45'
      )
      .from('.hero-dots .dot', {
        opacity: 0,
        scale: 0,
        duration: 0.3,
        stagger: 0.06
      }, '-=0.3');
  }

  const heroSwiperEl = document.querySelector('.hero-swiper');

  if (heroSwiperEl && typeof Swiper !== 'undefined') {
    gsap.from('.hero-frame', { opacity: 0, scale: 0.98, duration: 0.4, ease: 'power2.out' });

    new Swiper(heroSwiperEl, {
      // direction: 'vertical',
      effect: 'fade',
      fadeEffect: { crossFade: true },
      loop: false,
      speed: 600,
      pagination: {
        el: '.hero-dots',
        clickable: true,
        bulletClass: 'dot',
        bulletActiveClass: 'is-active'
      },
      on: {
        init(swiper) {
          animateSlideIn(swiper.slides[swiper.activeIndex]);
        },
        slideChangeTransitionStart(swiper) {
          animateSlideIn(swiper.slides[swiper.activeIndex]);
        }
      }
    });
  }

  /* Pour section — sticky pinned background, staged scroll reveal:
     scroll stage 1 brings the heading + underline in, scroll stage 2 brings the button in.
     Same mechanism as the reference site's sticky-image section: pinned via a taller
     wrapper + position:sticky, content revealed by a scrubbed timeline. */

  if (typeof ScrollTrigger !== 'undefined' && document.querySelector('.pour-section')) {
    const pourEnd = () => {
      const sectionH = document.querySelector('.pour-section').offsetHeight;
      const wrapH = document.querySelector('.pour-sticky-wrap').offsetHeight;
      return `+=${sectionH - wrapH}`;
    };

    gsap.timeline({
      scrollTrigger: {
        trigger: '.pour-section',
        start: 'top top',
        end: pourEnd,
        scrub: true
      }
    })
      .from('.pour-heading-text', { y: 100, opacity: 0, ease: 'none', duration: 1 })
      .from('.pour-underline', {
        scaleX: 0,
        transformOrigin: 'left center',
        opacity: 0,
        ease: 'none',
        duration: 0.6
      }, '-=0.3')
      .to({}, { duration: 0.5 })
      .from('.pour-cta', { y: 30, opacity: 0, ease: 'none', duration: 1 })
      .to({}, { duration: 0.8 });

    /* Background media shrinks slightly as you scroll through the section,
       matching the reference site's sticky-image scale-down behavior */
    gsap.to('.pour-media', {
      scale: 0.9,
      ease: 'none',
      scrollTrigger: {
        trigger: '.pour-section',
        start: 'top top',
        end: pourEnd,
        scrub: true
      }
    });
  }

  /* Beer cards — play video on hover, pause + rewind on leave */

  document.querySelectorAll('.beer-card').forEach((card) => {
    const video = card.querySelector('.beer-card-video');
    if (!video) return;

    card.addEventListener('mouseenter', () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    });

    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });
});

new Swiper(".grafton-swiper", {
    slidesPerView: 5,
    spaceBetween: 0,
    centeredSlides: false,
    watchOverflow: true,
    navigation: {
        nextEl: ".grafton-slider-next",
        prevEl: ".grafton-slider-prev",
    },

    breakpoints: {
        0: {
            slidesPerView: 1
        },
        576: {
            slidesPerView: 2
        },
        768: {
            slidesPerView: 3
        },
        1200: {
            slidesPerView: 5
        }
    }
});

// new Swiper(".exploreSwiper", {

//     slidesPerView: 3,
//     spaceBetween: 24,

//     navigation: {
//         nextEl: ".explore-next",
//         prevEl: ".explore-prev",
//     },

//     breakpoints: {

//         0: {
//             slidesPerView: 1
//         },

//         768: {
//             slidesPerView: 2
//         },

//         1200: {
//             slidesPerView: 3
//         }
//     }
// });


const exploreSwiper = new Swiper(".exploreSwiper", {
  slidesPerView: 3,
  spaceBetween: 24,
  speed: 700,

  navigation: {
    nextEl: ".explore-next",
    prevEl: ".explore-prev",
  },

  breakpoints: {
    0: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    1200: { slidesPerView: 3 }
  }
});

gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {
  const section = document.querySelector(".explore-section");
  if (!section || !exploreSwiper) return;

  let st;

  function initExploreScroll() {
    // Kill old trigger on resize
    if (st) st.kill();

    const slidesPerView = exploreSwiper.params.slidesPerView === "auto"
      ? exploreSwiper.slidesPerViewDynamic()
      : exploreSwiper.currentBreakpoint
        ? exploreSwiper.params.slidesPerView
        : exploreSwiper.params.slidesPerView;

    const visibleSlides = exploreSwiper.slidesPerViewDynamic
      ? exploreSwiper.slidesPerViewDynamic()
      : exploreSwiper.params.slidesPerView;

    const maxIndex = Math.max(
      0,
      exploreSwiper.slides.length - Math.ceil(visibleSlides)
    );

    if (maxIndex <= 0) return;

    st = ScrollTrigger.create({
      trigger: section,
      start: "bottom bottom",
      end: () => `+=${maxIndex * window.innerHeight}`,
      pin: true,
      pinSpacing: true,
      scrub: 0.3,
      anticipatePin: 1,

      onUpdate: (self) => {
        const index = Math.round(self.progress * maxIndex);

        if (index !== exploreSwiper.activeIndex) {
          exploreSwiper.slideTo(index);
        }
      }
    });
  }

  initExploreScroll();

  window.addEventListener("resize", () => {
    exploreSwiper.update();
    // ScrollTrigger.refresh();
    initExploreScroll();
  });
});
