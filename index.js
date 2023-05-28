var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
var flowers_img = []
const FLOWER_SIZE = 32;
const FLOWER_COUNT = 12;
const API_URL = 'https://sood1cr8tc.execute-api.us-east-2.amazonaws.com/default/';
var flowers = [];
const  FLOWER_BLOCK_TIME = 1000 * 60 * 5;  // 5 minutes

class Flower {
    constructor(x, y, style, orientation = 1) {
        this.x = x;
        this.y = y;
        this.style = style;
        this.orientation = orientation;
    }
}

function getFlowersFromDB() {
    const http = new XMLHttpRequest();
    const url = API_URL + 'flowers-get';
    http.open("GET", url);

    http.send();
    http.onreadystatechange = (e) => {
        console.log(http.responseText);
        
        const flowers_json = JSON.parse(http.responseText);
        flowers = flowers_json.map(f => new Flower(f.x, f.y, f.style, 1));
        drawFlowers();
    }

    // make a get from db
    var testFlower = new Flower(40, 40, 2, 1);
    return [testFlower];
}

function drawFlower(flower) {   
    ctx.drawImage(flowers_img[flower.style], flower.x - FLOWER_SIZE / 2, flower.y - FLOWER_SIZE,  FLOWER_SIZE , FLOWER_SIZE);
}

function addFlower(x, y, flowers) {
    var style = Math.floor(Math.random() * 11 + 1);
    var orientation = Math.floor(Math.random() * 2 - 1);
    var flower = new Flower(x, y, style, orientation);
    saveFlowerInDB(flower);

    // momentary thing
    flowers.push(flower)


}

function saveFlowerInDB(flower) {
    const http = new XMLHttpRequest();
    const url = API_URL + 'flowers-post';
    http.open("POST", url);
    http.send(JSON.stringify(flower));
    http.onreadystatechange = (e) => {
        console.log(http.responseText);
        const flowers_json = JSON.parse(http.responseText);
        flowers = flowers_json.map(f => new Flower(f.x, f.y, f.style, 1));
        drawFlowers();
    }
    // save into db

    // update local flowers 
    return true;
}

function drawFlowers(){
    // draw flowers
    flowers.sort((a, b) => a.y - b.y);
    for (let i = 0; i < flowers.length; i++) {
        drawFlower(flowers[i]);
        
    }

}


// from https://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(event.clientX - rect.left);
    const y = Math.floor(event.clientY - rect.top);
    return {x: x, y: y};
    
}

function mouseEventListener(e) {
    const pos = getCursorPosition(canvas, e);
    addFlower(pos.x, pos.y, flowers);
    drawFlowers();
    blockFlowers();
}

function blockFlowers() {
    // block flowers for 5 minutes
    canvas.removeEventListener('mousedown', mouseEventListener)
    setTimeout(() => {
        canvas.addEventListener('mousedown', mouseEventListener)
    }, FLOWER_BLOCK_TIME);

    // grey out mouse pointer
    canvas.style.cursor = 'not-allowed';
    setTimeout(() => {
        canvas.style.cursor = 'crosshair';
    }
    , FLOWER_BLOCK_TIME);

    // draw a white outline outside the canvas that will get smaller and smaller showing the time left

    canvas.style.border = '5px solid white';
    setTimeout(() => {
        canvas.style.border = 'none';
    }
    , FLOWER_BLOCK_TIME);
}









// calculate pos of flowers
getFlowersFromDB();



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


canvas.addEventListener('mousedown', mouseEventListener)
