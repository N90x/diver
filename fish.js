let fishes = []
let fishSize = 20

function getRandomFishType() {
    let t = ['', 'bigscale', 'dartscale'][getRandomInt(3)]
    let n = `enemies/fish${t}`
    //console.log(n)
    return n
}

let fishGlobalSpeed = 0.0004

let speciesTypes = []

class Fish {
    constructor(tileX, tileY, species) {
        this.pos = getRandomPosition()
        this.targetPos = createVector(this.pos.x, this.pos.y)
        this.tile = { x: tileX, y: tileY }

        if (speciesTypes[species]) {
            this.type = speciesTypes[species].type
            this.colour = speciesTypes[species].colour

        } else {
            speciesTypes[species] = {
                type: getRandomFishType(),
                colour: getRandomColour(100)
            }
            this.type = speciesTypes[species].type
            this.colour = speciesTypes[species].colour
        }
        
        this.playerDist = 0

        this.species = species//getRandomInt(43)
        this.info = fishSpecies[this.species]   
        this.moveSpeed = fishGlobalSpeed * (Math.random()/2)
        this.size = Number(this.info.size) + 8 + getRandomInt(4)

        this.scan = 0
        this.info;

        this.animationSpeed = 15
        this.frameNum = 0
        this.maxFrames = 4
        this.hash = getRandomInt(100)        

        this.body = Matter.Bodies.circle(this.pos.x, this.pos.y, this.size / 4)
        Composite.add(engine.world, this.body)

        fishes.push(this)
    }

    draw() {


        this.pos = this.body.position
        this.doBounds()

        let nLvl = 0.02
        let nScl = 0.005
        let _noise = getNoise(nLvl, nScl, this.hash)
        this.targetPos.x = this.pos.x + _noise.x
        this.targetPos.y = this.pos.y + _noise.y

        Matter.Body.applyForce(this.body, this.body.position, { x: _noise.x * this.moveSpeed, y: _noise.y * this.moveSpeed })

        if (isTileActive(this.tile)) {
            //circle(this.pos.x, this.pos.y, this.size)
            //line(this.pos.x, this.pos.y, this.targetPos.x, this.targetPos.y)
            this.playerDist = dist(this.pos.x, this.pos.y, player.pos.x, player.pos.y)
            let facingLeft = this.body.velocity.x < 0

            if (frameCount % this.animationSpeed == 0) {
                this.frameNum++
                if (this.frameNum == this.maxFrames) { this.frameNum = 0 }
            }

            if (facingLeft) {
                push()
                let sx = this.frameNum * 32
                let sy = 0
                let sw = 32
                let sh = 32
                translate(this.pos.x, this.pos.y)
                scale(-1, 1)
                tint(this.colour)
                image(imgs[this.type], 0, 0, this.size, this.size, sx, sy, sw, sh)
                pop()
            } else {
                push()
                let sx = this.frameNum * 32
                let sy = 0
                let sw = 32
                let sh = 32
                translate(this.pos.x, this.pos.y)
                tint(this.colour)
                image(imgs[this.type], 0, 0, this.size, this.size, sx, sy, sw, sh)
                pop()
            }

            // Info box
            if (this.playerDist < 50) {

                if (discoveredList.includes(this.species)) {
                    fill(255)
                    //stroke(255)
                    text(`${this.info.name}`, this.pos.x, this.pos.y - 4 - this.size / 2)
                    for (let i = 0; i < getStarsFromRarity(this.info.rarity); i++) {
                        image(starImg, this.pos.x + i * 4, this.pos.y - this.size / 2, 4, 4)
                    }
                } else {
                    if (keyIsDown(32) && player.state == 'idle') {
                        this.scan ++
                        player.isScanning = true
                        //fill(255,255,255,80)
                        //square(this.pos.x, this.pos.y, this.size*(this.scan/100))
                    }  else {
                        if (player.isScanning) {player.isScanning=false}
                        this.scan--
                        this.scan = Math.max(this.scan,0)
                    }

                    if (this.scan>=100) {
                        discoveredList.push(this.species)
                        loadSpeciesImage(this.species)
                        updateCollection()
                        console.log(`Discovered species #${this.species}`)
                    }
                }

            }

        }
    }

    setPos(x, y) {
        Matter.Body.setPosition(this.body, { x: x, y: y })
    }

    doBounds() {
        if (this.pos.x > width) {
            this.setPos(0, this.pos.y)
            this.tile.x++
        }
        if (this.pos.x < 0) {
            this.setPos(width, this.pos.y)
            this.tile.x--
        }
        if (this.pos.y > height) {
            this.setPos(this.pos.x, 0)
            this.tile.y++
        }
        if (this.pos.y < 0) {
            this.setPos(this.pos.x, height)
            this.tile.y--
        }
    }
}

function getNoise(lvl, scl, hash) {
    // Set the noise level and scale.
    let noiseLevel = lvl//100;
    let noiseScale = scl//0.005;

    // Scale the input coordinate.
    let nt = noiseScale * frameCount + hash;

    // Compute the noise values.
    let x = noiseLevel * noise(nt);
    let y = noiseLevel * noise(nt + 10000);
    return { x: x - lvl / 2, y: y - lvl / 2 } // subtract half to make bipolar
}

function spawnFishes(range, species, num) {
    for (let i = 0; i < num; i++) {
        let tx = getRandomInt((range*2)+1)-range/2
        let ty = getRandomInt((range*2)+1)-range/2
        new Fish(tx, ty, species)
    }
}

let fishHaveSpawned = false

// rarities: common, uncommon, rare, epic, legendary

function getCountFromRarity(rarity) {
    let n;
    if (rarity == 'Common') { n = 3 }
    if (rarity == 'Uncommon') { n = 2 }
    if (rarity == 'Rare') { n = 2 }
    if (rarity == 'Epic') { n = 1 }
    if (rarity == 'Legendary') { n = 1 }
    return n
}

function getStarsFromRarity(rarity) {
    let n;
    if (rarity == 'Common') { n = 1 }
    if (rarity == 'Uncommon') { n = 2 }
    if (rarity == 'Rare') { n = 3 }
    if (rarity == 'Epic') { n = 4 }
    if (rarity == 'Legendary') { n = 5 }
    return n
}

function spawnAllFish() {
    fishHaveSpawned = true
    for (let i = 0; i < fishSpecies.length; i++) {
        let species = fishSpecies[i]
        let n = getCountFromRarity(species.rarity)
        spawnFishes(4, i, n)
    }
}
