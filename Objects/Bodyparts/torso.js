

import { mob_part } from "./mob_part.js";

export class Torso extends mob_part{

    /**
     * Torso of creatures.
     * @property {array} organ_container | Contains an array of organs inside the torso
     */
    constructor(organ_container = []){
        super();

        this.organ_container = organ_container;
    }

    /**
     * Tries to find 
     * @param {*} str Name of the organ
     */
    findOrgan(str){
        for(var i = 0; i < this.organ_container.length; i++){
            if(this.organ_container[i] === str){return this.organ_container[i]}
        }
    }

    /**
     * Used when the torso gets absolutly obliterated, all organs spill out
     */
    explode(){
        for(var i = 0; i < this.organ_container.length; i++){
            this.organ_container[i].create(this.location);
            this.organ_container.splice(i, 1);
        }
    }
}