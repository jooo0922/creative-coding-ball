'use strict';

// Ball 클래스를 ball.js 모듈에서 import 해줌. default 키워드로 export하지 않았다면 반드시 중괄호{}를 써서 import해줄 것
// 그리고 draw함수를 이용해서 화면에 움직이는 걸 한번 확인해볼거임!
// 그리고 지금 보니까 주요 모듈만 html에 <script type="module">로 연결해주면 나머지 파일들은 주요모듈에 import만 하고
// 따로 html에 연결을 안해줘도 되나 봄.
import {
  Ball
} from './ball.js'

// 이제 Block class도 가져와서 App class 인스턴스의 animate 메소드에서 애니메이션을 그려보자
import {
  Block
} from './block.js'

class App {
  constructor() {
    // js에서 캔버스를 생성함. 이렇게 하면 제어가 편하다고 함. 나중에 관리하기도 편하고
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    document.body.appendChild(this.canvas);

    // 중요한 건 윈도우에 항상 resize 이벤트를 걸어두고 시작함.
    // 리사이즈 될때마다 resize메소드가 호출되면서 해당 스크린 사이즈를 가져온 뒤에 애니메이션을 정의해주는 것. 
    window.addEventListener('resize', this.resize.bind(this), false);
    // 이게 어떻게 된거냐면, window(브라우저)의 크기를 resize할 때 이벤트 리스너를 걸어서
    // this.resize()메소드를 호출시킨거임. 근데 옆에 bind(this)는 뭐냐?
    // 어떤 객체의 메소드를 콜백함수로 전달할 때, 원본객체를 가리키는 this 있잖아? 얘가 손실됨.
    // 그니까 그 메소드 안에서 this를 써야하는 상황이 있는데, 그 this가 가리키는 원본객체가 손실됨.
    // 그래서 이런 상황에서 메소드 안에 사용된 this는 결국 엉뚱하게 전역객체인 window를 가리키게 되어버림.
    // 이를 방지하기 위해서 bind(this)를 달아주면 this가 가리키는 원본객체를 손실하지 않고도 메소드 안에서
    // this를 사용할 수 있게되는 것.
    // 맨 뒤에 false가 들어가는 parameter자리는, 이벤트와 관련된 optional property들(once, capture, passive)를 모두 false로 지정해줌.

    // 인스턴스가 처음 생성된 순간의 스크린 사이즈를 기준으로 resize 메소드 실행.
    this.resize();

    // 일단 이 생성자에서 class Ball의 새로운 인스턴스를 만들어서 this.ball에 넣어주도록 함.
    // 여기서 this.stageWidth는 지금 resize 메소드에서 정의한 field를 가져온거임.
    this.ball = new Ball(this.stageWidth, this.stageHeight, 60, 15);
    // 중요한 건 새로운 ball 인스턴스를 생성한다고 공이 그려지는건 아님. 공이 그려지려면 그 안의 draw()메소드를 호출해줘야지.
    // this.ball.draw(this.ctx, this.stageWidth, this.stageHeight); 이런 식으로. 

    // 위치 및 크기값을 임의로 정해서 새로운 인스턴스를 먼저 생성함.
    this.block = new Block(700, 30, 300, 450);

    // 인스턴스를 생성하자마자 캔버스에 애니메이션을 실행함.
    // 사실 requestAnimationFrame는 window 전역객체에 속한 메소드이기 때문에 window. 을 써주는 게 맞지만, 보통은 생략해도 됨.
    window.requestAnimationFrame(this.animate.bind(this));
  }

  // 사이즈가 변했을 때 실행될 콜백으로 호출할 메소드 정의 
  // 스크린 사이즈를 미리 정해놓고 하면 안됨. 브라우저 크기는 가변적인 것이니까
  // resize이벤트를 통해 변화하는 스크린(=body의 사이즈)의 clientWidth/Height의 값을 가져오고(css에서 body의 사이즈도 100%로 지정해줬으니까!)
  // 그거의 2배로 곱해서 캔버스의 width, height을 정해주는 메소드.
  resize() {
    // 레티나 디스플레이에서 올바른 화면을 보여주기 위해 설정
    // HTMLDomElement.clientWidth/Height은 한마디로 해당 요소의 padding width, height값을 의미한다고 보면 됨.
    // stageWidth는 pixi.js 튜토리얼에서 본 것처럼, 그냥 생성될 인스턴스에 새로 할당해주는 임의의 key 이름이라고 보면 됨.
    // 사실 이걸 생성자에서 새로운 키값을 만드나, 메소드 안에서 만드나 사실상 별반 다를 게 없는거임.
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    // 캔버스의 크기를 스테이지의 2배로 잡음. Why? 레티나 디스플레이 고려!
    this.canvas.width = this.stageWidth * 2;
    this.canvas.height = this.stageHeight * 2;

    // 캔버스의 단위크기를 2배로 늘림. Why? 캔버스의 사이즈를 2배로 잡았으니까
    // 단위크기도 2배로 늘린 것. 이걸 안해주면 캔버스에 뭘 그려도 항상 예상보다 2배는 더 작아보일 거임.
    this.ctx.scale(2, 2);
  }

  // requestAnimationFrame으로 실제 애니메이션을 구동해줄 메소드를 정의함.
  animate(t) {
    // 항상 구동할 애니메이션 함수안에도 requestAnimationFrame 넣어줘야 반복되는거지?
    window.requestAnimationFrame(this.animate.bind(this));

    // 애니메이션으로 만들어주려면 호출될 때마다 이전 프레임을 지워줘야하지?
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    this.block.draw(this.ctx);
    // 이걸 requestAnimationFrame이 걸린 함수에다 수행해야 1초에 60번 그려지며 애니메이션이 만들어지겠지?
    this.ball.draw(this.ctx, this.stageWidth, this.stageHeight, this.block);
    // this.block을 넘겨주는 건 block에서 공이 반사되는 걸 this.ball안의 draw메소드에서 처리해주려고 하는 거
  }
}

// 브라우저에 window가 로드 됐을 때, 인스턴스 생성
// 이거는 pixi.js 튜토리얼에서도 봤지만, window라는 전역객체 안에 포함된, 웹 문서를 불러와 로드하면 실행되는 onload라는 메소드를
// 내가 원하는 메소드로 다시 override(재정의)하여 할당하는 개념이라고 보면 됨.
window.onload = () => {
  new App();
};

// 여기까지가 항상 기본적으로, 공통적으로 작성해줘야 하는 부분들.
// 캔버스를 생성해서 body에 달아주고
// 브라우저에 resize 이벤트를 걸어서 사이즈가 바뀔 때마다 캔버스 크기를 재조정해주는 resize 메소드를 정의하고,
// 재조정 시 레티나 디스플레이를 고려해 size도 2배, 단위크기도 2배로 해주고
// 애니메이션을 구동하는 메소드를 메소드도 미리 만들어주고
// window가 load되면 바로 해당 App 클래스의 인스턴스를 생성해 이 모든 것들이 window.onload 하자마자 실행될 수 있도록 해주는 것 까지!