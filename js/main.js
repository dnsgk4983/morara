
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // ==========================================
  // 1. 기본 설정
  // ==========================================

  const SAVE_KEY = "morara-v2-save";
  const MESSAGE_DELAY = 500;

  const stories = window.MORARA_STORY || [];

  const elements = {
    chat: document.getElementById("chat"),
    choices: document.getElementById("choices"),
    freeform: document.getElementById("freeform"),
    answer: document.getElementById("answer"),
    status: document.getElementById("status"),
    day: document.getElementById("day"),
    affection: document.getElementById("affection"),
    restart: document.getElementById("restart"),

    splash: document.getElementById("splash"),
    envelope: document.getElementById("envelope"),
    startStory: document.getElementById("start-story")
  };

  const imagePaths = {
    ocean: "./assets/images/ocean.png",
    game: "./assets/images/game.png",
    music: "./assets/images/music.png",
    football: "./assets/images/football.png",
    memory: "./assets/images/memory.png"
  };

  const PROFILE_IMAGE = "./assets/images/profile.png";

  const createDefaultState = () => ({
    day: 1,
    affection: 0,
    history: [],
    completed: false
  });

  let state = loadState();

  let gameStarted = false;
  let isPlayingMessages = false;
  let sequenceId = 0;

  // ==========================================
  // 2. 저장 및 불러오기
  // ==========================================

  function loadState() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);

      if (!raw) {
        return createDefaultState();
      }

      const saved = JSON.parse(raw);

      if (
        !saved ||
        !Number.isInteger(saved.day) ||
        saved.day < 1 ||
        saved.day > 10 ||
        !Array.isArray(saved.history)
      ) {
        return createDefaultState();
      }

      return {
        ...createDefaultState(),
        ...saved,
        affection: Number.isFinite(saved.affection)
          ? saved.affection
          : 0,
        completed: saved.completed === true
      };
    } catch (error) {
      console.error("저장 데이터 불러오기 실패:", error);
      return createDefaultState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(state)
      );
    } catch (error) {
      console.error("게임 저장 실패:", error);
    }
  }

  // ==========================================
  // 3. 공통 기능
  // ==========================================

  function wait(milliseconds) {
    return new Promise(resolve => {
      setTimeout(resolve, milliseconds);
    });
  }

  function getStory() {
    return stories.find(story => {
      return story.day === state.day;
    });
  }

  function updateStats() {
    elements.day.textContent = `DAY ${state.day} / 10`;
    elements.affection.textContent = `💗 ${state.affection}`;
  }

  function setStatus(message) {
    elements.status.textContent = message;
  }

  function scrollBottom() {
    elements.chat.scrollTop =
      elements.chat.scrollHeight;
  }

  function clearControls() {
    elements.choices.replaceChildren();
    elements.freeform.hidden = true;
  }

  function getTime() {
    return new Date().toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  }

  function cancelSequence() {
    sequenceId++;
    isPlayingMessages = false;
  }

  
  // ==========================================
  // 4. 채팅 메시지 출력
  // ==========================================

  function addMessage(
    speaker,
    text,
    record = true,
    restored = false,
    typing = false
  ) {
    const isMe = speaker === "me";
    const row = document.createElement("div");

    row.className = isMe
      ? "message me"
      : "message morara";

    if (restored) {
      row.classList.add("is-restored");
    }

    if (!isMe) {
      const avatar = document.createElement("img");
      avatar.className = "message-avatar";
      avatar.src = PROFILE_IMAGE;
      avatar.alt = "모라라";

      avatar.onerror = () => {
        avatar.style.display = "none";
      };

      row.appendChild(avatar);
    }

    const content = document.createElement("div");
    content.className = "message-content content";

    if (!isMe) {
      const name = document.createElement("div");
      name.className = "message-name name";
      name.textContent = "모라라";
      content.appendChild(name);
    }

    const bubble = document.createElement("div");
    bubble.className = "bubble";

    if (typing) {
      bubble.classList.add("is-typing");
      bubble.textContent = "● ● ●";
    } else {
      bubble.textContent = text;
    }

    const time = document.createElement("span");
    time.className = "message-time time";
    time.textContent = getTime();

    content.append(bubble, time);
    row.appendChild(content);
    elements.chat.appendChild(row);

    if (record && !typing) {
      state.history.push({
        type: "message",
        speaker,
        text
      });

      saveState();
    }

    scrollBottom();

    return { row, bubble };
  }

  // 모라라의 메시지를 한 글자씩 출력
  async function typeMessage(text, currentSequence) {
    const message = addMessage(
      "morara",
      "",
      false,
      false,
      true
    );

    const bubble = message.bubble;

    // 입력 중 표시
    await wait(550);

    if (currentSequence !== sequenceId) {
      message.row.remove();
      return false;
    }

    bubble.classList.remove("is-typing");
    bubble.textContent = "";

    // 한 글자씩 출력
    for (const character of Array.from(text)) {
      if (currentSequence !== sequenceId) {
        message.row.remove();
        return false;
      }

      bubble.textContent += character;
      scrollBottom();

      await wait(45);
    }

    // 메시지 완성 후 저장
    state.history.push({
      type: "message",
      speaker: "morara",
      text
    });

    saveState();

    return true;
  }


  
  // ==========================================
  // 5. 상황 이미지 출력
  // ==========================================

  function addImage(
    imageKey,
    record = true,
    restored = false
  ) {
    const imagePath =
      typeof imageKey === "string" &&
      /^https:\/\//i.test(imageKey)
        ? imageKey
        : imagePaths[imageKey];

    if (!imagePath) return;

    const row = document.createElement("div");
    row.className = "message morara";

    if (restored) {
      row.classList.add("is-restored");
    }

    const avatar = document.createElement("img");
    avatar.className = "message-avatar";
    avatar.src = PROFILE_IMAGE;
    avatar.alt = "모라라";

    avatar.onerror = () => {
      avatar.style.display = "none";
    };

    const content = document.createElement("div");
    content.className = "message-content content";

    const image = document.createElement("img");
    image.className = "chat-image scene";
    image.src = imagePath;
    image.alt = "스토리 상황 이미지";
    image.loading = "lazy";
    image.decoding = "async";

    image.style.display = "block";
    image.style.width = "auto";
    image.style.height = "auto";
    image.style.maxWidth = "min(100%, 280px)";
    image.style.maxHeight = "220px";
    image.style.objectFit = "contain";
    image.style.borderRadius = "12px";

    image.onload = scrollBottom;

    image.onerror = () => {
      image.style.display = "none";
    };

    content.appendChild(image);
    row.append(avatar, content);
    elements.chat.appendChild(row);

    if (record) {
      state.history.push({
        type: "image",
        imageKey
      });

      saveState();
    }

    scrollBottom();
  }


  
  // ==========================================
  // 6. 메시지 순차 재생
  // ==========================================

  async function playMessages(messages) {
    if (isPlayingMessages) return false;

    isPlayingMessages = true;
    clearControls();

    const currentSequence = ++sequenceId;

    for (const message of messages) {
      await wait(MESSAGE_DELAY);

      if (currentSequence !== sequenceId) {
        return false;
      }

      if (message.type === "image") {
        addImage(message.imageKey);
        continue;
      }

      const completed = await typeMessage(
        message.text,
        currentSequence
      );

      if (!completed) {
        return false;
      }
    }

    if (currentSequence !== sequenceId) {
      return false;
    }

    isPlayingMessages = false;

    return true;
  }


  // ==========================================
  // 7. 선택지
  // ==========================================

  function showChoices(options = []) {
    elements.choices.replaceChildren();

    options.forEach(option => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "choice";
      button.textContent = option.text;

      button.addEventListener("click", () => {
        submitAnswer(option.text, option.score);
      });

      elements.choices.appendChild(button);
    });
  }

  function enableAnswer() {
    const story = getStory();

    if (
      !story ||
      state.completed ||
      isPlayingMessages
    ) {
      return;
    }

    showChoices(story.options);
    elements.freeform.hidden = false;

    setStatus(`${story.day}일차 · ${story.title}`);
  }

  // ==========================================
  // 8. 자유 입력 호감도 평가
  // ==========================================

  function evaluateAnswer(text, story) {
    const answer = text.trim().toLowerCase();

    if (!answer) return 0;

    const positiveWords = [
      "좋아", "고마워", "응원", "멋져",
      "재밌", "함께", "같이", "수고",
      "괜찮", "기대", "도와", "천천히",
      "기억", "최고", "행복"
    ];

    const negativeWords = [
      "싫어", "귀찮", "못해", "별로",
      "바보", "닥쳐", "꺼져", "노잼",
      "관심 없어", "형편없"
    ];

    const topicWords = {
      1: ["안녕", "반가", "이야기", "친해"],
      2: ["마크", "마인크래프트", "건축", "집", "나무"],
      3: ["노래", "음악", "커버", "뮤지컬", "목소리"],
      4: ["축구", "토트넘", "골", "응원", "경기"],
      5: ["개복치", "공주", "귀여워", "바다"],
      6: ["게임", "도전", "다시", "연습", "승리"],
      7: ["공연", "무대", "노래", "관객", "응원"],
      8: ["추억", "기억", "첫날", "즐거", "함께"],
      9: ["내일", "마지막", "추억", "함께", "기념"],
      10: ["고마워", "행복", "기억", "추억", "앞으로"]
    };

    let score = 0;

    for (const word of positiveWords) {
      if (answer.includes(word)) {
        score += 2;
      }
    }

    for (const word of negativeWords) {
      if (answer.includes(word)) {
        score -= 4;
      }
    }

    const keywords = topicWords[story.day] || [];

    for (const word of keywords) {
      if (answer.includes(word)) {
        score += 2;
      }
    }

    if (answer.length >= 12) {
      score += 1;
    }

    if (answer.length >= 25) {
      score += 1;
    }

    if (answer.length < 3) {
      score -= 2;
    }

    return Math.max(-5, Math.min(8, score));
  }

  // ==========================================
  // 9. 모라라의 반응
  // ==========================================

  function getReaction(score) {
    if (score >= 6) {
      return "오! 내 얘기 제대로 들어줬네? 기분 좋은데! 💗";
    }

    if (score >= 3) {
      return "오~ 그거 괜찮은데? 더 얘기해 보자!";
    }

    if (score >= 0) {
      return "흐음~ 그렇구나!";
    }

    return "앗... 그런 말은 조금 서운한걸...";
  }

  
  // ==========================================
  // 10. 답변 처리
  // ==========================================

  async function submitAnswer(
    text,
    fixedScore = null
  ) {
    const story = getStory();

    if (
      !story ||
      !gameStarted ||
      state.completed ||
      isPlayingMessages
    ) {
      return;
    }

    const answer = text.trim();

    if (!answer) return;

    clearControls();
    elements.answer.value = "";

    const score = fixedScore !== null
      ? fixedScore
      : evaluateAnswer(answer, story);

    // 선택지라면 해당 선택지의 전용 반응 사용
    const selectedOption = fixedScore !== null
      ? story.options.find(option => option.text === answer)
      : null;

    let reply;

    if (selectedOption?.reply) {
      reply = selectedOption.reply;
    } else if (score >= 5) {
      reply = story.freeReplies?.good || getReaction(score);
    } else if (score >= 1) {
      reply = story.freeReplies?.normal || getReaction(score);
    } else {
      reply = story.freeReplies?.bad || getReaction(score);
    }

    addMessage("me", answer);

    state.affection = Math.max(
      0,
      state.affection + score
    );

    state.completed = true;

    saveState();
    updateStats();

    const played = await playMessages([
      {
        type: "message",
        text: reply
      }
    ]);

    if (!played) return;

    finishDay();
  }


  // ==========================================
  // 11. 하루 시작
  // ==========================================

  async function startDay() {
    const story = getStory();

    if (!story) {
      setStatus("스토리를 찾을 수 없습니다.");
      return;
    }

    cancelSequence();

    elements.chat.replaceChildren();
    clearControls();

    state.history = [];
    state.completed = false;

    saveState();
    updateStats();

    setStatus(`${story.day}일차 · ${story.title}`);

    const played = await playMessages([
      {
        type: "message",
        text: `오늘은 ${story.theme}에 대해 이야기해 볼까?`
      },
      {
        type: "image",
        imageKey: story.image
      },
      {
        type: "message",
        text: story.prompt
      }
    ]);

    if (!played) return;

    enableAnswer();
  }

  // ==========================================
  // 12. 다음 날 버튼
  // ==========================================

  function showNextDayButton() {
    clearControls();

    const button = document.createElement("button");

    button.type = "button";
    button.className = "choice";
    button.textContent = "다음 날로 넘어가기 →";

    button.addEventListener("click", () => {
      if (state.day >= 10) return;

      state.day += 1;
      state.completed = false;
      state.history = [];

      saveState();
      startDay();
    });

    elements.choices.appendChild(button);
  }

  // ==========================================
  // 13. 하루 종료
  // ==========================================

  function finishDay() {
    state.completed = true;
    saveState();

    clearControls();

    if (state.day >= 10) {
      showEnding();
      return;
    }

    setStatus(`${state.day}일차 대화 완료`);
    showNextDayButton();
  }

  
  // ==========================================
  // 14. 엔딩
  // ==========================================

  function getEnding() {
    if (state.affection >= 50) {
      return {
        type: "happy",
        label: "HAPPY ENDING",
        title: "우리만의 특별한 추억",
        message:
          "함께한 열흘 동안의 모든 순간이 소중했어.\n앞으로도 좋은 추억 많이 만들자!",
        symbol: "♥"
      };
    }

    if (state.affection >= 25) {
      return {
        type: "normal",
        label: "NORMAL ENDING",
        title: "다음에 또 만날 수 있기를",
        message:
          "열흘 동안 함께해 줘서 고마워.\n다음에는 더 많은 이야기를 나눠보자!",
        symbol: "✦"
      };
    }

    return {
      type: "bad",
      label: "DISTANT ENDING",
      title: "조금은 아쉬운 마지막 인사",
      message:
        "서로를 알아가기엔 시간이 조금 부족했나 봐.\n그래도 함께해 준 순간은 기억할게.",
      symbol: "☾"
    };
  }

  function showEnding() {
    clearControls();

    const ending = getEnding();

    setStatus("열흘의 이야기 완료");

    // 중복 결과 화면 방지
    document.getElementById("ending-screen")?.remove();

    const screen = document.createElement("div");
    screen.id = "ending-screen";
    screen.className = `ending-screen ending-screen--${ending.type}`;

    const card = document.createElement("div");
    card.className = "ending-card";

    const eyebrow = document.createElement("p");
    eyebrow.className = "ending-card__eyebrow";
    eyebrow.textContent = "OUR STORY, OUR MEMORIES";

    const brand = document.createElement("h1");
    brand.className = "ending-card__brand";
    brand.textContent = "Dear Morara";

    const subtitle = document.createElement("p");
    subtitle.className = "ending-card__subtitle";
    subtitle.textContent =
      "열흘의 이야기가 하나의 추억이 되었습니다.";

    const result = document.createElement("div");
    result.className = "ending-card__result";

    const symbol = document.createElement("div");
    symbol.className = "ending-card__symbol";
    symbol.textContent = ending.symbol;

    const label = document.createElement("p");
    label.className = "ending-card__label";
    label.textContent = ending.label;

    const title = document.createElement("h2");
    title.className = "ending-card__title";
    title.textContent = ending.title;

    const message = document.createElement("p");
    message.className = "ending-card__message";
    message.textContent = ending.message;

    const score = document.createElement("p");
    score.className = "ending-card__score";
    score.textContent =
      `AFFECTION ${state.affection}  ·  10 DAYS`;

    result.append(
      symbol,
      label,
      title,
      message,
      score
    );

    const restartButton = document.createElement("button");
    restartButton.type = "button";
    restartButton.className = "ending-card__restart";
    restartButton.textContent = "처음부터 다시 만나기";

    restartButton.addEventListener("click", () => {
      const confirmed = confirm(
        "처음부터 다시 시작하시겠습니까?\n" +
        "현재 진행 기록이 초기화됩니다."
      );

      if (!confirmed) return;

      screen.remove();
      cancelSequence();

      localStorage.removeItem(SAVE_KEY);
      state = createDefaultState();

      elements.chat.replaceChildren();
      clearControls();
      updateStats();

      startDay();
    });

    const footer = document.createElement("p");
    footer.className = "ending-card__footer";
    footer.textContent = "A FAN-MADE BIRTHDAY STORY";

    card.append(
      eyebrow,
      brand,
      subtitle,
      result,
      restartButton,
      footer
    );

    screen.appendChild(card);
    document.body.appendChild(screen);
  }


  function showEnding() {
    clearControls();

    const ending = getEnding();

    setStatus(ending);

    const endingText =
      `10일 동안 함께해 줘서 고마워!\n${ending}`;

    const alreadyShown = state.history.some(entry => {
      return (
        entry.type === "message" &&
        entry.text === endingText
      );
    });

    if (!alreadyShown) {
      addMessage("morara", endingText);
    }

    saveState();
  }

  
  // ==========================================
  // 15. 저장된 채팅 복원
  // ==========================================

  function renderHistory() {
    elements.chat.replaceChildren();

    for (const entry of state.history) {
      if (entry.type === "message") {
        addMessage(
          entry.speaker,
          entry.text,
          false,
          true
        );
      }

      if (entry.type === "image") {
        addImage(
          entry.imageKey,
          false,
          true
        );
      }
    }
  }

  async function restoreGame() {
    cancelSequence();
    clearControls();
    updateStats();

    const story = getStory();

    if (!story) {
      setStatus("스토리를 찾을 수 없습니다.");
      return;
    }

    // 완료한 날짜는 기존 기록 복원
    if (state.completed) {
      renderHistory();

      if (state.day >= 10) {
        showEnding();
      } else {
        setStatus(`${state.day}일차 대화 완료`);
        showNextDayButton();
      }

      return;
    }

    // 진행 중인 날짜는 처음부터 순차 재생
    // (새로고침한 경우에도 채팅이 하나씩 등장)
    state.history = [];
    saveState();

    await startDay();
  }


  // ==========================================
  // 16. 처음부터 시작
  // ==========================================

  function restartGame() {
    const confirmed = confirm(
      "정말 처음부터 시작하시겠습니까?\n" +
      "모든 진행 기록과 호감도가 초기화됩니다."
    );

    if (!confirmed) return;

    cancelSequence();

    localStorage.removeItem(SAVE_KEY);

    state = createDefaultState();

    clearControls();
    elements.chat.replaceChildren();

    updateStats();

    if (gameStarted) {
      startDay();
    }
  }

  
  // ==========================================
  // 17. 스플래시 화면
  // ==========================================

  function initializeSplash() {
    const splash = elements.splash;
    const envelope = elements.envelope;
    const startButton = elements.startStory;

    if (!splash || !envelope || !startButton) {
      launchGame();
      return;
    }

    document.body.style.overflow = "hidden";

    envelope.addEventListener("click", () => {
      if (splash.classList.contains("is-open")) {
        return;
      }

      splash.classList.add("is-open");

      envelope.setAttribute(
        "aria-expanded",
        "true"
      );
    });

    startButton.addEventListener("click", async () => {
      if (gameStarted) return;

      startButton.disabled = true;
      splash.classList.add("is-hidden");

      // 스플래시가 완전히 사라질 때까지 대기
      await wait(700);

      splash.remove();
      document.body.style.overflow = "";

      launchGame();
    });
  }


  // ==========================================
  // 18. 게임 실행
  // ==========================================

  function launchGame() {
    if (gameStarted) return;

    gameStarted = true;

    restoreGame();
  }

  // ==========================================
  // 19. 이벤트 연결
  // ==========================================

  elements.freeform.addEventListener(
    "submit",
    event => {
      event.preventDefault();

      const answer = elements.answer.value.trim();

      if (!answer) return;

      submitAnswer(answer);
    }
  );

  elements.restart.addEventListener(
    "click",
    restartGame
  );

  // ==========================================
  // 20. 최초 실행
  // ==========================================

  updateStats();
  clearControls();

  initializeSplash();
});
