(() => {
  "use strict";

  const BANKS = [
    {
      id: "analects",
      name: "论语篇",
      shortName: "论语",
      description: "章句与白话释义",
      pairs: [
        {
          id: "a1",
          left: "学而时习之，不亦说乎？",
          right: "学习后按时温习，也是愉快的",
          note: "“说”通“悦”，指内心喜悦。学习与实践相互印证，才会产生真正的收获感。"
        },
        {
          id: "a2",
          left: "温故而知新",
          right: "复习旧知，从而获得新理解",
          note: "“故”指学过的知识。复习不是重复，而是把旧知识放进新的问题中重新理解。"
        },
        {
          id: "a3",
          left: "学而不思则罔",
          right: "只学习不思考就会迷惑",
          note: "“罔”意为迷惑而无所得。学习与思考需要同时发生。"
        },
        {
          id: "a4",
          left: "三人行，必有我师焉",
          right: "身边总有人值得我学习",
          note: "“师”在这里指值得学习的人。善于学习的人，总能从他人身上发现长处。"
        },
        {
          id: "a5",
          left: "知之者不如好之者",
          right: "懂得它的人不如喜爱它的人",
          note: "兴趣能让人从被动知道走向主动投入，是持续学习的重要动力。"
        },
        {
          id: "a6",
          left: "逝者如斯夫，不舍昼夜",
          right: "时光像流水一样日夜不停",
          note: "孔子借流水感叹时间流逝，提醒人们珍惜当下、不断进取。"
        }
      ]
    },
    {
      id: "words",
      name: "实词篇",
      shortName: "实词",
      description: "古今含义辨析",
      pairs: [
        {
          id: "w1",
          left: "走",
          right: "跑",
          note: "古汉语中的“走”多指跑，如“弃甲曳兵而走”。现代“走”通常指步行。"
        },
        {
          id: "w2",
          left: "去",
          right: "离开",
          note: "“去国怀乡”中的“去”是离开，不是前往。阅读时需要结合语境判断古今义。"
        },
        {
          id: "w3",
          left: "汤",
          right: "热水",
          note: "“赴汤蹈火”中的“汤”指热水。这个成语用沸水和烈火比喻极端危险。"
        },
        {
          id: "w4",
          left: "妻子",
          right: "妻子和儿女",
          note: "古汉语中的“妻子”是两个词，指妻子和儿女，与现代汉语单一含义不同。"
        },
        {
          id: "w5",
          left: "卑鄙",
          right: "身份低微、见识短浅",
          note: "《出师表》中“先帝不以臣卑鄙”指身份低微，并非现代意义上的品行恶劣。"
        },
        {
          id: "w6",
          left: "交通",
          right: "交错相通",
          note: "《桃花源记》中的“阡陌交通”形容田间小路交错相通。"
        }
      ]
    },
    {
      id: "fables",
      name: "寓言篇",
      shortName: "寓言",
      description: "成语与寓意相配",
      pairs: [
        {
          id: "f1",
          left: "刻舟求剑",
          right: "不懂变化，拘泥旧法",
          note: "船上刻记号寻找移动的剑，比喻办事不看变化，仍按旧办法处理问题。"
        },
        {
          id: "f2",
          left: "掩耳盗铃",
          right: "自欺欺人",
          note: "捂住自己的耳朵不等于别人也听不见，比喻用欺骗自己的方式掩盖事实。"
        },
        {
          id: "f3",
          left: "守株待兔",
          right: "死守经验，不主动努力",
          note: "偶然得到一次兔子后便守着树桩，比喻把偶然当成必然，不肯主动付出。"
        },
        {
          id: "f4",
          left: "矛与盾",
          right: "言行前后矛盾",
          note: "既说矛无坚不摧，又说盾无物能破，形成无法同时成立的矛盾。"
        },
        {
          id: "f5",
          left: "画蛇添足",
          right: "做多余的事反而不妥",
          note: "蛇本来没有脚，先画好的人又添上脚，比喻多此一举，反而失去原本的优势。"
        },
        {
          id: "f6",
          left: "井底之蛙",
          right: "见识狭窄",
          note: "长期生活在井底的青蛙只能看到井口大小的天空，比喻受环境限制而眼界狭窄。"
        }
      ]
    }
  ];

  const elements = {
    bankTabs: document.querySelector("#bankTabs"),
    restartButton: document.querySelector("#restartButton"),
    restartTopButton: document.querySelector("#restartTopButton"),
    boardHeading: document.querySelector("#boardHeading"),
    boardCounter: document.querySelector("#boardCounter"),
    matchBoard: document.querySelector("#matchBoard"),
    timerValue: document.querySelector("#timerValue"),
    scoreValue: document.querySelector("#scoreValue"),
    streakValue: document.querySelector("#streakValue"),
    progressValue: document.querySelector("#progressValue"),
    progressBar: document.querySelector("#progressBar"),
    feedbackBar: document.querySelector("#feedbackBar"),
    feedbackTitle: document.querySelector("#feedbackTitle"),
    feedbackText: document.querySelector("#feedbackText"),
    progressRing: document.querySelector("#progressRing"),
    ringValue: document.querySelector("#ringValue"),
    progressCaption: document.querySelector("#progressCaption"),
    statusBadge: document.querySelector("#statusBadge"),
    achievementCard: document.querySelector("#achievementCard"),
    achievementTitle: document.querySelector("#achievementTitle"),
    achievementText: document.querySelector("#achievementText"),
    knowledgeNote: document.querySelector("#knowledgeNote"),
    noteSource: document.querySelector("#noteSource"),
    bestTime: document.querySelector("#bestTime"),
    errorValue: document.querySelector("#errorValue"),
    resultOverlay: document.querySelector("#resultOverlay"),
    closeResultButton: document.querySelector("#closeResultButton"),
    closeResult: document.querySelector("#closeResult"),
    playAgainButton: document.querySelector("#playAgainButton"),
    resultTime: document.querySelector("#resultTime"),
    resultScore: document.querySelector("#resultScore"),
    resultStreak: document.querySelector("#resultStreak"),
    resultErrors: document.querySelector("#resultErrors"),
    resultAchievement: document.querySelector("#resultAchievement"),
    toast: document.querySelector("#toast")
  };

  let currentBankIndex = 0;
  let cards = [];
  let selectedCardId = null;
  let matchedPairs = new Set();
  let score = 0;
  let streak = 0;
  let maxStreak = 0;
  let errors = 0;
  let elapsed = 0;
  let timer = null;
  let timerStarted = false;
  let locked = false;
  let roundVersion = 0;
  let toastTimer = null;

  function currentBank() {
    return BANKS[currentBankIndex];
  }

  function shuffle(items) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
    }
    return copy;
  }

  function buildCards(bank) {
    return shuffle(
      bank.pairs.flatMap((pair) => [
        {
          id: `${pair.id}-left`,
          pairId: pair.id,
          side: "left",
          text: pair.left
        },
        {
          id: `${pair.id}-right`,
          pairId: pair.id,
          side: "right",
          text: pair.right
        }
      ])
    );
  }

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function startTimer() {
    if (timerStarted || matchedPairs.size === currentBank().pairs.length) {
      return;
    }
    timerStarted = true;
    timer = window.setInterval(() => {
      elapsed += 1;
      elements.timerValue.textContent = formatTime(elapsed);
    }, 1000);
  }

  function stopTimer() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function renderBankTabs() {
    elements.bankTabs.innerHTML = BANKS.map(
      (bank, index) => `
        <button
          class="bank-tab ${index === currentBankIndex ? "is-active" : ""}"
          type="button"
          data-bank-index="${index}"
          aria-pressed="${index === currentBankIndex}"
        >
          <span>${bank.shortName}</span>
          <small>${bank.description}</small>
        </button>
      `
    ).join("");
    elements.bankTabs.querySelectorAll(".bank-tab").forEach((button) => {
      button.addEventListener("click", () => {
        const nextIndex = Number(button.dataset.bankIndex);
        if (nextIndex !== currentBankIndex) {
          currentBankIndex = nextIndex;
          startRound();
        }
      });
    });
  }

  function cardSizeClass(text) {
    if (text.length > 18) {
      return "is-very-long";
    }
    if (text.length > 11) {
      return "is-long";
    }
    return "";
  }

  function renderBoard() {
    elements.matchBoard.innerHTML = cards
      .map((card) => {
        const isMatched = matchedPairs.has(card.pairId);
        return `
          <button
            class="match-card ${cardSizeClass(card.text)} ${isMatched ? "is-matched" : ""} ${selectedCardId === card.id ? "is-selected" : ""}"
            type="button"
            data-card-id="${card.id}"
            data-pair-id="${card.pairId}"
            ${isMatched ? "disabled" : ""}
            aria-pressed="${selectedCardId === card.id}"
          >
            <span class="card-side">${card.side === "left" ? "原文" : "释义"}</span>
            <span class="card-text">${card.text}</span>
            <span class="card-mark">
              <i data-lucide="${isMatched ? "check" : selectedCardId === card.id ? "link-2" : "circle"}"></i>
            </span>
          </button>
        `;
      })
      .join("");

    elements.matchBoard.querySelectorAll(".match-card").forEach((button) => {
      button.addEventListener("click", () => selectCard(button.dataset.cardId));
    });
    refreshIcons();
  }

  function selectCard(cardId) {
    if (locked || matchedPairs.has(cards.find((card) => card.id === cardId)?.pairId)) {
      return;
    }
    startTimer();

    if (selectedCardId === cardId) {
      selectedCardId = null;
      renderBoard();
      return;
    }

    if (!selectedCardId) {
      selectedCardId = cardId;
      const card = cards.find((item) => item.id === cardId);
      showFeedback("已选中一张卡片", `继续选择与“${card.text.slice(0, 12)}${card.text.length > 12 ? "…" : ""}”相对应的内容。`, "neutral");
      renderBoard();
      return;
    }

    const first = cards.find((card) => card.id === selectedCardId);
    const second = cards.find((card) => card.id === cardId);
    locked = true;
    const isMatch =
      first.pairId === second.pairId &&
      first.side !== second.side;

    if (isMatch) {
      matchedPairs.add(first.pairId);
      streak += 1;
      maxStreak = Math.max(maxStreak, streak);
      score += 100 + streak * 20;
      selectedCardId = null;
      locked = false;
      showFeedback("配对正确", currentBank().pairs.find((pair) => pair.id === first.pairId).note, "correct");
      setKnowledgeNote(currentBank().pairs.find((pair) => pair.id === first.pairId).note);
      updateStats();
      renderBoard();
      if (matchedPairs.size === currentBank().pairs.length) {
        finishRound();
      }
      return;
    }

    errors += 1;
    streak = 0;
    score = Math.max(0, score - 20);
    showFeedback("这次没有连上", "两张卡片不属于同一知识点，再观察原句与释义之间的关键词。", "error");
    markCardsError(first.id, second.id);

    const activeVersion = roundVersion;
    window.setTimeout(() => {
      if (activeVersion !== roundVersion) {
        return;
      }
      selectedCardId = null;
      locked = false;
      updateStats();
      renderBoard();
    }, 760);
  }

  function markCardsError(firstId, secondId) {
    [firstId, secondId].forEach((id) => {
      const card = elements.matchBoard.querySelector(`[data-card-id="${id}"]`);
      card?.classList.add("is-error");
    });
    updateStats();
  }

  function updateStats() {
    const total = currentBank().pairs.length;
    const percent = Math.round((matchedPairs.size / total) * 100);
    elements.timerValue.textContent = formatTime(elapsed);
    elements.scoreValue.textContent = String(score);
    elements.streakValue.textContent = String(streak);
    elements.progressValue.textContent = `${matchedPairs.size} / ${total}`;
    elements.progressBar.style.width = `${percent}%`;
    elements.progressRing.style.setProperty("--progress", `${percent}%`);
    elements.ringValue.textContent = `${percent}%`;
    elements.progressCaption.textContent = `已完成 ${matchedPairs.size} 组，还剩 ${total - matchedPairs.size} 组。`;
    elements.errorValue.textContent = String(errors);

    if (matchedPairs.size > 0) {
      elements.achievementCard.classList.add("is-unlocked");
      elements.achievementTitle.textContent = "句读初成";
      elements.achievementText.textContent = `本轮已连接 ${matchedPairs.size} 组知识点。`;
    }
  }

  function showFeedback(title, text, type) {
    elements.feedbackTitle.textContent = title;
    elements.feedbackText.textContent = text;
    elements.feedbackBar.dataset.type = type;
    elements.feedbackBar.querySelector(".feedback-icon").innerHTML =
      type === "correct"
        ? '<i data-lucide="check"></i>'
        : type === "error"
          ? '<i data-lucide="x"></i>'
          : '<i data-lucide="mouse-pointer-click"></i>';
    refreshIcons();
  }

  function setKnowledgeNote(note) {
    elements.knowledgeNote.textContent = note;
    elements.noteSource.textContent = `${currentBank().name} · 知识小笺`;
  }

  function finishRound() {
    stopTimer();
    const finalScore = score + 200;
    score = finalScore;
    elements.resultTime.textContent = formatTime(elapsed);
    elements.resultScore.textContent = String(score);
    elements.resultStreak.textContent = String(maxStreak);
    elements.resultErrors.textContent = String(errors);
    elements.resultAchievement.textContent =
      errors === 0 ? "字字珠玑" : maxStreak >= 3 ? "文心初成" : "勤学有得";
    elements.statusBadge.textContent = "已完成";
    elements.bestTime.textContent = formatTime(elapsed);
    localStorage.setItem(
      `classic-match-v1-${currentBank().id}`,
      JSON.stringify({ bestTime: elapsed, bestScore: score, errors })
    );
    elements.resultOverlay.hidden = false;
    elements.playAgainButton.focus();
    refreshIcons();
  }

  function startRound() {
    roundVersion += 1;
    stopTimer();
    selectedCardId = null;
    matchedPairs = new Set();
    score = 0;
    streak = 0;
    maxStreak = 0;
    errors = 0;
    elapsed = 0;
    timerStarted = false;
    locked = false;
    cards = buildCards(currentBank());
    elements.boardHeading.textContent = currentBank().name;
    elements.boardCounter.textContent = `${cards.length} 张卡片`;
    elements.statusBadge.textContent = "进行中";
    elements.achievementCard.classList.remove("is-unlocked");
    elements.achievementTitle.textContent = "初入句读";
    elements.achievementText.textContent = "完成第一组配对，点亮本轮成就。";
    elements.knowledgeNote.textContent = "每一次正确连线后，这里会留下对应的知识解释。";
    elements.noteSource.textContent = "句读 · 学习手记";
    elements.bestTime.textContent = getStoredBest(currentBank().id);
    elements.resultOverlay.hidden = true;
    showFeedback("选择一张卡片开始", "找到原句与对应释义，连续配对可以提升得分。", "neutral");
    renderBankTabs();
    updateStats();
    renderBoard();
  }

  function getStoredBest(bankId) {
    try {
      const best = JSON.parse(localStorage.getItem(`classic-match-v1-${bankId}`));
      return best ? formatTime(best.bestTime) : "—";
    } catch {
      return "—";
    }
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    elements.toast.textContent = message;
    elements.toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => {
      elements.toast.classList.remove("is-visible");
    }, 2200);
  }

  function refreshIcons() {
    window.lucide?.createIcons({
      attrs: { "aria-hidden": "true" }
    });
  }

  function bindEvents() {
    elements.restartButton.addEventListener("click", startRound);
    elements.restartTopButton.addEventListener("click", () => {
      startRound();
      showToast("本局已重新开始");
    });
    elements.closeResultButton.addEventListener("click", () => {
      elements.resultOverlay.hidden = true;
    });
    elements.closeResult.addEventListener("click", () => {
      elements.resultOverlay.hidden = true;
    });
    elements.playAgainButton.addEventListener("click", startRound);
    elements.resultOverlay.addEventListener("click", (event) => {
      if (event.target === elements.resultOverlay) {
        elements.resultOverlay.hidden = true;
      }
    });
  }

  function init() {
    bindEvents();
    startRound();
    window.__CLASSIC_MATCH__ = {
      banks: BANKS,
      getState: () => ({
        bankIndex: currentBankIndex,
        cards: cards.map((card) => ({ ...card })),
        matchedPairs: [...matchedPairs],
        score,
        streak,
        errors,
        elapsed
      }),
      selectCard
    };
  }

  init();
})();
