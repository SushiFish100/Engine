

import { mob_part } from "./mob_part.js";

export class Head extends mob_part{

    /**
     * Head object
     * @param {*} organ_container | Organs inside the head
     */
    constructor(organ_container = []){
        super();

        this.organ_container = organ_container;
    }
}