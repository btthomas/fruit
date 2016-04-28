'use strict';

fruitApp.aspectRatio = 4;

function makeMap() {
  
  const g = d3.select('#map').append('svg');
	g.attr('id', 'svg')
	  .attr('width', +d3.select('#map').style('width').slice(0,-2) - 48)
    .attr('height', g.attr('width') / fruitApp.aspectRatio);
    
  g.append('g')
    .attr('id', 'states');

  g.append('g')
    .attr('id', 'farms');
    
  let projection = d3.geo.albersUsa()
		.scale(9 * g.attr('width'))
		.translate([-g.attr('width')/ 0.4, g.attr('height') / 0.28]);

	const path = d3.geo.path()
		.projection(projection);
    
  fruitApp.projection = projection;
  fruitApp.path = path;
  
  d3.json('states.geojson', drawStates);
  
}

function drawStates(err, stateGeoJson) {

  if(err) {
    console.error('bad load, states.geojson', err);
    return;
  } 

  d3.select('#states').selectAll('.state')
    .data(stateGeoJson.features)
    .enter().append('path')
    .attr('class', 'state')
		.attr('d', fruitApp.path);
}

function drawFarms() {

  d3.select('#farms').selectAll('.farm') 
    .data(fruitApp.data)
    .enter().append('circle')
      .attr('cx', function(d) { 
        return fruitApp.projection([+d.location_1.longitude, +d.location_1.latitude])[0]
      })
      .attr('cy', function(d) { 
        return fruitApp.projection([+d.location_1.longitude, +d.location_1.latitude])[1]
      })
      .attr('r', 2)
      .attr('class', 'farm')
      .on('click', filterCity);
      
}

function filterCity(d) {

  filterAllFarms(d);
  
  updateTable();
}