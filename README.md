# 모라라 v11.1 — SCSS 정리

- 기존 v11의 HTML/JS/스토리를 유지하고 SCSS를 재정리했습니다.
- `scss/pages/_splash.scss`에 `.splash > .splash__scene` 하위 요소를 중첩 작성했습니다.
- 시작 버튼에 `@include vw(padding-top, 10px);` 적용했습니다.
- `scss/style.scss`에서 손상된 @media 조각, 빈 선언, 불필요한 공백과 이전 splash 중복 선택자를 제거했습니다.
- SCSS에서 CSS를 실제 컴파일했습니다.
- 기존 이미지들은 유지하고, bg_button.png만 포함합니다. title_bg.png, title_text.png 등은 기존 assets/images에 두세요.
- 전체 레거시 선택자의 전면 BEM 개명은 하지 않았습니다. 요청하신 splash-scene 내부 클래스만 개명했습니다.
