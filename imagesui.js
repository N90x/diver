let bgSize = {
    w: 960, h: 512
}

let animationSpeed = 15

let imageFiles = [
    'environment/background',
    'environment/midground',
    'environment/island',
    'environment/tiles',
    'player/swimming',
    'player/idle',
    'player/rush',
    'enemies/fish',
    'enemies/fishbigscale',
    'enemies/fishdartscale',
    'submarine',
    'items',
    'FX/bubbles'
]
let imgs = []

let starImg;

let backgroundTiles = []
let bgImgSize = 350


async function loadImages() {
    for (let name of imageFiles) {
        imgs[name] = await loadImage(`underwater/${name}.png`)
    }

    starImg = await loadImage('star.png')

    for (let i = 0; i < 5; i++) {
        backgroundTiles.push({
            x: getRandomInt(width),
            y: getRandomInt(height),
            w: (bgImgSize / 2) + getRandomInt(bgImgSize),
            h: (bgImgSize / 2) + getRandomInt(bgImgSize)
        })
    }
}


function drawBG() {
    for (let pos of backgroundTiles) {
        image(imgs['environment/background'], pos.x, pos.y, pos.w, pos.h)
    }
}

function drawFG() {
    image(imgs['environment/midground'], centre.x, centre.y, width, height)
}

// UI

function drawFilledBar(_x, _y, _w, _h, max, val, colour) {
    push()
    let pos = getScreenPos(_x, _y)
    let w = _w / _scl
    let h = _h / _scl
    rectMode(CORNER)
    let fraction = val / max
    let fillW = w * fraction
    fill(colour)
    rect(pos.x, pos.y, fillW, h)
    noFill()
    stroke(0)
    strokeWeight(1 / _scl)
    rect(pos.x, pos.y, w, h)
    pop()
}


function drawHUD() {
    drawFilledBar(10, 10, 100, 7, 100, player.boostAmount, 255)
    push()
    let coordsPos = getScreenPos(width / 2, 10)
    let globalPos = player.globalPos()
    fill(255)
    textSize(12 / _scl)
    textAlign(CENTER, TOP)
    text(`${curTile.x} / ${curTile.y}\n${globalPos.x} / ${globalPos.y}\n${player.distFromHome}m from home.`, coordsPos.x, coordsPos.y)

    if (showTips) {
        let topRight = getScreenPos(width - 10, 10)
        textAlign(RIGHT, TOP)
        text(`Press T to toggle tips.`, topRight.x, topRight.y)
    }


    pop()
}


let currentMode = 'menu'

function drawMenu() {
    push()
    scale(1, 1)
    fill('#20758c')
    stroke(255)
    strokeWeight(3)

    rect(centre.x, centre.y, 700, 500)

    textAlign(CENTER, CENTER)
    fill(255)
    noStroke()
    textSize(26)
    textWrap(WORD)
    text('Swim around, or use your submarine, and look for fish.\n\nPress space to boost while swimming, and hold to log fish.\n\nFind the green book to unlock portals back to your sub.\n\nPress T to toggle tips.\nPress Space to Begin.', centre.x, centre.y, 500)
    pop()
}

let bubbles = []
function produceBubble(x, y) {
    bubbles.push({
        x: x, y: y, frameNum: 0, frames: 0
    })
}

let bubbleScale = 0.3

function drawBubbles() {
    let sy = 0
    let sw = 23
    let sh = 40
    let w = sw * bubbleScale
    let h = sh * bubbleScale

    for (let bubble of bubbles) {
        let sx = sw * bubble.frameNum
        image(imgs['FX/bubbles'], bubble.x, bubble.y, w, h, sx, sy, sw, sh)
        bubble.frames++
        bubble.y -= bubbleScale
        if (bubble.frames % animationSpeed == 0) {
            bubble.frameNum++
            if (bubble.frameNum > 3) {
                bubbles.splice(bubbles.indexOf(bubble), 1)
                //console.log('bubble ended', bubbles)
            }
        }
    }
}