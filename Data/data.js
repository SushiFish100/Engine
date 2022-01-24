
import { TILE_SIZE } from '../Global/global_vars.js';
import { path } from '../Global/path.js';
import { createUUID } from '../Global/UUID.js'
import { allEngineObjects, mapLayerArr } from '../scripts.js';

export class data{

    /**
     * @param {String} name name of the object.
     * @param {String} image the image of the object
     * @param {String} imageFolder the image folder path of the object
     * @param {Number} size_x width
     * @param {Number} size_y height
     * @param {Number} visibility 0 - 100 | the lower the value the less visibile the object
     * @param {Number} location The coords of the object [x | y]
     * @param {Array} overlay Array of images that appear on top of the original image
     * @param {Number} offset_x offset its x axis hitbox
     * @param {Number} offset_y offset its y axis hitbox
     * @param {String} uniqueID Every object that is created, even if its the same type of object has its own uniqueID
     * @param {Boolean} needsUpdating When a change is made to the image it will tick this
     * @param {CanvasRenderingContext2D} ctx The objects context canvas
     * @param {ImageData} htmlImage Displayable image of the object
     * 
     * @param {Number} velocityX speed per pixel (left and right)
     * @param {Number} velocityY speed per pixel (up and down)
     * 
     * @param {Number} rotation 0 - 180 degrees | Default is 0
     * @param {*} color default color tint is 'white' which has no effect
     * 
     * @param {String} grandParent
     * 
     */

    constructor(name = "NULL", image = "null.png", imageFolder = (path + '/Images/'), size_x = 64, size_y = 64, visibility = 100, location = {x: null,y: null}, 
    overlay = [], offset_x = 0, offset_y = 0, uniqueID = null, needsUpdating = false, ctx = null, htmlImage = null, velocityX = 0, velocityY = 0,
    rotation = 0, isRotating = false, boolRotatingInterval = false ,color = "", grandParent = "data"){
        
        this.name = name; //Name of the object
        this.image = image; //image of the object
        this.imageFolder = imageFolder; //path of the folder containing the image
        this.size_x = size_x; //x axis size of the object
        this.size_y = size_y; //y axis size of the object
        this.visibility = visibility; // 0 - 100, the lower the less visibil
        this.location = location; //location of the object (location = {x,y}) contains the x and y location of the object

        this.overlay = overlay; //Array of paths to images that you want stacked on top of the original. 
        // ---------------------- Example: You originally have a gun with no magazine in it, then when you 
        // ---------------------- put a clip into it add a visual image.

        this.offset_x = offset_x; //offsets the objects x and y axis from its original orientation
        this.offset_y = offset_y; //NOTE: THE IMAGE WILL BE CUT OFF IF THE IMAGE GOES PASS ITS SPECIFIED SIZE
        this.uniqueID = createUUID();
        this.needsUpdating = needsUpdating;
        this.htmlImage = htmlImage;

        this.velocityX = velocityX;
        this.velocityY = velocityY;

        this.rotation = rotation;

        this.isRotating = isRotating;
        this.boolRotatingInterval = boolRotatingInterval;

        this.grandParent = grandParent;
    }

    draw(ctx){
        var self = this;
        var i = new Image();

        i.onload = function(){
            ctx.clearRect(self.location.x, self.location.y, self.size_x, self.size_y);
            
            if(self.visibility !== 100 && self.visibility < 100){ctx.globalAlpha = self.visibility / 100};
            if(self.rotation !== 0 && self.isRotating === false){ self.rotate(self.rotation); self.rotation = 0;}
            if(self.isRotating === true && self.boolRotatingInterval === false){ self.rotateConstant(); }

            ctx.drawImage(i, self.location.x, self.location.y, self.size_x, self.size_y);
        }

        i.src = this.src();

        this.htmlImage = i;
    }

    update(){
        this.draw(this.ctx);
        this.needsUpdating = false;
    }

    destroy(){
        //materials it drops?
        //destroy sound

        this.name = null;
        this.density = false;
        this.imageFolder = (path + '/Images/');
        this.image = 'null.png'
        this.needsUpdating = true;

        this.delete();
    }

    delete(){
        let self = this;

        if(this.needsUpdating === true){
            setTimeout(function(){ self.delete() },20);
            return;
        }

        //Pop object from the engine then js will take care of the rest since there is no more reference to this object
        var element = allEngineObjects.indexOf(this);
        if(element >= 0){allEngineObjects.splice(element,1);}

        for(var i = 0; i < mapLayerArr.length; i++){
            for(var j = 0; j < mapLayerArr[i].length; j++){
                if(mapLayerArr[i][j] === this){
                    mapLayerArr[i].splice(j,1);
                }
            }
        }
    }

    clickObj(mouseObj){
        if((mouseObj.x - this.location.x) > 0 && (mouseObj.x - this.location.x) < 64 && (mouseObj.y - this.location.y) > 0 && (mouseObj.y - this.location.y) < 64){
            this.clickEvent(); //Calls clickEvent which can be overridden in other objects to do special things
        }
    }

