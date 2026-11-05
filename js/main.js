
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // ========================================
  // 기본 설정
  // ========================================

  const SAVE_KEY = "morara-v2-save";

  const stories = window.MORARA_STORY || [];

  const elements = {
    chat: document.getElementById("chat"),
    choices: document.getElementById("choices"),
    freeform: document.getElementById("freeform"),
    answer: document.getElementById("answer"),
    status: document.getElementById("status"),
    day: document.getElementById("day"),
    affection: document.getElementById("affection"),
    restart: document.getElementById("restart")
  };

  const imagePaths = {
    ocean: "./assets/images/ocean.png",
    game: "./assets/images/game.png",
    music: "./assets/images/music.png",
    football: "./assets/images/football.png",
    memory: "./assets/images/memory.png"
  };

  const defaultState = () => ({
    day: 1,
    affection: 0,
    history: [],
    completed: false
  });

  let state = load();

  // ========================================
  // 저장 및 불러오기
  // ========================================

  function load() {
    try {
      const saved = JSON.parse(
        localStorage.getItem(SAVE_KEY)
      );

      if (
        saved &&
        Number.isInteger(saved.day) &&
        saved.day >= 1 &&
        saved.day <= 10 &&
        Array.isArray(saved.history)
      ) {
        return {
          ...defaultState(),
          ...saved
        };
      }
    } catch (error) {
      console.warn("저장 데이터 복원 실패:", error);
    }

    return defaultState();
  }

  function save() {
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify(state)
    );
  }

  // ========================================
  // 화면 업데이트
  // ========================================

  function updateStats() {
    elements.day.textContent =
      `DAY ${state.day} / 10`;

    elements.affection.textContent =
      `💗 ${state.affection}`;
  }

  function setStatus(text) {
    elements.status.textContent = text;
  }

  function scrollBottom() {
    elements.chat.scrollTop =
      elements.chat.scrollHeight;
  }

  // ========================================
  // 채팅 메시지
  // ========================================

  function addMessage(speaker, text, record = true) {
    const row = document.createElement("div");

    const isMe = speaker === "me";

    row.className =
      `message ${isMe ? "me" : "morara"}`;

    if (!isMe) {
      const avatar = document.createElement("img");

      avatar.className = "message-avatar";
      avatar.src = "./assets/images/profile.png";
      avatar.alt = "모라라";

      avatar.onerror = () => {
        avatar.onerror = null;
        avatar.style.display = "none";
      };

      row.appendChild(avatar);
    }

    const content = document.createElement("div");
    content.className = "message-content";

    if (!isMe) {
      const name = document.createElement("div");
      name.className = "message-name";
      name.textContent = "모라라";
      content.appendChild(name);
    }

    const body = document.createElement("div");
    body.className = "message-body";

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = text;

    const time = document.createElement("span");
    time.className = "message-time";

    time.textContent = new Date().toLocaleTimeString(
      "ko-KR",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }
    );

    body.append(bubble, time);
    content.appendChild(body);
    row.appendChild(content);

    elements.chat.appendChild(row);

    if (record) {
      state.history.push({
        type: "message",
        speaker,
        text
      });

      save();
    }

    scrollBottom();
  }

  // ========================================
  // 상황별 이미지
  // ========================================

  function addImage(imageKey, record = true) {
    const src = imagePaths[imageKey];

    if (!src) return;

    const row = document.createElement("div");
    row.className = "message morara";

    const avatar = document.createElement("img");
    avatar.className = "message-avatar";
    avatar.src = "./assets/images/profile.png";
    avatar.alt = "모라라";

    avatar.onerror = () => {
      avatar.onerror = null;
      avatar.style.display = "none";
    };

    const content = document.createElement("div");
    content.className = "message-content";

    const image = document.createElement("img");
    image.className = "chat-image";
    image.src = src;
    image.alt = `${imageKey} 상황 이미지`;

    image.onload = scrollBottom;

    image.onerror = () => {
      image.onerror = null;
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

      save();
    }

    scrollBottom();
  }

  // ========================================
  // 선택지 표시
  // ========================================

  function showChoices(options) {
    elements.choices.replaceChildren();

    options.forEach(option => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "choice";
      button.textContent = option.text;

      button.addEventListener("click", () => {
        submitAnswer(
          option.text,
          option.score
        );
      });

      elements.choices.appendChild(button);
    });
  }

  // ========================================
  // 자유 입력 답변 평가
  // ========================================

  function evaluateAnswer(text, story) {
    const answer = text.trim().toLowerCase();

    if (!answer) return 0;

    const positive = [
      "좋아", "고마워", "응원", "멋져",
      "재밌", "함께", "같이", "수고",
      "괜찮", "기대", "도와", "천천히",
      "기억", "최고", "행복"
    ];

    const negative = [
      "싫어", "귀찮", "못해", "별로",
      "바보", "닥쳐", "꺼져", "노잼",
      "관심 없어", "형편없"
    ];

    const topicKeywords = {
      1: ["안녕", "반가워", "이야기", "친해"],
      2: ["마크", "마인크래프트", "건축", "집", "나무"],
      3: ["노래", "음악", "커버", "뮤지컬", "목소리"],
      4: ["축구", "토트넘", "골", "응원", "경기"],
      5: ["개복치", "공주", "귀여워", "바다"],
      6: ["게임", "도전", "다시", "연습", "승리"],
      7: ["공연", "무대", "노래", "관객", "응원"],
      8: ["추억", "기억", "첫날", "즐거웠", "함께"],
      9: ["내일", "마지막", "추억", "함께", "기념"],
      10: ["고마워", "행복", "기억", "추억", "앞으로"]
    };

    let score = 0;

    positive.forEach(word => {
      if (answer.includes(word)) {
        score += 2;
      }
    });

    negative.forEach(word => {
      if (answer.includes(word)) {
        score -= 4;
      }
    });

    const keywords = topicKeywords[story.day] || [];

    keywords.forEach(word => {
      if (answer.includes(word)) {
        score += 2;
      }
    });

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

  // ========================================
  // 호감도에 따른 반응
  // ========================================

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

  // ========================================
  // 답변 전송
  // ========================================

  function submitAnswer(text, fixedScore = null) {
    const story = stories.find(
      item => item.day === state.day
    );

    if (!story || state.completed) return;

    elements.choices.replaceChildren();
    elements.freeform.hidden = true;
    elements.answer.value = "";

    const score = fixedScore !== null
      ? fixedScore
      : evaluateAnswer(text, story);

    addMessage("me", text);

    state.affection = Math.max(
      0,
      state.affection + score
    );

    save();
    updateStats();

    addMessage("morara", getReaction(score));

    finishDay();
  }

  // ========================================
  // 하루 시작
  // ========================================

  function startDay() {
    const story = stories.find(
      item => item.day === state.day
    );

    if (!story) {
      setStatus("스토리를 찾을 수 없습니다.");
      return;
    }

    elements.chat.replaceChildren();
    elements.choices.replaceChildren();

    elements.freeform.hidden = true;

    state.history = [];
    save();

    setStatus(`${story.day}일차 · ${story.title}`);

    addMessage(
      "morara",
      `오늘은 ${story.theme}에 대해 이야기해 볼까?`
    );

    addImage(story.image);

    addMessage("morara", story.prompt);

    showChoices(story.options);

    elements.freeform.hidden = false;
  }

  // ========================================
  // 하루 종료
  // ========================================

  function finishDay() {
    state.completed = true;
    save();

    elements.freeform.hidden = true;
    elements.choices.replaceChildren();

    if (state.day >= 10) {
      showEnding();
      return;
    }

    setStatus(`${state.day}일차 대화 완료`);

    const button = document.createElement("button");

    button.type = "button";
    button.className = "choice";
    button.textContent = "다음 날로 넘어가기 →";

    button.addEventListener("click", () => {
      state.day++;
      state.completed = false;
      state.history = [];

      save();
      updateStats();
      startDay();
    });

    elements.choices.appendChild(button);
  }

  // ========================================
  // 엔딩
  // ========================================

  function showEnding() {
    elements.choices.replaceChildren();
    elements.freeform.hidden = true;

    let ending;

    if (state.affection >= 50) {
      ending = "💗 해피 엔딩";
    } else if (state.affection >= 25) {
      ending = "🌸 노멀 엔딩";
    } else {
      ending = "💔 배드 엔딩";
    }

    setStatus(ending);
    addMessage(
      "morara",
      `10일 동안 함께해 줘서 고마워!\n${ending}`
    );
  }

  // ========================================
  // 저장된 기록 복원
  // ========================================

  function restore() {
    elements.chat.replaceChildren();

    state.history.forEach(entry => {
      if (entry.type === "message") {
        addMessage(entry.speaker, entry.text, false);
      }

      if (entry.type === "image") {
        addImage(entry.imageKey, false);
      }
    });

    updateStats();

    if (state.completed) {
      if (state.day >= 10) {
        setStatus("10일차 완료");
        return;
      }

      setStatus(`${state.day}일차 대화 완료`);

      const button = document.createElement("button");

      button.className = "choice";
      button.textContent = "다음 날로 넘어가기 →";

      button.onclick = () => {
        state.day++;
        state.completed = false;
        state.history = [];
        save();
        updateStats();
        startDay();
      };

      elements.choices.appendChild(button);

      return;
    }

    if (state.history.length === 0) {
      startDay();
      return;
    }

    const story = stories.find(
      item => item.day === state.day
    );

    if (story) {
      setStatus(`${state.day}일차 · ${story.title}`);
      showChoices(story.options);
      elements.freeform.hidden = false;
    }
  }

  // ========================================
  // 직접 입력 이벤트
  // ========================================

  elements.freeform.addEventListener(
    "submit",
    event => {
      event.preventDefault();

      const text = elements.answer.value.trim();

      if (!text) return;

      submitAnswer(text);
    }
  );

  // ========================================
  // 처음부터 시작
  // ========================================

  elements.restart.addEventListener("click", () => {
    const confirmed = confirm(
      "정말 처음부터 시작하시겠습니까?\n" +
      "모든 진행 기록이 초기화됩니다."
    );

    if (!confirmed) return;

    localStorage.removeItem(SAVE_KEY);
    state = defaultState();

    elements.choices.replaceChildren();
    elements.freeform.hidden = true;

    updateStats();
    startDay();
  });

  // ========================================
  // 게임 실행
  // ========================================

  restore();
});
