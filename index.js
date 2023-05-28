var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
var flowers_img = []
const FLOWER_SIZE = 32;
const FLOWER_COUNT = 12;
const API_URL = 'https://sood1cr8tc.execute-api.us-east-2.amazonaws.com/default/';
var flowers = [];
const  FLOWER_BLOCK_TIME = 1000 * 60 * 1;  // 1 minute

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
        unblockCanvas();

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
    blockFlowers(FLOWER_BLOCK_TIME);
}

function blockFlowers(time) {
    // block flowers for 5 minutes
    canvas.removeEventListener('mousedown', mouseEventListener);
    setTimeout(() => {
        canvas.addEventListener('mousedown', mouseEventListener);
    }, time);

    // grey out mouse pointer
    canvas.style.cursor = 'not-allowed';
    setTimeout(() => {
        canvas.style.cursor = 'crosshair';
    }
    , time);
    progresBars(time);

    const message = document.getElementById('message');
    message.innerText = 'Wait...';
    setTimeout(() => {
        message.innerText = 'Click the garden!';
    }
    , time);
}

function blockCanvas(){
    canvas.removeEventListener('mousedown', mouseEventListener);
    canvas.style.cursor = 'wait';
    const message = document.getElementById('message');
    message.innerText = 'Wait...';
}

function unblockCanvas(){
    canvas.addEventListener('mousedown', mouseEventListener);
    canvas.style.cursor = 'crosshair';
    const message = document.getElementById('message');
    message.innerText = 'Click the garden!';
}

function progresBars(time) {
    const progess_top = document.getElementById('progress-top');
    const progess_right = document.getElementById('progress-right');
    const progess_bottom = document.getElementById('progress-bottom');
    const progess_left = document.getElementById('progress-left');

    progess_top.style.width = '100%';
    progess_right.style.height = '100%';
    progess_bottom.style.width = '100%';
    progess_left.style.height = '100%';

    time = time / 10;
    var progress = 0;

    var id = setInterval(frame, 10);

    function frame() { 
        if (progress >= time) {
            clearInterval(id);
        } else {
            progress++;
        }

        progess_top.style.width    = `${Math.max(0,Math.min(100, ( 4*time/4 - progress ) / (time/4)  * 100))}%`; 
        progess_right.style.height = `${Math.max(0,Math.min(100, ( 3*time/4 - progress ) / (time/4)  * 100))}%`;

        progess_bottom.style.width = `${Math.max(0,Math.min(100, ( 2*time/4 - progress ) / (time/4)  * 100))}%`;
        progess_left.style.height  = `${Math.max(0,Math.min(100, ( 1*time/4 - progress ) / (time/4)  * 100))}%`;

        progess_bottom.style.left  = `${Math.min(100,Math.max(0, ( progress  - 1*time/4 ) / (time/4)  * 100))}%`;
        progess_left.style.top     = `${Math.min(100,Math.max(0, ( progress  - 0*time/4 ) / (time/4)  * 100))}%`;
    }   
}







// calculate pos of flowers
blockCanvas()
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

// addEventListener("keydown", (event) => {
//     console.log(event);
//     console.log(event.key);
//     if (event.isComposing || event.key === 'l') {
//         progresBars(FLOWER_BLOCK_TIME);
//         return;
//     }
//     // do something
//   });