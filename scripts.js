

import {Item} from './Objects/Item.js';
import {DIR} from './Global/direction_enum.js';
import { LAYER } from './Global/Map/Layer.js';
import { createDevMap, createMap } from './Map/Map.js';
import { TILE_SIZE } from './Global/global_vars.js';
import { newCreatureContext, rightClickMenu, createObjDragUI } from './UI/UI.js';
import { Component } from './Components/component.js';
import { Structure } from './Objects/Structure.js';
import { getPunchingForce } from './Global/material.js';
import { INTENT } from './Global/intent.js';
import { Humanoid } from './Objects/Creatures/Humanoid.js';
import { Bronze_Crowbar, Crowbar } from './Objects/Items/Tool/crowbar.js';
import { Bronze_Bar, Material, Wood } from './Objects/Items/Materials/material.js';
import { door } from './Objects/Structures/door.js';
import { Creature } from './Objects/Creature.js';
import { createRightMenu, createHandsUI, createCanvas } from './UI/UI.js'
import { Sword } from './Objects/Items/Weapons/sword.js';
import { Inventory_Slot } from './Components/Inventory_Slot.js';

//var tester = new Creature("Wolf.js");
let player = new Humanoid("Dwarf.js");
let dorf = new Humanoid("Dwarf.js");
let sword = new Sword();
dorf.AI();

var arrOfCreatures = [];
var testerNum = 5;

for(var i = 0; i < testerNum; i++){
    arrOfCreatures.push(new Creature("Wolf.js"));
}

// var sword = new Item();
// sword.attackSurfacePerimeter = 0.5;
// sword.mass = 3.5;
// sword.velocity = 20;
// sword.damageType = "SHARP";
// console.log(getPunchingForce(0.0021, 10, 10));


//THIS NEEDS A MAJOR REDO, MAKE IT SPLIT INTO GROUPS, (allEngineCreatures, allEngineItems, allEngineStructures... etc)
export var allEngineObjects = []; //Contains every single object
var allComponents = [];

var canvasArr = [];
export var contextArr = [];

//User input queue TODO
var keyQueue = [];

//Create arrays for each layer
export var mapLayerArr = [];
var counter = 0;

let body = document.getElementById('main');

var length = 9;
var width = 21;

//Main Playground
for (let x in LAYER) {

    let canvas = createCanvas(width,11,counter);

    canvasArr[counter] = canvas;

    body.appendChild(canvas);

    let context = canvas.getContext('2d');
    contextArr[counter] = context;

    mapLayerArr[counter] = new Array();

    counter++;
}

//Inventory Tester Menu
let rightMenuCanvas = createRightMenu(width,length,player);
let rightMenuContext = rightMenuCanvas.getContext('2d');

let rmStartX = (width*TILE_SIZE)+(100+TILE_SIZE);
let rmStartY = 100;
var rmWidth = 5;
var rmHeight = 9;

//In place cause im too lazy to make a backpack or container object 
let tempInvArr = new Array(rmWidth);
    for(var i = 0; i < tempInvArr.length; i++){
        tempInvArr[i] = new Array(rmHeight);
    }

for(var i = 0; i < rmWidth; i++){
    for(var j = 0; j < rmHeight; j++){

        var newObj = new Inventory_Slot();

        newObj.name = "inventory slot";
        newObj.image = 'inv.png';
        newObj.imageFolder = '../Images/';

        newObj.needsUpdating = true;

        newObj.location = {x: rmStartX ,y: rmStartY};
        newObj.ctx = rightMenuContext;

        allComponents.push(newObj);
        allEngineObjects.push(newObj);

        tempInvArr[i][j] = newObj; 

        rmStartY += 64;
    }
    rmStartX += 64;
    rmStartY = 100;
}

console.log(tempInvArr);

//Items Held Tester Menu
let handMenuCanvas = createHandsUI(2,11,player);
let handMenuContext = handMenuCanvas.getContext('2d');

