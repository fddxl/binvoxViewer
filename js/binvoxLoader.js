/*
class binvoxLoader{


  constructor(_areaSize, scene){
    this.areaSize = _areaSize;
    this.limit = [100, 100, 100];
    this.scene = scene;

  }

  load(_rawData){

    var headerData = '';
    var voxelData = [];
    var flg_headerEnd = false;

    for(var i=0; i<_rawData.length; i++){

      if(flg_headerEnd != true){
        if(_rawData[i] >= 32 && _rawData[i] <= 126){
          headerData += String.fromCharCode(_rawData[i]);
        }
      }

      if(flg_headerEnd == true){
        voxelData.push(_rawData[i]);
      }

      if(flg_headerEnd == false){
        var tmp = headerData.slice(headerData.length-4, headerData.length-2);
        if(tmp[0] == 'd' && tmp[1] == 'a'){
          flg_headerEnd = true;
          //なんか変な10があるからその回避
          i++;
        }
      }

    }



    var tmpStr = String.fromCharCode.apply("", new Uint16Array(_rawData));
    var tmpStr = tmpStr.split('\n');

    var dimData = tmpStr[1].split(' ');
    this.dim = [parseInt(dimData[1], 10), parseInt(dimData[2], 10), parseInt(dimData[3],10)];
    var translateData = tmpStr[2].split(' ');
    this.translate = [parseFloat(translateData[1]), parseFloat(translateData[2]), parseFloat(translateData[3])];
    var scaleData = tmpStr[3].split(' ');
    this.scale = parseFloat(scaleData[1]);


    this.voxel_rawData =　(new Array(this.dim[0])).fill(false);
    for(let i = 0; i<this.dim[0]; i++){
      this.voxel_rawData[i] = new Array(this.dim[1]).fill(false);

      for(let j=0; j<this.dim[1]; j++){
        this.voxel_rawData[i][j] = new Array(this.dim[2]).fill(false);
      }
    }

    var indexX = 0;
    var indexY = 0;
    var indexZ = 0;

    for(var i=0; i<voxelData.length; i+=2){

      if(voxelData[i] == 0){
        for(var j=0; j<voxelData[i+1]; j++){
          //this.voxel_rawData.push(false);
          //this.voxel_rawData[indexX][indexY][indexZ] = false;

          indexX += 1;
          if(indexX >= this.dim[0]){
            indexX = 0;
            indexY +=1;
          }
          if(indexY >= this.dim[1]){
            indexY = 0;
            indexZ += 1;
          }

        }
      }else if(voxelData[i] == 1){

        for(var j=0; j<voxelData[i+1]; j++){
          //this.voxel_rawData.push(true);

          this.voxel_rawData[indexX][indexY][indexZ] = true;


          indexX += 1;
          if(indexX >= this.dim[0]){
            indexX = 0;
            indexY +=1;
          }
          if(indexY >= this.dim[1]){
            indexY = 0;
            indexZ += 1;
          }

        }
      }
    }

  }


  setVoxelToScene(){


    this.geometry = new THREE.Geometry();

    var voxelCount = 0;
    var scale = this.areaSize[0] / this.dim[0];
    for(var i=1; i<3; i++){
      if(scale > this.areaSize[i]/this.dim[i]) scale = this.areaSize[i]/this.dim[i];
    }



    for(var i=0; i<parseInt(this.dim[0] * this.limit[0]/100); i++){
      for(var j=0; j<parseInt(this.dim[1] * this.limit[1]/100); j++){
        for(var k=0; k<parseInt(this.dim[2] * this.limit[2]/100); k++){

          var flg = this.voxel_rawData[i][j][k];
          if(flg == true){
            var mesh_flg = [true,true,true,true,true,true];




            if (i != 0             && this.voxel_rawData[i-1][j][k] == true) mesh_flg[0] = false;
            if (i != parseInt(this.dim[0]*this.limit[0]/100)-1 && this.voxel_rawData[i+1][j][k] == true) mesh_flg[1] = false;

            if (j != 0             && this.voxel_rawData[i][j-1][k] == true) mesh_flg[3] = false;
            if (j != parseInt(this.dim[1]*this.limit[1]/100)-1 && this.voxel_rawData[i][j+1][k] == true) mesh_flg[2] = false;

            if (k != 0             && this.voxel_rawData[i][j][k-1] == true) mesh_flg[4] = false;
            if (k != parseInt(this.dim[2]*this.limit[2]/100)-1 && this.voxel_rawData[i][j][k+1] == true) mesh_flg[5] = false;



            if(mesh_flg.indexOf(true) > -1){
              this.geometry.vertices.push(

                new THREE.Vector3( i*scale - this.areaSize[0]/2 , k*scale - this.areaSize[2]/2 + scale, j*scale - this.areaSize[1]/2),
                new THREE.Vector3( i*scale - this.areaSize[0]/2 , k*scale - this.areaSize[2]/2 + scale, j*scale - this.areaSize[1]/2 + scale),
                new THREE.Vector3( i*scale - this.areaSize[0]/2 + scale, k*scale - this.areaSize[2]/2 + scale, j*scale - this.areaSize[1]/2 + scale),
                new THREE.Vector3( i*scale - this.areaSize[0]/2 + scale, k*scale - this.areaSize[2]/2 + scale, j*scale - this.areaSize[1]/2),

                new THREE.Vector3( i*scale - this.areaSize[0]/2 , k*scale - this.areaSize[2]/2, j*scale - this.areaSize[1]/2),
                new THREE.Vector3( i*scale - this.areaSize[0]/2 , k*scale - this.areaSize[2]/2, j*scale - this.areaSize[1]/2 + scale),
                new THREE.Vector3( i*scale - this.areaSize[0]/2 + scale, k*scale - this.areaSize[2]/2, j*scale - this.areaSize[1]/2 + scale),
                new THREE.Vector3( i*scale - this.areaSize[0]/2 + scale, k*scale - this.areaSize[2]/2, j*scale - this.areaSize[1]/2)


              );


            }




            if (mesh_flg[0] == true){
              this.geometry.faces.push(new THREE.Face3(voxelCount*8 + 0, voxelCount*8 + 4, voxelCount*8 + 5));
              this.geometry.faces.push(new THREE.Face3(voxelCount*8 + 1, voxelCount*8 + 0, voxelCount*8 + 5));
            }

            if (mesh_flg[1] == true){
              this.geometry.faces.push(new THREE.Face3(voxelCount*8 + 3, voxelCount*8 + 2, voxelCount*8 + 6));
              this.geometry.faces.push(new THREE.Face3(voxelCount*8 + 3, voxelCount*8 + 6, voxelCount*8 + 7));
            }


            if (mesh_flg[2] == true){
              this.geometry.faces.push(new THREE.Face3(voxelCount*8 + 2, voxelCount*8 + 1, voxelCount*8 + 5));
              this.geometry.faces.push(new THREE.Face3(voxelCount*8 + 5, voxelCount*8 + 6, voxelCount*8 + 2));
            }

            if (mesh_flg[3] == true){
              this.geometry.faces.push(new THREE.Face3(voxelCount*8 + 0, voxelCount*8 + 3, voxelCount*8 + 7));
              this.geometry.faces.push(new THREE.Face3(voxelCount*8 + 7, voxelCount*8 + 4, voxelCount*8 + 0));
            }


            if (mesh_flg[4] == true){
              this.geometry.faces.push(new THREE.Face3(voxelCount*8 + 6, voxelCount*8 + 5, voxelCount*8 + 4));
              this.geometry.faces.push(new THREE.Face3(voxelCount*8 + 6, voxelCount*8 + 4, voxelCount*8 + 7));
            }

            if (mesh_flg[5] == true){
              this.geometry.faces.push(new THREE.Face3(voxelCount*8 + 0, voxelCount*8 + 1, voxelCount*8 + 2));
              this.geometry.faces.push(new THREE.Face3(voxelCount*8 + 2, voxelCount*8 + 3, voxelCount*8 + 0));
            }

            if(mesh_flg.indexOf(true) > -1){
              voxelCount+=1;
            }






          }
        }
      }
    }


    this.material = new THREE.MeshPhongMaterial({
      color: 0xff0000
    })

    var mesh = new THREE.Mesh(this.geometry, this.material);
    mesh.castShadow = true;
    this.scene.add(mesh);

  }

  setL(_limit){
    this.limit = _limit;
    this.scene.remove(mesh);
    this.geometry.dispose();
    this.material.dispose();

    this.setVoxelToScene();

  }

  loudout(){
    console.log("hellooooo");
  }

}
*/



