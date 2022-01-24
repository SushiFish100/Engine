

import {LAYER} from '../Layer.js';
import { Objects } from '../../../Objects/Objects.js';
import { path } from '../../path.js';

export class Area extends Objects{

    /**
     * Every individual tile has an area object assigned to it, and these area objects handle what 
     * is going on, for example: is the area on fire? is the area deadly to walk on? etc...
     * @param {*} name name of the area
     * @param {*} image image of the area
     * @param {*} imageFolder image foler location of the area
     * @param {*} layer layer of the area | SHOULD BE LAYER.AREA
     */
    constructor(name = "Area", image = "null.png", imageFolder = (path + '/Images/'), layer = LAYER.AREA){
        super();

        this.name = name;
        this.image = image;
        this.imageFolder = imageFolder;
        this.layer = layer;
        this.density = false;

        this.size_x = 64;
        this.size_y = 64;

    }

}