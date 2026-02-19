(function() {
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  GameEngine.registerGame({
    id: 'math',
    name: '\u8a08\u7b97\u30c1\u30e3\u30ec\u30f3\u30b8',
    icon: '\ud83d\udd22',
    description: '\u6697\u7b97\u3067\u3069\u3093\u3069\u3093\u89e3\u3053\u3046\uff01',

    startRound: function(container, onAnswer) {
      var answered = false;
      container.innerHTML = '';

      var a = randomInt(1, 99);
      var b = randomInt(1, 99);
      var correctAnswer = a + b;
      var inputValue = '';

      // Expression
      var exprDiv = document.createElement('div');
      exprDiv.className = 'math-expression';
      exprDiv.textContent = a + ' + ' + b + ' = ?';
      container.appendChild(exprDiv);

      // Input display
      var inputDisplay = document.createElement('div');
      inputDisplay.className = 'math-input-display';
      inputDisplay.textContent = '\u00a0';
      container.appendChild(inputDisplay);

      function updateDisplay() {
        inputDisplay.textContent = inputValue || '\u00a0';
      }

      // Numpad
      var numpad = document.createElement('div');
      numpad.className = 'numpad';

      var keys = ['1','2','3','4','5','6','7','8','9','back','0','ok'];
      keys.forEach(function(key) {
        var btn = document.createElement('button');
        btn.className = 'numpad-btn';

        if (key === 'back') {
          btn.textContent = '\u232b';
          btn.classList.add('back-btn');
          btn.addEventListener('click', function() {
            if (answered) return;
            inputValue = inputValue.slice(0, -1);
            updateDisplay();
          });
        } else if (key === 'ok') {
          btn.textContent = 'OK';
          btn.classList.add('ok-btn');
          btn.addEventListener('click', function() {
            if (answered || inputValue === '') return;
            answered = true;

            var isCorrect = (parseInt(inputValue, 10) === correctAnswer);
            if (isCorrect) {
              inputDisplay.style.borderColor = '#4ecca3';
              inputDisplay.style.background = 'rgba(78, 204, 163, 0.2)';
            } else {
              inputDisplay.style.borderColor = '#e94560';
              inputDisplay.style.background = 'rgba(233, 69, 96, 0.2)';
              exprDiv.textContent = a + ' + ' + b + ' = ' + correctAnswer;
            }
            onAnswer(isCorrect);
          });
        } else {
          btn.textContent = key;
          btn.addEventListener('click', function() {
            if (answered) return;
            if (inputValue.length < 3) {
              inputValue += key;
              updateDisplay();
            }
          });
        }

        numpad.appendChild(btn);
      });

      container.appendChild(numpad);
    },

    cleanup: function() {},

    getShareText: function(score) {
      return '\ud83d\udd22 \u8a08\u7b97\u30c1\u30e3\u30ec\u30f3\u30b8\u3067 ' + score + ' \u70b9\u53d6\u308a\u307e\u3057\u305f\uff01\n60\u79d2\u3067\u3069\u308c\u3060\u3051\u89e3\u3051\u308b\u304b\u306a\uff1f';
    }
  });
})();
