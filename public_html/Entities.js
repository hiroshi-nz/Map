/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Entities(){
    this.entityArray = [];
    this.addEntity = function(entity){
        this.entityArray.push(entity);
    };                  
    this.searchByID = function(id){
        for(var i = 0; i < this.entityArray.length; i++){
            if(this.entityArray[i].id === id){
                return i;
            }
        }
        console.log("Could not find entity with that ID.");
    };
    this.searchAllByID = function(id){
        var matchArray = [];
        for(var i = 0; i < this.entityArray.length; i++){
            if(this.entityArray[i].id === id){
                matchArray.push(i);
            }
        }
        console.log("Could not find entity with that ID.");
    };
    this.checkAliveByID = function(id){
        for(var i = 0; i < this.entityArray.length; i++){
            if(this.entityArray[i].id === id){
                return this.entityArray[i].alive;
            }
        }
        console.log("Could not find entity with that ID.");
    };

    this.killByID = function(id){
        for(var i = 0; i < this.entityArray.length; i++){
            if(this.entityArray[i].id === id){
                this.entityArray[i].alive = false;
            }
        }
    };
    this.countAlive = function(){
        var aliveCounter = 0;
        for(var i = 0; i < this.entityArray.length; i++){
            if(this.entityArray[i].alive){
                aliveCounter++;
            }
        }
        return aliveCounter;
    };
    this.countDead = function(){
        var deadCounter = 0;
        for(var i = 0; i < this.entityArray.length; i++){
            if(!this.entityArray[i].alive){
                deadCounter++;
            }
        }
        return deadCounter;
    };
    this.findFirstDead = function(){
        for(var i = 0; i < this.entityArray.length; i++){
            if(!this.entityArray[i].alive){
                return i;
            }
        }
        console.log("there is no dead entity, use countDead first.");
    };
}

function Entity(x, z, id){
    this.x = x;
    this.z = z;
    this.id = id;
    this.alive = true;
    this.timeToLive = 20;
    this.width = 1;
    this.height = 1;
    this.items = [];

}

function createRandomEntities(map, number, id){
    var entities = new Entities();
    var numberCounter = 0;
    while(numberCounter < number){
        var randomNumber1 = random(-39, 78);
        var randomNumber2 = random(-39, 78);
        if(!map.collision(randomNumber1, randomNumber2)){
            entities.addEntity(new Entity(randomNumber1, randomNumber2, id));
            numberCounter++;
            id++;
        } 
    }
    return entities;
}

function random(start, count){
    return Math.floor((Math.random()* count) + start);
}

function search4Sides(map, x, z, depth){
    var targetIDs = [];
    for(var i = 1; i <= depth; i++){
        targetIDs.push(map.map[z + i + map.offsetZ][x + map.offsetX]);
        targetIDs.push(map.map[z + map.offsetZ][x + i + map.offsetX]);
        targetIDs.push(map.map[z - i + map.offsetZ][x + map.offsetX]);
        targetIDs.push(map.map[z + map.offsetZ][x - i + map.offsetX]);
    }
        return targetIDs;
}       
function searchSidesX(map, x, z, depth){
        var targetIDs = [];
        for(var i = 1; i <= depth; i++){
            targetIDs.push(map.map[z + map.offsetZ][x + i + map.offsetX]);
            targetIDs.push(map.map[z + map.offsetZ][x - i + map.offsetX]);
        }
        return targetIDs;
}            
function searchSidesZ(map, x, z, depth){
        var targetIDs = [];
        for(var i = 1; i <= depth; i++){
            targetIDs.push(map.map[z + i + map.offsetZ][x + map.offsetX]);
            targetIDs.push(map.map[z - i + map.offsetZ][x + map.offsetX]);
        }
        return targetIDs;
}
 