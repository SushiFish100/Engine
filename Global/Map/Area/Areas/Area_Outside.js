import { Area } from "../Area.js";


export class outside extends Area{
    constructor(){
        super();

        super.name = "Outside";
        super.image = "outside.png";
        super.imageFolder = "./Images/Area/";
    }
}