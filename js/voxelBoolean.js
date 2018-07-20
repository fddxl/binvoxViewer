var VoxelData = function(_voxelData){

  //voxelData : three-dimention Array
  this.voxelData  = _voxelData;

  this.dimension = [0,0,0];
  this.dimension[0] = this.voxelData.length;
  this.dimension[1] = this.voxelData[0].length;
  this.dimension[2] = this.voxelData[0][0].length;


  //transtion : array of [x, y, z]
  this.transition = [0,0,0];

}

VoxelData.setTransition = function(_transition){
  this.transition = _transition;
}




//VoxelBoolean

var VoxelBoolean = function(){
  this.firstVoxelData;
  this.secondVoxelData;

  this.firstTransition = [0,0,0];
  this.secondTransition = [0,0,0];

}

VoxelBoolean.prototype.setFirstVoxelData = function(_firstVoxelData){
  this.firstVoxelData = _firstVoxelData;
}

VoxelBoolean.prototype.setFirstTransition = function(_firstTransition){
  this.firstTransition = _firstTransition;
}

VoxelBoolean.prototype.setSecondVoxelData = function(_secondVoxelData){
  this.secondVoxelData = _secondVoxelData;
}

VoxelBoolean.prototype.setSecondTransition = function(_secondTransition){
  this.secondTransition = _secondTransition;
}



VoxelBoolean.prototype.booleanDifference = function(){


  var firstDim = [this.firstVoxelData.length, this.firstVoxelData[0].length, this.firstVoxelData[0][0].length];
  var secondDim = [this.secondVoxelData.length, this.secondVoxelData[0].length, this.secondVoxelData[0][0].length];


  var result_data = (new Array(firstDim[0])).fill(false);
  for(let i=0; i<firstDim[0]; i++){
    result_data[i] = new Array(firstDim[1]).fill(false);

    for(let j=0; j<firstDim[2]; j++){
      result_data[i][j] = new Array(firstDim[2]).fill(false);
    }
  }


  console.log(secondDim);

  for(var i=0; i<firstDim[0]; i++){
    for(var j=0; j<firstDim[1]; j++){
      for(var k=0; k<firstDim[2]; k++){

        var checker = [false, false, false];
        if(this.secondTransition[0] <= i+this.firstTransition[0] && i+this.firstTransition[0] < secondDim[0]+this.secondTransition[0]) checker[0] = true;
        if(this.secondTransition[2] <= j+this.firstTransition[2] && j+this.firstTransition[2] < secondDim[2]+this.secondTransition[2]) checker[2] = true;
        if(this.secondTransition[1] <= k+this.firstTransition[1] && k+this.firstTransition[1] < secondDim[1]+this.secondTransition[1]) checker[1] = true;

        if(checker[0] && checker[1] && checker[2]){
          /*
          console.log(i);
          console.log(j);
          console.log(k);
          if(k == 4) console.log(this.firstVoxelData[i][j][k]);
          if(k == 4) console.log(this.secondVoxelData[i][j][k]);
          */

          if(this.firstVoxelData[i][j][k] && this.secondVoxelData[i+this.firstTransition[0]-this.secondTransition[0]][j+this.firstTransition[2]-this.secondTransition[2]][k+this.firstTransition[1]-this.secondTransition[1]] !== true){
              result_data[i][j][k] = true;
          }

        }else{
          if(this.firstVoxelData[i][j][k]){
            result_data[i][j][k] = true;
          }
        }
      }
    }
  }

  console.log("Boolean Difference finished");
  return result_data;

}

