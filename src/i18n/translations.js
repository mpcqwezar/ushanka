export const translations = {
  ru: {
    brand: 'Ушанка',
    langToggle: 'EN',
    langToggleAria: 'Switch to English',
    themeToDarkAria: 'Включить тёмную тему',
    themeToLightAria: 'Включить светлую тему',

    resumeTitle: 'Есть незаконченная игра',
    resumeContinue: 'Продолжить',
    resumeNew: 'Новая игра',

    players: 'Игроки',
    playerPlaceholder: 'Имя игрока',
    add: 'Добавить',
    defaultPlayer: (n) => `Игрок ${n}`,
    minPlayers: 'Нужно минимум 2 игрока',
    maxPlayers: 'Максимум игроков',

    customWords: 'Свои слова',
    customWordsHint: (n) =>
      `В игре уже есть базовый словарь (${n} слов). Ниже — только то, что добавите вы.`,
    customWordPlaceholder: 'Добавить своё слово',
    noCustomWords: 'Своих слов пока нет',

    settings: 'Настройки',
    roundTime: 'Время хода (сек)',
    wordsToPlay: 'Слов в партии',
    wordsAvailable: (n) => `Всего доступно: ${n}`,

    scoringTitle: 'Как считаются очки',
    scoringRule1:
      'За каждое угаданное слово: +1 объясняющему и +1 угадавшему',
    scoringRule2: '«Пропустить» — слово уходит в конец шляпы, ход продолжается',
    scoringRule3: '«Завершить ход» — ход сразу переходит к следующему игроку',

    startGame: 'Начать игру',

    round: (n) => `Круг ${n}`,
    scores: 'Очки',
    more: 'ещё',

    passLabel: 'Передай телефон',
    passHint:
      'Нажми «Готов», когда телефон у объясняющего. Слушатель будет выбран случайно — слово покажется только после старта.',
    passScoring: 'Очки: +1 объясняющему и +1 угадавшему за каждое слово',
    ready: 'Готов',
    endGame: 'Конец игры',

    lastWord: 'Последнее слово!',
    seconds: (n) => `${n}с`,
    wordLabel: 'Слово',
    wordHint: 'Объясни, не называя само слово',
    guessed: 'Угадали',
    skip: 'Пропустить',
    endTurn: 'Завершить ход',
    guessedList: (n) => `Угаданные (${n})`,

    scoresTitle: 'Очки',
    scoresNote: 'За каждое угаданное слово: +1 объясняющему и +1 угадавшему',
    close: 'Закрыть',
    guessedWordsTitle: 'Угаданные слова',
    emptyGuessed: 'Пока пусто',

    gameOver: 'Игра окончена',
    winner: 'Победитель',
    points: (n) => `${n} очк.`,
    standings: 'Итоги',
    statGuessed: 'Угадано',
    statInHat: 'В шляпе',
    statRounds: 'Кругов',
    statProgress: 'Прогресс',
    notGuessed: 'Не угаданы',
    guessedSummary: 'Угаданные',
    playAgain: 'Играть снова',
  },

  en: {
    brand: 'Ushanka',
    langToggle: 'RU',
    langToggleAria: 'Переключить на русский',
    themeToDarkAria: 'Switch to dark theme',
    themeToLightAria: 'Switch to light theme',

    resumeTitle: 'You have an unfinished game',
    resumeContinue: 'Continue',
    resumeNew: 'New game',

    players: 'Players',
    playerPlaceholder: 'Player name',
    add: 'Add',
    defaultPlayer: (n) => `Player ${n}`,
    minPlayers: 'At least 2 players required',
    maxPlayers: 'Maximum players reached',

    customWords: 'Custom words',
    customWordsHint: (n) =>
      `A base dictionary of ${n} words is included. Below — only words you add.`,
    customWordPlaceholder: 'Add your own word',
    noCustomWords: 'No custom words yet',

    settings: 'Settings',
    roundTime: 'Turn time (sec)',
    wordsToPlay: 'Words in game',
    wordsAvailable: (n) => `Available: ${n}`,

    scoringTitle: 'How scoring works',
    scoringRule1: 'Each guessed word: +1 to explainer and +1 to guesser',
    scoringRule2: '“Skip” — word goes to the end of the hat, turn continues',
    scoringRule3: '“End turn” — pass the phone to the next player',

    startGame: 'Start game',

    round: (n) => `Round ${n}`,
    scores: 'Scores',
    more: 'more',

    passLabel: 'Pass the phone',
    passHint:
      'Tap “Ready” when the explainer has the phone. A listener is chosen at random — the word appears only after start.',
    passScoring: 'Scores: +1 to explainer and +1 to guesser per word',
    ready: 'Ready',
    endGame: 'End game',

    lastWord: 'Last word!',
    seconds: (n) => `${n}s`,
    wordLabel: 'Word',
    wordHint: 'Explain without saying the word',
    guessed: 'Guessed',
    skip: 'Skip',
    endTurn: 'End turn',
    guessedList: (n) => `Guessed (${n})`,

    scoresTitle: 'Scores',
    scoresNote: 'Each guessed word: +1 to explainer and +1 to guesser',
    close: 'Close',
    guessedWordsTitle: 'Guessed words',
    emptyGuessed: 'Nothing yet',

    gameOver: 'Game over',
    winner: 'Winner',
    points: (n) => `${n} pts`,
    standings: 'Standings',
    statGuessed: 'Guessed',
    statInHat: 'In hat',
    statRounds: 'Rounds',
    statProgress: 'Progress',
    notGuessed: 'Not guessed',
    guessedSummary: 'Guessed words',
    playAgain: 'Play again',
  },
};
