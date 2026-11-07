// =========================================================
// 1. Navbar: "Vibe" link + dark/light toggle
// =========================================================
const navList = document.querySelector('nav ul');

if (navList) {
  if (!navList.querySelector('a[href="fun.html"]')) {
    const li = document.createElement('li');
    li.innerHTML = '<a href="fun.html">Vibe ✨</a>';
    navList.appendChild(li);
  }
  if (location.pathname.endsWith('fun.html')) {
    navList.querySelector('a[href="fun.html"]').classList.add('active');
  }

  const toggleLi = document.createElement('li');
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'theme-btn';
  toggleBtn.setAttribute('aria-label', 'Toggle dark or light mode');
  toggleLi.appendChild(toggleBtn);
  navList.appendChild(toggleLi);

  const applyTheme = (light) => {
    document.body.classList.toggle('light', light);
    toggleBtn.textContent = light ? '🌙' : '☀️';
  };

  let savedTheme = null;
  try { savedTheme = localStorage.getItem('brewsterTheme'); } catch (e) {}
  applyTheme(savedTheme === 'light');

  toggleBtn.addEventListener('click', () => {
    const light = !document.body.classList.contains('light');
    applyTheme(light);
    try { localStorage.setItem('brewsterTheme', light ? 'light' : 'dark'); } catch (e) {}
  });
}

// =========================================================
// 2. Custom cursor (sirf mouse wale devices par)
// =========================================================
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.append(dot, ring);
  document.body.classList.add('has-cursor');

  let x = 0, y = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', (e) => {
    x = e.clientX;
    y = e.clientY;
    dot.style.transform = `translate(${x}px, ${y}px)`;
  });

  const follow = () => {
    rx += (x - rx) * 0.15;
    ry += (y - ry) * 0.15;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(follow);
  };
  follow();

  document.addEventListener('mouseover', (e) => {
    ring.classList.toggle('big', !!e.target.closest('a, button, .product, .q-opt, .stamp'));
  });
}

// =========================================================
// 3. Scroll animations
// =========================================================
if ('IntersectionObserver' in window) {
  const targets = document.querySelectorAll(
    '.about-card, .contact-card, .about-stats div, .about-quote, .about-cta, ' +
    '.contact-form-box, .menu-cat, .quiz-box, .stamp-card, .review-wrap, .map-box'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

// =========================================================
// 4. Reviews slider (Home page)
// =========================================================
const reviewBox = document.getElementById('review-box');

if (reviewBox) {
  // NOTE: Ye sample reviews hain. Real cafe ke liye asli reviews se badal dein.
  const REVIEWS = [
    { text: 'The caramel macchiato literally fixed my Monday. 10/10 would caffeinate again.', name: 'Areeba', tag: 'uni student 📚', stars: 5 },
    { text: 'Aesthetic wall, strong coffee, fast wifi. I came for 1 hour and stayed 4.', name: 'Hamza', tag: 'freelancer 💻', stars: 5 },
    { text: 'The croque-monsieur is dangerous. I think about it daily.', name: 'Sana', tag: 'foodie 🥪', stars: 5 },
    { text: 'Frappe latte was elite. The vibe was even better.', name: 'Zain', tag: 'night owl 🌙', stars: 4 }
  ];

  const dotsBox = document.getElementById('review-dots');
  let idx = 0;
  let timer;

  const showReview = (i) => {
    idx = (i + REVIEWS.length) % REVIEWS.length;
    const r = REVIEWS[idx];
    reviewBox.classList.remove('in');
    void reviewBox.offsetWidth; // animation restart
    reviewBox.innerHTML =
      `<p class="r-stars">${'★'.repeat(r.stars)}</p>` +
      `<p class="r-text">“${r.text}”</p>` +
      `<p class="r-name">${r.name} · ${r.tag}</p>`;
    reviewBox.classList.add('in');
    dotsBox.querySelectorAll('button').forEach((b, n) => b.classList.toggle('on', n === idx));
  };

  REVIEWS.forEach((_, n) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'Review ' + (n + 1));
    b.addEventListener('click', () => { showReview(n); startAuto(); });
    dotsBox.appendChild(b);
  });

  const startAuto = () => {
    clearInterval(timer);
    timer = setInterval(() => showReview(idx + 1), 5000);
  };

  document.getElementById('rev-prev').addEventListener('click', () => { showReview(idx - 1); startAuto(); });
  document.getElementById('rev-next').addEventListener('click', () => { showReview(idx + 1); startAuto(); });

  showReview(0);
  startAuto();
}

// =========================================================
// 5. Coffee personality quiz (Vibe page)
// =========================================================
const quizBody = document.getElementById('quiz-body');

