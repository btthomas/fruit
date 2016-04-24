
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
  
  sortByCityAndId();
  
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

function sortById() {
  fruitApp.data = fruitApp.data.sort(function (a, b) {
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