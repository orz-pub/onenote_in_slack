# OnenoteLinkerLambda

## 개요
> ### 슬래시 명령을 받아서 원노트 링크를 만들고 클릭하면 브라우저로 실행시킨다

## API Gateway 설정
### POST 메서드 생성
 - OnenoteLinkerLambda 를 호출하도록 설정
 - 슬랙이 전달하는 POST 데이터를 JSON으로 변환하여 람다에 전달
  - 통합 요청
    - 본문 매핑 템플릿
      - 매핑 템플릿 추가 (정의된 템플릿이 없는 경우 선택)
      - `application/x-www-form-urlencoded` 입력
      - [코드](/src/apigateway_integration_request.txt) 붙여넣기
        - **`slack apigateway` 등으로 검색하면 찾을 수 있으며 \를 /로 바꾸는 라인을 추가했음**
      - [참고](/img/api_gateway_post_integration_request.jpg)
  - 통합 응답
    - 본문 매핑 템플릿
    - 비어있는 `application/json` 항목에 `#set($inputRoot = $input.path('$'))` 추가
        - 람다에서 리턴하는 것을 슬랙에서 받지 않도록 하기 위함 (*명령은 감추고 링크만 보임*)
    - [참고](/img/api_gateway_post_integration_response.jpg)

### GET 메서드 생성
  - OnenoteLinkerLambda 를 호출하도록 설정
  - `link`파라미터 추가
    - 메서드 요청
      - URL 쿼리 문자열 파라미터
        - 이름에 `link`, 필수에 체크
      - 설정의 요청 검사기 값 `본문, 쿼리 문자열 파라미터 및 헤더 검사` 선택
    - [참고](/img/api_gateway_get_method_request.jpg)

  - GET 요청을 받아 파라미터를 JSON으로 변환하여 람다에 전달
    - 통합 요청
      - 본문 매핑 템플릿
        - 매핑 템플릿 추가 (정의된 템플릿이 없는 경우 선택)
        - `application/json`에 아래 코드 추가
          ```json
          #set($link = $input.params('link'))
          {
              "link":"$link",
              "token":"slash-command's token"
          }
          ```
          - `token`은 슬랙의 슬래시 커맨드 설정 페이지에 있는 토큰 값을 넣는다
    - 통합 응답
      - 헤더 매핑
        - 응답 헤더에 `Content-Type`, 매핑 값에 `'text/html'`
          - 작은 따옴표 포함
      - 본문 매핑 템플릿
        - `Content-Type`에 `text/html`를 넣고 값에는 `$input.path('$')`를 넣는다
      - [참고](/img/api_gateway_get_integration_response.jpg)

## 람다 설정
### 환경 변수
  - `token`키를 생성하고 슬랙 슬래시 커맨드 토큰 값을 넣는다
  - `get_url`키를 생성하고 apigateway의 GET url 뒤에 `?link=`를 붙여 넣는다
  - 예) `https://STRING.execute-api.ap-northeast-2.amazonaws.com/STAGE/PATH/RESOURCE?link=`

## Slack Slash-Command 설정
### 슬래시 명령어(Slash-Command)를 생성
  - URL에 apigateway의 POST 배포 주소를 적는다
  - METHOD는 POST 선택
  - **여기의 Token값을 위에서 사용**
