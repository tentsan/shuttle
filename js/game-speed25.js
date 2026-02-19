(function() {
  var nextNum = 1;
  var startTime = null;
  var timerInterval = null;
  var finalTime = 0;

  var screen = document.getElementById('speed25-screen');
  var timerEl = document.getElementById('speed25-timer');
  var progressEl = document.getElementById('speed25-progress');
  var nextEl = document.getElementById('speed25-next');
  var grid = document.getElementById('speed25-grid');

  GameEngine.registerScreen(screen);

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = a[i]; a[i] = a[j]; a[j] = temp;
    }
    return a;
  }

  function formatTime(ms) {
    return (ms / 1000).toFixed(2);
  }

  function updateTimer() {
    if (!startTime) return;
    var elapsed = Date.now() - startTime;
    timerEl.textContent = '\u23f1 ' + formatTime(elapsed) + '\u79d2';
  }

  function handleTap(cell, num) {
    if (num !== nextNum) {
      cell.classList.add('wrong-tap');
      setTimeout(function() { cell.classList.remove('wrong-tap'); }, 300);
      return;
    }

    if (nextNum === 1) {
      startTime = Date.now();
      timerInterval = setInterval(updateTimer, 10);
    }

    cell.classList.add('cleared');
    nextNum++;
    progressEl.textContent = (nextNum - 1) + ' / 25';

    if (nextNum > 25) {
      finalTime = Date.now() - startTime;
      clearInterval(timerInterval);
      timerEl.textContent = '\u23f1 ' + formatTime(finalTime) + '\u79d2';
      nextEl.textContent = '\u2713';

      setTimeout(function() {
        var timeStr = formatTime(finalTime);
        GameEngine.showGameOver(
          '\u30af\u30ea\u30a2\uff01',
          timeStr,
          '\u79d2',
          '\u65e9\u62bc\u305725',
          '\u26a1 \u65e9\u62bc\u305725\u3092 ' + timeStr + '\u79d2 \u3067\u30af\u30ea\u30a2\u3057\u307e\u3057\u305f\uff01\n1\u304b\u308925\u307e\u3067\u9806\u756a\u306b\u30bf\u30c3\u30d7\u3059\u308b\u30b2\u30fc\u30e0\u306b\u631f\u6226\u3057\u3066\u307f\u3088\u3046\uff01'
        );
      }, 500);
    } else {
      nextEl.textContent = nextNum;
    }
  }

  function createGrid() {
    var numbers = [];
    for (var i = 1; i <= 25; i++) numbers.push(i);
    numbers = shuffle(numbers);
    grid.innerHTML = '';

    for (var j = 0; j < numbers.length; j++) {
      var num = numbers[j];
      var cell = document.createElement('button');
      cell.className = 'speed25-cell';
      cell.textContent = num;
      cell.addEventListener('click', (function(c, n) {
        return function() { handleTap(c, n); };
      })(cell, num));
      grid.appendChild(cell);
    }
  }

  function startGame() {
    nextNum = 1;
    startTime = null;
    finalTime = 0;
    clearInterval(timerInterval);

    timerEl.textContent = '\u23f1 0.00\u79d2';
    progressEl.textContent = '0 / 25';
    nextEl.textContent = '1';

    createGrid();
    GameEngine.showScreen(screen);
  }

  GameEngine.registerGame({
    id: 'speed25',
    name: '\u65e9\u62bc\u305725',
    icon: '\u26a1',
    description: '1\u304b\u308925\u307e\u3067\u9806\u756a\u306b\u30bf\u30c3\u30d7\uff01',
    selfManaged: true,
    startGame: startGame,
    startRound: function() {},
    cleanup: function() { clearInterval(timerInterval); },
    getShareText: function() { return ''; }
  });
})();
