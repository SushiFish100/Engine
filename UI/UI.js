import { TILE_SIZE } from '../Global/global_vars.js';
import {createUUID} from '../Global/UUID.js';
import { mob_part } from '../Objects/Bodyparts/mob_part.js';

export function rightClickMenu(arr,mouseObj){
    if(arr.length === 0 || Array.isArray(arr) === false){return;}

    document.getElementById('inspectMenu').innerHTML = "";

    //NOTE: Resizing images is bad for speed
    for(var i = 0; i < arr.length; i++){

        //create right click menu UI
        var a = document.createElement("a");
        var newItem = document.createElement('li');

        a.textContent = arr[i].name;
        a.setAttribute('src', arr[i].htmlImage);
        newItem.appendChild(a);

        document.getElementById('inspectMenu').appendChild(newItem);
        document.getElementById('inspectMenu').className = "showInspectMenu";
        
    }

    document.getElementById('inspectMenu').style.top = mouseObj.y + "px";
    document.getElementById('inspectMenu').style.left = mouseObj.x + "px";
}

//Might end up having every object have its own context, who knows
export function newCreatureContext(creature){
    var uuid = createUUID();

    let canvas = document.createElement('canvas');
    canvas.width = (21*TILE_SIZE) +100;
    canvas.height = (9*TILE_SIZE) +100;
    canvas.style.position = 'absolute';
    canvas.className = 'canvasDiv';
    canvas.id = `${creature.name}_${uuid}`;
    document.getElementById('main').appendChild(canvas);

    let context = canvas.getContext('2d');
    return context;
}

/**
 * Create a right menu canvas for a player 
 * (adds canvas to the main screen, but in the future give it to the player only)
 * @param {*} width
 * @param {*} height 
 * @param {*} creature 
 */
export function createRightMenu(width,height,creature){
    let rightMenuCanvas = document.createElement('canvas');
    rightMenuCanvas.width = ((width+6)*TILE_SIZE) + 100;
    rightMenuCanvas.height = (height*TILE_SIZE) + 100;
    rightMenuCanvas.style.position = 'absolute';
    rightMenuCanvas.className = 'canvasDiv';
    rightMenuCanvas.id = `canvas_right_menu_` + creature.uniqueID;
    document.getElementById('main').appendChild(rightMenuCanvas);
    return rightMenuCanvas;
}

/**
 * Creates a canvas
 * @param {*} width 
 * @param {*} height 
 * @param {*} name 
 */
export function createCanvas(width,height,name){
    let canvas = document.createElement('canvas');
    canvas.width = (width*TILE_SIZE) +100;
    canvas.height = (height*TILE_SIZE) +100;
    canvas.style.position = 'absolute';
    canvas.className = 'canvasDiv';
    canvas.id = `canvas_${name}`;
    return canvas;
}

/**
 * Creates a hand UI for a creature.
 * @param {*} width 
 * @param {*} height 
 * @param {*} creature 
 */
export function createHandsUI(width,height,creature){
    let handMenuCanvas = document.createElement('canvas');
    handMenuCanvas.width = ((width)*TILE_SIZE) + 100;
    handMenuCanvas.height = (height*TILE_SIZE) + 100;
    handMenuCanvas.style.position = 'absolute';
    handMenuCanvas.className = 'canvasDiv';
    handMenuCanvas.id = `canvas_hand_menu_`+creature.uniqueID;
    handMenuCanvas.style.zIndex = -10;
    document.getElementById('main').appendChild(handMenuCanvas);
    return handMenuCanvas;
}

/**
 * Creates a item drag UI, to shwo visual confirmation that player is dragging an item
 * @param {*} width 
 * @param {*} height 
 * @param {*} creature 
 * @param {*} object 
 * @param {*} mouseObj 
 * @returns Canvas object
 */
export function createObjDragUI(creature,object,mouseObj){
    let objectDragCanvas = document.createElement('canvas');
    objectDragCanvas.width = object.size_x;
    objectDragCanvas.height = object.size_y;
    objectDragCanvas.style.position ='absolute';
    objectDragCanvas.id = `obj_drag_ui_${creature.uniqueID}`;
    objectDragCanvas.style.zIndex = 20;
    objectDragCanvas.style.top = mouseObj.y + "px";
    objectDragCanvas.style.left = mouseObj.x + "px";
    objectDragCanvas.style.backgroundImage = `url(${object.imageFolder+object.image})`
    document.getElementById('main').appendChild(objectDragCanvas);
    return objectDragCanvas;
}

