/* ==========================================================================
   FOR MY MALKIN — script.js
   Password gate, particles, reveals, and all interactive romance.
   ========================================================================== */

(() => {
  'use strict';

  const PASSWORD = 'SorryMalkin';

  /* ---------------------------------------------------------------
     Helpers
  --------------------------------------------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const rand = (min, max) => Math.random() * (max - min) + min;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------
     LOCK SCREEN — floating hearts background
  --------------------------------------------------------------- */
  function spawnFloatingHearts(container, count, opts = {}) {
    const glyphs = opts.glyphs || ['❤️', '💗', '💕'];
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.className = 'float-heart';
      el.textContent = glyphs[Math.floor(rand(0, glyphs.length))];
      el.style.left = rand(0, 100) + '%';
      el.style.fontSize = rand(14, 30) + 'px';
      el.style.setProperty('--drift', rand(-60, 60) + 'px');
      el.style.animationDuration = rand(8, 16) + 's';
      el.style.animationDelay = rand(0, 12) + 's';
      container.appendChild(el);
    }
  }
  if (!prefersReducedMotion) spawnFloatingHearts($('#lockHearts'), 22);

  /* ---------------------------------------------------------------
     LOCK SCREEN — password logic
  --------------------------------------------------------------- */
  const lockForm = $('#lockForm');
  const lockInput = $('#lockPassword');
  const lockScreen = $('#lockScreen');
  const wrongPopup = $('#wrongPopup');
  const mainSite = $('#mainSite');
  const unlockBurst = $('#unlockBurst');

  let wrongTimer = null;

  lockForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = lockInput.value.trim();

    if (value === PASSWORD) {
      unlock();
    } else {
      lockInput.classList.remove('shake');
      // force reflow to restart animation
      void lockInput.offsetWidth;
      lockInput.classList.add('shake');
      wrongPopup.classList.add('show');
      clearTimeout(wrongTimer);
      wrongTimer = setTimeout(() => wrongPopup.classList.remove('show'), 2400);
    }
  });

  function unlock() {
    burstHeartExplosion(unlockBurst);
    setTimeout(() => {
      lockScreen.classList.add('unlocked');
      mainSite.hidden = false;
      document.body.style.overflow = '';
      initMainSite();
      const music = $('#bgMusic');
      music.volume = 0.25;
      music.play().catch(() => {/* autoplay may be blocked until further interaction */});
    }, 900);
  }

  function burstHeartExplosion(container) {
    const glyphs = ['❤️', '💖', '💗', '💕', '🌹'];
    const petalCount = 40;
    for (let i = 0; i < petalCount; i++) {
      const el = document.createElement('span');
      const isPetal = i % 3 === 0;
      el.className = isPetal ? 'burst-petal' : 'burst-heart';
      el.textContent = isPetal ? '🌸' : glyphs[Math.floor(rand(0, glyphs.length))];
      el.style.left = '50%';
      el.style.top = '50%';
      el.style.fontSize = rand(16, 36) + 'px';
      const angle = rand(0, Math.PI * 2);
      const dist = rand(200, window.innerWidth * 0.6);
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - rand(0, 200);
      el.style.transition = `transform ${rand(1, 1.8)}s cubic-bezier(.22,1,.36,1), opacity ${rand(1,1.8)}s ease`;
      el.style.opacity = '1';
      container.appendChild(el);
      requestAnimationFrame(() => {
        el.style.transform = `translate(${dx}px, ${dy}px) rotate(${rand(-180,180)}deg) scale(${rand(.6,1.4)})`;
        el.style.opacity = '0';
      });
      setTimeout(() => el.remove(), 2200);
    }
  }

  /* ---------------------------------------------------------------
     MAIN SITE INIT (called once, after unlock)
  --------------------------------------------------------------- */
  let mainInited = false;
  function initMainSite() {
    if (mainInited) return;
    mainInited = true;

    initAmbientCursorHearts();
    initScrollRail();
    initHeroParticles();
    initHeroTyping();
    initRevealOnScroll();
    initRain();
    initReasons();
    initPromises();
    initLoveMeter();
    initPolaroids();
    initLetter();
    initFinalSection();
    initMuteButton();
    initEasterEggs();
    initVideoHearts();
  }

  /* ---------------------------------------------------------------
     Ambient cursor-follow hearts (global, subtle)
  --------------------------------------------------------------- */
  function initAmbientCursorHearts() {
    if (prefersReducedMotion) return;
    const layer = $('#ambientLayer');
    let last = 0;
    window.addEventListener('pointermove', (e) => {
      const now = Date.now();
      if (now - last < 90) return; // throttle
      last = now;
      const heart = document.createElement('span');
      heart.className = 'cursor-heart';
      heart.textContent = '❤';
      heart.style.left = e.clientX + 'px';
      heart.style.top = e.clientY + 'px';
      heart.style.setProperty('--dx', rand(-20, 20) + 'px');
      layer.appendChild(heart);
      setTimeout(() => heart.remove(), 950);
    });
  }

  /* ---------------------------------------------------------------
     Scroll progress rail (heartbeat of the page)
  --------------------------------------------------------------- */
  function initScrollRail() {
    const fill = $('#scrollFill');
    const update = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      fill.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + '%';
    };
    document.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------------------------------------------------------------
     Hero: floating hearts + sparkles
  --------------------------------------------------------------- */
  function initHeroParticles() {
    if (prefersReducedMotion) return;
    const heartsC = $('#heroHearts');
    const sparklesC = $('#heroSparkles');
    spawnFloatingHearts(heartsC, 16, { glyphs: ['❤️', '💗', '💕', '✨'] });
    for (let i = 0; i < 30; i++) {
      const s = document.createElement('span');
      s.className = 'p-sparkle';
      s.style.left = rand(0, 100) + '%';
      s.style.top = rand(0, 100) + '%';
      s.style.animationDuration = rand(2, 5) + 's';
      s.style.animationDelay = rand(0, 4) + 's';
      sparklesC.appendChild(s);
    }
  }

  /* ---------------------------------------------------------------
     Hero: typing animation
  --------------------------------------------------------------- */
  function initHeroTyping() {
    const el = $('#heroTyping');
    const text = "Yesterday my words hurt the person I love the most...";
    if (prefersReducedMotion) { el.textContent = text; return; }
    let i = 0;
    (function typeNext() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(typeNext, 38);
      } else {
        el.style.borderRight = 'none';
      }
    })();

    $('#openHeartBtn').addEventListener('click', () => {
      $('#about').scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ---------------------------------------------------------------
     Reveal-on-scroll (IntersectionObserver)
  --------------------------------------------------------------- */
  function initRevealOnScroll() {
    const items = $$('.reveal');
    if (!('IntersectionObserver' in window) || prefersReducedMotion) {
      items.forEach(el => el.classList.add('in-view'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    items.forEach(el => io.observe(el));
  }

  /* ---------------------------------------------------------------
     Crybaby section: rain
  --------------------------------------------------------------- */
  function initRain() {
    if (prefersReducedMotion) return;
    const layer = $('#rainLayer');
    for (let i = 0; i < 60; i++) {
      const drop = document.createElement('span');
      drop.className = 'rain-drop';
      drop.style.left = rand(0, 100) + '%';
      drop.style.animationDuration = rand(0.7, 1.6) + 's';
      drop.style.animationDelay = rand(0, 2) + 's';
      layer.appendChild(drop);
    }
  }

  /* ---------------------------------------------------------------
     Video hearts floating over the apology video frame
  --------------------------------------------------------------- */
  function initVideoHearts() {
    if (prefersReducedMotion) return;
    const layer = $('.video-hearts');
    if (!layer) return;
    spawnFloatingHearts(layer, 8, { glyphs: ['❤️','💗'] });

    // graceful fallback if video file missing
    const video = $('#apologyVideo');
    const fallback = $('#videoFallback');
    video.addEventListener('error', () => {
      video.style.display = 'none';
      fallback.style.display = 'flex';
      fallback.style.flexDirection = 'column';
      fallback.style.alignItems = 'center';
      fallback.style.justifyContent = 'center';
      fallback.style.aspectRatio = '16/9';
      fallback.style.color = 'rgba(250,250,240,0.6)';
    }, true);

    const effortVideo = $('.effort-video');
    const effortFallback = $('#effortFallback');
    effortVideo.addEventListener('error', () => {
      effortVideo.style.display = 'none';
      effortFallback.style.display = 'flex';
      effortFallback.style.flexDirection = 'column';
      effortFallback.style.alignItems = 'center';
      effortFallback.style.justifyContent = 'center';
      effortFallback.style.aspectRatio = '16/9';
      effortFallback.style.color = 'rgba(250,250,240,0.6)';
    }, true);
  }

  /* ---------------------------------------------------------------
     Section 6: 25 reasons — flip cards
  --------------------------------------------------------------- */
  const REASONS = [
    'Your smile', 'Your care', 'Your madness', 'Your possessiveness', 'Your laugh',
    'Your eyes', 'Your kindness', 'Your hugs', 'Your patience', 'Your voice',
    'The way you say my name', 'How you remember tiny things', 'Your honesty',
    'Your strength', 'How you forgive me', 'Your stubbornness', 'Your warmth',
    'How safe I feel with you', 'Your dreams', 'Your advice', 'Your jealousy',
    'Your calm in my chaos', 'How you believe in me', 'Your silly jokes', 'You, simply you'
  ];
  function initReasons() {
    const grid = $('#reasonsGrid');
    const frag = document.createDocumentFragment();
    REASONS.forEach((reason, idx) => {
      const card = document.createElement('div');
      card.className = 'reason-card';
      card.setAttribute('tabindex', '0');
      card.innerHTML = `
        <div class="reason-inner">
          <div class="reason-face reason-front">❤️ ${reason}</div>
          <div class="reason-face reason-back">Reason #${idx + 1}<br>${reason}</div>
        </div>`;
      frag.appendChild(card);
    });
    grid.appendChild(frag);
  }

  /* ---------------------------------------------------------------
     Section 7: promises with checkbox + heart burst
  --------------------------------------------------------------- */
  const PROMISES = [
    'I will think before speaking.',
    'I will never let ego win.',
    'I will understand your feelings.',
    'I will respect your emotions.',
    'I will always communicate calmly.',
    'I will always make you feel loved.'
  ];
  function initPromises() {
    const list = $('#promisesList');
    PROMISES.forEach((text, idx) => {
      const card = document.createElement('div');
      card.className = 'promise-card glass';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.innerHTML = `
        <span class="promise-check">✓</span>
        <p class="promise-text">${text}</p>
        <div class="promise-burst"></div>`;
      const toggle = () => {
        card.classList.toggle('checked');
        if (card.classList.contains('checked')) {
          burstHeartExplosion(card.querySelector('.promise-burst'));
        }
      };
      card.addEventListener('click', toggle);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });
      list.appendChild(card);
    });
  }

  /* ---------------------------------------------------------------
     Section 8: Love meter
  --------------------------------------------------------------- */
  const METER_STEPS = [
    { percent: 10, label: "I'm Really Sorry" },
    { percent: 40, label: "I Miss You" },
    { percent: 70, label: "I Love You" },
    { percent: 100, label: "I Forgive You" }
  ];
  function initLoveMeter() {
    const btn = $('#meterBtn');
    const fill = $('#meterFill');
    const percentText = $('#meterPercent');
    const ekg = $('#ekgLine');
    fill.style.width = '10%';

    let step = 0;
    btn.textContent = METER_STEPS[0].label;
    btn.addEventListener('click', () => {
      const { percent } = METER_STEPS[step];
      fill.style.width = percent + '%';
      percentText.textContent = percent + '%';
      pulseEKG(ekg, percent);

      step++;
      if (step >= METER_STEPS.length) {
        explodePageIntoHearts();
        btn.disabled = true;
        btn.textContent = 'Forgiven ❤️';
      } else {
        btn.textContent = METER_STEPS[step].label;
      }
    });
  }

  function pulseEKG(pathEl, percent) {
    if (prefersReducedMotion) return;
    const spike = 30 - (percent / 100) * 22;
    const points = `0,30 60,30 80,${spike} 100,30 160,30 180,${60-spike} 200,30 400,30`;
    pathEl.setAttribute('points', points);
    pathEl.style.transition = 'none';
    setTimeout(() => {
      pathEl.style.transition = 'all .6s ease';
      pathEl.setAttribute('points', '0,30 400,30');
    }, 500);
  }

  function explodePageIntoHearts() {
    const layer = $('#ambientLayer');
    const glyphs = ['❤️', '💖', '💕', '🌹', '✨'];
    for (let i = 0; i < 80; i++) {
      const el = document.createElement('span');
      el.className = 'burst-heart';
      el.textContent = glyphs[Math.floor(rand(0, glyphs.length))];
      el.style.left = rand(0, 100) + 'vw';
      el.style.top = rand(0, 100) + 'vh';
      el.style.fontSize = rand(16, 40) + 'px';
      el.style.position = 'fixed';
      el.style.opacity = '1';
      el.style.transition = `transform 1.6s ease, opacity 1.6s ease`;
      layer.appendChild(el);
      requestAnimationFrame(() => {
        el.style.transform = `translateY(${rand(-200, -400)}px) rotate(${rand(-90, 90)}deg) scale(${rand(.5,1.5)})`;
        el.style.opacity = '0';
      });
      setTimeout(() => el.remove(), 1700);
    }
  }

  /* ---------------------------------------------------------------
     Section 9: Memory wall polaroids
  --------------------------------------------------------------- */
  const POLAROID_ITEMS = [
    { src: 'Sweetu.jpeg', cap: 'my Malkin' },
    { src: 'Bachu.jpeg', cap: 'your Bachu' },
    { src: 'Sweetu.jpeg', cap: 'that smile' },
    { src: 'Bachu.jpeg', cap: 'us, always' },
  ];
  function initPolaroids() {
    const wall = $('#polaroidWall');
    POLAROID_ITEMS.forEach(({ src, cap }) => {
      const rot = rand(-8, 8).toFixed(1);
      const card = document.createElement('div');
      card.className = 'polaroid';
      card.style.transform = `rotate(${rot}deg)`;
      card.innerHTML = `
        <img src="${src}" alt="${cap}">
        <div class="img-fallback-label">Photo goes here<br><span>${src}</span></div>
        <p class="polaroid-cap">${cap}</p>`;
      const img = card.querySelector('img');
      img.addEventListener('error', () => card.classList.add('img-fallback'));
      wall.appendChild(card);
    });

    // double-click Sweetu photo -> flying kisses (easter egg, also applies to hero photo)
    wall.addEventListener('dblclick', (e) => {
      const polaroid = e.target.closest('.polaroid');
      if (polaroid) spawnFlyingKisses(polaroid);
    });
  }

  function spawnFlyingKisses(originEl) {
    const rect = originEl.getBoundingClientRect();
    for (let i = 0; i < 10; i++) {
      const kiss = document.createElement('span');
      kiss.textContent = '💋';
      kiss.style.position = 'fixed';
      kiss.style.left = (rect.left + rect.width / 2) + 'px';
      kiss.style.top = (rect.top + rect.height / 2) + 'px';
      kiss.style.fontSize = rand(16, 28) + 'px';
      kiss.style.zIndex = 9999;
      kiss.style.transition = 'transform 1.2s ease, opacity 1.2s ease';
      document.body.appendChild(kiss);
      requestAnimationFrame(() => {
        kiss.style.transform = `translate(${rand(-120,120)}px, ${rand(-180,-60)}px) rotate(${rand(-40,40)}deg)`;
        kiss.style.opacity = '0';
      });
      setTimeout(() => kiss.remove(), 1300);
    }
  }

  /* ---------------------------------------------------------------
     Section 10: Letter typewriter
  --------------------------------------------------------------- */
  const LETTER_TEXT = `My Sweetu,

I keep replaying yesterday, and every time, I like myself a little less. I spoke to you in a way that had no room in it for how much I love you, and I am sorry — plainly, and without excuses.

You didn't deserve the version of me that showed up in that argument. You deserve the version who listens first, who chooses his words like they matter, because they do — they land on you.

Thank you for everything you carry quietly. For checking on me when I forget to check on myself. For loving me on the days I make it hard to. I don't say it enough, Madamji, but I see it. I see you.

I won't promise to be perfect, because that isn't fair to either of us. But I promise to try — to be slower to react, softer with my words, and always honest about where I fall short.

You are not just my Sweetu. You are my Malkin, my Madamji, the one I want to keep becoming better for.

I'm sorry. I'm here. I'm not going anywhere.`;

  function initLetter() {
    const paper = $('#letterPaper');
    const textEl = $('#letterText');
    let typed = false;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !typed) {
          typed = true;
          typeLetter(textEl, LETTER_TEXT);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    io.observe(paper);
  }

  function typeLetter(el, text) {
    if (prefersReducedMotion) { el.textContent = text; return; }
    let i = 0;
    (function next() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i += 2;
        setTimeout(next, 14);
      }
    })();
  }

  /* ---------------------------------------------------------------
     Final section: forgive button -> fireworks + confetti + sunrise
  --------------------------------------------------------------- */
  function initFinalSection() {
    const btn = $('#forgiveBtn');
    const finalSection = $('#finalSection');
    const thankYou = $('#thankYou');
    const canvas = $('#fireworksCanvas');

    btn.addEventListener('click', () => {
      btn.disabled = true;
      finalSection.classList.add('sunrise');
      thankYou.hidden = false;
      launchFireworks(canvas);
      burstHeartExplosion($('#ambientLayer'));
      spawnConfetti();
    });
  }

  function spawnConfetti() {
    const layer = $('#ambientLayer');
    const colors = ['#FF5C8A', '#FFD700', '#FAFAF0', '#500000'];
    for (let i = 0; i < 60; i++) {
      const c = document.createElement('span');
      c.style.position = 'fixed';
      c.style.left = rand(0, 100) + 'vw';
      c.style.top = '-5vh';
      c.style.width = rand(6, 10) + 'px';
      c.style.height = rand(6, 10) + 'px';
      c.style.background = colors[Math.floor(rand(0, colors.length))];
      c.style.opacity = '0.9';
      c.style.borderRadius = rand(0, 1) > 0.5 ? '50%' : '2px';
      c.style.transition = `transform ${rand(2, 3.5)}s linear, opacity 2s ease`;
      layer.appendChild(c);
      requestAnimationFrame(() => {
        c.style.transform = `translateY(${window.innerHeight + 100}px) rotate(${rand(180, 720)}deg)`;
        c.style.opacity = '0';
      });
      setTimeout(() => c.remove(), 3600);
    }
  }

  function launchFireworks(canvas) {
    const ctx = canvas.getContext('2d');
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#FF5C8A', '#FFD700', '#FAFAF0'];
    let particles = [];

    function spawnBurst(x, y) {
      const count = 36;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = rand(2, 6);
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          color: colors[Math.floor(rand(0, colors.length))]
        });
      }
    }

    let bursts = 0;
    const burstInterval = setInterval(() => {
      spawnBurst(rand(canvas.width * 0.2, canvas.width * 0.8), rand(canvas.height * 0.2, canvas.height * 0.6));
      bursts++;
      if (bursts > 6) clearInterval(burstInterval);
    }, 500);

    let raf;
    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.life -= 0.015;
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
        ctx.fill();
      });
      particles = particles.filter(p => p.life > 0);
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
      if (bursts > 6 && particles.length === 0) cancelAnimationFrame(raf);
    }
    tick();
  }

  /* ---------------------------------------------------------------
     Mute / unmute music
  --------------------------------------------------------------- */
  function initMuteButton() {
    const btn = $('#muteBtn');
    const music = $('#bgMusic');
    let muted = false;
    btn.addEventListener('click', () => {
      muted = !muted;
      music.muted = muted;
      btn.textContent = muted ? '🔇' : '🔈';
    });
  }

  /* ---------------------------------------------------------------
     Easter eggs
  --------------------------------------------------------------- */
  function showEggToast(message) {
    const toast = $('#eggToast');
    toast.textContent = message;
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => { toast.hidden = true; }, 400);
    }, 3200);
  }

  function initEasterEggs() {
    // Clicking Bachu's crybaby image 5 times
    const crybabyPhoto = $('#crybabyPhoto');
    let clicks = 0;
    crybabyPhoto.addEventListener('click', () => {
      clicks++;
      if (clicks === 5) {
        showEggToast('Crybaby Mode Activated 😭');
        clicks = 0;
      }
    });

    // Double click Sweetu's about photo -> flying kisses
    const sweetuPhoto = $('#sweetuPhoto');
    sweetuPhoto.addEventListener('dblclick', () => {
      spawnFlyingKisses(sweetuPhoto);
    });

    // Konami code
    const sequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let progress = 0;
    window.addEventListener('keydown', (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === sequence[progress]) {
        progress++;
        if (progress === sequence.length) {
          showEggToast("I'll keep saying sorry until you smile.");
          progress = 0;
        }
      } else {
        progress = (key === sequence[0]) ? 1 : 0;
      }
    });
  }

})();
