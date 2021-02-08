'use strict';

// stage 상에 띄워놓을 벽돌을 만드는 class
export class Block {
  constructor(width, height, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;

    // 공을 추적하기 위한 maximum 좌표값도 정의해 줌.
    this.maxX = width + x;
    this.maxY = height + y;
  }

  // 실제로 block을 그려주는 메소드
  draw(ctx) {
    const xGap = 80;
    const yGap = 60;

    ctx.fillStyle = '#ff384e';
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();
    // 사각형의 create과 render 단계를 분할한 것. 한번에 만들려면 ctx.fillRect(); 메소드로 해도 됨.

    // 디자인을 좀 재밌게 하려고 그림자를 그려주는거
    ctx.fillStyle = '#190f3a';
    ctx.beginPath();
    ctx.moveTo(this.maxX, this.maxY);
    ctx.lineTo(this.maxX - xGap, this.maxY + yGap);
    ctx.lineTo(this.x - xGap, this.maxY + yGap);
    ctx.lineTo(this.x, this.maxY);
    ctx.fill();
    // 이런식으로 line path를 이용해서 그림 그려주면 되는거임. moveTo()로 시작 좌표를 정하고,
    // lineTo()로 좌표를 이동시키면서 계속 직선 path를 이어나가는거. 다 하고 나면 fill() 또는 stroke()로 캔버스에 렌더해주면 됨.
    // 결국 그림을 그리는 것도 좌표를 이동시켜주는 거. 모든 게 다 좌표임.

    // 옆부분 그림자도 마저 완성해주자
    // 사실 모든 게 좌표값에 따라 움직이기 때문에 좌표값만 잘 알고 있으면 그리기 쉬운 게 캔버스입니다.
    ctx.fillStyle = '#9d0919';
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x, this.maxY);
    ctx.lineTo(this.x - xGap, this.maxY + yGap);
    ctx.lineTo(this.x - xGap, this.maxY + yGap - this.height);
    // 처음 시작한 moveTo의 좌표까지 가서 이어줄 필요는 없음. Why? fill() 은 면을 채워주는 메소드니까
    // 처음 시작한 좌표와 마지막에 끝나는 좌표를 닫아주지 않아도 됨.
    ctx.fill();
  }
}