/**
 * Brings up the target menu
 * @param {*} creature 
 * @param {*} creatureThatClicked 
 */
export function targetsMenu(creature, creatureThatClicked){

    var idName = creatureThatClicked.uniqueID + "target_menu_" + creatureThatClicked.name;
    if(document.getElementById(idName)){
        document.getElementById("main").removeChild(document.getElementById(idName));
    }

    if(creature.targetableParts === false && creature.targetableParts.length <= 0){ return; }

    var container = createTargetContainer();
    container.id = idName;
    container.style.left = creature.location.x - (Math.round(creature.targetableParts.length*2/2 -1) * 32) + "px";
    container.style.top = creature.location.y - (64) + "px";

    for(let i = 0; i < creature.targetableParts.length; i++){
        var newbtn = createTargetButton(creature.targetableParts[i]);
        newbtn.onclick = (  function() { 
            creatureThatClicked.targeted = creature.targetableParts[i][0];
            console.log(`${creatureThatClicked.name} targets ${creature.name}'s ${creature.targetableParts[i][0]}`);
            document.getElementById("main").removeChild(document.getElementById(idName)); 
        });
        container.append(newbtn);
    }

    document.getElementById("main").append(container);
}

/**
 * Create a button with a target image
 * @param {mob_part} part The body part
 * @returns {HTMLButtonElement} HTMLButton
 */
export function createTargetButton(part){
    var newbtn = document.createElement("button");
    newbtn.style.padding = "32px 32px";
    newbtn.style.backgroundColor = "Transparent";
    newbtn.style.display = "inline-block";
    newbtn.style.border = "none";
    newbtn.style.cursor = "pointer";
    newbtn.style.outline = "inherit";
    newbtn.style.backgroundImage = `url(${part[1].imageFolder + part[1].image})`;
    return newbtn;
}

/**
 * Container for the target menu
 */
export function createTargetContainer(){
    var container = document.createElement("div");
    container.className = "fadein";
    container.style.zIndex = 12;
    container.style.position = "absolute";
    container.style.padding = 0;
    return container;
}

/**
 * Building UI for materials
 */ 
export function buildMenu(htmlArr){
    if(document.getElementById('menuDiv')){
        document.getElementById('menuDiv').remove();
    }

    // Container for all elements ------
    var divMover = document.createElement("div");
    divMover.id = "menuDiv";
    divMover.style.position = 'absolute';
    divMover.style.zIndex = 10;
    // ---------------------------------

    // Header title and the drag element ------
    var divMoverHeader = document.createElement("div");
    divMoverHeader.id = "menuDivHeader";
    divMoverHeader.style.zIndex = 11;
    divMoverHeader.style.padding = '10px';
    divMoverHeader.innerHTML = "Mover";
    // ----------------------------------------

    //Close command ------
    var closeBtn = document.createElement("button");
    closeBtn.innerHTML = "X";
    closeBtn.onclick = (function() {document.getElementById("main").removeChild(divMover);});
    // -------------------

    divMoverHeader.append(closeBtn);
    divMover.append(divMoverHeader);

    // All build buttons are added ---------
    for(var i = 0; i < htmlArr.length; i++){
        divMover.append(htmlArr[i]);
    }
    // -------------------------------------

    document.getElementById('main').append(divMover);
    dragElement(document.getElementById('menuDiv'));
}

//The progress bar for building
export function buildingBar(creature){
    let buildingBarCanvas = document.createElement('canvas');
    buildingBarCanvas.width = 64;
    buildingBarCanvas.height = 15;
    buildingBarCanvas.className = 'progressBar';
    buildingBarCanvas.style.top = (creature.location.y - 15) + "px";
    buildingBarCanvas.style.left = creature.location.x + "px";
    document.getElementById('main').append(buildingBarCanvas);
    return buildingBarCanvas;
}

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "Header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "Header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}