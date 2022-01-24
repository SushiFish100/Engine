
//const Obj = require("./Objects.js");

import {Objects} from './Objects.js';
import { LAYER } from '../Global/Map/Layer.js';
import { path } from '../Global/path.js';

//const C = require("./Creature.js");

export class Item extends Objects{

    /**
     * 
     * @param {string} name Items name.
     * @param {string} image Items image.
     * @param {number} condition The current strength of the item. Defaults to maxcondition if null.
     *                               Example: If the item is a rock and had a state of 10 then you bash it on hard surface,
     *                                        the condition would go down, and if it reached a state of 0 the item breaks.
     * @param {number} maxCondition The max strength of the object. Defaults to 100
     * @param {string} damageType The type of damage done when hitting with this item. Default: BLUNT 
     * @param {number} sharpness How sharp the object is. Default 0, meaning it is blunt
     * @param {number} reach How many tiles can it reach. Default: 1 tile
     * @param {number} mass How much it weights. In pounds (lbs). Default 1 lbs
     * @param {number} velocity The velocity of the item, 3 is default velocity, the higher the value the faster. (m/s Metre per second)
     * @param {number} penetration Penetration of the item, the higher the value the more penetration. Default: 0
     * @param {number} size Size of the item, used when storing items. Default: 10 units (Acts as volumn basically)
     * 
     * @param materialsArr Array of materials that it is composed of. The same Array will be used when dismantaled.
     * @param itemFlags Array of flags the item has. Example: FIRE_PROOF, EXPLOSION_PROOF etc...
     * 
     * @param {number} throwRange How far the item can be thrown. (In tiles)
     * @param throwForceMultiplier Mutliplies the force applied when hitting something with the item
     * 
     * @param heatResistanceArr Array of BodyParts the item protects against. Example: HEAD, EYES, LEFT_ARM, ect...
     * @param {number} heatResistanceTemp The heat temprature the item is protect from. In Kelvin (K)
     * @param coldResistanceArr
     * @param {number} coldResistanceTemp 
     * 
     * @param {number} thickness in millimeters.
     * @param {number} attackSurfacePerimeter in millimeters. Depending on what kind of surface rectangle:(length * width) circle:(2πr) etc...
     * 
     * @param {Audio} attackSound
     * @param {number} attackSpeed in Milliseconds 
     */
    constructor(name = null, image = null, imageFolder = (path + '/Images/'), layer = LAYER.OBJECT, grandParent = "item", condition = null, 
                maxCondition = 100, damageType = "BLUNT", sharpness = 0, reach = 1, mass = 0.1, velocity = 1, penetration = 0, size = 10, 
                materialsArr = null, itemFlags = null, throwRange = 4, throwForceMultiplier = 0, heatResistanceArr = null, heatResistanceTemp = null,
                coldResistanceArr = null, coldResistanceTemp = null, thickness = 1, attackSurfacePerimeter = 100, attackSound = (path + '/Sound/obj/default_swing2.ogg'),
                attackSpeed = 800){

        super();

        if(name != null){this.name = name;}
        if(image != null){this.image = image;}
        if(imageFolder != null){this.imageFolder = imageFolder;}
        if(layer != null){this.layer = layer;}
        if(condition = null){this.condition = maxCondition;}

        this.maxCondition = maxCondition;
        this.damageType = damageType;
        this.sharpness = sharpness;
        this.reach = reach;
        this.mass = mass;
        this.velocity = velocity;
        this.penetration = penetration;

        //Default 10 units.
        this.size = size;

        //Default null, containing no materials thus no item flags
        this.materialsArr = materialsArr;
        this.itemFlags = itemFlags

        //Default throw range is 4 tiles and with no Multiplier
        this.throwRange = throwRange;
        this.throwForceMultiplier = throwForceMultiplier;

        //Default to null, meaning there is no protection against these elements
        this.heatResistanceArr = heatResistanceArr;
        this.heatResistanceTemp = heatResistanceTemp;
        this.coldResistanceArr = coldResistanceArr;
        this.coldResistanceTemp = coldResistanceTemp;

        //Thickness of the item
        this.thickness = thickness;

        //The perimeter of the surface used to attack with
        this.attackSurfacePerimeter = attackSurfacePerimeter;

        this.grandParent = grandParent;

        this.attackSound = attackSound;
        this.attackSpeed = attackSpeed;
    }

    /**
     * The amount of force outputted from the item. (mass * acceleration). 
     * THIS IS FOR PHYSCIAL ATTACKS. Ranged weapons would use things like bullets which would be used as the force.
     * @param {C.Creature} creature The creature using the item.
     * @returns The force of the item. (lbf - Pound-force)
     */
    attackForce(creature){ 
        if(creature.grandParent.toLowerCase() !== "creature"){return;}
        if(creature.canAttack === false){return;}

        creature.canAttack = false;
        
        //Cooldown
        setTimeout(function(){creature.canAttack = true;}, this.attackSpeed);

        if(Array.isArray(this.attackSound)){
            var randNum = (Math.floor(Math.random() * this.attackSound.length));
            new Audio(this.attackSound[randNum]).play();
        }else{
            new Audio(this.attackSound).play();
        }

        var acceleration = 0;
        var vel = this.velocity;

        //TODO RESISTANCE FLAG CHECKS VS ITEM AND CREATURE

        //Blunt weapons get a multiplyer on velocity
        if(this.damageType === "BLUNT"){
            vel = (this.velocity * 2);
        }

        //Takes twice the time
        if(creature.statusFlags.includes("SLOW")){
            acceleration = (vel / 2); //2x slower
        }else{
            acceleration = (vel / 1); //Normal
        }

        return Math.round(((this.mass / 2.2046226218) * acceleration) / 4.4482216153).toFixed(0);
    }

    /**
     * Examine Item.
     * @returns {string} Returns a string.
     */
    examine(){
        var str = this.name + ".";

        if(this.itemFlags === null || this.itemFlags.length === 0){
            return str;
        }

        if(this.itemFlags.includes("INDESTRUCTIBLE")){
            return str + " This thing seems indestructible!";
        }

        if(this.itemFlags.includes("FIRE_PROOF")){
            str+= " Seems like its fire proof.";
        }if(this.itemFlags.includes("EXPLOSION_PROOF")){
            str+= " A tag on it reads, \"Explosion Proof\".";
        }if(this.itemFlags.includes("VOID_PROOF")){
            str+= " Made from weird anti void technology.";
        }if(this.itemFlags.includes("MAGIC_PROOF")){
            str+= " Glows with a magic proof aura.";
        }if(this.itemFlags.includes("LAVA_PROOF")){
            str+= " Material seems to be lava proof grade."
        }

        return str;
    }

    /**
     * Remove a specified flag.
     * @param {*} strFlag 
     * @return {void} void
     */
    removeFlag(strFlag){
        if(this.itemFlags === null || this.itemFlags.length === 0 || !this.itemFlags.includes(strFlag)){
            return;
        }

        for(var i = 0; i < this.itemFlags.length; i++){
            if(this.itemFlags[i] === strFlag){
                delete this.itemFlags[i];
                return;
            }
        }
    }

    /**
     * Add a specified flag.
     * @param {*} strFlag 
     * @return {void} void
     */
    addFlag(strFlag){
        if(this.itemFlags === null || this.itemFlags.length === 0){
            this.itemFlags = [];
        }

        this.itemFlags[this.itemFlags.length] = strFlag;
    }

    /**
     * Interact with the item. Sub function used in sub classes of Item.
     */
    interact(){
        return;
    }


}