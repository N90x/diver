let portalSize = 15
let portalColour = '#1dc60ea4'

let allPortals = []

class Portal {
    constructor(tile) {
        this.pos = getRandomPosition()
        this.tile = tile

        allPortals.push(this)
    }

    draw() {
        if (isTileActive(this.tile)) {
            fill(portalColour)
            circle(this.pos.x, this.pos.y, portalSize)

            let d = dist(player.pos.x, player.pos.y, this.pos.x, this.pos.y)
            if (d<portalSize/2 && !player.inSubmarine && player.unlocks.includes('Portals')) {
                player.setPos(submarine.pos.x, submarine.pos.y, submarine.tile, true)
                player.isTeleporting = true
                //player.inSubmarine = true

            }
        }

    }
}

let islands = []
let islandSize = 150
let islandBob;

class Island {
    constructor(x, y, tileX, tileY) {
        this.pos = {x:x, y:y}
        this.tile = {x:tileX, y: tileY}

        islands.push(this)
    }

    draw() {
        this.yLevel = this.pos.y + islandBob
        if (isTileActive(this.tile)) {
            image(imgs['environment/island'], this.pos.x, this.yLevel+islandSize*0.8, islandSize, islandSize)
        } 
    }
}