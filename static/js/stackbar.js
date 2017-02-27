var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 150, left: 40},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1)
    .align(0.1);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

//var z = d3.scaleOrdinal()
//    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

//var z=d3.scaleOrdinal(d3.schemeCategory20)
var z=d3.scaleOrdinal().range(["#adff00","#00ff83","#00d27f","#b3ecec","#3bd6c6","#fffeb3","#fb2e01","#f1c27d","#ffbf00"])
var gain=["Equipment Sensible Heat Addition [GJ]","HVAC Terminal Unit Sensible Air Heating [GJ]","HVAC Zone Eq & Other Sensible Air Heating [GJ]","Infiltration Heat Addition [GJ]","Interzone Air Transfer Heat Addition [GJ]","Lights Sensible Heat Addition [GJ]","Opaque Surface Conduction and Other Heat Addition [GJ]","People Sensible Heat Addition [GJ]","Window Heat Addition [GJ]"]
z.domain(gain)
var stack = d3.stack();
console.log(z.domain())
function readcsv(csv){
  console.log(csv);
  d3.csv(csv, type, function(error, data) {
      if (error) throw error;
      data.sort(function(a, b) { return b.total - a.total; });
      data1=exarr(data,"Total Facility")
      //console.log(data1);
      data=data1.slice(0, 50);
      data["columns"]=data1["columns"]
      console.log(data);
      //console.log(data.map(function(d) { return d["room"]; }))
      x.domain(data.map(function(d) { return d["room"]; }));
      var ylim= d3.max(data, function(d) { return d.total; });
      y.domain([0, ylim]).nice();
      //console.log(y.domain())
      //z.domain(data.columns.slice(1));
      z.domain(gain);
      data.columns=gain
      console.log(stack.keys(data.columns));
      console.log(stack.keys(data.columns.slice(1))(data));

      g.selectAll(".serie")
        .data(stack.keys(data.columns)(data))//difficult to understand
        .enter().append("g")
          .attr("class", "serie")
          .attr("fill", function(d) { return z(d.key); })
        .selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
          .attr("x", function(d) { return x(d.data.room); })
          .attr("y", function(d) { return y(d[1]); })
          .attr("height", function(d) { return y(d[0]) - y(d[1]); })
          .attr("width", x.bandwidth());

      g.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x))
        .selectAll("text")
         .style("text-anchor", "end")
         .attr("y", -5)
         .attr("x", -10)
         .attr("transform", "rotate(-90)");


      g.append("g")
          .attr("class", "axis axis--y")
          //.call(d3.axisLeft(y).ticks(10, "s"))
          .call(d3.axisLeft(y))
        .append("text")
          .attr("x", 2)
          //.attr("y", y(y.ticks(10).pop()))
          .attr("dy", "0.35em")
          .attr("text-anchor", "start")
          .attr("fill", "#000")
          .text("Heat gain[GJ]");

      console.log(z.domain())
      var legend = g.selectAll(".legend")
        //.data(data.columns.slice(1).reverse())
        //.data(z.domain())
        .data(data.columns)
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
          .style("font", "10px sans-serif");

      legend.append("rect")
          .attr("x", width - 18)
          .attr("width", 18)
          .attr("height", 18)
          .attr("fill", z);

      legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .attr("text-anchor", "end")
          .text(function(d) { return d; });
  });
};

function exarr(arr,target){
    arr.some(function(v,i){
        //console.log(v["room"])
        if (v["room"]==target){
            arr.splice(i,1);
        }
    })
    //console.log(arr)
    return arr
};
function type(d, i, columns) {
  //console.log(d[columns[0]]);
  var keyword=["Air Heating","Heat Addition"]
  var data={};

  data["room"]=d[columns[0]]
  for (i = 1, t = 0; i < columns.length-1; ++i){
    for (k=0;k<keyword.length;++k){
        if(columns[i].includes(keyword[k])){
            //console.log(columns[i]);
            t += d[columns[i]] = +d[columns[i]];
            data[columns[i]]=d[columns[i]]
        }
    }
    //t += d[columns[i]] = +d[columns[i]];
  } ;
  //console.log(t);
  d.total = t;
  data.total=t;
  //console.log(data);
  //return d;
  return data;
}

