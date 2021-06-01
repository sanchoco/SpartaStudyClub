# 스파르타 스터디 클럽 !! (Back-end)

>시간 내에 모든 목표를 달성하세요! 학습 목표를 확실하게 관리해드립니다!

![115776896-9d823700-a3ef-11eb-8907-d07593c789d7](https://user-images.githubusercontent.com/58046372/115961211-5fe8ef80-a550-11eb-9b0a-ff0bbe7fd461.png)

## 🏄‍♀️ 구현 영상
- https://youtu.be/PO9PinZHFJs

## 🚴 기능 소개
- 매일 매일 학습 목표와 시간을 설정하고 완료한 것은 체크할 수 있어요!
- 최근 5일간 학습한 그래프를 볼 수 있고 달력을 통해 이전 기록들을 볼 수 있어요! 달성률이 높은 날일수록 색이 진하게 보여요.
- 채팅을 통해 다른 유저를 응원하고 소통할 수 있어요!
- 스터디 그룹에 가입하여 비슷한 목표를 가진 사람들끼리 경쟁하고 랭킹을 볼 수 있어요.
- 스터디 그룹 내 게시판을 활용하여 정보를 교류하거나 응원의 메세지를 남길 수 있습니다!

## 프로젝트 개요
- **사용 기술**
  - Node.js, TypeScript, NestJS, Websocket(ws), Mysql, TypeORM, JWT, Rest API

- **프로젝트 기간**
  - 21.04.09 ~ 21.04.22 (2주)

- **팀원과 역할**
  - **조상균** : 회원가입, 로그인, 미들웨어 및 인증, 채팅 기능 [``src/user``, ``src/middleware``, ``src/chat``]
  - **원동균** : 나의 목표 설정 및 관리, 스터디 그룹 기능 [``src/quest``, ``src/group``, ``src/comment``]
  - **고미송** : 프론트엔드 React의 모든 부분, 사이트 배포
  - **백엔드 공통** :  프로젝트(API, DB) 설계 및 세팅


## 프로젝트 구조
<p align="center"><img src="https://user-images.githubusercontent.com/52685665/120212383-e50ca600-c26c-11eb-8ae8-958871f40984.png"></p>

## DB 설계
<p align="center"><img src="https://user-images.githubusercontent.com/52685665/120213443-2baed000-c26e-11eb-9872-6f84bcf0eb71.png"></p>

## 프로젝트 후 배운 것
   
- 팀원의 통해 NestJS의 존재를 처음 알게 되고 Typescript와 NestJS를 이번 프로젝트를 통해 처음 사용하게 되었습니다. 처음에는 문법은 비슷해보이나 사용 방법이 express와 사용법이 다르고 낮설어 힘들었으나 사용할수록 좋은 프레임워크라는 것을 알 수 있었습니다. 명령어로 간단하게 프로젝트를 구조화할 수 있고 MVC 패턴으로 만들다보니 팀원의 코드를 이해하고 쉽고 에러가 난 부분도 수정하기 쉬운 장점이 있었습니다.

- 실시간 채팅 기능을 구현하면서 socket.io가 아닌 WebSocket을 사용했는데 자료가 정말 없어 찾기 힘들었습니다. NestJS에 대한 레퍼런스 문서도 코드 한줄만 있고 데코레이션을 사용하는 방법에 대해 정확히 나와 있지 않아 힘들었지만 Node.js의 WebSocket 문서를 참조하면서 프론트에 대응하는 코드도 만드며 테스트하였습니다. 잊지 않기 위해 NestJS에서 WebSocket을 사용하는 예제를 블로그에 포스팅해두었습니다. https://velog.io/@jguuun/NestWebSocket

- MySQL과 TypeORM을 사용하여 데이터베이스를 설계하였는데 처음엔 이해하기 어려웠으나 사용할수록 편한 라이브러리였습니다. 데이터베이스의 종류에 상관없이 모델링과 함수 사용법이 같아 종속되지 않고 코드를 작성할 수 있었습니다. mongoose와 사용하는 문법도 비슷해 크게 어려움은 없었습니다. 대신 출력해야 할 데이터가 복잡한 경우 createQueryBuilder를 사용하여 해결할 수 있었습니다.


## Front-end(React) 코드
- https://github.com/miniPinetree/Sparta-Study-Club

## 상세 페이지 (프로젝트 진행 과정)
- https://www.notion.so/d29d9532365a4862a555e63693afb8b7
