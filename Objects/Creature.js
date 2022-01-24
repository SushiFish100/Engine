


//Something can only die if a vital organ is severely damaged, for example getting shot in the heart, brain getting caved in, decapitation... etc
//OR 
//That said thing loses so much blood that they die from bloodloss or shock.

import {Item} from './Item.js';
import {Objects} from './Objects.js';
import {getPunchingForce, getFlagsFromMaterials} from '../Global/material.js';
import {BodyParts} from './Bodyparts/BodyPart.js';
import {LAYER} from '../Global/Map/Layer.js';
import { DIR } from '../Global/direction_enum.js';
import { allEngineObjects, baseMap } from '../scripts.js';
import { path } from '../Global/path.js';
import { INTENT } from '../Global/intent.js';
import { red_blood_decal } from '../Data/Decal/blood/blood.js';
import { targetsMenu } from '../UI/UI.js';


export class Creature extends Objects{

    /** 
     * Creates a AI Creature Object.
     * @param {string} anatomyFile Reads txt file containing anatomy.
     * @param {boolean} isHostile Boolean indicating its intent.
     * @param {string} anatomyPath The path to which the anatomyFile is located. Default "./Creatures/"
     * @param {string} name Name of the creature.
     * @param {string} image image name.
     * @param {string} imageFolder image file location.
     * @param {string} originalImage og image name.
     * @param {string} originalImageFolder og image file location.
     * @param {boolean} isHostileOriginal Boolean indicating its original intent.
     * @param {number} bloodLvl How much blood is inside the creature (1000 = full).
     * @param {number} bleedingAmount The amount the creature is currently bleeding at.
     * @param {number} shockLvl How much shock the creature is going though. (100 = Overwhelming Shock)
     * @param {boolean} isFaint Did it fall faint or pass out.
     * @param fullAnatomy The entire raw anatomy of the creature, used to process creature.
     * @param allBodySegments All the segments of the creature. Example: Upper Body, Lower Body, Head, etc.
     * @param allAttachedSegments All the segments of the body which are attached to one another. 
     *                            Example: Upper body has the following connected to it, the lower body, 
     *                            left arm and right arm. [Upper Body] -> [Lower Body, Left Arm, Right Arm]
     *                            So if this creatures Upper Body gets chopped off so does the other segments
     *                            attached to it.
     * @param statusFlags The current effects of the creature taking place. TODO
     * @param {string} material The make up of the creature. Deafult: ORGANIC
     * @param {number} height Height of creature. Based on cm's.
     * @param {number} width Width of creature. Based on cm's.
     * @param {number} length Length of creature. Based on cm's. 
     * @param {number} mass How much the creature weighs.
     * @param capabilityFlag Stores things a creature is capable of such as: SEE, BREATHE, GRAB, BITE, CLAWS, 
     * @param grabParts Holds an array of bodyparts that can grab onto objects.
     * 
     * @param {number} strength 
     * @param {number} agility
     * @param {number} endurnace
     * @param {number} mending How well they recover
     * @param {number} intelligence Might remove, not fun if you're not smart enough to do something
     * 
     * @param {number} carryCapacity Gets it from strength and endurance. (in pounds)
     * @param {number} moveSpeed Gets it from AGL. (in miliseconds)
     * @param {number} liftCapacity (in pounds)
     * 
     * @param {Array} allCoveredBodySegments The segments of the body that are covered (2D Array)
     * 
     * @param {Array} defaultPartsArr An array of BodyPart.part's that will always be added to every segment. <˥ 
     * @param {Array} defaultTypesArr An array of BodyPart.type's that will always be added to every segment. <˩-These two are connect to eachother
     * 
     * @param {INTENT} intent Enum check 'Global/intent.js'
     * @param {boolean} canAttack Items have cooldowns (attackSpeed), when a cooldown is applied this is false
     * 
     * @param {boolean} isOccupied Used when building something
     * 
     * @param {number} currentHealth
     * @param {number} maxHealth
     * 
     * @param {boolean} isDead
     * 
     * @param {ArrayOfArrays} targetableParts Object that holds all the targetable parts of the mob, simple creature will have it as null. Refer to Humanoid.js
     *                                 The array of arrays should be created in this fashion: [["Name Of Limb",LimbObject],["Head",headObject],["Left Leg",leftLegObject]]
     *                                 Simple creatures do not need this data member defined, but complex ones like humanoids do.
     * 
     * @param {string} targeted The mob_part the creature is focused on attacking
    */

    //TODO: X AND Y POS

    //TODO: when objects are made, make creatures drop what 
    //      they're holding and give additional options on 
    //      to with the corpse [butcher, search, pickup]

    //TODO: if butchered, organs will drop as is and bones will 
    //      just drop as "[creatures name] bones"

    //TODO: Wearing stuff on segments

    //TODO: AT THE END OF THE CREATURE CHECKS, SEE WHAT THE CREATURE IS CAPABLE OF: got hands and grab stuff? can you see or sense? ect.

