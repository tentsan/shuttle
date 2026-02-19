(function() {
  var MARKS = [
    '\u2660', '\u2663', '\u2665', '\u2666',
    '\u2605', '\u2606', '\u25cb', '\u25cf',
    '\u25a1', '\u25a0', '\u25b3', '\u25b2',
    '\u25c7', '\u25c6', '\u266a', '\u266b',
    '\u26a1', '\ud83d\udd25', '\ud83d\udca7', '\ud83c\udf3f',
    '\ud83c\udf4e', '\ud83c\udf4a', '\ud83c\udf4b', '\ud83c\udf47',
    '\ud83d\udc31', '\ud83d\udc36', '\ud83d\udc30', '\ud83d\udc3c',
    '\ud83c\udf19', '\u2600', '\u2b50', '\u2744'
  ];

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = a[i]; a[i] = a[j]; a[j] = temp;
    }
    return a;
  }

  function pickRandom(arr, exclude) {
    var candidates = arr.filter(function(x) { return x !== exclude; });
    if (candidates.length === 0) return arr[0];
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  GameEngine.registerGame({
    id: 'mark',
    name: '\u30de\u30fc\u30af\u5f53\u3066',
    icon: '\ud83c\udfaf',
    description: '\u540c\u3058\u30de\u30fc\u30af\u3092\u898b\u3064\u3051\u3088\u3046\uff01',

    startRound: function(container, onAnswer) {
      var answered = false;
      container.innerHTML = '';

      var correctMark = MARKS[Math.floor(Math.random() * MARKS.length)];

      var label = document.createElement('div');
      label.className = 'question-label';
      label.textContent = '\u3053\u306e \u30de\u30fc\u30af \u3068\u540c\u3058\u3082\u306e\u306f\uff1f';
      container.appendChild(label);

      var questionEl = document.createElement('div');
      questionEl.className = 'question-mark';
      questionEl.textContent = correctMark;
      container.appendChild(questionEl);

      var wrong1 = pickRandom(MARKS, correctMark);
      var wrong2;
      do { wrong2 = pickRandom(MARKS, correctMark); } while (wrong2 === wrong1);
      var options = shuffle([correctMark, wrong1, wrong2]);

      var choicesDiv = document.createElement('div');
      choicesDiv.className = 'choices';

      options.forEach(function(mark) {
        var btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = mark;
        btn.addEventListener('click', function() {
          if (answered) return;
          answered = true;

          var isCorrect = (mark === correctMark);
          if (isCorrect) {
            btn.classList.add('correct');
          } else {
            btn.classList.add('wrong');
            var allBtns = choicesDiv.querySelectorAll('.choice-btn');
            for (var i = 0; i < allBtns.length; i++) {
              if (allBtns[i].textContent === correctMark) {
                allBtns[i].classList.add('correct');
              }
            }
          }
          onAnswer(isCorrect);
        });
        choicesDiv.appendChild(btn);
      });

      container.appendChild(choicesDiv);
    },

    cleanup: function() {},

    getShareText: function(score) {
      return '\ud83c\udfaf \u30de\u30fc\u30af\u5f53\u3066\u30b2\u30fc\u30e0\u3067 ' + score + ' \u70b9\u53d6\u308a\u307e\u3057\u305f\uff01\n60\u79d2\u3067\u3069\u308c\u3060\u3051\u6b63\u89e3\u3067\u304d\u308b\u304b\u306a\uff1f';
    }
  });
})();
