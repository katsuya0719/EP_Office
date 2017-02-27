var margin = {top: 20, right: 40, bottom: 100, left: 60},
	width = 1200 - margin.left - margin.right,
	height = 600 - margin.top - margin.bottom;

var x = d3.scaleLinear() 
	    .range([0,width]),
	y = d3.scaleLinear() 
	    .range([height,0]);
/*
var color = d3.schemeCategory20,
	color2 = d3.schemeCategory10;
*/
/*
var color=d3.scaleOrdinal()
		.range(["brown", "steelblue"]);
*/
var color = d3.scaleOrdinal(d3.schemeCategory20);
			
	//console.log(color.range())
/*
var xAxis = d3.svg.axis()
	        .scale(x)
	        .orient("bottom");      
	                
var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");
*/
/*
var brush = d3.svg.brush()
            .x(x)
            .on("brush", brushed);
*/

var svg = d3.select("#glass-scatter").append("svg")
			.attr("width", width + margin.left + margin.right)
    		.attr("height", height + margin.top + margin.bottom)
    	　.append("g")
   			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg1 = d3.select("#histogram").append("svg")
			.attr("width", width + margin.left + margin.right)
    		.attr("height", height + margin.top + margin.bottom)
    	　.append("g")
   			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/*
   	svg.append("defs").append("clipPath")
	    .attr("id", "clip")
	  .append("rect")
	    .attr("width", width)
	    .attr("height", height);
*/
function createHist(array){
	//var data = d3.range(1000).map(d3.randomBates(10));
	var x = d3.scaleLinear()
    		.rangeRound([0, width])
    		.domain([d3.min(array),d3.max(array)]);

    var bins = d3.histogram()
	    //.domain(x.domain())
	    .domain(x.domain())
	    .thresholds(x.ticks(20))
	    (array);
	
	var y = d3.scaleLinear()
	    .domain([0, d3.max(bins, function(d) { return d.length; })])
	    .range([height, 0]);

	var svg = d3.select("#histogram").append("svg")
			.attr("width", width + margin.left + margin.right)
    		.attr("height", height + margin.top + margin.bottom)
    	　.append("g")
   			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

   	var bar = svg.selectAll(".bar")
	    .data(bins)
	  .enter().append("g")
	    .attr("class", "bar")
	    .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

	bar.append("rect")
	    .attr("x", 1)
	    .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
	    .attr("height", function(d) { return height - y(d.length); });

	bar.append("text")
	    .attr("dy", "-1em")
	    .attr("y", 6)
	    .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
	    .attr("text-anchor", "middle")
	    .text(function(d) { return d.length; });

	svg.append("g")
	    .attr("class", "axis axis--x")
	    .attr("transform", "translate(0," + height + ")")
	    .call(d3.axisBottom(x));

};

function createGraph(csv){
	
	d3.csv(csv, function (data) {
		data.forEach(function(d) {
			d.tsol = floatFormat(+d.Tsol,2);
			d.tvis = floatFormat(+d.Tvis,2);
			d.tvisual = floatFormat(+d.Tvis,1);
			d.cond=floatFormat(+d.Conductivity,1);
			d.thickness = floatFormat(+d.Thickness,1);
			d.thick = Math.round(+d.Thickness);
			//console.dir(d.thick)
		});
		var arrThick=[]
		data.forEach(function(d){
			arrThick.push(d.thick);
		})

		//filter out glass whose thickness is larger than 20mm
		var data = data.filter(function(item){
				if (item.thick<=20){
					return true;
					}
				});

		console.log(data);
	/*
	function filterRaw(data){
		var new = data.filter(function(item, index){
			if (item.thick<=20){
				return true;
			};
		})
		return new
	};
	*/
		createHist(arrThick);
		console.dir(data)
	/*
	var data = d3.csvParse(csv, function(d) {
	  return {
	    tsol: floatFormat(+d.Tsol,2), 
	    tvis: floatFormat(+d.Tvis,2), 
	    cond: floatFormat(+d.Conductivity,1), 
	    thickness: floatFormat(+d.Thickness,1),
	    thick: Math.round(+d.Thickness)
	  };
	*/

		x.domain([0,1]);
		y.domain([0,1]);

		svg.append("g")
			.attr("class","x axis")
			.attr("transform", "translate(0," +height+ ")")
			.call(d3.axisBottom(x))
			.append("text")
			.attr("class", "label")
			.attr("x", width)
			.attr("y",-6)
			.style("text-anchor","end")
			.text("Solar Transmittance");

		svg.append("g")
			.attr("class","y axis")
			.call(d3.axisLeft(y))
			.append("text")
			.attr("class", "label")
			.attr("transform","rotate(-90)")
			.attr("y",20)
			.attr("dy", ".71em")
			.style("text-anchor","end")
			.text("Visual Light Transmittance");

		var div=d3.select("body").append("div")
			      	.attr("class", "tooltip")
			       	.style("opacity", 0)

		points = svg.selectAll(".point")
		    .data(data)
		  .enter().append("circle")
		    .attr("class", "point")
		    .attr("r", 3)
		    .attr("cx", function(d) { return x(d.tsol); })
		    .attr("cy", function(d) { return y(d.tvis); })
		    .style("fill", function(d){return color(d.thick); })
		    .on("mouseover",function(d){
			        div.transition()
			      		.duration(200)
			       		.style("opacity", .9);
			       	div.html(d.ProductName + "<br/>Thickness:" + d.thickness + "[mm]" + "<br/>VLT:" + d.tvis + "<br/>g:"　+d.tsol )
			       		.style("left", (d3.event.pageX) + "px")
			        	.style("top", (d3.event.pageY) + "px");
			   	})
		   	.on("mouseout", function(d){
			   		div.transition()
			   			.duration(500)
			   			.style("opacity", 0);
			   	});


		color.domain(sort(color.domain()))
		console.log(color.domain())

		var legend = svg.selectAll(".legend")
			        .data(color.domain())
			       	.enter().append("g")
			       	.attr("class","legend")
			       	.attr("transform", function(d,i){ return "translate(0," +i*20+ ")"; });

			legend.append("rect")
			        .attr("x", width - 18)
			      	.attr("width", 18)
			        .attr("height", 18)
			      	.style("fill", color);

			legend.append("text")
			        .attr("x", width-24)
			      	.attr("y", 9)
			       	.attr("dy", ".35em")
			       	.style("text-anchor","end")
			       	.text(function(d){ return d; });
	});
};



