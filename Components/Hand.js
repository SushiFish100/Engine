
import { path } from "../Global/path.js";
import { allEngineObjects, mapLayerArr } from "../scripts.js";
import { Component } from "./component.js";

export class Hand extends Component{

    /**
     * @param item Item held in hand
     * 
     * @param originalImage
     * @param originalImageFolder
     * @param activeImage
     * @param activeImageFolder
     * @param belongsTo Creature
     */

    constructor(){
        super();

        this.item = null;
        this.originalImage = null;
        this.originalImageFolder = null;
        this.activeImage = null;
        this.activeImageFolder = null;
        this.belongsTo = null;

        this.currentIntegrity = 100;
        this.maxIntegrity = 100;
        this.isBleeding = false;
        this.composition = "ORGANIC";

    }

    /**
     * Initiate hand object with the given name of the hand
     * @param {str} handNameStr Name of the hand. Example: "Left Hand", "Right Hand"
     * @param {creature} creature Creature who is using the hand
     * @returns {Hand} Hand object
     */
    init(handNameStr, creature){
        this.name = handNameStr;
        this.image = (handNameStr.replace(/\s+/g, '')) + '.png';
        this.imageFolder = path + '/Images/';
        this.originalImage = (handNameStr.replace(/\s+/g, '')) + '.png';
        this.originalImageFolder = path + '/Images/';
        this.activeImage = "selected"+ (handNameStr.replace(/\s+/g, '')) + ".png";
        this.activeImageFolder = path + '/Images/';
        this.belongsTo = creature;
        this.needsUpdating = true;
        return this;
    }

    /**
     * When the hand is clicked, the items click event is activated.
     */
    clickEvent(){
        if(!this.item){return;}
        this.item.clickEvent(this.belongsTo);
        return;
    }

    /**
     * Forces the item in hand to be dropped on the ground
     */
    emptyHand(){
        this.item.ctx.clearRect(this.item.location.x-this.item.velocityX,this.item.location.y-this.item.velocityY,this.item.size_x,this.item.size_y);
        this.item.needsUpdating = true;

        this.item = null;
    }

    /**
     * Switches the image of the hand UI to its original image to indicate its not the active hand.
     */
    switchToOriginalImage(){
        this.image = this.originalImage;
        this.imageFolder = this.originalImageFolder;
        this.needsUpdating = true;
    }

    /**
     * Switches the image for the hand UI to indicate to the user which hand is being used.
     */
    switchToActiveImage(){
        this.image = this.activeImage;
        this.imageFolder = this.activeImageFolder;
        this.needsUpdating = true;
    }

    event(component, creature, invArr){
        if(component.constructor.name !== "Inventory_Slot" || creature.constructor.name !== "Humanoid") {return;}

        if(component.objectHolder && !this.item){
            // console.log("Inventory has an item and hand is empty");

            //Take the ref from the inventory and place it into the hand then remove the object and any ref to it in the inventory
            this.item = component.objectHolder;
            component.objectHolder.location = {x: this.location.x, y: this.location.y};
            component.objectHolder.needsUpdating = true;
            component.removeObjectFromInv(this.item, invArr);
        }
    }
}