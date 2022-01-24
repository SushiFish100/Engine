
import { LAYER } from "../../Global/Map/Layer.js";
import { path } from "../../Global/path.js";
import { allEngineObjects } from "../../scripts.js";
import { Structure } from "../Structure.js";

export class door extends Structure{
    
    /**
     * @param {Boolean} isLocked 
     * @param {Boolean} isForceable
     * @param {Audio} closeSound
     * @param {Audio} openSound
     * @param {String} closeImage
     * @param {String} openImage
     */

    constructor(){
        super();

        this.name = "door";
        this.imageFolder = path + '/Images/Objects/Structures/Doors/';
        this.image = 'default_door.png';
        this.layer = 3;

        //new variables
        this.isLocked = false;
        this.isForceable = true;
        this.closeSound = new Audio(path + '/Sound/obj/structure/wood_door_close.wav');
        this.openSound = new Audio(path + '/Sound/obj/structure/wood_door_open.wav');

        this.closeImage = "default_door.png";
        this.openImage = "default_door_open.png";

        this.currentIntegrity = 200;
        this.maxIntegrity = 200;

        this.interactCooldown = 300;

        this.buildTime = 40; // in deciseconds
    }

    attackEvent(creature = null){
        if(creature === null){return;}
        super.attackEvent(creature);
        
        if(this.isLocked){
        console.log("door is locked");

        if(creature.constructor.name.toLowerCase() === "humanoid"){
            let curHand = creature.getSelectedHand();

            if(curHand.item === null){ return; }

            if(curHand.item.hasOwnProperty('toolType') === true && this.isForceable === true){
                if(curHand.item.toolType === 'crowbar'){
                    //Timer?
                    //Forcing sound
                    this.openDoor();
                    this.isLocked = false;
                }
            }
        }

        return;
        }
    }

    interactEvent(){
        if(super.interactEvent() === false){return;}

        if(!this.isLocked){
            if(!this.density){
                for(var i = 0; i < allEngineObjects.length; i++){
                    if(allEngineObjects[i] !== this && allEngineObjects[i].location.x === this.location.x && allEngineObjects[i].location.y === this.location.y && allEngineObjects[i].layer !== LAYER.AREA){
                        return;
                    }
                }
                this.closeDoor();
            }else if(this.density){
                this.openDoor();
            }
        }
    }

    closeDoor(){
        this.image = this.closeImage;
        this.density = true;
        this.needsUpdating = true;
        this.closeSound.play();
        //var tone = 1 - (Math.random() * 0.90).toFixed(1);
    }

    openDoor(){
        this.image = this.openImage;
        this.density = false;
        this.needsUpdating = true;
        this.openSound.play();
    }

}

export class iron_door extends door{
    constructor(){
        super();

        this.name = "Iron Door";
        this.imageFolder = path + '/Images/Objects/Structures/Doors/';
        this.image = 'iron_door.png';

        this.closeSound = new Audio(path + '/Sound/obj/structure/wood_door_close.wav');
        this.openSound = new Audio(path + '/Sound/obj/structure/wood_door_open.wav');

        this.closeImage = "iron_door.png";
        this.openImage = "iron_door_open.png";

        this.isForceable = false;

        this.currentIntegrity = 400;
        this.maxIntegrity = 400;
    }
}