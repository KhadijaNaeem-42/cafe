const QNA = [
  {
    q: 'Which drink is made of just espresso and hot water?',
    a: ['Latte', 'Americano', 'Mocha', 'Macchiato'],
    correct: 1,
    fact: 'Americano = espresso + hot water. Simple but strong.'
  },
  {
    q: 'What does "macchiato" mean in Italian?',
    a: ['Sweet', 'Strong', 'Stained / marked', 'Cold'],
    correct: 2,
    fact: 'The espresso is "marked" with a little milk foam.'
  },
  {
    q: 'Which drink has chocolate in it?',
    a: ['Cappuccino', 'Cafe Mocha', 'Double Espresso', 'Americano'],
    correct: 1,
    fact: 'Mocha = espresso + steamed milk + chocolate.'
  },
  {
    q: 'A cappuccino is traditionally topped with...?',
    a: ['Thick milk foam', 'Ice cream', 'Whipped cream only', 'Nothing'],
    correct: 0,
    fact: 'Equal parts espresso, steamed milk and foam.'
  },
  {
    q: 'Coffee beans are actually the seeds of a...?',
    a: ['Fruit (coffee cherry)', 'Root', 'Leaf', 'Flower'],
    correct: 0,
    fact: 'Yes, coffee beans come from the coffee cherry.'
  }
];

const qnaBox = document.getElementById('qna-box');

if (qnaBox) {
  let step = 0;
  let score = 0;
  let locked = false;

  function showQuestion() {
    const item = QNA[step];
    locked = false;

    qnaBox.innerHTML =
      `<p class="qna-count">Question ${step + 1} / ${QNA.length}</p>` +
      `<h3>${item.q}</h3>` +
      item.a.map((opt, i) =>
        `<button class="qna-opt" data-i="${i}">${String.fromCharCode(65 + i)}. ${opt}</button>`
      ).join('') +
      `<p class="qna-fact" id="qna-fact"></p>` +
      `<button class="qna-next" id="qna-next" style="display:none;">` +
      (step === QNA.length - 1 ? 'See result' : 'Next ›') + `</button>`;
  }

  function showResult() {
    let msg;
    if (score === QNA.length) msg = 'Certified barista brain 🧠☕';
    else if (score >= 3) msg = 'Solid coffee knowledge. Respect.';
    else msg = 'Needs more espresso. Come visit us ☕';

    qnaBox.innerHTML =
      `<p class="qna-count">your score</p>` +
      `<h3 class="qna-score">${score} / ${QNA.length}</h3>` +
      `<p>${msg}</p>` +
      `<a href="order.html" class="btn">Order a coffee</a>` +
      `<button class="qna-retry" id="qna-retry">play again</button>`;
  }

  qnaBox.addEventListener('click', (e) => {
    const opt = e.target.closest('.qna-opt');

    if (opt && !locked) {
      locked = true;
      const chosen = Number(opt.dataset.i);
      const item = QNA[step];
      const buttons = qnaBox.querySelectorAll('.qna-opt');

      buttons[item.correct].classList.add('right');
      if (chosen === item.correct) {
        score++;
        document.getElementById('qna-fact').textContent = '✅ Correct! ' + item.fact;
      } else {
        opt.classList.add('wrong');
        document.getElementById('qna-fact').textContent = '❌ Not quite. ' + item.fact;
      }
      document.getElementById('qna-next').style.display = 'inline-block';
    }

    if (e.target.closest('#qna-next')) {
      step++;
      if (step < QNA.length) showQuestion();
      else showResult();
    }

    if (e.target.closest('#qna-retry')) {
      step = 0;
      score = 0;
      showQuestion();
    }
  });

  showQuestion();
}