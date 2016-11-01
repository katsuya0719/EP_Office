var causes = ["wounds", "other", "disease"];

var parseDate = d3.time.format("%m/%Y").parse;

var margin = {top: 20, right: 50, bottom: 30, left: 20},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width]);

var y = d3.scale.linear()
    .rangeRound([height, 0]);

var z = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.time.format("%b"));

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("right");

var svg = d3.select("#bar").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function barChart(csv){
  
  d3.tsv(csv, type, function(error, crimea) {
  
  if (error) throw error;
  //console.log(crimea)
  var layers = d3.layout.stack()(causes.map(function(c) {
    return crimea.map(function(d) {
      return {x: d.date, y: d[c]};
    });
  }));
  
  /*
  d3.csv(csv,function(data){
      data.forEach(function(d){
            if(d.Subcategory=="General"){
                d.category = d[""]
            }else if(d.Subcategory!="General"){
                d.category = d.Subcategory;
            d.electricity= +d["Electricity [kWh]"];
          }; 
      });
      
      var data = data.filter(function(item){
            if (item.electricity>0){
                return true;
                }
            });
      
      //console.log(data);

      convertArr(data,"electricity");
  });
  */

  console.log(layers)
  x.domain(layers[0].map(function(d) { return d.x; }));
  y.domain([0, d3.max(layers[layers.length - 1], function(d) { return d.y0 + d.y; })]).nice();

  var layer = svg.selectAll(".layer")
      .data(layers)
    .enter().append("g")
      .attr("class", "layer")
      .style("fill", function(d, i) { return z(i); });

  layer.selectAll("rect")
      .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.x); })
      .attr("y", function(d) { return y(d.y + d.y0); })
      .attr("height", function(d) { return y(d.y0) - y(d.y + d.y0); })
      .attr("width", x.rangeBand() - 1);

  svg.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "axis axis--y")
      .attr("transform", "translate(" + width + ",0)")
      .call(yAxis);
  });

};

function type(d) {
  d.date = parseDate(d.date);
  causes.forEach(function(c) { d[c] = +d[c]; });
  return d;
}

function convertArr(obj,key){
  arr=[];
  obj.forEach(function(d){
    
    Object.keys(d).forEach(function(p){
    //console.log(p);
      if(p=="category"){
        arr.push(d[p]);
      }
    });
    /*
    for (var category in obj){
    arr.push(category);
    };
    */
  });
  
  /*
  var arr=[]
  for (var category in obj){
    arr.push(category);
  };
  */
  console.log(arr);
  var layers = d3.layout.stack()(arr.map(function(c) {
    return obj.map(function(d,i) {
      return {x: i, y: d[c]};
    });
  }));
  console.log(layers);
};
barChart("static/csv/crimea.tsv")
barChart("static/csv/Nantou/energy.csv")
