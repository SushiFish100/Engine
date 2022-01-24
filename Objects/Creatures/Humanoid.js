

import { Hand } from "../../Components/Hand.js";
import { path } from "../../Global/path.js";
import { allEngineObjects } from "../../scripts.js";
import { Creature } from "../Creature.js";
import { buildingBar } from "../../UI/UI.js";
import { INTENT } from "../../Global/intent.js";
import { Objects } from "../Objects.js";
import { Material } from "../Items/Materials/material.js";
import { Torso } from "../Bodyparts/torso.js";
import { Head } from "../Bodyparts/head.js";
import { mob_part } from "../Bodyparts/mob_part.js";

export class Humanoid extends Creature{
    
    /**
     * @param {Head} head
     * @param {Torso} torso
     * 
     * @param {mob_part} leftLeg
     * @param {mob_part} rightLeg
     * @param {mob_part} leftFoot
     * @param {mob_part} rightFoot
     * 
     * @param {Hand} leftHand 
     * @param {Hand} rightHand 
     * @param {mob_part} leftArm
     * @param {mob_part} rightArm
     * 
     * @param {boolean} isThrowing
     * 
     * @param {String} selectedHand
     */

    constructor(anatomy){
        super(anatomy);

        this.leftHand = new Hand().init("Left Hand", this);
        this.rightHand = new Hand().init("Right Hand", this);

        this.rightArm = new mob_part();
        this.leftArm = new mob_part();

        this.rightLeg = new mob_part();
        this.leftLeg = new mob_part();

        this.rightFoot = new mob_part();
        this.leftFoot = new mob_part();

        this.torso = new Torso();
        this.head = new Head();

        this.selectedHand = "left";

        this.isThrowing = false;

        this.getSelectedHand().image = "selectedLeftHand.png";
        this.getSelectedHand().needsUpdating = true;

        //All the targetable parts
        this.targetableParts = [["left hand", this.leftHand],["right hand", this.rightHand], ["right arm",this.rightArm],["left arm",this.leftArm],
                                ["right leg",this.rightLeg],["left leg",this.leftLeg], ["right foot",this.rightFoot],["left foot",this.leftFoot],
                                ["torso",this.torso],["head",this.head]];
    }

    /**
     * Switch the active hand
     */
    switchHand(){
        if(this.selectedHand.toLowerCase() === "left"){
            this.getSelectedHand().switchToOriginalImage();
            this.selectedHand = "right";
            this.getSelectedHand().switchToActiveImage();
        }else if(this.selectedHand.toLowerCase() === "right"){
            this.getSelectedHand().switchToOriginalImage();
            this.selectedHand = "left";
            this.getSelectedHand().switchToActiveImage();
        }
    }

    /**
     * Returns the active hand object
     * @returns {Hand}
     */
    getSelectedHand(){
        if(this.selectedHand.toLowerCase() === "left"){
            return this.leftHand;
        }else if(this.selectedHand.toLowerCase() === "right"){
            return this.rightHand;
        }
        return null;
    }

    /**
     * initiates hand objects
     */
    initHands(){
        this.leftHand = new Hand();
        this.leftHand.name = "Left Hand";
        this.leftHand.image = 'left_hand.png';
        this.leftHand.imageFolder = path + '/Images/';
        this.leftHand.originalImage = 'left_hand.png';
        this.leftHand.originalImageFolder = path + '/Images/';
        this.leftHand.activeImage = "selectedLeftHand.png";
        this.leftHand.activeImageFolder = path + '/Images/';
        this.leftHand.belongsTo = this;
        this.leftHand.needsUpdating = true;
        
        this.rightHand = new Hand();
        this.rightHand.name = "Right Hand";
        this.rightHand.image = 'right_hand.png';
        this.rightHand.imageFolder = path + '/Images/';
        this.rightHand.originalImage = 'right_hand.png';
        this.rightHand.originalImageFolder = path + '/Images/';
        this.rightHand.activeImage = "selectedRightHand.png";
        this.rightHand.activeImageFolder = path + '/Images/';
        this.rightHand.belongsTo = this;
        this.rightHand.needsUpdating = true;
    }

