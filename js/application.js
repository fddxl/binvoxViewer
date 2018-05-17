var viewer;
var degP = 0;
var controls;


//GUI
var guiCtrl = function(){
  this.limit_x = 100;
  this.limit_y = 100;
  this.limit_z = 100;
};

gui = new dat.GUI();
guiObj = new guiCtrl();

var folder = gui.addFolder('Folder');
folder.add(guiObj, 'limit_x', 0, 100).onChange(setLimit_binvox);
folder.add(guiObj, 'limit_y', 0, 100).onChange(setLimit_binvox);
folder.add(guiObj, 'limit_z', 0, 100).onChange(setLimit_binvox);
folder.open();


function setLimit_binvox(){
  viewer.binvoxV.setLimit([guiObj.limit_x, guiObj.limit_y, guiObj.limit_z]);
}
//end GUI




$(window).on('load', function() {
  var modelName = 'models/bunny.stl';
  viewer = new Viewer('canvas-viewer', modelName);
  controls = new THREE.OrbitControls(viewer.camera, viewer.renderer.domElement);


  animate();
  eventListeners();



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



function onAddFile(event){
  var files;
  var reader = new FileReader();

  if(event.target.files){
    files = event.target.files;
  }else{
    files = event.dataTransfer.files;
  }

  reader.onload = function(event){
    var raw = new Uint8Array(reader.result);

    viewer.binvoxV.load(raw);

    //gcodeTagaga.load(reader.result, viewer.scene);

    viewer.binvoxV.setVoxelToScene();

  }

  if (files[0]){
    reader.readAsArrayBuffer(files[0]);
    document.getElementById("inputfile").value = '';
  }
}



function deg2rad(deg) {
  return deg*THREE.Math.DEG2RAD;
}

function rad2deg(rad) {
  return rad*THREE.Math.RAD2DEG;
}
