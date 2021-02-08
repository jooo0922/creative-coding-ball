'use strict';

// Ball 이라는 class를 만들어서 다른 모듈에서 export할 수 있는 상태로 만들어둘 것.
// Ball은 움직이는 노란색 공을 만드는 클래스겠지?
export class Ball {
  constructor(stageWidth, stageHeight, radius, speed) {
    // 반지름값과 속도값을 가져와서 할당해줌.
    // vx, vy 는 x, y 좌표값을 움직이는 속도라고 정해줄 것.
    this.radius = radius;
    this.vx = speed;
    this.vy = speed;

    // 공의 지름을 정의해 줌.
    const diameter = this.radius * 2;
    // 맨 처음, 초기의 공의 x, y좌표값을 stage에 랜덤으로 위치할 수 있게 정의함.
    // this.radius값이 x, y좌표의 최솟값이 되어야 하니까 맨 처음에 더해준거고
    // 최대 좌표값은 this.radius + (stageWidth(Height) - diameter)를 더한 값으로 구할 수 있음.
    // 왜냐면 최대 좌표값은 결국 stageWidth(Height) - this.radius니까. 
    // 이 최솟값과 최댓값들 사이의 값을 랜덤하게 받아야 하니까 Math.random 돌려서 받은 난수를 곱해주는거고 
    this.x = this.radius + (Math.random() * (stageWidth - diameter));
    this.y = this.radius + (Math.random() * (stageHeight - diameter));
  }

  // 공의 위치를 speed값을 더해서 계속 바꿔그려주는 메소드 
  draw(ctx, stageWidth, stageHeight, block) { // 주요모듈에서 this.block을 block 자리에 전달해줄거임.
    // 공의 랜덤 좌표에 속도값을 더해줌. 
    // 이 메소드를 실행할 때마다 공의 위치값이 바뀌게 되겠지> 
    this.x += this.vx;
    this.y += this.vy;
    // 이렇게 하면 캔버스의 ctx에 그림을 그릴 수 있는 함수가 완성됨.

    this.bounceWindow(stageWidth, stageHeight);
    // 이거를 draw메소드에서 바로 호출해줘서 x, y좌표값이 이 메소드 안의 조건문을 통과할 경우 vx, vy의 부호를 바꿔서 더해주도록

    // 이 메소드에서는 Ball의 위치를 파악해서 반사값을 정의해줄거임.
    this.bounceBlock(block);

    // 여기서는 공을 그려주는거
    ctx.fillStyle = '#fdd700'
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  // 스테이지의 사방면 각 끝부문에 닿았는지 판단하는 메소드 
  bounceWindow(stageWidth, stageHeight) {
    // 그치 공이 사방면 끝부분에 닿았을 때의 좌표는 공의 반지름 만큼을 더해준 x좌표값이어야 겠지.
    // 캔버스에서 원(arc)의 position 좌표값은 항상 원의 중심을 기준으로 잡히니까 
    const minX = this.radius;
    const maxX = stageWidth - this.radius;
    const minY = this.radius;
    const maxY = stageHeight - this.radius;

    // 닿았다면 공이 반대로 방향으로 튕기게 해주는 if block. 이 컨셉에 대한 설명은 영상 초반부 참고.
    if (this.x <= minX || this.x >= maxX) {
      // 닿았다면, vx 즉, 더해주는 speed값의 부호를 바꿔주라는 뜻. 음수면 양수로, 양수면 음수로
      this.vx *= -1;
      this.x += this.vx; // 그러고 나서 그 vx를 draw메소드에서 했던 것처럼 x좌표값에 더해서 할당해주고
    } else if (this.y <= minY || this.y >= maxY) {
      // y좌표값도 마찬가지 원리
      this.vy *= -1;
      this.y += this.vy;
    }
  }

  // bounceWindow()랑 비슷한 원리로 만들어주면 됨.
  bounceBlock(block) {
    // bounceWindow()랑 똑같음. Ball의 반지름 값을 block의 사방면 끝 좌표에서 빼거나 더해준 값 만큼에 Ball이 위치했을 때의 좌표들을 구한 것.
    // 다시 말하면, block의 끝에 Ball의 끝이 닿았을 때를 의미하는거지. 왜 반지름을 빼거나 더하냐? 원의 x, y좌표값은 원의 중심을 기준으로 잡히니까!
    const minX = block.x - this.radius;
    const maxX = block.maxX + this.radius;
    const minY = block.y - this.radius;
    const maxY = block.maxY + this.radius;

    // 조건문은 결국 Ball의 위치가 block안쪽 영역으로 침투하려는 경우를 의미함.
    if (this.x > minX && this.x < maxX && this.y > minY && this.y < maxY) {
      // 공이 block에 충돌할 때 block의 오른쪽/왼쪽/위/아래 중 어디에서 충돌하는지 판단하기 위해서는
      // ball의 좌표와 block의 좌표를 비교해서 어느 값이 가장 근접한 지를 찾으면 위치를 알 수 있음.
      // Math.abs() 함수는 주어진 숫자의 절대값을 반환합니다. (absolute의 약자. 즉, 부호를 없앤다는 거.)
      // Math.min() 함수는 주어진 숫자들 중 가장 작은 값을 반환합니다.
      const x1 = Math.abs(minX - this.x); // 왼쪽에서 충돌하는 경우겠지?
      const x2 = Math.abs(this.x - maxX); // 오른쪽이겠지?
      const y1 = Math.abs(minY - this.y); // 위쪽이겠지?
      const y2 = Math.abs(this.y - maxY); // 아래쪽이겠지?
      const min1 = Math.min(x1, x2); // 왼/오 두 값들 중에 절대값이 더 작은 쪽이 근접한 곳이겠지?
      const min2 = Math.min(y1, y2); // 얘는 위/아래 중 근접한 곳 비교
      const min = Math.min(min1, min2); // 얘는 최종적으로 양옆 중 한곳 vs 위아래 중 한곳 중 절대값이 가장 작은 곳을 보고 가장 근접한 곳을 알려주겠지
      // 결국 오/왼/ vs 위/아래 중 가장 가까운 곳과 Ball의 거리차의 절대값이 min에 할당되겠지?

      if (min == min1) {
        // 어쨋든 min == min1 이면 왼쪽이나 오른쪽중 한곳에 근접해서 충돌하려는 상황이라는 거잖아?
        // 그럼 왼쪽이 됬건 오른쪽이 됬건 x좌표를 움직여주는 속도값, 즉 vx를 부호를 바꿔서 반대방향으로 움직여주면 되지? 
        this.vx *= -1;
        this.x += this.vx;
      } else if (min == min2) {
        // 마찬가지로 어쨋든 min == min2 이면 아래나 위쪽중 한곳에 근접해서 충돌하려는 상황이라는 거잖아?
        // 그럼 아래가 됬건 위쪽이 됬건 y좌표를 움직여주는 속도값, 즉 vy를 부호를 바꿔서 반대방향으로 움직여주면 되지?
        this.vy *= -1;
        this.y += this.vy;
      }
    }
  }
}