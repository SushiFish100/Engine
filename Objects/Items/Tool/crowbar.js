

import { path } from "../../../Global/path.js";
import { Tool } from "../tool.js";

export class Crowbar extends Tool{

    constructor(){
        super("crowbar");

        this.name = "crowbar";
        this.image = "crowbar.png";
        this.imageFolder = path + "/Images/Objects/";
        this.mass = 3;
        this.velocity = 20;

        this.clickAreaX = {min: 0, max: 64};
        this.clickAreaY = {min: 0, max: 64};

        this.inventorySizeX = 1;
        this.inventorySizeY = 3;
    }

}

export class Bronze_Crowbar extends Crowbar{
    
    constructor(){
        super();
        
        this.name = "bronze crowbar";
        this.image = "bronze_crowbar.png";
    }
}