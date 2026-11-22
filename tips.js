let showTips = false

let tips = {
    sub: "Press F to enter & exit your submarine.",
    island: "You can build on islands. Press B to enter build mode.",
    building: "Build within the green box. Hold shift to disable snapping. Scroll to change block. Press B to exit build mode when you're done."
}

function drawTips() {
    if (showTips) {
        // Submarine
        if (isTileActive(submarine.tile)) {
            drawTip(tips.sub, submarine.pos.x, submarine.pos.y )
        }

        for (let island of islands) {
            if (isTileActive(island.tile)) {
                if (buildingMode) {
                    drawTip(tips.building, island.pos.x, island.pos.y)
                } else {
                    drawTip(tips.island, island.pos.x, island.pos.y)
                }
                
            }
        }
    }
}

let tipW = 50

function drawTip(tip, x, y) {
    push()
    fill(255)
    stroke(0)
    textWrap(WORD)
    textAlign(CENTER, CENTER)
    text(tip, x, y+islandBob, tipW)
    pop()
}
