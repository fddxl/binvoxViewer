var Viewer = function (elementId, modelName) {

  this.cameraDistance = 1000;
  //this.boxSize = 0.4418847653807891;
  this.boxSize = 500;
  this.container = document.getElementById(elementId);

  // Camera
  this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 0.1, 3500);
  this.camera.position.set(0, 0, this.cameraDistance);
  this.camera.lookAt(new THREE.Vector3(0, 0, 0));


  //this.controls = new THREE.OrbitControls(this.cmaera);


  // Scene
  this.scene = new THREE.Scene();
  this.scene.fog = new THREE.Fog(0xffffff, 2, 3500);


  //Objects
  //this.loadMesh();
  this.helpers();


  // Lights
  this.scene.add(new THREE.HemisphereLight(0x443333, 0x111122));
  this.addShadowedLight(1, 1, 1, 0xdddddd, 0.5);
  this.addShadowedLight(0.5, 1, -1, 0xaaaaaa, 1);

  // renderer
  this.renderer = new THREE.WebGLRenderer({antialias:true, preserveDrawingBuffer:true});
  this.renderer.setClearColor(this.scene.fog.color);
  this.renderer.setPixelRatio(window.devicePixelRatio);
  this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  this.renderer.gammaInput = true;
  this.renderer.gammaOutput = true;
  this.renderer.shadowMap.enabled = true;
  this.renderer.shadowMap.renderReverseSided = false;
  this.container.appendChild(this.renderer.domElement);


  //binvox loader
  this.binvoxV = new binvoxLoader([100.0, 100.0, 100.0], this.scene);


  //new binvoxLoader
  this.binvoxV2 = new BinvoxLoader()

  //voxelViewer
  this.voxV = new VoxelViewer();


  //transition data
  this.firstTransition = [0,0,0];




};

//function for binvox
Viewer.prototype.setLimit_voxel = function() {


  if(this.geo!== undefined){

    this.scene.remove(this.mesh);
    this.geo.dispose();
    this.material.dispose();
  }

  if(this.booledGeo !== undefined){
    this.scene.remove(this.booledMesh);
    this.booledGeo.dispose();
    this.booledMaterial.dispose();
  }


  this.voxV.setLimit([guiObj.limit_x, guiObj.limit_y, guiObj.limit_z]);

  //this.geo = this.voxV.convertVoxelToGeometry(this.voxData, 1.0);
  this.geo = this.voxV.convertVoxelToGeometry(this.booledVoxData, 1.0);
  this.material = new THREE.MeshPhongMaterial({
    color: 0x00ff00
  })

  this.mesh = new THREE.Mesh(this.geo, this.material);
  this.mesh.castShadow = true;

  this.scene.add(this.mesh);

}



//original

Viewer.prototype.resize = function () {
  this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
};

Viewer.prototype.render = function () {
  this.renderer.render(this.scene, this.camera);
};



Viewer.prototype.loadBinvox = function(data){
  var scope = this;

  filename = "../models/Bunny.binvox";
  var loader = new BinvoxLoader();

  this.voxData = loader.parse(data);

  this.geo = this.voxV.convertVoxelToGeometry(this.voxData, 1.0);

  this.material = new THREE.MeshPhongMaterial({
    color: 0xff0000
  })

  this.mesh = new THREE.Mesh(this.geo, this.material);
  this.mesh.castShadow = true;
  this.scene.add(this.mesh);

}

Viewer.prototype.loadBinvox2 = function(data){
  var scope = this;

  filename = "../models/Bunny.binvox";
  var loader = new BinvoxLoader();

  this.voxData2 = loader.parse(data);


  this.geo2 = this.voxV.convertVoxelToGeometry(this.voxData2, 1.0);

  this.material2 = new THREE.MeshPhongMaterial({
    color: 0x0000ff
  })

  this.mesh2 = new THREE.Mesh(this.geo2, this.material2);
  this.mesh2.castShadow = true;
  this.scene.add(this.mesh2);

}



