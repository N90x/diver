let collectionOpen = false
let numSpecies = 42
let boxW = 20
let speciesDisplayText;
let discoveredList = []

let textTop = 45
let textBottom = 585
let textH = textBottom - textTop

let viewingSpecies;

function drawCollection() {
    push()
    fill(255)
    let pos = getScreenPos(width/2, height/2)
    let x = pos.x 
    let y = pos.y 
    let w = 300/_scl
    let h = 600/_scl
    rect(x, y, w, h)

    let mouseI = Math.round(43*((mouseY - textTop) / textH))

    mouseI = Math.min(43, Math.max(1, mouseI))

    if (mouseIsPressed && discoveredList.includes(mouseI-1)) {
        viewingSpecies = mouseI-1
    }
    
    noFill()
    stroke(0)
    strokeWeight(1/_scl)
    let itemHeight = (textH/43)/_scl
    let _y = y-h/2
    rect(x, _y + mouseI*(itemHeight), w, itemHeight)

    textSize(10/_scl)
    textAlign(LEFT, TOP)
    fill(0)
    noStroke()
    text(speciesDisplayText, x-w/2 + 10/_scl, y-h/2 + 10/_scl)

    if (typeof viewingSpecies != 'undefined') {
        let s = fishSpecies[viewingSpecies]

        textAlign(LEFT, CENTER)
        fill(255)
        noStroke()
        text(
            `\nName: ${s.name}\nType: ${s.type}\nRarity: ${s.rarity}\nSize: ${s.size}\nPrice: ${s.price}`,
            x + w/1.8, y
        )

        if (speciesImgs[viewingSpecies]) {
            let _w = speciesImgs[viewingSpecies].width/_scl
            let _h = speciesImgs[viewingSpecies].height/_scl
            let ratio = _w/_h

            let _wW = w
            image(speciesImgs[viewingSpecies], x - w/2 - _w/2, y, _wW, _wW/ratio)
        }
    }
    pop()
}

function updateCollection() {
    let foobar = []
    for (let i = 0; i<=numSpecies; i++) {
        if (discoveredList.includes(i)) {
            foobar.push(`# ${i}: ${fishSpecies[i].name} (${fishSpecies[i].rarity})`)
        } else {
            foobar.push(`# ${i}: ?`)
        }
    }
    speciesDisplayText = foobar.join('\n')
}