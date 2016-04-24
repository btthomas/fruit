'use strict';

//namespace for globals
const fruitApp = {};

window.onload = function() {
  console.log('ready');
  
  makeMap();
  
  getDataFromApi(function(err, data) {
    
    if(err) {
      console.error(err);
    } else {
      cleanTheData(data);
    }
  });
}

function getDataFromApi(callback) {
  
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() { 
  if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
    callback(null, xmlHttp.responseText);
  }
  
  xmlHttp.open("GET", '/api/data', true);
  xmlHttp.send(null);
}

function cleanTheData(longString) {
  
  // console.log(data);
  
  try {
    const data = JSON.parse(longString);
    
    data.forEach(function(d) {

      //parse location_1.human_address
      d.location_1.human_address = JSON.parse(d.location_1.human_address);
    });
    
    fruitApp.data = data;
    
  } catch(err) {
    console.error('bad JSON parse', err);
  }
  
  displayByCity();
  
  drawFarms();

}