    getClickedObj(mouseObj){
        if((mouseObj.x - this.location.x) > 0 && (mouseObj.x - this.location.x) < 64 && (mouseObj.y - this.location.y) > 0 && (mouseObj.y - this.location.y) < 64){
            return this;
        }
    }

    rightClickObj(mouseObj){
        if((mouseObj.x - this.location.x) > 0 && (mouseObj.x - this.location.x) < 64 && (mouseObj.y - this.location.y) > 0 && (mouseObj.y - this.location.y) < 64){
            return this;
        }
        return null;
    }

    shiftClickEvent(mouseObj){
        this.shiftClickEvent();
    }
    
    shiftClickEvent(creature = null){
        return;
    }

    //TODO inventory
    clickEvent(creature = null){
        return; //Do Something
    }

    rotate(degrees){
        if(degrees === null || degrees < 0 || degrees > 360){ return; }

        let self = this;

        let body = document.getElementById('main');
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');

        canvas.id = this.uniqueID+"_rotation";
        //canvas.className = 'overlayBuilder';
        
        //add it to the body
        body.appendChild(canvas);

        var i = new Image();

        i.src = this.src();

        i.onload = function(){
            context.globalAlpha = self.visibility / 100;
            canvas.width = self.size_x;
            canvas.height = self.size_y;
            context.clearRect(0,0,canvas.width,canvas.height);
            context.translate(this.width/2, this.height/2);
            context.rotate(Math.PI / 180 * (degrees));
            context.drawImage(i, -self.size_x/2, -self.size_y/2);
            self.image = canvas.toDataURL('image/png');
            self.imageFolder = "";
            self.needsUpdating = true;

            //garbage collector, deletes 1 millisecond after completion  
            setTimeout(function(){body.removeChild(canvas);},1);
        }
    }

    /**
     * DO NOT CALL THIS FUNCTION TO ROTATE AN OBJECT, TO ROTATE AN
     * OBJECT CALL isRotating = True; and needsUpdating = True; TO ROTATE THE OBJECT
     * AND isRotating = false; newImg.boolRotatingInterval = false; TO STOP ROTATING THE OBJECT
     * || CURRENTLY DOES NOT WORK FOR CREATURES/MOBS ||
     * @returns void.
     */
    rotateConstant(){
        this.boolRotatingInterval = true;

        let self = this;
        var degrees = 0;

        let body = document.getElementById('main');
        let canvas = document.createElement('canvas');
        canvas.width = self.size_x;
        canvas.height = self.size_y;
        let context = canvas.getContext('2d');

        canvas.id = this.uniqueID+"_rotation";
        canvas.className = 'overlayBuilder';
        
        //add it to the body
        body.appendChild(canvas);

        var i = new Image();

        i.src = this.src();
        
        i.onload = function(){
            context.globalAlpha = self.visibility / 100;
            canvas.width = self.size_x;
            canvas.height = self.size_y;
            var cache = this;
            var ref = setInterval(function () {
                context.save();
                context.clearRect(0,0,canvas.width,canvas.height);
                context.translate(cache.width/2, cache.height/2);
                context.rotate((degrees += 15) * Math.PI / 180); //Itd be cool if the speed of rotation was changed depending on how fast the object is going
                context.drawImage(i, -self.size_x/2, -self.size_y/2);
                self.image = canvas.toDataURL('image/png');
                self.imageFolder = "";
                context.restore();

                //garbage collection, not clearing intervals will cause memory leaks!
                if(self.boolRotatingInterval === false){ 
                    body.removeChild(canvas); 
                    clearInterval(ref);
                    self.needsUpdating = true;
                }else{ 
                    self.needsUpdating = true;
                }
            }, 40 );
        }
    
    }

    stopRotating(){
        this.boolRotatingInterval = false;
        this.isRotating = false;
        this.rotation = 0;
    }
    
    src(){
        return this.imageFolder +""+ this.image;
    }

    setOverlay(arrayOfImageSources){
        if(Array.isArray(arrayOfImageSources) === false){ return; }
        if(arrayOfImageSources.length === 0){ return; }

        let body = document.getElementById('main');

        /*----------------------------------------------------------------------------------
        When creating an overlay it needs its own area to paint the new image. Using
        the uuid of the object to define a canvas id will create a separate area to
        paint and send that data to the new image. Once completed the new canvas is deleted.
        ------------------------------------------------------------------------------------
        The problem with using a single canvas to paint and build is that sometimes
        another object wants to paint its overlay as well and these new images will overlap
        and sometimes create a undesired image from which was defined.
        ----------------------------------------------------------------------------------*/

        let canvas = document.createElement('canvas');
        canvas.id = this.uniqueID;
        canvas.className = 'overlayBuilder'

        //add it to the body
        body.appendChild(canvas);
        
        //set overlay
        this.overlay = arrayOfImageSources;
        this.createOverlayImage();

        let self = this;

        //garbage collector, waits a second before deleting the canvas (change it so its inside an onload function... but im too lazy rn)
        setTimeout(function(){body.removeChild(canvas)},1000); //not good but works for now
        setTimeout(function(){self.needsUpdating = true},1000); //not good but works for now
    }

