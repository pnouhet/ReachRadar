/* ReachRadar — Home prototype interactions + GSAP entrance animations */
(function () {
  'use strict';

  var root = document.documentElement;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- Build repeated markup ---------- */

  // Waveform: one bar per height from the Figma mock, the first N "played" in cyan.
  $$('.waveform__bars').forEach(function (wave) {
    var heights = wave.dataset.heights.split(',').map(Number);
    var played = Number(wave.dataset.played);
    wave.innerHTML = heights.map(function (h, i) {
      return '<span class="' + (i < played ? '' : 'is-rest') + '" style="height:' + h + 'px"></span>';
    }).join('');
  });

  // Progress segments (12 / 20 songs rated).
  $$('.progress__segs').forEach(function (bar) {
    var total = Number(bar.dataset.total);
    var done = Number(bar.dataset.done);
    var html = '';
    for (var i = 0; i < total; i++) html += '<span class="' + (i < done ? '' : 'is-rest') + '"></span>';
    bar.innerHTML = html;
  });

  // Split hero title lines into characters for the staggered entrance.
  $$('.hero__line').forEach(function (line) {
    line.innerHTML = line.textContent.split('').map(function (c) {
      return '<span class="char">' + c + '</span>';
    }).join('');
  });

  /* ---------- Small UI behaviours ---------- */

  $$('.tabs').forEach(function (tabs) {
    tabs.addEventListener('click', function (e) {
      var tab = e.target.closest('.tab');
      if (!tab) return;
      $$('.tab', tabs).forEach(function (t) {
        var on = t === tab;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-selected', String(on));
      });
    });
  });

  var nav = $('.nav');
  var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 40); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- GSAP ---------- */

  if (!window.gsap || !window.ScrollTrigger) {
    root.classList.remove('anim-pending');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  var mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: reduce)', function () {
    root.classList.remove('anim-pending');
  });

  mm.add('(prefers-reduced-motion: no-preference)', function () {
    var reveal = function (targets, vars, trigger) {
      return gsap.from(targets, Object.assign({
        autoAlpha: 0,
        duration: 1,
        ease: 'power3.out',
        clearProps: 'transform,filter', // keep CSS :hover transforms working afterwards
        scrollTrigger: { trigger: trigger || targets, start: 'top 85%', toggleActions: 'play none none none' }
      }, vars));
    };

    var countUp = function (el, duration) {
      var end = Number(el.dataset.count);
      var prefix = el.dataset.prefix || '';
      var suffix = el.dataset.suffix || '';
      var state = { v: 0 };
      return gsap.to(state, {
        v: end,
        duration: duration || 1.6,
        ease: 'power2.out',
        onUpdate: function () { el.textContent = prefix + Math.round(state.v) + suffix; }
      });
    };

    /* Hero intro timeline */
    var intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
    intro
      .from('.top__photo', { scale: 1.18, duration: 2.6, ease: 'power2.out' }, 0)
      .from('.top__dots', { autoAlpha: 0, duration: 1.6 }, 0.2)
      .from('.nav', { y: -60, autoAlpha: 0, duration: 1 }, 0.3)
      .from('.hero__line--solid .char', {
        yPercent: 120, rotate: 10, autoAlpha: 0, duration: 1.2, stagger: 0.045
      }, 0.4)
      .from('.hero__line--outline .char', {
        yPercent: -80, autoAlpha: 0, duration: 1.2, stagger: { each: 0.045, from: 'end' }
      }, 0.6)
      .from('.hero__lead', { y: 30, autoAlpha: 0, duration: 1 }, 1.1)
      .from('.hero__cta .btn', { y: 30, scale: 0.9, autoAlpha: 0, duration: 0.9, stagger: 0.12, clearProps: 'transform' }, 1.3)
      .from('.hero__bar > *', { y: 20, autoAlpha: 0, duration: 0.9, stagger: 0.1 }, 1.5)
      .from('.hero__bar .socials li', { y: 14, autoAlpha: 0, duration: 0.6, stagger: 0.06 }, 1.6);

    // Start states are applied: show the hero.
    root.classList.remove('anim-pending');

    /* Hero scroll: photo parallax, title drifts and fades */
    gsap.to('.top__photo', {
      yPercent: 10, ease: 'none',
      scrollTrigger: { trigger: '.top', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.hero__title, .hero__cta', {
      y: -120, autoAlpha: 0, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 30%', scrub: true }
    });

    /* Generic reveals */
    $$('.reveal-badge').forEach(function (el) {
      reveal(el, { x: -40, skewX: -12, duration: 0.8, ease: 'back.out(2)' });
    });
    $$('.reveal-title').forEach(function (el) {
      reveal(el, { y: 60, filter: 'blur(10px)', duration: 1.1 });
    });
    $$('.reveal-up').forEach(function (el) {
      reveal(el, { y: 40, duration: 0.9 });
    });
    $$('.benefits').forEach(function (list) {
      reveal(list.children, { x: -24, duration: 0.7, stagger: 0.12 }, list);
    });
    $$('.reveal-card').forEach(function (el) {
      reveal(el, { y: 90, scale: 0.96, duration: 1.2 });
    });

    /* 01 stats count up */
    reveal('.stat', { y: 30, duration: 0.8, stagger: 0.12 }, '.stats');
    ScrollTrigger.create({
      trigger: '.stats', start: 'top 85%',
      onEnter: function (self) {
        if (self.counted) return;
        self.counted = true;
        $$('.stats [data-count]').forEach(function (el) { countUp(el); });
      }
    });

    /* Go ahead: image wipe + quote */
    gsap.timeline({ scrollTrigger: { trigger: '.live', start: 'top 70%', toggleActions: 'play none none none' } })
      .from('.live__frame', { clipPath: 'inset(0 0 100% 0)', duration: 1.3, ease: 'expo.inOut' })
      .from('.live__img', { scale: 1.25, duration: 1.6, ease: 'power3.out' }, 0.2)
      .from('.live__quote-mark', { scale: 0, rotate: -45, autoAlpha: 0, duration: 0.8, ease: 'back.out(2.5)' }, 0.2)
      .from('.tab', { y: 20, autoAlpha: 0, duration: 0.6, stagger: 0.1 }, 0.9);

    /* 02 steps */
    gsap.timeline({ scrollTrigger: { trigger: '.steps', start: 'top 80%', toggleActions: 'play none none none' } })
      .from('.step', { y: 70, autoAlpha: 0, duration: 1, stagger: 0.15, ease: 'power3.out' })
      .from('.step__icon', { scale: 0, rotate: -90, duration: 0.7, stagger: 0.15, ease: 'back.out(3)' }, 0.25)
      .from('.step__num', { scale: 0.7, autoAlpha: 0, duration: 0.9, stagger: 0.15, ease: 'back.out(2)' }, 0.3);

    /* 03 categories */
    gsap.timeline({ scrollTrigger: { trigger: '.categories', start: 'top 80%', toggleActions: 'play none none none' } })
      .from('.cat', { y: 90, rotate: 2, autoAlpha: 0, duration: 1.1, stagger: 0.12, ease: 'power3.out' })
      .from('.cat__img', { clipPath: 'inset(100% 0 0 0)', duration: 1.2, stagger: 0.12, ease: 'expo.inOut' }, 0)
      .from('.cat__badge', { scale: 0, duration: 0.6, stagger: 0.12, ease: 'back.out(3)' }, 0.7);

    /* 04 pre-test score card */
    gsap.timeline({ scrollTrigger: { trigger: '.score-card', start: 'top 75%', toggleActions: 'play none none none' } })
      .from('.score__main .label', { y: 10, autoAlpha: 0, duration: 0.5 }, 0.5)
      .add(countUp($('.score__num'), 1.8), 0.5)
      .from('.criterion__bar', { clipPath: 'inset(0 100% 0 0)', duration: 1, stagger: 0.12, ease: 'power3.inOut' }, 0.7)
      .from('.criterion .label', { autoAlpha: 0, x: -8, duration: 0.4, stagger: 0.12 }, 1.1)
      .from('.highlight', { y: 20, autoAlpha: 0, duration: 0.7 }, 1.4)
      .from('.score__foot', { autoAlpha: 0, duration: 0.6 }, 1.7);

    /* 05 player */
    gsap.timeline({ scrollTrigger: { trigger: '.player', start: 'top 75%', toggleActions: 'play none none none' } })
      .from('.chip', { y: 16, autoAlpha: 0, duration: 0.5, stagger: 0.08 }, 0.4)
      .from('.waveform__play', { scale: 0, rotate: -30, duration: 0.6, ease: 'back.out(2.5)' }, 0.5)
      .from('.waveform__bars span', { scaleY: 0, duration: 0.6, stagger: 0.012, ease: 'power2.out' }, 0.6)
      .from('.rating', { clipPath: 'inset(0 100% 0 0)', duration: 0.9, ease: 'power3.inOut' }, 1.2)
      .from('.feedback', { y: 20, autoAlpha: 0, duration: 0.7 }, 1.4)
      .from('.player__actions > *', { y: 16, autoAlpha: 0, duration: 0.5, stagger: 0.1 }, 1.7);

    reveal('.progress__segs span', { scaleX: 0, transformOrigin: 'left center', autoAlpha: 1, duration: 0.4, stagger: 0.04, ease: 'power2.out' }, '.progress');

    // Play button: bars dance while "playing".
    var dance = null;
    $('.waveform__play').addEventListener('click', function () {
      if (dance) { dance.kill(); dance = null; gsap.to('.waveform__bars span', { scaleY: 1, duration: 0.3 }); return; }
      dance = gsap.to('.waveform__bars span', {
        scaleY: function () { return gsap.utils.random(0.35, 1.25); },
        duration: 0.28, ease: 'sine.inOut', stagger: { each: 0.01, repeat: -1, yoyo: true }
      });
    });

    /* 06 community: avatars + chat messages arrive one by one */
    reveal('.avatar:not(.avatar--sm):not(.avatar--flat)', { scale: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(2.5)' }, '.avatars');
    gsap.timeline({ scrollTrigger: { trigger: '.chat', start: 'top 70%', toggleActions: 'play none none none' } })
      .from('.chat__head', { y: 16, autoAlpha: 0, duration: 0.6 }, 0.4)
      .from('.chat__rule', { scaleX: 0, transformOrigin: 'left center', duration: 0.8, ease: 'power3.inOut' }, 0.5)
      .from('.msg:not(.msg--mine) > *', { x: -40, autoAlpha: 0, duration: 0.6, stagger: 0.7, ease: 'back.out(1.6)' }, 0.9)
      .from('.msg--mine > *', { x: 40, autoAlpha: 0, duration: 0.6, ease: 'back.out(1.6)' }, 2.4)
      .from('.composer', { y: 16, autoAlpha: 0, duration: 0.6 }, 2.6);

    /* Testimonials */
    reveal('.quote-mark', { scale: 0, rotate: -30, duration: 0.7, ease: 'back.out(3)' });
    reveal('.quote', { y: 80, duration: 1, stagger: 0.15 }, '.quotes');

    /* Final CTA */
    gsap.fromTo('.final__photo', { scale: 1.25 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: '.final', start: 'top bottom', end: 'bottom bottom', scrub: true }
    });
    gsap.timeline({ scrollTrigger: { trigger: '.final__band', start: 'top 65%', toggleActions: 'play none none none' } })
      .from('#final-title', { y: 70, scale: 0.92, filter: 'blur(12px)', autoAlpha: 0, duration: 1.2, ease: 'expo.out' })
      .from('.final__text', { y: 30, autoAlpha: 0, duration: 0.8, ease: 'power3.out' }, 0.4)
      .from('.final__btns .btn', { y: 30, autoAlpha: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }, 0.6);

    /* Footer */
    reveal('.footer__brand > *, .footer__links > div', { y: 30, duration: 0.8, stagger: 0.08 }, '.footer');
  });
})();
