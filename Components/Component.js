
import { data } from "../Data/data.js";

export class Component extends data{

    constructor(){
        super();

        this.grandParent = "component";
    }

    clickObj(mouseObj){
        if((mouseObj.x - this.location.x) > 0 && (mouseObj.x - this.location.x) < 64 && (mouseObj.y - this.location.y) > 0 && (mouseObj.y - this.location.y) < 64){
            this.clickEvent(); //Calls clickEvent which can be overridden in other objects to do special things
        }
    }

    rightClickObj(mouseObj){
        if((mouseObj.x - this.location.x) > 0 && (mouseObj.x - this.location.x) < 64 && (mouseObj.y - this.location.y) > 0 && (mouseObj.y - this.location.y) < 64){
            return this;
        }
        return null;
    }

    clickEvent(){
        return; //Do Something
    }

    event(){
        return;
    }
}