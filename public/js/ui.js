
function attachListeners() {
  
  d3.select('button#unFilter')
    .on('click', unfilter);
  
  d3.select('select#fruitSelect')
    .on('change', doSelect);
}

function filterAllFarms(matcher) {
  
  //filter on city
  fruitApp.filteredData = _.filter(fruitApp.data, function(d) {
    return matcher.location_1.human_address.city === d.location_1.human_address.city;
  })
  
}

function filterAllFarmsFruit(fruit) {
  
  //filter on city
  fruitApp.filteredData = _.filter(fruitApp.data, function(d) {
    return fruit === d.item;
  })
  
}

function unfilter(d) {
  
  fruitApp.filteredData = fruitApp.data;
  updateTable();
}

function doSelect(d) {
  
  console.log(d);
  
}