var BinvoxExporter = function(){

}


BinvoxExporter.prototype.export = function(_voxelData){
  var Stream = "hello world"
  var FileName = "hoge.txt"


  var header = "#binvox 1\n";
  header += "dim " + _voxelData.length.toString(10) + " " + _voxelData[0].length.toString(10) + " " + _voxelData[0][0].length.toString(10) + "\n";
  header += "transition 0 0 0\n";
  header += "scale 1\n";
  header += "data\n";

  if(window.navigator.msSaveBlob){
    window.navigator.msSaveBlob(new Blob([header], { type: "text/plain" }), FileName);
  }else{
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([header], { type: "text/plain" }));
    a.download = FileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

}