    //1-arg constructor (Only need anatomyFile)
    constructor(anatomyFile, isHostile = false, anatomyPath = "../Creatures/", name = null, layer = LAYER.CREATURE, 
    image = null, imageFolder = (path + '/Images/Creatures/'), originalImage = null, originalImageFolder = null, isHostileOriginal = isHostile,
    bloodLvl = 1000, isBleeding = false, bleedingAmount = 0, shockLvl = 0, isFaint = false, fullAnatomy = [], allBodySegments = [],  
    allAttachedSegments = [], statusFlags = [], material = "ORGANIC", height, width, length, mass, capabilityFlag = [], grabParts = [],
    strength = 0, agility = 0, endurnace = 0, mending = 0, intelligence = 0, carryCapacity = null, moveSpeed = 100, liftCapacity = null,
    allCoveredBodySegments = [], defaultPartsArr = [], defaultTypesArr = [], intent = INTENT.HELP, grandParent = "creature", canAttack = true, 
    isOccupied = false, currentHealth = 100, maxHealth = 100, isDead = false, targetableParts = null, targeted = null){

        super();

        if(name != null){
            this.name = name;
        }

        if(image != null){
            this.image = image;
        }

        if(imageFolder != null){
            this.imageFolder = imageFolder;
        }

        this.originalImage = image;
        this.originalImageFolder = imageFolder;

        if(layer != null){
            this.layer = layer;
        }
        
        this.anatomyFile = anatomyFile; //refer to anatomy plans
        this.isHostile = isHostile

        //optional data members
        this.isHostileOriginal = isHostileOriginal;
        this.bloodLvl = bloodLvl; 
        this.isBleeding = isBleeding;
        this.bleedingAmount = bleedingAmount;
        this.shockLvl = shockLvl;
        this.anatomyPath = anatomyPath; //DEFAULT: ALL CREATURE FILES MUST BE IN THE CREATURES FOLDER
        this.isFaint = isFaint; // can be used in special events to find fainted and passed out people
        this.material = material;
        this.statusFlags = statusFlags;
        this.height = height;
        this.width = width;
        this.length = length;
        this.mass = mass;
        this.capabilityFlag = capabilityFlag;

        this.strength = strength;
        this.agility = agility;
        this.endurnace = endurnace;
        this.mending = mending;
        this.intelligence = intelligence;

        this.moveSpeed = moveSpeed;

        this.defaultPartsArr = defaultPartsArr;
        this.defaultTypesArr = defaultTypesArr;

        this.intent = intent;

        this.grandParent = grandParent;

        this.canAttack = canAttack;

        this.isOccupied = isOccupied;

        this.currentHealth = currentHealth;
        this.maxHealth = maxHealth;

        this.isDead = isDead;

        this.density = true;

        this.targetableParts = targetableParts;

        this.targeted = targeted;

        //Create anatomy
        if(this.fullAnatomy != null){
            this.fullAnatomy = fullAnatomy;
        }else{
            this.fullAnatomy = [];
            this.readAnatomyPathFile();
        }

        //TODO: isFaint = did it fall faint or pass out
        //TODO: figure out a way to determine and output damage (almost there)
        //TODO: STRENGTH how much can a creature hold or carry? and generally how strong are they wd
    }
    
    //OVERRIDDEN SUPER CLASS FUNCTION
    draw(ctx){
        var self = this;
        var i = new Image();

        i.onload = function(){
            ctx.clearRect(0,0,innerWidth,innerHeight);

            switch(self.direction){
                case DIR.NORTH: if(self.location.y <= self.dest.y){ self.velocityY = 0; self.location.y = self.dest.y; } break;
                case DIR.WEST: if(self.location.x <= self.dest.x){ self.velocityX = 0; self.location.x = self.dest.x; } break;
                case DIR.EAST: if(self.location.x >= self.dest.x){ self.velocityX = 0; self.location.x = self.dest.x; } break;
                case DIR.SOUTH: if(self.location.y >= self.dest.y){ self.velocityY = 0; self.location.y = self.dest.y; } break;
            }

            if(self.visibility !== 100 && self.visibility < 100){ctx.globalAlpha = self.visibility / 100};
            if(self.rotation !== 0 && self.isRotating === false){ self.rotate(self.rotation); self.rotation = 0;}
            if(self.isRotating === true && self.boolRotatingInterval === false){ self.rotateConstant(); }
            
            ctx.drawImage(i, self.location.x, self.location.y, self.size_x, self.size_y);
        }

        i.src = this.src();

        this.htmlImage = i;
    }

    /**
     * Basic AI of simple creatures
     * @returns void
     */
    AI(){
        if(this.isDead === true){return;}

        //for now these dudes go in random directions
        var self = this;
        let randTime = ((Math.floor(Math.random() * 4)) + 1) * 1000;

        var curInt = setInterval(() => { 
            var randDIR = (Math.floor(Math.random() * 4));
            switch(randDIR){
                case 0: self.move(randDIR,baseMap); break;
                case 1: self.move(randDIR,baseMap); break;
                case 2: self.move(randDIR,baseMap); break;
                case 3: self.move(randDIR,baseMap); break;
            }
        },randTime);

        setTimeout(function(){clearInterval(curInt); self.AI();},randTime)

    }

    //OVERRIDDEN PARENT CLASS FUNCTION
    clickObj(mouseObj){
        //Non-humanoids can only interact with objects and not items
        if((mouseObj.x - this.location.x) > -64 && (mouseObj.x - this.location.x) < 128 && (mouseObj.y - this.location.y) > -64 && (mouseObj.y - this.location.y) < 128){
            // console.log("creature interact range");
            for(let i = 0; i < allEngineObjects.length; i++){
                if((mouseObj.x - allEngineObjects[i].location.x) > 0 && (mouseObj.x - allEngineObjects[i].location.x) < 64 && 
                    (mouseObj.y - allEngineObjects[i].location.y) > 0 && (mouseObj.y - allEngineObjects[i].location.y) < 64 && allEngineObjects[i].grandParent === "object"){
                    allEngineObjects[i].clickEvent(this); //Clicked on an object within the range of interacting
                }
            }
        }
    }

