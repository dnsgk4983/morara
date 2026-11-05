window.STORIES = window.STORIES || {};

window.STORIES[8] = [
  {
    type: "message",
    speaker: "morara",
    text: "8일차야! 오늘도 왔네? 🐟"
  },
  {
    type: "message",
    speaker: "morara",
    text: "오늘은 나랑 뭐 하고 싶어?"
  },
  {
    type: "choice",
    options: [
      { text: "같이 게임하자!", affection: 5 },
      { text: "그냥 이야기하자.", affection: 3 },
      { text: "잠깐 들렀어.", affection: 0 }
    ]
  },
  {
    type: "message",
    speaker: "morara",
    text: "좋아! 오늘도 재밌게 보내자! 💗",
    minAffection: 10
  },
  {
    type: "message",
    speaker: "morara",
    text: "그래~ 천천히 친해지면 되지!",
    maxAffection: 9
  },
  {
    type: "end"
  }
];
