
const Save = {
  key: "morara-game-save",

  load() {
    try {
      const data = localStorage.getItem(this.key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("저장 데이터 불러오기 실패:", error);
      return null;
    }
  },

  write(state) {
    try {
      localStorage.setItem(this.key, JSON.stringify(state));
    } catch (error) {
      console.error("게임 저장 실패:", error);
    }
  },

  clear() {
    localStorage.removeItem(this.key);
  }
};
