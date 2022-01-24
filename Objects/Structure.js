

import { INTENT } from "../Global/intent.js";
import { getPunchingForce } from "../Global/material.js";
import { path } from "../Global/path.js";
import { Objects } from "./Objects.js";

export class Structure extends Objects{

    /**
     * @param {Boolean} broken 
     * @param {Array} materials
     * @param {Audio} impactSound
     * @param {Number} interactCooldown
     * @param {Boolean} canInteract
     */
    
    constructor(){
        super();

        this.name = "Structure";
        this.imageFolder = path + '/Images/Objects/Structures/';
        this.image = 'structure.png';

        this.density = true;
        this.maxIntegrity = 500;
        this.currentIntegrity = 500;
        this.layer = 3;

        this.broken = false;
        this.material = null; //Check global/material.js for all the possible types

        this.impactSound = (path + "/Sound/obj/structure/thud.ogg");

        this.interactCooldown = 100;
        this.canInteract = true;
    }

    clickEvent(creature = null){
        if(creature === null){return;}
        
        switch(creature.intent){
            case INTENT.HARM: 
                if(creature.getSelectedHand().item === null){ this.interactEvent(creature); break;}
                this.attackEvent(creature);
                break;
            case INTENT.HELP: 
                console.log("HELP"); 
                this.interactEvent(creature);
                break;
        }
    }

    attackEvent(creature = null){
        if(creature === null || creature.canAttack === false){return;}

        var hand = creature.getSelectedHand();

        //new Audio(this.impactSound).play();
        //console.log(this.impactSound);
        this.currentIntegrity -= hand.item.attackForce(creature);
        console.log(this.currentIntegrity);
        this.checkIntegrity();

        // console.log(hand.item.velocity); 
        // console.log(hand.item.mass); 0.013

        return;
    }
    
    interactEvent(creature = null){
        var self = this;

        if(this.canInteract === false){return false;}

        this.canInteract = false;
        
        //Cooldown
        setTimeout(function(){self.canInteract = true; return true;}, self.interactCooldown);
    }
    
    toString(){
        var perc = (this.currentIntegrity / this.maxIntegrity) * 100;

        if(this.broken === true){
            return "Its broken.";
        }

        switch(true){
            case (perc <= 25): return "It could break any moment now!";
            case (perc <= 50): return "Looks really battered and beaten.";
            case (perc < 100): return "A few dents and scratches but nothing too worrying.";
        }

        return "Nice and shiney.";
    }
}