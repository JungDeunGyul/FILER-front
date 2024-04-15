# FILER :

<p align="center">
  <img width="300" alt="logo" src="public/FilerLoGo.png">
</p>

<p align="center">
  팀 협업을 위한 파일 공유 및 관리 플랫폼으로 파일에 대한 버전 관리를 제공해줍니다.
</p>

<p align="center">
  <a href="https://filerhub.net">FILER Website</a>
  <span> | </span>
  <a href="https://github.com/JungDeunGyul/FILER-front">Frontend Repository</a>
  <span> | </span>
  <a href="https://github.com/JungDeunGyul/FILER-back">Backend Repository</a>
</p>

<br>

# 📖 CONTENTS

- [🔍 Preview](#-preview)
- [📚 Tech Stacks](#-tech-stacks)
- [💪 Motivation](#-motivation)
- [🕹️ Features](#-features)
- [💡 Why Use React?](#-Why-Use-React)

  - [1. 컴포넌트 기반 아키텍처](#1-컴포넌트-기반-아키텍처)
  - [2. 가상 DOM과 성능](#2-가상-dom과-성능)

- [🗓 Schedule](#-schedule)
- [📒 프로젝트 소감](#-프로젝트-소감)

<br>

# **🔍 Preview**

<p align="center">
  <img width="300" alt="logo" src="public/ReadMeGif1.gif">
</p>

<p align="center">
  사용자가 쉽게 파일을 업로드 할 수 있습니다.
</p>

<p align="center">
  <img width="300" alt="logo" src="public/ReadMeGif2.gif">
</p>

<p align="center">
  사용자가 해당 파일 클릭시 전 버전과 비교가 가능합니다.
</p>

<br>

# **📚 Tech Stacks**

### **Client**

![](https://img.shields.io/badge/javascript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black)
![](https://img.shields.io/badge/zustand-%2320232a.svg?style=flat-square&logo=react&logoColor=white)
![](https://img.shields.io/badge/tailwindCSS-06B6D4?style=flat-square&logo=tailwindCSS&logoColor=white)
![](https://img.shields.io/badge/Axios-000000?style=flat-square&logo=axios&logoColor=white)

### **Server**

![](https://img.shields.io/badge/javascript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![](https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=Node.js&logoColor=white)
![](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=MongoDB&logoColor=white)
![](https://img.shields.io/badge/multer-%23006567.svg?style=flat-square&logo=multer&logoColor=white)
![](https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=amazonaws&logoColor=white)

### **Test**

![](https://img.shields.io/badge/Jest-C21325?style=flat-square&logo=jest&logoColor=white)

<br>

# **💪 Motivation**

일상적인 작업을 진행하고, 파일을 보관할 때 파일이 쌓이면 쌓일 수록 관리하는 데에 있어 불편함이 생기기 때문에 파일에 대한 버전관리가 필요하다고 생각하였습니다.

FILER는 팀 협업을 위한 효율적인 파일 관리 솔루션을 제공하여 작업을 보다 효율적으로 수행할 수 있도록 지원하였습니다.

<br>

# **🕹️ Features**

FILER : 서비스의 주요 기능입니다.

큰 맥락으로는 팀원과 함께 폴더 혹은 파일에 파일을 업로드하여 업로드 한 내역을 볼 수 있고, 권한을 부여하여 특정 인원만 볼 수 있게 구현 하였습니다.

### 1) 파일 자세히 보기

  <img width="300" alt="logo" src="public/Feature1.png">

- 사용자는 기존에 업로드 되어있는 파일에 업로드할 수 있고, 전 파일들을 클릭시 최신 버전과 비교하여 볼 수 있습니다.

### 2) 파일 및 폴더 권한 설정

  <img width="250" alt="logo" src="public/Feature2.png">
  <img width="250" alt="logo" src="public/Feature3.png">

- 팀장은 기존에 업로드 되어있는 파일 및 폴더들을 클릭시 최신 접근권한을 부여 할 수 있습니다.

### 3) Drag & Drop 적용

  <img width="300" alt="logo" src="public/ReadMeGif3.gif">

- 사용자가 이용하기 쉽게 drag and drop을 적용하였습니다.

<br>

# **💡 Why Use React?**

### 1) 컴포넌트 기반 아키텍처

- 재사용 가능한 UI 컴포넌트:
  React의 컴포넌트 기반 아키텍처는 UI를 작은 단위의 독립적인 컴포넌트로 분할하여 개발할 수 있는 것이 장점이라고 생각하였습니다. 이번 프로젝트에서 파일 및 폴더 관리를 위한 다양한 UI 요소들을 개별적으로 구성하여 재사용하였습니다. 예를 들어, 파일 업로드 버튼, 폴더 목록, 파일 비교 뷰 등의 UI 요소들은 각각의 컴포넌트로 구성되어 하였고, 이를 조합하여 복잡한 사용자 인터페이스를 쉽게 사용하였습니다.

- 복잡한 UI 관리의 용이성:
  React의 컴포넌트 기반 아키텍처는 복잡한 사용자 인터페이스를 쉽게 관리할 수 있는 장점이라고 생각하였습니다. 각 컴포넌트는 자체적으로 상태와 라이프사이클 메서드를 가지고 있기 때문에, 이를 활용하여 각 UI 요소의 동작을 세밀하게 제어할 수 있었습니다. 또한, 컴포넌트 간의 의존성을 최소화하여 코드의 유지보수성을 향상시키려고 하였습니다.

### 2) 가상 DOM과 성능

- 최소화된 실제 DOM 변경:
  React의 가상 DOM은 메모리에 존재하는 가상의 DOM 트리로, 실제 DOM과 동기화되어 변경된 부분만을 감지하여 업데이트합니다. 그렇기 때문에 가상 DOM을 활용하여 실제 DOM의 변경 사항을 최소화 하여, 사용자가 파일을 업로드하거나 버전을 비교하는 등의 작업을 할 때 발생하는 DOM 조작을 최적화하여 성능을 향상시킬수 있다고 생각하였습니다.

- 빠른 응답성 제공:
  가상 DOM을 사용하는 React는 변경된 부분만을 업데이트하여 실제 DOM 조작을 최소화함으로써 빠른 응답성을 제공합니다. 따라서 사용자가 파일을 업로드하거나 버전을 비교하는 등의 작업을 할 때 화면이 빠르게 업데이트되어 사용자 경험을 향상 시킬 수 있다고 생각하였습니다.

이렇게 React의 컴포넌트 기반 아키텍처와 가상 DOM을 통해 프로젝트의 UI 관리와 성능 최적화 하였습니다.

<br>

# **📆 Schedule**

## 프로젝트 기간: 2024.03.04(월) ~ 2024.03.28(수)

**2024.03.04 - 2024.03.10**

- 프레젝트 아이디어 선정
- POC 진행
- KANBAN 작성
- 기술스택 선정
- 보일러 플레이트 생성
- 로그인, Team 생성 구현

**2024.03.11 - 2024.03.17**

- 유저 팀 가입 요청 구현
- 팀 생성, 신청 구현
- 팀 클릭시 화면 구현
- 팀 탈퇴 및 삭제 구현
- 팀 내에서 폴더 및 파일 생성 구현
- 폴더 DropZone 구현

**2024.03.18 - 2024.03.24**

- 최신 파일, 전 버전 비교 구현
- 휴지통 폴더, 파일 삭제 구현
- 팀장 위임 및 등급 관리 구현
- 폴더, 파일 수정 및 업데이트 구현

**2024.03.25 - 2024.03.28**

- 프로젝트 배포

<br>

# **📒 프로젝트 소감**

팀 프로젝트 이후 개인 프로젝트로 파일 버전 관리라는 아이디어를 내고 이를 프로젝트로 시작하였을 때 부트캠프를 시작하면서 배워왔던 그리고 팀 프로젝트에서 다시 한번 복습하였던 프런트 그리고 백엔드를 활용할 생각에 설렘 반 기대 반이었습니다.

개인 프로젝트를 진행하면서 내가 아는 개념이라고 생각했는데 몰랐던 것과 헷갈리고 있던 개념들을 다시 다듬을 수 있던 시간이었고, 문제점이 발생했을 때 당황하지 않고 문제점을 찾아내, 그 문제를 고민하는 과정을 겪으면서 성장하는 기분을 느끼게 되었습니다.

아직 리팩토링이나 파일 타입 추가, 댓글 기능 추가 등의 추가적으로 보완할 점들이 많지만, 스스로 기능 구현을 하고 문제를 해결할 수 있다는 자신감을 얻게 된 프로젝트였습니다.
