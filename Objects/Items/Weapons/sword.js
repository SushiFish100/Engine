import { path } from "../../../Global/path.js";
import { Item } from "../../Item.js";


export class Sword extends Item{

    constructor(){
        super();

        this.name = "Sword";
        this.image = "steel_sword.png";
        this.imageFolder = path + "/Images/Objects/Items/Weapons/";
        this.mass = 4;
        this.velocity = 30;
        this.damageType = "SHARP";
        this.attackSpeed = 750;

        this.inventorySizeX = 1;
        this.inventorySizeY = 4;
    }
}