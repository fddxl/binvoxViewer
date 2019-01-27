var InfillBuilder = function(){
  this.gyroidVoxData = null;
  this.infillVoxData = null;
  this.thickness = 1;

}

GyroidInfillGenerater.prototype.setInfill = function(voxData){
  this.infillVoxData = voxData;

}

GyroidInfillGenerater.prototype.setThickness = function(_thickness){
  this.thickness = _thickness;
}

GyroidInfillGenerater.prototype.generateInfill = function(voxData){

}
