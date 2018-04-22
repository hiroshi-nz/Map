/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Map(height, width){
    this.map = [];
    this.height = height;
    this.width = width;
    this.offsetX = Math.round(width/2);
    this.offsetZ = Math.round(height/2);

    this.initialize = function(){
        var smallArray = [];
        var bigArray = [];
        for(var i = 0; i < this.height; i++){
            smallArray.push(0);
        }
        for(var j = 0; j < this.width; j++){
            var copyOfArray = smallArray.slice();
            bigArray.push(copyOfArray);
        }
        this.map = bigArray;//copy of multidimentional array in JavaScript is reference in depth elements.
        //so in order to copy it, I need to copy each array one by one.
    };
    
    this.update = function(x, z, id){
        var scale = 1;
        this.map[Math.round(z * scale) + this.offsetZ][Math.round(x * scale) + this.offsetX] = id;
    };
    
    this.updateEntities = function(entities){
        //redraw enemies which are still alive
        for(var i = 0; i < entities.entityArray.length; i++){
            if(entities.entityArray[i].alive){
                this.update(entities.entityArray[i].x, entities.entityArray[i].z, entities.entityArray[i].id);
            }
        }
    };
    this.collision = function(x, z){
        var id = this.map[z + this.offsetZ][x + this.offsetX];
        if(id === 0){
            return false;
        }else{
            return true;
        }
    }; 
}

