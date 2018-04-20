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

    var result = '';
    var as = '';
    var flg = false;
    var doubleFlg = false;

    var convertedDec = '';
    var raw_data = [];

    for(var i =0; i<raw.length; i++){

      //if(i >= raw.length) break;

      result += ' ' + IntToHex(Number(raw[i]), 2).replace('0x','');
      if(raw[i] >= 32 && raw[i] <= 126){
        as += String.fromCharCode(raw[i]);
      }

      if(flg == true){

        if(doubleFlg){
          //convertedDec += parseInt(IntToHex(Number(raw[i]),2), 16) + ' ';
          //convertedDec += raw[i];
          raw_data.push(raw[i]);
        }

        if(doubleFlg == false){
          doubleFlg = true;
        }

      }

      if(as[as.length-4] == 'd' && as[as.length-3] == 'a' && as[as.length-2] == 't' & as[as.length-1] == 'a'){
        flg = true;
      }

    }

    //console.log(result);
    //console.log(as);
    console.log(raw_data);
    var data_set = [];

    for(var i=0; i<raw_data.length; i+=2){
      if(raw_data[i] == 0){
        for(var j=0; j<raw_data[i+1]; j++){
          data_set.push(false);
        }

      }else if(raw_data[i] == 1){
        for(var j=0; j<raw_data[i+1]; j++){
          data_set.push(true);
        }
      }

    }
  }


  if (files[0]){
    reader.readAsArrayBuffer(files[0]);
    document.getElementById("inputfile").value = '';
  }

}

function IntToHex(value, digits){
  var result = value.toString(16).toUpperCase();
  var len = result.length;
  /*
  for(var i=len; i<digits; i++){
    result = '0' + result;
  }
  */

  return '0x' + result;
}






class binvoxViewer{

  /*
  constructor(_file){
    this.file = _file;
  }
  */
  constructor(){

  }

  read_header(){
    var tmp = this.file.split("\n");

    //check this file is binvox file
    var tmp2 = tmp[0].split(" ");

    if(tmp2[0] == "#binvox"){
      console.log("this file is binvox file");
    }else{
      console.log("fuck you");
      console.log(tmp2[0]);
    }


    //check dim
    var tmp3 = tmp[1].split(" ");
    if(tmp3[0] == "dim" && tmp3.length > 3){
      this.dimX = tmp3[1];
      this.dimY = tmp3[2];
      this.dimZ = tmp3[3];

      console.log("dim value");
      console.log(this.dimX);
      console.log(this.dimY);
      console.log(this.dimZ);
    }else{
      console.log("dim is not found")
    }


    //check translate
    var tmp4 = tmp[2].split(" ");
    if(tmp4[0] == "translate" && tmp4.length>3){

      this.translateX = tmp4[1];
      this.translateY = tmp4[2];
      this.translateZ = tmp4[3];

      console.log("translate value");
      console.log(this.translateX);
      console.log(this.translateY);
      console.log(this.translateZ);

    }else{
      console.log("translate is not found");
    }


    //check scale
    var tmp5 = tmp[3].split(" ");
    if(tmp5[0] == "scale" && tmp5.length > 1){
      this.scale = tmp5[1];

      console.log("scale value");
      console.log(this.scale);
    }else{
      console.log("scale is not found");
    }


    //check data
    var tmp6 = tmp[4];
    if(tmp6 == "data"){
      console.log("data is as follows")
    }


    //read data
    //console.log(tmp[5]);
    var uniString = [];
    for(var i=0; i<tmp[5].length; i++){
      uniString.push(String.fromCharCode(parseInt(tmp[5][i], 2)));
    }
    console.log(uniString.join(''));
    /*
    var dt = String.fromCharCode.apply("", new Uint8Array(tmp[5]));
    console.log(dt);
    */

  }

  set_rawData(_rawData){

  }
  read_binary(src){
  }


}
