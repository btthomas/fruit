'use strict';

//namespace for globals
const fruitApp = {};

window.onload = function() {
  console.log('ready');
  
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

}

function displayByCity() {
  
  d3.select('#loading').remove();
  
  const $table = d3.select('#table');
  
  //make headers!
  const $headers = $table.append('thead').append('tr').classed('header', true)
  const headers = getHeaders();
  
  $headers.selectAll('th')
    .data(headers)
    .enter()
      .append('th')
      .html(function(field) {return field.name;});  
  
  const $trEnter = $table.append('tbody').selectAll('tr.datum')
    .data(fruitApp.data).enter()
    .append('tr');
  
  headers.forEach(function(field) {
    
    $trEnter.append('td')
      .html(function(d) {
        if(typeof field.path === 'string') {
          
          return d[field.path]
        } else {
          let out = d;
          //loop through array
          field.path.forEach(function(path) {
            out = out[path];
          });
          return out;
        }
      });    
  }) 
  
}

function getHeaders() {
  
  return [
    {
      name: 'Farm Name',
      path: 'farm_name'
    },
    {
      name: 'Farmer ID',
      path: 'farmer_id'
    },
    {
      name: 'Item',
      path: 'item'
    },
    {
      name: 'City',
      path: ['location_1', 'human_address', 'city']
    },
    {
      name: 'State',
      path: ['location_1', 'human_address', 'state']
    },
    {
      name: 'Zipcode',
      path: ['location_1', 'human_address', 'zip']
    },
  ];  
}