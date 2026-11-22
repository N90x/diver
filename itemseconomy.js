let playerMoney = 100

let items = []

function createItem(name, i, j) {
    items[name] = { i: i, j: j, name: name }
}

function loadItems() {
    createItem('Topaz', 0, 3)
    createItem('Sapphire', 1, 3)
    createItem('Emerald', 2, 3)
    createItem('Ruby', 3, 3)
    createItem('Amethyst', 4, 3)
    createItem('Opal', 5, 3)

    createItem('Key', 11, 3)

    for (let i = 0; i<6; i++) {
        createItem(`Book${i}`, 7+i, 12)
    }

    createItem('Page', 12, 10)
    
}

function drawItem(item, x, y, size) {
    let i = items[item].i
    let j = items[item].j
    let sx = i * 16
    let sy = j * 16
    let sw = 16
    let sh = 16
    image(imgs['items'], x, y, size, size, sx, sy, sw, sh)
}

let playerInventory = []

function pickUpItem(itemObject) {
    let item = itemObject.item
    itemObject.onCollect()
    let hasItem = false
    for (let slot of playerInventory) {
        if (slot.item == item) {
            slot.count++
            hasItem = true
        }
    }

    if (!hasItem) {
        playerInventory.push({ item: item, count: 1 })
    }

    //console.log(playerInventory)

}

let pickups = []
class Pickup {
    constructor(item, x, y, tileX, tileY, onCollect) {
        this.item = item
        this.pos = {x:x,y:y}
        this.tile = {x:tileX, y: tileY}

        this.size = 10

        this.onCollect = onCollect || function() {console.log(`Picked up ${item}`)}

        pickups.push(this)
    }

    draw() {
        if (isTileActive(this.tile)) {
            drawItem(this.item, this.pos.x, this.pos.y+bob(0.03, 3), this.size)
            let d = dist(player.pos.x, player.pos.y, this.pos.x, this.pos.y)
            //console.log(d)
            if (d < this.size) {
                pickUpItem(this)
                pickups.splice(pickups.indexOf(this), 1)
            }
        }

    }
}