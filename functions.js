function mouseInBounds(x,y,w,h) {
  let inX = (mouseX>x) && (mouseX<x+w)
  let inY = (mouseY>y) && (mouseY<y+h)
  return (inX && inY)
}
function mouseInBoundsCentre(_x,_y,w,h) {
  let x = _x-w/2
  let y = _y-h/2
  let inX = (mouseX>x) && (mouseX<x+w)
  let inY = (mouseY>y) && (mouseY<y+h)
  return (inX && inY)
}
function mouseInBoundsCircle(x1,y1,r) {
    let x2 = mouseX; let y2 = mouseY;
    let dist = Math.hypot(x2 - x1, y2 - y1);
    return dist<r
}

function isInBounds(x,y, tx, ty, w, h) {
  let inX = (x>tx) && (x<tx+w)
  let inY = (y>ty) && (y<ty+h)
  return (inX && inY)
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomPosition(_margin) {
  let margin = _margin || 0

  return {x: getRandomInt(width-margin)+margin/2, y: getRandomInt(height-margin)+margin/2}
}

function getRandomColour() {
  return color(getRandomInt(255), getRandomInt(255), getRandomInt(255))
}

function new2DArray(rows, columns) {
  let arr = [];
  let value = 1;

  for (let i = 0; i < rows; i++) {
    arr[i] = [];
    for (let j = 0; j < columns; j++) {
      arr[i][j] = value++;
    }
  }

  return arr
  
}

function getScreenPos(x,y) { 
  if (_scl==1) {return{x:x,y:y}}
  return {
    x: 0 - screenTranslation.x + x/_scl,//player.pos.x - newW/2 + x/_scl,
    y: 0 - screenTranslation.y + y/_scl//player.pos.y - newH/2 + y/_scl
  }
}

function bob(rate, amp, phase) {
  let p = phase || 0
  return sin((frameCount+p)*rate)*amp
}