import { Item } from "../../Item.js";


export class Container extends Item{

    /**
     * Container class for items that can be used as storage for liquids
     * @param {Number} volumeHoldAmount in milliliters
     * @param {Number} currentVolume in milliliters
     * @param {Array} liquids array of liquids
     */
    constructor(volumeHoldAmount = 100, currentVolume = 0, liquids = []){
        super();

        this.volumeHoldAmount = volumeHoldAmount;
        this.currentVolume = currentVolume;
        this.liquids = liquids
    }
}