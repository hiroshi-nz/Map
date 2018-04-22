/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
                      
function addSquareOnMap(map, startX, endX, startZ, endZ, id){
    for(var i = startZ; i <= endZ; i ++){
        for(var j = startX; j <= endX; j ++){//draw a line on the map array horizontal
            map.map[i +  map.offsetZ][j + map.offsetX] = id;
        }
    }
}

function addBuildingOnMap(map, startX, endX, startZ, endZ, id){
    for(var i = startZ; i <= endZ; i ++){//draw a line on the map array vertical
        map.map[i + map.offsetZ][startX + map.offsetX] = id;
        map.map[i + map.offsetZ][endX + map.offsetX] = id;
    }
    for(var i = startX; i <= endX; i ++){//draw a line on the map array horizontal
        map.map[startZ + map.offsetZ][i + map.offsetX] = id;
        map.map[endZ + map.offsetZ][i + map.offsetX] = id;
    }
}

function deleteVerticalOnMap(map, x, startZ, endZ, id){//entrance of building. use id = 0
    for(var i = startZ; i <= endZ; i ++){//draw a line on the map array vertical
        map.map[i + map.offsetZ][x + map.offsetX] = id;
    }
}
function deleteHorizontalOnMap(map, z, startX, endX, id){//entrance of building. use id = 0
    for(var i = startX; i <= endX; i++){//draw a line on the map array vertical
        map.map[z + map.offsetZ][i + map.offsetX] = id;
    }
}

function addMansion(map){
    //x axis is inverted on the graphics...
    addBuildingOnMap(map, -49, 49, -49, 49, 200);//outside boundary

    addBuildingOnMap(map, -3, 3, 5, 11, 200);//porch
    addBuildingOnMap(map, -20, 20, 11, 17, 200);//corridor
    addBuildingOnMap(map, -30, -20, 11, 27, 200);//left wing
    addBuildingOnMap(map, -20, -10, 17, 27, 200);//center left room
    addBuildingOnMap(map, -10, 10, 17, 27, 200);//center room
    addBuildingOnMap(map, 10, 20, 17, 27, 200);//center right room
    addBuildingOnMap(map, 20, 30, 11, 27, 200);//right wing

    deleteHorizontalOnMap(map, 5, -1, 1, 0);//porch entrance
    deleteHorizontalOnMap(map, 11, -1, 1, 0);//corridor entrance
    deleteVerticalOnMap(map, -20, 13, 15, 0);//left wing entrance
    deleteHorizontalOnMap(map, 17, -18, -16, 0);//center left room entrance
    deleteHorizontalOnMap(map, 17, -1, 1, 0);//center room entrance
    deleteHorizontalOnMap(map, 17, 16, 18, 0);//center right room entrance
    deleteVerticalOnMap(map, 20, 13, 15, 0);//right wing entrance
}    
                        