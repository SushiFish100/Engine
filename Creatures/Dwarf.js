export default{
    Creature :{
        "NAME": "Dwarf",
        "IMAGE": "dwarf",
        "IMAGE_FOLDER": "/Images/tester/",
        "MATERIAL": "ORGANIC",
        "HEIGHT": 90,
        "WIDTH": 25,
        "LENGTH": 15,
        "MASS": 120,
        "CREATURE_STATUS":{
            "STR": 8,
            "AGL": 10,
            "END": 5,
            "MEN": 4,
            "INT": 5
        },
        "ADD_TO_ALL_SEGMENTS":[
            {
                "PART": "Skin",
                "TYPE": "Skin"
            },
            {
                "PART": "Fat",
                "TYPE": "Flesh"
            },
            {
                "PART": "Meat",
                "TYPE": "Flesh"
            },
            {
                "PART": "Muscle",
                "TYPE": "Flesh"
            },
            {
                "PART": "Vein",
                "TYPE": "Vessel"
            },
            {
                "PART": "Artery",
                "TYPE": "Vessel"
            }
        ],
        "BODY":[
            { "PART": "First Upper Left Rib", "MASS": 1, "BELONGS_TO": "Upper Body", "TYPE": "Bone", "CONNECTED_TO": "Head" },
            { "PART": "Second Upper Left Rib", "MASS": 1, "BELONGS_TO": "Upper Body", "TYPE": "Bone", "CONNECTED_TO": "Head" },
            { "PART": "Third Upper Left Rib", "MASS": 1, "BELONGS_TO": "Upper Body", "TYPE": "Bone", "CONNECTED_TO": "Head" },
            { "PART": "Fourth Upper Left Rib", "MASS": 1, "BELONGS_TO": "Upper Body", "TYPE": "Bone", "CONNECTED_TO": "Head" },
            { "PART": "Fifth Upper Left Rib", "MASS": 1, "BELONGS_TO": "Upper Body", "TYPE": "Bone", "CONNECTED_TO": "Head" },
            { "PART": "Sixth Upper Left Rib", "MASS": 1, "BELONGS_TO": "Upper Body", "TYPE": "Bone", "CONNECTED_TO": "Head" },
            { "PART": "First Upper Right Rib", "MASS": 1, "BELONGS_TO": "Upper Body", "TYPE": "Bone", "CONNECTED_TO": "Head" },
            { "PART": "Second Upper Right Rib", "MASS": 1, "BELONGS_TO": "Upper Body", "TYPE": "Bone", "CONNECTED_TO": "Head" },
            { "PART": "Third Upper Right Rib", "MASS": 1, "BELONGS_TO": "Upper Body", "TYPE": "Bone", "CONNECTED_TO": "Head" },
            { "PART": "Fourth Upper Right Rib", "MASS": 1, "BELONGS_TO": "Upper Body", "TYPE": "Bone", "CONNECTED_TO": "Head" },
            { "PART": "Fifth Upper Right Rib", "MASS": 1, "BELONGS_TO": "Upper Body", "TYPE": "Bone", "CONNECTED_TO": "Head" },
            { "PART": "Sixth Upper Right Rib", "MASS": 1, "BELONGS_TO": "Upper Body", "TYPE": "Bone", "CONNECTED_TO": "Head" },
            { "PART": "Spine", "MASS": 1, "BELONGS_TO": "Upper Body", "TYPE": "Bone", "CONNECTED_TO": "Head" },
            { "PART": "Spine", "MASS": 1, "BELONGS_TO": "Lower Body", "TYPE": "Bone", "CONNECTED_TO": "Upper Body" },
            { "PART": "Gut", "MASS": 1, "BELONGS_TO": "Lower Body", "TYPE": "Organ", "CONNECTED_TO": "Upper Body" },
            { "PART": "Left Kidney", "MASS": 1, "BELONGS_TO": "Upper Body", "TYPE": "Organ", "CONNECTED_TO": "Head" },
            { "PART": "Right Kidney", "MASS": 1, "BELONGS_TO": "Upper Body", "TYPE": "Organ", "CONNECTED_TO": "Head" },
            { "PART": "Liver", "MASS": 1, "BELONGS_TO": "Lower Body", "TYPE": "Organ", "CONNECTED_TO": "Upper Body" },
            { "PART": "Left Lung", "MASS": 1, "BELONGS_TO": "Upper Body", "TYPE": "Organ", "CONNECTED_TO": "Head", "SPECIAL_TAG": "BREATHE" },
            { "PART": "Right Lung", "MASS": 1, "BELONGS_TO": "Upper Body", "TYPE": "Organ", "CONNECTED_TO": "Head", "SPECIAL_TAG": "BREATHE" },
            { "PART": "Colon", "MASS": 1, "BELONGS_TO": "Lower Body", "TYPE": "Organ", "CONNECTED_TO": "Upper Body" },
            { "PART": "Stomach", "MASS": 1, "BELONGS_TO": "Lower Body", "TYPE": "Organ", "CONNECTED_TO": "Upper Body" },
            { "PART": "Bladder", "MASS": 1, "BELONGS_TO": "Lower Body", "TYPE": "Organ", "CONNECTED_TO": "Upper Body" },
            { "PART": "Pancreas", "MASS": 1, "BELONGS_TO": "Lower Body", "TYPE": "Organ", "CONNECTED_TO": "Upper Body" },
            { "PART": "Heart", "MASS": 1, "BELONGS_TO": "Upper Body", "TYPE": "Organ", "CONNECTED_TO": "Head" },
            { "PART": "Tendon", "MASS": 1, "BELONGS_TO": "Upper Body", "TYPE": "Tissue", "CONNECTED_TO": "Head" },
            { "PART": "Ligament", "MASS": 1, "BELONGS_TO": "Upper Body", "TYPE": "Tissue", "CONNECTED_TO": "Head" },
            { "PART": "Brain", "MASS": 1, "BELONGS_TO": "Head", "TYPE": "Organ", "CONNECTED_TO": "NONE" },
            { "PART": "Left Eye", "MASS": 1, "BELONGS_TO": "Head", "TYPE": "Organ", "CONNECTED_TO": "NONE", "SPECIAL_TAG": "SEE" },
            { "PART": "Right Eye", "MASS": 1, "BELONGS_TO": "Head", "TYPE": "Organ", "CONNECTED_TO": "NONE", "SPECIAL_TAG": "SEE" },
            { "PART": "Jaw", "MASS": 1, "BELONGS_TO": "Head", "TYPE": "Bone", "CONNECTED_TO": "NONE" },
            { "PART": "Skull", "MASS": 1, "BELONGS_TO": "Head", "TYPE": "Bone", "CONNECTED_TO": "NONE" },
            { "PART": "Nose", "MASS": 1, "BELONGS_TO": "Head", "TYPE": "Bone", "CONNECTED_TO": "NONE" },
            { "PART": "Tendon", "MASS": 1, "BELONGS_TO": "Head", "TYPE": "Tissue", "CONNECTED_TO": "NONE" },
            { "PART": "Ligament", "MASS": 1, "BELONGS_TO": "Head", "TYPE": "Tissue", "CONNECTED_TO": "NONE" },

            { "PART": "Upper Leg", "MASS": 1, "BELONGS_TO": "Upper Left Leg", "TYPE": "Bone", "CONNECTED_TO": "Lower Body" },
            { "PART": "Lower Leg", "MASS": 1, "BELONGS_TO": "Lower Left Leg", "TYPE": "Bone", "CONNECTED_TO": "Upper Left Leg" },
            { "PART": "Foot", "MASS": 1, "BELONGS_TO": "Left Foot", "TYPE": "Bone", "CONNECTED_TO": "Lower Left Leg" },

            { "PART": "Upper Leg", "MASS": 1, "BELONGS_TO": "Upper Right Leg", "TYPE": "Bone", "CONNECTED_TO": "Lower Body" },
            { "PART": "Lower Leg", "MASS": 1, "BELONGS_TO": "Lower Right Leg", "TYPE": "Bone", "CONNECTED_TO": "Upper Right Leg" },
            { "PART": "Foot", "MASS": 1, "BELONGS_TO": "Right Foot", "TYPE": "Bone", "CONNECTED_TO": "Lower Right Leg" },
        ]
    
    }
}