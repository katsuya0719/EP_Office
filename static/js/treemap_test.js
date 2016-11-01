// Dimensions of sunburst.
var margin = {top: 40, right: 10, bottom: 10, left: 10},
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Mapping of step names to colors.
var color = d3.scale.category10();

// Total size of all segments; we set this later, after loading the data.
var totalSize = 0; 

var div = d3.select("body").append("div")
    .style("position", "relative")
    .style("width", (width + margin.left + margin.right) + "px")
    .style("height", (height + margin.top + margin.bottom) + "px")
    .style("left", margin.left + "px")
    .style("top", margin.top + "px");

var treemap = d3.layout.treemap()
    .size([width, height])
    .sticky(true)
    .value(function(d) { return d.size; });

// Use d3.text and d3.csv.parseRows so that we do not need to have a header
// row, and can receive the csv as an array of arrays.
d3.text("static/csv/each_room1.csv", function(text) {
  var csv = d3.csv.parseRows(text);
  //console.log(csv)
  var col = 19
  var json = buildHierarchy(csv,col);
  var json1 = buildHierarchy(csv,13);
  var json2 = buildHierarchy(csv,19);
  console.log(json)
  console.log(json1)
  console.log(json2)

  createVisualization(json,div);
  
  var node = div.datum(json).selectAll(".node")
      .data(treemap.nodes)
    .enter().append("div")
      .attr("class", "node")
      .call(position)
      .style("background", function(d) { return d.children ? color(d.name) : null; })
      .text(function(d) { return d.children ? null : d.name+" : "+d.value　; });
  
  d3.selectAll("input").on("change", function change() {
    /*
    var value = this.value === "count"
        ? function() { return 1; }
        : function(d) { return d.size; };
    */
    if (this.value==="area"){
      col=1
    }else if (this.value==="load"){
      col=13
    }else if (this.value==="gain"){
      col=19
    }
    json=buildHierarchy(csv,col);
    console.log(json)
    //createVisualization(json,div,col)
    
    node
        .datum(json)
      .transition()
        .duration(1500)
        .call(position);
    
  });
});


// Main function to draw and set up the visualization, once we have the data.
function createVisualization(json,vis) {

  var node = vis.datum(json).selectAll(".node")
      .data(treemap.nodes)
    .enter().append("div")
      .attr("class", "node")
      .call(position)
      .style("background", function(d) { return d.children ? color(d.name) : null; })
      .text(function(d) { return d.children ? null : d.name+" : "+d.value　; });

 };

function position() {
  this.style("left", function(d) { return d.x + "px"; })
      .style("top", function(d) { return d.y + "px"; })
      .style("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .style("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}
// Given a node in a partition layout, return an array of all of its ancestor
// nodes, highest first, but excluding the root.
function getAncestors(node) {
  var path = [];
  var current = node;
  while (current.parent) {
    path.unshift(current);
    current = current.parent;
  }
  return path;
}

// Take a 2-column CSV and transform it into a hierarchical structure suitable
// for a partition layout. The first column is a sequence of step names, from
// root to leaf, separated by hyphens. The second column is a count of how 
// often that sequence occurred.
function buildHierarchy(csv,col) {
  if (col==1){
    var root = {"name": "area", "children": []};
  }else if (col==13){
    var root = {"name": "load", "children": []};
  }else if (col==19){
    var root = {"name": "gain", "children": []};
  };
  //var root = {"name": "root", "children": []};
  for (var i = 0; i < csv.length; i++) {
    var sequence = csv[i][0].slice(0,-17);
    var size = +csv[i][col];
    if (size<0){
      size = -size
    }
    //console.log(sequence,size)
    if (isNaN(size)) { // e.g. if this is a header row
      continue;
    }
    var parts = sequence.split("_");
    var currentNode = root;
    //console.log(currentNode)
    for (var j = 0; j < parts.length; j++) {
      var children = currentNode["children"];
      var nodeName = parts[j];
      var childNode;
      if (j + 1 < parts.length) {
   // Not yet at the end of the sequence; move down the tree.
 	var foundChild = false;
 	for (var k = 0; k < children.length; k++) {
 	  if (children[k]["name"] == nodeName) {
 	    childNode = children[k];
 	    foundChild = true;
 	    break;
 	  }
 	}
  // If we don't already have a child node for this branch, create it.
 	if (!foundChild) {
 	  childNode = {"name": nodeName, "children": []};
 	  children.push(childNode);
 	}
 	currentNode = childNode;
      } else {
 	// Reached the end of the sequence; create a leaf node.
 	childNode = {"name": nodeName, "size": size};
 	children.push(childNode);
      }
    }
  }
  return root;
};