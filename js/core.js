var GameEngine = (function() {
  var games = {};
  var activeGameId = null;
  var score = 0;
  var timeLeft = 0;
  var timerInterval = null;
  var canAnswer = true;
  var GAME_DURATION = 60;

  var els = {};

  function showScreen(screen) {
    els.titleScreen.classList.remove('active');
    els.gameScreen.classList.remove('active');
    els.gameoverScreen.classList.remove('active');
    screen.classList.add('active');
  }

  function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
  }

  function updateTimer() {
    timeLeft--;
    els.timerText.textContent = timeLeft;
    els.timerBar.style.width = (timeLeft / GAME_DURATION * 100) + '%';

    if (timeLeft <= 10) {
      els.timerText.style.color = '#e94560';
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }

  function updateScoreDisplay() {
    els.scoreText.textContent = '\u30b9\u30b3\u30a2: ' + score;
  }

  function showFeedback(isCorrect) {
    if (isCorrect) {
      els.feedback.textContent = '\u2b55 \u6b63\u89e3\uff01';
      els.feedback.className = 'feedback correct-text';
    } else {
      els.feedback.textContent = '\u274c \u306f\u305a\u308c\u2026';
      els.feedback.className = 'feedback wrong-text';
    }
  }

  function clearFeedback() {
    els.feedback.textContent = '';
    els.feedback.className = 'feedback';
  }

  function handleAnswer(isCorrect) {
    if (!canAnswer) return;
    canAnswer = false;

    if (isCorrect) {
      score++;
      updateScoreDisplay();
    }
    showFeedback(isCorrect);

    setTimeout(function() {
      if (timeLeft > 0) {
        canAnswer = true;
        clearFeedback();
        games[activeGameId].startRound(els.gameContainer, handleAnswer);
      }
    }, 600);
  }

  function selectGame(gameId) {
    activeGameId = gameId;
    startSession();
  }

  function startSession() {
    score = 0;
    timeLeft = GAME_DURATION;
    canAnswer = true;
    updateScoreDisplay();
    els.timerText.textContent = GAME_DURATION;
    els.timerText.style.color = '#eee';
    els.timerBar.style.width = '100%';
    clearFeedback();

    showScreen(els.gameScreen);
    games[activeGameId].startRound(els.gameContainer, handleAnswer);
    startTimer();
  }

  function endGame() {
    canAnswer = false;
    if (games[activeGameId] && games[activeGameId].cleanup) {
      games[activeGameId].cleanup();
    }
    els.finalScore.textContent = score;
    showScreen(els.gameoverScreen);
  }

  function returnToTitle() {
    showScreen(els.titleScreen);
  }

  // Share
  function showCopied() {
    els.shareBtn.textContent = '\u30b3\u30d4\u30fc\u3057\u307e\u3057\u305f\uff01';
    setTimeout(function() {
      els.shareBtn.textContent = '\u7d50\u679c\u3092\u30b7\u30a7\u30a2';
    }, 2000);
  }

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showCopied();
  }

  function fallbackShare(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(showCopied).catch(function() {
        legacyCopy(text);
      });
    } else {
      legacyCopy(text);
    }
  }

  function shareResult() {
    var game = games[activeGameId];
    var text = game.getShareText(score);

    if (navigator.share) {
      navigator.share({ title: game.name, text: text }).catch(function() {
        fallbackShare(text);
      });
    } else {
      fallbackShare(text);
    }
  }

  // Title screen
  function buildTitleScreen() {
    var container = els.gameSelectButtons;
    if (!container) return;
    container.innerHTML = '';

    var ids = Object.keys(games);
    for (var i = 0; i < ids.length; i++) {
      var game = games[ids[i]];
      var btn = document.createElement('button');
      btn.className = 'game-select-btn';
      btn.innerHTML =
        '<span class="game-icon">' + game.icon + '</span>' +
        '<span class="game-info">' +
          '<span class="game-name">' + game.name + '</span>' +
          '<span class="game-desc">' + game.description + '</span>' +
        '</span>';
      btn.addEventListener('click', (function(id) {
        return function() { selectGame(id); };
      })(game.id));
      container.appendChild(btn);
    }
  }

  // Init
  document.addEventListener('DOMContentLoaded', function() {
    els.titleScreen = document.getElementById('title-screen');
    els.gameScreen = document.getElementById('game-screen');
    els.gameoverScreen = document.getElementById('gameover-screen');
    els.timerText = document.getElementById('timer-text');
    els.timerBar = document.getElementById('timer-bar');
    els.scoreText = document.getElementById('score-text');
    els.gameContainer = document.getElementById('game-container');
    els.feedback = document.getElementById('feedback');
    els.finalScore = document.getElementById('final-score');
    els.shareBtn = document.getElementById('share-btn');
    els.retryBtn = document.getElementById('retry-btn');
    els.gameSelectButtons = document.getElementById('game-select-buttons');

    els.shareBtn.addEventListener('click', shareResult);
    els.retryBtn.addEventListener('click', returnToTitle);

    buildTitleScreen();
  });

  return {
    registerGame: function(plugin) {
      games[plugin.id] = plugin;
      if (els.gameSelectButtons) {
        buildTitleScreen();
      }
    },
    getGames: function() { return games; },
    getScore: function() { return score; }
  };
})();
