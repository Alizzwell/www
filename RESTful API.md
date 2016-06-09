RESTful API

DB 종류
- 알고리즘
	- 카테고리(sorting)
	- 주제명(quick_sort)
	- 인풋
	- 코드
	- 시각화 메타 정보
- problem
	- 번호
	- 난이도
	- 카테고리(복수개)
	- 인풋
	- 코드
- my code
	- ...

/api/algorithms
- 알고리즘 DB에서 카테고리, 주제명 가져오기
- 왼쪽 바에 표시할 정보들

/api/:category/:subject
- 카테고리, 주제명에 맞는 여러 정보 가져오기
- 해당 알고리즘에 대한 비쥬얼을 보이기 위한 정보들

/api/problems
- problem에 대한 번호와 난이도 가져오기
- 개수가 많으므로 lazy loading

/api/:number/:difficulty
- 해당 번호와 난이도의 문제 정보 가져오기
