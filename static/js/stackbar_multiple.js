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

var z = d3.scaleOrdinal()
    .range(["#ff0000","#3366ff","#fdfe02","#fdf498","#adff00","#74d600","#99ccff","#bbeeff","#77aaff","#5588ff","#cb2424","#fe5757","#ffbf00","#ffdc73","#c0c5ce"]);

//var z=d3.scaleOrdinal(d3.schemeCategory20)

var stack = d3.stack();

function get_category(data,key){
    var category=[]
    data.forEach(function(d){
        if(d.Subcategory=="General"){
            d.category=d[""]
            category.push(d[""]);
        }else if(d.Subcategory!="General"){
            d.category=d.Subcategory;
            category.push(d.Subcategory);
        };
        d.electric=+d["Electricity [kWh]"];
        d.version=key;
    })
    return [data,category];
}

function plotGraph(obj){
    console.log(obj);
    var electricity=[];
    for (var key in obj){
        var temp=get_category(obj[key],key)
        var data=temp[0];
        var category=temp[1];
        var arr=fitstruct(category,data);
        electricity.push(arr)
    }
    console.log(electricity);
    x.domain(electricity.map(function(d){return d["version"]}));

    var ylim=d3.max(electricity,function(d){ return d["total"]});
    y.domain([0, ylim]).nice();
    z.domain(category);

    //attach data to varable
    var graph=g.selectAll(".serie")
      .data(stack.keys(category)(electricity))
      .enter();

    console.log(stack.keys(category)(electricity))
    graph.append("g")
      .attr("class", "serie")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
       .data(function(d) { return d; })//ここの文法 need investigate
       .enter().append("rect")
       .attr("x", function(d) { return x(d.data.version)+x.bandwidth()/4; })
       .attr("y", function(d) { return y(d[1]); })
       .attr("height", function(d) { return y(d[0]) - y(d[1]); })
       .attr("width", x.bandwidth()/2)

    graph.selectAll(".bartext")
      .data(function(d) { return d; })
      .enter()
      .append("text")
      .attr("class","bartext")
      .attr("text-anchor","middle")
      .attr("x", function(d) { return x(d.data.version)+x.bandwidth()/2; })
      .attr("y", function(d) { return y((d[0]+d[1])*0.5); })
      .text(function (d) {
        return floatFormat(d[1]-d[0],2);
      })
      .each(function(d){
      var value=floatFormat(d[1]-d[0],3);
      console.log(value);
        if (value==0){
          d.visible=false;
        }else{
          d.visible=true;
        };
      })
      .style('display',function(d){ return d.visible ? null:"none"; });
  　//add xaxis
    g.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x))
        .selectAll("text")
         .style("text-anchor", "center");

      //add yaxis
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
          .text("Electricity consumption[GWh]");

      var legend = g.selectAll(".legend")
        .data(category)
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
};

/*
function tabulate(data,columns){
    var table=d3.select("#table").append("table")
        .attr("style", "margin-left: 250px"),
        thead=table.append("thead"),
        tbody=table.append("tbody");

    console.log(columns);
    thead.append("tr")
        .data(columns)
        .enter()
        .append("th")
        .text(function(column) { return column; });

    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td")
        .attr("style", "font-family: Courier") // sets the font style
            .html(function(d) { return d.value; });

    return table;
};
*/
function fitstruct(list,data){
        var electricity=[];
        var total=0
        for (i=0;i<list.length;i++){
            //electricity.push(category[i],data[i]["electric"])
            electricity[list[i]]=data[i]["electric"]/1000000
            total+=data[i]["electric"]
        }
        electricity["version"]=data[0]["version"];
        electricity["total"]=total/1000000
        return electricity
      };

function floatFormat( number, n ) {
    var _pow = Math.pow( 10 , n ) ;

    return Math.round( number * _pow ) / _pow ;
    };

function loadDataSet(option){
	var files = option["files"];
	var endFn = option["endFn"];
	var loadingStartFn = option["loadingStartFn"];
	var loadingSuccessFn = option["loadingSuccessFn"];

	if (!Array.isArray(files)) throw "TypeError: files is not a array!";
	if (loadingStartFn && typeof loadingStartFn != "function") throw "TypeError: loadingStartFn is not a function!";
	if (loadingSuccessFn && typeof loadingSuccessFn != "function") throw "TypeError: loadingSuccessFn is not a function!";
	if (typeof endFn != "function") throw "TypeError: endFn is not a function!";

	var dataStack = {}; //読み込んだデータを保存するスタック
	var fnStack = []; //データ読み込みに必要なajax関数を保存するスタック

    //非同期通信処理をチェインを使って順次実行する。各ファンクションにコールバックを仕込む
	var chain = function(functions) {
		return functions.reduceRight(function (next, curr) {
			return function () {
				curr.apply({next: next}, arguments);
			}
		});
	}

    //ファイルの数だけ非同期処理fanctionをスタックに積む
	files.forEach(function(arg){
		if (loadingStartFn) loadingStartFn(arg);
		fnStack.push(
			function() {
				var that = this;

				var exte = arg.file.split("?")[0].split(".")[arg.file.split(".").length-1];

				if (arg.filetype) exte = arg.filetype;
				var readfile;
				switch(exte){
					case "json": case "geojson": case "topojson":
						readfile = d3.json;
					break;
					case "csv":
						readfile = d3.csv;
					break;
					case "tsv":
						readfile = d3.tsv;
					break;
					default:
						throw "TypeError: " + exte + " is not supported";
					break;
				}

				return readfile(arg.file,  function(data){
					if (arg.callbackData) arg.callbackData = data;
					if (loadingSuccessFn) loadingSuccessFn(arg);
					dataStack[arg.key] = data;
					that.next();
				});
			}
		)
	});

    //スタックの最後にendFnを追加する
	fnStack.push(function(){
		endFn(dataStack);
	});

    //チェイン処理実行
	chain(fnStack)();

}