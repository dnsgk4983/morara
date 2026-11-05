/* Dear Morara — complete replacement for js/main.js. No SCSS changes. */
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // ==========================================
  // 1. 기본 설정
  // ==========================================
  const SAVE_KEY = "morara-v4-multiline";

  const MESSAGE_DELAY = 750;
  const TYPING_SPEED = 20;
  const stories = window.MORARA_STORY || [];
  const PROFILE_IMAGE = "./assets/images/profile.png";
  const imagePaths = Object.fromEntries([
    ...Array.from({ length: 10 }, (_, i) => `day${String(i + 1).padStart(2, "0")}`),
    "ending_happy", "ending_normal", "ending_bad"
  ].map(key => [key, `./assets/images/${key}.png`]));

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
  if (!elements.chat || !elements.choices || !elements.status || !elements.day || !elements.affection) {
    console.error("Dear Morara: 필수 HTML 요소가 없습니다.");
    return;
  }
  if (stories.length !== 10 || stories.some(day => day.beats.length < 10)) {
    elements.status.textContent = "data/story.js를 먼저 불러와 주세요.";
    console.error("Dear Morara: 10일 × 10장면 스토리 데이터 누락");
    return;
  }

  // ==========================================
  // 2. 저장 및 복원
  // ==========================================
  const initialState = () => ({
    day: 1, beat: 0, affection: 0, flags: { trust: 0, playful: 0, steady: 0, creative: 0, empathy: 0 },
    choices: [], history: [], phase: "intro", lineIndex: 0, completed: false
  });
  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
      if (!saved || !Number.isInteger(saved.day) || saved.day < 1 || saved.day > 10 ||
          !Number.isInteger(saved.beat) || saved.beat < 0 || saved.beat > 10 ||
          !Array.isArray(saved.history) || !Array.isArray(saved.choices)) return initialState();
      return { ...initialState(), ...saved, flags: { ...initialState().flags, ...saved.flags } };
    } catch { return initialState(); }
  }
  let state = loadState();
  let running = false;
  let sequence = 0;
  let started = false;
  const save = () => localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const story = () => stories[state.day - 1];
  const scrollBottom = () => { elements.chat.scrollTop = elements.chat.scrollHeight; };
  function updateStatus() {
    elements.day.textContent = `DAY ${state.day} / 10`;
    elements.affection.textContent = `💗 ${state.affection}`;
    elements.status.textContent = `${story().title} · ${Math.min(state.beat + 1, 10)} / 10`;
  }
  function clearControls() {
    elements.choices.replaceChildren();
    if (elements.freeform) elements.freeform.hidden = true;
  }
  function record(entry) { state.history.push(entry); save(); }

  // ==========================================
  // 3. 채팅 메시지
  // ==========================================
  function addMessage(speaker, text, shouldRecord = true) {
    const mine = speaker === "me";
    const row = document.createElement("div");
    row.className = mine ? "message me" : "message morara";
    if (!mine) {
      const avatar = document.createElement("img");
      avatar.className = "message-avatar";
      avatar.src = PROFILE_IMAGE;
      avatar.alt = "모라라";
      avatar.onerror = () => { avatar.style.display = "none"; };
      row.appendChild(avatar);
    }
    const content = document.createElement("div");
    content.className = "message-content content";
    if (!mine) {
      const name = document.createElement("div");
      name.className = "message-name name";
      name.textContent = "모라라";
      content.appendChild(name);
    }
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = text;
    const time = document.createElement("span");
    time.className = "message-time time";
    time.textContent = new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false });
    content.append(bubble, time);
    row.appendChild(content);
    elements.chat.appendChild(row);
    if (shouldRecord) record({ type: "message", speaker, text });
    scrollBottom();
    return bubble;
  }
  async function say(text, current) {
    await wait(MESSAGE_DELAY);
    if (current !== sequence) return false;
    const bubble = addMessage("morara", "", false);
    for (const character of text) {
      if (current !== sequence) return false;
      bubble.textContent += character;
      scrollBottom();
      await wait(TYPING_SPEED);
    }
    record({ type: "message", speaker: "morara", text });
    return true;
  }
  function addImage(key, shouldRecord = true) {
    const src = imagePaths[key];
    if (!src) return;
    const row = document.createElement("div");
    row.className = "message morara";
    const avatar = document.createElement("img");
    avatar.className = "message-avatar";
    avatar.src = PROFILE_IMAGE;
    avatar.alt = "모라라";
    avatar.onerror = () => { avatar.style.display = "none"; };
    const content = document.createElement("div");
    content.className = "message-content content";
    const img = document.createElement("img");
    img.className = "chat-image scene";
    img.src = src;
    img.alt = `DAY ${state.day} 일러스트`;
    img.loading = "eager";
    img.style.cssText = "display:block;width:100%;max-width:280px;height:auto;object-fit:contain;border-radius:12px";
    img.onload = scrollBottom;
    img.onerror = () => {
      console.error("이미지 파일을 확인해 주세요:", src);
      img.alt = `이미지를 불러올 수 없습니다: ${key}`;
    };
    content.appendChild(img);
    row.append(avatar, content);
    elements.chat.appendChild(row);
    if (shouldRecord) record({ type: "image", key });
    scrollBottom();
  }
  function renderHistory() {
    elements.chat.replaceChildren();
    for (const item of state.history) {
      if (item.type === "message") addMessage(item.speaker, item.text, false);
      if (item.type === "image") addImage(item.key, false);
    }
  }

  // ==========================================
  // 4. 분기 및 대화 진행
  // ==========================================
  function scrollAfterControls() {
    requestAnimationFrame(() => requestAnimationFrame(scrollBottom));
  }
  function choiceButtons() {
    clearControls();
    if (state.completed || state.beat >= 10) return;
    const beat = story().beats[state.beat];
    beat.options.forEach(option => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice";
      button.textContent = option.text;
      button.addEventListener("click", () => choose(option.id));
      elements.choices.appendChild(button);
    });
    scrollAfterControls();
  }
  function relationalLine() {
    const { trust, playful, steady } = state.flags;
    if (state.day === 10 && state.beat === 9) {
      if (trust >= 20) return "네가 매번 내 이야기를 진지하게 들어준 거, 나도 기억하고 있어. 💗";
      if (playful >= 20) return "너랑 있으면 꼭 한 번은 웃게 돼. 그게 정말 좋았어!";
      return "조용히 함께해 준 순간들도 소중했어. 고마워.";
    }
    if (state.beat === 5 && trust >= 12) return "그러고 보니 너는 늘 내 얘기를 끝까지 들어주네. 고마워.";
    if (state.beat === 5 && playful >= 12) return "오늘도 장난치는 거 보니까 우리 꽤 친해졌나 봐 ㅋㅋ";
    if (state.beat === 5 && steady >= 12) return "너는 차분하게 들어줘서 얘기하기 편해.";
    return null;
  }
  // 현재 날짜의 실제 대사 내용에 따라 일러스트 삽입 장면을 선택한다.
  // 기존 story.js의 imageAfter 고정값보다 아래 문맥 판정을 우선한다.
  const imageTopics = [
    /산호마을|하트 개복치|코랄핑크|사진|모습/,
    /건축|집|마을|서버|마인크래프트/,
    /공연|노래|무대|음악|사진/,
    /축구|경기|응원|토트넘/,
    /아바타|개복치폼|공주|팬미팅/,
    /게임|공장|전략|도전/,
    /공연|무대|콘서트|노래/,
    /추억|기억|사진|함께/,
    /내일|생일|기념|선물/,
    /생일|축하|일러스트|파티/
  ];
  function imageBeatIndex() {
    const beats = story().beats;
    const topic = imageTopics[state.day - 1];
    const candidates = beats.map((beat, index) => ({
      index,
      score: (beat.lines || []).reduce((sum, line) =>
        sum + (topic.test(line) ? 1 : 0), 0)
    })).filter(item => item.index >= 1 && item.index <= 8);
    candidates.sort((a, b) => b.score - a.score ||
      Math.abs(a.index - (2 + (state.day * 3) % 6)) -
      Math.abs(b.index - (2 + (state.day * 3) % 6)));
    return candidates[0]?.index ?? 3;
  }
  function imageAlreadyShown() {
    return state.history.some(item => item.type === "image" && item.key === story().image);
  }
  async function presentBeat() {
    if (running || state.completed) return;
    const beat = story().beats[state.beat];
    if (!beat) { completeDay(); return; }
    running = true;
    clearControls();
    state.phase = "intro";
    save();
    const current = ++sequence;
    // 저장된 진행 위치부터 이어서 출력한다. 이미 출력한 메시지는 반복하지 않는다.
    const startIndex = Math.max(0, Math.min(state.lineIndex || 0, beat.lines.length));
    for (let index = startIndex; index < beat.lines.length; index++) {
      if (!await say(beat.lines[index], current)) { running = false; return; }
      state.lineIndex = index + 1;
      save();
    }
    if (state.beat === imageBeatIndex() && !imageAlreadyShown()) {
      await wait(500);
      if (current !== sequence) { running = false; return; }
      addImage(story().image);
    }
    state.phase = "awaiting";
    save();
    running = false;
    updateStatus();
    choiceButtons();
  }
  async function choose(id) {
    if (running || state.phase !== "awaiting") return;
    const beat = story().beats[state.beat];
    const option = beat?.options.find(o => o.id === id);
    if (!option) return;
    running = true;
    clearControls();
    const current = ++sequence;
    addMessage("me", option.text);
    state.affection += option.score;
    for (const flag of option.flags) state.flags[flag] = (state.flags[flag] || 0) + 1;
    state.choices.push({ day: state.day, beat: state.beat, id });
    state.phase = "reply";
    save();
    updateStatus();
    for (const line of option.reply) {
      if (!await say(line, current)) { running = false; return; }
    }
    const extra = relationalLine();
    if (extra && !await say(extra, current)) { running = false; return; }
    state.beat += 1;
    state.lineIndex = 0;
    state.phase = "intro";
    save();
    running = false;
    if (state.beat >= story().beats.length) completeDay();
    else presentBeat();
  }
  function completeDay() {
    running = false;
    clearControls();
    state.phase = "done";
    state.completed = true;
    save();
    updateStatus();
    if (state.day === 10) { showEnding(); return; }
    elements.status.textContent = `${state.day}일차 완료 · 다음 날로 넘어가세요`;
    const next = document.createElement("button");
    next.type = "button";
    next.className = "choice";
    next.textContent = "다음 날로 넘어가기 →";
    next.addEventListener("click", () => {
      state.day += 1;
      state.beat = 0;
      state.lineIndex = 0;
      state.completed = false;
      state.phase = "intro";
      state.history = [];
      save();
      elements.chat.replaceChildren();
      updateStatus();
      presentBeat();
    });
    elements.choices.appendChild(next);
    scrollAfterControls();
  }

  // ==========================================
  // 5. 엔딩 3종
  // ==========================================
  function showEnding() {
    document.getElementById("ending-screen")?.remove();
    const trust = state.flags.trust || 0;
    const empathy = state.flags.empathy || 0;
    const type = state.affection >= 300 && (trust + empathy) >= 20 ? "happy" : state.affection >= 210 ? "normal" : "bad";
    const copy = {
      happy: ["해피 엔딩 — 우리의 산호마을", "너와 나눈 열흘의 이야기가 오래도록 따뜻한 기억으로 남을 것 같아. 다음에 또 만나자! 💗🐟"],
      normal: ["노멀 엔딩 — 다음에 또 만나자", "매일 함께해 줘서 고마워. 다음엔 더 많은 이야기를 나눌 수 있겠지?"],
      bad: ["아쉬운 엔딩 — 남겨진 작은 별빛", "조금은 서툴렀지만, 함께한 시간은 사라지지 않아. 언젠가 또 반갑게 인사하자."]
    };
    const screen = document.createElement("section");
    screen.id = "ending-screen";
    screen.className = "ending-screen";
    screen.setAttribute("role", "dialog");
    screen.setAttribute("aria-modal", "true");
    const content = document.createElement("div");
    content.className = "ending-screen__content";
    const img = document.createElement("img");
    img.className = "ending-screen__image";
    img.src = imagePaths[`ending_${type}`];
    img.alt = copy[type][0];
    const title = document.createElement("h2");
    title.className = "ending-screen__title";
    title.textContent = copy[type][0];
    const message = document.createElement("p");
    message.className = "ending-screen__message";
    message.textContent = copy[type][1];
    const button = document.createElement("button");
    button.className = "ending-screen__button";
    button.type = "button";
    button.textContent = "처음부터 다시 만나기";
    button.addEventListener("click", restart);
    content.append(img, title, message, button);
    screen.appendChild(content);
    document.body.appendChild(screen);
  }
  function restart() {
    sequence++;
    running = false;
    state = initialState();
    save();
    document.getElementById("ending-screen")?.remove();
    elements.chat.replaceChildren();
    clearControls();
    updateStatus();
    presentBeat();
  }

  // ==========================================
  // 6. 스플래시: 왕관 드래그 필수 / 축하 문구 유지
  // ==========================================
  function initializeSplash() {
    const splash = document.getElementById("splash");
    if (!splash || splash.hidden || splash.classList.contains("is-hidden")) {
      launch(); return;
    }
    const scene = document.getElementById("splash-scene");
    const crown = document.getElementById("splash-crown");
    const target = document.getElementById("crown-target");
    const hint = document.getElementById("splash-hint");
    const start = document.getElementById("start-story");
    if (!scene || !crown || !target || !hint || !start) { launch(); return; }
    document.body.style.overflow = "hidden";
    let dragging = false;
    let crowned = false;
    let origin = null;
    let moved = false;
    function resetCrown() {
      dragging = false; origin = null; moved = false;
      crown.classList.remove("is-dragging");
      crown.style.left = "";
      crown.style.top = "";
    }
    crown.addEventListener("pointerdown", event => {
      if (crowned || !event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
      dragging = true; moved = false;
      origin = { x: event.clientX, y: event.clientY };
      crown.classList.add("is-dragging");
      crown.setPointerCapture(event.pointerId);
      event.preventDefault();
    });
    crown.addEventListener("pointermove", event => {
      if (!dragging || !origin) return;
      if (Math.hypot(event.clientX - origin.x, event.clientY - origin.y) > 8) moved = true;
      const rect = scene.getBoundingClientRect();
      crown.style.left = `${event.clientX - rect.left}px`;
      crown.style.top = `${event.clientY - rect.top}px`;
    });
    crown.addEventListener("pointerup", event => {
      if (!dragging || crowned) return;
      const rect = target.getBoundingClientRect();
      const hit = moved && event.clientX >= rect.left && event.clientX <= rect.right &&
        event.clientY >= rect.top && event.clientY <= rect.bottom;
      resetCrown();
      if (crown.hasPointerCapture(event.pointerId)) crown.releasePointerCapture(event.pointerId);
      if (!hit) return;
      crowned = true;
      splash.classList.add("is-crowned");
      crown.classList.add("is-placed");
      hint.hidden = false;
      hint.textContent = "모라라 공주님, 생일 축하해요! 💗";
      hint.classList.add("is-celebrating");
      setTimeout(() => {
        if (!splash.isConnected) return;
        start.hidden = false;
        start.classList.add("is-revealed");
      }, 850);
    });
    crown.addEventListener("pointercancel", () => { if (!crowned) resetCrown(); });
    crown.addEventListener("lostpointercapture", () => { if (dragging && !crowned) resetCrown(); });
    start.addEventListener("click", async () => {
      if (!crowned || started) return;
      start.disabled = true;
      splash.classList.add("is-fading");
      await wait(1000);
      splash.remove();
      document.body.style.overflow = "";
      launch();
    });
  }

  // ==========================================
  // 7. 실행 / 이어하기
  // ==========================================
  function launch() {
    if (started) return;
    started = true;
    updateStatus();
    renderHistory();
    if (state.completed) { completeDay(); return; }
    if (state.phase === "awaiting") { choiceButtons(); return; }
    // 중간 저장 상태가 대답 출력 중이었다면 다음 장면으로 안전하게 복구
    if (state.phase === "reply") {
      state.beat = Math.min(state.beat + 1, 10);
      state.lineIndex = 0;
      state.phase = "intro";
      save();
    }
    if (state.beat >= 10) { completeDay(); return; }
    presentBeat();
  }
  elements.restart?.addEventListener("click", () => {
    if (window.confirm("열흘의 이야기를 처음부터 다시 시작할까요?")) restart();
  });
  // 기존 자유 입력은 선택지 분기와 충돌하므로 이번 버전에서 숨김
  if (elements.freeform) elements.freeform.hidden = true;
  initializeSplash();
});