function sort(array){
	array.sort(function(a,b){
        return a - b;
	});
	return array
};

function CheckSmaller(value,threshold){
	if(value<=threshold){
		return True
	}else{
		return Faluse
	};
};

//createGraph("static/csv/glass.csv")

function thickness(){
	
	d3.csv("static/csv/glass.csv", function (data) {
		data.forEach(function(d) {
		d.tsol = floatFormat(+d.Tsol,2);
		d.tvis = floatFormat(+d.Tvis,2);
		d.tvisual = floatFormat(+d.Tvis,1)*10;
		d.thickness = floatFormat(+d.Thickness,1);
		d.thick = Math.round(+d.Thickness);
	});
	
	y.domain([0, d3.max(data, function(d) { return d.thick; })]);

	var svg = d3.select("#glass-scatter").transition();

	svg.selectAll(".point")
		.duration(750)
		.attr("cx", function(d) { return x(d.tsol); })
	    .attr("cy", function(d) { return y(d.thick); })
	    .attr("r", 3)
	    .style("fill", function(d){return color2(d.tvisual); });

	svg.select(".y.axis")
		.duration(750)
		.call(yAxis);

	legend=svg.selectAll(".legend")
		.data(color2.domain())
		.enter().append("g")
	   	.attr("transform", function(d,i){ return "translate(0," +i*20+ ")"; });

	legend.append("rect")
		.attr("x", width - 18)
      	.attr("width", 18)
        .attr("height", 18)
      	.style("fill", color2);

	legend.append("text")
		.attr("x", width-24)
	   	.attr("y", 9)
       	.attr("dy", ".35em")
       	.style("text-anchor","end")
       	.text(function(d){ return d; });
	});
}

function conductivity(){
	
	d3.csv("static/csv/glass.csv", function (data) {
		data.forEach(function(d) {
		d.tsol = floatFormat(+d.Tsol,2);
		d.tvis = floatFormat(+d.Tvis,2);
		d.cond=floatFormat(+d.Conductivity,1);
		d.tvisual = floatFormat(+d.Tvis,1)*10;
		d.thickness = floatFormat(+d.Thickness,1);
		d.thick = Math.round(+d.Thickness);
	});
	
	y.domain([0, d3.max(data, function(d) { return d.cond; })]);

	var svg = d3.select("#glass-scatter").transition();

	svg.selectAll(".point")
		.duration(750)
		.attr("cx", function(d) { return x(d.tsol); })
	    .attr("cy", function(d) { return y(d.cond); })
	    .attr("r", 3)
	    .style("fill", function(d){return color(d.thick); });

	svg.select(".y.axis")
		.duration(750)
		.call(yAxis);

	legend=svg.selectAll(".legend")
		.data(color2.domain())
		.enter().append("g")
	   	.attr("transform", function(d,i){ return "translate(0," +i*20+ ")"; });

	legend.append("rect")
		.attr("x", width - 18)
      	.attr("width", 18)
        .attr("height", 18)
      	.style("fill", color2);

	legend.append("text")
		.attr("x", width-24)
	   	.attr("y", 9)
       	.attr("dy", ".35em")
       	.style("text-anchor","end")
       	.text(function(d){ return d; });
	});
}

function brushed() {
  x.domain(brush.empty() ? x.domain() : brush.extent());
  console.log(x.domain())
  svg.select(".point").attr("cx", function(d) { return x(d.tsol); });
  svg.select(".x.axis").call(xAxis);
}

function floatFormat( number, n ) {
	var _pow = Math.pow( 10 , n ) ;
	return Math.round( number * _pow ) / _pow ;
}
