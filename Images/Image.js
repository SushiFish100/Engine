import { Objects } from "../Objects/Objects.js";


export class Img extends Objects{

    /**
     * Image file for any type of object
     * @param {*} image 
     * @param {*} imageFolder
     * @param {*} location 
     * @param {*} size_x 
     * @param {*} size_y 
     * @param {*} isSelected 
     */

    constructor(image = "null.png",imageFolder = "",location = {x:null,y:null},size_x,size_y,isClicked = false){
        super();

        this.image = image;
        this.imageFolder = imageFolder;
        this.location = location;
        this.size_x = size_x;
        this.size_y = size_y;
        this.isClicked = isClicked;
        
    }
} 