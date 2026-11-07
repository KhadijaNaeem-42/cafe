// ---------- Intro splash (sirf Home page par) ----------
const splash = document.getElementById('splash');

if (splash) {
  function closeSplash() {
    splash.classList.add('hide');
    setTimeout(() => splash.remove(), 1000);
  }

  splash.addEventListener('click', closeSplash);
  setTimeout(closeSplash, 4500);
}

// ---------- Falling coffee beans (sirf Menu page par) ----------
const beansBox = document.getElementById('beans');

if (beansBox) {
  const BEAN_COUNT = 30;

  for (let i = 0; i < BEAN_COUNT; i++) {
    const bean = document.createElement('div');
    bean.className = 'bean';

    const size = 12 + Math.random() * 20;
    bean.style.width = size + 'px';
    bean.style.height = size * 1.4 + 'px';
    bean.style.left = Math.random() * 100 + '%';
    bean.style.opacity = 0.4 + Math.random() * 0.5;
    bean.style.animationDuration = 8 + Math.random() * 10 + 's';
    bean.style.animationDelay = -Math.random() * 15 + 's';

    beansBox.appendChild(bean);
  }
}