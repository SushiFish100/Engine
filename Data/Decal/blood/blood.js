
import { decal } from "../decal.js";
import { path } from "../../../Global/path.js";
import { contextArr } from "../../../scripts.js";
import { Bronze_Bar } from "../../../Objects/Items/Materials/material.js";

export class red_blood_decal extends decal{

    constructor(){
        super();

        this.name = "";
        this.image = this.randomBloodDecal();
        this.imageFolder = path + "/Images/";
        this.ctx = contextArr[1];

        //New data members:
        this.isCleaned = false;
    }

    draw(ctx){
        var self = this;
        var i = new Image();

        i.onload = function(){

            if(self.isCleaned === true){
                ctx.clearRect(self.location.x, self.location.y, self.size_x, self.size_y);
            }
            
            if(self.visibility !== 100 && self.visibility < 100){ctx.globalAlpha = self.visibility / 100};
            if(self.rotation !== 0 && self.isRotating === false){ self.rotate(self.rotation); self.rotation = 0;}
            if(self.isRotating === true && self.boolRotatingInterval === false){ self.rotateConstant(); }

            ctx.drawImage(i, self.location.x, self.location.y, self.size_x, self.size_y);
        }

        i.src = this.src();

        this.htmlImage = i;
    }

    randomBloodDecal(){
        switch(((Math.floor(Math.random() * 3)) + 1)){
            case 1: return "blood1.png";
            case 2: return "blood2.png";
            case 3: return "blood3.png";
        }
    }

    clickEvent(creature = null){
        if(creature !== null){
            this.clean(creature.getSelectedHand().item);
        }
    }

    clean(item){
        if(item === null){
            return;
        }

        if(item.constructor.name === "Bronze_Bar"){
            this.isCleaned = true;
            this.destroy();
        }
    }
}