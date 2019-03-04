var viewer;
var degP = 0;
var controls;


//GUI
var guiCtrl = function(){
  this.limit_x = 100;
  this.limit_y = 100;
  this.limit_z = 100;

  this.move_x = 0;
  this.move_y = 0;
  this.move_z = 0;

  this.booleanDifference = function(){
    viewer.booleanDifference();

  }

  this.booleanUnion = function(){
    viewer.booleanUnion();
  }

  this.booleanIntersection = function(){
    viewer.booleanIntersection();
  }

  this.exportBinvox = function(){
    viewer.exportBinvox();
  }

  this.exportFAV = function(){
    viewer.exportFAV();
  }

  this.reset = function(){
    for(var i=0; i<3; i++){
      folder.__controllers[i+3].setValue(0);
    }
    viewer.resetData();

  }

  this.buildInfill = function(){
    //hoghoge
    viewer.buildInfill();
  }

  this.exportPointCloud = function(){
    viewer.exportPointCloud();
  }
};

gui = new dat.GUI();
guiObj = new guiCtrl();

var folder = gui.addFolder('Folder');
folder.add(guiObj, 'limit_x', 0, 100).onChange(setLimit_binvox);
folder.add(guiObj, 'limit_y', 0, 100).onChange(setLimit_binvox);
folder.add(guiObj, 'limit_z', 0, 100).onChange(setLimit_binvox);

//moving
folder.add(guiObj, 'move_x', -100, 100).onChange(move_voxel);
folder.add(guiObj, 'move_y', -100, 100).onChange(move_voxel);
folder.add(guiObj, 'move_z', -100, 100).onChange(move_voxel);

folder.add(guiObj, 'booleanDifference');
folder.add(guiObj, 'booleanUnion');
folder.add(guiObj, 'booleanIntersection');

folder.add(guiObj, 'exportBinvox');
folder.add(guiObj, 'exportFAV');

folder.add(guiObj, 'reset');

folder.add(guiObj, 'buildInfill');
folder.add(guiObj, 'exportPointCloud');

//moving
folder.open();


function setLimit_binvox(){
  viewer.setLimit_voxel([guiObj.limit_x, guiObj.limit_y, guiObj.limit_z]);
}

function move_voxel(){

  viewer.move_voxel([parseInt(guiObj.move_x), parseInt(guiObj.move_y), parseInt(guiObj.move_z)]);

}
//end GUI




$(window).on('load', function() {
  var modelName = 'models/bunny.stl';
  viewer = new Viewer('canvas-viewer', modelName);

  controls = new THREE.OrbitControls(viewer.camera, viewer.renderer.domElement);


  animate();
  //eventListeners();



});

$(window).on('resize', function() {
  viewer.resize();
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  viewer.render();


  //viewer.loadMesh();
  //viewer.cameraPosition(90, degP);
  //degP += 1;

}


/*
function eventListeners() {
  $('#startInflation').on('click', function() {
    inflation = true;
  });

  $('#stopInflation').on('click', function() {
    inflation = false;
  });

  $('#exportSTL').on('click', function() {
    var filename = $('#filename').val();
    viewer.exportSTL(filename);
  });
}
*/



function onAddFile(event){
  var files;
  var reader = new FileReader();

  if(event.target.files){
    files = event.target.files;
  }else{
    files = event.dataTransfer.files;
  }

  reader.onload = function(){
    // var raw = new Uint8Array(reader.result);

    //viewer.binvoxV.load(raw);
    // viewer.loadBinvox(raw);

    //gcodeTagaga.load(reader.result, viewer.scene);

    //viewer.binvoxV.setVoxelToScene();

    viewer.loadFAV(reader.result);
  }

  if (files[0]) {
    reader.readAsDataURL(files[0]);
    document.getElementById("inputfile").value = '';
  }
}


function onAddFile2(event){
  var files;
  var reader = new FileReader();

  if(event.target.files){
    files = event.target.files;
  }else{
    files = event.dataTransfer.files;
  }

  reader.onload = function(event){
    var raw = new Uint8Array(reader.result);

    //viewer.binvoxV.load(raw);
    viewer.loadBinvox2(raw);

    //gcodeTagaga.load(reader.result, viewer.scene);

    //viewer.binvoxV.setVoxelToScene();

  }

  if (files[0]){
    reader.readAsArrayBuffer(files[0]);
    document.getElementById("inputfile").value = '';
  }
}
