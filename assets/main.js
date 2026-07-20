let journeySwiper;

function initJourneySwiper() {

    if (window.innerWidth < 992) {

        if (!journeySwiper) {

            journeySwiper = new Swiper(".journeySwiper", {
                slidesPerView: 1.2,
                spaceBetween: 0,
                loop: true,
                speed: 5000,
                allowTouchMove: true,
                autoplay: {
                    delay: 0,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false,
                },

                breakpoints: {
                    0: {
                        slidesPerView: 2,
                    },
                    768: {
                        slidesPerView: 3,
                    }
                }
            });

        }

    } else {

        if (journeySwiper) {
            journeySwiper.destroy(true, true);
            journeySwiper = null;
        }

    }

}

window.addEventListener("load", initJourneySwiper);
window.addEventListener("resize", initJourneySwiper);


// Sticky reveal footer — main scrolls over the fixed footer, then
// reveals it in a spacer sized to the footer's real (responsive) height
(() => {
  const mainEl = document.querySelector('main');
  const footerEl = document.querySelector('.grafton-footer');
  if (!mainEl || !footerEl) return;

  function syncFooterSpacer() {
    mainEl.style.marginBottom = footerEl.offsetHeight + "px";
  }

  syncFooterSpacer();
  window.addEventListener('load', syncFooterSpacer);
  window.addEventListener('resize', syncFooterSpacer);
})();




// Beer with Flavour section slider start
const exploreSwiper = new Swiper(".exploreSwiper", {
  slidesPerView: 2.6,
  spaceBetween: 24,
  speed: 700,

  navigation: {
    nextEl: ".explore-next",
    prevEl: ".explore-prev",
  },

  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },

  breakpoints: {
    0: { 
      slidesPerView: 1,
      autoplay: {
        enabled: true,
      },
     },
     500: { 
      slidesPerView: 1.8,
      autoplay: {
        enabled: true,
      },
     },
    768: { 
      slidesPerView: 2,
      autoplay: {
        enabled: true,
      },
     },
    1200: { 
      slidesPerView: 2.6,
      autoplay: {
        enabled: false,
      }
     }
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

    if (window.innerWidth < 992) {
      return;
    }

    const visibleSlides =
      window.innerWidth >= 1200 ? 2.5 :
      window.innerWidth >= 768 ? 2 : 1;

    const maxIndex = Math.max(
      0,
      exploreSwiper.slides.length - visibleSlides
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
  ScrollTrigger.refresh();
    
    if (typeof AOS !== "undefined") {
      AOS.refresh();
    }

  window.addEventListener("resize", () => {
    exploreSwiper.update();
    // ScrollTrigger.refresh();
    initExploreScroll();
  });
});

// Beer with Flavour section slider end


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
          
          
          const tl = gsap.timeline({
              scrollTrigger: {
                trigger: ".pour-section",
                start: "top top",
                end: pourEnd,
                scrub: 1.5
              }
            });
            
            // ---------- IN ----------
            tl.from(".pour-heading-text", {
                y: 80,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            })
            
            .from(".pour-underline", {
                scaleX: 0,
                opacity: 0,
                transformOrigin: "left center",
                duration: 0.5,
                ease: "power2.out"
            }, "+=0.1")
            
            .from(".pour-cta", {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            }, "+=0.1")
            
            // ---------- HOLD ----------
            .to({}, {
                duration: 1
            })
            
            // ---------- OUT ----------
            .to(".pour-heading-text", {
                y: -80,
                opacity: 0,
                duration: 0.8,
                ease: "power3.in"
            })
            
            .to(".pour-underline", {
                scaleX: 0,
                opacity: 0,
                transformOrigin: "left center",
                duration: 0.5,
                ease: "power2.in"
            }, "-=0.5")
            
            .to(".pour-cta", {
                y: -40,
                opacity: 0,
                duration: 0.8,
                ease: "power3.in"
            }, "-=0.4");
    
        /* Background media shrinks slightly as you scroll through the section,
           matching the reference site's sticky-image scale-down behavior */
        gsap.to('.pour-media', {
          scale: 0.9,
          ease: 'none',
          scrollTrigger: {
            trigger: '.pour-section',
            start: 'top top',
            end: pourEnd,
            scrub: 2
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

const hero = document.querySelector(".hero-section");

if (hero) {
  hero.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    gsap.to(".hero-cans-left", {
      x: -x * 40,
      y: -y * 30,
      duration: 0.8,
      ease: "power3.out"
    });

    gsap.to(".hero-cans-right", {
      x: x * 40,
      y: y * 30,
      duration: 0.8,
      ease: "power3.out"
    });

    const scale = 1 - (Math.abs(x) + Math.abs(y)) * 0.08;

    gsap.to(".hero-logo-wrap", {
      scale,
      duration: 0.8,
      ease: "power3.out"
    });

  });

  hero.addEventListener("mouseleave", () => {
    gsap.to(
      [".hero-cans-left", ".hero-cans-right"],
      {
        x: 0,
        y: 0,
        duration: 1,
        ease: "power3.out"
      }
    );
  });

  gsap.to(".hero-logo-wrap", {
    scale: 1,
    duration: 1,
    ease: "power3.out"
  });
}



new Swiper(".grafton-swiper", {
    slidesPerView: 5,
    spaceBetween: 0,
    centeredSlides: false,
    watchOverflow: true,
    rewind: true,
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
//             slidesPerView: 2.6
//         }
//     }
// });


// New Slider Hero Section
document.addEventListener('DOMContentLoaded', () => {
  const newHeroSwiperEl = document.querySelector('.new-hero-swiper');
  if (!newHeroSwiperEl || typeof Swiper === 'undefined') return;

  function animateNewHeroSlide(swiper) {
    const activeImg = swiper.slides[swiper.activeIndex].querySelector('.new-hero-slide-img');
    if (!activeImg) return;

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(activeImg,
        { opacity: 0, scale: 1.12 },
        { opacity: 1, scale: 1, duration: 1.6, ease: 'power2.out' }
      );
    } else {
      activeImg.classList.remove('new-hero-css-fallback');
      void activeImg.offsetWidth;
      activeImg.classList.add('new-hero-css-fallback');
    }
  }

  const newHeroSwiper = new Swiper(newHeroSwiperEl, {
    effect: 'fade',
    fadeEffect: { crossFade: true },
    loop: true,
    speed: 1000,
    autoplay: {
      delay: 4500,
      disableOnInteraction: false
    },
    pagination: {
      el: '.new-hero-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.new-hero-next',
      prevEl: '.new-hero-prev'
    },
    on: {
      init(swiper) {
        animateNewHeroSlide(swiper);
      },
      slideChangeTransitionStart(swiper) {
        animateNewHeroSlide(swiper);
      }
    }
  });
});


