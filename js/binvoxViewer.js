class binvoxViewer{


  constructor(){
  }



  set_rawData(_rawData){

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

    this.voxel_rawData = [];
    for(var i=0; i<voxelData.length; i+=2){

      if(voxelData[i] == 0){
        for(var j=0; j<voxelData[i+1]; j++){
          this.voxel_rawData.push(false);
        }
      }else if(voxelData[i] == 1){
        for(var j=0; j<voxelData[i+1]; j++){
          this.voxel_rawData.push(true);
        }
      }
    }

    console.log(voxelData);





  }


  setVoxelToScene(scene){
    //console.log(this.voxel_rawData);
    var boxSize = 1.0/32.0;

    for(var i=0; i<this.dim[2]; i++){
      for(var j=0; j<this.dim[1]; j++){
        for(var k=0; k<this.dim[0]; k++){

          var tmp = this.voxel_rawData[i*this.dim[0]*this.dim[1] + j*this.dim[0] + k];
          if(tmp == true){
            var box = new THREE.Mesh(
              new THREE.BoxGeometry(boxSize, boxSize, boxSize),
              //new THREE.MeshBasicMaterial({color: 0xff0000})
              new THREE.MeshLambertMaterial({color: 0xff0000})
            );

            box.position.set(k/this.dim[0] - 0.5, j/this.dim[1] - 0.5, i/this.dim[2] - 0.5);
            box.castShadow = true;
            scene.add(box);
          }

        }
      }
    }

    /*
    var box = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.1, 0.1),
      new THREE.MeshBasicMaterial({color: 0xff0000})
    );

    box.position.set(1,1,1);

    scene.add(box);
    */


  }


  loudout(){
    console.log(this.dim);
  }




}