let hmStartX = 100;
let hmStartY = ((10)*TILE_SIZE) + 100;

player.leftHand.location = {x: hmStartX ,y: hmStartY};
player.leftHand.ctx = handMenuContext;
allComponents.push(player.leftHand);
allEngineObjects.push(player.leftHand);
player.leftHand.needsUpdating = true;

player.rightHand.location = {x: hmStartX + 64,y: hmStartY};
player.rightHand.ctx = handMenuContext;
allComponents.push(player.rightHand);
allEngineObjects.push(player.rightHand);
player.rightHand.needsUpdating = true;

//Bottom Menu
//Not here yet, maybe never will be 

var mouseObj = {
    x: null,
    y: null
}

//let baseMap = createMap(width,length);
export let baseMap = createDevMap(width,length);
console.log(baseMap);

var startingPosX = 100;

var startX = 100;
var startY = 100;

var prevObj = null;

var struct = new Structure();
console.log(struct.toString());

var keyW = false;
var keyA = false;
var keyS = false;
var keyD = false;
var keySHIFT = false;

//Engines custom left click function
window.addEventListener('click', function(event){
    mouseObj.x = event.x;
    mouseObj.y = event.y;
    player.clickObj(mouseObj);

    var idName = player.uniqueID + "target_menu_" + player.name;
    if(document.getElementById(idName)){
        document.getElementById("main").removeChild(document.getElementById(idName));
    }
    
    if(keySHIFT){
        player.shiftClickObject(mouseObj);
    }
    
    document.getElementById('inspectMenu').className = "hiddenInspectMenu";

    //checks to see what tile was clicked 
    //This is left here for future use. (works when clicking anything derived from object)
    // for(let i = 0; i < allEngineObjects.length; i++){
    //     allEngineObjects[i].clickObj(mouseObj);
    // }

    //Components for engine objects that dont need a creature near it to be interacted with
    for(let i = 0; i < allComponents.length; i++){
        allComponents[i].clickObj(mouseObj);
    }
});

let mouseDragging = false;
let mouseDown = false;
let mouseDownObj = null;
let mouseDraggedToObj = null;

let dragContext = null;

//Engines custom mousedown function
window.addEventListener('mousedown', function(event){
    mouseObj.x = event.x;
    mouseObj.y = event.y;
    
    mouseDown = true;

    for(let i = 0; i < allComponents.length; i++){
        if(!mouseDownObj){
            mouseDownObj = allComponents[i].getClickedObj(mouseObj);
        }else{
            break;
        }
    }

    if(mouseDownObj){console.log(mouseDownObj.name);}
});

window.addEventListener('mouseup', function(event){
    mouseObj.x = event.x;
    mouseObj.y = event.y;

    if(mouseDragging === true){
        for(let i = 0; i < allComponents.length; i++){
            if(!mouseDraggedToObj){
                mouseDraggedToObj = allComponents[i].getClickedObj(mouseObj);
            }else{
                break;
            }
        }
    }

    if(mouseDraggedToObj && mouseDownObj){
        console.log(`${mouseDownObj.name} was dragged to ${mouseDraggedToObj.name}`);
        if(mouseDownObj && mouseDownObj.constructor.name === "Hand"){
            mouseDraggedToObj.event(mouseDownObj, tempInvArr);
        }else if(mouseDownObj && mouseDownObj.constructor.name === "Inventory_Slot"){
            mouseDraggedToObj.event(mouseDownObj, player, tempInvArr);
        }
    }

    mouseDown = false;
    mouseDownObj = null;
    mouseDragging = false;
    mouseDraggedToObj = null;
    dragContext = null;

    if(document.getElementById(`obj_drag_ui_${player.uniqueID}`)){
        document.getElementById("main").removeChild(document.getElementById(`obj_drag_ui_${player.uniqueID}`));
    }
});

