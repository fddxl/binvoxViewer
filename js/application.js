var viewer;
var inflation = false;
var degP = 0;

var binvoxV;



$(window).on('load', function() {
  var modelName = 'models/bunny.stl';
  viewer = new Viewer('canvas-viewer', modelName);
  controls = new THREE.OrbitControls(viewer.getCamera());

  binvoxV = new binvoxViewer();

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

    binvoxV.set_rawData(raw);
    binvoxV.setVoxelToScene(viewer.getScene());

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
