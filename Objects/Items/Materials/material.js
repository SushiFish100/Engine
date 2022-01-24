
import { LAYER } from "../../../Global/Map/Layer.js";
import { path } from "../../../Global/path.js";
import { buildMenu } from "../../../UI/UI.js";
import { Item } from "../../Item.js";
import { door } from "../../Structures/door.js";
import { Bronze_Crowbar, Crowbar } from "../Tool/crowbar.js";

export class Material extends Item{

    /**
     * @param {Number} stackSize
     * @param {Number} stackSizeMax
     * @param {String} materialType
     * @param {Array} buildArr
     */

    constructor(){
        super();

        this.name = "material";
        this.imageFolder = path + '/Images/Materials/';
        this.image = 'materials.png';
        this.density = false;
        this.layer = LAYER.GROUND;

        this.stackSize = 0;
        this.stackSizeMax = 20;
        this.materialType = null;
        this.buildArr = [];

        this.inventorySizeX = 2;
        this.inventorySizeY = 2;
    }

    buildInit(){
        return;
    }
} 

export class Wood extends Material{

    constructor(){
        super();

        this.name = 'wood';
        this.materialType = 'wood';
        this.image = 'wood.png';

        this.stackSize = 20;
    }

    buildInit(creature){
        let arr = [];
        arr.push(creature.createObject(new door(), 10, creature, this));
        return arr;
    }

    clickEvent(creature){
        buildMenu(this.buildInit(creature));
    }
}

export class Bronze_Bar extends Material{
    constructor(){
        super();

        this.name = "bronze bar";
        this.materialType = "bronze";
        this.image = 'bronze_bar.png';

        this.stackSize = 20;
    }

    buildInit(creature){
        let arr = [];
        arr.push(creature.createObject(new Bronze_Crowbar(), 10, creature, this));
        return arr;
    }

    clickEvent(creature){
        buildMenu(this.buildInit(creature));
    }
}