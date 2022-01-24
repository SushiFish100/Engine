
//All the possible make ups of creatures (Used for random mutations or events)
export var globalCreatureMaterialTags = ["ORGANIC", "WATER", "CRYSTAL", "VOMIT", "PUKE", "HAIR", "GLASS", "ASH","FLAMING","METAL"];

//All creature flags available
export var globalCreatureFlags = ["FLAMMABLE", "NONFLAMMABLE", "SLOW", "ARMOURED", "FRAGILE", "GROSS", "CUTTABLE", "DUMB",
                            "GLOWING", "HOT"];

//All flags a item can have.                            
export var globalItemFlags = ["FIRE_PROOF", "EXPLOSION_PROOF", "INDESTRUCTIBLE", "VOID_PROOF", "MAGIC_PROOF", "LAVA_PROOF"];

//All types of metal | When adding on to this list edit the material function materialMetalToPunctureForce() and randomMetal()
export var globalMetalTypes = ["COPPER", "IRON", "SILVER", "GOLD", "LEAD", "TIN", "ZINC", "BRONZE", "TUNGSTEN", "TITANIUM", "STEEL",
"PLATINUM", "NICKEL", "ALUMINIUM", "BRASS"];

//Tile size, no matter what it will always be square hense the single variable
export var TILE_SIZE = 64;