/////////////


var binvoxLoader = function(_areaSize, scene){

  this.areaSize = _areaSize;
  this.limit = [100, 100, 100];
  this.scene = scene;


  this.normals = new Array(6);

  this.normals[0] = new THREE.Vector3(-1, 0, 0);
  this.normals[1] = new THREE.Vector3(1, 0, 0);
  this.normals[2] = new THREE.Vector3(0, -1, 0);
  this.normals[3] = new THREE.Vector3(0, 1, 0);
  this.normals[4] = new THREE.Vector3(0, 0, -1);
  this.normals[5] = new THREE.Vector3(0, 0, 1);




};

binvoxLoader.prototype.load = function(_rawData){
  var headerData = '';
  var voxelData = [];
  var flg_headerEnd = false;

  for(var i=0; i<_rawData.length; i++){

    if(flg_headerEnd != true){
      if(_rawData[i] >= 32 && _rawData[i] <= 126){
        headerData += String.fromCharCode(_rawData[i]);
      }
    }

    if(flg_headerEnd == true){
      voxelData.push(_rawData[i]);
    }

    if(flg_headerEnd == false){
      var tmp = headerData.slice(headerData.length-4, headerData.length-2);
      if(tmp[0] == 'd' && tmp[1] == 'a'){
        flg_headerEnd = true;
        //なんか変な10があるからその回避
        i++;
      }
    }

  }



  var tmpStr = String.fromCharCode.apply("", new Uint16Array(_rawData));
  var tmpStr = tmpStr.split('\n');

  var dimData = tmpStr[1].split(' ');
  this.dim = [parseInt(dimData[1], 10), parseInt(dimData[2], 10), parseInt(dimData[3],10)];
  var translateData = tmpStr[2].split(' ');
  this.translate = [parseFloat(translateData[1]), parseFloat(translateData[2]), parseFloat(translateData[3])];
  var scaleData = tmpStr[3].split(' ');
  this.scale = parseFloat(scaleData[1]);


  this.voxel_rawData =　(new Array(this.dim[0])).fill(false);
  for(let i = 0; i<this.dim[0]; i++){
    this.voxel_rawData[i] = new Array(this.dim[1]).fill(false);

    for(let j=0; j<this.dim[1]; j++){
      this.voxel_rawData[i][j] = new Array(this.dim[2]).fill(false);
    }
  }

  var indexX = 0;
  var indexY = 0;
  var indexZ = 0;

  for(var i=0; i<voxelData.length; i+=2){

    if(voxelData[i] == 0){
      for(var j=0; j<voxelData[i+1]; j++){

        indexX += 1;
        if(indexX >= this.dim[0]){
          indexX = 0;
          indexY +=1;
        }
        if(indexY >= this.dim[1]){
          indexY = 0;
          indexZ += 1;
        }

      }
    }else if(voxelData[i] == 1){

      for(var j=0; j<voxelData[i+1]; j++){

        this.voxel_rawData[indexX][indexY][indexZ] = true;

        indexX += 1;
        if(indexX >= this.dim[0]){
          indexX = 0;
          indexY +=1;
        }
        if(indexY >= this.dim[1]){
          indexY = 0;
          indexZ += 1;
        }

      }
    }
  }
};


