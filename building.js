let _buildingTiles = [
    { name: 'top1', sx: 16, sy: 16, sw: 80, sh: 63 },
    { name: 'top2', sx: 112, sy: 16, sw: 80, sh: 63 },
    { name: 'bottomWide', sx: 16, sy: 108, sw: 176, sh: 68 },
    { name: 'bottom1', sx: 208, sy: 117, sw: 80, sh: 56 },
    { name: 'bottom2', sx: 320, sy: 117, sw: 80, sh: 59 },
    { name: 'bottomR', sx: 16, sy: 188, sw: 112, sh: 116 },
    { name: 'bottomL', sx: 144, sy: 188, sw: 112, sh: 116 },
    { name: 'topR', sx: 16, sy: 320, sw: 112, sh: 116 },
    { name: 'topL', sx: 144, sy: 320, sw: 112, sh: 116 },
    { name: 'pillarL', sx: 209, sy: 16, sw: 47, sh: 80 },
    { name: 'pillarR', sx: 272, sy: 16, sw: 47, sh: 80 },
    { name: 'holeL', sx: 323, sy: 16, sw: 61, sh: 80 },
    { name: 'holeR', sx: 400, sy: 16, sw: 61, sh: 80 },
    { name: 'rockBR', sx: 272, sy: 208, sw: 64, sh: 64 },
    { name: 'rockBL', sx: 352, sy: 208, sw: 64, sh: 64 },
    { name: 'rockTR', sx: 272, sy: 288, sw: 64, sh: 64 },
    { name: 'rockTL', sx: 352, sy: 288, sw: 64, sh: 64 }

]

let buildingTiles = []

function loadTiles() {
    selectedTileName = _buildingTiles[buildBrush].name
    for (let tile of _buildingTiles) {
        buildingTiles[tile.name] = tile
    }
    //buildingMode = true
}


function drawTile(tileName, x, y, scll) {
    let tile = buildingTiles[tileName]
    image(imgs['environment/tiles'], x, y, tile.sw * scll, tile.sh * scll, tile.sx, tile.sy, tile.sw, tile.sh)
}

let buildingMode = false
let buildBrush = 0
let selectedTileName;

function scrollBuildBrush(deltaY) {
    buildBrush -= deltaY
    if (buildBrush < 0) { buildBrush = _buildingTiles.length - 1 }
    if (buildBrush >= _buildingTiles.length) { buildBrush = 0 }
    selectedTileName = _buildingTiles[buildBrush].name

}

let buildPlacePos;
let builds = []
let buildRange = islandSize*2

let snapThresh = 3

function drawBuildMode() {

    if (buildingMode) {

        let mousePos = getScreenPos(mouseX, mouseY)
        let x = mousePos.x
        let y = mousePos.y

        // Shift disables snapping
        if (!keyIsDown(16)) {

            for (let build of builds) {
                if (Math.abs(build.pos.x - mousePos.x) < snapThresh) {
                    x = build.pos.x
                }
                if (Math.abs(build.pos.y - mousePos.y) < snapThresh) {
                    y = build.pos.y
                }
            }
        }


        for (let island of islands) {
            if (isTileActive(island.tile)) {
                // Snapping
                if (!keyIsDown(16)) {
                    if (Math.abs(island.pos.x - mousePos.x) < snapThresh) {
                        x = island.pos.x
                    }
                    if (Math.abs(island.pos.y - mousePos.y) < snapThresh) {
                        y = island.pos.y
                    }
                }
                // Bounding box
                
                stroke('#186c2c')
                noFill()
                rect(island.pos.x, island.pos.y, buildRange, buildRange)
            }

        }

        buildPlacePos = { x: x, y: y }
        drawTile(selectedTileName, buildPlacePos.x, buildPlacePos.y + islandBob, 0.25)
    }

    for (let build of builds) {
        drawTile(build.tileName, build.pos.x, build.pos.y + islandBob, 0.25)
    }

}

function isNearIsland() {
    for (let island of islands) {
        if (isTileActive(island.tile)) {
            if (isInBounds(buildPlacePos.x, buildPlacePos.y, island.pos.x-buildRange/2, island.pos.y-buildRange/2, buildRange, buildRange)) {
                return true
            }
        }
    }
    return false
}

function mousePressed(e) {
    if (buildingMode) {
        let leftClick = e.button == 0
        let rightClick = e.button == 2

        if (leftClick) {
            if (isNearIsland()) {
                builds.push({ tileName: selectedTileName, pos: buildPlacePos })
            
            }
        } else if (rightClick && builds.length>0) {
            builds.splice(builds.length-1, 1)
        }
    }


}
