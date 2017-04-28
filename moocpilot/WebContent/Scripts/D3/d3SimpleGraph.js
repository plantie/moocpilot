
var orphanByWeek;

var noOrphanByWeek;

// Set the dimensions of the canvas / graph
var margin = {top: 20, right:20, bottom: 20, left:30},
    width = 230 - margin.left - margin.right,
    height = 110 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ").parse;

// Set the ranges
var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom")
    .tickFormat(function(d, i){
        return i+1;
    });

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function(d, i) { return x(d.date); })
    .y(function(d) { return y(d.quantity); });
    


function displaySimpleGraph(){
    d3.selectAll("#svgSimpleGraph").remove();

    var svg = d3.select("#simpleGraphContainer")
        .append("svg")
            .attr("id", "svgSimpleGraph")
            .attr("viewBox", "0 0 230 110")
            .attr("preserveAspectRatio", "xMinYMin meet")
        .append("g")
            .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");

    orphanByWeek.forEach(function(d) {
        d.date = parseDate(d.date);
        d.quantity = +d.quantity;
    });

    noOrphanByWeek.forEach(function(d) {
        d.date = parseDate(d.date);
        d.quantity = +d.quantity;
    });

    // Scale the range of the data
    x.domain(d3.extent(orphanByWeek, function(d) { return d.date; }));
    //x.domain([0,23]);
    var maxNoOrphan = d3.max(noOrphanByWeek, function(d) { return d.quantity; });
    var maxOrphan = d3.max(orphanByWeek, function(d) { return d.quantity; });
    var max;
    if(maxNoOrphan>maxOrphan){
        max = maxNoOrphan;
    }   else    {
        max = maxOrphan;
    }
    y.domain([0, max]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(orphanByWeek));;

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .classed("noOrphan", true)
        .attr("d", valueline(noOrphanByWeek));

    svg.append("text")
        .text(function(){return "Messages commentés" + "(" + d3.sum(noOrphanByWeek, function(d) { return d.quantity; }) +")";})
        .style("font-size", "10px")
        .attr("x", 65)
        .attr("y", -6);


    svg.append("text")
        .text(function(){return "Messages orphelins" + "(" + d3.sum(orphanByWeek, function(d) { return d.quantity; }) +")";})
        .style("font-size", "10px")
        .attr("x", 65)
        .attr("y", 4);

    svg.append("rect")
        .attr("x", 60)
        .attr("y", -10)
        .attr("width", 5)
        .attr("height", 2)
        .attr("fill", "#4219b1");

    svg.append("rect")
        .attr("x", 60)
        .attr("y", 0)
        .attr("width", 5)
        .attr("height", 2)
        .attr("fill", "red");
    
    //console.log(orphanByWeek.length-1);

    x.domain([0, orphanByWeek.length-1]);

    xAxis.ticks(orphanByWeek.length);
    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    

    document.getElementById("simpleGraphDuplicate").append(document.getElementById("svgSimpleGraph").cloneNode(true));
}

d3.select("#simpleGraphContainer").on("mouseover", function(){
    document.getElementById("simpleGraphDuplicate").style.display = "inherit";
});
d3.select("#simpleGraphContainer").on("mouseout", function(){
    document.getElementById("simpleGraphDuplicate").style.display = "none";
});