
import { data } from '../Data/data.js';
import {DIR} from '../Global/direction_enum.js'
import { TILE_SIZE } from '../Global/global_vars.js';
import { INTENT } from '../Global/intent.js';
import {LAYER} from '../Global/Map/Layer.js'
import { path } from '../Global/path.js';
import { createUUID } from '../Global/UUID.js'
import { allEngineObjects, baseMap, mapLayerArr } from '../scripts.js';

//Named Objects because of the already existing Object element
export class Objects extends data{

    /**
     * @param {String} name name of the object.
     * @param {String} image the image of the object
     * @param {String} imageFolder the image folder path of the object
     * @param {Number} size_x width
     * @param {Number} size_y height
     * @param {HexCode} color default set to null for no color
     * @param {Number} density Does the object take up room? True or False
     * @param {Enumerator} direction direction the obj is pointing
     * @param {Number} visibility 0 - 100 | the lower the value the less visibile the object
     * @param {Enumerator} layer enum layer value
     * @param {Number} location The coords of the object [location.x | location.y]
     * @param {*} lighting how far does the object light
     * @param {*} isOpaque true or false
     * @param {Array} overlay Array of images that appear on top of the original image
     * @param {Number} offset_x offset its x axis hitbox
     * @param {Number} offset_y offset its y axis hitbox
     * @param {Number} rotation 0 - 180 degrees | Default is 0
     * @param {String} uniqueID Every object that is created, even if its the same type of object has its own uniqueID
     * @param {Boolean} needsUpdating When a change is made to the image it will tick this
     * @param {Boolean} isMoving On the move, doesnt call another move command until this is false
     * @param {Number} moveSpeed In milliseconds (Fastest it will go is 50 ms, anything lower will still be 50ms)
     * @param {Number} velocityX speed per pixel (left and right)
     * @param {Number} velocityY speed per pixel (up and down)
     * @param {CanvasRenderingContext2D} ctx The objects context canvas
     * @param {ImageData} htmlImage Displayable image of the object
     * @param {Number} dest The objects destination [x | y]
     * @param {Number} currentIntegrity
     * @param {Number} maxIntegrity
     * 
     * The hitbox of the object, Default is 64 by 64 {min: 0, max: 64}
     * @param {Number} clickAreaX 
     * @param {Number} clickAreaY
     * 
     * @param {Number} buildTime (IN-DECI-SECONDS 1 decisecond = 0.10 second ) time it takes for a creature to build the object
     * 
     * The dimensions for inventories
     * @param {Number} inventorySizeX
     * @param {Number} inventorySizeY
     * 
     *///@param {Boolean} isScheduledForDereferencing SHOULD ONLY BE USED IN THE DELETE() FUNCTION, tells the engine to dereference it for the GC

    constructor(name = "Object", image = "null.png", imageFolder = (path +'/Images/'), size_x = 64, size_y = 64, 
    color = null, density = false, direction = DIR.SOUTH, visibility = 100, layer = LAYER.OBJECT, location = {x: null,y: null}, grandParent = "object", 
    lighting = 0, isOpaque = true, overlay = [], offset_x = 0, offset_y = 0, rotation = 0, uniqueID = null, currentIntegrity = 1000, maxIntegrity = 1000,
    needsUpdating = true, isMoving = false, moveSpeed = 1000, velocityX = 0, velocityY = 0, ctx = null, htmlImage = null, dest = {x: null, y: null},
    clickAreaX = {min: 0, max: 64}, clickAreaY = {min: 0, max: 64}, buildTime = 30, inventorySizeX = 1, inventorySizeY = 1){

        super();

        this.name = name; //Name of the object
        this.image = image; //image of the object
        this.imageFolder = imageFolder; //path of the folder containing the image
        this.size_x = size_x; //x axis size of the object
        this.size_y = size_y; //y axis size of the object
        this.color = color; //color of the object, default is #fff/white which makes the image appear as it would normally
        this.density = density; //true or false, does it take up room
        this.direction = direction; //direction the object is facing, so it can switch to the appropriate image
        this.visibility = visibility; // 0 - 100, the lower the less visibil
        this.layer = layer; //layer in which the object appears on 
        this.location = location; //location of the object (location = {x,y}) contains the x and y location of the object
        this.lighting = lighting; //the number of tiles the object lights up, 0 means it does not give off light.
        this.isOpaque = isOpaque; //true or false, can light pass through the object

        this.overlay = overlay; //Array of paths to images that you want stacked on top of the original. 
        // ---------------------- Example: You originally have a gun with no magazine in it, then when you 
        // ---------------------- put a clip into it add a visual image.

        this.offset_x = offset_x; //offsets the objects x and y axis from its original orientation
        this.offset_y = offset_y; //NOTE: THE IMAGE WILL BE CUT OFF IF THE IMAGE GOES PASS ITS SPECIFIED SIZE
        this.rotation = rotation;

        this.uniqueID = createUUID();

        this.needsUpdating = needsUpdating;

        this.isMoving = isMoving;

        this.velocityX = velocityX;
        this.velocityY = velocityY;

        this.htmlImage = htmlImage;

        this.dest = dest;

        this.currentIntegrity = currentIntegrity;
        this.maxIntegrity = maxIntegrity;

        this.grandParent = grandParent;

        this.clickAreaX = clickAreaX;
        this.clickAreaY = clickAreaY;

        this.buildTime = buildTime;

        this.inventorySizeX = inventorySizeX;
        this.inventorySizeY = inventorySizeY;

        //this.isScheduledForDereferencing = isScheduledForDereferencing;
        //this.ctx = ctx;
    }

