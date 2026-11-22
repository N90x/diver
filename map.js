let curTile = { x: 0, y: 0 }
let homeTile = { x: 0, y: 0 }
let cachedTiles = []

function updateMap() {
    if (player.pos.x > width) {
        player.setPos(0, player.pos.y)
        curTile.x++
    }
    if (player.pos.x < 0) {
        player.setPos(width, player.pos.y)
        curTile.x--
    }
    if (player.pos.y > height) {
        player.setPos(player.pos.x, 0)
        curTile.y++
    }
    if (player.pos.y < 0) {
        player.setPos(player.pos.x, height)
        curTile.y--
    }

    // if tile is undiscovered
    if (typeof cachedTiles[`${curTile.x}/${curTile.y}`] == 'undefined') {
        loadNewTile()
    }
}

function isTileActive(tile) {
    return (tile.x == curTile.x && tile.y == curTile.y)
}

function getGlobalPos(tile, pos) {
    return { x: (width * tile.x) + pos.x, x: (height * tile.y) + pos.y }
}

let cachedPickups = []

function loadNewTile() {

    //console.log(`Entered new tile ${curTile.x}/${curTile.y}`)
    let isStartTile = curTile.x == 0 && curTile.y == 0

    cachedTiles[`${curTile.x}/${curTile.y}`] = {
        portals: []
    }

    // 15% chance of making a portal
    if (getRandomInt(100) < 15) {
        cachedTiles[`${curTile.x}/${curTile.y}`].portals.push(new Portal({ x: curTile.x, y: curTile.y }))
        //console.log('portal here')
    }

    // 10% chance of making green book
    if (!player.unlocks.includes('Portals') && !isStartTile) {
        if (getRandomInt(100) < 10 && !cachedPickups.includes('Book0')) {
            let p = getRandomPosition()
            new Pickup('Book0', p.x, p.y, curTile.x, curTile.y)
            cachedPickups.push('Book0')
            //console.log('Green Book here')
        }
    }

    // 20% chance of making an island
    if (getRandomInt(100) < 20 && !isStartTile) {
        let p = getRandomPosition(islandSize*3)
        new Island(p.x, p.y, curTile.x, curTile.y)
    }

}