//Engines custom mousemove click function
window.addEventListener('mousemove', function(event){
    mouseObj.x = event.x;
    mouseObj.y = event.y;

    if(mouseDown === true){
        if(mouseDownObj && mouseDownObj.constructor.name === "Hand"){
            if(mouseDownObj.item && !dragContext){
                let objCopy = {...mouseDownObj.item};
                objCopy.size_x = 64 * objCopy.inventorySizeX;
                objCopy.size_y = 64 * objCopy.inventorySizeY;
                dragContext = createObjDragUI(player, objCopy, mouseObj);
            }else if(dragContext){
                dragContext.style.top = mouseObj.y + "px";
                dragContext.style.left = mouseObj.x + "px";
            }
        }
        if(mouseDownObj && mouseDownObj.constructor.name === "Inventory_Slot"){
            if(mouseDownObj.objectHolder && !dragContext){
                dragContext = createObjDragUI(player, mouseDownObj.objectHolder, mouseObj);
            }else if(dragContext){
                dragContext.style.top = mouseObj.y + "px";
                dragContext.style.left = mouseObj.x + "px";
            }
        }
    }

    if(mouseDown === true){
        mouseDragging = true;
    }
});


let bronzeBar = new Bronze_Bar();
let materials = new Material();
//TODO: array to hold keys pressed so its dynamic
window.addEventListener('keydown', function(event){
    if(event.code === 'KeyW'){keyW = true; event.preventDefault();}
    if(event.code === 'KeyA'){keyA = true; event.preventDefault();}
    if(event.code === 'KeyS'){keyS = true; event.preventDefault();}
    if(event.code === 'KeyD'){keyD = true; event.preventDefault();}
    if(event.code === 'ShiftLeft'){keySHIFT = true; event.preventDefault();}

    if(event.code === 'KeyU'){
        // tester.attacked("upper body", sword);

        // var rand = tester.getRandomBodyType("upper body","vessel");

        // tester.bleeding(rand);
        // tester.bleedingAmount = 10;
        // tester.bleeding(rand);

        // console.log(rand);
        for(var i = 0; i < allEngineObjects.length; i++){
            if(allEngineObjects[i] === bronzeBar){
                console.log(allEngineObjects[i]);
            }
        }
        for(var i = 0; i < mapLayerArr.length; i++){
            for(var j = 0; j < mapLayerArr[i].length; j++){
                if(mapLayerArr[i][j] === bronzeBar){
                    console.log(mapLayerArr[i][j]);
                }
            }
        }
    }

    if(event.code === 'KeyO'){
        newImg.isRotating = false;
        newImg.boolRotatingInterval = false;
    }
    
    if(event.code === 'KeyP'){
        newImg.isRotating = true;
        newImg.needsUpdating = true;
        bronze.move(DIR.SOUTH, baseMap);
    }

    if(event.code === 'KeyC'){
        if(player.intent === INTENT.HARM){
            player.intent = INTENT.HELP;
        }else if(player.intent === INTENT.HELP){
            player.intent = INTENT.HARM;
        }
        console.log(player.intent);
    }

    if(event.code === 'KeyX'){
        player.switchHand();
    }

    if(event.code === 'KeyQ'){
        player.drop();
    }
});

window.addEventListener('keyup', function(event){
    if(event.code === 'KeyW'){keyW = false;}
    if(event.code === 'KeyA'){keyA = false;}
    if(event.code === 'KeyS'){keyS = false;}
    if(event.code === 'KeyD'){keyD = false;}
    if(event.code === 'ShiftLeft'){keySHIFT = false;}
});

//Engines custom right click override 
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    var mouseEvent = {x: e.x,y: e.y};
    var arr = [];

    //checks objects to create a custom menu
    for(let i = 0; i < allEngineObjects.length; i++){
        if(allEngineObjects[i].rightClickObj(mouseEvent) !== null){
            arr.push(allEngineObjects[i].rightClickObj(mouseEvent));
        }
    }

    if(arr.length !== 0){
        rightClickMenu(arr,mouseEvent);
    }
}, false);