    /**
     * Essentially uses the mouse click to see what is being clicked on in a 1 tile radius around the humanoid
     * TODO: Allow the radius to be increased for special cases
     * @param {*} mouseObj The mouse click of the controller
     */
    clickObj(mouseObj){
        //humanoids can interact with objects and items
        if((mouseObj.x - this.location.x) > -64 && (mouseObj.x - this.location.x) < 128 && (mouseObj.y - this.location.y) > -64 && (mouseObj.y - this.location.y) < 128){
            // console.log("creature interact range");
            for(let i = 0; i < allEngineObjects.length; i++){
                if((mouseObj.x - allEngineObjects[i].location.x) > 0 && (mouseObj.x - allEngineObjects[i].location.x) < 64 && 
                    (mouseObj.y - allEngineObjects[i].location.y) > 0 && (mouseObj.y - allEngineObjects[i].location.y) < 64){

                    if(allEngineObjects[i].grandParent === "object" && allEngineObjects[i] !== null){
                        allEngineObjects[i].clickEvent(this); //Clicked on an object within the range of interacting
                    }else if(allEngineObjects[i].grandParent === "item" && this.getSelectedHand().item === null){

                        let curHand = this.getSelectedHand();
                        
                        if(allEngineObjects[i].ctx !== null){
                            allEngineObjects[i].ctx.clearRect(allEngineObjects[i].location.x,allEngineObjects[i].location.y,allEngineObjects[i].size_x,allEngineObjects[i].size_y);

                            for(var x = 0; x < allEngineObjects.length; x++){
                                if(allEngineObjects[x].grandParent === "item" 
                                && allEngineObjects[x] !== allEngineObjects[i].item 
                                && allEngineObjects[x].location.x === allEngineObjects[i].location.x 
                                && allEngineObjects[x].location.y === allEngineObjects[i].location.y)
                                {
                                    allEngineObjects[x].drawWithoutClearing(allEngineObjects[x].ctx);
                                }
                            }
                        }

                        //pick up
                        console.log("you pick up the "+ allEngineObjects[i].name);
                        curHand.item = allEngineObjects[i];
                        // curHand.setOverlay([`${path + curHand.imageFolder + curHand.image}`,`${curHand.item.imageFolder}${curHand.item.image}`]);
                        allEngineObjects[i].location = {x: curHand.location.x, y: curHand.location.y};
                        allEngineObjects[i].needsUpdating = true;
                        return;
                    }else if(allEngineObjects[i].grandParent === "creature"){
                        if(this.getSelectedHand().item !== null){
                            this.attack(allEngineObjects[i], this.getSelectedHand().item);
                        }else if(this.intent === INTENT.HARM){
                            this.attack(allEngineObjects[i]);
                        }
                        return; //stops from multi attacking at once (if a creature is on top of another, this stops it from attacking both)
                    }else if(allEngineObjects[i].grandParent === "decal"){
                        allEngineObjects[i].clickEvent(this);
                    }

                }
            }
        }
    }

    /**
     * Drop what is in the active hand
     */
    drop(){
        var hand = this.getSelectedHand();

        if(hand.item === null){
            return;
        }else if(this.isMoving === false){
            hand.item.ctx.clearRect(hand.item.location.x,hand.item.location.y,hand.item.size_x,hand.item.size_y);
            hand.item.location = {x: this.location.x, y: this.location.y};
            hand.item.needsUpdating = true;
            hand.emptyHand();
        }
    }

    /**
     * Lets a humanoid create an object with materials
     * @param {Objects} obj The object trying to be created
     * @param {number} amountNeeded The amount of materials needed to create the object
     * @param {Humanoid} creature The creature creating the object
     * @param {Material} material Material being used to make the object
     * @return {Objects} object
     */
    createObject(obj,amountNeeded,creature,material){
        var newObj = document.createElement('button');
        var intervalsNum = 0;
        var progressCanvas = null;

        //The function inside the html button
        newObj.onclick = (  function() { 

            if(!(material === creature.leftHand.item || material === creature.rightHand.item) || material.stackSize < amountNeeded){
                console.log("You dont have the materials to make a "+obj.name);
                return;
            }else if(creature.isOccupied === true){
                console.log("Cannot do that, busy building...");
                return;
            }

            var originalPos = {x: creature.location.x, y: creature.location.y};
            creature.isOccupied = true;

            var curInt = setInterval(() => { 
                intervalsNum++;

                switch(intervalsNum){
                    case 1: {
                        progressCanvas = buildingBar(creature);
                        for(var i = 0; i < allEngineObjects.length; i++){
                            if(creature.location.x === allEngineObjects[i].location.x && creature.location.y === allEngineObjects[i].location.y && allEngineObjects[i].layer === 3){
                                console.log("Something is in the way");
                                intervalsNum = 0;
                                clearInterval(curInt);
                                document.getElementById('main').removeChild(progressCanvas);
                                creature.isOccupied = false;
                            }
                        }
                        break;
                    }
                    case obj.buildTime: {
                        if(creature.isMoving === false){
                            obj.create({x: creature.location.x, y: creature.location.y});
                            material.stackSize -= amountNeeded;
                            if(material.stackSize <= 0){ 
                                material.destroy();
                                if(creature.leftHand.item === material){ creature.leftHand.emptyHand(); }
                                if(creature.rightHand.item === material){ creature.rightHand.emptyHand(); }
                            }
                        }

                        intervalsNum = 0;
                        clearInterval(curInt);
                        document.getElementById('main').removeChild(progressCanvas);
                        creature.isOccupied = false;
                        break;
                    }
                }

                //progress bar
                progressCanvas.getContext('2d').beginPath();
                progressCanvas.getContext('2d').fillStyle = "#00ff2f";
                progressCanvas.getContext('2d').fillRect(0,0,((intervalsNum / obj.buildTime) * 64), 15);
                progressCanvas.getContext('2d').stroke();

                //If the material is dropped or the creature moved, stop building
                if(creature.location.x !== originalPos.x || creature.location.y !== originalPos.y || !(material === creature.leftHand.item || material === creature.rightHand.item)){
                    console.log("Building canceled");
                    intervalsNum = 0;
                    clearInterval(curInt);
                    document.getElementById('main').removeChild(progressCanvas);
                    creature.isOccupied = false;
                }

            }, 100);
        });

        newObj.innerHTML = (obj.name) + "(" + (amountNeeded)+ ")";
        return newObj;
    }
}


