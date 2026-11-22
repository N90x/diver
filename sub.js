let homeSize = 100
let submarine;

class Submarine {
    constructor() {
        this.tile = { x: homeTile.x, y: homeTile.y }
        this.pos = { x: centre.x, y: centre.y }
        submarine = this
        this.direction = 0
    }

    draw() {

        if (player.inSubmarine) {
            this.pos = { x: player.pos.x, y: player.pos.y }
            this.tile = { x: curTile.x, y: curTile.y }
            this.direction = player.direction
        }

        if (isTileActive(this.tile)) {
            if (this.direction == 0) {

                push();

                translate(this.pos.x, this.pos.y + bob(0.01, 8))
                scale(-1, 1);
                image(imgs['submarine'], 0, 0, homeSize, homeSize)
                pop();

            } else {
                push()
                translate(this.pos.x, this.pos.y + bob(0.01, 8))
                image(imgs['submarine'], 0, 0, homeSize, homeSize)
                pop()
            }



            //console.log(player.terminalVelocity)
        }
    }

    enter() {
        Matter.Body.setDensity(player.body, 10)
        player.terminalVelocity = playerMaxSpeed * 5
        player.movementSpeed = playerMoveSpeed * 3
        //player.body.frictionAir = 0.03
        Matter.Body.setVelocity(player.body, { x: 0, y: 0 })
        console.log('entering sub')
    }

    exit() {
        Matter.Body.setDensity(player.body, 0.01)
        player.terminalVelocity = playerMaxSpeed
        player.movementSpeed = playerMoveSpeed
        player.body.frictionAir = 0.01
        console.log('exiting sub')

    }
}