
import { Item } from "../Item.js";

export class Tool extends Item{

    /**
     * @param toolType
     */

    constructor(toolType = ""){
        super();

        this.toolType = toolType;
    }
}