    shiftClickObject(mouseObj){
        for(let i = 0; i < allEngineObjects.length; i++){
            if((mouseObj.x - allEngineObjects[i].location.x) > 0 && (mouseObj.x - allEngineObjects[i].location.x) < 64 && 
                (mouseObj.y - allEngineObjects[i].location.y) > 0 && (mouseObj.y - allEngineObjects[i].location.y) < 64 && allEngineObjects[i].grandParent === "creature"){
                allEngineObjects[i].shiftClickEvent(this);
            }
        }
    }

    //Brings up a menu of targetable body parts
    shiftClickEvent(creature = null){
        if(this.targetableParts === null || this.targetableParts.length === 0){return;}
        targetsMenu(this, creature);
    }

    //TODO ATTACK make attack tags in anatomy then apply tag to bodypart 
    //      BodyPart Subclass? Use Item class? 
    //      Need to add another optional property to BodyParts to apply tag.

    /**
     * For simple creatures a single health pool is used to determine death
     * @param {Creature} creature The creature that is being attacked
     * @param {Item} item Item used in the attack
     * @returns void
     */
    attack(creature, item = null){
        if(item !== null && this.canAttack === true){
            //Damaging the mob tageted
            creature.damaged(item.attackForce(this));
            this.bleedEffect(creature, item);

            this.canAttack = false;
            var speed = item.attackSpeed;
            var self = this;
            setTimeout(function(){self.canAttack = true;}, speed);
        }else if(item === null && this.canAttack === true){
            //Damaging the mob tageted
            creature.damaged(creature.strength);

            this.canAttack = false;
            var self = this;
            setTimeout(function(){self.canAttack = true;}, 1000);
        }
    }

    /**
     * Used for damaging simple creatures. Later down the line this can be 
     * overrided to do unique things like dodging attacks, even explode maybe.
     * @param {*} dmgAmount Amount of damage being done
     * @returns void
     */
    damaged(dmgAmount = 0){
        this.currentHealth -= dmgAmount;
        console.log(this.currentHealth);
        if(this.currentHealth <= 0 && this.isDead === false){
            this.death();
        }
    }

    /**
     * Creates a blood decal
     */
    bleedEffect(creature,item = null){
        if((item.damageType.toUpperCase() === "BLUNT" || item === null) && ((Math.floor(Math.random() * 4)) + 1) === 1){
            var blood = new red_blood_decal();
            blood.location = {x: creature.location.x, y: creature.location.y};
            blood.needsUpdating = true;
            allEngineObjects.push(blood);
        }else if(item.damageType.toUpperCase() === "SHARP" && ((Math.floor(Math.random() * 4)) + 1) > 1){
            var blood = new red_blood_decal();
            blood.location = {x: creature.location.x, y: creature.location.y};
            blood.needsUpdating = true;
            allEngineObjects.push(blood);
        }
    }

    /**
     * Heal the creature
     * @param {*} healAmount 
     * @returns void
     */
    healed(healAmount){
        this.currentHealth += healAmount;
        if(this.currentHealth > this.maxHealth){
            this.currentHealth = this.maxHealth;
        }
    }

    /**
     * Death
     * @returns void
     */
    death(){
        console.log(this.name + " wimpers and stops moving.");
        this.isDead = true
    }

