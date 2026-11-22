let fishSpecies;

//let fetchURL = `https://environment.data.gov.uk/ecology/api/v1/species?skip=0&take=250`

async function loadSpecies() {
    fishSpecies = await loadJSON('fish.json')
}

function handleData() {
    fishSpecies = Object.values(fishSpecies)
}

function hasDataLoaded() {
    return typeof fishSpecies != 'undefined'
}

let speciesImgs = []

async function loadSpeciesImage(speciesNum) {
    speciesImgs[speciesNum] = await loadImage(fishSpecies[speciesNum].img)
    console.log(speciesImgs)
}
