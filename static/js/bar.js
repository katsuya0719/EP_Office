var width = 1200,
    height = 600

var svg = d3.select("#bar").append("svg")
    .attr("width", width)
    .attr("height", height),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function barChart(csv){
  d3.csv(csv, function(d,i) {
    var arr = Object.keys(d).map(function (key) {return d[key]});
    d.room = arr[0];
    d.area = +d["Area [m2]"];
    d.Light = +d["Lighting [W/m2]"];
    d.People = +d["People [m2 per person]"];
    d.Plug = +d["Plug and Process [W/m2]"];
    return d;
  }, function(error, data) {
    if (error) throw error;
    var len=Object.keys(data).length;
    var data1=[];
    data.forEach(function(d,i){
      if(i<len-5){
        data1.push(d);
      }
    });
    console.log(data1);
    x.domain(data1.map(function(d) { return d.room; }));
    y.domain([0, d3.max(data1, function(d) { return d.area; })]);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Frequency");

    g.selectAll(".bar")
      .data(data1)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.room); })
        .attr("y", function(d) { return y(d.area); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.area); });
  });
};
function cleandata(data){

};
barChart("static/csv/Nantou/Zone.csv")
