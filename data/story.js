/* Dear Morara | 창작 대사이며 실제 방송 발언이 아닙니다. */
(() => {
  "use strict";
  const chapters = [
  {
    "day": 1,
    "title": "어푸어푸, 뉴비 검문하겠습니다",
    "theme": "첫 방송·코랄단 투표",
    "image": "day01",
    "beats": [
      {
        "lines": [
          "어푸어푸~ 어? 처음 보는 닉인데?",
          "뉴비야? 아니면 닉 바꾼 거야?"
        ],
        "imageAfter": true,
        "options": [
          {
            "id": "choice_1",
            "text": "공주님 보려고 왔어요.",
            "reply": [
              "오, 첫날부터 공주님?",
              "근데 그렇게 부른다고 특별 대우는 없음 ㅋㅋ"
            ],
            "score": 4,
            "flags": [
              "steady"
            ],
            "next": 1
          },
          {
            "id": "choice_2",
            "text": "개복치가 방송한다길래 구경 왔는데요.",
            "reply": [
              "아니 개복치가 방송하면 안 돼? ㅋㅋㅋ",
              "일단 앉아 봐."
            ],
            "score": 7,
            "flags": [
              "playful"
            ],
            "next": 1
          },
          {
            "id": "choice_3",
            "text": "일단 재밌는지 보고 결정할게요.",
            "reply": [
              "와 평가단이 오셨네 ㅋㅋ",
              "그래, 보고 결정해. 강요 안 함."
            ],
            "score": 7,
            "flags": [
              "trust"
            ],
            "next": 1
          }
        ]
      },
      {
        "lines": [
          "근데 잠깐, 채팅창에 뭐 올라왔어?",
          "[코랄단 특별 이벤트] 10일 동안 모라라 공략 게임?",
          "아니 내 허락은 받고 공략하는 거야? ㅋㅋㅋ"
        ],
        "imageAfter": false,
        "options": [
          {
            "id": "choice_1",
            "text": "이미 참가 눌렀는데요?",
            "reply": [
              "아니 벌써? ㅋㅋ",
              "참여는 자유인데 내 방송 망치면 바로 탈락임."
            ],
            "score": 7,
            "flags": [
              "playful"
            ],
            "next": 2
          },
          {
            "id": "choice_2",
            "text": "싫으면 안 할게요.",
            "reply": [
              "그 정도는 괜찮아.",
              "대신 나한테 뭐 해달라고 떼쓰지 마."
            ],
            "score": 8,
            "flags": [
              "trust"
            ],
            "next": 2
          },
          {
            "id": "choice_3",
            "text": "공주님 마음은 제가 책임지겠습니다.",
            "reply": [
              "아 뭘 책임져 ㅋㅋㅋ",
              "그런 멘트로 점수 안 줄 거거든?"
            ],
            "score": 3,
            "flags": [
              "steady"
            ],
            "next": 2
          }
        ]
      },
      {
        "lines": [
          "이벤트 설명 보니까 진짜 웃기네.",
          "공주님은 여러분을 좋아해 줄 의무가 없습니다.",
          "이거 누가 썼냐? 맞는 말이긴 한데 ㅋㅋ"
        ],
        "imageAfter": false,
        "options": [
          {
            "id": "choice_1",
            "text": "그럼 그냥 재밌게 놀다 갈게요.",
            "reply": [
              "그래, 그게 제일 낫지.",
              "채팅 치다 보면 알아서 친해지는 거지."
            ],
            "score": 8,
            "flags": [
              "trust"
            ],
            "next": 3
          },
          {
            "id": "choice_2",
            "text": "이벤트 만든 사람 센스 있네.",
            "reply": [
              "인정. 마지막 문장이 킬포야 ㅋㅋ",
              "누가 만든 건진 몰라도 좀 웃기네."
            ],
            "score": 7,
            "flags": [
              "playful"
            ],
            "next": 3
          },
          {
            "id": "choice_3",
            "text": "무조건 좋아하게 만들어 드릴게요.",
            "reply": [
              "아니 왜 무조건인데 ㅋㅋ",
              "내 마음은 내가 정하거든."
            ],
            "score": 1,
            "flags": [
              "creative"
            ],
            "next": 3
          }
        ]
      },
      {
        "lines": [
          "자, 오늘 뉴비 검문은 여기까지.",
          "내일은 마인크래프트 방송할 거야. 광산도 가볼 생각이고.",
          "미리 말하는데 위치 스포랑 훈수는 금지다? ㅋㅋ"
        ],
        "imageAfter": false,
        "options": [
          {
            "id": "choice_1",
            "text": "훈수 안 하고 구경할게요.",
            "reply": [
              "오케이. 말 잘 통하네.",
              "내일 보자."
            ],
            "score": 8,
            "flags": [
              "trust"
            ],
            "next": null
          },
          {
            "id": "choice_2",
            "text": "다이아 못 찾으면 석탄 부자라고 놀릴게요.",
            "reply": [
              "야 아직 시작도 안 했는데 ㅋㅋ",
              "...그 정도는 웃기긴 하네.",
              "그럼 다음 방송에서 보자!"
            ],
            "score": 8,
            "flags": [
              "playful"
            ],
            "next": null
          },
          {
            "id": "choice_3",
            "text": "다이아 위치는 제가 다 알려드릴게요.",
            "reply": [
              "방금 훈수 금지라 했는데?",
              "너 내 말 안 듣지 ㅋㅋ",
              "그럼 다음 방송에서 보자!"
            ],
            "score": 1,
            "flags": [
              "creative"
            ],
            "next": null
          }
        ]
      }
    ]
  },
  {
    "day": 2,
    "title": "훈수 금지라고 했지",
    "theme": "마인크래프트",
    "image": "day02",
    "beats": [
      {
        "lines": [
          "어푸어푸~ 어제 처음 왔던 닉도 보이네.",
          "어제 말했던 대로 오늘은 마크 방송!",
          "집 근처 광산부터 둘러볼게. 다이아가 목표야."
        ],
        "imageAfter": false,
        "options": [
          {
            "id": "choice_1",
            "text": "어제 훈수 금지라고 했죠. 기억해요.",
            "reply": [
              "오, 기억하네?",
              "그래. 오늘은 내가 직접 찾는다."
            ],
            "score": 8,
            "flags": [
              "trust"
            ],
            "next": 1
          },
          {
            "id": "choice_2",
            "text": "오늘은 석탄 부자 되는 날인가요?",
            "reply": [
              "아 시작부터 불길한 소리 하지 마 ㅋㅋ",
              "오늘은 다이아 찾는다니까?"
            ],
            "score": 8,
            "flags": [
              "playful"
            ],
            "next": 1
          },
          {
            "id": "choice_3",
            "text": "집부터 이렇게 지으세요.",
            "reply": [
              "아니 시작하자마자 건축 훈수야?",
              "일단 내가 해볼게."
            ],
            "score": 1,
            "flags": [
              "creative"
            ],
            "next": 1
          }
        ]
      },
      {
        "lines": [
          "아니 여기 분명 다이아 있었는데?",
          "어디 갔지? 분명 봤거든?"
        ],
        "imageAfter": true,
        "options": [
          {
            "id": "choice_1",
            "text": "왼쪽으로 세 칸 가세요. 거기 있어요.",
            "reply": [
              "야! 스포하지 말라고 했지!",
              "나 혼자 찾을 거라고!"
            ],
            "score": 0,
            "flags": [
              "creative"
            ],
            "next": 2
          },
          {
            "id": "choice_2",
            "text": "공주님이 못 찾으시면 없는 거죠.",
            "reply": [
              "아니 내 눈이 문제라는 거야? ㅋㅋ",
              "...잠깐, 진짜 없는 거 아냐?"
            ],
            "score": 4,
            "flags": [
              "steady"
            ],
            "next": 2
          },
          {
            "id": "choice_3",
            "text": "그럼 오늘은 석탄 부자 되는 날이네.",
            "reply": [
              "석탄 부자 ㅋㅋㅋㅋ",
              "아니 다이아 찾는다니까?"
            ],
            "score": 8,
            "flags": [
              "playful"
            ],
            "next": 2
          }
        ]
      },
      {
        "lines": [
          "어, 찾았다! 여기 있었네.",
          "봤지? 직접 찾았잖아 ㅋㅋ",
          "이제 집으로 돌아가서 건축 좀 해야겠다."
        ],
        "imageAfter": false,
        "options": [
          {
            "id": "choice_1",
            "text": "길 찾는 건 직접 하셔야죠 ㅋㅋ",
            "reply": [
              "아 그건 너무하잖아 ㅋㅋ",
              "일단 횃불 따라가 볼게."
            ],
            "score": 7,
            "flags": [
              "playful"
            ],
            "next": 3
          },
          {
            "id": "choice_2",
            "text": "좌표 알려달라고 하면 그때 도와드릴게요.",
            "reply": [
              "그건 괜찮지.",
              "내가 물어보면 그때 알려줘."
            ],
            "score": 9,
            "flags": [
              "trust"
            ],
            "next": 3
          },
          {
            "id": "choice_3",
            "text": "죽고 리스폰하면 빨라요.",
            "reply": [
              "와 해결법 너무 극단적이야 ㅋㅋ",
              "난 아이템 지키고 싶거든."
            ],
            "score": 2,
            "flags": [
              "creative"
            ],
            "next": 3
          }
        ]
      },
      {
        "lines": [
          "집 도착! 오늘은 광산도 다녀오고 집도 조금 손봤네.",
          "아, 내일은 채팅에서 맨날 하던 공주님 얘기 좀 해볼까?",
          "누가 자꾸 왕관 내놓으라는데, 내일 제대로 보여 주지 ㅋㅋ"
        ],
        "imageAfter": false,
        "options": [
          {
            "id": "choice_1",
            "text": "왕관이요? 갑자기 공주님 모드?",
            "reply": [
              "아직 완성은 아니지만, 내 마음에는 들어 ㅋㅋ",
              "내일은 마크 말고 잡담하자."
            ],
            "score": 8,
            "flags": [
              "playful"
            ],
            "next": null
          },
          {
            "id": "choice_2",
            "text": "오늘 집 예쁘던데요.",
            "reply": [
              "아직 미완성인데 좋게 봐주네.",
              "내일은 마크 말고 잡담하자."
            ],
            "score": 8,
            "flags": [
              "empathy"
            ],
            "next": null
          },
          {
            "id": "choice_3",
            "text": "다음엔 제 설계대로 지어요.",
            "reply": [
              "또 설계 훈수야? ㅋㅋ 내 집은 내가 짓는다.",
              "내일은 마크 말고 잡담하자."
            ],
            "score": 1,
            "flags": [
              "creative"
            ],
            "next": null
          }
        ]
      }
    ]
  },
  {
    "day": 3,
    "title": "왕관은 셀프 서비스입니다",
    "theme": "공주님 논쟁",
    "image": "day03",
    "beats": [
      {
        "lines": [
          "어푸어푸~ 오늘은 게임 말고 잡담!",
          "어제 내가 왕관 얘기한다고 했지?",
          "자, 오늘도 공주님 입장하셨습니다 ㅋㅋ"
        ],
        "imageAfter": true,
        "options": [
          {
            "id": "choice_1",
            "text": "공주님 만세!",
            "reply": [
              "좋아. 드디어 예의를 아는 사람이 ㅋㅋ",
              "...근데 그렇게까지 할 필요는 없고."
            ],
            "score": 4,
            "flags": [
              "steady"
            ],
            "next": 1
          },
          {
            "id": "choice_2",
            "text": "공주님, 오늘 세금은 얼마 걷으세요?",
            "reply": [
              "세금? ㅋㅋㅋㅋ",
              "너네가 나한테 세금 내는 거야?"
            ],
            "score": 9,
            "flags": [
              "playful"
            ],
            "next": 1
          },
          {
            "id": "choice_3",
            "text": "공주면 왕관부터 보여 주세요.",
            "reply": [
              "아니 여기 있잖아!",
              "보여 줘도 못 믿네 ㅋㅋ"
            ],
            "score": 8,
            "flags": [
              "playful"
            ],
            "next": 1
          }
        ]
      },
      {
        "lines": [
          "근데 채팅에서 왕국 재정 공개하래.",
          "아니 내 방송이 왜 국정감사가 됐는데? ㅋㅋ"
        ],
        "imageAfter": false,
        "options": [
          {
            "id": "choice_1",
            "text": "그럼 왕국 재정 상태부터 공개하시죠.",
            "reply": [
              "와 이 사람들 진짜 ㅋㅋ",
              "재정은 비밀입니다. 다음 질문!"
            ],
            "score": 8,
            "flags": [
              "playful"
            ],
            "next": 2
          },
          {
            "id": "choice_2",
            "text": "왕국이 아니라 수족관 아닌가요?",
            "reply": [
              "야 ㅋㅋㅋ 수족관은 또 뭐야!",
              "나가. 아니 나가진 말고 조용히 해 ㅋㅋ"
            ],
            "score": 8,
            "flags": [
              "playful"
            ],
            "next": 2
          },
          {
            "id": "choice_3",
            "text": "공주님 말씀이 다 옳습니다.",
            "reply": [
              "아니 뭘 또 다 맞대 ㅋㅋ",
              "적당히 좀 해."
            ],
            "score": 2,
            "flags": [
              "steady"
            ],
            "next": 2
          }
        ]
      },
      {
        "lines": [
          "아니 근데 너네는 왜 공주라 하면 꼭 개복치 얘기를 해?",
          "둘 다 나라고? 그게 말이 되냐고 ㅋㅋ"
        ],
        "imageAfter": false,
        "options": [
          {
            "id": "choice_1",
            "text": "하트 개복치 공주면 되죠.",
            "reply": [
              "그걸 합쳐 버리네 ㅋㅋ",
              "...이름은 좀 귀엽긴 하다."
            ],
            "score": 8,
            "flags": [
              "playful"
            ],
            "next": 3
          },
          {
            "id": "choice_2",
            "text": "싫으시면 그 장난은 그만할게요.",
            "reply": [
              "싫은 건 아니야.",
              "근데 진짜 싫다 하면 멈추는 거다?"
            ],
            "score": 9,
            "flags": [
              "trust"
            ],
            "next": 3
          },
          {
            "id": "choice_3",
            "text": "싫다 해도 계속 수족관이라 부를게요.",
            "reply": [
              "아니 싫다 하면 그만해야지.",
              "그건 재미없어."
            ],
            "score": 0,
            "flags": [
              "creative"
            ],
            "next": 3
          }
        ]
      },
      {
        "lines": [
          "아무튼 오늘 왕국 회의는 여기까지.",
          "내일 축구 경기 있는 거 알지?",
          "아, 내일은 진짜 이겼으면 좋겠다."
        ],
        "imageAfter": false,
        "options": [
          {
            "id": "choice_1",
            "text": "경기 같이 볼게요.",
            "reply": [
              "오, 축구 볼 줄 알아?",
              "몰라도 괜찮아. 같이 보면 되지.",
              "그럼 다음 방송에서 보자!"
            ],
            "score": 8,
            "flags": [
              "trust"
            ],
            "next": null
          },
          {
            "id": "choice_2",
            "text": "벌써 승리 선언인가요?",
            "reply": [
              "아니 기대는 할 수 있잖아 ㅋㅋ",
              "내일 보자고."
            ],
            "score": 8,
            "flags": [
              "playful"
            ],
            "next": null
          },
          {
            "id": "choice_3",
            "text": "지면 바로 놀릴 준비할게요.",
            "reply": [
              "야 벌써 그러지 마 ㅋㅋ",
              "경기 끝나고 분위기 봐라.",
              "그럼 다음 방송에서 보자!"
            ],
            "score": 2,
            "flags": [
              "creative"
            ],
            "next": null
          }
        ]
      }
    ]
  },
  {
    "day": 4,
    "title": "토트넘 건드리면 책임 못 집니다",
    "theme": "축구의 날",
    "image": "day04",
    "beats": [
      {
        "lines": [
          "어푸어푸~ 어제 말했던 축구 경기 시작한다!",
          "오늘은 진짜 이길 수 있을 것 같은데?",
          "아니, 일단 끝까지 봐야 아는 거긴 해 ㅋㅋ"
        ],
        "imageAfter": true,
        "options": [
          {
            "id": "choice_1",
            "text": "당연하죠. 무조건 이기죠.",
            "reply": [
              "그래 그 기세는 좋다 ㅋㅋ",
              "근데 경기 끝날 때까진 모르는 거지."
            ],
            "score": 4,
            "flags": [
              "steady"
            ],
            "next": 1
          },
          {
            "id": "choice_2",
            "text": "그 말 지난번에도 하지 않았어요?",
            "reply": [
              "아니 왜 벌써부터 불안하게 만들어! ㅋㅋㅋ",
              "오늘은 다르다고!"
            ],
            "score": 8,
            "flags": [
              "playful"
            ],
            "next": 1
          },
          {
            "id": "choice_3",
            "text": "경기 끝나고 이야기하시죠.",
            "reply": [
              "맞아. 일단 보고 말하자.",
              "지금은 집중할게."
            ],
            "score": 9,
            "flags": [
              "trust"
            ],
            "next": 1
          }
        ]
      },
      {
        "lines": [
          "아 지금 찬스인데!",
          "아아아 잠깐, 공이 왜 거기로 가!",
          "채팅 잠깐만, 나 경기 좀 볼게."
        ],
        "imageAfter": false,
        "options": [
          {
            "id": "choice_1",
            "text": "집중해서 보세요. 채팅은 나중에요.",
            "reply": [
              "오케이. 이따 보자.",
              "지금 진짜 중요한 장면이야."
            ],
            "score": 9,
            "flags": [
              "trust"
            ],
            "next": 2
          },
          {
            "id": "choice_2",
            "text": "지금 손에 땀나죠 ㅋㅋ",
            "reply": [
              "당연하지 ㅋㅋ",
              "아 말 걸지 마, 지금!"
            ],
            "score": 7,
            "flags": [
              "playful"
            ],
            "next": 2
          },
          {
            "id": "choice_3",
            "text": "그 선수는 이렇게 움직여야죠.",
            "reply": [
              "아 지금 훈수할 타이밍이 아니거든!",
              "잠깐만 좀 봐 ㅋㅋ"
            ],
            "score": 1,
            "flags": [
              "creative"
            ],
            "next": 2
          }
        ]
      },
      {
        "lines": [
          "하... 경기 끝났다.",
          "결과가 어떻든 아쉬운 장면이 많네.",
          "오늘은 일단 물 한 잔 마시고 얘기하자."
        ],
        "imageAfter": false,
        "options": [
          {
            "id": "choice_1",
            "text": "아쉬웠겠다. 오늘은 좀 쉬어요.",
            "reply": [
              "그러게.",
              "일단 물 좀 마시고 올게."
            ],
            "score": 9,
            "flags": [
              "empathy"
            ],
            "next": 3
          },
          {
            "id": "choice_2",
            "text": "마지막까지 진짜 정신없었네요.",
            "reply": [
              "맞아. 막판에 너무 쫄렸어.",
              "그래도 보는 맛은 있었지."
            ],
            "score": 8,
            "flags": [
              "trust"
            ],
            "next": 3
          },
          {
            "id": "choice_3",
            "text": "그러니까 제가 진다고 했잖아요.",
            "reply": [
              "아 지금 그 말이 나오냐?",
              "오늘은 그 장난 안 받아."
            ],
            "score": 0,
            "flags": [
              "creative"
            ],
            "next": 3
          }
        ]
      },
      {
        "lines": [
          "아, 축구 얘기하다가 목 다 쉬겠네.",
          "내일은 그냥 편하게 잡담이나 하자.",
          "오늘처럼 소리 지르는 건 좀 쉬어야겠어 ㅋㅋ"
        ],
        "imageAfter": false,
        "options": [
          {
            "id": "choice_1",
            "text": "좋아요. 내일은 편하게 봐요.",
            "reply": [
              "응. 내일 봐.",
              "오늘 같이 봐줘서 고맙다."
            ],
            "score": 9,
            "flags": [
              "trust"
            ],
            "next": null
          },
          {
            "id": "choice_2",
            "text": "목소리 아끼세요, 공주님.",
            "reply": [
              "그건 인정 ㅋㅋ",
              "내일은 조용히 좀 해볼게."
            ],
            "score": 7,
            "flags": [
              "playful"
            ],
            "next": null
          },
          {
            "id": "choice_3",
            "text": "내일도 경기 다시보기 하죠.",
            "reply": [
              "아니 오늘로 충분해 ㅋㅋ",
              "내일은 잡담!"
            ],
            "score": 6,
            "flags": [
              "playful"
            ],
            "next": null
          }
        ]
      }
    ]
  },
  {
    "day": 5,
    "title": "오늘은 좀 조용하네",
    "theme": "잡담과 거리",
    "image": "day05",
    "beats": [
      {
        "lines": [
          "어푸어푸~ 오늘은 좀 조용히 가볼게.",
          "어제 축구 보면서 소리를 너무 질렀어 ㅋㅋ",
          "게임 대신 그냥 잡담이나 할까?"
        ],
        "imageAfter": false,
        "options": [
          {
            "id": "choice_1",
            "text": "무슨 일 있어요? 말해 봐요.",
            "reply": [
              "아니 꼭 무슨 일 있어야 조용해? ㅋㅋ",
              "그냥 오늘은 이런 날인 거지."
            ],
            "score": 2,
            "flags": [
              "creative"
            ],
            "next": 1
          },
          {
            "id": "choice_2",
            "text": "그냥 잡담해도 재밌는데요.",
            "reply": [
              "그치?",
              "나도 그냥 이런 날이 있는 거지 뭐."
            ],
            "score": 9,
            "flags": [
              "trust"
            ],
            "next": 1
          },
          {
            "id": "choice_3",
            "text": "그럼 오늘은 쉬는 게 낫지 않아요?",
            "reply": [
              "그럴 수도 있는데, 지금은 얘기하고 싶어서 켰어.",
              "내가 알아서 쉴게."
            ],
            "score": 5,
            "flags": [
              "steady"
            ],
            "next": 1
          }
        ]
      },
      {
        "lines": [
          "어제 경기 보고 좀 시끄러웠잖아.",
          "오늘은 채팅도 천천히 읽고 싶어.",
          "근데 또 이상한 질문 올라왔네 ㅋㅋ"
        ],
        "imageAfter": true,
        "options": [
          {
            "id": "choice_1",
            "text": "읽기 편하게 천천히 쓸게요.",
            "reply": [
              "오, 고마워.",
              "오늘은 그렇게 가자."
            ],
            "score": 9,
            "flags": [
              "trust"
            ],
            "next": 2
          },
          {
            "id": "choice_2",
            "text": "오늘 공주님 국정감사 2차전인가요?",
            "reply": [
              "아 그거 아직도 하냐 ㅋㅋ",
              "오늘은 감사 휴무입니다."
            ],
            "score": 8,
            "flags": [
              "playful"
            ],
            "next": 2
          },
          {
            "id": "choice_3",
            "text": "그럼 속마음 다 털어놓으세요.",
            "reply": [
              "아니 왜 다 털어놔야 해 ㅋㅋ",
              "그냥 잡담하자고."
            ],
            "score": 1,
            "flags": [
              "creative"
            ],
            "next": 2
          }
        ]
      },
      {
        "lines": [
          "근데 이렇게 별 얘기 안 해도 시간 잘 가네.",
          "너네는 조용한 방송도 괜찮아?"
        ],
        "imageAfter": false,
        "options": [
          {
            "id": "choice_1",
            "text": "오늘처럼 편한 분위기도 좋아요.",
            "reply": [
              "그럼 다행이고.",
              "맨날 뭔가 터져야 하는 건 아니니까."
            ],
            "score": 10,
            "flags": [
              "empathy"
            ],
            "next": 3
          },
          {
            "id": "choice_2",
            "text": "가끔 이런 날도 있어야죠.",
            "reply": [
              "그치.",
              "너네도 편하게 쉬다 가."
            ],
            "score": 9,
            "flags": [
              "trust"
            ],
            "next": 3
          },
          {
            "id": "choice_3",
            "text": "재미없으면 나갈게요.",
            "reply": [
              "그건 자유지.",
              "억지로 붙잡을 생각은 없어."
            ],
            "score": 5,
            "flags": [
              "steady"
            ],
            "next": 3
          }
        ]
      },
      {
        "lines": [
          "오늘은 이쯤에서 마무리할게.",
          "내일은 게임 하나 해볼 생각이야.",
          "이번엔 진짜 잘할 거거든? ㅋㅋ"
        ],
        "imageAfter": false,
        "options": [
          {
            "id": "choice_1",
            "text": "내일도 구경하러 올게요.",
            "reply": [
              "그래. 내일 봐.",
              "오늘도 와줘서 고마워."
            ],
            "score": 9,
            "flags": [
              "trust"
            ],
            "next": null
          },
          {
            "id": "choice_2",
            "text": "내일도 억까 나오나요?",
            "reply": [
              "아직 시작도 안 했는데 억까 예약이야? ㅋㅋ",
              "내일 두고 봐."
            ],
            "score": 8,
            "flags": [
              "playful"
            ],
            "next": null
          },
          {
            "id": "choice_3",
            "text": "오늘 얘기 더 해줘요.",
            "reply": [
              "아 오늘은 여기까지라니까 ㅋㅋ",
              "내일 또 보면 되지."
            ],
            "score": 2,
            "flags": [
              "creative"
            ],
            "next": null
          }
        ]
      }
    ]
  },
  {
    "day": 6,
    "title": "이건 진짜 억까야",
    "theme": "승부욕 발동",
    "image": "day06",
    "beats": [
      {
        "lines": [
          "어푸어푸~ 어제 예고했던 게임 켰다.",
          "첫 판부터 생각대로 안 풀리는데?",
          "오늘은 한 번쯤 이기고 끝내고 싶다 ㅋㅋ"
        ],
        "imageAfter": true,
        "options": [
          {
            "id": "choice_1",
            "text": "일단 한 판 더 봐요.",
            "reply": [
              "그래. 아직 첫 판이니까.",
              "다음 판은 다를 수 있지."
            ],
            "score": 8,
            "flags": [
              "trust"
            ],
            "next": 1
          },
          {
            "id": "choice_2",
            "text": "벌써 억까 선언인가요 ㅋㅋ",
            "reply": [
              "아니 진짜 억까 맞다니까 ㅋㅋ",
              "너 방금 못 봤어?"
            ],
            "score": 8,
            "flags": [
              "playful"
            ],
            "next": 1
          },
          {
            "id": "choice_3",
            "text": "그냥 접으세요.",
            "reply": [
              "아니 내가 알아서 할게 ㅋㅋ",
              "아직 해볼 만해."
            ],
            "score": 2,
            "flags": [
              "creative"
            ],
            "next": 1
          }
        ]
      },
      {
        "lines": [
          "아니 이건 내가 못한 게 아니라 게임이 이상한 거야!",
          "방금 그 판정 봤어?"
        ],
        "imageAfter": false,
        "options": [
          {
            "id": "choice_1",
            "text": "맞아요. 게임이 잘못했어요.",
            "reply": [
              "아니 너는 뭘 봐도 다 맞다고 하네 ㅋㅋ",
              "진짜로 본 거 맞아?"
            ],
            "score": 3,
            "flags": [
              "steady"
            ],
            "next": 2
          },
          {
            "id": "choice_2",
            "text": "방금은 좀 욕심부린 거 같은데?",
            "reply": [
              "어? 너 방금 봤어?",
              "아니 근데 그때는 그게 맞는 줄 알았지!"
            ],
            "score": 9,
            "flags": [
              "playful"
            ],
            "next": 2
          },
          {
            "id": "choice_3",
            "text": "한 판만 더 하면 이길 듯.",
            "reply": [
              "그치? 한 번만 더.",
              "근데 진짜 딱 한 판만 ㅋㅋ"
            ],
            "score": 8,
            "flags": [
              "trust"
            ],
            "next": 2
          }
        ]
      },
      {
        "lines": [
          "다시 보니까 내가 좀 급하게 들어갔네.",
          "아 인정하기 싫은데 ㅋㅋ",
          "이번엔 천천히 해볼게."
        ],
        "imageAfter": false,
        "options": [
          {
            "id": "choice_1",
            "text": "이번 판은 침착하게 가봐요.",
            "reply": [
              "오케이. 이번엔 안 급하게.",
              "...아 또 급했네 ㅋㅋ"
            ],
            "score": 9,
            "flags": [
              "trust"
            ],
            "next": 3
          },
          {
            "id": "choice_2",
            "text": "드디어 본인 과실 인정 ㅋㅋ",
            "reply": [
              "야 말투 봐 ㅋㅋ",
              "그래, 이번 건 인정."
            ],
            "score": 8,
            "flags": [
              "playful"
            ],
            "next": 3
          },
          {
            "id": "choice_3",
            "text": "그냥 계속 게임 탓하죠.",
            "reply": [
              "아니 그건 좀 아니지 ㅋㅋ",
              "내가 잘못한 건 인정해야지."
            ],
            "score": 3,
            "flags": [
              "steady"
            ],
            "next": 3
          }
        ]
      },
      {
        "lines": [
          "오늘은 여기까지만. 더 하면 진짜 밤 새겠다.",
          "근데 방금 웃긴 장면은 팬카페에 올라오겠지?",
          "아 제발 이상한 것만 편집하지 마 ㅋㅋ"
        ],
        "imageAfter": false,
        "options": [
          {
            "id": "choice_1",
            "text": "재밌었던 장면만 골라서 볼게요.",
            "reply": [
              "그래. 그 정도면 괜찮지.",
              "내일 또 보자."
            ],
            "score": 8,
            "flags": [
              "trust"
            ],
            "next": null
          },
          {
            "id": "choice_2",
            "text": "이미 클립 제목 생각났는데요 ㅋㅋ",
            "reply": [
              "아 뭐야 ㅋㅋ",
              "이상한 제목이면 안 된다!",
              "그럼 다음 방송에서 보자!"
            ],
            "score": 8,
            "flags": [
              "playful"
            ],
            "next": null
          },
          {
            "id": "choice_3",
            "text": "싫어해도 계속 올릴게요.",
            "reply": [
              "아니 싫다는데 왜 ㅋㅋ",
              "그건 좀 그만해.",
              "그럼 다음 방송에서 보자!"
            ],
            "score": 0,
            "flags": [
              "creative"
            ],
            "next": null
          }
        ]
      }
    ]
  },
  {
    "day": 7,
    "title": "야랄단 긴급 소집",
    "theme": "팬카페 사건",
    "image": "day07",
    "beats": [
      {
        "lines": [
          "어푸어푸~ 어제 게임 끝나고 클립 올라올까 봐 걱정했잖아?",
          "진짜 팬카페에 편집 영상이 올라왔어 ㅋㅋ",
          "이거 만든 사람 나와!"
        ],
        "imageAfter": true,
        "options": [
          {
            "id": "choice_1",
            "text": "너무 귀여워서 저장했어요.",
            "reply": [
              "귀엽다고? ㅋㅋ",
              "그럼... 뭐, 저장은 자유인데."
            ],
            "score": 5,
            "flags": [
              "steady"
            ],
            "next": 1
          },
          {
            "id": "choice_2",
            "text": "제작자 편집 실력 좋네요.",
            "reply": [
              "그건 인정. 타이밍은 기가 막히더라.",
              "근데 왜 하필 내 실수만 ㅋㅋ"
            ],
            "score": 9,
            "flags": [
              "trust"
            ],
            "next": 1
          },
          {
            "id": "choice_3",
            "text": "다음 편은 언제 올라오나요?",
            "reply": [
              "다음 편을 왜 기다려! ㅋㅋㅋ",
              "그만 만들어!"
            ],
            "score": 8,
            "flags": [
              "playful"
            ],
            "next": 1
          }
        ]
      },
      {
        "lines": [
          "영상 보니까 내가 게임 탓한 장면을 세 번이나 반복했더라.",
          "아니 편집은 잘했는데 왜 하필 그 부분이냐고 ㅋㅋ"
        ],
        "imageAfter": false,
        "options": [
          {
            "id": "choice_1",
            "text": "그 부분은 진짜 웃겼어요 ㅋㅋ",
            "reply": [
              "아 그건 나도 다시 보니까 웃기더라.",
              "근데 세 번은 너무하잖아 ㅋㅋ"
            ],
            "score": 9,
            "flags": [
              "playful"
            ],
            "next": 2
          },
          {
            "id": "choice_2",
            "text": "불편하면 게시물 내리라고 할까요?",
            "reply": [
              "아냐, 이 정도는 괜찮아.",
              "진짜 싫은 건 따로 말할게."
            ],
            "score": 10,
            "flags": [
              "trust"
            ],
            "next": 2
          },
          {
            "id": "choice_3",
            "text": "싫다 해도 계속 퍼뜨려야죠.",
            "reply": [
              "아니 싫다는데 왜 퍼뜨려.",
              "그건 장난 아니지."
            ],
            "score": 0,
            "flags": [
              "creative"
            ],
            "next": 2
          }
        ]
      },
      {
        "lines": [
          "그래도 영상 끝에 다 같이 웃던 장면도 넣어 놨더라.",
          "실수만 있는 줄 알았는데 그건 좀 좋았어."
        ],
        "imageAfter": false,
        "options": [
          {
            "id": "choice_1",
            "text": "웃는 장면이 제일 기억에 남아요.",
            "reply": [
              "어? 그건 좀 좋네.",
              "...아니 그렇다고 감동한 건 아니고 ㅋㅋ"
            ],
            "score": 10,
            "flags": [
              "empathy"
            ],
            "next": 3
          },
          {
            "id": "choice_2",
            "text": "실패하고 웃는 게 킬포죠.",
            "reply": [
              "그건 맞아 ㅋㅋ",
              "너네 진짜 이상한 데서 잘 웃어."
            ],
            "score": 9,
            "flags": [
              "playful"
            ],
            "next": 3
          },
          {
            "id": "choice_3",
            "text": "그럼 매번 일부러 져주세요.",
            "reply": [
              "야 그건 싫지 ㅋㅋ",
              "난 이기고 싶다고!"
            ],
            "score": 2,
            "flags": [
              "creative"
            ],
            "next": 3
          }
        ]
      },
      {
        "lines": [
          "아무튼 클립은 재밌게 봤다.",
          "내일은 방송 끝나기 전에 노래 한 곡 해볼까 해.",
          "이번엔 놀리는 채팅 좀 줄여라? ㅋㅋ"
        ],
        "imageAfter": false,
        "options": [
          {
            "id": "choice_1",
            "text": "노래할 땐 조용히 들을게요.",
            "reply": [
              "오케이. 그럼 내일 보자."
            ],
            "score": 9,
            "flags": [
              "trust"
            ],
            "next": null
          },
          {
            "id": "choice_2",
            "text": "노래도 클립 따도 되나요?",
            "reply": [
              "그건 나중에 얘기하자.",
              "일단 들어보고 ㅋㅋ",
              "그럼 다음 방송에서 보자!"
            ],
            "score": 7,
            "flags": [
              "playful"
            ],
            "next": null
          },
          {
            "id": "choice_3",
            "text": "노래 못하면 바로 놀릴게요.",
            "reply": [
              "아 아직 부르지도 않았는데 ㅋㅋ",
              "그런 건 좀 봐줘.",
              "그럼 다음 방송에서 보자!"
            ],
            "score": 2,
            "flags": [
              "creative"
            ],
            "next": null
          }
        ]
      }
    ]
  },
  {
    "day": 8,
    "title": "노래하는 개복치",
    "theme": "노래와 감상",
    "image": "day08",
    "beats": [
      {
        "lines": [
          "어푸어푸~ 어제 예고했던 노래 한 곡 할게.",
          "평소처럼 장난쳐도 되는데, 부를 때는 잠깐만 들어줘 ㅋㅋ",
          "아, 괜히 말했나. 조금 떨리네."
        ],
        "imageAfter": true,
        "options": [
          {
            "id": "choice_1",
            "text": "기억해요. 편하게 불러요.",
            "reply": [
              "오케이. 괜히 긴장하지 말자.",
              "들어줘."
            ],
            "score": 9,
            "flags": [
              "trust"
            ],
            "next": 1
          },
          {
            "id": "choice_2",
            "text": "개복치 콘서트 개장!",
            "reply": [
              "아 좀 ㅋㅋ",
              "콘서트까진 아니고 한 곡이야."
            ],
            "score": 8,
            "flags": [
              "playful"
            ],
            "next": 1
          },
          {
            "id": "choice_3",
            "text": "완벽하게 불러야 해요.",
            "reply": [
              "아니 왜 압박을 줘 ㅋㅋ",
              "편하게 부를 거라니까."
            ],
            "score": 1,
            "flags": [
              "creative"
            ],
            "next": 1
          }
        ]
      },
      {
        "lines": [
          "...후. 끝났다.",
          "어땠어? 오늘은 좀 다르게 불러 봤는데."
        ],
        "imageAfter": false,
        "options": [
          {
            "id": "choice_1",
            "text": "완벽했어요. 역대 최고예요.",
            "reply": [
              "아니 매번 역대 최고래 ㅋㅋ",
              "고맙긴 한데 어디가 좋았어?"
            ],
            "score": 4,
            "flags": [
              "steady"
            ],
            "next": 2
          },
          {
            "id": "choice_2",
            "text": "오늘은 특히 마지막 부분이 좋았어요.",
            "reply": [
              "어, 그 부분?",
              "거기 좀 신경 썼는데. 알아봐 줬네?"
            ],
            "score": 10,
            "flags": [
              "empathy"
            ],
            "next": 2
          },
          {
            "id": "choice_3",
            "text": "다음에는 다른 곡도 불러 주세요.",
            "reply": [
              "아직 한 곡 끝났는데 다음 곡? ㅋㅋ",
              "오늘 곡은 어땠는지도 말해 줘."
            ],
            "score": 3,
            "flags": [
              "creative"
            ],
            "next": 2
          }
        ]
      },
      {
        "lines": [
          "마지막 부분은 원래보다 좀 천천히 불렀거든.",
          "그게 들렸다는 게 좀 신기하다."
        ],
        "imageAfter": false,
        "options": [
          {
            "id": "choice_1",
            "text": "그래서 더 여운이 남았어요.",
            "reply": [
              "아, 그 말 좋다.",
              "다음에 부를 때도 참고해야겠다."
            ],
            "score": 10,
            "flags": [
              "empathy"
            ],
            "next": 3
          },
          {
            "id": "choice_2",
            "text": "그 부분 다시 듣고 싶어요.",
            "reply": [
              "나중에 다시 들을 수 있으면 좋겠다.",
              "오늘은 일단 여기까지 ㅋㅋ"
            ],
            "score": 9,
            "flags": [
              "trust"
            ],
            "next": 3
          },
          {
            "id": "choice_3",
            "text": "그냥 다 잘했어요.",
            "reply": [
              "고맙긴 한데 ㅋㅋ",
              "구체적으로 말해주면 더 좋긴 해."
            ],
            "score": 4,
            "flags": [
              "steady"
            ],
            "next": 3
          }
        ]
      },
      {
        "lines": [
          "오늘도 들어줘서 고마워.",
          "내일은 개인 일정 때문에 방송 쉬어 갈 거야.",
          "팬카페 공지 올려둘 테니까 확인해 줘."
        ],
        "imageAfter": false,
        "options": [
          {
            "id": "choice_1",
            "text": "네. 푹 쉬고 오세요.",
            "reply": [
              "응. 내일은 쉬고, 그다음에 보자."
            ],
            "score": 10,
            "flags": [
              "trust"
            ],
            "next": null
          },
          {
            "id": "choice_2",
            "text": "그럼 오늘 노래로 이틀치 충전할게요.",
            "reply": [
              "뭘 또 충전이야 ㅋㅋ",
              "아무튼 고맙다.",
              "그럼 다음 방송에서 보자!"
            ],
            "score": 8,
            "flags": [
              "playful"
            ],
            "next": null
          },
          {
            "id": "choice_3",
            "text": "왜 쉬어요? 방송해 주세요.",
            "reply": [
              "아니 개인 일정이라니까.",
              "쉬는 날은 쉬어야지.",
              "그럼 다음 방송에서 보자!"
            ],
            "score": 0,
            "flags": [
              "creative"
            ],
            "next": null
          }
        ]
      }
    ]
  },
  {
    "day": 9,
    "title": "오늘은 방송이 없습니다",
    "theme": "휴방 공지",
    "image": "day09",
    "beats": [
      {
        "lines": [
          "[모라라 · 팬카페 공지]",
          "오늘은 개인 일정 때문에 방송을 쉬어 갈게요.",
          "내일 방송에서 만나요! 댓글은 나중에 확인할게요."
        ],
        "imageAfter": true,
        "options": [
          {
            "id": "choice_1",
            "text": "왜 쉬어요? 기다렸는데.",
            "reply": [
              "[이벤트 안내] 댓글이 등록되었습니다.",
              "모라라는 휴방 중이므로 답장은 다음 방송에서 확인할 수 있습니다."
            ],
            "score": 0,
            "flags": [
              "creative"
            ],
            "next": 1
          },
          {
            "id": "choice_2",
            "text": "푹 쉬고 내일 봐요.",
            "reply": [
              "[이벤트 안내] 댓글이 등록되었습니다.",
              "모라라는 휴방 중이므로 답장은 다음 방송에서 확인할 수 있습니다."
            ],
            "score": 10,
            "flags": [
              "trust"
            ],
            "next": 1
          },
          {
            "id": "choice_3",
            "text": "방송 없으니까 밀린 게임 해야겠다.",
            "reply": [
              "[이벤트 안내] 댓글이 등록되었습니다.",
              "모라라는 휴방 중이므로 답장은 다음 방송에서 확인할 수 있습니다."
            ],
            "score": 9,
            "flags": [
              "playful"
            ],
            "next": 1
          }
        ]
      },
      {
        "lines": [
          "[코랄단 특별 이벤트 · DAY 9]",
          "오늘은 휴방일이니 모라라에게 답장을 요구하는 미션은 없습니다.",
          "대신 지금까지의 방송 중 기억에 남는 장면을 골라 보세요."
        ],
        "imageAfter": false,
        "options": [
          {
            "id": "choice_1",
            "text": "첫날 뉴비 검문부터 기억나요.",
            "reply": [
              "[이벤트] 첫날의 인사 기록을 확인했습니다."
            ],
            "score": 8,
            "flags": [
              "hidden"
            ],
            "next": 2
          },
          {
            "id": "choice_2",
            "text": "마크에서 석탄 부자 됐던 날 ㅋㅋ",
            "reply": [
              "[이벤트] DAY 2의 게임 기록을 확인했습니다."
            ],
            "score": 8,
            "flags": [
              "playful"
            ],
            "next": 2
          },
          {
            "id": "choice_3",
            "text": "쉬는 날엔 이벤트도 쉬어야죠.",
            "reply": [
              "[이벤트] 오늘은 천천히 둘러봐도 됩니다."
            ],
            "score": 9,
            "flags": [
              "trust"
            ],
            "next": 2
          }
        ]
      },
      {
        "lines": [
          "[이벤트 기록 돌아보기]",
          "뉴비 검문, 마크 광산, 공주님 농담, 축구, 잡담, 게임, 팬카페 클립, 노래.",
          "여기까지 실제로 함께 본 방송 중 어떤 순간이 기억에 남나요?"
        ],
        "imageAfter": false,
        "options": [
          {
            "id": "choice_1",
            "text": "웃겼던 순간이요.",
            "reply": [
              "[이벤트] 장난의 기록을 남겼습니다."
            ],
            "score": 8,
            "flags": [
              "playful"
            ],
            "next": 3
          },
          {
            "id": "choice_2",
            "text": "조용히 잡담하던 날이요.",
            "reply": [
              "[이벤트] 함께 쉬어 간 시간을 기록했습니다."
            ],
            "score": 9,
            "flags": [
              "hidden"
            ],
            "next": 3
          },
          {
            "id": "choice_3",
            "text": "노래 마지막 부분이요.",
            "reply": [
              "[이벤트] 구체적인 감상을 기록했습니다."
            ],
            "score": 10,
            "flags": [
              "empathy"
            ],
            "next": 3
          }
        ]
      },
      {
        "lines": [
          "[코랄단 특별 이벤트 · 마지막 안내]",
          "내일 방송에서 최종 결과를 공개합니다.",
          "오늘은 휴방을 존중하고, 각자 편히 쉬어 주세요."
        ],
        "imageAfter": false,
        "options": [
          {
            "id": "choice_1",
            "text": "내일 방송에서 봬요.",
            "reply": [
              "[이벤트 안내] 마지막 기록을 저장했습니다.",
              "내일 방송에서 결과를 확인해 주세요."
            ],
            "score": 10,
            "flags": [
              "trust"
            ],
            "next": null
          },
          {
            "id": "choice_2",
            "text": "내일 또 놀릴 준비하고 올게요 ㅋㅋ",
            "reply": [
              "[이벤트 안내] 마지막 기록을 저장했습니다.",
              "내일 방송에서 결과를 확인해 주세요."
            ],
            "score": 8,
            "flags": [
              "playful"
            ],
            "next": null
          },
          {
            "id": "choice_3",
            "text": "내일도 쉬시면 안 돼요.",
            "reply": [
              "[이벤트 안내] 마지막 기록을 저장했습니다.",
              "내일 방송에서 결과를 확인해 주세요."
            ],
            "score": 1,
            "flags": [
              "creative"
            ],
            "next": null
          }
        ]
      }
    ]
  },
  {
    "day": 10,
    "title": "공주님, 이제 선택하세요",
    "theme": "최종 공략",
    "image": "day10",
    "beats": [
      {
        "lines": [
          "어푸어푸~ 하루 쉬고 왔습니다!",
          "다들 어제 잘 쉬었어? 뭐 하고 놀았어?",
          "어, 코랄단 이벤트도 오늘이 마지막이네?"
        ],
        "imageAfter": true,
        "options": [
          {
            "id": "choice_1",
            "text": "밀린 게임 했어요.",
            "reply": [
              "오, 그랬어?",
              "잘 쉬었네."
            ],
            "score": 9,
            "flags": [
              "trust"
            ],
            "next": 1
          },
          {
            "id": "choice_2",
            "text": "공지 보고 푹 쉬었어요.",
            "reply": [
              "그치. 쉬는 날엔 쉬어야지."
            ],
            "score": 9,
            "flags": [
              "empathy"
            ],
            "next": 1
          },
          {
            "id": "choice_3",
            "text": "방송 기다리느라 아무것도 안 했어요.",
            "reply": [
              "아니 그러지 마 ㅋㅋ",
              "너 할 일도 해야지."
            ],
            "score": 3,
            "flags": [
              "steady"
            ],
            "next": 1
          }
        ]
      },
      {
        "lines": [
          "아니 근데 이거 미연시라며?",
          "왜 나랑 연애하는 내용은 하나도 없어? ㅋㅋ",
          "내가 10일 동안 채팅만 한 거야?"
        ],
        "imageAfter": false,
        "options": [
          {
            "id": "choice_1",
            "text": "연애가 목적이면 방송을 보러 오진 않았겠죠.",
            "reply": [
              "어? 그건 또 맞는 말이네.",
              "...아니 좀 멋있게 말하지 마 ㅋㅋ"
            ],
            "score": 10,
            "flags": [
              "empathy"
            ],
            "next": 2
          },
          {
            "id": "choice_2",
            "text": "공주님은 공략 대상이 아니라 놀림 대상입니다.",
            "reply": [
              "아니 잠깐만, 그게 무슨 소리야! ㅋㅋㅋ",
              "나도 공주님 대접 좀 받아 보자고!"
            ],
            "score": 9,
            "flags": [
              "playful"
            ],
            "next": 2
          },
          {
            "id": "choice_3",
            "text": "그냥 앞으로도 재밌게 방송해 주세요.",
            "reply": [
              "그건 나도 그러고 싶지.",
              "와줘서 고마워."
            ],
            "score": 10,
            "flags": [
              "trust"
            ],
            "next": 2
          }
        ]
      },
      {
        "lines": [
          "[코랄단 특별 이벤트 · 최종 질문]",
          "Q. 당신은 왜 모라라의 방송을 보나요?",
          "정답은 하나가 아닙니다."
        ],
        "imageAfter": false,
        "options": [
          {
            "id": "choice_1",
            "text": "웃다가도 진지해지는 순간이 좋아서요.",
            "reply": [
              "...아 그건 좀 부끄러운데.",
              "그래도 고마워."
            ],
            "score": 10,
            "flags": [
              "empathy"
            ],
            "next": 3
          },
          {
            "id": "choice_2",
            "text": "개복치랑 티키타카하는 게 재밌어서요.",
            "reply": [
              "아 진짜 ㅋㅋㅋ",
              "결국 개복치로 끝나는구나."
            ],
            "score": 9,
            "flags": [
              "playful"
            ],
            "next": 3
          },
          {
            "id": "choice_3",
            "text": "편하게 와서 즐길 수 있어서요.",
            "reply": [
              "그럼 다행이지.",
              "앞으로도 부담 없이 와."
            ],
            "score": 10,
            "flags": [
              "trust"
            ],
            "next": 3
          }
        ]
      },
      {
        "lines": [
          "[이벤트 결과 집계 중...]",
          "첫날 뉴비 검문부터 오늘까지, 전부 기록됐습니다.",
          "모라라: 야 잠깐, 내 점수표를 왜 너네가 만들었는데? ㅋㅋ"
        ],
        "imageAfter": false,
        "options": [
          {
            "id": "choice_1",
            "text": "앞으로도 적당히 놀리면서 볼게요.",
            "reply": [
              "그래. 적당히가 중요해 ㅋㅋ",
              "다음 방송에서도 보자."
            ],
            "score": 9,
            "flags": [
              "playful"
            ],
            "next": null
          },
          {
            "id": "choice_2",
            "text": "불편한 건 선 지키면서 즐길게요.",
            "reply": [
              "그게 제일 좋지.",
              "너도 나도 편해야 오래 보는 거야."
            ],
            "score": 10,
            "flags": [
              "trust"
            ],
            "next": null
          },
          {
            "id": "choice_3",
            "text": "싫어해도 계속 공략할 거예요.",
            "reply": [
              "아니 싫다 하면 멈춰야지.",
              "이벤트 끝났어."
            ],
            "score": 0,
            "flags": [
              "creative"
            ],
            "next": null
          }
        ]
      }
    ]
  }
];
  window.MORARA_STORY = chapters;
})();
