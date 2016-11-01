data = [
        {label:"Category 1", value:19},
        {label:"Category 2", value:5},
        {label:"Category 3", value:13},
        {label:"Category 4", value:17},
        {label:"Category 5", value:19},
        {label:"Category 6", value:27}
    ];

    var div = d3.select("body").append("div").attr("class", "toolTip");

function hbarChart(csv){
    var _chart={};

    var _svg;
    var _data=[];

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
        //console.log(data);
        var len=Object.keys(data).length;
        data.forEach(function(d,i){
          if(i<len-5){
            console.log(i);
            _data.push(d);
          }
        });
        return _data
    });
    */

    console.log(_data);
    _chart.render=function(key){
        if (!_svg){
            _svg = d3.select('#hbar').append("svg")
                .attr("width", width)
                .attr("height", height);

            var max = d3.max(_data, function(d) { return d[key]; });
            renderAxes(_svg,max);
        }
        renderBar(key);

    };

    function renderAxes(svg,max){
        scale = d3.scale.linear()
                .domain([0, max])
                .range([0, width - margin*2 - labelWidth]);

        xAxis = d3.svg.axis()
                .scale(scale)
                .tickSize(-height + 2*margin + axisMargin)
                .orient("bottom");
    };

    function renderBar(key){
        ObjArraySort(_data,key,"DESC")

        console.log(_data)
        var axisMargin = 20,
                margin = 10,
                valueMargin = 4,
                width=960,
                height=500,
                barHeight = (height-axisMargin-margin*2)* 0.7/_data.length,
                barPadding = (height-axisMargin-margin*2)*0.3/_data.length,
                data, bar, svg, scale, xAxis, labelWidth = 0;

        //max = d3.max(_data, function(d) { return d.area; });
        /*
        svg = d3.select('#hbar')
                .append("svg")
                .attr("width", width)
                .attr("height", height);
        */
        bar = svg.selectAll("g")
                .data(_data)
                .enter()
                .append("g");

        bar.attr("class", "bar")
                .attr("cx",0)
                .attr("transform", function(d, i) {
                    return "translate(" + margin + "," + (i * (barHeight + barPadding) + barPadding) + ")";
                });

        bar.append("text")
                .attr("class", "label")
                .attr("y", barHeight / 2)
                .attr("dy", ".35em") //vertical align middle
                .text(function(d){
                    return d.room;
                }).each(function() {
            labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
        });

        bar.append("rect")
                .attr("transform", "translate("+labelWidth+", 0)")
                .attr("height", barHeight)
                .attr("width", function(d){
                    return scale(d[key]);
                });

        bar.append("text")
                .attr("class", "value")
                .attr("y", barHeight / 2)
                .attr("dx", -valueMargin + labelWidth) //margin right
                .attr("dy", ".35em") //vertical align middle
                .attr("text-anchor", "end")
                .text(function(d){
                    return (Math.round(d[key])+"m2");
                })
                .attr("x", function(d){
                    var width = this.getBBox().width;
                    return Math.max(width + valueMargin, scale(d.area));
                });

        svg.insert("g",":first-child")
                .attr("class", "axisHorizontal")
                .attr("transform", "translate(" + (margin + labelWidth) + ","+ (height - axisMargin - margin)+")")
                .call(xAxis);
        };
    return _chart;
};

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
    
var chart=hbarChart("static/csv/Nantou/Zone.csv");
chart.render("area");