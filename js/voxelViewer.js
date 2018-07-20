var VoxelViewer = function(){
  this.normals = new Array(6);
  this.limit = [100, 100, 100];
  this.transition = [0,0,0];

  this.normals[0] = new THREE.Vector3(-1, 0, 0);
  this.normals[1] = new THREE.Vector3(1, 0, 0);
  this.normals[2] = new THREE.Vector3(0, -1, 0);
  this.normals[3] = new THREE.Vector3(0, 1, 0);
  this.normals[4] = new THREE.Vector3(0, 0, -1);
  this.normals[5] = new THREE.Vector3(0, 0, 1);



}

VoxelViewer.prototype.move = function(_transition){
  this.transition = _transition;
}

VoxelViewer.prototype.setLimit = function(_limit){
  this.limit = _limit;
}

VoxelViewer.prototype.convertVoxelToGeometry = function(voxelData, scale){
  geometry = new THREE.Geometry();

  var dim = [voxelData.length, voxelData[0].length, voxelData[0][0].length];
  var voxelCount = 0;

  for(var i=0; i< parseInt(dim[0]*this.limit[0]/100); i++){
    for(var j=0; j< parseInt(dim[1]*this.limit[1]/100); j++){
      for(var k=0; k< parseInt(dim[2]*this.limit[2]/100); k++){

        var flg = voxelData[i][j][k];
        if(flg == true){
          var mesh_flg = [true, true, true, true, true, true];

          if (i != 0             && voxelData[i-1][j][k] == true) mesh_flg[0] = false;
          if (i != parseInt(dim[0]*this.limit[0]/100)-1 && voxelData[i+1][j][k] == true) mesh_flg[1] = false;

          if (j != 0             && voxelData[i][j-1][k] == true) mesh_flg[3] = false;
          if (j != parseInt(dim[1]*this.limit[1]/100)-1 && voxelData[i][j+1][k] == true) mesh_flg[2] = false;

          if (k != 0             && voxelData[i][j][k-1] == true) mesh_flg[4] = false;
          if (k != parseInt(dim[2]*this.limit[2]/100)-1 && voxelData[i][j][k+1] == true) mesh_flg[5] = false;



        //pushing vertices
        if(mesh_flg.indexOf(true) > -1){
          geometry.vertices.push(

            /*
            new THREE.Vector3( i*scale - areaSize[0]/2 , k*scale - areaSize[2]/2 + scale, j*scale - areaSize[1]/2),
            new THREE.Vector3( i*scale - areaSize[0]/2 , k*scale - areaSize[2]/2 + scale, j*scale - areaSize[1]/2 + scale),
            new THREE.Vector3( i*scale - areaSize[0]/2 + scale, k*scale - areaSize[2]/2 + scale, j*scale - areaSize[1]/2 + scale),
            new THREE.Vector3( i*scale - areaSize[0]/2 + scale, k*scale - areaSize[2]/2 + scale, j*scale - areaSize[1]/2),

            new THREE.Vector3( i*scale - areaSize[0]/2 , k*scale - areaSize[2]/2, j*scale - areaSize[1]/2),
            new THREE.Vector3( i*scale - areaSize[0]/2 , k*scale - areaSize[2]/2, j*scale - areaSize[1]/2 + scale),
            new THREE.Vector3( i*scale - areaSize[0]/2 + scale, k*scale - areaSize[2]/2, j*scale - areaSize[1]/2 + scale),
            new THREE.Vector3( i*scale - areaSize[0]/2 + scale, k*scale - areaSize[2]/2, j*scale - areaSize[1]/2)
            */

            new THREE.Vector3( i*scale + this.transition[0], k*scale + scale + this.transition[1], j*scale + this.transition[2]),
            new THREE.Vector3( i*scale + this.transition[0], k*scale + scale + this.transition[1], j*scale + scale + this.transition[2]),
            new THREE.Vector3( i*scale + scale + this.transition[0], k*scale + scale + this.transition[1], j*scale + scale + this.transition[2]),
            new THREE.Vector3( i*scale + scale + this.transition[0], k*scale + scale + this.transition[1], j*scale + this.transition[2]),

            new THREE.Vector3( i*scale + this.transition[0], k*scale + this.transition[1], j*scale + this.transition[2]),
            new THREE.Vector3( i*scale + this.transition[0], k*scale + this.transition[1], j*scale + scale + this.transition[2]),
            new THREE.Vector3( i*scale + scale + this.transition[0] , k*scale + this.transition[1], j*scale  + scale + this.transition[2]),
            new THREE.Vector3( i*scale + scale + this.transition[0], k*scale + this.transition[1], j*scale + this.transition[2])

          );


          if (mesh_flg[0] == true){
            geometry.faces.push(new THREE.Face3(voxelCount*8 + 0, voxelCount*8 + 4, voxelCount*8 + 5, this.normals[0]));
            geometry.faces.push(new THREE.Face3(voxelCount*8 + 1, voxelCount*8 + 0, voxelCount*8 + 5, this.normals[0]));
          }

          if (mesh_flg[1] == true){
            geometry.faces.push(new THREE.Face3(voxelCount*8 + 3, voxelCount*8 + 2, voxelCount*8 + 6, this.normals[1]));
            geometry.faces.push(new THREE.Face3(voxelCount*8 + 3, voxelCount*8 + 6, voxelCount*8 + 7, this.normals[1]));
          }

          if (mesh_flg[2] == true){
            geometry.faces.push(new THREE.Face3(voxelCount*8 + 2, voxelCount*8 + 1, voxelCount*8 + 5, this.normals[2]));
            geometry.faces.push(new THREE.Face3(voxelCount*8 + 5, voxelCount*8 + 6, voxelCount*8 + 2, this.normals[2]));
          }

          if (mesh_flg[3] == true){
            geometry.faces.push(new THREE.Face3(voxelCount*8 + 0, voxelCount*8 + 3, voxelCount*8 + 7, this.normals[3]));
            geometry.faces.push(new THREE.Face3(voxelCount*8 + 7, voxelCount*8 + 4, voxelCount*8 + 0, this.normals[3]));
          }


          if (mesh_flg[4] == true){
            geometry.faces.push(new THREE.Face3(voxelCount*8 + 6, voxelCount*8 + 5, voxelCount*8 + 4, this.normals[4]));
            geometry.faces.push(new THREE.Face3(voxelCount*8 + 6, voxelCount*8 + 4, voxelCount*8 + 7, this.normals[4]));
          }

          if (mesh_flg[5] == true){
            geometry.faces.push(new THREE.Face3(voxelCount*8 + 0, voxelCount*8 + 1, voxelCount*8 + 2, this.normals[5]));
            geometry.faces.push(new THREE.Face3(voxelCount*8 + 2, voxelCount*8 + 3, voxelCount*8 + 0, this.normals[5]));
          }


          voxelCount+=1;

        }

      }


      }
    }
  }

  return geometry;
}


