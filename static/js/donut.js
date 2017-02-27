function pieChart(csv){
	var radius = 100,
		padding = 10;
	/*
	var color = d3.scale.linear() // <-A
	    .range(["#ee4035", "#f37736"])
	    .interpolate(d3.interpolateRgb);
	*/
	var color=d3.scale.category20()
	//var color = d3.scale.ordinal()
	//    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

	var arc = d3.svg.arc()
	    .outerRadius(radius)
	    .innerRadius(radius - 30);

	var pie = d3.layout.pie()
	    .sort(null)
	    .value(function(d) { return d.gain; });
	    
	d3.selectAll(".pie").remove();
	
	d3.csv(csv, function(error, data) {
		console.log(error,data);
		if (error) throw error;
		row=d3.keys(data[0]);
		row.shift();
		test=row.filter(function(key) { return key !== "room"; });
		console.log(row);
		//This is method chaining
		color.domain(row.filter(function(key) { return key !== "room"; }));
		
		data=sumTotal(data);
		console.log(data);
		data.forEach(function(d) {
			d.heat = color.domain().map(function(name) {
			return {name: name, gain: +d[name]};
			});
		});
		
		console.log(data[0])
	  var legend = d3.select("body").append("svg")
	      .attr("class", "legend")
	      .attr("width", radius * 2)
	      .attr("height", radius * 2)
	    .selectAll("g")
	      .data(color.domain().slice().reverse())
	    .enter().append("g")
	      .attr("transform", function(d, i) { return "translate(0," + i * 15 + ")"; });

	  legend.append("rect")
	      .attr("width", 12)
	      .attr("height", 12)
	      .style("fill", color);

	  legend.append("text")
	      .attr("x", 20)
	      .attr("y", 5)
	      .attr("dy", ".35em")
	      .text(function(d) { return d; });

	  var svg = d3.select("body").selectAll(".pie")
	      .data(data)
	    .enter().append("svg")
	      .attr("class", "pie")
	      .attr("width", radius * 2)
	      .attr("height", radius * 2)
	    .append("g")
	      .attr("transform", "translate(" + radius + "," + radius + ")");
	  console.log(data)
	  svg.selectAll(".arc")
	      .data(function(d) { return pie(d.heat); })
	    .enter().append("path")
	      .attr("class", "arc")
	      .attr("d", arc)
	      .style("fill", function(d) { return color(d.data.name); });

	  svg.append("text")
	      .attr("dy", ".35em")
	      .style("text-anchor", "middle")
	      .text(function(d) { return d.room; });
	
	svg.append("text")
	      .attr("dy", "2em")
	      .style("text-anchor", "middle")
	      .text(function(d) { return "Total: "+d.total+" GJ"; });
	
	function sumTotal(obj){
		obj.forEach(function(d){
			//var hg = Object.keys(d).map(function(key){return d[key]});
			var hg=d3.values(d);
			//console.log(hg)
			hg.splice(0,1);
			console.log(hg)
			var total=floatFormat(d3.sum(hg),1);
			per=calcPerc(hg,total);
			d["total"] = total;
			//console.log(hg,total,per);
			//console.log(d);
			//var test=d.filter(function(key) { return key !== "room"; });
			
			//console.log(total);
			});
		return obj;
		};
	
	function calcPerc(arr,total){
		arrPerc=[]
		for (var i=0;i<arr.length; ++i){
			perc=Number(arr[i])/total;
			arrPerc.push(perc);
			};
		return arrPerc;
		};
	function floatFormat( number, n ) {
		var _pow = Math.pow( 10 , n ) ;

		return Math.round( number * _pow ) / _pow ;
		};
	});
};

var sourceDir="static/csv/"
pieChart(sourceDir+"KingsRoad/"+"heatgain.csv");
//"Nantou/Design/151221_ReviseWWR/"
//"2ndPA/T1/each_room.csv"