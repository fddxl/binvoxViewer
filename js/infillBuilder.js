var InfillBuilder = function(){

  this.infillVoxData = null;
  this.baseVoxData = null;
  this.thickness = 1;

}

InfillBuilder.prototype.setBaseVoxData = function(_baseVoxData){
  this.baseVoxData = _baseVoxData;
}

InfillBuilder.prototype.setInfillVoxData = function(_infillVoxData){
  this.infillVoxData = _infillVoxData;
}

InfillBuilder.prototype.setThickness = function(_thickness){
  this.thickness = _thickness;
}



InfillBuilder.prototype.buildInfill = function(){
  if(this.infillVoxData !== null && this.baseVoxData !== null){
    var baseDim = [this.baseVoxData.length, this.baseVoxData[0].length, this.baseVoxData[0][0].length];
    var infillDim = [this.infillVoxData.length, this.infillVoxData[0].length, this.infillVoxData[0][0].length];



    //fixing infill vox data
    if(baseDim[0] > infillDim[0] || baseDim[1] > infillDim[1] || baseDim[2] > infillDim[2]){
      var neoInfillData = (new Array(baseDim[0])).fill(false);

      for(var i=0; i<baseDim[0]; i++){
        neoInfillData[i] = new Array(baseDim[1]).fill(false);

        for(var j=0; j<baseDim[1]; j++){
          neoInfillData[i][j] = new Array(baseDim[2]).fill(false);
        }
      }


      var neoI = 0;
      var neoJ = 0;
      var neoK = 0;

      for(var i=0; i<baseDim[0]; i++){
        for(var j=0; j<baseDim[1]; j++){
          for(var k=0; k<baseDim[2]; k++){

            if(i >= infillDim[0]){
              neoI = i-infillDim[0];
            }else{
              neoI = i;
            }

            if(j >= infillDim[1]){
              neoJ = j-infillDim[1];
            }else{
              neoJ = j;
            }

            if(k >= infillDim[2]){
              neoK = k-infillDim[2];
            }else{
              neoK = k;
            }

            neoInfillData[i][j][k] = this.infillVoxData[neoI][neoJ][neoK];

          }
        }
      }
      this.infillVoxData = neoInfillData;
    }






    //init resultVoxData with false

    var insideVox = (new Array(baseDim[0])).fill(false);
    var outsideVox = (new Array(baseDim[0])).fill(false);

    for(var i=0; i<baseDim[0]; i++){
      insideVox[i] = new Array(baseDim[1]).fill(false);
      outsideVox[i] = new Array(baseDim[1]).fill(false);

      for(var j=0; j<baseDim[1]; j++){
        insideVox[i][j] = new Array(baseDim[2]).fill(false);
        outsideVox[i][j] = new Array(baseDim[2]).fill(false);
      }
    }




    //prepare "skin" and "inside"
    //cut off skin
    this.counter = 0;

    for(var i=0; i<this.thickness; i++){

      for(var a=0; a<baseDim[0]; a++){
        for(var b=0; b<baseDim[1]; b++){
          for(var c=0; c<baseDim[2]; c++){

            if(this.baseVoxData[a][b][c] != true){
              continue;
            }

            this.counter = 0;

            if(a>0 && this.baseVoxData[a-1][b][c]) this.counter +=1;
            if(a<baseDim[0]-1 && this.baseVoxData[a+1][b][c]) this.counter +=1;

            if(b>0 && this.baseVoxData[a][b-1][c]) this.counter +=1;
            if(b<baseDim[1]-1 && this.baseVoxData[a][b+1][c]) this.counter +=1;

            if(c>0 && this.baseVoxData[a][b][c-1]) this.counter +=1;
            if(c<baseDim[2]-1 && this.baseVoxData[a][b][c+1]) this.counter +=1;


            if(this.counter == 6){
              outsideVox[a][b][c] = false;
              insideVox[a][b][c] = true;

            }else{
              outsideVox[a][b][c] = true;
              insideVox[a][b][c] = false;
            }
          }
        }
      }

      for(var a=0; a<baseDim[0]; a++){
        for(var b=0; b<baseDim[1]; b++){
          for(var c=0; c<baseDim[2]; c++){
            if(outsideVox[a][b][c]) this.baseVoxData[a][b][c] = false;
          }
        }
      }
      
    }

    //boolean
    var booler = new VoxelBoolean();

    booler.setFirstVoxelData(insideVox);
    booler.setSecondVoxelData(this.infillVoxData);
    booler.setFirstTransition([0,0,0]);
    booler.setSecondTransition([0,0,0]);

    //console.log("insideVox");
    //console.log(insideVox);

    //return insideVox;
    //return outsideVox;

    //console.log("outside");
    //console.log(outsideVox);

    var resultInsideVox = booler.booleanIntersection();

    var resultVox = (new Array(baseDim[0])).fill(false);
    for(var i=0; i<baseDim[0]; i++){
      resultVox[i] = new Array(baseDim[1]).fill(false);

      for(var j=0; j<baseDim[1]; j++){
        resultVox[i][j] = new Array(baseDim[2]).fill(false);
      }
    }



    //Union
    for(var i=0; i<baseDim[0]; i++){
      for(var j=0; j<baseDim[1]; j++){
        for(var k=0; k<baseDim[2]; k++){

          if(resultInsideVox[i][j][k] || outsideVox[i][j][k]){
            resultVox[i][j][k] = true;
          }

        }
      }
    }

    return resultVox;

  }else{
    console.log("Voxel data is null");
  }
}