VoxelBoolean.prototype.booleanUnion = function(){

    var firstDim = [this.firstVoxelData.length, this.firstVoxelData[0].length, this.firstVoxelData[0][0].length];
    var secondDim = [this.secondVoxelData.length, this.secondVoxelData[0].length, this.secondVoxelData[0][0].length];

    var maxX = firstDim[0]+this.firstTransition[0] > secondDim[0]+this.secondTransition[0] ? firstDim[0]+this.firstTransition[0] : secondDim[0]+this.secondTransition[0];
    var minX = this.firstTransition[0] < this.secondTransition[0] ? this.firstTransition[0] : this.secondTransition[0];

    var maxY = firstDim[2]+this.firstTransition[2] > secondDim[2]+this.secondTransition[2] ? firstDim[2]+this.firstTransition[2] : secondDim[2]+this.secondTransition[2];
    var minY = this.firstTransition[2] < this.secondTransition[2] ? this.firstTransition[2] : this.secondTransition[2];

    var maxZ = firstDim[1]+this.firstTransition[1] > secondDim[1]+this.secondTransition[1] ? firstDim[1]+this.firstTransition[1] : secondDim[1]+this.secondTransition[1];
    var minZ = this.firstTransition[1] < this.secondTransition[1] ? this.firstTransition[1] : this.secondTransition[1];


    var result_data = (new Array(maxX - minX)).fill(false);
    for(let i=0; i<(maxX-minX); i++){
      result_data[i] = new Array(maxY - minY).fill(false);

      for(let j=0; j<(maxY-minY); j++){
        result_data[i][j] = new Array(maxZ - minZ).fill(false);
      }
    }



    for(var i=0; i<firstDim[0]; i++){

      for(var j=0; j<firstDim[1]; j++){
        for(var k=0; k<firstDim[2]; k++){
          if(this.firstVoxelData[i][j][k]){

            result_data[this.firstTransition[0]-minX+i][this.firstTransition[2]-minY+j][this.firstTransition[1]-minZ+k] = true;
          }
        }
      }
    }

    for(var i=0; i<secondDim[0]; i++){
      for(var j=0; j<secondDim[1]; j++){
        for(var k=0; k<secondDim[2]; k++){
          if(this.secondVoxelData[i][j][k]){

              result_data[this.secondTransition[0]-minX+i][this.secondTransition[2]-minY+j][this.secondTransition[1]-minZ+k] = true;


          }
        }
      }
    }



    console.log("Boolean Union finished");

    return result_data;



}


VoxelBoolean.prototype.booleanIntersection = function(){

  var firstDim = [this.firstVoxelData.length, this.firstVoxelData[0].length, this.firstVoxelData[0][0].length];
  var secondDim = [this.secondVoxelData.length, this.secondVoxelData[0].length, this.secondVoxelData[0][0].length];


  var result_data = (new Array(firstDim[0])).fill(false);
  for(let i=0; i<firstDim[0]; i++){
    result_data[i] = new Array(firstDim[1]).fill(false);

    for(let j=0; j<firstDim[2]; j++){
      result_data[i][j] = new Array(firstDim[2]).fill(false);
    }
  }


  console.log(secondDim);

  for(var i=0; i<firstDim[0]; i++){
    for(var j=0; j<firstDim[1]; j++){
      for(var k=0; k<firstDim[2]; k++){

        var checker = [false, false, false];
        if(this.secondTransition[0] <= i+this.firstTransition[0] && i+this.firstTransition[0] < secondDim[0]+this.secondTransition[0]) checker[0] = true;
        if(this.secondTransition[2] <= j+this.firstTransition[2] && j+this.firstTransition[2] < secondDim[2]+this.secondTransition[2]) checker[2] = true;
        if(this.secondTransition[1] <= k+this.firstTransition[1] && k+this.firstTransition[1] < secondDim[1]+this.secondTransition[1]) checker[1] = true;

        if(checker[0] && checker[1] && checker[2]){


          if(this.firstVoxelData[i][j][k] && this.secondVoxelData[i+this.firstTransition[0]-this.secondTransition[0]][j+this.firstTransition[2]-this.secondTransition[2]][k+this.firstTransition[1]-this.secondTransition[1]] == true){
              result_data[i][j][k] = true;
          }

        }else{
          continue;
        }


      }
    }
  }

  console.log("Boolean Intersection finished");
  return result_data;

}