var share = 0;

let newImg = new Crowbar();
let anotherCrowbar = new Crowbar();
let bronze = new Bronze_Crowbar();
let wood = new Wood();
// bronze.setRotation(34);
//newImg.image = '../Images/Objects/crowbar.png';
// newImg.rotation = (45);
// newImg.isRotating = true;
// newImg.setOverlay(['./Images/Objects/crowbar.png']);
// newImg.setOverlay(['./Images/Objects/crowbar.png','./Images/blob1.png','./Images/blob2.png']);

// setTimeout(function(){newImg.stopRotating();},2000);
// setTimeout(function(){newImg.isRotating = true; newImg.needsUpdating = true;},2000);

var thisStart = null;

for(var x = 0; x < contextArr.length; x++){
    for(var i = 0; i < width; i++){
        for(var j = 0; j < length; j++){

            baseMap[i][j].needsUpdating = true;
            newImg.needsUpdating = true;

            // var s = new Item();
            // s.location = {x: startX, y: startY};
            // s.layer = x;
            // s.ctx = contextArr[x];
    
            if(i == 2 && j == 2 && x == 2){
                newImg.location = {x: startX, y: startY};
                newImg.ctx = contextArr[x];
                mapLayerArr[x].push(newImg);
                allEngineObjects.push(newImg);
            }else if (i == 3 && j == 2 && x == 2){
                bronze.location = {x: startX, y: startY};
                bronze.ctx = contextArr[x];
                mapLayerArr[x].push(bronze);
                allEngineObjects.push(bronze);
            }else if (i == 3 && j == 3 && x == 2){
                anotherCrowbar.location = {x: startX, y: startY};
                anotherCrowbar.ctx = contextArr[x];
                mapLayerArr[x].push(anotherCrowbar);
                allEngineObjects.push(anotherCrowbar);
            }else if (i == 4 && j == 2 && x == 2){
                materials.location = {x: startX, y: startY};
                materials.ctx = contextArr[x];
                mapLayerArr[x].push(materials);
                allEngineObjects.push(materials);
            }else if (i == 5 && j == 2 && x == 2){
                wood.location = {x: startX, y: startY};
                wood.ctx = contextArr[x];
                mapLayerArr[x].push(wood);
                allEngineObjects.push(wood);
            }else if (i == 6 && j == 2 && x == 2){
                bronzeBar.location = {x: startX, y: startY};
                bronzeBar.ctx = contextArr[x];
                mapLayerArr[x].push(bronzeBar);
                allEngineObjects.push(bronzeBar);
            }else if (x === 0){
                baseMap[i][j].location = {x: startX, y: startY};
                baseMap[i][j].ctx = contextArr[x];
                mapLayerArr[x].push(baseMap[i][j]);
                allEngineObjects.push(baseMap[i][j]);
                if(baseMap[i][j].name === "start"){thisStart = baseMap[i][j];}
            }else if (i == 3 && j == 3 && x == 3){
                player.location = {x: thisStart.location.x, y: thisStart.location.y};
                player.ctx = newCreatureContext(player);
                mapLayerArr[x].push(player);
                allEngineObjects.push(player);
            }else if (i == 8 && j == 5 && x == 3){
                for(var aj = 0; aj < testerNum; aj++){
                    arrOfCreatures[aj].location = {x: startX, y: startY};
                    arrOfCreatures[aj].ctx = newCreatureContext(arrOfCreatures[aj]);
                    mapLayerArr[x].push(arrOfCreatures[aj]);
                    allEngineObjects.push(arrOfCreatures[aj]);
                    arrOfCreatures[aj].AI();
                }
            }else if (i == 15 && j == 6 && x == 3){
                dorf.location = {x: startX, y: startY};
                dorf.ctx = newCreatureContext(dorf);
                mapLayerArr[x].push(dorf);
                allEngineObjects.push(dorf);
            }else if (i == 16 && j == 6 && x == 2){
                sword.location = {x: startX, y: startY};
                sword.ctx = contextArr[x];
                mapLayerArr[x].push(sword);
                allEngineObjects.push(sword);
            }else{
                // mapLayerArr[x].push(s);
                // allEngineObjects.push(s);
            }
            
            startY += TILE_SIZE;
            share = TILE_SIZE;

        }
        startX += share;
        startY = startingPosX;
    }
    startY = 100;
    startX = 100;
}

