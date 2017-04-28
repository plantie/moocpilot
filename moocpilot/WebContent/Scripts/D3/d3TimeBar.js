








var fontSize = 14;
var graphSize;
var timeValues;
var daysGap;
var daysSize;
var displayedOrder;

function setUpGraphUtilData() {
    getTimeValue();
    getDaysGap();
    getGraphSize();
    getDaysSize();
    //getDisplayedOrder();
}

function getTimeValue() {
    timeValues = new Array();
    for (var i = 0; i < csvList[0].weekList.length; i++) {
        timeValues.push(csvList[0].weekList[i].name.substring(csvList[0].weekList[i].name.length - 9, csvList[0].weekList[i].name.length - 19));
    }
    timeValues.sort();
}


function getDaysGap() {
    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    var firstDate = new Date(timeValues[0]);
    var secondDate = new Date(timeValues[timeValues.length-1]);

    daysGap = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
}

function getDaysGapFromStart(index){
    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    var firstDate = new Date(timeValues[0]);
    var secondDate = new Date(timeValues[index]);

    return (Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay))));
}


function getGraphSize() {
    graphSize = (timeValues.length) * 36;
}


function getDaysSize() {
    daysSize = (graphSize - fontSize - 35) / daysGap;
    /*
    if(daysSize < 12){
    	daysSize = 12;
    	graphSize = 12 * daysGap;
    }*/
}

function getDisplayedOrder() {
    displayedOrder = new Array();
    var j;
    for (var i = 0; i < timeValues.length; i++) {
        j = 0;
        while (i == displayedOrder.length) {
            if (csvList[0].weekList[j].name.indexOf(timeValues[i]) != -1) {
                displayedOrder.push(csvList[0].weekList[j].pos);
            } else {
                j++;
            }
        }
    }
}


function isAuto(index){
	return new Date(timeValues[index]).getDay() == weekDay;
}

function displayTimeBar() {
    if(csvList[0].weekList.length == 0){
    	setTimeout(displayTimeBar, 500);
    	return;
    }

    setUpGraphUtilData();
    
    
    d3.select("#timeBar")
    .remove();

    var svg = d3.select("#svgContainer").append("svg")
    .attr("id", "timeBar")
    .attr("width", 235)
    .attr("height", graphSize);

    var VLine = svg.append("line")
                .attr("x1", 90)
                .attr("y1", 0)
                .attr("x2", 90)
                .attr("y2", graphSize)
                .style("stroke", "blue")
                .style("stroke-width", 3);

    var arrowLeft = svg.append("line")
                .attr("x1", 75)
                .attr("y1", graphSize-15)
                .attr("x2", 90)
                .attr("y2", graphSize-1)
                .style("stroke", "blue")
                .style("stroke-width", 3);

    var arrowRight = svg.append("line")
                .attr("x1", 105)
                .attr("y1", graphSize-15)
                .attr("x2", 90)
                .attr("y2", graphSize-1)
                .style("stroke", "blue")
                .style("stroke-width", 3);

    timeElements = svg.selectAll('.time')
    .data(timeValues)
    .enter().append('text')
     .attr("class", "timeElementsText")
     .text(function (d) { return d; })
     .attr("x", 0)
     .attr("y", function (d, i, j) {
         return getDaysGapFromStart(i) * daysSize + fontSize;
     })
     .style("fill", function(d,i,j){if(isAuto(i)){return "green"}else{return "black";}})
     .on('mouseover', function (d, i) { timeElementsHover(i); })
     .on('mouseout', function (d, i) { timeElementsHover(-2); });

    timeElementsTrait = svg.selectAll('.time')
                .data(timeValues)
                .enter().append('line')
                .attr("x1", 80)
                .attr("y1", function (d, i, j) {
                    return getDaysGapFromStart(i) * daysSize + fontSize - 5;
                })
                .attr("x2", 90)
                .attr("y2", function (d, i, j) {
                    return getDaysGapFromStart(i) * daysSize + fontSize - 5;
                })
                .style("stroke", "black")
                .style("stroke-width", 2);

    tableLines = d3.selectAll("#csvTable tr").on('mouseover', function (d, i) { if (i > 0) { timeElementsHover(i - 1); } })
                 .on('mouseout', function (d, i) { timeElementsHover(-2); });

    timeElementsLink = svg.selectAll('.time')
                .data(timeValues)
                .enter().append('line')
                .attr("x1", 90)
                .attr("y1", function (d, i, j) {
                    return getDaysGapFromStart(i) * daysSize + fontSize - 5;
                })
                .attr("x2", 235)
                .attr("y2", function (d, i, j) {
                    return tableLines[0][i+1].offsetTop - 24;
                })
                .style("stroke", function(d,i,j){if(isAuto(i)){return "green"}else{return "black";}})
                .style("stroke-width", 1)
                 .on('mouseover', function (d, i) { timeElementsHover(i); })
                 .on('mouseout', function (d, i) { timeElementsHover(-2); });

    tableTd = d3.selectAll("#csvTable td");


}


function timeElementsHover(index) {
    timeElements.style("font-weight", function (d, i, j) { if (index == i) { return "bold"; } else { return ""; } });

    timeElementsTrait.style("stroke-width", function (d, i, j) { if (index == i) { return 3; } else { return 2; } });

    tableLines.style("border", function (d, i, j) { if (index + 1 == i) { return "2px solid"; } else { return ""; } })
                .style("font-weight", function (d, i, j) { if (index + 1 == i) { return "bold"; } else { return ""; } });
    
    tableTd.style("padding", function(d,i,j){if(i >= (index+1)*5 && i<(index+2)*5){ return "4px 0px 4px 0px";} else {return "";}});

    timeElementsLink.style("stroke-width", function (d, i, j) { if (index == i) { return 3; } else { return 1; } });
}

