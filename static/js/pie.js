function pieChart() {
        var _chart = {};

        var _width = 600, _height = 450,
                _data = [],
                _colors = d3.scale.category20(),
                _svg,
                _bodyG,
                _pieG,
                _radius = 200,
                _innerRadius = 100;

        var _div=d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);

        _chart.render = function (id,room,total,category) {
            if (!_svg) {
                _svg = d3.select(id).append("svg")
                        .attr("height", _height)
                        .attr("width", _width);
		
		_svg.append("text")
		      .attr("dy", _height/2-40)
		    .attr("dx", _width/2-100)
		      .style("text-anchor", "middle")
		      .text( "Total Consumption");
		
		_svg.append("text")
		      .attr("dy", _height/2-15)
		    .attr("dx", _width/2-100)
		      .style("text-anchor", "middle")
		      .text( total+"MWh");
            }
	    
	    _colors.domain(category);
            renderBody(_svg);
        };

        function renderBody(svg) {
            if (!_bodyG)
                _bodyG = svg.append("g")
                        .attr("class", "body");

            renderPie();
        }

        function renderPie() {
            var pie = d3.layout.pie() // <-A
                    .value(function (d) {
                        return d.electricity;
                    });

            var arc = d3.svg.arc()
                    .outerRadius(_radius)
                    .innerRadius(_innerRadius);

            if (!_pieG)
                _pieG = _bodyG.append("g")
                        .attr("class", "pie")
                        .attr("transform", "translate(" 
                            + _radius 
                            + "," 
                            + _radius + ")");

            renderSlices(pie, arc);

            renderLabels(pie, arc);

            renderLegend(_svg);
        }

        function renderSlices(pie, arc) {
            var slices = _pieG.selectAll("path.arc")
                    .data(pie(_data)); // <-B

            slices.enter()
                    .append("path")
                    .attr("class", "arc")
                    .attr("fill", function (d, i) {
			    console.log(d);
                        return _colors(d.data.category);
                    });

            slices.transition()
                    .attrTween("d", function (d) {
                        var currentArc = this.__current__; // <-C

                        if (!currentArc)
                            currentArc = {startAngle: 0, 
                                            endAngle: 0};

                        var interpolate = d3.interpolate(
                                            currentArc, d);
                                            
                        this.__current__ = interpolate(1);//<-D
                        
                        return function (t) {
                            return arc(interpolate(t));
                        };
                    });
        }

        function renderLabels(pie, arc) {
            var labels = _pieG.selectAll("text.label")
                    .data(pie(_data)); // <-E

            labels.enter()
                    .append("text")
                    .attr("class", "label");

            labels.transition()
                    .attr("transform", function (d) {
                        return "translate(" 
                            + arc.centroid(d) + ")"; // <-F
                    })
                    .attr("dy", ".35em")
                    .attr("text-anchor", "middle")
                    .text(function (d) {
                        return Math.round(d.data.electricity/1000)+"kWh";
                    });
		    
        }

        function renderLegend(svg){
            var legend = svg.selectAll(".legend")
                    .data(_colors.domain())
                    .enter().append("g")
                    .attr("class","legend")
                    .attr("transform", function(d,i){ return "translate(0," +i*20+ ")"; });

            legend.append("rect")
                    .attr("x", _width - 180)
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", _colors);

            legend.append("text")
                    .attr("x", _width-150)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .style("text-anchor","top")
                    .text(function(d){ return d; });
        }
        _chart.width = function (w) {
            if (!arguments.length) return _width;
            _width = w;
            return _chart;
        };

        _chart.height = function (h) {
            if (!arguments.length) return _height;
            _height = h;
            return _chart;
        };

        _chart.colors = function (c) {
            if (!arguments.length) return _colors;
            _colors = c;
            return _chart;
        };

        _chart.radius = function (r) {
            if (!arguments.length) return _radius;
            _radius = r;
            return _chart;
        };

        _chart.innerRadius = function (r) {
            if (!arguments.length) return _innerRadius;
            _innerRadius = r;
            return _chart;
        };

        _chart.data = function (d) {
            if (!arguments.length) return _data;
            _data = d;
            return _chart;
        };

        return _chart;
    }

    function randomData() {
        return Math.random() * 9 + 1;
    }

    function update() {
        for (var j = 0; j < data.length; ++j)
            data[j].value = randomData();

        chart.render();
    }
    /*
    var numberOfDataPoint = 6,
            data = [];
    
    data = d3.range(numberOfDataPoint).map(function (i) {
        return {id: i, value: randomData()};
    });
    var chart = pieChart()
            .radius(200)
            .innerRadius(100)
            .data(data);
    chart.render("#pie");
    */
    function ObjArraySort(ary, key, order) {
        var reverse = 1;
        if(order && order.toLowerCase() == "desc") 
            reverse = -1;
        ary.sort(function(a, b) {
            if(a[key] < b[key])
                return -1 * reverse;
            else if(a[key] == b[key])
                return 0;
            else
                return 1 * reverse;
        });
    }
    
    function readcsv(csv){
	    var arrele=[]
	    var arrCate=[];
	   d3.csv(csv,function(data){
		//console.log(data);
		data.forEach(function(d){
		    if(d.Subcategory=="General"){
			d.category = d[""]
		    }else if(d.Subcategory!="General"){
			d.category = d.Subcategory;
		    };
		    //arrCate.push(d.category);
		    /*
		  if (d[""]==" "){
		    d.category = d.Subcategory;
		  }else if(d[""]!=" "){
		    d.category = d[""];
		  };
		  */
		  d.electricity= +d["Electricity [kWh]"];
		  arrele.push(d.electricity);
		});
		/*
		var data = data.filter(function(item){
			if (item.electricity>0){
			    return true;
			    }
			});
		*/
		ObjArraySort(data,"electricity","DESC")
		
		data.forEach(function(d){
			arrCate.push(d.category);
		});
		
		var total=floatFormat(d3.sum(arrele)/1000,1);
		
		var chart = pieChart()
		    .radius(200)
		    .innerRadius(100)
		    .data(data);
		
		var room=csv.split("/")[2]
		chart.render("#pie",room,total,arrCate);
	    })
	};
	
	function floatFormat( number, n ) {
		var _pow = Math.pow( 10 , n ) ;

		return Math.round( number * _pow ) / _pow ;
		};
		
//readcsv("static/csv/Nantou/Design/151221_ReviseWWR/energy.csv");