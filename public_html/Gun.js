/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function Gun(map, enemyEntities, effectiveRange, muzzleVelocity){//based on Entities
    this.entityArray = [];
    this.map = map;
    this.timer = 0;//for tick
    this.effectiveRange = effectiveRange;
    this.muzzleVelocity = muzzleVelocity;
    
    this.enemyEntities = enemyEntities;
    this.addEntity = function(entity){
        this.entityArray.push(entity);
    };
    this.shoot = function(shooter){
        if(this.countDead() !== 0){//recycling dead bullet entity instead of creating new entry  
            var orderInArray = this.findFirstDead();
            this.entityArray[orderInArray].alive = true;
            this.entityArray[orderInArray].timeToLive = this.effectiveRange;//don't forget reset timeToLive!
            this.entityArray[orderInArray].x = shooter.x;
            this.entityArray[orderInArray].z = shooter.z;
        }else{//no dead bullet, add new entry
            this.addEntity(new Bullet(this.map, this.enemyEntities, this.effectiveRange, shooter.x, shooter.z, 100));
        } 
    };
    
    this.tick = function(clockDelta){
        this.timer += clockDelta;
        if(this.timer > this.muzzleVelocity){
            //doing bullet stuff, moving object forward then check timeToLive.
            for(var i = 0; i < this.entityArray.length; i++){
                if(this.entityArray[i].alive){
                    this.entityArray[i].bullet(this.map, this.enemyEntities);
                }
            }
            this.timer = 0;//resetting the timer
        }
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

function Bullet(map, enemyEntities, timeToLive, x, z, id){//based on Entity
    this.x = x;
    this.z = z;
    this.id = id;
    this.alive = true;
    this.timeToLive = timeToLive;
    this.width = 1;
    this.height = 1;
    
    this.map = map;
    this.enemyEntities = enemyEntities;

    this.bullet = function(){
        if(this.map.collision(this.x, this.z + 1)){//hit a target
            var targetID = this.map.map[this.z + 1 + this.map.offsetZ][this.x + this.map.offsetX];
            console.log("hit" + targetID);
            if(targetID >= 50 && targetID < 100){
                this.enemyEntities.killByID(targetID);
                var enemyLeft = this.enemyEntities.countAlive();
                if(enemyLeft === 0){
                    console.log("You eliminated all of them");
                }
                else
                {
                    console.log(enemyLeft + " more to go");
                }
            }
            this.alive = false;
        }else{//not collided yet
            this.z++;
            this.timeToLive--;
            if(this.timeToLive <= 0){
                this.alive = false;
            }
        }
    };
}