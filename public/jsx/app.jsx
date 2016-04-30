
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
  
  doSort: function(name) {
    const head = this.state.headers.find(function(h) {return h.name === name});
    const getter = head.get;
    
    // this will allow a stable sort
    this.state.data.forEach(function(d, i) {d.order = i;});

    this.setState({
      data: this.state.data.sort(function(a, b) {
        let diff;
        if(head.cast) {
          diff = +getter(a) - +getter(b);
        } else {
          diff = getter(a).toLowerCase().localeCompare(getter(b).toLowerCase());
        }
        if(diff === 0) {
          return a.order - b.order;
        } else {
          return diff;
        }
      })
    });
  },
  
  render: function() {
    return (
      <table className="table table-bordered table-condensed table-striped" id="table">
        <THeads headers={this.state.headers} handleSort={this.doSort} />
        <TBody headers={this.state.headers} data={this.state.data}/>
      </table>
    );
  }
});

const THeads = React.createClass({
  
  render: function() {
    
    let heads = this.props.headers.map(function(field) {
      return (
        <THead key={field.name} name={field.name} handleSort={this.props.handleSort} />
      );
    }, this);
    
    return (
      <thead>
        <tr>
          {heads}
        </tr>
      </thead>
    );
  }
});

const THead = React.createClass({
  handleSort: function(e) {
    this.props.handleSort(this.props.name);
  },
  
  render: function() {
    return (
      <th> 
        {this.props.name}
        <span className="pull-right">
          <button className="btn btn-xs" onClick={this.handleSort}> sort </button>
        </span>
      </th>
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
      get: function(d) {return d.farm_name},
      cast: false
    },
    {
      name: 'Farmer ID',
      get: function(d) {return d.farmer_id},
      cast: true
    },
    {
      name: 'Item',
      get: function(d) {return d.item},
      cast: false
    },
    {
      name: 'City',
      get: function(d) {return d.location_1.human_address.city},
      cast: false
    },
    {
      name: 'State',
      get: function(d) {return d.location_1.human_address.state},
      cast: false
    },
    {
      name: 'Zipcode',
      get: function(d) {return d.location_1.human_address.zip},
      cast: true
    },
    {
      name: 'Phone #',
      get: function(d) {return d.phone1},
      cast: false
    },
  ];
}
  
ReactDOM.render(
  <Table source="data.json" />,
  document.getElementById('sheet')
);