    setRotation(val){
        this.rotation = val;
    }

    /**
     * THINGS WORKING SO FAR:
     * NAME
     * IMAGE
     * IMAGEFOLDER
     * SIZE_X
     * SIZE_Y
     * LAYER
     * OVERLAY
     * LOCATION
     * VISIBILITY
     * OFFSET X Y
     * VELOCITY X Y
     * ISMOVING
     * DENSITY
     * DIRECTION
     * DRAW()
     * UPDATE()
     * CLICK FUNCTIONS()
     * MOVING FUNCTIONS()
     * OVERLAY FUNCTIONS()
     * ROTATION
     */

     /**
      * NEEDED THINGS:
      * COLOR (kinda needs work, commented out check draw())
      * LIGHTING
      * ISOPAQUE
      */

    draw(ctx){
        var self = this;
        var i = new Image();
        var count = 0;

        for(var x = 0; x < allEngineObjects.length; x++){
            if(allEngineObjects[x].grandParent === "item" && allEngineObjects[x] !== this && allEngineObjects[x].location.x === self.location.x && allEngineObjects[x].location.y === self.location.y){
                count+=1;
                allEngineObjects[x].drawWithoutClearing(allEngineObjects[x].ctx);
            }
        }

        if(this.grandParent === 'object'){
            count = 0;
        }

        i.onload = function(){
            if(count === 0){self.ctx.clearRect(self.location.x-self.velocityX,self.location.y-self.velocityY,self.size_x,self.size_y);}

            //Note: This switch statement should not be used for anything that moves regularly (does not call when lagging and will displace the location making it offset)
            //      instead use the one in the overridded draw() function in the Creatures object file.
            switch(self.direction){
                case DIR.NORTH: if(self.location.y <= self.dest.y && self.dest.y !== null){ self.velocityY = 0; self.dest = {x: null, y: null}; } break;
                case DIR.WEST: if(self.location.x <= self.dest.x && self.dest.x !== null){ self.velocityX = 0; self.dest = {x: null, y: null}; } break;
                case DIR.EAST: if(self.location.x >= self.dest.x && self.dest.x !== null){ self.velocityX = 0; self.dest = {x: null, y: null}; } break;
                case DIR.SOUTH: if(self.location.y >= self.dest.y && self.dest.y !== null){ self.velocityY = 0; self.dest = {x: null, y: null}; } break;
            }

            if(self.visibility !== 100 && self.visibility < 100){ctx.globalAlpha = self.visibility / 100};
            if(self.rotation !== 0 && self.isRotating === false){ self.rotate(self.rotation); self.rotation = 0;}
            if(self.isRotating === true && self.boolRotatingInterval === false){ self.rotateConstant(); }
            
            // if(self.color !== null){
            //     ctx.fillStyle = self.color; 
            //     ctx.fillRect(self.location.x, self.location.y, self.size_x, self.size_y);
            //     ctx.globalCompositeOperation = "destination-in";
            // }

            self.ctx.drawImage(i, self.location.x, self.location.y, self.size_x, self.size_y);
            // ctx.globalCompositeOperation = "source-over";
        }

        i.src = this.src();

        this.htmlImage = i;
    }