function MapMesh(map, scene){
    
    this.map = map;//map array
    this.scene = scene;
    
    this.mapGroup;
    this.interactiveGroup;//player, enemies, bullets etc.
    this.terrainGroup;//buildings, road, lawn etc.
    
    this.terrainMeshTracker = [];//for proper disposal
    this.interactiveMeshTracker = [];//for proper disposal
    
    this.height = 10;
    this.width = 10;
    this.offsetX = this.width / 2;
    this.offsetZ = this.height / 2;
    
    this.cameraZ;
    
    this.mapObject;//set by initialization
    
    this.blueObject;
    this.redObject;
    this.greenObject;
    this.bulletObject;
    this.buildingObject;
    this.doorObject;
    this.roadObject;
    this.lawnObject;
    
    this.initialize = function(cameraZ){
        this.cameraZ = cameraZ;
        this.createObjects();
        this.createTerrainGroup();//only once
        this.mapGroup = new THREE.Group();
        this.mapGroup.add(this.terrainGroup);
        this.setDisplayLocation();
        this.scene.add(this.mapGroup);
    };
    
    this.update = function(cameraZ){
        this.cameraZ = cameraZ;//I can get rid of this argument by using pointer. In JavaScript, an array is a pointer but it gets hacky...
        this.createInteractiveGroup();
        this.mapGroup.add(this.interactiveGroup);
        this.setDisplayLocation();
    };
    
    this.dispose = function(){
         for(var i = 0; i < this.interactiveMeshTracker.length; i++){
            this.interactiveGroup.remove(this.interactiveMeshTracker[i]);
            this.interactiveMeshTracker[i].geometry.dispose;
            this.interactiveMeshTracker[i].material.dispose;
        }
        this.mapGroup.remove(this.interactiveGroup);

    };
    
    this.setDisplayLocation = function(){
        this.mapGroup.position.x = 0;
        this.mapGroup.position.y = 1;
        this.mapGroup.position.z = this.cameraZ + 9;
    };
    
    this.createObjects = function(){//only once
        var mapGeometry = new THREE.PlaneGeometry(this.width, this.height);
        var mapMaterial = new THREE.MeshBasicMaterial( {color: 0x000000, transparent:true, opacity: 0.5, side: THREE.DoubleSide} );
        this.mapObject = new THREE.Mesh(mapGeometry, mapMaterial);
        
        //defining colors and shape of sign objects
        var objectGeometry = new THREE.PlaneGeometry(0.1, 0.1);
        var blue = new THREE.MeshBasicMaterial( {color: 0x0000ff, transparent:true, opacity: 0.5, side: THREE.DoubleSide} );//blue
        var red = new THREE.MeshBasicMaterial( {color: 0xff0000, transparent:true, opacity: 0.5, side: THREE.DoubleSide} );//red
        var green = new THREE.MeshBasicMaterial( {color: 0x00ff00, transparent:true, opacity: 0.5, side: THREE.DoubleSide} );//green
        var yellow = new THREE.MeshBasicMaterial( {color: 0xffff00, transparent:true, opacity: 0.5, side: THREE.DoubleSide} );//yellow

        var white = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );//white
        var roadGrey = new THREE.MeshBasicMaterial( {color: 0x666666, side: THREE.DoubleSide} );//grey
        var lawnGreen = new THREE.MeshBasicMaterial( {color: 0x00b300, side: THREE.DoubleSide} );//lawnGreen
        var doorBrown = new THREE.MeshBasicMaterial( {color: 0x331100, side: THREE.DoubleSide} );

        this.blueObject = new THREE.Mesh(objectGeometry, blue);
        this.redObject = new THREE.Mesh(objectGeometry, red);
        this.greenObject = new THREE.Mesh(objectGeometry, green);
        this.bulletObject = new THREE.Mesh(objectGeometry, yellow);
        this.lawnObject = new THREE.Mesh(objectGeometry, lawnGreen);
        this.roadObject = new THREE.Mesh(objectGeometry, roadGrey);
        this.buildingObject = new THREE.Mesh(objectGeometry, white);
        this.doorObject = new THREE.Mesh(objectGeometry, doorBrown);
    };
    this.createTerrainGroup = function(){//called only once
        var heightRatio = 10 / this.map.height;
        var widthRatio = 10/ this.map.width;
        terrainGroup = new THREE.Group();
        this.terrainMeshTracker = [];
        
        for(var i = 0; i < this.map.height; i++){
            for(var j = 0; j < this.map.width; j++){
                var id = this.map.map[i][j];
                if(id >= 1){//for different color on the map
                    if(id === 200){//for building
                        var newObjectPlane = this.buildingObject.clone();
                        newObjectPlane.position.x = -(j * widthRatio - this.offsetX);//invert x
                        newObjectPlane.position.y = i * heightRatio - this.offsetZ;
                        newObjectPlane.position.z = -0.01;//for z-fighting
                        this.terrainMeshTracker.push(newObjectPlane);
                    }else if(id === 201){//for road
                        var newObjectPlane = this.roadObject.clone();
                        newObjectPlane.position.x = -(j * widthRatio - this.offsetX);//invert x
                        newObjectPlane.position.y = i * heightRatio - this.offsetZ;
                        newObjectPlane.position.z = -0.01;//for z-fighting
                        this.terrainMeshTracker.push(newObjectPlane);
                    }else if(id === 202){//for lawn
                        var newObjectPlane = this.lawnObject.clone();
                        newObjectPlane.position.x = -(j * widthRatio - this.offsetX);//invert x
                        newObjectPlane.position.y = i * heightRatio - this.offsetZ;
                        newObjectPlane.position.z = -0.01;//for z-fighting
                        this.terrainMeshTracker.push(newObjectPlane);
                    }
                }
            }
        }
        for(var i = 0; i < this.terrainMeshTracker.length; i++){
            terrainGroup.add(this.terrainMeshTracker[i]);
        }
        this.terrainGroup = terrainGroup;
    };
    this.createInteractiveGroup = function(){
        var heightRatio = 10 / this.map.height;
        var widthRatio = 10/ this.map.width;

        var interactiveGroup = new THREE.Group();
        this.interactiveMeshTracker = [];
        this.interactiveMeshTracker.push(this.mapObject);//map rectangular base

        for(var i = 0; i < this.map.height; i++){
            for(var j = 0; j < this.map.width; j++){
                var id = this.map.map[i][j];
                if(id >= 1){//for different color on the map
                    if(id === 1){//player
                        var newObjectPlane = this.blueObject.clone();
                        newObjectPlane.position.x = -(j * widthRatio - this.offsetX);//invert x
                        newObjectPlane.position.y = i * heightRatio - this.offsetZ;
                        newObjectPlane.position.z = -0.01;//for z-fighting              
                        this.interactiveMeshTracker.push(newObjectPlane);
                    }else if(id >= 50 && id < 100){//enemy
                        var newObjectPlane = this.redObject.clone();
                        newObjectPlane.position.x = -(j * widthRatio - this.offsetX);//invert x
                        newObjectPlane.position.y = i * heightRatio - this.offsetZ;
                        newObjectPlane.position.z = -0.01;//for z-fighting              
                        this.interactiveMeshTracker.push(newObjectPlane);
                    }else if(id >= 100 && id < 150){//bullet
                        var newObjectPlane = this.bulletObject.clone();
                        newObjectPlane.position.x = -(j * widthRatio - this.offsetX);//invert x
                        newObjectPlane.position.y = i * heightRatio - this.offsetZ;
                        newObjectPlane.position.z = -0.01;//for z-fighting              
                        this.interactiveMeshTracker.push(newObjectPlane);
                    }else if(id >= 220 && id < 230){//for door
                        var newObjectPlane = this.doorObject.clone();
                        newObjectPlane.position.x = -(j * widthRatio - this.offsetX);//invert x
                        newObjectPlane.position.y = i * heightRatio - this.offsetZ;
                        newObjectPlane.position.z = -0.01;//for z-fighting              
                        this.interactiveMeshTracker.push(newObjectPlane);
                    }else if(id >= 500){//for items
                        var newObjectPlane = this.greenObject.clone();
                        newObjectPlane.position.x = -(j * widthRatio - this.offsetX);//invert x
                        newObjectPlane.position.y = i * heightRatio - this.offsetZ;
                        newObjectPlane.position.z = -0.01;//for z-fighting              
                        this.interactiveMeshTracker.push(newObjectPlane);
                    }
                }
            }
        }
        for(var i = 0; i < this.interactiveMeshTracker.length; i++){
            interactiveGroup.add(this.interactiveMeshTracker[i]);
        }
        this.interactiveGroup = interactiveGroup;
    };
}
