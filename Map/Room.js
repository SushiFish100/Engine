

exports.createRoom = function createRoom(startPoint, exitPoint){

    //the smallest a room can be is 36x36 (4*9)
    //debating wether or not to have the size randomized
    var randomRoomSizeNum = ((Math.floor(Math.random() * 4)) + 4) * 9;// sizes so far: 36x36 45x45 54x54 63x63 (* 4 + 4) TODO: CHANGE BACK AFTER TESTING
    
    var startingPointX = 0;
    var startingPointY = 0;

    var endingPointX = 0;
    var endingPointY = 0;

    const charStart = "\u03A9";
    const charEnd = "\u03A8";

    console.log("Size of the whole room is: "+randomRoomSizeNum);

    var room = new Array(randomRoomSizeNum);

    for(var i = 0; i < room.length; i++){
        room[i] = new Array(room.length);
    }

    //first determine where the exit and the start are || 1 = north, 2 = south, 3 = west, 4 = east
    //depending on which side it starts on, the door can only be on the first line of that side

    //NO CORNOR STARTS EXAMPLE: 0,0 | MAX, 0 | 0, MAX | MAX, MAX
    //ACHIEVED BY DOING (randomRoomSizeNum - 2) + 1

    switch(startPoint){
        case 1: startingPointY = Math.floor(Math.random() * (randomRoomSizeNum - 2)) + 1;
                break;
        case 2: startingPointY = Math.floor(Math.random() * (randomRoomSizeNum - 2)) + 1;
                startingPointX = randomRoomSizeNum-1;
                break;
        case 3: startingPointX = Math.floor(Math.random() * (randomRoomSizeNum - 2)) + 1;
                break;
        case 4: startingPointX = Math.floor(Math.random() * (randomRoomSizeNum - 2)) + 1;
                startingPointY = randomRoomSizeNum-1;
                break;
    }

    switch(exitPoint){
        case 1: endingPointY = Math.floor(Math.random() * (randomRoomSizeNum - 2)) + 1;
                break;
        case 2: endingPointY = Math.floor(Math.random() * (randomRoomSizeNum - 2)) + 1;
                endingPointX = randomRoomSizeNum-1;
                break;
        case 3: endingPointX = Math.floor(Math.random() * (randomRoomSizeNum - 2)) + 1;
                break;
        case 4: endingPointX = Math.floor(Math.random() * (randomRoomSizeNum - 2)) + 1;
                endingPointY = randomRoomSizeNum-1;
                break;
    }

    
    room[startingPointX][startingPointY] = charStart;
    //console.log("Start is "+ startPoint);

    room[endingPointX][endingPointY] = charEnd;
    //console.log("Exit is "+ exitPoint);

    //MAKE SEGMENTS! refer to the design plans

    //how big is the segment?
    //NOTE: for now we'll just make the rooms range from 1 - 8 wide cubes

    //get starting point and try to create the room without going off the map
    //if it does redo the random segment size

    var generatedSegmentSize = 0;
    var segmentX = 0;
    var segmentY = 0;

    //Original starting point
    var originalStartingPointX = startingPointX;
    var originalStartingPointY = startingPointY;

    //Disable the direction if its getting to intimate with a side
    var isNorthToSouthError = false;
    var isSouthToNorthError = false;
    var isWestToEastError = false;
    var isEastToWestError = false;

    var isEnd = false; //used to exit room builder

    var isForwardDirectionAllowed = true; //chance of being false, then RNG takes the wheel
    const forwardDisableChance = 50; //0 out of 100

    //find out right now if it is diasabled or not ^^
    if((Math.floor(Math.random() * 100) + 1) < forwardDisableChance){
        isForwardDirectionAllowed = false;
    }
    
    var randomBuildDirection = 0; //1 = north, 2 = south, 3 = west, 4 = east

    const SEGMENTMAX = 4;//ADJUST MAX SIZE OF SEGMENTS
    const oppositeDirectionChanceNum = 80; //the 1 and 4 chance is stacked against it also | 0 OUT OF 100

for(var T = 0; isEnd === false; T++){

    do{
        generatedSegmentSize = ((Math.floor(Math.random() * SEGMENTMAX)) + 1); 
        //console.log("Segment Size: "+generatedSegmentSize);

        var isValidSegment = false;

        //refer to Segment Room Building design plan image
        //refer to Check Exit design plan 

        var isValidDirection = false;

        //make sure it didnt generate a direction causing path trouble
        do{

            randomBuildDirection = Math.floor(Math.random() * 4) + 1; // 1 to 4
            oppositeDirectionCancelChance = Math.floor(Math.random() * 100);

            if(((exitPoint === 1 && randomBuildDirection === 1) || (exitPoint === 2 && randomBuildDirection === 2) || 
            (exitPoint === 3 && randomBuildDirection === 3) || (exitPoint === 4 && randomBuildDirection === 4)) && (oppositeDirectionCancelChance > oppositeDirectionChanceNum)){

                //make it go to its path
                switch(randomBuildDirection){
                    case 1: randomBuildDirection = 2; break;
                    case 2: randomBuildDirection = 1; break;
                    case 3: randomBuildDirection = 4; break; 
                    case 4: randomBuildDirection = 3; break;
                }

            }

            //Disable the most straight forward path direction
            if(!isForwardDirectionAllowed){
                //TODO
            }

            if((isNorthToSouthError && randomBuildDirection == 1) || (isSouthToNorthError && randomBuildDirection == 2) || 
                (isWestToEastError && randomBuildDirection == 3) || (isEastToWestError && randomBuildDirection == 4)){
                isValidDirection = false;
            }else{
                isValidDirection = true;
            }

        }while(!isValidDirection);


        //NEW PLAN?: If the starting point is too close to the start keep going in the 
        //opposite direction until it is far enough away.. 

        //EXAMPLE: start is south, cant go down so keep going up...

        if(startPoint === 1 && startingPointX <= (SEGMENTMAX + 3)){
            randomBuildDirection = 1;
        }
        
        if(startPoint === 2 && startingPointX >= randomRoomSizeNum - (SEGMENTMAX + 3)){  
            randomBuildDirection = 2;
        }

        if(startPoint === 3 && startingPointY <= (SEGMENTMAX + 3)){
            randomBuildDirection = 3;
        }
        
        if(startPoint === 4 && startingPointY >= randomRoomSizeNum - (SEGMENTMAX + 3)){  
            randomBuildDirection = 4;
        }

        segmentX = startingPointX;
        segmentY = startingPointY;

        //GENERATE THE STARTING POINT OF THE NEW SEGMENT

        //Down, Left | Builds Southward later
        if(randomBuildDirection == 1){
            segmentX = startingPointX + 1;
            segmentY = startingPointY - Math.floor(generatedSegmentSize / 2);
        }

        //Up, Right | Builds Northward later
        if(randomBuildDirection == 2){
            segmentX = startingPointX - 1;
            segmentY = (Math.floor(startingPointY + Math.floor(generatedSegmentSize / 2)));
        }

        //Right, Down | Builds Eastward later
        if(randomBuildDirection == 3){
            segmentX = startingPointX + Math.floor(generatedSegmentSize / 2);
            segmentY = startingPointY + 1;
        }

        //Left, Up | Builds Westward later
        if(randomBuildDirection == 4){
            segmentX = startingPointX - Math.floor(generatedSegmentSize / 2);
            segmentY = startingPointY - 1;
        }

        //find out if the data can fit without causing out of bound exceptions / errors
        //Sometimes i forget what i smoked to get these perfectly working equations so i can remember how they worked

        if((segmentX >= 0 && segmentX < randomRoomSizeNum) && (segmentY >= 0 && segmentY < randomRoomSizeNum)){
            //north
            if( randomBuildDirection == 1 && startingPointY + Math.floor(generatedSegmentSize / 2) < randomRoomSizeNum){
                room[segmentX][segmentY] = "-";
                isValidSegment = true;
            }

            //south
            if( randomBuildDirection == 2 && startingPointX - Math.floor(generatedSegmentSize) >= 0){
                room[segmentX][segmentY] = "=";
                if(generatedSegmentSize == 1 && room[segmentX+1][segmentY] == null){
                    console.log(" X:" + segmentX +" Y:"+ segmentY);
                    room[segmentX+1][segmentY] = "=";
                }
                isValidSegment = true;
            }

            //west
            if( randomBuildDirection == 3 && startingPointY + Math.floor(generatedSegmentSize / 2) < randomRoomSizeNum){
                room[segmentX][segmentY] = "+";
                if(generatedSegmentSize == 1 && room[segmentX][segmentY-1] == null){
                    console.log(" X:" + segmentX +" Y:"+ segmentY);
                    room[segmentX][segmentY-1] = "+";
                }
                isValidSegment = true;
            }

            //east
            if( randomBuildDirection == 4 && startingPointY - Math.floor(generatedSegmentSize / 2) < randomRoomSizeNum){
                room[segmentX][segmentY] = "_";
                if(generatedSegmentSize == 1 && room[segmentX][segmentY+1] == null){
                    console.log(" X:" + segmentX +" Y:"+ segmentY);
                    room[segmentX][segmentY-1] = "_";
                }
                isValidSegment = true;
            }
        }

        if(isValidSegment == false){
            //console.log("SEGMENT REGECTED: X:"+segmentX+" Y:"+segmentY);
        }

        //console.log("Room should be "+generatedSegmentSize+"x"+generatedSegmentSize+". Going in the direction of: "+randomBuildDirection);
        //console.log("SegmentX: "+segmentX);
        //console.log("SegmentY: "+segmentY);

        //Exit cause the segment is 1x1 and is already built
        if(generatedSegmentSize == 1){
            break;
        }

    }while(!isValidSegment); //uses break to exit the while loop

    var segmentIteratorSteps = generatedSegmentSize - 1; //how long each strip of segment is

    var segmentStepNum = 0; //builds the segment making sure it doesnt go over segmentIteratorSteps

    var isDone = false; //Used to find out when the segment is done

    //A special first phase of the segment builder because the startingPoint defined
    //and set a point in the segment making one less point in the segment to build
    var isFirstPhase = true; 

    if(generatedSegmentSize != 1){
        for(var i = 0; !isDone; i++){

            if(randomBuildDirection == 1){

                //has it reach the ending side?
                if((exitPoint == 1 && segmentX == 0) || (exitPoint == 2 && segmentX == (randomRoomSizeNum - 1)) || 
                    (exitPoint == 3 && segmentY == 0) || (exitPoint == 4 && segmentY == (randomRoomSizeNum - 1))){
                    isEnd = true; 
                    room[endingPointX][endingPointY] = "X";
                    room[segmentX][segmentY] = charEnd; 
                    endingPointX = segmentX;
                    endingPointY = segmentY;
                }

                if(i <= segmentIteratorSteps - 1 && isFirstPhase && segmentY + 1 < randomRoomSizeNum && generatedSegmentSize > 1){
                    segmentY++;
                    //console.log("Y: "+segmentY);

                    if(room[segmentX][segmentY] != charEnd && room[segmentX][segmentY] != charStart)
                        room[segmentX][segmentY] = "-";

                    if(room[segmentX][segmentY] === charEnd){
                        isEnd = true;
                    }

                    continue;
                }

                if(i <= segmentIteratorSteps && !isFirstPhase && segmentY + 1 < randomRoomSizeNum && generatedSegmentSize > 1){
                    segmentY++;
                    //console.log("Y: "+segmentY);

                    if(room[segmentX][segmentY] != charEnd && room[segmentX][segmentY] != charStart)
                        room[segmentX][segmentY] = "-";

                    if(room[segmentX][segmentY] === charEnd){
                        isEnd = true;
                    }

                    continue;
                }

                if(segmentStepNum <= segmentIteratorSteps - 1 && segmentX + 1 < randomRoomSizeNum && generatedSegmentSize > 1){

                    isFirstPhase = false;
                    segmentStepNum++;
                    i = 0;
                    segmentX++;
                    segmentY = startingPointY - Math.floor(generatedSegmentSize / 2);
                    //console.log("X: "+segmentX+" Y:"+segmentY);

                    if(room[segmentX][segmentY] != charEnd && room[segmentX][segmentY] != charStart)
                        room[segmentX][segmentY] = "-";

                    if(room[segmentX][segmentY] === charEnd){
                        isEnd = true;
                    }

                    continue;
                }
            }

            if(randomBuildDirection == 2){

                //has it reach the ending side?
                if((exitPoint == 1 && segmentX == 0) || (exitPoint == 2 && segmentX == (randomRoomSizeNum - 1)) || 
                    (exitPoint == 3 && segmentY == 0) || (exitPoint == 4 && segmentY == (randomRoomSizeNum - 1))){
                    isEnd = true; 
                    room[endingPointX][endingPointY] = "X";
                    room[segmentX][segmentY] = charEnd; 
                    endingPointX = segmentX;
                    endingPointY = segmentY;
                }

                if(i <= segmentIteratorSteps - 1 && isFirstPhase && segmentY - 1 >= 0 && generatedSegmentSize > 1){

                    segmentY--;
                    //console.log("Y: "+segmentY);

                    if(room[segmentX][segmentY] != charEnd && room[segmentX][segmentY] != charStart) 
                        room[segmentX][segmentY] = "=";

                    if(room[segmentX][segmentY] === charEnd){
                        isEnd = true;
                    }

                    continue;
                }

                if(i <= segmentIteratorSteps && !isFirstPhase && segmentY - 1 >= 0 && generatedSegmentSize > 1){
                    segmentY--;
                    //console.log("Y: "+segmentY);

                    if(room[segmentX][segmentY] != charEnd && room[segmentX][segmentY] != charStart)
                        room[segmentX][segmentY] = "=";

                    if(room[segmentX][segmentY] === charEnd){
                        isEnd = true;
                    }

                    continue;
                }

                if(segmentStepNum <= segmentIteratorSteps - 1 && segmentX - 1 >= 0 && generatedSegmentSize > 1){
                    isFirstPhase = false;
                    segmentStepNum++;
                    i = 0;
                    segmentX--;
                    segmentY = startingPointY + Math.floor(generatedSegmentSize / 2);
                    
                    //console.log("X: "+segmentX+" Y:"+segmentY);

                    if(room[segmentX][segmentY] != charEnd && room[segmentX][segmentY] != charStart)
                        room[segmentX][segmentY] = "=";

                    if(room[segmentX][segmentY] === charEnd){
                        isEnd = true;
                    }

                    continue;
                }
            }

            if(randomBuildDirection == 3){

                //has it reach the ending side?
                if((exitPoint == 1 && segmentX == 0) || (exitPoint == 2 && segmentX == (randomRoomSizeNum - 1)) || 
                    (exitPoint == 3 && segmentY == 0) || (exitPoint == 4 && segmentY == (randomRoomSizeNum - 1))){
                    isEnd = true; 
                    room[endingPointX][endingPointY] = "X";
                    room[segmentX][segmentY] = charEnd; 
                    endingPointX = segmentX;
                    endingPointY = segmentY;
                    console.log("END");
                }

                if(i <= segmentIteratorSteps - 1 && isFirstPhase && segmentX - 1 >= 0 && generatedSegmentSize > 1){

                    segmentX--;
                    //console.log("Y: "+segmentY);

                    if(room[segmentX][segmentY] != charEnd && room[segmentX][segmentY] != charStart) 
                        room[segmentX][segmentY] = "+";

                    if(room[segmentX][segmentY] === charEnd){
                        isEnd = true;
                    }

                    continue;
                }

                if(i <= segmentIteratorSteps && !isFirstPhase && segmentX - 1 >= 0 && generatedSegmentSize > 1){
                    segmentX--;
                    //console.log("Y: "+segmentY);

                    if(room[segmentX][segmentY] != charEnd && room[segmentX][segmentY] != charStart)
                        room[segmentX][segmentY] = "+";

                    if(room[segmentX][segmentY] === charEnd){
                        isEnd = true;
                    }

                    continue;
                }

                if(segmentStepNum <= segmentIteratorSteps - 1 && segmentY + 1 < randomRoomSizeNum && generatedSegmentSize > 1){
                    isFirstPhase = false;
                    segmentStepNum++;
                    i = 0;
                    segmentX = startingPointX + Math.floor(generatedSegmentSize / 2)
                    segmentY++;
                    
                    //console.log("X: "+segmentX+" Y:"+segmentY);

                    if(room[segmentX][segmentY] != charEnd && room[segmentX][segmentY] != charStart)
                        room[segmentX][segmentY] = "+";

                    if(room[segmentX][segmentY] === charEnd){
                        isEnd = true;
                    }

                    continue;
                }
            }

            if(randomBuildDirection == 4){

                //has it reach the ending side?
                if((exitPoint == 1 && segmentX == 0) || (exitPoint == 2 && segmentX == (randomRoomSizeNum - 1)) || 
                    (exitPoint == 3 && segmentY == 0) || (exitPoint == 4 && segmentY == (randomRoomSizeNum - 1))){
                    isEnd = true; 
                    room[endingPointX][endingPointY] = "X";
                    room[segmentX][segmentY] = charEnd; 
                    endingPointX = segmentX;
                    endingPointY = segmentY;
                    console.log("END");
                }

                if(i <= segmentIteratorSteps - 1 && isFirstPhase && segmentX + 1 < randomRoomSizeNum && generatedSegmentSize > 1){

                    segmentX++;
                    //console.log("Y: "+segmentY);

                    if(room[segmentX][segmentY] != charEnd && room[segmentX][segmentY] != charStart) 
                        room[segmentX][segmentY] = "_";

                    if(room[segmentX][segmentY] === charEnd){
                        isEnd = true;
                    }

                    continue;
                }

                if(i <= segmentIteratorSteps && !isFirstPhase && segmentX + 1 < randomRoomSizeNum && generatedSegmentSize > 1){
                    segmentX++;
                    //console.log("Y: "+segmentY);

                    if(room[segmentX][segmentY] != charEnd && room[segmentX][segmentY] != charStart)
                        room[segmentX][segmentY] = "_";

                    if(room[segmentX][segmentY] === charEnd){
                        isEnd = true;
                    }

                    continue;
                }

                if(segmentStepNum <= segmentIteratorSteps - 1 && segmentY - 1 >= 0 && generatedSegmentSize > 1){
                    isFirstPhase = false;
                    segmentStepNum++;
                    i = 0;
                    segmentX = startingPointX - Math.floor(generatedSegmentSize / 2)
                    segmentY--;
                    
                    //console.log("X: "+segmentX+" Y:"+segmentY);

                    if(room[segmentX][segmentY] != charEnd && room[segmentX][segmentY] != charStart)
                        room[segmentX][segmentY] = "_";

                    if(room[segmentX][segmentY] === charEnd){
                        isEnd = true;
                    }

                    continue;
                }
            }
            
            isDone = true;

        }
    }

    //ayy what do you know, it works! Refer to design phase #3 plans

    var newX = 0;
    var newY = 0;
    var isValidStartingPoint = false;

    var tempIterator = 0;

    do{
        
        //Creates a new starting point to build from north to south
        if(randomBuildDirection === 1){
            newX = (Math.floor(Math.random() * generatedSegmentSize) + startingPointX) + 1;
            newY = (Math.floor(Math.random() * generatedSegmentSize) + startingPointY - Math.floor(generatedSegmentSize / 2));
        }

        //Creates a new starting point to build from south to north
        if(randomBuildDirection === 2){
            newX = (Math.floor(Math.random() * generatedSegmentSize) + startingPointX - Math.floor(generatedSegmentSize));

            if(generatedSegmentSize % 2 != 0){
                newY = (Math.floor(Math.random() * generatedSegmentSize) + startingPointY - Math.floor(generatedSegmentSize / 2));
            }else{
                newY = (Math.floor(Math.random() * generatedSegmentSize) + startingPointY) - Math.round(generatedSegmentSize / 3);
            }
        }

        //Creates a new starting point to build from west to east
        if(randomBuildDirection === 3){
            if(generatedSegmentSize > 1){
                newX = (Math.floor(Math.random() * generatedSegmentSize) + startingPointX - 1);
            }else{
                newX = (Math.floor(Math.random() * generatedSegmentSize) + startingPointX)
            }
    
            newY = (Math.floor(Math.random() * generatedSegmentSize) + startingPointY + 1);
        }

        //Creates a new starting point to build from west to east
        if(randomBuildDirection === 4){
            if(generatedSegmentSize > 1){
                newX = (Math.floor(Math.random() * generatedSegmentSize) + startingPointX - 1);
            }else{
                newX = (Math.floor(Math.random() * generatedSegmentSize) + startingPointX)
            }
    
            newY = (Math.floor(Math.random() * generatedSegmentSize) + startingPointY - generatedSegmentSize);
        }


        if((newX >= 0 && newX < randomRoomSizeNum) && (newY >= 0 && newY < randomRoomSizeNum)){
            isValidStartingPoint = true;
        }

        //replace the starting point and disable the 
        //option to go the direction it stopped at
        if(tempIterator > 100){

            //disable
            if(randomBuildDirection == 1){
                isNorthToSouthError = true;
            }

            if(randomBuildDirection == 2){
                isSouthToNorthError = true;
            }

            if(randomBuildDirection == 3){
                isWestToEastError = true;
            }

            if(randomBuildDirection == 4){
                isEastToWestError = true;
            }

            startingPointX = originalStartingPointX;
            startingPointY = originalStartingPointY;
            break;
        }

        tempIterator++;

    }while(!isValidStartingPoint);

    //console.log(generatedSegmentSize);
    //console.log("New Starting Point X: " + newX);
    //console.log("New Starting Point Y: " + newY);

  
    /*for(var i = 0; i < 50; i++){
        if(i % 10 == false){
            generatedSegmentSize = ((Math.floor(Math.random() * 2)) + 1);  
            console.log("NEW SIZE: "+generatedSegmentSize);
        }

        if(generatedSegmentSize > 1){
            newX = (Math.floor(Math.random() * generatedSegmentSize) + startingPointX - 1);
        }else{
            newX = (Math.floor(Math.random() * generatedSegmentSize) + startingPointX)
        }

        newY = (Math.floor(Math.random() * generatedSegmentSize) + startingPointY - generatedSegmentSize);
        

        console.log(" X:" + newX +" Y:"+ newY);
    }*/

    if(tempIterator < 100){
        startingPointX = newX;
        startingPointY = newY;
    }
    
}

    console.log("Reached End Side: "+isEnd);

    room[endingPointX][endingPointY] = charEnd;

    //debugging
    var str = "";

    var isInvert = false;

    for(var i = 0; i < room.length; i++){
        for(var j = 0; j < room[i].length; j++){
            if(room[i][j] === charStart){
                str+=charStart; 
            }else if(room[i][j] === charEnd){
                str+=charEnd; 
            }else if(room[i][j] === "-"){
                if(isInvert){str+=" ";}else{str+="N";}
            }else if(room[i][j] === "="){
                if(isInvert){str+=" ";}else{str+="S";}
            }else if(room[i][j] === "+"){
                if(isInvert){str+=" ";}else{str+="W";}
            }else if(room[i][j] === "_"){
                if(isInvert){str+=" ";}else{str+="E";}
            }else if(room[i][j] === "X"){
                str+="X"; 
            }else{
                if(isInvert){str+="\u220E";}else{str+="-";}
            }
        }
        str += "\n";
    }

    console.log(str);
}