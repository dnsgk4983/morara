
window.STORIES = window.STORIES || {};

window.STORIES[1] = [
  {
    type: "message",
    speaker: "morara",
    text: "어? 안녕! 처음 보는 사람인데?"
  },
  {
    type: "message",
    speaker: "morara",
    text: "너 나랑 친해지고 싶은 거야? 🐟"
  },
  {
    type: "choice",
    options: [
      { text: "응! 친해지고 싶어.", affection: 5 },
      { text: "그냥 인사하러 왔어.", affection: 2 },
      { text: "글쎄~ 어떨 것 같아?", affection: 0 }
    ]
  },
  {
    type: "message",
    speaker: "morara",
    text: "오~ 자신감 있는데? 마음에 드는걸!",
    minAffection: 5
  },
  {
    type: "message",
    speaker: "morara",
    text: "흐음~ 앞으로 어떻게 될지 기대되네!",
    maxAffection: 4
  },
  {
    type: "image",
    src: "https://placehold.co/600x400/ffe1e8/555555?text=DAY+1",
    alt: "1일차 모라라 이미지"
  },
  {
    type: "end"
  }
];