/*
VoxelViewer.prototype.convertVoxelToGeometry = function(voxelData, areaSize){

  geometry = new THREE.Geometry();

  var voxelCount = 0;
  var dim = [voxelData.length, voxelData[0].length, voxelData[0][0].length];
  var scale = areaSize[0]/dim[0];
  for(var i=1; i<3; i++){
    if (scale > areaSize[i]/dim[i]) scale = areaSize[i]/dim[i];
  }


  //scanning voxelData
  for ( var i=0; i<parseInt(dim[0] * this.limit[0]/100); i++){
    for ( var j=0; j<parseInt(dim[1] * this.limit[1]/100); j++){
      for (var k=0; k<parseInt(dim[2] * this.limit[2]/100); k++){

        var flg = voxelData[i][j][k];
        if (flg == true){
          var mesh_flg = [true, true, true, true, true, true];

          //check is there at 6 direction
          if (i != 0             && voxelData[i-1][j][k] == true) mesh_flg[0] = false;
          if (i != parseInt(dim[0] * this.limit[0]/100)-1 && voxelData[i+1][j][k] == true) mesh_flg[1] = false;

          if (j != 0             && voxelData[i][j-1][k] == true) mesh_flg[3] = false;
          if (j != parseInt(dim[1] * this.limit[1]/100)-1 && voxelData[i][j+1][k] == true) mesh_flg[2] = false;

          if (k != 0             && voxelData[i][j][k-1] == true) mesh_flg[4] = false;
          if (k != parseInt(dim[2] * this.limit[2]/100)-1 && voxelData[i][j][k+1] == true) mesh_flg[5] = false;



          //pushing vertices
          if(mesh_flg.indexOf(true) > -1){
            geometry.vertices.push(

              new THREE.Vector3( i*scale - areaSize[0]/2 , k*scale - areaSize[2]/2 + scale, j*scale - areaSize[1]/2),
              new THREE.Vector3( i*scale - areaSize[0]/2 , k*scale - areaSize[2]/2 + scale, j*scale - areaSize[1]/2 + scale),
              new THREE.Vector3( i*scale - areaSize[0]/2 + scale, k*scale - areaSize[2]/2 + scale, j*scale - areaSize[1]/2 + scale),
              new THREE.Vector3( i*scale - areaSize[0]/2 + scale, k*scale - areaSize[2]/2 + scale, j*scale - areaSize[1]/2),

              new THREE.Vector3( i*scale - areaSize[0]/2 , k*scale - areaSize[2]/2, j*scale - areaSize[1]/2),
              new THREE.Vector3( i*scale - areaSize[0]/2 , k*scale - areaSize[2]/2, j*scale - areaSize[1]/2 + scale),
              new THREE.Vector3( i*scale - areaSize[0]/2 + scale, k*scale - areaSize[2]/2, j*scale - areaSize[1]/2 + scale),
              new THREE.Vector3( i*scale - areaSize[0]/2 + scale, k*scale - areaSize[2]/2, j*scale - areaSize[1]/2)

            );
          }

          if (mesh_flg[0] == true){
            geometry.faces.push(new THREE.Face3(voxelCount*8 + 0, voxelCount*8 + 4, voxelCount*8 + 5, this.normals[0]));
            geometry.faces.push(new THREE.Face3(voxelCount*8 + 1, voxelCount*8 + 0, voxelCount*8 + 5, this.normals[0]));
          }

          if (mesh_flg[1] == true){
            geometry.faces.push(new THREE.Face3(voxelCount*8 + 3, voxelCount*8 + 2, voxelCount*8 + 6, this.normals[1]));
            geometry.faces.push(new THREE.Face3(voxelCount*8 + 3, voxelCount*8 + 6, voxelCount*8 + 7, this.normals[1]));
          }

          if (mesh_flg[2] == true){
            geometry.faces.push(new THREE.Face3(voxelCount*8 + 2, voxelCount*8 + 1, voxelCount*8 + 5, this.normals[2]));
            geometry.faces.push(new THREE.Face3(voxelCount*8 + 5, voxelCount*8 + 6, voxelCount*8 + 2, this.normals[2]));
          }

          if (mesh_flg[3] == true){
            geometry.faces.push(new THREE.Face3(voxelCount*8 + 0, voxelCount*8 + 3, voxelCount*8 + 7, this.normals[3]));
            geometry.faces.push(new THREE.Face3(voxelCount*8 + 7, voxelCount*8 + 4, voxelCount*8 + 0, this.normals[3]));
          }


          if (mesh_flg[4] == true){
            geometry.faces.push(new THREE.Face3(voxelCount*8 + 6, voxelCount*8 + 5, voxelCount*8 + 4, this.normals[4]));
            geometry.faces.push(new THREE.Face3(voxelCount*8 + 6, voxelCount*8 + 4, voxelCount*8 + 7, this.normals[4]));
          }

          if (mesh_flg[5] == true){
            geometry.faces.push(new THREE.Face3(voxelCount*8 + 0, voxelCount*8 + 1, voxelCount*8 + 2, this.normals[5]));
            geometry.faces.push(new THREE.Face3(voxelCount*8 + 2, voxelCount*8 + 3, voxelCount*8 + 0, this.normals[5]));
          }

          if(mesh_flg.indexOf(true) > -1){
            voxelCount+=1;
          }


        }
      }
    }
  }

  return geometry;

}
*/