    /**
     * Creature has been attacked. [SCRAPPED] (Left here just in case i want to go back to it)
     * @param {string} target 
     * @param {Item} obj 
     */
    attacked(target, obj){
        console.warn("WARNING: FUNCTION attacked(target, obj) IS INCOMPLETE AND DOES NOTHING.\nUSE attack(creature,item) INSTEAD!");

        //skin is 1.3mm's thick and shear strength is around 0.0162
        const ORGANIC_PUNCTURE_FORCE = getPunchingForce(0.0162,obj.attackSurfacePerimeter,1.3); 

        //bone is on average 2mm thick and with a shear strength of around 0.104
        const ORGANIC_BONE_PUNCTURE_FORCE = getPunchingForce(0.104,obj.attackSurfacePerimeter,2);

        console.log("Skin: "+ORGANIC_PUNCTURE_FORCE+"\nBone: "+ORGANIC_BONE_PUNCTURE_FORCE);
        
        if(this.findTarget(target) == null){ console.log("NAT"); return "NAT"; } //Is it a target?

        if(Math.floor(Math.random()*100) <= this.agility){ console.log("MISS"); return "MISS"; } //Miss chance

        var force = obj.attackForce(this);
        console.log(force);

        if(this.statusFlags.includes("FRAGILE") && obj.damageType === "BLUNT"){ force *= 2; }
        if(this.statusFlags.includes("CUTTABLE") && obj.damageType === "SHARP"){ force *= 2; }

        //Shear strength of organic skin and flesh is 0.0162 kn 
        //(41 pounds of force to puncture)
        if(this.material === "ORGANIC"){ 
            if(force < (ORGANIC_PUNCTURE_FORCE / 2) && force != 0){// Bruise skin 
                //TODO bruise
                this.bruiseRandomOfType(target,"skin");

            }else if(force < ORGANIC_PUNCTURE_FORCE && force > (ORGANIC_PUNCTURE_FORCE / 2)){
                //TODO more then a bruise, knock the wind out of em? sagnificant pain if not zombified?
                this.bruiseAllOfType(target,"skin");
                this.bruiseRandomOfType(target,"flesh");

            }else if(force > ORGANIC_PUNCTURE_FORCE){ //Break flesh and skin and chance to bruise organs
                //TODO puncture skin and flesh
                this.breakAllOfType(target,"skin");
                this.breakRandomOfType(target,"flesh");
                if(Math.floor(Math.random() * 100 ) < 5){this.breakRandomOfType(target,"vessel");}
                if(Math.floor(Math.random() * 100 ) < 50){this.bruiseRandomOfType(target, "organ"); }
            }

            if(force > (ORGANIC_BONE_PUNCTURE_FORCE / 2) && force < ORGANIC_BONE_PUNCTURE_FORCE){ // Dented and bruised bones as well as organs
                
                if(Math.floor(Math.random() * 100 ) < 30){this.dentRandomOfType(target,"bone");}else{this.bruiseRandomOfType(target,"bone");}
                if(Math.floor(Math.random() * 100 ) < 20){this.breakRandomOfType(target,"vessel");}
                if(Math.floor(Math.random() * 100 ) < 50){this.dentRandomOfType(target,"organ");}

            }else if(force > ORGANIC_BONE_PUNCTURE_FORCE){ // Dented and broken bones as well as organs.

                if(Math.floor(Math.random() * 100 ) < 30){this.breakRandomOfType(target,"bone");}else{this.dentRandomOfType(target,"bone");}
                if(Math.floor(Math.random() * 100 ) < 85){this.breakRandomOfType(target,"vessel");}
                if(Math.floor(Math.random() * 100 ) < 50){this.breakRandomOfType(target,"organ");}

            }else if(force > (ORGANIC_PUNCTURE_FORCE + ORGANIC_BONE_PUNCTURE_FORCE)){ // Gored / cleaved straight through the body part
                this.removeSegmentProcedure(target); console.log("removed segment: "+target);
            }
        }
    //TODO BLEEDING OUT, PANICING? MAYBE SHOCK, THEN BLOOD LOSS AMOUNT. AFTER THAT MAYBE DROP LIMBS WHEN REMOVED THEN MAKE THE WEBSITE UI STUFF
    }

    /**
     * Activates a bleeding timer when the creature starts bleeding.
     * @param {Body.BodyParts} 
     * @returns void
     */
    bleeding(bodypart){
        if(this.bleedingAmount == 0 || bodypart == typeof BodyParts){bodypart.isBleeding = false; return;}
        bodypart.isBleeding = true;

        setTimeout(() =>{this.bleeding(bodypart)}, 2000);

        this.bloodLvl -= this.bleedingAmount;
        this.bleedingAmount--;
        console.log(this.bloodLvl);
    }

    /**
     * Breaks or dents all targeted segment of the creatures type.
     * @param {string} target The targeted segment of the creature.
     * @param {string} type The type of bodypart. Example: Organs, Skin, Flesh, Tissue, Bones, etc.
     * @returns void
     */
    breakAndDentOfType(target,type){
        if(this.material != "ORGANIC" || this.findTarget(target) == null || this.hasOfType(target,type) == false){ return; }

        for(var i = 0; i < this.fullAnatomy.length; i++){
            if(this.fullAnatomy[i].belongsTo.toLowerCase() === target.toLowerCase()){
                if(this.fullAnatomy[i].type.toLowerCase() === type.toLowerCase() && Math.floor(Math.random() * 100 ) < 75){
                    console.log("Broken "+this.fullAnatomy[i].part); 
                    this.fullAnatomy[i].isBroken = true;
                }else if(this.fullAnatomy[i].type.toLowerCase() === type.toLowerCase()){
                    console.log("Dented "+this.fullAnatomy[i].part); 
                    this.fullAnatomy[i].isDented = true;
                }
            }
        }
    }

    /**
     * Dents or bruises all targeted segment of the creatures type.
     * @param {string} target The targeted segment of the creature.
     * @param {string} type The type of bodypart. Example: Organs, Skin, Flesh, Tissue, Bones, etc.
     * @returns void
     */
    dentAndBruiseOfType(target,type){
        if(this.material != "ORGANIC" || this.findTarget(target) == null || this.hasOfType(target,type) == false){ return; }
        
        for(var i = 0; i < this.fullAnatomy.length; i++){
            if(this.fullAnatomy[i].belongsTo.toLowerCase() === target.toLowerCase()){
                if(this.fullAnatomy[i].type.toLowerCase() === type.toLowerCase() && Math.floor(Math.random() * 100 ) < 75){
                    console.log("Dented "+this.fullAnatomy[i].part); 
                    this.fullAnatomy[i].isDented = true;
                }else if(this.fullAnatomy[i].type.toLowerCase() === type.toLowerCase()){
                    console.log("Bruised "+this.fullAnatomy[i].part); 
                    this.fullAnatomy[i].isBruised = true;
                }
            }
        }
    }

    /**
     * Breaks all targeted segment of the creatures type.
     * @param {string} target The targeted segment of the creature.
     * @param {string} type The type of bodypart. Example: Organs, Skin, Flesh, Tissue, Bones, etc.
     * @returns void
     */
    breakAllOfType(target,type){
        if(this.material != "ORGANIC" || this.findTarget(target) == null || this.hasOfType(target,type) == false){ return; }

        for(var i = 0; i < this.fullAnatomy.length; i++){
            if(this.fullAnatomy[i].belongsTo.toLowerCase() === target.toLowerCase()){
                if(this.fullAnatomy[i].type.toLowerCase() === type.toLowerCase()){
                    console.log("Broken "+this.fullAnatomy[i].part); 
                    this.fullAnatomy[i].isBroken = true;
                }
            }
        }
    }

