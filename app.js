/* FURY CO. ATHLETICS — interactions & motion
   (motion architecture ported from Diamond Action Design) */
(function(){
  'use strict';

  /* ---- sticky / shrinking header ---- */
  const header = document.querySelector('.header');
  if (header){
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, {passive:true});
  }

  /* ---- scroll reveal ---- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold:0.12, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---- count-up stats ---- */
  const countUp = (el) => {
    const target = parseFloat(el.dataset.count);
    const dur = 1500, start = performance.now();
    const suffix = el.dataset.suffix || '';
    const u = suffix ? '<span class="u">'+suffix+'</span>' : '';
    const step = (now) => {
      const p = Math.min((now - start)/dur, 1);
      const eased = 1 - Math.pow(1-p, 3);
      const val = Math.floor(eased * target);
      el.innerHTML = val + u;
      if (p < 1) requestAnimationFrame(step);
      else el.innerHTML = target + u;
    };
    requestAnimationFrame(step);
  };
  const statIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){ countUp(e.target); statIO.unobserve(e.target); }
    });
  }, {threshold:0.6});
  document.querySelectorAll('[data-count]').forEach(el => statIO.observe(el));

  /* ---- gallery filter ---- */
  const filterBtns = document.querySelectorAll('.gal-filters button');
  const galItems = document.querySelectorAll('.gal-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      const f = btn.dataset.filter;
      galItems.forEach(it => {
        const show = f === 'all' || it.dataset.cat === f;
        it.style.display = show ? '' : 'none';
      });
    });
  });

  /* ---- lightbox (image + video) ---- */
  const lb = document.getElementById('lightbox');
  if (lb){
    const lbMedia = lb.querySelector('.lb-media');
    const lbClose = lb.querySelector('.lb-close');
    const open = (item) => {
      const type = item.dataset.lbType;
      const src = item.dataset.lbSrc;
      const alt = item.dataset.lbAlt || '';
      if (type === 'video'){
        lbMedia.innerHTML = '<iframe src="'+src+'" title="'+alt+'" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>';
      } else {
        lbMedia.innerHTML = '<img src="'+src+'" alt="'+alt+'">';
      }
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      lb.classList.remove('open');
      lbMedia.innerHTML = '';
      document.body.style.overflow = '';
    };
    document.querySelectorAll('.gal-item[data-lb-src]').forEach(it => {
      it.addEventListener('click', () => open(it));
    });
    lbClose && lbClose.addEventListener('click', close);
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    window.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  /* ---- booking form (front-end only confirmation) ---- */
  const form = document.getElementById('booking-form');
  if (form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type=submit]');
      const orig = btn.innerHTML;
      btn.innerHTML = '<span>Request sent — we\'ll be in touch</span>';
      setTimeout(() => { btn.innerHTML = orig; form.reset(); }, 3200);
    });
  }

  /* ---- mobile menu toggle ---- */
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.querySelector('.header .nav');
  if (menuBtn && nav){
    menuBtn.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  /* ---- subtle hero parallax ---- */
  const heroImg = document.querySelector('.hero-bg img');
  if (heroImg && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) heroImg.style.transform = 'scale(1.06) translateY(' + (y*0.12) + 'px)';
    }, {passive:true});
  }
})();