Viewer.prototype.loadMesh = function(){
  //var geometry = new THREE.BoxBufferGeometry(0.2, 0.2, 0.2);


  var material = new THREE.MeshPhongMaterial({color:0xff0000, specular:0x00ff00, shininess:40});

  var geometry = new THREE.Geometry();

  for(var i=0; i<30; i++){
    geometry.vertices.push(new THREE.Vector3(Math.random()*0.5 - 0.25, Math.random()*0.5 - 0.25, Math.random()*0.5 - 0.25));
  }

  for(var i=0; i<10; i++){
    geometry.faces.push(new THREE.Face3(i*3, i*3+1, i*3+2));

    col = new THREE.Color(Math.random(), Math.random(), Math.random());
    material = new THREE.MeshBasicMaterial({color: col});

    var mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
  }



  /*
  var mesh = new THREE.Mesh(geometry, material);

  this.scene.add(mesh);
  */


};

Viewer.prototype.helpers = function () {
  // Box
  /*
  var box = new THREE.Box3();
  var boxSize = this.boxSize;
  box.setFromCenterAndSize(new THREE.Vector3(0, 0, 0), new THREE.Vector3(boxSize, boxSize, boxSize));
  var boxHelper = new THREE.Box3Helper(box, 0x777777);
  this.boxHelper = boxHelper;
  this.scene.add(boxHelper);
  */

  // Sphere
  // var radius = Math.sin(deg2rad(22.5));
  // var sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
  // var sphereMaterial = new THREE.MeshBasicMaterial({color:0xff0000, transparent:true, opacity:0.1});
  // var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  // this.scene.add(sphere);
};

Viewer.prototype.addShadowedLight = function (x, y, z, color, intensity) {
  var directionalLight = new THREE.DirectionalLight(color, intensity);
  directionalLight.position.set(x, y, z);
  this.scene.add(directionalLight);
  var d = 100;
  directionalLight.shadow.camera.left = -d;
  directionalLight.shadow.camera.right = d;
  directionalLight.shadow.camera.top = d;
  directionalLight.shadow.camera.bottom = -d;
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 4;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.bias = -0.005;
  directionalLight.castShadow = true;
}

Viewer.prototype.cameraPosition = function (degT, degP) {
  var radT = deg2rad(degT);
  var radP = deg2rad(degP);
  var z = Math.sin(radT) * Math.cos(radP);
  var x = Math.sin(radT) * Math.sin(radP);
  var y = Math.cos(radT);
  this.camera.position.set(x, y, z);
  this.render();
};

Viewer.prototype.getCamera = function(){
  return this.camera;
}

Viewer.prototype.getScene = function(){
  return this.scene;
}



Viewer.prototype.move_voxel = function(_transition){
  this.firstTransition = _transition;

  this.voxV.move(_transition);

  if(this.geo!== undefined){

    this.scene.remove(this.mesh);
    this.geo.dispose();
    this.material.dispose();
  }else{
    return;
  }

  this.geo = this.voxV.convertVoxelToGeometry(this.voxData, 1.0);
  this.material = new THREE.MeshPhongMaterial({
    color: 0xff0000
  })

  this.mesh = new THREE.Mesh(this.geo, this.material);
  this.mesh.castShadow = true;

  this.scene.add(this.mesh);
}




//Boolean

Viewer.prototype.booleanUnion = function(){

  if(this.voxData !== undefined && this.voxData2 !== undefined){
    var booler = new VoxelBoolean();

    booler.setFirstVoxelData(this.voxData);
    booler.setSecondVoxelData(this.voxData2);
    booler.setFirstTransition(this.firstTransition);
    booler.setSecondTransition([0,0,0]);
    console.log(this.firstTransition);

    var result = booler.booleanUnion();


    this.scene.remove(this.mesh);
    this.scene.remove(this.mesh2);
    this.geo.dispose();
    this.material.dispose();
    this.geo2.dispose();
    this.material2.dispose();

    this.voxV.move([0,0,0]);

    this.booledVoxData = result;
    this.booledGeo = this.voxV.convertVoxelToGeometry(result, 1.0);
    this.booledMaterial = new THREE.MeshPhongMaterial({
      color: 0x0000ff
    })

    this.booledMesh = new THREE.Mesh(this.booledGeo, this.booledMaterial);
    this.booledMesh.castShadow = true;

    this.scene.add(this.booledMesh);




  }else{
    console.log("voxData is not eough");
  }



}

