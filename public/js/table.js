
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
  
  // sortByCityAndId();
  
  const $trEnter = $table.append('tbody').attr('id', 'tbody')
    .selectAll('tr.datum')
      .data(fruitApp.data, dataKey)
      .enter()
        .append('tr')
        .attr('class', 'datum');
      
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
  $trEnter.sort(byCity);
}

function dataKey(d) {
  return _.toArray(d).join('-');
}

function updateTable() {

  sortById();
  
  const $trData = d3.select('tbody').selectAll('tr.datum')
    .data(fruitApp.filteredData, dataKey);

  $trData.exit().remove();
  
  const $trEnter = $trData.enter()
    .append('tr')
    .attr('class', 'datum');
  
  getHeaders().forEach(function(field) {
    
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
  $trData.sort(byCity);
}

function byCity(a, b) {
  
  const aLowerCase = a.location_1.human_address.city.toLowerCase();
  const bLowerCase = b.location_1.human_address.city.toLowerCase();

  if(aLowerCase < bLowerCase) {
    return -1;
  } else if(aLowerCase > bLowerCase) {
    return 1;
  }
  //equal now check id
  const aInt = +a.farmer_id;
  const bInt = +b.farmer_id;
    
  return (aInt - bInt);
}

function sortById() {
  fruitApp.filteredData = fruitApp.filteredData.sort(function (a, b) {
    const aInt = +a.farmer_id;
    const bInt = +b.farmer_id;
    
    return (aInt - bInt);
  });
}

function sortByCityAndId() {
  fruitApp.data = fruitApp.data.sort(function (a, b) {
    const aLowerCase = a.location_1.human_address.city.toLowerCase();
    const bLowerCase = b.location_1.human_address.city.toLowerCase();

    if(aLowerCase < bLowerCase) {
      return -1;
    } else if(aLowerCase > bLowerCase) {
      return 1;
    }
    //equal now check id
    const aInt = +a.farmer_id;
    const bInt = +b.farmer_id;
    
    return (aInt - bInt);
  });
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