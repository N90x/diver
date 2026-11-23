let cnv;
let centre;
let margin = 20

let colours = {
  bg: '#244b7e'
}

let screenScale;

function preload() {
  loadSpecies()
}

function setup() {
  noCursor()
  tintColour = color(tintColour)

  updateCollection()
  loadItems()
  loadTiles()

  let _ww = windowWidth - margin
  let _wh = windowHeight - margin
  screenScale = Math.min(_ww / bgSize.w, _wh / bgSize.h)

  cnv = createCanvas(bgSize.w * screenScale, bgSize.h * screenScale);
  cnv.position(windowWidth / 2 - width / 2, windowHeight / 2 - height / 2, 'fixed');
    cnv.elt.addEventListener("contextmenu", (e) => e.preventDefault());

  //fullscreen(true)
  loadPhysics()
  loadImages()
  imageMode(CENTER)
  rectMode(CENTER)

  textSize(4)
  textAlign(CENTER, CENTER)
  centre = { x: width / 2, y: height / 2 }

  new Player()
  new Submarine()
  //new Island(centre.x + 50, centre.y, 0, 0)


  //spawnFishes(0, 0, 10)
}

function windowResized() {
  //resizeCanvas(windowWidth - margin, windowHeight - margin);
  cnv.position(windowWidth / 2 - width / 2, windowHeight / 2 - height / 2, 'fixed');
  //centre = {x: width/2, y: height/2}
}

let playerFrameNum = 0
let screenTranslation = { x: 0, y: 0 }

function keyPressed() {
  if (key == " ") {
    //console.log(mouseX, mouseY)
    if (currentMode == 'menu') {
      currentMode = 'game'

    } else {
      player.boost()
      //console.log(player.body)
    }
    
  }
  if (key.toLowerCase() == "e") {
    collectionOpen = !collectionOpen
    viewingSpecies = undefined
  }
  if (key.toLowerCase() == "f") {
    if (player.distFromHome < 5 && isTileActive(submarine.tile)) {
      player.inSubmarine = !player.inSubmarine
      if (player.inSubmarine) {
        submarine.enter()
      } else {
        submarine.exit()
      }
    }

    if (buildingMode) {
      if (key == "ArrowDown") {
        scrollBuildBrush(1)
      }
      if (key == "ArrowUp") {
        scrollBuildBrush(-1)
      }
    }
  }

    if (key.toLowerCase() == "b" && !player.inSubmarine) {
      buildingMode = !buildingMode
    }

        if (key.toLowerCase() == "t") {
      showTips = !showTips
    }
}



let _scl = 3
let newW = 0;
let newH = 0;

let minScale = 1.25

function mouseWheel(e) {
  if (buildingMode) {
    scrollBuildBrush(e.deltaY/100)
  } else {
    if (!collectionOpen) {
      _scl = Math.max(minScale, _scl - e.deltaY / 400)
    }    
  }


}

let tintColour = '#041733';

function draw() {
background(colours.bg);
  if (currentMode == 'menu') {
    drawMenu()
  } else {
    if (hasDataLoaded() && !fishHaveSpawned) {
      handleData()
      spawnAllFish()
    }

    scale(_scl, _scl)
    newW = width / _scl
    newH = height / _scl
    screenTranslation = { x: 0 - player.pos.x + newW / 2, y: 0 - player.pos.y + newH / 2 }
    screenTranslation.x = Math.max(Math.min(screenTranslation.x, 0), 0 - (width - newW))
    screenTranslation.y = Math.max(Math.min(screenTranslation.y, 0), 0 - (height - newH))
    translate(screenTranslation.x, screenTranslation.y)
    if (typeof imgs != 'object') { return }

    islandBob = bob(0.002, 8)
    
    noSmooth()

    drawBG()
    drawFG()

    for (let island of islands) {
      island.draw()
    }

    for (let portal of allPortals) {
      portal.draw()
    }

    // Draw buildings
    drawBuildMode()

    // Draw player, sub and fish

    drawBubbles()
    submarine.draw()
    player.draw()

    if (frameCount % 180 == 0) {
      let p = player.headPos()
      produceBubble(p.x, p.y)
    }


    for (let fish of fishes) {
      fish.draw()
    }

  

    // Pickups
    for (let pickup of pickups) {
      pickup.draw()
    }
    updateMap()

    // TIPS
    drawTips()

    // Tint and teleport screen
    noStroke()
    let a = Math.max(80, Math.min(200, 80 + (player.globalPos().y / 20)))
    if (player.isTeleporting) {
      tintColour.setAlpha(255)
      player.teleportTimer += deltaTime
      if (player.teleportTimer > 1000) {
        player.teleportTimer = 0
        player.isTeleporting = false
      }
    } else {
      tintColour.setAlpha(a)
    }

    fill(tintColour)
    rect(centre.x, centre.y, width, height)

    // Collection and HUD

    if (collectionOpen) {
      drawCollection()
    }

    if (!player.isTeleporting) {
      drawHUD()
    }

  }

  if (buildingMode) {
    push()
    stroke(255)
    strokeWeight(3/_scl)
    let mp = getScreenPos(mouseX, mouseY)
    point(mp.x, mp.y)
    pop()
  }
 


}