Viewer.prototype.booleanDifference = function(){
  if(this.voxData !== undefined && this.voxData2 !== undefined){
    var booler = new VoxelBoolean();

    booler.setFirstVoxelData(this.voxData);
    booler.setSecondVoxelData(this.voxData2);
    booler.setFirstTransition(this.firstTransition);
    booler.setFirstTransition([-this.voxData.length/2, -this.voxData[0].length/2, -this.voxData[0][0].length/2]);
    booler.setSecondTransition([-this.voxData2.length/2, -this.voxData2[0].length/2, -this.voxData2[0][0].length/2]);
    console.log(this.firstTransition);

    var result = booler.booleanDifference();


    this.scene.remove(this.mesh);
    this.scene.remove(this.mesh2);
    this.geo.dispose();
    this.material.dispose();
    this.geo2.dispose();
    this.material2.dispose();

    this.booledVoxData = result;
    this.booledGeo = this.voxV.convertVoxelToGeometry(result, 1.0);
    this.booledMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ff00
    })

    this.booledMesh = new THREE.Mesh(this.booledGeo, this.booledMaterial);
    this.booledMesh.castShadow = true;

    this.scene.add(this.booledMesh);




  }else{
    console.log("voxData is not eough");
  }
}

Viewer.prototype.booleanIntersection = function(){

  if(this.voxData !== undefined && this.voxData2 !== undefined){
    var booler = new VoxelBoolean();

    booler.setFirstVoxelData(this.voxData);
    booler.setSecondVoxelData(this.voxData2);
    booler.setFirstTransition(this.firstTransition);
    booler.setSecondTransition([0,0,0]);


    var result = booler.booleanIntersection();


    this.scene.remove(this.mesh);
    this.scene.remove(this.mesh2);
    this.geo.dispose();
    this.material.dispose();
    this.geo2.dispose();
    this.material2.dispose();

    this.booledVoxData = result;
    this.booledGeo = this.voxV.convertVoxelToGeometry(result, 1.0);
    this.booledMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ff00
    })

    this.booledMesh = new THREE.Mesh(this.booledGeo, this.booledMaterial);
    this.booledMesh.castShadow = true;

    this.scene.add(this.booledMesh);




  }else{
    console.log("voxData is not eough");
  }

}


Viewer.prototype.exportBinvox = function(){
  console.log("fuck you");
  var bE = new BinvoxExporter();
  bE.export();
}


Viewer.prototype.resetData = function(){
    this.voxV.move([0,0,0]);

  if(this.geo!== undefined){

    this.scene.remove(this.mesh);
    this.geo.dispose();
    this.material.dispose();
  }

  if(this.geo2 !== undefined){
    this.scene.remove(this.mesh2);
    this.geo2.dispose();
    this.material2.dispose();
  }

  if(this.booledGeo !== undefined){
    this.scene.remove(this.booledMesh);
    this.booledGeo.dispose();
    this.booledMaterial.dispose();
  }
}



//Infill Builder

Viewer.prototype.buildInfill = function(){

  var thick = 1;
  var _baseVoxData = this.voxData;
  var _infillVoxData = this.voxData2;


  var builder = new InfillBuilder();

  builder.setBaseVoxData(_baseVoxData);
  builder.setInfillVoxData(_infillVoxData);
  builder.setThickness(thick);

  resultVoxData = builder.buildInfill();


  this.scene.remove(this.mesh);
  this.scene.remove(this.mesh2);
  this.geo.dispose();
  this.material.dispose();
  this.geo2.dispose();
  this.material2.dispose();

  this.booledVoxData = resultVoxData;
  this.booledGeo = this.voxV.convertVoxelToGeometry(resultVoxData, 1.0);
  this.booledMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ffff
  })

  this.booledMesh = new THREE.Mesh(this.booledGeo, this.booledMaterial);
  this.booledMesh.castShadow = true;

  this.scene.add(this.booledMesh);

  console.log("build infill done");

}

Viewer.prototype.exportPointCloud = function(){

  var FileName = "hoge.txt"
  var Stream = "";
  for(var i=0; i<this.booledVoxData.length; i++){
    for(var j=0; j<this.booledVoxData[0].length; j++){
      for(var k=0; k<this.booledVoxData[0][0].length; k++){

        if(this.booledVoxData[i][j][k]){
          Stream += i.toString(10) + "," + j.toString(10) + "," + k.toString(10) + "\n";
        }

      }
    }
  }



  if(window.navigator.msSaveBlob){
    window.navigator.msSaveBlob(new Blob([Stream], { type: "text/plain" }), FileName);
  }else{
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([Stream], { type: "text/plain" }));
    a.download = FileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

}