    /**
     * Dents all targeted segment of the creatures type.
     * @param {string} target The targeted segment of the creature.
     * @param {string} type The type of bodypart. Example: Organs, Skin, Flesh, Tissue, Bones, etc.
     * @returns void
     */
    dentAllOfType(target,type){
        if(this.material != "ORGANIC" || this.findTarget(target) == null || this.hasOfType(target,type) == false){ return; }

        for(var i = 0; i < this.fullAnatomy.length; i++){
            if(this.fullAnatomy[i].belongsTo.toLowerCase() === target.toLowerCase()){
                if(this.fullAnatomy[i].type.toLowerCase() === type.toLowerCase()){
                    console.log("Dented "+this.fullAnatomy[i].part); 
                    this.fullAnatomy[i].isDented = true;
                }
            }
        }
    }

    /**
     * Bruises all targeted segment of the creatures type.
     * @param {string} target The targeted segment of the creature.
     * @param {string} type The type of bodypart. Example: Organs, Skin, Flesh, Tissue, Bones, etc.
     * @returns void
     */
    bruiseAllOfType(target,type){
        if(this.material != "ORGANIC" || this.findTarget(target) == null || this.hasOfType(target,type) == false){ return; }

        for(var i = 0; i < this.fullAnatomy.length; i++){
            if(this.fullAnatomy[i].belongsTo.toLowerCase() === target.toLowerCase()){
                if(this.fullAnatomy[i].type.toLowerCase() === type.toLowerCase()){
                    console.log("Bruised "+this.fullAnatomy[i].part); 
                    this.fullAnatomy[i].isBruised = true;
                }
            }
        }
    }

    /**
     * Breaks a random targeted segment of the creatures organs.
     * @param {string} target The targeted segment of the creature.
     * @param {string} type The type of bodypart. Example: Organs, Skin, Flesh, Tissue, Bones, etc.
     * @returns void
     */
    breakRandomOfType(target,type){
        if(this.material != "ORGANIC" || this.findTarget(target) == null || this.hasOfType(target,type) == false){ return; }
        var hasChosen = false;

        do{
            for(var i = 0; i < this.fullAnatomy.length; i++){
                if(this.fullAnatomy[i].belongsTo.toLowerCase() === target.toLowerCase()){
                    if(this.fullAnatomy[i].type.toLowerCase() === type.toLowerCase() && Math.floor(Math.random() * 100 ) > 95){
                        console.log("Breaking Random "+type+" | Broken "+this.fullAnatomy[i].part); 
                        this.fullAnatomy[i].isBroken = true;
                        hasChosen = true;
                        break;
                    }
                }
            }
        }while(!hasChosen)
    }

    /**
     * Dents a random targeted segment of the creatures organs.
     * @param {string} target The targeted segment of the creature.
     * @param {string} type The type of bodypart. Example: Organs, Skin, Flesh, Tissue, Bones, etc.
     * @returns void
     */
    dentRandomOfType(target,type){
        if(this.material != "ORGANIC" || this.findTarget(target) == null || this.hasOfType(target,type) == false){ return; }
        var hasChosen = false;

        do{
            for(var i = 0; i < this.fullAnatomy.length; i++){
                if(this.fullAnatomy[i].belongsTo.toLowerCase() === target.toLowerCase()){
                    if(this.fullAnatomy[i].type.toLowerCase() === type.toLowerCase() && Math.floor(Math.random() * 100 ) > 95){
                        console.log("Dented Random "+type+" | Dented "+this.fullAnatomy[i].part); 
                        this.fullAnatomy[i].isDented = true;
                        hasChosen = true;
                        break;
                    }
                }
            }
        }while(!hasChosen)
    }

    /**
     * Bruises a random targeted segment of the creatures organs.
     * @param {string} target The targeted segment of the creature.
     * @param {string} type The type of bodypart. Example: Organs, Skin, Flesh, Tissue, Bones, etc.
     * @returns void
     */
    bruiseRandomOfType(target,type){
        if(this.material != "ORGANIC" || this.findTarget(target) == null || this.hasOfType(target,type) == false){ return; }
        var hasChosen = false;

        do{
            for(var i = 0; i < this.fullAnatomy.length; i++){
                if(this.fullAnatomy[i].belongsTo.toLowerCase() === target.toLowerCase()){
                    if(this.fullAnatomy[i].type.toLowerCase() === type.toLowerCase() && Math.floor(Math.random() * 100 ) > 95){
                        console.log("Bruise Random "+type+" | Bruised "+this.fullAnatomy[i].part); 
                        this.fullAnatomy[i].isBruised = true;
                        hasChosen = true;
                        break;
                    }
                }
            }
        }while(!hasChosen)
    }

    /**
     * Gets a random type of bodypart from a segment.
     * @param {string} target 
     * @param {string} type 
     * @returns BodyPart OR null if not found.
     */
    getRandomBodyType(target,type){
        for(var i = 0; i < this.fullAnatomy.length; i++){
            if(this.fullAnatomy[i].belongsTo.toLowerCase() == target.toLowerCase()){
                if(this.fullAnatomy[i].type.toLowerCase() == type.toLowerCase()){
                    console.log("Random "+type+" Found: "+this.fullAnatomy[i].part); 
                    return this.fullAnatomy[i];
                }
            }
        }
        return null;
    }