binvoxLoader.prototype.setVoxelToScene = function(){
  this.geometry = new THREE.Geometry();

  var voxelCount = 0;
  var scale = this.areaSize[0] / this.dim[0];
  for(var i=1; i<3; i++){
    if(scale > this.areaSize[i]/this.dim[i]) scale = this.areaSize[i]/this.dim[i];
  }



  for(var i=0; i<parseInt(this.dim[0] * this.limit[0]/100); i++){
    for(var j=0; j<parseInt(this.dim[1] * this.limit[1]/100); j++){
      for(var k=0; k<parseInt(this.dim[2] * this.limit[2]/100); k++){

        var flg = this.voxel_rawData[i][j][k];
        if(flg == true){
          var mesh_flg = [true,true,true,true,true,true];




          if (i != 0             && this.voxel_rawData[i-1][j][k] == true) mesh_flg[0] = false;
          if (i != parseInt(this.dim[0]*this.limit[0]/100)-1 && this.voxel_rawData[i+1][j][k] == true) mesh_flg[1] = false;

          if (j != 0             && this.voxel_rawData[i][j-1][k] == true) mesh_flg[3] = false;
          if (j != parseInt(this.dim[1]*this.limit[1]/100)-1 && this.voxel_rawData[i][j+1][k] == true) mesh_flg[2] = false;

          if (k != 0             && this.voxel_rawData[i][j][k-1] == true) mesh_flg[4] = false;
          if (k != parseInt(this.dim[2]*this.limit[2]/100)-1 && this.voxel_rawData[i][j][k+1] == true) mesh_flg[5] = false;



          if(mesh_flg.indexOf(true) > -1){
            this.geometry.vertices.push(

              new THREE.Vector3( i*scale - this.areaSize[0]/2 , k*scale - this.areaSize[2]/2 + scale, j*scale - this.areaSize[1]/2),
              new THREE.Vector3( i*scale - this.areaSize[0]/2 , k*scale - this.areaSize[2]/2 + scale, j*scale - this.areaSize[1]/2 + scale),
              new THREE.Vector3( i*scale - this.areaSize[0]/2 + scale, k*scale - this.areaSize[2]/2 + scale, j*scale - this.areaSize[1]/2 + scale),
              new THREE.Vector3( i*scale - this.areaSize[0]/2 + scale, k*scale - this.areaSize[2]/2 + scale, j*scale - this.areaSize[1]/2),

              new THREE.Vector3( i*scale - this.areaSize[0]/2 , k*scale - this.areaSize[2]/2, j*scale - this.areaSize[1]/2),
              new THREE.Vector3( i*scale - this.areaSize[0]/2 , k*scale - this.areaSize[2]/2, j*scale - this.areaSize[1]/2 + scale),
              new THREE.Vector3( i*scale - this.areaSize[0]/2 + scale, k*scale - this.areaSize[2]/2, j*scale - this.areaSize[1]/2 + scale),
              new THREE.Vector3( i*scale - this.areaSize[0]/2 + scale, k*scale - this.areaSize[2]/2, j*scale - this.areaSize[1]/2)


            );

          }




          if (mesh_flg[0] == true){
            this.geometry.faces.push(new THREE.Face3(voxelCount*8 + 0, voxelCount*8 + 4, voxelCount*8 + 5, this.normals[0]));
            this.geometry.faces.push(new THREE.Face3(voxelCount*8 + 1, voxelCount*8 + 0, voxelCount*8 + 5, this.normals[0]));
          }

          if (mesh_flg[1] == true){
            this.geometry.faces.push(new THREE.Face3(voxelCount*8 + 3, voxelCount*8 + 2, voxelCount*8 + 6, this.normals[1]));
            this.geometry.faces.push(new THREE.Face3(voxelCount*8 + 3, voxelCount*8 + 6, voxelCount*8 + 7, this.normals[1]));
          }


          if (mesh_flg[2] == true){
            this.geometry.faces.push(new THREE.Face3(voxelCount*8 + 2, voxelCount*8 + 1, voxelCount*8 + 5, this.normals[2]));
            this.geometry.faces.push(new THREE.Face3(voxelCount*8 + 5, voxelCount*8 + 6, voxelCount*8 + 2, this.normals[2]));
          }

          if (mesh_flg[3] == true){
            this.geometry.faces.push(new THREE.Face3(voxelCount*8 + 0, voxelCount*8 + 3, voxelCount*8 + 7, this.normals[3]));
            this.geometry.faces.push(new THREE.Face3(voxelCount*8 + 7, voxelCount*8 + 4, voxelCount*8 + 0, this.normals[3]));
          }


          if (mesh_flg[4] == true){
            this.geometry.faces.push(new THREE.Face3(voxelCount*8 + 6, voxelCount*8 + 5, voxelCount*8 + 4, this.normals[4]));
            this.geometry.faces.push(new THREE.Face3(voxelCount*8 + 6, voxelCount*8 + 4, voxelCount*8 + 7, this.normals[4]));
          }

          if (mesh_flg[5] == true){
            this.geometry.faces.push(new THREE.Face3(voxelCount*8 + 0, voxelCount*8 + 1, voxelCount*8 + 2, this.normals[5]));
            this.geometry.faces.push(new THREE.Face3(voxelCount*8 + 2, voxelCount*8 + 3, voxelCount*8 + 0, this.normals[5]));
          }

          if(mesh_flg.indexOf(true) > -1){
            voxelCount+=1;
          }

        }
      }
    }
  }


  this.material = new THREE.MeshPhongMaterial({
    color: 0xff0000
  })

  this.mesh = new THREE.Mesh(this.geometry, this.material);
  this.mesh.castShadow = true;
  this.scene.add(this.mesh);
};


//setter
binvoxLoader.prototype.setAreaSize = function(_areaSize){
  this.areaSize = _areaSize;
};

binvoxLoader.prototype.setScene = function(_scene){
  this.scene = _scene;
};

binvoxLoader.prototype.setLimit = function(_limit){
  this.limit = _limit;

  if(typeof(this.geometry) !== "undefined"){
    this.scene.remove(this.mesh);
    this.geometry.dispose();
    this.material.dispose();
    this.setVoxelToScene();
  }


};


//getter
binvoxLoader.prototype.getDim = function(){
  return this.dim;
};

binvoxLoader.prototype.getTranslate = function(){
  return this.translate;
};

binvoxLoader.prototype.getScale = function(){
  return this.scale;
};
