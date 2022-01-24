
import { path } from "../Global/path.js";
import { Component } from "./component.js";

export class Inventory_Slot extends Component{

    /**
     * Inventory slot, used to hold items
     * @param {Object} objectHolder 
     * @param {boolean} isUsed 
     */
    constructor(objectHolder = null, isUsed = false){
        super();

        this.objectHolder = objectHolder;
        this.isUsed = isUsed;

        this.image = 'inv.png';
        this.imageFolder = path + '/Images/';

        this.orginalImage = this.image;
        this.orginalImageFolder = this.imageFolder;
    }

    event(component, invArr){
        if(component.constructor.name === "Hand" && component.item !== null && this.objectHolder === null && this.isUsed === false){
            
            var locationArr = [];
            var isLocationFound = false;

            var hasSpace = true;

            var searchMaxX = null;
            var searchMaxY = null;
            var searchMinX = null;
            var searchMinY = null;
            
            for(let i = 0; i < invArr.length; i++){
                for(let j = 0; j < invArr[i].length; j++){
                    if((invArr[i][j] === this || (((i >= searchMinX && i <= searchMaxX) && (j >= searchMinY && j <= searchMaxY)) && isLocationFound)) && invArr[i][j].isUsed === false){
                        if(isLocationFound === false){
                            searchMinX = i;
                            searchMinY = j;
                            searchMaxX = i+component.item.inventorySizeX-1;
                            searchMaxY = j+component.item.inventorySizeY-1;
                            isLocationFound = true;
                            // console.log(`[${searchMinX}] [${searchMinY}] | [${searchMaxX}] [${searchMaxY}]`);
                        }
                        locationArr.push(`${i}|${j}`);
                    }

                    if(searchMaxX >= invArr.length || searchMaxY >= invArr[i].length || ((invArr[i][j] === this || (((i >= searchMinX && i <= searchMaxX) && (j >= searchMinY && j <= searchMaxY)) && isLocationFound)) && invArr[i][j].isUsed === true) ){
                        hasSpace = false;
                        break;
                    }
                }
            }
            // console.log(locationArr);

            var locX = 0;
            var locY = 0;

            if(hasSpace === true){
                
                locX = parseInt(locationArr[0].split("|")[0]);
                locY = parseInt(locationArr[0].split("|")[1]);

                //Set the very first Inv component to the items image and enlarge it accordingly
                invArr[locX][locY].image = component.item.image;
                invArr[locX][locY].imageFolder = component.item.imageFolder;
                invArr[locX][locY].size_x = 64 * component.item.inventorySizeX;
                invArr[locX][locY].size_y = 64 * component.item.inventorySizeY;
                invArr[locX][locY].needsUpdating = true;

                for(var i = 0; i < locationArr.length; i++){
                    locX = parseInt(locationArr[i].split("|")[0]);
                    locY = parseInt(locationArr[i].split("|")[1]);

                    //Set all the slots as having a ref to the object and flag it as used
                    invArr[locX][locY].isUsed = true;
                    invArr[locX][locY].objectHolder = component.item;
                }

                //Remove the ref in the hand component and move its location and ref to the inventory
                component.item.ctx.clearRect(component.item.location.x,component.item.location.y,component.item.size_x,component.item.size_y);
                this.objectHolder = component.item;
                component.item.location = {x: this.location.x, y: this.location.y};
                component.item.needsUpdating = true;
                component.item = null;
            }
        }
    }

    removeObjectFromInv(object, invArr){
        for(let i = 0; i < invArr.length; i++){
            for(let j = 0; j < invArr[i].length; j++){
                if(invArr[i][j].objectHolder === object){
                    invArr[i][j].image = invArr[i][j].orginalImage;
                    invArr[i][j].imageFolder = invArr[i][j].orginalImageFolder;
                    invArr[i][j].size_x = 64;
                    invArr[i][j].size_y = 64;
                    invArr[i][j].isUsed = false;
                    invArr[i][j].objectHolder = null;
                    invArr[i][j].needsUpdating = true;
                }
            }
        }
    }

    clickEvent(){
        console.log(this.objectHolder);
    }
}