    /**
     * Checks to see if the segment has that type.
     * @param {string} segment Which segment to check.
     * @param {string} type Which type to check.
     * @returns {boolean} boolean
     */
    hasOfType(segment,type){
        if(this.findTarget(segment) == null){ return; }

        for(var i = 0; i < this.fullAnatomy.length; i++) {
            if(this.fullAnatomy[i].belongsTo.toLowerCase() === segment.toLowerCase()){
                if(this.fullAnatomy[i].type.toLowerCase() === type.toLowerCase()){
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Sets defaults to every segment.
     * @param partArr First half of ADD_TO_ALL_SEGMENTS tag
     * @param typeArr Second half of ADD_TO_ALL_SEGMENTS tag
     * @returns void 
     */
    addToAnatomyFile (partArr,typeArr) {
        var connectedToStr = "";

        for (var i = 0; i < this.allBodySegments.length; i++) {
            for (var j = 0; j < partArr.length; j++) {
                for(var x = 0; x < this.fullAnatomy.length; x++){
                    if(this.fullAnatomy[x].belongsTo === this.allBodySegments[i]){
                        connectedToStr = this.fullAnatomy[x].connectedTo;
                        break;
                    }
                }
                this.fullAnatomy[this.fullAnatomy.length] = new BodyParts(partArr[j],1,this.allBodySegments[i],typeArr[j],connectedToStr);
            }
        }
    }

    /**
     * Gets all covered body segments.
     * @returns All the covered body segments.
     */
    getAllCoveredBodySegments(){
        var arr = [];
        for(var i = 0; i < this.allBodySegments.length; i++){
            arr[i] = new Array();
        }
        return arr;
    }

    /**
     * sets grabbablebodyparts array
     * @returns void
     */
    setGrabbableBodyParts(){
        for(var i = 0; i < this.fullAnatomy.length; i++){
            if(this.fullAnatomy[i].specialTag === "GRAB"){
                this.grabParts[this.grabParts.length] = this.fullAnatomy[i];
            }  
        }
    }

    /**
     * Read in a creatures anatomy.
     * @return Array cotaining BodyParts
     */
    async readAnatomyPathFile(){
        var truePath = this.anatomyFile; //Gets true path if anatomyPath isnt null
        console.log(this.anatomyFile);

        if(this.anatomyPath != null){
            truePath = path + "/Creatures/" + this.anatomyFile;
        }
        
        const CREATURE_JSON = await import(truePath).then(function(val){ return val.default.Creature});
        
        var bodyPart = new BodyParts();

        this.name = CREATURE_JSON.NAME;
        this.image = CREATURE_JSON.IMAGE;
        this.imageFolder = path + CREATURE_JSON.IMAGE_FOLDER;

        this.originalImage = this.image;
        this.originalImageFolder = this.imageFolder;

        this.material = CREATURE_JSON.MATERIAL;

        this.addToStatusFlags(getFlagsFromMaterials(this.material));

        this.height = parseInt(JSON.stringify(CREATURE_JSON.HEIGHT));
        this.width = parseInt(JSON.stringify(CREATURE_JSON.WIDTH));
        this.length = parseInt(JSON.stringify(CREATURE_JSON.LENGTH));
        this.mass = parseInt(JSON.stringify(CREATURE_JSON.MASS));

        this.strength = parseInt(JSON.stringify(CREATURE_JSON.CREATURE_STATUS.STR));
        this.agility = parseInt(JSON.stringify(CREATURE_JSON.CREATURE_STATUS.AGL));
        this.endurnace = parseInt(JSON.stringify(CREATURE_JSON.CREATURE_STATUS.END));
        this.mending = parseInt(JSON.stringify(CREATURE_JSON.CREATURE_STATUS.MEN));
        this.intelligence = parseInt(JSON.stringify(CREATURE_JSON.CREATURE_STATUS.INT));

        for(let i in CREATURE_JSON.ADD_TO_ALL_SEGMENTS){
            this.defaultPartsArr[this.defaultPartsArr.length] = ((CREATURE_JSON.ADD_TO_ALL_SEGMENTS)[i].PART);
            this.defaultTypesArr[this.defaultTypesArr.length] = ((CREATURE_JSON.ADD_TO_ALL_SEGMENTS)[i].TYPE);
        }

        for(let i in CREATURE_JSON.BODY){
            bodyPart = new BodyParts();

            bodyPart.part = CREATURE_JSON.BODY[i].PART;
            bodyPart.mass = CREATURE_JSON.BODY[i].MASS;
            bodyPart.belongsTo = CREATURE_JSON.BODY[i].BELONGS_TO;
            bodyPart.type = CREATURE_JSON.BODY[i].TYPE;
            bodyPart.connectedTo = CREATURE_JSON.BODY[i].CONNECTED_TO;

            if(CREATURE_JSON.BODY[i].SPECIAL_TAG != null){
                bodyPart.specialTag = (CREATURE_JSON.BODY[i].SPECIAL_TAG);
                this.capabilityFlag[this.capabilityFlag.length] = bodyPart.connectedTo;
            }

            this.fullAnatomy[i] = (bodyPart);
            
        }

        
        //Get all segments of the body
        if(this.allBodySegments != null){
            this.allBodySegments = allBodySegments;
        }else{
            this.allBodySegments = this.getAllBodySegments(this.fullAnatomy);
        }

        //Add defaults to all the segments of the body
        if(this.defaultPartsArr != null || this.defaultPartsArr.length != 0 || this.defaultTypesArr != null || this.defaultTypesArr.length != 0){
            this.addToAnatomyFile(this.defaultPartsArr,this.defaultTypesArr);
        }

        //2D Array of each body segment that has something attached to it
        if(this.allAttachedSegments != null){
            this.allAttachedSegments = allAttachedSegments;
        }else{
            this.allAttachedSegments = this.getAllAttachedSegments(this.fullAnatomy,this.allBodySegments);
        }

        //Get the body parts that can hold item objects
        if(this.grabParts != null){
            this.grabParts = grabParts;
        }else{
            this.grabParts = [];
            this.setGrabbableBodyParts();
        }

        //Carry capacity
        if(this.carryCapacity != null){
            this.carryCapacity = carryCapacity;
        }else{
            this.carryCapacity = 0;
            this.getCarryCap();
        }
        
        //Lift capacity
        if(this.liftCapacity != null){
            this.liftCapacity = liftCapacity;
        }else{
            this.liftCapacity = 0;
            this.getLiftCap();
        }

        //Create 2D array, First array is all the body segments, Second array is what is being worn on that segment.
        if(this.allCoveredBodySegments != null){
            this.allCoveredBodySegments = allCoveredBodySegments;
        }else{
            this.allCoveredBodySegments = this.getAllCoveredBodySegments();
        }
        
        this.needsUpdating = true;
    }

    move(dir,map){

        if(this.imageFolder === null || this.imageFolder === "" || this.image === null || this.image === ""){
            super.move(dir,map);
        }

        switch(dir){
            case DIR.NORTH: this.image = this.originalImage +""+ "_north.png"; break; 
            case DIR.WEST: this.image = this.originalImage +""+ "_west.png"; break;
            case DIR.EAST: this.image = this.originalImage +""+ "_east.png"; break;
            case DIR.SOUTH: this.image = this.originalImage +""+ "_south.png"; break;
        }

        super.move(dir,map);
    }

    /**
     * Gets carry capacity of the creature. (pounds)
     * @returns Carry Capacity and also sets it.
     */
    getCarryCap(){
        const POUNDS = 9;
        var multiplier = this.endurnace / 2;
        if(multiplier < 1){ multiplier = 1; }
        var additional = ((POUNDS * this.strength) * multiplier) * 0.10;
        this.carryCapacity = ((POUNDS * this.strength) + additional).toFixed(0);
        return this.carryCapacity;
    }

    /**
     * Get the amount the creature can lift. (pounds)
     * @returns Sets lift cap and also returns it.
     */
    getLiftCap(){
        if(!this.capabilityFlag.includes("GRAB")){
            return 0;
        }

        const POUNDS = 18;
        var multiplier = this.endurnace / 3;
        if(multiplier < 1){ multiplier = 1; }
        var additional = ((POUNDS * this.strength) * multiplier) * 0.10;
        this.liftCapacity = ((POUNDS * this.strength) + additional).toFixed(0);
        return this.liftCapacity;
    }

    /**
     * Adds status' to the creature.
     * @param {*} arr Array of tags to be added.
     */
    addToStatusFlags(arr){
        for(var i = 0; i < arr.length; i++){
            this.statusFlags[this.statusFlags.length] = arr[i];
        }
    }

    /**
     * Removes creatures statusFlags
     * @param {string} flag The flag to be removed. 
     * @param {number} num If there is more then 1 flag it will remove the specified amount.
     */
    removeStatusFlags(flag, num = 0){
        if(num < 1){
            for (var i = 0; i < this.statusFlags.length; i++) {
                if(this.statusFlags[i] === flag){
                    delete this.statusFlags[i];
                    return;
                }
            }
        }else{
            for(var i = 0; i < num; i++){
                for (var j = 0; j < this.statusFlags.length; j++) {
                    if(this.statusFlags[j] === flag){
                        delete this.statusFlags[j];
                        break;
                    }
                }
            }
        }
    }

    /**
     * Takes in a flag and returns the number of times it appears
     * @param flag The flag being searched for.
     * @returns The number of times the flag appears.
     */
    getNumOfStatusFlag(flag){
        var num = 0;
        for (let i = 0; i < this.statusFlags.length; i++) {
            if(this.statusFlags[i] == flag){
                num++;
            }
        }
        return num;
    }

    /**
     * Finds the segment the user or AI is trying to attack.
     * @param str A string which will be a sentance that will be split up to find key words.
     * @returns The segment which best fits the string given.
     */
    findTarget(str){
        if(str != null){
            for(var i = 0; i < this.allBodySegments.length; i++){
                if(this.allBodySegments[i] != null && (typeof this.allBodySegments[i] === "string" ) && str.toLowerCase().includes(this.allBodySegments[i].toLowerCase())){
                    return this.allBodySegments[i];
                }
            }
        }
        return null;
    }

    /**
     * The segment removing procedure. Calls removeSegment(str) and then updates creatures capabilities.
     * @param {string} segmentStr segment to be removed.
     */
    removeSegmentProcedure(segmentStr){
        this.removeSegment(segmentStr);
        var newTagArr = [];
        for(var i = 0; i < this.fullAnatomy.length; i++){
            if(this.fullAnatomy[i].specialTag != null){
                newTagArr[newTagArr.length] = this.fullAnatomy[i].specialTag;
            }
        }
        this.capabilityFlag = newTagArr;

        this.grabParts = [];
        this.setGrabbableBodyParts();
    }

    /**
     * Removes body segments from the creature and all things attached to that segment.
     * @param segmentStr A segment of the creature.
     * @return void, removes segments from the anatomy.
     */
    removeSegment(segmentStr){
        var startingSegNum = -1; //-1 for validation reasons
        segmentStr = segmentStr.toLowerCase();

        for(var i = 0; i < this.allBodySegments.length; i++){
            if((typeof this.allBodySegments[i] === "string" ) && this.allBodySegments[i].toLowerCase() === segmentStr){
                //console.log(this.allBodySegments[i]);
                startingSegNum = i;
            }
        }

        //Ignored if the segment doesnt have children
        if(startingSegNum != -1){
            for(var i = 0; i < this.allAttachedSegments[startingSegNum].length; i++){
                //console.log("   "+this.allAttachedSegments[startingSegNum][i]);
                this.removeSegment(this.allAttachedSegments[startingSegNum][i]);
            }   
        }

        //Remove everything in the segmentStr then all the childs
        for(var i = 0; i < this.fullAnatomy.length; i++){  
            if((typeof this.fullAnatomy[i].belongsTo === "string" ) && this.fullAnatomy[i].belongsTo.toLowerCase() === segmentStr.toLowerCase()){
                this.fullAnatomy[i] = [];
            }
        }

        for(var i = 0; i < this.allBodySegments.length; i++){  
            if((typeof this.allBodySegments[i] === "string" ) && this.allBodySegments[i].toLowerCase() === segmentStr.toLowerCase()){
                this.allBodySegments[i] = [];
                this.allCoveredBodySegments[i] = [];
            }
        }

        if(startingSegNum > -1){
            this.allAttachedSegments[startingSegNum] = [];
        }

        //TODO: DONE FOR NOW UNTIL ITEMS ARE ADDED
        //TODO: IF IT HAS THE ZOMBIE TAG MAKE THE SEGMENTS TURN INTO NEW CREATURES INSTEAD
    }

    /**
     * Takes in a anatomy array and all body part segments then returns a 2D array [belongsTo][bodySegment].
     * @param anatomyArr Full anatomy of the creature.
     * @param segmentsArr All the segments in the body.
     * @return 2D Array cotaining what each segment is attached to it. Example: Head has a upper body attached to it.
     */
    getAllAttachedSegments(anatomyArr,segmentsArr){ 
        var doubleArr = [];
        var noneDupeDoubleArr = [];

        for(var i = 0; i < segmentsArr.length; i++){
            doubleArr[i] = new Array();
            noneDupeDoubleArr[i] = new Array();
        }

        //Match connectedTo params with segment array
        for(var i = 0; i < anatomyArr.length; i++){
            for(var j = 0; j < segmentsArr.length; j++){
                if(anatomyArr[i].connectedTo === segmentsArr[j]){
                    doubleArr[j][doubleArr[j].length] = anatomyArr[i].belongsTo;
                }
            }
        }

        var tempArr = [];
        var counter = 0;
        var isDupe = false;

        //Remove dupes...
        for(var i = 0; i < doubleArr.length; i++){
            for(var j = 0; j < doubleArr[i].length; j++){
                for(var x = 0; x < tempArr.length; x++){
                    if(tempArr[x] === doubleArr[i][j]){
                        isDupe = true;
                    }
                }
                if(isDupe === false){
                    tempArr[counter] = doubleArr[i][j];
                    counter++; 
                }
                isDupe = false;
            }
            doubleArr[i] = tempArr;
            counter = 0;
            tempArr = [];
        }

        return doubleArr;
    }

    /**
     * Takes in a anatomy array and returns all body segments (belongsTo)
     * @param anatomyArr Full anatomy of the creature.
     * @return Array cotaining the names of all the segments of the body.
     */
    getAllBodySegments(anatomyArr){
        var arr = [];
        var counter = 0;
        var isDupe = false;

        for(var i = 0; i < anatomyArr.length; i++){
            for(var j = 0; j < arr.length; j++){
                if(arr.length != 0 && arr[j] === anatomyArr[i].belongsTo){
                    isDupe = true;
                }
            }
            if(!isDupe){
                arr[counter] = anatomyArr[i].belongsTo;
                counter++;
            }
            isDupe = false;
        }

        return arr;
    }

    /**
     * Gives a description of the creature.
     * @return String describing the creature.
     */
    toString(){
        var str = ("A " + this.name + ", ");
        var randHostileMessageNmu = (Math.floor(Math.random() * 6)+ 1);

        if(this.isFaint === true){
            return str+"it is passed out!";
        }

        if(this.isHostile === true){
            switch(randHostileMessageNmu){
                case 1: str+="doesn't seem to like you too well."; break;
                case 2: str+="seems pissed at you."; break;
                case 3: str+="an aggressive creature."; break;
                case 4: str+="seems hostile."; break;
                case 5: str+="has an angered stance."; break;
                case 6: str+="wants to kill you."; break;
            }
        }else{
            switch(randHostileMessageNmu){
                case 1: str+="seems okay with your presence."; break;
                case 2: str+="doesn't mind you."; break;
                case 3: str+="isn't hostile towards you... yet."; break;
                case 4: str+="it's okay with you around."; break;
                case 5: str+="doesn't seem to hate your guts."; break;
                case 6: str+="notices you but doesn't seem to mind you around."; break;
            }
        }

        return str;
    }

}