    createOverlayImage(){
        if(this.overlay === null || this.overlay === undefined || this.overlay.length === 0){return;}

        for(var i = 0; i < this.overlay.length; i++){
            this.updateOverlay(this.overlay[i]);
        }
    }

    updateOverlay(imgSrc){
        var image1 = new Image();
        var image2 = new Image();
        let self = this;

        let canvas = document.getElementById(this.uniqueID);
        let context = canvas.getContext('2d');

        canvas.width = self.size_x;
        canvas.height = self.size_y;

        image1.src = this.src();

        image1.onload = function(){
            context.globalAlpha = self.visibility / 100;
            context.drawImage(image1 , self.offset_x , self.offset_y , self.size_x , self.size_y );
            image2.src = imgSrc;
            image2.onload = function(){
                context.drawImage(image2 , self.offset_x , self.offset_y , self.size_x , self.size_y );
                self.image = canvas.toDataURL('image/png');
                self.imageFolder = "";
            }
        }
    }

    toString(){
        return "I dont think you're suppose to see this.";
    }
}



// rotate(degrees){
//     if(degrees === null || degrees < 0 || degrees > 360){ return; }

//     let self = this;

//     let body = document.getElementById('main');
//     let canvas = document.createElement('canvas');
//     let context = canvas.getContext('2d');

//     canvas.id = this.uniqueID+"_rotation";
//     //canvas.className = 'overlayBuilder';
    
//     //add it to the body
//     body.appendChild(canvas);

//     canvas.width = this.size_x;
//     canvas.height = this.size_y;

//     var i = new Image();

//     i.src = this.src();

//     i.onload = function(){
//         context.globalAlpha = self.visibility / 100;

//         // if(degrees <= 180){context.translate(degrees/3,0); context.rotate(Math.PI / 360 * (degrees)); }
//         // if(degrees > 180){context.translate(degrees/4,degrees/7); context.rotate(Math.PI / 360 * (degrees)); }

//         context.translate(this.width,this.height);
//         context.rotate(Math.PI / 180 * degrees);

//         context.drawImage(i , self.offset_x , self.offset_y , self.size_x , self.size_y );
//         self.image = canvas.toDataURL('image/png');
//         self.imageFolder = "";
//     }

//     //garbage collector, waits a second before deleting the canvas (change it so its inside an onload function... but im too lazy rn)
//     //setTimeout(function(){body.removeChild(canvas)},1000); //not good but works for now
//     //setTimeout(function(){self.needsUpdating = true},1000); //not good but works for now
// }



// rotate(degrees){
//     if(degrees === null || degrees < 0 || degrees > 360){ return; }

//     let self = this;

//     let body = document.getElementById('main');
//     let canvas = document.createElement('canvas');
//     let context = canvas.getContext('2d');

//     canvas.id = this.uniqueID+"_rotation";
//     //canvas.className = 'overlayBuilder';
    
//     //add it to the body
//     body.appendChild(canvas);

//     var i = new Image();

//     i.src = this.src();

//     i.onload = function(){
//         context.globalAlpha = self.visibility / 100;
//         canvas.width = self.size_x*2;
//         canvas.height = self.size_y*2;
//         context.clearRect(0,0,canvas.width,canvas.height);
//         context.translate(this.width, this.height);
//         context.rotate(Math.PI / 180 * (degrees));
//         context.drawImage(i, -self.size_x/2, -self.size_y/2);
//         self.image = canvas.toDataURL('image/png');
//         self.imageFolder = "";
//         self.needsUpdating = true;
//     }
// }


// rotate(degrees){
//     if(degrees === null || degrees < 0 || degrees > 360){ return; }

//     let self = this;

//     let body = document.getElementById('main');
//     let canvas = document.createElement('canvas');
//     let context = canvas.getContext('2d');

//     canvas.id = this.uniqueID+"_rotation";
//     //canvas.className = 'overlayBuilder';
    
//     //add it to the body
//     body.appendChild(canvas);

//     var i = new Image();

//     i.src = this.src();

//     i.onload = function(){
//         context.globalAlpha = self.visibility / 100;
//         canvas.width = self.size_x*2;
//         canvas.height = self.size_y*2;
//         var cache = this;
//         setInterval(function () {
//             context.save();
//             context.clearRect(0,0,canvas.width,canvas.height);
//             context.translate(cache.width, cache.height);
//             context.rotate(Math.PI / 180 * (degrees += 10 ));
//             context.drawImage(i, -self.size_x/2, -self.size_y/2);
//             self.image = canvas.toDataURL('image/png');
//             self.imageFolder = "";
//             self.needsUpdating = true;
//             context.restore();
//         }, 1000 / 25 );
//     }
// }