var x = 200;

console.log(newImg);

player.moveSpeed = 90;

function animate(){

    for(let j = 0; j < allEngineObjects.length; j++){
        var thisObj = allEngineObjects[j];
        if(thisObj.needsUpdating === true || thisObj.velocityX !== 0 || thisObj.velocityY !== 0){
            thisObj.update();
            thisObj.needsUpdating = false;
        }
    }

    if(keyW === true){ player.move(DIR.NORTH,baseMap); }
    if(keyA === true){ player.move(DIR.WEST,baseMap); }
    if(keyS === true){ player.move(DIR.SOUTH,baseMap); }
    if(keyD === true){ player.move(DIR.EAST,baseMap); }

    requestAnimationFrame(animate);
}

animate();

//Testing animations
// allEngineObjects[57].velocityX = -1; //Left
// allEngineObjects[56].velocityX = 1; //Right
// allEngineObjects[65].velocityY = -1; //Up
// allEngineObjects[64].velocityY = 1; //Down

// //Bottom Right
// newImg.velocityX = 1;
// newImg.velocityY = 1;

// //Top Left
// allEngineObjects[59].velocityX = -1;
// allEngineObjects[59].velocityY = -1;

// //Bottom Left
// allEngineObjects[100].velocityX = -1;
// allEngineObjects[100].velocityY = 1;


// //Top Right
// allEngineObjects[79].velocityX = 1;
// allEngineObjects[79].velocityY = -1;



//=-=-=-=-=-=-=-=-=-=-


// moving(dir,map){
//     this.isMoving = true; //used to stop another call for moving while already moving
//     let self = this;

//     let currentX = Math.floor(this.location.x / 64) -1;
//     let currentY = Math.floor(this.location.y / 64) -1;

//     let destX = this.location.x; //destinations for animation
//     let destY = this.location.y;

//     let prevLoc = {x: this.location.x, y: this.location.y}

//     //change this to a switch (too bad im lazy)
//     if(dir === DIR.NORTH){ currentY--; destY = this.location.y - 64; this.velocityY = -1;}
//     if(dir === DIR.WEST){ currentX--; destX = this.location.x - 64; this.velocityX = -1;}
//     if(dir === DIR.EAST){ currentX++; destX = this.location.x + 64; this.velocityX = +1;}
//     if(dir === DIR.SOUTH){ currentY++; destY = this.location.y + 64; this.velocityY = +1;}

//     if(map[currentX][currentY].density === false){
        
//         for(var i = 0; i < 64; i++){
//             switch(dir){
//                 case DIR.NORTH: this.location.y--; break; 
//                 case DIR.WEST:  this.location.x--; break;
//                 case DIR.EAST:  this.location.x++; break;
//                 case DIR.SOUTH: this.location.y++; break;
//             }
//             if(this.location.x === destX || this.location.y === destY){
//                 this.velocityX = 0;
//                 this.velocityY = 0;
//                 self.isMoving = false;
//             }
//         }
        
//     }

//     //The objects speed delay
//     setTimeout(function(){
//         //self.isMoving = false;
//     },self.moveSpeed);
// }




// if(self.dest.x === self.location.x && self.dest.y === self.location.y){
            //     console.log("debug: inside onload if statement");
            //     self.velocityX = 0;
            //     self.velocityY = 0;
            //     self.dest = {x: null, y: null};
            // }