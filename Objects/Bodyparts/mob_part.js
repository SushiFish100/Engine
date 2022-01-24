

import { Item } from "../Item.js";
import { path } from "../../Global/path.js"

export class mob_part extends Item{

    /**
     * Mob part/limbs base class for complex creatures
     * @param {*} composition 
     * @param {*} isBleeding 
     */
    constructor(composition = "ORAGANIC", isBleeding = false){
        super();
        
        this.currentIntegrity = 100;
        this.maxIntegrity = 100;
        this.image = "default.png";
        this.imageFolder = path + "/Images/Creatures/Limbs/";
        
        this.composition = composition;
        this.isBleeding = isBleeding;
    }

}