
const Table = React.createClass({
  getInitialState: function() {
    return {
      headers: [],
      data: []
    };
  },
  
  componentDidMount: function() {
    this.serverRequest = getJson(this.props.source, function (result) {
      
      this.setState({
        headers: result.headers,
        data: result.data
      });
    }.bind(this));
  },
  
  componentWillUnmount: function() {
    this.serverRequest.abort();
  },
  
  render: function() {
    return (
      <table className="table table-bordered table-condensed table-striped" id="table">
        <THead headers={this.state.headers}/>
        <TBody headers={this.state.headers} data={this.state.data}/>
      </table>
    );
  }
});

const THead = React.createClass({
  render: function() {
    
    let heads = this.props.headers.map(function(field) {
      return (
        <th key={field.name}> {field.name} </th>
      );
    });
    
    return (
      <thead>
        <tr>
          {heads}
        </tr>
      </thead>
    );
  }
});

const TBody = React.createClass({

  render: function() {
    
    let rows = this.props.data.map(function(d) {
      return (
        <TRow key={d.num} data={d} headers={this.props.headers}/>
      );
    }, this);
        
    return (
      <tbody>
        {rows}
      </tbody>
    );
  }
});

const TRow = React.createClass({
  render: function() {
    
    let cells = this.props.headers.map(function(head) {
      return (
        <td key={head.name + this.props.num}>
          {head.get(this.props.data)}
        </td>
      );
    }, this);
    
    return (
      <tr key={this.props.data.num}>
        {cells}
      </tr>
    );
  }
});

function getJson(url, callback) {
  
  getFromUrl(url, function(err, longString) {
    
    if(err) {
      callback(err);
    } else {
      
      //clean it!
      const data = JSON.parse(longString);
      
      data.forEach(function(d, i) {
        //parse location_1.human_address
        d.location_1.human_address = JSON.parse(d.location_1.human_address);
        
        //add key
        d.num = i;
      });
    
      callback({
        headers: getHeaders(),
        data: data
      });     
    }
  });
};
        
function getFromUrl(url, callback) {

  const xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() { 
  if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
    callback(null, xmlHttp.responseText);
  }
  
  xmlHttp.open("GET", url, true);
  xmlHttp.send(null);
}

function getHeaders() {
  
  return [
    {
      name: 'Farm Name',
      get: function(d) {return d.farm_name}
    },
    {
      name: 'Farmer ID',
      get: function(d) {return d.farmer_id}
    },
    {
      name: 'Item',
      get: function(d) {return d.item}
    },
    {
      name: 'City',
      get: function(d) {return d.location_1.human_address.city}
    },
    {
      name: 'State',
      get: function(d) {return d.location_1.human_address.state}
    },
    {
      name: 'Zipcode',
      get: function(d) {return d.location_1.human_address.zip}
    },
    {
      name: 'Phone #',
      get: function(d) {return d.phone1}
    },
  ];
}
  
ReactDOM.render(
  <Table source="data.json" />,
  document.getElementById('sheet')
);