    drawWithoutClearing(ctx){
        var self = this;
        var i = new Image();

        i.onload = function(){
            
            switch(self.direction){
                case DIR.NORTH: if(self.location.y <= self.dest.y && self.dest.y !== null){ self.velocityY = 0; self.dest = {x: null, y: null}; } break;
                case DIR.WEST: if(self.location.x <= self.dest.x && self.dest.x !== null){ self.velocityX = 0; self.dest = {x: null, y: null}; } break;
                case DIR.EAST: if(self.location.x >= self.dest.x && self.dest.x !== null){ self.velocityX = 0; self.dest = {x: null, y: null}; } break;
                case DIR.SOUTH: if(self.location.y >= self.dest.y && self.dest.y !== null){ self.velocityY = 0; self.dest = {x: null, y: null}; } break;
            }

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
        this.location.x += this.velocityX;
        this.location.y += this.velocityY;
        this.needsUpdating = false;
    }

    checkIntegrity(){
        if(this.currentIntegrity <= 0){
            this.destroy();
        }
    }

    clickObj(mouseObj){
        if((mouseObj.x - this.location.x) > 0 && (mouseObj.x - this.location.x) < 64 && (mouseObj.y - this.location.y) > 0 && (mouseObj.y - this.location.y) < 64){
            this.clickEvent(); //Calls clickEvent which can be overridden in other objects to do special things like opening doors
        }
    }

    rightClickObj(mouseObj){
        if((mouseObj.x - this.location.x) > 0 && (mouseObj.x - this.location.x) < 64 && (mouseObj.y - this.location.y) > 0 && (mouseObj.y - this.location.y) < 64){
            return this;
        }
        return null;
    }

    clickEvent(creature = null){
        return; 
    }

    move(dir,map){
        if(!Object.values(DIR).includes(dir) || this.isMoving === true || this.velocityX != 0 || this.velocityY != 0){ return;}

        this.direction = dir;
        
        switch(dir){
            case DIR.NORTH: if(this.location.y - 64 >= 64){this.moving(dir,map)} break;
            case DIR.WEST:  if(this.location.x - 64 >= 64){this.moving(dir,map)} break;
            case DIR.EAST:  if(this.location.x + 64 < (map.length + 1) * 64){this.moving(dir,map)} break;
            case DIR.SOUTH: if(this.location.y + 64 < (map[0].length + 1) * 64){this.moving(dir,map)} break;
        }
        
        return;
    }

    moving(dir,map){
        this.isMoving = true; //used to stop another call for moving while already moving
        let self = this;

        let currentX = Math.floor(this.location.x / 64) -1;
        let currentY = Math.floor(this.location.y / 64) -1;
        let destX = this.location.x; //destinations for animation
        let destY = this.location.y;

        switch(dir){
            case DIR.NORTH: currentY--; destY = this.location.y - 64; this.velocityY = -16; break; 
            case DIR.WEST: currentX--; destX = this.location.x - 64; this.velocityX = -16; break;
            case DIR.EAST: currentX++; destX = this.location.x + 64; this.velocityX = +16; break;
            case DIR.SOUTH: currentY++; destY = this.location.y + 64; this.velocityY = +16; break;
        }

        //Bump into creatures
        for(var i = 0; i < allEngineObjects.length; i++){
            if((allEngineObjects[i].location.x === destX && allEngineObjects[i].location.y === destY) && allEngineObjects[i].density === true){
                this.velocityX = 0;
                this.velocityY = 0;
                if(allEngineObjects[i].grandParent === "creature"){
                    allEngineObjects[i].move(dir,map);
                }
            }
        }

        //is the space not occupied
        if(map[currentX][currentY].density === false){
            this.dest = {x: destX, y: destY};
        }else{
            this.velocityX = 0;
            this.velocityY = 0;
        }

        //The objects speed delay
        setTimeout(function(){
            self.isMoving = false;
            self.draw(self.ctx);
        },self.moveSpeed);
    }

    create(location){
        var newObj = new this.constructor();
        let currentX = Math.floor(location.x / 64) -1;
        let currentY = Math.floor(location.y / 64) -1;
        newObj.location = location;
        newObj.ctx = document.getElementById(`canvas_${newObj.layer}`).getContext('2d');
        allEngineObjects.push(newObj);
        console.log(baseMap[currentX][currentY]);
        baseMap[currentX][currentY] = newObj;
        newObj.needsUpdating = true;
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
        setTimeout(function(){body.removeChild(canvas)},300); //not good but works for now
        setTimeout(function(){self.needsUpdating = true},300); //not good but works for now
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
}