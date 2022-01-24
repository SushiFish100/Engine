import { Area } from "../Global/Map/Area/Area.js";
import { path } from "../Global/path.js";
import { door, iron_door } from "../Objects/Structures/door.js";

export function createMap(sizeX,sizeY){
    
    let map = new Array(sizeX);

    for(var i = 0; i < map.length; i++){
        map[i] = new Array(sizeY);
    }

    for(var i = 0; i < map.length; i++){
        for(var j = 0; j < map[i].length; j++){
            map[i][j] = "0";
        }
    }

    //set the starting location
    var randomStartX = (Math.floor(Math.random() * sizeX));
    var randomStartY = (Math.floor(Math.random() * sizeY));

    map[randomStartX][randomStartY] = "S"; //start
    console.log("Start Location: X:" + randomStartX + " Y:" + randomStartY);

    //set the ending location, making sure it doesnt on the starting location
    do{
        var randomEndX = (Math.floor(Math.random() * sizeX));
        var randomEndY = (Math.floor(Math.random() * sizeY));

        console.log("END Location: X:" + randomEndX + " Y:" + randomEndY);

    }while(randomEndX == randomStartX && randomEndY == randomStartY);    

    map[randomEndX][randomEndY] = "E"; //end

    //create path
    var pathX = randomStartX;
    var pathY = randomStartY;

    var isPathCreated = false;

    //number of random moves
    var moveInstances = 0;

    //Used to direct the path flow. Right now one step forward will activate the randomness of directions.
    var pathStepsNum = 0; 

    //keep checking if the map has reached the end point
    while((pathX != randomEndX || pathY != randomEndY) && isPathCreated == false){
        pathStepsNum++;

        if((pathX+1 == randomEndX || pathX-1 == randomEndX) && pathY == randomEndY){
            isPathCreated = true;
            continue;
        }else if((pathY+1 == randomEndY || pathY-1 == randomEndY) && pathX == randomEndX){
            isPathCreated = true;
            continue;
        }
        
        //so far a 1 and 4 chance of the map actually going to its designated path 
        //3 and 4 chance of path going in a random direction
        var randomPathRoot = (Math.floor(Math.random() * 4));

        if(randomPathRoot === 0 && moveInstances === 0){
            if(pathX > randomEndX && pathX-1 !=  -1){
                pathX--; map[pathX][pathY] = "-";
            }else if(pathX < randomEndX && pathX+1 !=  sizeX){
                pathX++; map[pathX][pathY] = "-";
            }else if(pathY > randomEndY && pathY-1 !=  -1){
                pathY--; map[pathX][pathY] = "-";
            }else if(pathY < randomEndY && pathY+1 !=  sizeY){
                pathY++; map[pathX][pathY] = "-";
            }

            console.log("PATH X:" +pathX+ " Y:" +pathY+" Path finder");

        }else if(randomPathRoot > 0 && pathStepsNum > 1){
            if(moveInstances === 0)
                moveInstances = (Math.floor(Math.random() * 3)) + 1;

            var randDirection = (Math.floor(Math.random() * 4)) + 1;

            if(randDirection === 1 && pathX-1 != -1 && (pathX-1 != randomStartX && pathY != randomStartY)){
                pathX--; map[pathX][pathY] = "-";
            }else if(randDirection === 2 && pathX+1 != sizeX && (pathX+1 != randomStartX && pathY != randomStartY)){
                pathX++; map[pathX][pathY] = "-";
            }else if(randDirection === 3 && pathY-1 != -1 && (pathX != randomStartX && pathY-1 != randomStartY)){
                pathY--; map[pathX][pathY] = "-";
            }else if(randDirection === 4 && pathY+1 != sizeY && (pathX != randomStartX && pathY+1 != randomStartY)){
                pathY++; map[pathX][pathY] = "-";
            }

            console.log("PATH X:"+pathX+" Y:"+pathY+" "+" Random path finder"+ "Move instances: "+moveInstances);
            moveInstances--;

        }

        //debug stuff
        if(pathStepsNum == 1 && randomPathRoot === 1)
            console.log("Random path aborted (pathStepsNum isnt greater then 1)");
    }

    //print map for debug purposes
    var str = "";

    var numOfTiles = 0;
    var numOfUsedTiles = 0;

    var start = new Area();
    start.name = "start";
    start.image = 'start.png';
    start.imageFolder = path + '/Images/Area/';

    var end = new Area();
    end.name = "end";
    end.image = 'end.png';
    end.imageFolder = path + '/Images/Area/';

    console.log(map.length);
    console.log(map[0].length);

    for(var i = 0; i < map.length; i++){
        for(var j = 0; j < map[i].length; j++){

            var area = new Area();
            area.name = "tester";
            area.image = 'outside.png';
            area.imageFolder = path + '/Images/Area/';

            numOfTiles++;
            if(map[i][j] === "S"){
                map[i][j]=start; numOfUsedTiles++;
            }else if(map[i][j] === "E"){
                map[i][j]=end; numOfUsedTiles++;
            }else if(map[i][j] === "-"){
                area.density = false;
                map[i][j]=area; numOfUsedTiles++;
            }else{
                area.image = 'wall.png';
                area.density = true;
                map[i][j]=area;
            }
        }
    }

    console.log(str+"\nSteps taken to reach end:"+(numOfUsedTiles-2));
    console.log(numOfUsedTiles+"/"+numOfTiles+" tiles that were filled out.");

    return map;
}

