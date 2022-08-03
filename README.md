# 📝Haehoo

2022 korea aerospace university likelion teamproject

## 🛠️Enviroment

+ python version 3.10.4
+ Django version 4.1
+ django-environ 0.9.0

## 👥Collaborator

+ 이준희
+ 오상준
+ 최재웅
+ 이성진
+ 김예린
+ 김진영

### 초기 설정

1. 아래의 명령어로 프로젝트를 클론해온다.

    ``` console
    git clone https://github.com/lsw725/haehoo.git
    ```

2. .env 파일을 전달 받아서 manage.py 위치에 두기

3. 기존 방식처럼 가상환경을 생성하고 실행 시킨다.

    ``` console
    python -m venv <가상환경 이름>
    ```

4. 아래에 명령어로 필요한 것들을 가상환경에 세팅한다.

    ``` console
    python -m pip install --upgrade pip
    pip install -r requirements.txt
    ```

5. runserver를 실행해본다.

    ``` console
    python manage.py migrate
    python manage.py runserver
    ```
