/**
 * 공주님, 답장은 제가 할게요 — 메신저 엔진.
 * 메시지는 적절한 간격으로 자동 도착합니다. 선택지에서만 멈춥니다.
 * 선택지는 즉시 전송되며 모라라의 답장이 자동 도착합니다.
 */
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const SAVE_KEY = "morara-seven-days-layout-v7";
  const SETTINGS_KEY = "morara-seven-days-settings-layout-v7";
  const days = window.MORARA_DAYS;
  const endings = window.MORARA_ENDINGS;
  const $ = (id) => document.getElementById(id);

  const ui = {
    opening: $("opening"),
    openingImage: $("opening-image"),
    openingKicker: $("opening-kicker"),
    openingTitle: $("opening-title"),
    openingDescription: $("opening-description"),
    openingNext: $("opening-next"),
    openingNotification: $("opening-notification"),
    openingContinue: $("opening-continue"),
    game: $("game"),
    chat: $("chat"),
    choices: $("choices"),
    next: $("next-button"),
    hint: $("hint"),
    presence: $("presence"),
    day: $("day-label"),
    banner: $("chapter-banner"),
    bannerDate: $("chapter-date"),
    bannerTitle: $("chapter-title"),
    imageModal: $("image-modal"),
    modalImage: $("modal-image"),
    modalCaption: $("modal-caption"),
    settingsModal: $("settings-modal"),
    galleryModal: $("gallery-modal"),
    galleryGrid: $("gallery-grid"),
    motion: $("motion-toggle"),
    splash: $("splash"),
    splashStart: $("splash-start"),
    speedOptions: [...document.querySelectorAll(".settings__speed-option")],
    speedPreview: $("speed-preview"),
    speedTest: $("speed-test"),
    previewBubble: $("preview-bubble"),
    endingLoading: $("ending-loading"),
    endingScreen: $("ending-screen"),
    endingKind: $("ending-kind"),
    endingTitle: $("ending-title"),
    endingImage: $("ending-image"),
    endingStory: $("ending-story")
  };

  // 기존 assets/images 폴더는 건드리지 않습니다.
  // 새 일러스트가 아직 없다면 원본의 비슷한 장면을 임시로 표시합니다.
  const IMAGE_FILES = new Set([
    "chat_wallpaper.png", "day01.png", "day01_kingdom.png",
    "day02_minecraft.png", "day02_stream.png", "day03_sea.png",
    "day03_selfie.png", "day04_memory.png", "day04_tiara.png",
    "day05_singing.png", "day05_stars.png", "day06_invite.png",
    "day06_outfit.png", "day07_festival.png", "day07_meeting.png",
    "ending_bad.png", "ending_normal.png", "ending_true.png",
    "intro_beach.png", "intro_phone.png", "intro_phone_hold.png",
    "intro_phone_out.png", "intro_portal.png", "intro_village.png",
    "profile.png", "profile_morara.png", "splash.png", "title_bg.png"
  ]);

  function asset(name) {
    const file = IMAGE_FILES.has(name) ? name : "intro_beach.png";
    return `./assets/images/${file}`;
  }

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const SPEEDS = {
    slow: { message: 1550, note: 1050, day: 1700, base: 1100, char: 35 },
    normal: { message: 980, note: 760, day: 1300, base: 620, char: 24 },
    fast: { message: 520, note: 380, day: 800, base: 330, char: 12 }
  };
  function timing() { return SPEEDS[settings.speed] || SPEEDS.normal; }
  let interactionLocked = false;
  let sequenceId = 0;
  let pumping = false;
  let typingIndicator = null;
  let waitingForNextDay = false;

  function clearTypingIndicator() {
    if (typingIndicator) typingIndicator.remove();
    typingIndicator = null;
  }

  function sendPlayerMessage(text) {
    // 선택지는 타이핑 대기 없이 곧바로 채팅에 전송됩니다.
    ui.choices.replaceChildren();
    appendMessage("me", text);
  }

  async function receiveMessage(text, token) {


    typingIndicator = create("div", "typing-indicator", "···");
    ui.chat.appendChild(typingIndicator);
    scrollChat();
    await wait(settings.reducedMotion ? 220 : Math.min(2600, timing().base + text.length * timing().char));
    clearTypingIndicator();
    if (token !== sequenceId) return;
    appendMessage("morara", text);


  }

  async function pump() {
    if (pumping || interactionLocked || !state.started || state.ending || state.pending) return;
    pumping = true;
    const token = ++sequenceId;
    try {
      while (token === sequenceId && !state.pending && !state.ending) {
        const day = days[state.dayIndex];
        if (!day) break;
        if (state.eventIndex >= day.events.length) {
          if (state.dayIndex >= days.length - 1) break;
          // 날짜 경계에서는 자동으로 넘어가지 않고 사용자의 확인을 기다립니다.
          waitingForNextDay = true;
          ui.hint.textContent = "오늘의 대화가 끝났습니다.";
          ui.next.hidden = false;
          ui.next.textContent = `다음 날로 넘어가기 · DAY ${days[state.dayIndex + 1].day} ›`;
          ui.choices.replaceChildren();
          requestChatBottom();
          break;
        }
        const event = day.events[state.eventIndex++];
        if (["choice", "activity", "ending-gate"].includes(event.type)) {
          state.pending = { dayIndex: state.dayIndex, eventIndex: state.eventIndex - 1 };
          save();
          renderEvent(event);
          break;
        }
        save();
        if (event.type === "message" && event.speaker === "morara") {
          await receiveMessage(event.text, token);
        } else if (event.type === "message" && event.speaker === "me") {
          // 대본에 자동 전송 문장이 남아 있어도 반드시 선택을 거치게 합니다.
          state.pending = { dayIndex: state.dayIndex, eventIndex: state.eventIndex - 1 };
          renderChoice({ prompt: "답장 보내기", options: [{ text: event.text, reply: [] }] });
          save();
          break;
        } else if (event.type === "thought") {
          appendMessage("thought", event.text);
          await wait(timing().note);
        } else if (event.type === "note") {
          appendNote(event.text);
          await wait(timing().note);
        } else if (event.type === "photo") {
          appendPhoto(event.image, event.caption);
          await wait(timing().message);
        } else if (event.type === "song") {
          renderSong(event);
          await wait(timing().note);
        }
        if (event.type === "message") await wait(timing().message);
      }
    } finally {
      pumping = false;
    }
  }

  function continueStory() {
    if (!state.ending && !state.pending && !waitingForNextDay) void pump();
  }

  function advanceDay() {
    if (!waitingForNextDay || pumping || interactionLocked || state.ending) return;
    if (state.dayIndex >= days.length - 1) return;
    waitingForNextDay = false;
    ui.next.hidden = true;
    ui.hint.textContent = "다음 날 대화를 불러오는 중…";
    state.dayIndex += 1;
    state.eventIndex = 0;
    state.history = [];
    ui.chat.replaceChildren();
    updateHeader();
    appendNote(`${days[state.dayIndex].date} · ${days[state.dayIndex].title}`);
    save();
    continueStory();
  }

  async function sendSelection(option, id) {
    if (interactionLocked || !state.pending) return;
    interactionLocked = true;
    state.pending = null;
    if (id) state.choices[id] = option.text;
    state.bond += option.bond || 0;
    state.trust += option.trust || 0;
    Object.assign(state.flags, option.flags || {});
    save();
    sendPlayerMessage(option.text);
    const token = ++sequenceId;
    for (const reply of option.reply || []) {
      await wait(timing().message);
      await receiveMessage(reply, token);
    }
    interactionLocked = false;
    continueStory();
  }

  function initialState() {
    return {
      introStep: 0,
      started: false,
      dayIndex: 0,
      eventIndex: 0,
      bond: 0,
      trust: 0,
      flags: {},
      choices: {},
      history: [],
      unlockedImages: [],
      ending: null,
      finalChoice: null,
      pending: null,
      replyQueue: []
    };
  }

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY));
      if (!saved || !Array.isArray(saved.history)) return initialState();
      return { ...initialState(), ...saved };
    } catch {
      return initialState();
    }
  }

  let state = load();
  let settings = { speed: "normal", reducedMotion: false };

  try {
    settings = { ...settings, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") };
  } catch {
    // 저장소를 사용할 수 없어도 플레이는 계속됩니다.
  }

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch {
      // 사생활 보호 모드에서는 자동 저장이 제한될 수 있습니다.
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // 저장 불가 환경 무시.
    }
  }

  function create(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function scrollChat() {
    // 페이지 전체가 아니라 채팅 컨테이너 내부만 이동합니다.
    ui.chat.scrollTop = ui.chat.scrollHeight;
  }

  function requestChatBottom() {
    // 선택지의 높이가 확정된 다음 스크롤해야 마지막 말풍선이 잘리지 않습니다.
    requestAnimationFrame(() => {
      scrollChat();
      requestAnimationFrame(scrollChat);
    });
  }

  function appendMessage(speaker, text, record = true) {
    const thought = speaker === "thought";
    const mine = speaker === "me";
    const row = create("div", `message ${thought ? "message--thought" : mine ? "message--me" : "message--morara"}${record ? "" : " message--restored"}`);

    if (!thought && !mine) {
      const avatar = create("img", "message__avatar");
      avatar.src = asset("profile.png");
      avatar.alt = "";
      row.appendChild(avatar);
    }

    const body = create("div", "message__body");
    if (!thought && !mine) body.appendChild(create("div", "message__name", "모라라"));
    body.appendChild(create("div", "message__bubble", text));
    row.appendChild(body);
    ui.chat.appendChild(row);

    if (record) {
      state.history.push({ type: "message", speaker, text });
      save();
    }
    scrollChat();
  }

  function appendNote(text, record = true) {
    ui.chat.appendChild(create("div", record ? "system-note" : "system-note system-note--restored", text));
    if (record) {
      state.history.push({ type: "note", text });
      save();
    }
    scrollChat();
  }

  function unlockImage(image) {
    if (!state.unlockedImages.includes(image)) {
      state.unlockedImages.push(image);
      save();
    }
  }

  function openImage(image, caption) {
    ui.modalImage.src = asset(image);
    ui.modalImage.alt = caption || "일러스트";
    ui.modalCaption.textContent = caption || "";
    ui.imageModal.showModal();
  }

  function appendPhoto(image, caption, record = true) {
    const row = create("div", record ? "message message--morara" : "message message--morara message--restored");
    const avatar = create("img", "message__avatar");
    avatar.src = asset("profile.png");
    avatar.alt = "";
    const body = create("div", "message__body");
    body.appendChild(create("div", "message__name", "모라라"));
    const button = create("button", "photo-button");
    button.type = "button";
    button.setAttribute("aria-label", `${caption} 확대하기`);
    const imageElement = create("img", "message__photo");
    imageElement.src = asset(image);
    imageElement.alt = caption;
    imageElement.addEventListener("load", () => scrollChat(), { once: true });
    button.append(imageElement, create("small", "", `${caption} · 눌러서 확대`));
    button.addEventListener("click", () => openImage(image, caption));
    body.appendChild(button);
    row.append(avatar, body);
    ui.chat.appendChild(row);
    if (record) {
      state.history.push({ type: "photo", image, caption });
      unlockImage(image);
      save();
    }
    scrollChat();
  }

  function setControls(hint, showNext = false, nextLabel = "다음 메시지 ›") {
    ui.hint.textContent = hint;
    ui.next.hidden = !showNext;
    ui.next.textContent = nextLabel;
    ui.choices.replaceChildren();
  }

  function renderEvent(event) {
    if (event.type === "choice") renderChoice(event);
    else if (event.type === "activity") renderActivity(event);
    else if (event.type === "ending-gate") resolveEndingGate();
  }

  function addChoice(text, callback) {
    const button = create("button", "choice", text);
    button.type = "button";
    button.addEventListener("click", callback, { once: true });
    ui.choices.appendChild(button);
    requestChatBottom();
  }

  function renderChoice(event) {
    setControls(event.prompt || "답장을 선택하세요.");
    for (const option of event.options) {
      addChoice(option.text, () => void sendSelection(option, event.id));
    }
    ui.choices.scrollTop = 0;
    requestChatBottom();
  }

  function renderActivity(event) {
    setControls("항목을 선택해 주세요.");
    const panel = create("div", "interaction");
    panel.append(create("h3", "", event.title), create("p", "", event.description));
    const grid = create("div", "interaction__grid");
    const selected = new Set();
    const multiple = event.id === "memories";
    for (const item of event.items) {
      const button = create("button", "interaction__button", item.label);
      button.type = "button";
      button.addEventListener("click", async () => {
        if (interactionLocked || selected.has(item.label)) return;
        interactionLocked = true;
        selected.add(item.label);
        button.disabled = true;
        button.classList.add("interaction__button--read");
        // 활동 역시 플레이어가 먼저 입력하고 전송합니다.
        sendPlayerMessage(item.label);
        const token = ++sequenceId;
        await receiveMessage(item.reply, token);
        interactionLocked = false;
        if (!multiple || selected.size === event.items.length) {
          grid.querySelectorAll("button").forEach((other) => { other.disabled = true; });
          if (event.image) appendPhoto(event.image, "해변에서 보낸 사진");
          appendNote(event.after);
          state.pending = null;
          save();
          panel.remove();
          continueStory();
        } else {
          ui.hint.textContent = `기억 ${selected.size} / ${event.items.length} 확인`;
        }
      });
      grid.appendChild(button);
    }
    panel.appendChild(grid);
    ui.chat.appendChild(panel);
    scrollChat();
  }

  function renderSong(event) {
    const panel = create("div", "interaction");
    panel.append(create("h3", "", `♫ ${event.title}`), create("p", "", event.description));
    const link = create("a", "secondary-button", "유튜브에서 노래 열기 ↗");
    link.href = event.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.style.display = "block";
    link.style.textAlign = "center";
    panel.appendChild(link);
    ui.chat.appendChild(panel);
    appendNote("노래를 재생하지 않아도 다음 대화가 이어집니다.");
    ui.hint.textContent = "노래 감상은 선택 사항입니다.";
  }

  function resolveEndingGate() {
    if (state.flags.walked_away) {
      finish("bad");
      return;
    }
    setControls("마지막으로 어떤 말을 전할까요?");
    addChoice("이제는 제 이름으로 연락하고 싶어요.", async () => {
      if (interactionLocked) return;
      state.pending = null;
      state.finalChoice = "join";
      const canJoin = state.bond >= 6 && state.trust >= 4
        && state.flags.understood_memory && state.flags.promised_to_meet
        && state.flags.confessed;
      save();
      sendPlayerMessage("이제는 제 이름으로 연락하고 싶어요.");
      finish(canJoin ? "true" : "normal");
    });
    addChoice("휴대폰을 돌려주고, 멀리서 응원할게요.", async () => {
      if (interactionLocked) return;
      state.pending = null;
      state.finalChoice = "support";
      save();
      sendPlayerMessage("휴대폰을 돌려주고, 멀리서 응원할게요.");
      finish("normal");
    });
  }

  async function showEnding(kind, animate = true) {
    const ending = endings[kind];
    if (!ending) return;
    ui.game.hidden = true;
    ui.opening.hidden = true;
    ui.endingScreen.hidden = true;
    ui.endingLoading.hidden = false;
    if (animate) await wait(settings.reducedMotion ? 180 : 1750);
    ui.endingLoading.hidden = true;
    ui.endingKind.textContent = `ENDING · ${kind.toUpperCase()}`;
    ui.endingTitle.textContent = ending.title;
    ui.endingImage.src = asset(ending.image);
    ui.endingImage.alt = `${ending.title} 엔딩 일러스트`;
    ui.endingStory.replaceChildren();
    for (const line of ending.lines) {
      ui.endingStory.appendChild(create("p", "ending-screen__line", line));
    }
    ui.endingScreen.hidden = false;
    ui.endingScreen.scrollTop = 0;
  }

  function finish(kind) {
    state.pending = null;
    state.ending = kind;
    state.unlockedImages = [...new Set([...state.unlockedImages, endings[kind].image])];
    save();
    ui.choices.replaceChildren();
    ui.next.hidden = true;
    sequenceId++;
    clearTypingIndicator();
    void showEnding(kind);
  }

  function updateHeader() {
    const day = days[state.dayIndex];
    ui.day.textContent = `DAY ${day.day} · ${day.countdown}`;
    ui.bannerDate.textContent = day.date;
    ui.bannerTitle.textContent = day.title;
    ui.banner.hidden = false;

  }

  function restoreHistory() {
    ui.chat.replaceChildren();
    for (const entry of state.history) {
      if (entry.type === "message") appendMessage(entry.speaker, entry.text, false);
      if (entry.type === "note") appendNote(entry.text, false);
      if (entry.type === "photo") appendPhoto(entry.image, entry.caption, false);
      if (entry.type === "activity") appendNote("활동 완료 · " + entry.selected.join(", "), false);
    }
    scrollChat();
  }

  function startGame() {
    state.started = true;
    save();
    ui.opening.hidden = true;
    ui.game.hidden = false;
    ui.game.classList.remove("game--enter");
    void ui.game.offsetWidth;
    ui.game.classList.add("game--enter");
    updateHeader();
    restoreHistory();
    if (state.ending) {
      void showEnding(state.ending, false);
      setControls("이야기가 완료되었습니다.", true, "처음 화면으로");
    } else if (state.eventIndex >= days[state.dayIndex].events.length && state.dayIndex < days.length - 1) {
      waitingForNextDay = true;
      ui.hint.textContent = "오늘의 대화가 끝났습니다.";
      ui.next.hidden = false;
      ui.next.textContent = `다음 날로 넘어가기 · DAY ${days[state.dayIndex + 1].day} ›`;
      requestChatBottom();
    } else if (state.pending) {
      const pendingDay = days[state.pending.dayIndex];
      renderEvent(pendingDay.events[state.pending.eventIndex]);
    } else {
      setControls("대화가 자동으로 이어집니다.");
      continueStory();
    }
  }

  const INTRO = [
    { image: "intro_phone.png", kicker: "1월 4일 · 해변", title: "공주님,\n답장은 제가 할게요.", description: "모래사장 위에서 휴대폰 한 대를 발견했다.", button: "휴대폰 살펴보기" },
    { image: "intro_phone_hold.png", kicker: "발견한 휴대폰", title: "주인을 찾아줘야겠지.", description: "잠금화면에 메시지가 도착한다. '단장, 어디 갔어?'", button: "알림 확인하기" },
    { image: "intro_phone_out.png", kicker: "모라라챗 · 새 알림", title: "새 메시지가 도착했다.", description: "휴대폰 화면 위에 알림이 떠올랐다. 누르면 대화창으로 이어진다.", button: "메시지 확인하기" }
  ];

  function showIntro() {
    const step = INTRO[Math.min(state.introStep, INTRO.length - 1)];
    ui.opening.classList.remove("opening--transition");
    void ui.opening.offsetWidth;
    ui.opening.classList.add("opening--transition");
    ui.openingImage.src = asset(step.image);
    ui.openingKicker.textContent = step.kicker;
    ui.openingTitle.textContent = step.title;
    ui.openingDescription.textContent = step.description;
    ui.openingNext.textContent = state.ending ? "처음부터 다시 시작" : step.button;
    ui.openingContinue.hidden = !state.started || Boolean(state.ending);
    const isNotificationStep = state.introStep === INTRO.length - 1 && !state.ending;
    ui.openingNotification.hidden = !isNotificationStep;
    ui.openingNotification.classList.remove("is-visible");
    if (isNotificationStep) {
      // 전환 중의 깜빡임을 방지하고 알림을 휴대폰 프레임 위에 등장시킵니다.
      requestAnimationFrame(() => ui.openingNotification.classList.add("is-visible"));
    }
  }

  function advanceIntro() {
    if (state.ending) {
      restart();
      return;
    }
    if (state.introStep < INTRO.length - 1) {
      state.introStep += 1;
      save();
      showIntro();
    } else {
      startGame();
    }
  }

  function restart() {
    if (!confirm("처음부터 다시 시작할까요? 현재 진행 기록이 초기화됩니다.")) return;
    ui.endingScreen.hidden = true;
    ui.endingLoading.hidden = true;
    sequenceId += 1;
    clearTypingIndicator();
    state = initialState();
    save();
    ui.game.hidden = true;
    ui.opening.hidden = false;
    showIntro();
  }

  function openGallery() {
    ui.galleryGrid.replaceChildren();
    const images = [
      "day01_kingdom.png", "day03_selfie.png", "day03_sea.png",
      "day04_memory.png", "day04_tiara.png", "day05_stars.png",
      "day06_outfit.png", "day06_invite.png", "day07_festival.png",
      "day07_meeting.png", "ending_bad.png", "ending_normal.png", "ending_true.png"
    ];
    for (const image of images) {
      const unlocked = state.unlockedImages.includes(image);
      const button = create("button", "gallery__item");
      button.disabled = !unlocked;
      const preview = create("img");
      preview.src = asset(image);
      preview.alt = unlocked ? image : "잠긴 일러스트";
      button.append(preview, create("span", "", unlocked ? image : "아직 발견하지 못한 장면"));
      if (unlocked) button.addEventListener("click", () => openImage(image, image));
      ui.galleryGrid.appendChild(button);
    }
    ui.galleryModal.showModal();
  }

  $("ending-restart").addEventListener("click", restart);
  $("ending-gallery").addEventListener("click", openGallery);

  for (const dialog of [ui.settingsModal, ui.imageModal, ui.galleryModal]) {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  }

  // 모든 입력 이벤트는 한 곳에서 연결합니다.
  ui.openingNext.addEventListener("click", advanceIntro);
  ui.openingNotification.addEventListener("click", advanceIntro);
  ui.openingContinue.addEventListener("click", startGame);
  // 자동 대화 중에는 버튼이 없으며, 하루가 끝났을 때만 다음 날 버튼을 사용합니다.
  ui.next.addEventListener("click", advanceDay);
  $("menu-button").addEventListener("click", () => ui.settingsModal.showModal());
  $("settings-close").addEventListener("click", () => ui.settingsModal.close());
  $("image-close").addEventListener("click", () => ui.imageModal.close());
  $("gallery-close").addEventListener("click", () => ui.galleryModal.close());
  $("gallery-button").addEventListener("click", () => {
    ui.settingsModal.close();
    openGallery();
  });
  $("restart-button").addEventListener("click", () => {
    ui.settingsModal.close();
    restart();
  });
  ui.motion.checked = settings.reducedMotion;
  ui.motion.addEventListener("change", () => {
    settings.reducedMotion = ui.motion.checked;
    document.documentElement.classList.toggle("reduce-motion", settings.reducedMotion);
    saveSettings();
  });
  document.documentElement.classList.toggle("reduce-motion", settings.reducedMotion);


  // 속도는 시작 화면이 아니라 게임 내 메뉴(☰)의 설정창에서 변경합니다.
  let previewToken = 0;

  function setSpeed(value) {
    settings.speed = SPEEDS[value] ? value : "normal";
    for (const button of ui.speedOptions) {
      button.setAttribute("aria-pressed", String(button.dataset.speed === settings.speed));
    }
    saveSettings();
  }

  for (const button of ui.speedOptions) {
    button.addEventListener("click", () => {
      setSpeed(button.dataset.speed);
      previewToken++;
      ui.speedPreview.hidden = true;
      ui.previewBubble.textContent = "";
    });
  }
  setSpeed(settings.speed);

  ui.settingsModal.addEventListener("close", () => {
    previewToken++;
    ui.speedPreview.hidden = true;
    ui.previewBubble.textContent = "";
  });

  ui.speedTest.addEventListener("click", async () => {
    const token = ++previewToken;
    const config = timing();
    ui.speedPreview.hidden = false;
    ui.previewBubble.textContent = "모라라가 메시지를 입력하는 중…";
    await wait(Math.min(2600, config.base + 14 * config.char));
    if (token !== previewToken) return;
    ui.previewBubble.textContent = "오늘은 무슨 이야기를 해볼까?";
    await wait(config.message);
    if (token !== previewToken) return;
    ui.previewBubble.textContent = "오늘은 무슨 이야기를 해볼까?\n아, 먼저 물어볼 게 있어!";
  });

  let splashLeaving = false;
  ui.splashStart.addEventListener("click", async () => {
    if (splashLeaving) return;
    splashLeaving = true;
    ui.splash.classList.add("is-fading");
    await wait(settings.reducedMotion ? 10 : 500);
    ui.splash.hidden = true;
    ui.opening.classList.add("opening--transition");
  });

  showIntro();
});
