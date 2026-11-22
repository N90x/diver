let player;
let playerMaxSpeed = 4
let playerMoveSpeed = 0.015

class Player {
    constructor() {
        this.pos = {x: centre.x, y: centre.y}
        this.size = 30

        this.animationSpeed = 15
        this.state = "idle"
        this.direction = 0

        this.movementSpeed = playerMoveSpeed
        this.boostForce = 1
        this.boostAmount = 100
        this.terminalVelocity = playerMaxSpeed

        this.isTeleporting = false
        this.teleportTimer = 0

        this.inSubmarine = false
        this.distFromHome = 0

        this.unlocks = []

        this.body = Matter.Bodies.circle(this.pos.x, this.pos.y, this.size/4)
        Composite.add(engine.world, this.body)

        player = this
    }

    draw() {
        this.pos = this.body.position
        this.pressedKeys = getMovementFromKeys()
        
        this.distFromHome = Math.round(dist(this.pos.x, this.pos.y, submarine.pos.x, submarine.pos.y)/10)
       
        if (isTileActive(submarine.tile)) {
            if (this.distFromHome < 5 && !this.inSubmarine) {
                fill(255)
                text('[ f ]', submarine.pos.x, submarine.pos.y)
            }
        }
        
        if (this.pressedKeys.anyDown) {
            if (this.state != 'rush') {
                this.state = "swimming"
            }
            
        } else {
            this.state = "idle"
        }
        
        if (keyIsDown(65)) {
            this.direction = -1
        }
        if (keyIsDown(68)) {
            this.direction = 0
        }

        if (!this.inSubmarine) {
            drawPlayerFrame(this.state, this.size, playerFrameNum, this.direction)
            if (frameCount % this.animationSpeed == 0) {
                playerFrameNum++
                // Reset frame and end rush animation
                if (playerFrameNum==6){
                    playerFrameNum=0
                    if (this.state == 'rush') {this.state = 'swimming'}
                }
            } 

            if (this.isScanning) {
                if (!keyIsDown(32) {
                    this.isScanning = false
                }
                drawItem('Page', this.facingX(9), this.pos.y+bob(0.05, 1.5)-4, 6)
            }
        }


        this.move()
    }

    facingX(dist) {
        if (this.direction==-1){dist=dist*this.direction}
        return this.pos.x+dist
    }

    move() {

        //find vector from keyspressed
        let vx = Math.max(
            Math.min(
                this.body.velocity.x + (this.pressedKeys.x * this.movementSpeed),
                this.terminalVelocity
            ),
            0-this.terminalVelocity
        )

        let vy = Math.max(
            Math.min(
                this.body.velocity.y + (this.pressedKeys.y * this.movementSpeed),
                this.terminalVelocity
            ),
            0-this.terminalVelocity
        )

        // Move if pressed keys, or recharge boost
        if (this.pressedKeys.anyDown) {
            Matter.Body.setVelocity(this.body, {x: vx, y: vy})
            //console.log(Math.round(this.body.velocity.x), this.terminalVelocity)
        } else {
            if (this.boostAmount <100) {
                this.boostAmount+=0.5
            }
        }
    }

    boost() {
        if (this.boostAmount>=25 && this.pressedKeys.anyDown && !this.inSubmarine) {
            let vx = this.body.velocity.x + (this.pressedKeys.x * this.boostForce)
            let vy = this.body.velocity.y + (this.pressedKeys.y * this.boostForce)
            Matter.Body.setVelocity(this.body, {x: vx, y: vy})
            this.boostAmount -=25
            this.state='rush'
            //playerFrameNum = 0
        }

    }

    setPos(x,y, tile, stopvel) {
        if (tile) {
            curTile = tile
        }
        Matter.Body.setPosition(this.body, {x:x,y:y})
        if (stopvel) {
            Matter.Body.setVelocity(this.body, {x:0,y:0})
        }
        

    }

    globalPos() {
        let y = (curTile.y * height) + this.pos.y
        let x = (curTile.x * width) + this.pos.x
        return{x:Math.round(x),y:Math.round(y)}
    }

    headPos() {
        if (this.state == 'idle') {
            if (this.direction == 0) {
                return {x: this.pos.x+2, y: this.pos.y - this.size/4}
            } else {
                return {x: this.pos.x-1, y: this.pos.y - this.size/4}
            }
            
        } else {
            if (this.direction == 0) {
                return {x: this.pos.x+7, y: this.pos.y-1}
            } else {
                return {x: this.pos.x-7, y: this.pos.y-1}
            }
        }
    }
}


function getMovementFromKeys() {
    let x = 0
    let y = 0
    if (collectionOpen) {
        return {x:x,y:y, anyDown: false}
    }
    // Keys - A:65, D:68, W:87, S:83
    let anyDown = (keyIsDown(68) || keyIsDown(65) || keyIsDown(87) || keyIsDown(83))
    if (keyIsDown(68)) {x++}
    if (keyIsDown(65)) {x--}
    if (keyIsDown(87)) {y--}
    if (keyIsDown(83)) {y++}
    return{x:x,y:y, anyDown: anyDown}
}

function drawPlayerFrame(state, size, frameNum, direction) {
    let x = player.pos.x
    let y = player.pos.y
    //console.log(x,y)
    let sx = frameNum * 80
    let sy = 0
    let sw = 80
    let sh = 80
    if (direction == -1) {

        push();
        translate(x, y);
        //rotate(player.body.angle)
        scale(-1, 1);
        image(imgs[`player/${state}`], 0, 0, size, size, sx, sy, sw, sh)
        pop();

    } else {
        push();
        translate(x, y);
        //rotate(player.body.angle)
        image(imgs[`player/${state}`], 0, 0, size, size, sx, sy, sw, sh)
        pop();
    }
    
}
