
const Game = {
  state: {
    day: 1,
    affection: 0,
    index: 0,
    history: [],
    finished: false
  },

  timer: null,
  busy: false,

  init() {
    const saved = Save.load();

    if (saved && Number.isInteger(saved.day)
        && saved.day >= 1 && saved.day <= 10
        && Array.isArray(saved.history)) {
      this.state = {
        ...this.state,
        ...saved
      };
    }

    this.updateStats();
  },

  updateStats() {
    document.getElementById("day").textContent =
      `DAY ${this.state.day} / 10`;

    document.getElementById("affection").textContent =
      `💗 ${this.state.affection}`;
  },

  save() {
    Save.write(this.state);
    this.updateStats();
  },

  record(entry) {
    this.state.history.push(entry);
    this.save();
  },

  restore() {
    this.state.history.forEach(entry => {
      if (entry.type === "image") {
        Chat.addImage(entry.src, entry.alt);
      } else if (entry.type === "message") {
        Chat.add(entry.speaker, entry.text, entry.time);
      }
    });
  },

  next() {
    if (this.busy || this.state.finished) return;

    const story = window.STORIES?.[this.state.day];

    if (!story) {
      Chat.setStatus(`${this.state.day}일차 스토리가 없습니다.`);
      return;
    }

    const step = story[this.state.index];

    if (!step) {
      Chat.setStatus("스토리 진행이 완료되었습니다.");
      return;
    }

    if (step.type === "message") {
      if (step.minAffection !== undefined &&
          this.state.affection < step.minAffection) {
        this.state.index++;
        this.save();
        return this.next();
      }

      if (step.maxAffection !== undefined &&
          this.state.affection > step.maxAffection) {
        this.state.index++;
        this.save();
        return this.next();
      }

      this.busy = true;
      Chat.showTyping();

      this.timer = setTimeout(() => {
        Chat.hideTyping();

        const time = Chat.getTime();
        Chat.add(step.speaker, step.text, time);

        this.state.index++;
        this.record({
          type: "message",
          speaker: step.speaker,
          text: step.text,
          time
        });

        this.busy = false;
        this.next();
      }, 900);

      return;
    }

    if (step.type === "image") {
      Chat.addImage(step.src, step.alt);

      this.state.index++;
      this.record({
        type: "image",
        src: step.src,
        alt: step.alt
      });

      return this.next();
    }

    if (step.type === "choice") {
      Chat.showChoices(step.options, option => {
        Chat.clearChoices();

        const time = Chat.getTime();
        Chat.add("me", option.text, time);

        this.state.affection = Math.max(
          0,
          this.state.affection + option.affection
        );

        this.state.index++;
        this.record({
          type: "message",
          speaker: "me",
          text: option.text,
          time
        });

        this.next();
      });

      return;
    }

    if (step.type === "end") {
      this.state.index++;
      this.save();

      if (this.state.day === 10) {
        this.showEnding();
      } else {
        this.showNextDay();
      }
    }
  },

  showNextDay() {
    Chat.setStatus(`${this.state.day}일차 완료!`);

    Chat.showChoices([
      { text: "다음 날로 넘어가기 →" }
    ], () => {
      Chat.clearChoices();

      this.state.day++;
      this.state.index = 0;
      this.state.history = [];

      this.save();

      document.getElementById("chat").replaceChildren();
      Chat.setStatus(`${this.state.day}일차 시작`);

      this.next();
    });
  },

  showEnding() {
    this.state.finished = true;
    this.save();

    const score = this.state.affection;
    let ending;

    if (score >= 35) {
      ending = "💗 해피 엔딩";
    } else if (score >= 15) {
      ending = "🌸 노멀 엔딩";
    } else {
      ending = "💔 배드 엔딩";
    }

    Chat.setStatus(ending);
    Chat.add("morara", `10일 동안 함께해 줘서 고마워!\n\n${ending}`);
    Chat.clearChoices();
  }
};
