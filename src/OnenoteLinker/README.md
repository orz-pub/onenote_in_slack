## 설명
- 슬랙에서 링크 클릭시 자동으로 원노트 페이지를 열어주는 프로그램
## 작동 원리
- 크롬은 `onenote:` 프로코톨에서 한글 및 특수문자가 있을때 %인코딩된 문자를 전달하기 때문에 중간에 onenotelinker를 실행해서 디코딩된 url을 전달하도록 도와준다.
## 설정 방법
- `AddOnenoteLinker.reg` 파일을 실행해서 레지스트리에 `onenotelinker:` 프로토콜이 작동하도록 레지스트리에 등록 한다.
	- `[HKEY_CLASSES_ROOT\onenotelinker\Shell\Open\Command]` 의 값을 변경해서 내 컴퓨터의 `OnenoteLinker.exe` 경로를 바꿔준다.
- `test.html` 코드를 참고해서 크롬 브라우저의 경우 `onenote:` 로 실행되던 링크를 `onenotelinker:` 로 실행되게 한다.  
```
if (navigator.userAgent.toLowerCase().indexOf("chrome") != -1) {
  newPath = path.replace("onenote:///", "onenotelinker:///");
}
```
