

/**
 * Returns a array of flags the creature has because of its material make up.
 * @param {string} material 
 */
export function getFlagsFromMaterials(material){
    if(material === "ORGANIC"){
        return ["FLAMMABLE"];
    }
    if(material === "CRYSTAL"){
        return ["NONFLAMMABLE", "SLOW", "ARMOURED", "DUMB"];
    }
    if(material === "WATER"){
        return ["NONFLAMMABLE", "FRAGILE", "CUTTABLE"];
    }
    if(material === "VOMIT" || material === "PUKE"){
        return ["FRAGILE", "CUTTABLE", "GROSS"];
    }
    if(material === "HAIR"){
        return ["FLAMMABLE", "FRAGILE", "CUTTABLE"];
    }
    if(material === "GLASS"){
        return ["NONFLAMMABLE", "SLOW", "FRAGILE"];
    }
    if(material === "ASH"){
        return ["NONFLAMMABLE", "SLOW", "FRAGILE"];
    }
    if(material === "FLAMING"){
        return ["NONFLAMMABLE", "GLOWING", "HOT", "FRAGILE", "CUTTABLE"];
    }
    if(material === "METAL"){
        return [randomMetal(),"SLOW"];
    }
}

/**
 * Gets the force of the specified metal.
 * Used the punching force equation: 
 * Standard Perimeter is 3.17mm x 3.17mm = (10mm), 
 * Standard thickness is 1mm, 
 * Finally shear strength is KN/mm2 coverted to Pound Force.
 * @param {string} metalName Name of metal
 * @returns The Pound Force required to break through the metal.
 */
export function getMetalBreakForce(metalName, perimeter = 10, thicknessOfMetal = 1){
    if(metalName === "COPPER"){ return getPunchingForce(0.1592  , perimeter, thicknessOfMetal); }
    if(metalName === "IRON"){ return getPunchingForce(0.05      , perimeter, thicknessOfMetal); }
    if(metalName === "SILVER"){ return getPunchingForce(0.054   , perimeter, thicknessOfMetal); }
    if(metalName === "GOLD"){ return getPunchingForce(0.185     , perimeter, thicknessOfMetal); }
    if(metalName === "LEAD"){ return getPunchingForce(0.025     , perimeter, thicknessOfMetal); }
    if(metalName === "TIN"){ return getPunchingForce(0.035      , perimeter, thicknessOfMetal); }
    if(metalName === "ZINC"){ return getPunchingForce(0.046     , perimeter, thicknessOfMetal); }
    if(metalName === "BRONZE"){ return getPunchingForce(0.297   , perimeter, thicknessOfMetal); }
    if(metalName === "TUNGSTEN"){ return getPunchingForce(0.400 , perimeter, thicknessOfMetal); }
    if(metalName === "TITANIUM"){ return getPunchingForce(0.367 , perimeter, thicknessOfMetal); }
    if(metalName === "STEEL"){ return getPunchingForce(0.3447   , perimeter, thicknessOfMetal); }
    if(metalName === "PLATINUM"){ return getPunchingForce(0.212 , perimeter, thicknessOfMetal); }
    if(metalName === "NICKEL"){ return getPunchingForce(0.153   , perimeter, thicknessOfMetal); }
    if(metalName === "ALUMINIUM"){ return getPunchingForce(0.083, perimeter, thicknessOfMetal); }
    if(metalName === "BRASS"){ return getPunchingForce(0.1724   , perimeter, thicknessOfMetal); }
}

// function getPunchingForce(shearStrength, perimeter, thicknessOfMetal){
//     return Math.round(((perimeter * thicknessOfMetal) * shearStrength) * 225).toFixed(0); 
// }

/**
 * Gets punching force of a metal, then converted to pound force.
 * @param {number} shearStrength Strength of metal (Kilo newtons)
 * @returns How much force is required to punch through the metal in pound force
 */
export function getPunchingForce(shearStrength, perimeter, thicknessOfMetal){
    return Math.round(((perimeter * thicknessOfMetal) * shearStrength) * 225).toFixed(0); 
}

function randomMetal(){
    var randomNum = (Math.floor(Math.random() * 15)) + 1;

    switch(randomNum){
        case 1: return "COPPER";
        case 2: return "IRON";
        case 3: return "SILVER";
        case 4: return "GOLD";
        case 5: return "LEAD";
        case 6: return "TIN";
        case 7: return "ZINC";
        case 8: return "BRONZE";
        case 9: return "TUNGSTEN";
        case 10: return "TITANIUM";
        case 11: return "STEEL";
        case 12: return "PLATINUM";
        case 13: return "NICKEL";
        case 14: return "ALUMINIUM";
        case 15: return "BRASS";
    }
}