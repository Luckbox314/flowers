
console.log("Drawing flowers")
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
var flowers_img = []
const FLOWER_SIZE = 32;
const FLOWER_COUNT = 12;

class Flower {
    constructor(x, y, type, orientation = 1) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.orientation = orientation;
    }
}

function getFlowersFromDB() {
    // make a get from db
    var testFlower = new Flower(40, 40, 2, 1);
    return [testFlower];
}

function drawFlower(flower) {   
    console.log(ctx);
    console.log(flowers_img[flower.type]);
    ctx.drawImage(flowers_img[flower.type], flower.x - FLOWER_SIZE / 2, flower.y - FLOWER_SIZE,  FLOWER_SIZE , FLOWER_SIZE);
}

function addFlower(x, y, flowers) {
    var type = Math.floor(Math.random() * 11 + 1);
    var orientation = Math.floor(Math.random() * 2 - 1);
    var flower = new Flower(x, y, type, orientation);
    saveFlowerInDB(flower);

    // momentary thing
    flowers.push(flower)


}

function saveFlowerInDB(flower) {
    // save into db

    // update local flowers 
    return true;
}

function drawFlowers(){
    // draw flowers
    for (let i = 0; i < flowers.length; i++) {
        console.log(flowers_img);
        drawFlower(flowers[i]);
        
    }

}
// calculate pos of flowers
var flowers = getFlowersFromDB();



// first load after image load
flowers_loaded = Array(FLOWER_COUNT).fill(false);
for (let i = 0; i < FLOWER_COUNT; i++) {
    flowers_img[i] = new Image();
    flowers_img[i].src = `sprites/flowers/flower-Slice ${i + 1}.svg`;
    flowers_img[i].onload = () => {
        flowers_loaded[i] = true;
        if (flowers_loaded.every(e => e)) drawFlowers();
    }
}


// from https://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    console.log("x: " + x + " y: " + y)
    return {x: x, y: y};
    
}
canvas.addEventListener('mousedown', function(e) {
    const pos = getCursorPosition(canvas, e);
    addFlower(pos.x, pos.y, flowers);
    drawFlowers();
})