if (quizBody) {
  const QUIZ = [
    { q: 'Your ideal Saturday?', a: [
      { t: 'Sleeping in, blanket burrito 🛌', type: 'chill' },
      { t: 'Spontaneous plans + photo dump 📸', type: 'main' },
      { t: 'Library lock-in, grind mode 📚', type: 'grinder' },
      { t: 'Outside, sunshine, iced everything ☀️', type: 'iced' }
    ]},
    { q: 'Your phone battery right now?', a: [
      { t: '100%, charger always nearby 🔌', type: 'grinder' },
      { t: '3% and thriving 💀', type: 'main' },
      { t: 'Chilling around 60%', type: 'chill' },
      { t: 'Low power mode, still vibing', type: 'iced' }
    ]},
    { q: 'Pick a playlist:', a: [
      { t: 'Lo-fi beats', type: 'chill' },
      { t: 'Top pop hits', type: 'main' },
      { t: 'Deep focus, no lyrics', type: 'grinder' },
      { t: 'Summer indie', type: 'iced' }
    ]},
    { q: 'Your role in the group chat?', a: [
      { t: 'The planner 🗓️', type: 'grinder' },
      { t: 'The meme sender 😂', type: 'iced' },
      { t: 'Replies after 3 days 😴', type: 'chill' },
      { t: 'Voice note queen/king 🎙️', type: 'main' }
    ]}
  ];

  const TYPES = {
    main:    { title: 'The Main Character', drink: 'Caramel Macchiato', text: 'Sweet, bold, and a little dramatic. Just like you.' },
    grinder: { title: 'The Grinder',        drink: 'Double Espresso',   text: 'Focused, no-nonsense, deadlines fear you.' },
    chill:   { title: 'The Cozy Cloud',     drink: 'Cafe Latte',        text: 'Soft, smooth, and low-key the most loved in the room.' },
    iced:    { title: 'The Iced Icon',      drink: 'Frappe Latte',      text: 'Cool, fun, and always the energy of the group.' }
  };

  let step = 0;
  let scores = {};

  const renderQuestion = () => {
    const q = QUIZ[step];
    quizBody.innerHTML =
      `<p class="q-count">Question ${step + 1} / ${QUIZ.length}</p>` +
      `<h3>${q.q}</h3>` +
      q.a.map((o) => `<button class="q-opt" data-type="${o.type}">${o.t}</button>`).join('');
  };

  const renderResult = () => {
    const winner = Object.keys(scores).sort((a, b) => scores[b] - scores[a])[0];
    const t = TYPES[winner];
    quizBody.innerHTML =
      `<p class="q-count">your result</p>` +
      `<h3 class="q-result">${t.title}</h3>` +
      `<p>${t.text}</p>` +
      `<p class="q-drink">Your drink: <b>${t.drink}</b> ☕</p>` +
      `<a href="order.html" class="btn">Order it</a>` +
      `<button id="quiz-retry" class="btn-link">take the quiz again</button>`;
  };

  quizBody.addEventListener('click', (e) => {
    const opt = e.target.closest('.q-opt');
    if (opt) {
      const type = opt.dataset.type;
      scores[type] = (scores[type] || 0) + 1;
      step++;
      if (step < QUIZ.length) renderQuestion();
      else renderResult();
    }
    if (e.target.closest('#quiz-retry')) {
      step = 0;
      scores = {};
      renderQuestion();
    }
  });

  renderQuestion();
}

// =========================================================
// 6. Loyalty stamp card (Vibe page)
// =========================================================
const stampsBox = document.getElementById('stamps');

if (stampsBox) {
  const TOTAL = 10;
  let stamps = 0;
  try { stamps = Number(localStorage.getItem('brewsterStamps')) || 0; } catch (e) {}

  const addBtn = document.getElementById('stamp-add');
  const msg = document.getElementById('stamp-msg');

  const renderStamps = () => {
    let html = '';
    for (let i = 1; i <= TOTAL; i++) {
      if (i <= stamps) html += '<div class="stamp filled">☕</div>';
      else if (i === TOTAL) html += '<div class="stamp gift">🎁<br>FREE</div>';
      else html += `<div class="stamp">${i}</div>`;
    }
    stampsBox.innerHTML = html;

    if (stamps >= TOTAL) {
      msg.textContent = 'Free coffee unlocked! 🎉 Show this to the barista.';
      addBtn.textContent = 'Claim free coffee';
    } else {
      msg.textContent = `${TOTAL - stamps} more to go. You got this.`;
      addBtn.textContent = '+ Add stamp';
    }
  };

  const saveStamps = () => {
    try { localStorage.setItem('brewsterStamps', String(stamps)); } catch (e) {}
  };

  addBtn.addEventListener('click', () => {
    stamps = stamps >= TOTAL ? 0 : stamps + 1;
    saveStamps();
    renderStamps();
  });

  document.getElementById('stamp-reset').addEventListener('click', () => {
    stamps = 0;
    saveStamps();
    renderStamps();
  });

  renderStamps();
}