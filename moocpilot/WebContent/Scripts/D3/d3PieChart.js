function studentPie(data, names){
	console.log(data);
	var width = 32,
	    height = 32,
	    radius = Math.min(width, height)/1.25;
	var color = d3.scale.ordinal()
	    .range(["#0000FF", "#FF8005", "#ffffff"]);

	var arc = d3.svg.arc()
	    .outerRadius(radius - 10)
	    .innerRadius(0);

	var labelArc = d3.svg.arc()
	    .outerRadius(radius - 40)
	    .innerRadius(radius - 40);

	var pie = d3.layout.pie()
	    .sort(null)
	    .value(function(d) { return d; });

    d3.select("#studentPie")
    .remove();
	
	var svg = d3.select("#studentInfo #pieContainer").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	    .attr("id", "studentPie")
	  .append("g")
	    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
	
    d3.select("#tipChart")
    .remove();
	
    tipPieChart = d3.tip()
	  .attr('class', 'd3-tip')
	  .attr('id', 'tipChart')
	  .offset([-10, 0])
	  .html(function (d, i, j) {	
		  //return "<span style='color:#ffffff'>"+names[2]+ "/" + names[3] +"exercices sans note</span></br><span style = 'color:#FF8005'>"+names[1]+ "/" + names[3] +" exercices avec une note <= 0.5</span></br><span style = 'color:#6e6eff'>"+names[0]+ "/" + names[3] +" exercices avec une note > 0.5</span>";
		  return "<span style='color:#ffffff'>"+names[2]+ "/" + names[3] +translations['#noteNA'][localStorage.lang]+"</span></br><span style = 'color:#FF8005'>"+names[1]+ "/" + names[3] +" exercices avec une note <= 0.5</span></br><span style = 'color:#6e6eff'>"+names[0]+ "/" + names[3] +" exercices avec une note > 0.5</span>";
	  });
	  
	svg.call(tipPieChart);
	
	svg.on('mouseover', tipPieChart.show)
		.on('mouseout', tipPieChart.hide)
	
	var g = svg.selectAll(".arc")
	      .data(pie(data))
	    .enter().append("g")
	      .attr("class", "arc");

	g.append("path")
	      .attr("d", arc)
	      .style("stroke", "black")
	      .style("fill", function(d,i) { return color(i); });
}

function gradePie(cible, data, names, moy){
	parent = cible.parentElement
	var width = 32,
	    height = 32,
	    radius = Math.min(width, height)/1.25;
	var color = d3.scale.ordinal()
	    //.range(["#0000FF", "#FF8005"]);
	    .range(["#0c2340", "#FF8005"]); // EG IMT bleu foncé -  Learner's results, timestamped

	var arc = d3.svg.arc()
	    .outerRadius(radius - 10)
	    .innerRadius(0);

	var labelArc = d3.svg.arc()
	    .outerRadius(radius - 40)
	    .innerRadius(radius - 40);

	var pie = d3.layout.pie()
	    .sort(null)
	    .value(function(d) { return d; });

    
	var svg = d3.select(parent)
	  .append("g")
	  	.classed("bullePie", true)
	    .attr("transform", "translate(" + cible.cx.baseVal.valueAsString + "," + cible.cy.baseVal.valueAsString + ") rotate(180)");
	
	/*
    d3.select("#tipChart")
    .remove();*/
	
    /*
    tipPieChart = d3.tip()
	  .attr('class', 'd3-tip')
	  .attr('id', 'tipChart')
	  .offset([-10, 0])
	  .html(function (d, i, j) {	
		  return "<span style = 'color:#FF8005'>"+names[1]+ "/" + names[2] +" apprenants avec une note <= 0.5</span></br><span style = 'color:#6e6eff'>"+names[0]+ "/" + names[2] +" apprenants avec une note > 0.5</span>";
	  });
	  
	svg.call(tipPieChart);

	svg.on('mouseover', tipPieChart.show)
		.on('mouseout', tipPieChart.hide)*/
    listTextPie.push("<span style = 'color:#FF8005'>"+names[1]+ "/" + names[2] +" "+translations['#noteInf'][localStorage.lang]+"</span>" // apprenants avec une note <= 0.5
	+"</br><span style = 'color:#6e6eff'>"+names[0]+ "/" + names[2] +" "+translations['#noteInf'][localStorage.lang]+" </span>" // apprenants avec une note > 0.5
	+"</br><span> "+translations['#noteAvg'][localStorage.lang]+" : "+moy+"</span>"); // Note moyenne
	
	var g = svg.selectAll(".arc")
	      .data(pie(data))
	    .enter().append("g")
	      .attr("class", "arc");

	g.append("path")
	      .attr("d", arc)
	      .style("stroke", "black")
	      .style("fill", function(d,i) { return color(i); });
}

function displayPieTip(){
    tipPieChart = d3.tip()
	  .attr('class', 'd3-tip')
	  .attr('id', 'tipChart')
	  .offset([-45, 0])
	  .html(function (d, i, j) {
		  return listTextPie[i];
		  //return "<span style = 'color:#FF8005'>"+names[1]+ "/" + names[2] +" apprenants avec une note <= 0.5</span></br><span style = 'color:#6e6eff'>"+names[0]+ "/" + names[2] +" apprenants avec une note > 0.5</span>";
	  });
    
    d3.selectAll(".bullePie")
    .on('mouseover', tipPieChart.show)
	.on('mouseout', tipPieChart.hide);
	  
	svg.call(tipPieChart);
}

var listTextPie = new Array();

function removePie(){	    
	//d3.selectAll(".circlePair,.circleImpair,.circleCohorte").attr("r", 5).style("fill", "");
    d3.selectAll(".circleText").style("fill", "");
	d3.selectAll(".bullePie").remove();
	listTextPie = new Array();
}
