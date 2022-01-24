
export class BodyParts{

    /**
     * Makes a bodypart that is attached or inside the creature.
     * These bodyparts can range from segments of the body, organs, bones, tendons, fat, muscle, meat, tissue and more.
     * @param {string} part Heart, Left Eye, Second Upper Right Rib.
     * @param {number} mass How much does it weigh? In pounds (lbs)
     * @param {string} belongsTo Does it belong to the head? Upper Body? Lower Body? Left Hand?
     * @param {string} type What is it? A Organ? Muscle? Tissue? Fat? Bone?
     * @param {string} connectedTo What is this part connected to? Example: Upper Left Arm is connected to the Upper Body.
     * @param {string} specialTag Something unique about that body part? Example: SENSE = sensory organ, HAND = interaction organ, etc.
     * @param {boolean} isBruised
     * @param {boolean} isDented
     * @param {boolean} isBroken
     * @param {boolean} isBleeding
     */
    constructor(part, mass, belongsTo, type, connectedTo, specialTag = null, isBruised = false, isDented = false, isBroken = false, isBleeding = false){
        this.part = part;
        this.mass = mass; 
        this.belongsTo = belongsTo;
        this.type = type;
        this.connectedTo = connectedTo;
        this.specialTag = specialTag;
        this.isBruised = isBruised;
        this.isDented = isDented;
        this.isBroken = isBroken;
        this.isBleeding = isBleeding;
    }

    /**
     * Converts a text tag into a usable BodyPart.
     * @param {string} tag raw BodyPart from a text file.
     */
    getBodyPart(tag){
        var elements = tag.substring(5,tag.length-1).split(","); //get all the elements inside the tag
        return new BodyParts(elements[0],parseInt(elements[1]),elements[2],elements[3],elements[4],elements[5]);
    }

    //used to make body part tags easily. Define. Print to console. Paste in txt.
    toString(){
        if(this.specialTag !== null){
            return "{ \"PART\": \""+this.part+ "\", \"MASS\": "+this.mass+", \"BELONGS_TO\": \""+this.belongsTo+"\", \"TYPE\": \""+this.type+"\", \"CONNECTED_TO\": \""+this.connectedTo+"\", \"SPECIAL_TAG\": \""+this.specialTag+"\" },";
        }
        return "{ \"PART\": \""+this.part+ "\", \"MASS\": "+this.mass+", \"BELONGS_TO\": \""+this.belongsTo+"\", \"TYPE\": \""+this.type+"\", \"CONNECTED_TO\": \""+this.connectedTo+"\" },";
    }
}