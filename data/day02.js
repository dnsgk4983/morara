
window.STORIES = window.STORIES || {};

window.STORIES[2] = [
  {
    type: "message",
    speaker: "morara",
    text: "어? 오늘도 왔네? 🐟"
  },
  {
    type: "message",
    speaker: "morara",
    text: "어제는 잘 들어갔어?"
  },
  {
    type: "choice",
    options: [
      { text: "응! 너랑 또 이야기하고 싶었어.", affection: 5 },
      { text: "그냥 심심해서 왔어.", affection: 2 },
      { text: "아직 잘 모르겠는데?", affection: 0 }
    ]
  },
  {
    type: "message",
    speaker: "morara",
    text: "헤헤, 그렇게 말해주니까 좋네!",
    minAffection: 5
  },
  {
    type: "message",
    speaker: "morara",
    text: "뭐, 천천히 알아가면 되지!",
    maxAffection: 4
  },
  {
    type: "end"
  }
];
