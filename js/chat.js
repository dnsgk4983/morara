
const Chat = {
  profileImage: "./assets/images/profile.png",

  getTime() {
    return new Date().toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  },

  scrollBottom() {
    const chat = document.getElementById("chat");
    chat.scrollTop = chat.scrollHeight;
  },

  add(speaker, text, time = this.getTime()) {
    const chat = document.getElementById("chat");
    const isMe = speaker === "me";

    const row = document.createElement("div");
    row.className = `message ${isMe ? "me" : "morara"}`;

    if (!isMe) {
      const avatar = document.createElement("img");
      avatar.className = "message-avatar";
      avatar.src = this.profileImage;
      avatar.alt = "모라라";
      avatar.onerror = () => {
        avatar.onerror = null;
        avatar.src = "https://placehold.co/80x80/ffa4a4/ffffff?text=M";
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

    const timestamp = document.createElement("span");
    timestamp.className = "message-time";
    timestamp.textContent = time;

    body.append(bubble, timestamp);
    content.appendChild(body);
    row.appendChild(content);
    chat.appendChild(row);

    this.scrollBottom();
    return row;
  },

  addImage(src, alt = "상황 이미지") {
    const chat = document.getElementById("chat");

    const row = document.createElement("div");
    row.className = "message morara";

    const avatar = document.createElement("img");
    avatar.className = "message-avatar";
    avatar.src = this.profileImage;
    avatar.alt = "모라라";
    avatar.onerror = () => {
      avatar.onerror = null;
      avatar.src = "https://placehold.co/80x80/ffa4a4/ffffff?text=M";
    };

    const content = document.createElement("div");
    content.className = "message-content";

    const name = document.createElement("div");
    name.className = "message-name";
    name.textContent = "모라라";

    const image = document.createElement("img");
    image.className = "chat-image";
    image.src = src;
    image.alt = alt;

    image.onerror = () => {
      image.onerror = null;
      image.src = "https://placehold.co/600x400/ffe1e8/555555?text=Morara";
    };

    image.onload = () => this.scrollBottom();

    content.append(name, image);
    row.append(avatar, content);
    chat.appendChild(row);

    this.scrollBottom();
  },

  showTyping() {
    this.hideTyping();

    const row = this.add("morara", "");
    row.id = "typing-indicator";

    const bubble = row.querySelector(".bubble");
    bubble.classList.add("typing");
    bubble.textContent = "";

    for (let i = 0; i < 3; i++) {
      bubble.appendChild(document.createElement("span"));
    }
  },

  hideTyping() {
    document.getElementById("typing-indicator")?.remove();
  },

  showChoices(options, onSelect) {
    const container = document.getElementById("choices");
    container.replaceChildren();

    options.forEach(option => {
      const button = document.createElement("button");
      button.className = "choice";
      button.textContent = option.text;

      button.onclick = () => {
        container.querySelectorAll("button").forEach(btn => {
          btn.disabled = true;
        });
        onSelect(option);
      };

      container.appendChild(button);
    });
  },

  clearChoices() {
    document.getElementById("choices").replaceChildren();
  },

  setStatus(text) {
    document.getElementById("status").textContent = text;
  }
};