export function createDevMap(sizeX,sizeY){
    let map = new Array(sizeX);

    for(var i = 0; i < map.length; i++){
        map[i] = new Array(sizeY);
    }

    for(var i = 0; i < map.length; i++){
        for(var j = 0; j < map[i].length; j++){
            map[i][j] = "-";
        }
    }

//=-=-=-=-=-=-=-=-=-=-=-=
    map[0][0] = 'S';

    map[1][5] = '0';
    map[1][7] = '0';
    map[3][5] = '0';
    map[3][7] = '0';

    map[6][3] = '0';
    map[6][4] = "D";
    map[6][5] = 'D';
    map[6][6] = '0';
    map[6][7] = '0';
    map[6][8] = '0';
    
    map[11][3] = '0';
    map[11][4] = '0';
    map[11][5] = '0';
    map[11][6] = '0';
    map[11][7] = 'ID';
    map[11][8] = '0';

    map[7][8] = '0';
    map[8][8] = '0';
    map[9][8] = '0';
    map[10][8] = '0';

    map[7][3] = '0';
    map[8][3] = '0';
    map[9][3] = '0';
    map[10][3] = "L";
    
//
    map[sizeX-1][sizeY-1] = 'E';
//


    var numOfTiles = 0;
    var numOfUsedTiles = 0;

    var start = new Area();
    start.name = "start";
    start.image = 'start.png';
    start.imageFolder = path + '/Images/Area/';

    var end = new Area();
    end.name = "end";
    end.image = 'end.png';
    end.imageFolder = path + '/Images/Area/';

    console.log(map.length);
    console.log(map[0].length);

    for(var i = 0; i < map.length; i++){
        for(var j = 0; j < map[i].length; j++){

            var area = new Area();
            area.name = "Floor";
            area.image = 'outside.png';
            area.imageFolder = path + '/Images/Area/';

            numOfTiles++;
            if(map[i][j] === "S"){
                map[i][j]=start; numOfUsedTiles++;
            }else if(map[i][j] === "E"){
                map[i][j]=end; numOfUsedTiles++;
            }else if(map[i][j] === "-"){
                area.density = false;
                map[i][j]=area; numOfUsedTiles++;
            }else if(map[i][j] === "D"){
                map[i][j] = new door();
            }else if(map[i][j] === "L"){
                var d = new door();
                d.name = "asdas";
                d.isLocked = true;
                map[i][j] = d
            }else if(map[i][j] === "ID"){
                var d = new iron_door();
                map[i][j] = d
            }else{
                area.name = 'Wall';
                area.image = 'wall.png';
                area.density = true;
                map[i][j]=area;
            }
        }
    }

    return map;
}