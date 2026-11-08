/* Dear Morara — complete replacement for js/main.js. No SCSS changes. */
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // ==========================================
  // 1. 기본 설정
  // ==========================================
  const LEGACY_SAVE_KEY = "morara-v4-multiline";

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
  if (stories.length !== 10 || stories.some(day => day.beats.length < 3 || day.beats.length > 5)) {
    elements.status.textContent = "data/story.js를 먼저 불러와 주세요.";
    console.error("Dear Morara: 10일 × 최대 5장면 스토리 데이터 누락");
    return;
  }

  // ==========================================
  // 2. 저장 및 복원
  // ==========================================
  const initialState = () => ({
    day: 1, beat: 0, affection: 0, flags: { trust: 0, playful: 0, steady: 0, creative: 0, empathy: 0 },
    choices: [], history: [], phase: "intro", lineIndex: 0, completed: false
  });
  // 매 방문마다 새 게임으로 시작한다. 이전 버전 저장 데이터도 정리한다.
  try { localStorage.removeItem(LEGACY_SAVE_KEY); } catch (_) { /* 저장소 접근 제한 */ }
  let state = initialState();
  let running = false;
  let sequence = 0;
  let started = false;
  const save = () => {}; // 진행 기록을 브라우저에 저장하지 않음
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const story = () => stories[state.day - 1];
  const scrollBottom = () => { elements.chat.scrollTop = elements.chat.scrollHeight; };
  function updateStatus() {
    elements.day.textContent = `DAY ${state.day} / 10`;
    elements.affection.textContent = `💗 ${state.affection}`;
    elements.status.textContent = `${story().title} · ${Math.min(state.beat + 1, story().beats.length)} / ${story().beats.length}`;
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
    if (state.completed || state.beat >= story().beats.length) return;
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
    if (beat.imageAfter && !imageAlreadyShown()) {
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
    state.beat = Number.isInteger(option.next) ? option.next : state.beat + 1;
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
  // 5. 엔딩 5종 — 방송 매너 / 티키타카 / 진정성 / 히든 기록
  // ==========================================
  async function showEnding() {
    // 결과 화면으로 넘어가기 전 2.5초간 전환 연출을 보여 준다.
    if (document.getElementById("ending-transition")) return;
    const overlay = document.createElement("div");
    overlay.id = "ending-transition";
    overlay.setAttribute("role", "status");
    overlay.setAttribute("aria-live", "polite");
    overlay.style.cssText = [
      "position:fixed", "inset:0", "z-index:2147483647",
      "display:flex", "flex-direction:column", "align-items:center",
      "justify-content:center", "gap:18px", "padding:24px",
      "box-sizing:border-box", "background:#171624",
      "color:#ffe5ed", "text-align:center", "opacity:0",
      "transition:opacity 350ms ease", "pointer-events:all"
    ].join(";");
    const heart = document.createElement("div");
    heart.textContent = "♡";
    heart.style.cssText = "font-size:64px;line-height:1;color:#ff9fbd";
    const title = document.createElement("div");
    title.textContent = "공주님의 반응을 확인하는 중...";
    title.style.cssText = "font-size:clamp(18px,4vw,24px);font-weight:700";
    const subtitle = document.createElement("div");
    subtitle.textContent = "지난 10일간의 기록을 살펴보고 있어요.";
    subtitle.style.cssText = "font-size:14px;color:#bcb4c9";
    overlay.append(heart, title, subtitle);
    document.body.appendChild(overlay);
    requestAnimationFrame(() => { overlay.style.opacity = "1"; });
    await wait(2150);
    overlay.style.opacity = "0";
    await wait(350);
    overlay.remove();
    renderEnding();
  }

  function renderEnding() {
    document.getElementById("ending-screen")?.remove();
    const f = state.flags;
    const manners = (f.trust || 0) + (f.empathy || 0);
    const banter = f.playful || 0;
    const excessive = f.steady || 0;
    const boundary = f.creative || 0;
    const hidden = f.hidden || 0;
    // 점수는 보조 지표. 선 넘는 선택은 높은 점수로 상쇄되지 않는다.
    let type = "normal";
    if (boundary >= 3) type = "timeout";
    else if (excessive >= 5 && banter < 5) type = "loyal";
    else if (hidden >= 2 && manners >= 13 && boundary === 0) type = "hidden";
    else if (manners >= 15 && banter >= 8 && boundary <= 1) type = "true";
    const copy = {
      true: ["야랄단 수석 졸업", "아니 나 공략당한 게 아니라 10일 동안 놀림당한 거 아니야?! ㅋㅋㅋ\n공략 성공 — 야랄단 정회원"],
      normal: ["오래오래 코랄단", "뭐야, 되게 평범하게 끝나네? 근데 이런 것도 좋지.\n공략 성공 — 좋은 시청자"],
      loyal: ["충성! 공주님!", "아니 너는 왜 내가 뭘 해도 다 맞대? ㅋㅋㅋ\n공략 실패 — 과잉 충성"],
      timeout: ["10분 채팅 금지", "아니 몇 번을 말해! ㅋㅋㅋ 오늘은 채팅 좀 쉬어!\n공략 실패 — 임시 채팅 제한 (게임 속 연출)"],
      hidden: ["어푸어푸, 그리고 내일", "잠깐, 이거 다 이어지는 거였어?\n함께 보낸 열흘의 기억. 아 진짜... 고맙다.\n공략 완료 — 내일 방송에서 만나"]
    };
    const imageFor = {true:"ending_happy",normal:"ending_normal",loyal:"ending_normal",timeout:"ending_bad",hidden:"ending_happy"};
    const screen = document.createElement("section");
    screen.id = "ending-screen";
    screen.className = "ending-screen";
    screen.setAttribute("role", "dialog");
    screen.setAttribute("aria-modal", "true");
    const content = document.createElement("div");
    content.className = "ending-screen__content";
    const img = document.createElement("img");
    img.className = "ending-screen__image";
    img.src = imagePaths[imageFor[type]];
    img.alt = copy[type][0];
    const title = document.createElement("h2");
    title.className = "ending-screen__title";
    title.textContent = copy[type][0];
    const message = document.createElement("p");
    message.className = "ending-screen__message";
    message.textContent = copy[type][1];
    message.style.whiteSpace = "pre-line";
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
    window.location.reload();
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
  // 6-A. 산호마을 오프닝 (기존 왕관 코드는 위에 보존)
  // ==========================================
  function initializeIntro() {
    const intro = document.getElementById("intro");
    const stage = document.getElementById("intro-stage");
    const image = document.getElementById("intro-image");
    const action = document.getElementById("intro-action");
    const caption = document.getElementById("intro-caption");
    const notification = document.getElementById("intro-notification");
    if (!intro || !stage || !image || !action || !caption || !notification) {
      launch();
      return;
    }
    document.body.style.overflow = "hidden";
    let busy = false;
    // 플로팅은 완성된 알림을 보여주고, 채팅 진입 후에만 타이핑한다.
    notification.disabled = true;
    action.style.zIndex = "5";
    notification.style.zIndex = "10";
    const frames = [
      { src: "intro_portal.png", alt: "산호마을로 빨려 들어가는 소용돌이", delay: 1500, effect: "is-portal" },
      { src: "intro_village.png", alt: "산호마을에 도착한 풍경", delay: 1700 },
      { src: "intro_phone_out.png", alt: "휴대폰을 꺼내는 모습", delay: 1100 },
      { src: "intro_phone_hold.png", alt: "손에 든 휴대폰", delay: 900 }
    ];
    const preload = frames.map(frame => {
      const img = new Image();
      img.src = `./assets/images/${frame.src}`;
      return img;
    });
    // 화면의 이미지나 장식 레이어를 눌러도 휴대폰 터치로 처리한다.
    // 캡처 단계에서 처리해 CSS 레이어가 버튼을 가리는 경우도 방지한다.
    const touchPhone = async () => {
      if (busy) return;
      busy = true;
      action.hidden = true;
      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        stage.classList.remove("is-portal");
        stage.classList.add("is-transitioning");
        await wait(220);
        image.src = `./assets/images/${frame.src}`;
        image.alt = frame.alt;
        stage.classList.toggle("is-portal", frame.effect === "is-portal");
        stage.classList.remove("is-transitioning");
        await wait(frame.delay);
      }
      notification.hidden = false;
      notification.classList.add("is-visible");
      // 알림 텍스트는 처음부터 완성된 상태로 표시한다.
      await wait(window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 720);
      notification.disabled = false;
    };
    stage.addEventListener("click", event => {
      if (busy || !notification.hidden || event.target.closest("#intro-notification")) return;
      void touchPhone();
    }, true);
    action.addEventListener("click", () => { void touchPhone(); });
    notification.addEventListener("click", async () => {
      if (started) return;
      notification.disabled = true;
      intro.classList.add("is-leaving");
      await wait(650);
      intro.remove();
      document.body.style.overflow = "";
      launch();
    }, { once: true });
  }

  // ==========================================
  // 7. 실행 / 이어하기
  // ==========================================
  function launch() {
    if (started) return;
    started = true;
    updateStatus();
    // 새 게임에서는 알림 문구를 채팅 진입 후 첫 타이핑 메시지로 출력한다.
    // 이미 저장된 메시지는 재출력하지 않으며, 복원 기록은 즉시 표시한다.
    const firstChat = state.day === 1 && state.beat === 0 && state.history.length === 0;
    renderHistory();
    if (state.completed) { completeDay(); return; }
    if (state.phase === "awaiting") { choiceButtons(); return; }
    // 중간 저장 상태가 대답 출력 중이었다면 다음 장면으로 안전하게 복구
    if (state.phase === "reply") {
      state.beat = Math.min(state.beat + 1, story().beats.length);
      state.lineIndex = 0;
      state.phase = "intro";
      save();
    }
    if (state.beat >= story().beats.length) { completeDay(); return; }
    if (firstChat) {
      (async () => {
        const current = ++sequence;
        running = true;
        const ok = await say("어라? 처음 보는 사람이네?", current);
        running = false;
        if (ok && current === sequence) presentBeat();
      })();
    } else {
      presentBeat();
    }
  }
  elements.restart?.addEventListener("click", () => {
    if (window.confirm("열흘의 이야기를 처음부터 다시 시작할까요?")) restart();
  });
  // 기존 자유 입력은 선택지 분기와 충돌하므로 이번 버전에서 숨김
  if (elements.freeform) elements.freeform.hidden = true;
  initializeIntro();
});
