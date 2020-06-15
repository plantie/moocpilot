function useJSON(){
		if(!dataReceived){
			setTimeout(function(){useJSON();}, 250);
			return;
		}
		/*
	    layers0 = numberOfStudentByExerciseSeparateByWeek();
	    domainX0 = ["HW 01", "HW 02", "HW 03", "HW 04", "HW 05", "Lab 01", "Lab 02"];*/
	    generateTable();
	    detectWeek();
	    updateCohorteNames();
	    resetStudent();
	}
	
	var radioButtons = document.querySelectorAll("#parameters input[type='radio']");
	var groupeName = " "+translations['eleves'][localStorage.lang]; //" élèves";

    var domainEcart  = ["0➞0.25", "0.25➞0.50", "0.50➞0.75", "0.75➞1"];

	
/*
    var title0 = imgName[4][localStorage.lang]; //"Nombre d'élèves par exercice selon leur période d'inscription";
    var title1 = imgName[0][localStorage.lang]; //"Nombre d'élèves par collecte";
    var title2 = "Nombre d'élèves ayant fait un exercice par résultat";
    var title3 = "Nombre d'élèves par exercice selon leurs résultats";    
    var title4 = imgName[7][localStorage.lang]; //"Progression Générale";
*/	
    var infoDiag = [
	{no: 4, legendColumn:2}, // 0
	{no: 0, legendColumn:1}, // 1
	{no: 5, legendColumn:2}, // 2
	{no: 6, legendColumn:2}, // 3
	{no: 7, legendColumn:2}, // 4
	];

	var needLegendOver = false;
    var legendColumn = 2;
    var forcedColor;
    var typeDiag;
    function callDisplayDiagramme() {

        document.getElementById("waitingPanel").style.display = "inherit";
    	setTimeout(function(){
	    	if(screenSelectorMode == false){
	    		return;
	    	}
	    	setExerciceNumber();
	    	changeSize();
	    	var layers;
	    	var domain;
	    	var legendData;
	    	var title;
	    	cibledStudent = new Array();
	    	var needOrder = false;
	    	needLegendOver = false;
	    	document.getElementById("tableau").style.display = "none";
	    	forcedColor = false;
	    	typeDiag = parseInt(document.getElementById("visualisationMode").value);
console.log("callDisplayDiagramme, typeDiag:"+typeDiag);
		
		// EG: 
		title = imgName[infoDiag[typeDiag].no][localStorage.lang];
		legendColumn = infoDiag[typeDiag].legendColumn;
		
	        switch (typeDiag) {
	        //switch (parseInt(document.getElementById("visualisationMode").value)) {
	            case 0:
	            	layers = numberOfStudentByExerciseSeparateByWeek(document.getElementById("cohorteSelect").value);
	            	domain = getCourseNames();
	            	//legendColumn = 2;
	            	legendData = legendFormate(getSheetNames());
	            	//title = title0;
	            	hideExerciseSelector();
	            	document.getElementById("moreOf").disabled = false;
	            	document.getElementById("moreOf").parentElement.firstElementChild.style.color = "";
	            	//exerciceNumberMakeVisible(false);
	            	needOrder = true;
	            	needLegendOver = true;
	                break;
	            case 1:
	            	layers = numberOfSignedStudentByWeekAdvanced(document.getElementById("cohorteSelect").value);
	            	newActualiseTableau(layers);
	            	document.getElementById("tableau").style.display = "inherit";
	            	domain = getSheetNames();
	            	//legendColumn = 1;
	            	//~ legendData = legendFormate(["Participants", "Non participants"]);
	            	legendData = legendFormate([translations['participant'][localStorage.lang], translations['notparticipant'][localStorage.lang]]);
	            	//title = title1;
	            	hideExerciseSelector();
	            	document.getElementById("moreOf").disabled = true;
	            	document.getElementById("moreOf").parentElement.firstElementChild.style.color = "dimgray";
	            	//exerciceNumberMakeVisible(false);
	                break;
	            case 2:
	            	layers = numberOfStudentByResult(exerciceNumber,document.getElementById("cohorteSelect").value);
	            	domain = domainEcart;
	            	legendData = legendFormate([]);
	            	//title = "Résultats de l'exercices : "+exerciseNames[exerciceNumber];
	            	displayExerciseSelector();
	            	document.getElementById("moreOf").disabled = true;
	            	document.getElementById("moreOf").parentElement.firstElementChild.style.color = "dimgray";
	            	forcedColor = true;
	            	//exerciceNumberMakeVisible(true);
	                break;
	            case 3:
	            	layers = pourcentOfSuccessByExerciseSeparateByResult(document.getElementById("cohorteSelect").value);
	            	domain = getCourseNames();
	            	//legendColumn = 2;
	            	legendData = legendFormate(domainEcart);
	            	//title = title3;
	            	hideExerciseSelector();
	            	document.getElementById("moreOf").disabled = true;
	            	document.getElementById("moreOf").parentElement.firstElementChild.style.color = "dimgray";
	            	//exerciceNumberMakeVisible(false);
	            	needOrder = true;
	            	forcedColor = true;
	                break;
	            case 4:
	            	layers = numberOfStudentByExerciseSeparateByWeekNoInscription(document.getElementById("cohorteSelect").value);
	            	domain = getCourseNames();
	            	//legendColumn = 2;
	            	legendData = legendFormate(getSheetNames());
	            	//title = title4;
	            	hideExerciseSelector();
	            	document.getElementById("moreOf").disabled = false;
	            	document.getElementById("moreOf").parentElement.firstElementChild.style.color = "";
	            	needOrder = true;
	            	needLegendOver = true;
	                break;
	        }
	        
	        if(document.getElementById("isPourcent").checked){
	        	layers = layerPourcent(layers);
	        	groupeName = " %";
	        }	else	{
	        	groupeName = " "+translations['eleves'][localStorage.lang]; //" élèves";
	        }
	        
	        
	        if(needOrder && document.querySelector('input[name="weekModeOption"]:checked').value == "1"){
	            layers = orderByWeek(layers);
	            domain = orderNameByWeek(domain);
	        }
	        
	
	        if(layers.length == 1){
	        	radioButtons.item(0).disabled = true;
	        	radioButtons.item(0).parentElement.style.color = "grey";
	        	radioButtons.item(1).disabled = true;
	        	radioButtons.item(1).parentElement.style.color = "grey";
	        }	else	{
	        	radioButtons.item(0).disabled = false;
	        	radioButtons.item(0).parentElement.style.color = "black";
	        	radioButtons.item(1).disabled = false;
	        	radioButtons.item(1).parentElement.style.color = "black";
	        }
	        displayDiagramme(layers, domain, legendData, title);
	        document.getElementById("waitingPanel").style.display = "none";
    	}, 200);
    }

    var smileyPath = ["M12 10c-2.332 0-4.145 1.636-5.093 2.797l.471.58c1.286-.819 2.732-1.308 4.622-1.308s3.336.489 4.622 1.308l.471-.58c-.948-1.161-2.761-2.797-5.093-2.797zm-3.501-6c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z",
                      "M16 14h-8v-2h8v2zm-7.5-9c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z",
                      "M17.507 9.941c-1.512 1.195-3.174 1.931-5.506 1.931-2.334 0-3.996-.736-5.508-1.931l-.493.493c1.127 1.72 3.2 3.566 6.001 3.566 2.8 0 4.872-1.846 5.999-3.566l-.493-.493zm-9.007-5.941c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z",
                      "M18 10h-12c.331 1.465 2.827 4 6.001 4 3.134 0 5.666-2.521 5.999-4zm-9.5-6c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z"];

    function displayDiagramme(layers, domain, legendData, title) {
    	/*
    	document.getElementById("headerName").innerText = "MOOC-PILOT\n tableau de progression des élèves\n" + title;
    	document.getElementById("headerName").style.left = "calc(50% - " + document.getElementById("headerName").offsetWidth/2 + "px)";*/

        d3.select("#graph")
        .remove();        
        
        d3.select("#legend")
        .remove();
        
        n = layers.length;
        m = layers[0].length;
        yGroupMax = d3.max(layers, function (layer) { return d3.max(layer, function (d) { return d.y; }); }),
        yStackMax = d3.max(layers, function (layer) { return d3.max(layer, function (d) { return d.y0 + d.y; }); });
        

        var margin = { top: 0, right: 10, bottom: 20, left: 50 },
            width = 1300 - margin.left - margin.right,
            height = 700 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .domain(domain)//d3.range(m))//ici on met la liste des noms des semaines!!
            .rangeRoundBands([0, width], .08);

        var y = d3.scale.linear()
            .domain([0, yStackMax])//on prend un nombre entre 0 et yStackMax
            .range([height, 0]);//on return l'équivalent entre height et 0

        var color = d3.scale.category20();/*d3.scale.linear()
            .domain([0, n - 1])
            .range(["#000000", "#ffffff"]);//["#aad", "#556"]);*/
	// EG: color changed for IMT
	// Bleu foncé IMT: 0c2340
	// Bleu clair IMT: 00b8de; 0 184 222
        if(forcedColor){
        	color.range()[0] = "rgb(255, 187, 120)"; // orange clair
        	color.range()[1] = "rgb(255, 127, 14)"; // orange
        	color.range()[2] = "#00b8de"; //"rgb(174, 199, 232)"; // bleu clair
        	color.range()[3] = "#0c2340"; //"rgb(31, 119, 180)"; // bleu foncé
        }	else	{
        	color.range()[0] = "#0c2340"; //"#1f77b4"; // bleu foncé
        	color.range()[1] = "#00b8de"; //"#aec7e8"; // bleu clair
        	color.range()[2] = "#ff7f0e"; // orange
        	color.range()[3] = "#ffbb78"; // orange clair
        }

        var xAxis = d3.svg.axis()
            .scale(x)
            .tickSize(0)
            .tickPadding(6)
            .orient("bottom");

        var yAxis = d3.svg.axis()
        .scale(y)
        .tickSize(width)
        .orient("right");
        
        
        /*
        var yAxis = d3.svg.axis()
            .scale(y)
            .tickSize(0)
            .tickPadding(6)
            .orient("left");*/

        svg = d3.select("#svgContainer").append("svg")
            .attr("id", "graph")
			.attr("preserveAspectRatio", "xMinYMin meet")
			.attr("viewBox", "0 0 "+(width + margin.left + margin.right)+" "+(height + margin.top + margin.bottom+60))
          	.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", -22)
        .attr("text-anchor", "middle")  
        .style("font-size", "36px")
        .style("text-decoration", "underline")  
        .text(title);
        document.querySelector("#titleView a").innerText = title;
        document.querySelector("#titleView").style.width = getTextWidth(title, "20px arial") + "px";

        
        var legendSvg = d3.select("#legendContainer").append("svg")
        			.attr("id", "legend")
                    .attr("width", 170)
           			.attr("height", 25*legendData.length + 15)
           			.style("margin-left", "25px")
           			.style("display", "block");
        
        //TIP
        d3.select("#tipDiag1")
        .remove();
        d3.select("#tipDiag2")
        .remove();
        d3.select("#tipLegend")
        .remove();
        var tip = d3.tip()
		// EG: boite gris foncé non visible -> autre
		  .attr('class', 'd3-tip')
		  .attr("id", "tipDiag1")
		  //.rootElement(document.getElementById('svgContainer'))
		  //.offset([-10, 0])
		  .offset([-145, 0])
		  .html(function (d, i, j) {
		      return d.y + groupeName;
		  })
	    svg.call(tip);
      

        var tipStudent = d3.tip()
		  .attr('class', 'd3-tip')
		  .attr('id', 'tipDiag2')
		  //.rootElement(document.getElementById('svgContainer'))
		  //.offset([-10, 0])
		  .offset([-145, 0])
		  .html(function (d, i, j) {
			  return "Nom : " + cibleStudentObject.login + "<br/>Result : " + Math.round(d.value*1000)/1000; 
			  //return "Id : " + cibleStudentObject.id + "<br/>Nom : " + cibleStudentObject.login + "<br/>Email : " + cibleStudentObject.email; 
		  })
	    svg.call(tipStudent);
        
        
        var tipLegend = d3.tip()
		  .attr('class', 'd3-tip')
		  .attr('id', 'tipLegend')
		  //.rootElement(document.getElementById('svgContainer'))
		  //.offset([-10, 0])
		  .offset([-10, 0])
		  .html(function (d, i, j) {
			  var index = parseInt(d.substring(d.indexOf("→")+1))-1;
			  return "C" + (index+1) +" : " + collectNames[index].substring(collectNames[index].length - 19, collectNames[index].length - 9); 
		  })
	    svg.call(tipLegend);
      
      
      
        //TIP
        var layer = svg.selectAll(".layer")
            .data(layers)
            .enter().append("g")
            .attr("class", "layer")
            .style("fill", function (d, i, j) {return color(i);});
        
        var rect = layer.selectAll("rect")
            .data(function (d) { return d; })
            .enter().append("rect")
            .attr("x", function (d) { return x(domain[d.x]); })
            .attr("y", height)
            .attr("width", x.rangeBand())
            .attr("stroke", "black")
            .attr("stroke-width", 0)
            .attr("height", 0)
            .on("mousedown", function(d,i,j){openBullePopup(listLayersStudent[j][parseInt(ordennedByWeek[i])])})
           	.on('mouseover', function(d){d3.select(this).attr("stroke-width", 2);tip.show(d,this);})
			.on('mouseout', function(d){d3.select(this).attr("stroke-width", 0);tip.hide(d);});
        

        if(typeDiag == 2){
        	d3.selectAll(".layer rect").attr("fill", function(d,i){ return color(i);});
        }

        rect.transition()
            .delay(function (d, i) { return i * 10; })
            .attr("y", function (d) { return y(d.y0 + d.y); })
            .attr("height", function (d) { return y(d.y0) - y(d.y0 + d.y); });
                
        var smileyg = svg.append("g")
        .attr("class", "smiley");
                
        cross = smileyg.selectAll('.path')
                 	.data(cibledStudent)
        .enter().append('path')
        .attr("d", function(d,i,j){
        	if(d.value != -1){ //&& !document.getElementById("crossCircle").checked){
            	return "M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7z";
        	}
        })
        .attr("fill", function(d,i,j){
        	if(d.value != -1){
        		if(Math.ceil(d.value/0.25)-1 < 2){//Math.ceil(uniqueId[0].tabNotes[realIndex(i-1)].note/0.25)-1 < 2){
        			return "#ff8005";
        		}	else	{
        			return "blue";
        		}
        	}
        })
        //.attr("pointer-events", "none")
        .attr("cursor", "pointer")
        .attr("stroke", function(d,i,j){return "white";})
        .attr("stroke-width", "1px")
       	.on('mouseover', function(d){tipStudent.show(d,this);})
		.on('mouseout', function(d){tipStudent.hide(d);})
        .attr("transform", function (d,i,j) { return "translate("+(x(domain[i]) - 18 + x.rangeBand()/2)+" "+(height - 30)+") rotate(0 0 0) scale(1.5 1.5)";});
        
        cross.transition()
                    .delay(function (d, i) { return i * 10; })
                    .attr("transform", function (d,i,j) { return "translate("+(x(domain[i]) - 18 + x.rangeBand()/2)+" "+(y(layers[d.y][i].y + layers[d.y][i].y0) - 30)+") rotate(0 0 0) scale(1.5 1.5)";});

        var smileyFaceg = svg.append("g")
        .attr("class", "smileyFace");
        
        
        crossSmiley = smileyFaceg.selectAll('.path')
                 	.data(cibledStudent)
        .enter().append('path')
        .attr("d", function(d,i,j){
        	if(d.value != -1){
            	return smileyPath[Math.ceil(d.value/0.25)-1];
        	}
        })
        .attr("fill", "#EBE8DE")
        .attr("pointer-events", "none")
        .attr("cursor", "pointer")
        .attr("transform", function (d,i,j) { return "translate("+(x(domain[i]) - 18 + x.rangeBand()/2)+" "+(height - 30)+") rotate(0 0 0) scale(1.5 1.5)";});
        crossSmiley.transition()
        .delay(function (d, i) { return i * 10; })
        .attr("transform", function (d,i,j) { return "translate("+(x(domain[i]) - 18 + x.rangeBand()/2)+" "+(y(layers[d.y][i].y + layers[d.y][i].y0) - 30)+") rotate(0 0 0) scale(1.5 1.5)";});
        //.attr("transform", function (d,i,j) { return "translate("+((j + 0.5) * espacement + marge - 18)+" "+((i + 0.5) * espacement-34 + topMarge)+") rotate(0 0 0) scale(1.5 1.5)";});
        
        
        svg.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        svg.selectAll(".xAxis text")  // select all the text elements for the xaxis
        .attr("fill", function(d, i){if(layers[layers.length-1][i].y0 == 0 && layers[layers.length-1][i].y == 0) {return "grey";} else {return "black";}})
        .style("text-anchor", "end")
        .style("font-size", "18px")
        .attr("transform", function(d) {
            //return "translate("+(this.getBBox().height/-2)+"," + (this.getBBox().height-2) + ")rotate(-45)";// + this.getBBox().height*-2 + 
            return "rotate(-45)";// + this.getBBox().height*-2 + 
       });
       //.call(wrap, (x.rangeBand() / n));
        
        /*
        var line = d3.svg.line()
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); });*/

        
        
        d3.selectAll("#parameters input[type='radio']").on("change", change);
        var legendLayer = legendSvg.selectAll(".legend")
                        .data(legendData)
                        .enter().append("g")
                        .attr("class", "legend");


        var legend = legendLayer.selectAll(".rect")
                        .data(function (d) { return d; })
                        .enter().append("rect")
                        .attr("x", function (d,i) { return i*80; })
                        .attr("y", function (d, i, j) { return 25 * j-7.5 +18; })
                        .attr("width", 10)
                        .attr("height", 10)
				       	.on('mouseover', function(d){if(needLegendOver){tipLegend.show(d,this);}})
						.on('mouseout', function(d){tipLegend.hide(d);})
                        .style("fill", function (d, i,j) { return color(j*legendColumn+i); });

        var legendText = legendLayer.selectAll(".text")
                        .data(function (d) { return d; })
                        .enter().append("text")
                        .style("font-weight", "bold")
                        .style("font-size", "12px")
                        .attr("x", function (d, i) { return i * 80 + 15; })
                        .attr("y", function (d, i, j) { return 25 * j + 20; })
				       	.on('mouseover', function(d){if(needLegendOver){tipLegend.show(d,this);}})
						.on('mouseout', function(d){tipLegend.hide(d);})
                        .text(function (d) { return d;});
        
        
        var gy = svg.append("g")
        .attr("class", "yAxis")
        .call(yAxis);

	    gy.selectAll("g").filter(function(d) { return d; })
	        .classed("minor", true);
	
	    gy.selectAll("text")
	    	.style("text-anchor", "end")
	        .attr("x", 4)
	        .attr("dy", -4);
	                        
	        
        if (d3.selectAll("#parameters input[type='radio']")[0][0].checked) transitionGrouped();
        function change() {
            //clearTimeout(timeout);
            if (this.value === "grouped") transitionGrouped();
            else transitionStacked();
        }

        function transitionGrouped() {
            y.domain([0, yGroupMax]);

            rect.transition()
                .duration(500)
                .delay(function (d, i) { return i * 10; })
                .attr("x", function (d, i, j) { return x(domain[d.x]) + x.rangeBand() / n * j; })
                .attr("width", x.rangeBand() / n)
              .transition()
                .attr("y", function (d) { return y(d.y); })
                .attr("height", function (d) { return height - y(d.y); });
        }

        function transitionStacked() {
            y.domain([0, yStackMax]);

            rect.transition()
                .duration(500)
                .delay(function (d, i) { return i * 10; })
                .attr("y", function (d) { return y(d.y0 + d.y); })
                .attr("height", function (d) { return y(d.y0) - y(d.y0 + d.y); })
              .transition()
                .attr("x", function (d) { return x(domain[d.x]); })
                .attr("width", x.rangeBand());
        }

        // Inspired by Lee Byron's test data generator.
        function bumpLayer(n, o) {

            function bump(a) {
                var x = 1 / (.1 + Math.random()),
                    y = 2 * Math.random() - .5,
                    z = 10 / (.1 + Math.random());
                for (var i = 0; i < n; i++) {
                    var w = (i / n - y) * z;
                    a[i] += x * Math.exp(-w * w);
                }
            }

            var a = [], i;
            for (i = 0; i < n; ++i) a[i] = o + o * Math.random();
            for (i = 0; i < 5; ++i) bump(a);
            return a.map(function (d, i) { return { x: i, y: Math.max(0, d) }; });
        }

    }

    function legendFormate(legendBrut) {
        var row = Math.ceil(legendBrut.length/legendColumn);
        var legendData = new Array(row);
        for (var i = 0; i < row; i++) {
            legendData[i] = legendBrut.slice(i * legendColumn, (i + 1) * legendColumn);
        }
        return legendData;
    }
    
    function exerciseFormat() {
        var column = 3;
        var row = Math.ceil(exerciseNames.length/3);
        
        var exerciseFormated = new Array()
        var actualColumn = 0;
        var line = new Array();
        for (var i = 0; i < exerciseNames.length; i++) {
        	if(actualColumn == column){
        		actualColumn = 0;
        		exerciseFormated.push(line);
        		line = new Array();
        	}
        	if(actualColumn == 0){
        		line.push(exerciseNames[i]);
        		actualColumn++;
        	}	else	{
        		if(getType(line[actualColumn-1]) == getType(exerciseNames[i])){
            		line.push(exerciseNames[i]);
            		actualColumn++;
        		}	else	{
            		exerciseFormated.push(line);
            		line = new Array();
            		line.push(exerciseNames[i]);
            		actualColumn = 1;
        		}
        	}
        }
        exerciseFormated.push(line);
        return exerciseFormated;
    }
    
    function getType(exerciseName){
    	return exerciseName.substring(0, exerciseName.length - 3);
    }
    
    function hideExerciseSelector(){
    	d3.select("#exerciseSelector").style("display", "none");
    	d3.select("#exerciseSelector").selectAll("g").remove();
    }
    
    function displayExerciseSelector(){
    	d3.select("#exerciseSelector").style("display", "inherit");
    	var form = d3.select("#exerciseSelector");    	
    	labels = form.selectAll("g")
    	    .data(exerciseFormat())
    	    .enter()
    	    .append("g")
    	    .style("display", "block")
    	    .style("margin-top", function(d,i,j){if(d[0].indexOf("01") != -1){return "10px";}		else	{return "0px";}})
    	    .selectAll("label")
    	    .data( function(d,i,j) { return d; } )
    	    .enter()
    	    .append("label")
    	    .text(function(d) {return d;})
    	    .insert("input")
    	    .attr({
    	        type: "radio",
    	        class: "shape",
    	        name: "exercise",
    	        value: function(d, i, j) {return exerciseNames.indexOf(d);}
    	    })
    	    .on("click", function(d,i,j) {
    	    	changeExerciceNumber(exerciseNames.indexOf(d));
    	    	callDisplayDiagramme();
             })
    	    .property("checked", function(d, i, j) {return i == 0 && j == 0;});
    }
    
    
    
    var listTypeName;
    function getExerciseType(){
   	    listTypeName = new Array();
   	    for (var i = 0; i < exerciseNames.length; i++) {
   	        if (listTypeName.indexOf(exerciseNames[i].substring(0, exerciseNames[i].length - 3)) == -1) {
   	            listTypeName.push(exerciseNames[i].substring(0, exerciseNames[i].length - 3));
   	        }
   	    }
   	}
    
    
    function wrap(text, width) {
    	var forcedNewLine = true;
    	text.each(function() {
    		var text = d3.select(this);
    		if(d3.select(this).data()[0] != undefined && typeof(d3.select(this).data()[0]) != "number"){
				var words = text.data()[0].split(/\s+/).reverse();
				console.log(words);
    		var word,
    			line = [],
    			lineNumber = 0,
    			lineHeight = 1.1, // ems
    			x = text.attr("x"),
    			y = text.attr("y"),
    			dy = parseFloat(text.attr("dy"))
    			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y-20).attr("dy", 0);
    		    var pos = 0;
    		    if(words.length == 1){
    		    	var pos = 1;
    		    }
    		    var isC = false;
    		    while (word = words.pop()) {
    		    	line.push(word);
    		    	tspan.text(line.join(" "));
    		    	if (tspan.node().getComputedTextLength() > width || forcedNewLine) {
    		    		line.pop();
    		    		tspan.text(line.join(" "));
    		    		line = [word];
    		    		if(word == "C"){
    			    		tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", (++lineNumber-1) * lineHeight * 20).text(word);
    			    		isC = true;
    		    		}	else	if(isC){
    			    		tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", (++lineNumber-1) * lineHeight * 10).text(word).classed("circleTextIndice", true).attr("dx", 12);
    		    		}	else	{
    			    		tspan = text.append("tspan").attr("x", x).attr("y", y-20).attr("dy", (++lineNumber-1) * lineHeight * 20).text(word);
    		    		}
    		    	}
    		    }
    		    if(lineNumber == 1){
    		    	tspan.attr("y", y);
    		    }
    		}
    	  });
    	}
    	
    
    function selectBar(){
    	
    }

    
    function newActualiseTableau(layers) {//ENLEVER tout les document.get
    	var tabDom = document.getElementById("tableau");
    	
    	var totalInscrit = 0;
    	var totalNoParticipant = 0;
    	var totalParticipant = 0;
    	
    	for(var j = 1; j < layers[0].length+1; j++){
    		var curentInscrit =  layers[0][j-1].y + layers[1][j-1].y;
    		var curentNoParticipant = layers[1][j-1].y;
    		var curentParticipant = layers[0][j-1].y;
    		tabDom.rows[1].cells[j+1].innerHTML = curentInscrit;
    		tabDom.rows[2].cells[j+1].innerHTML = curentNoParticipant;
    		tabDom.rows[3].cells[j+1].innerHTML = curentParticipant;
    		
    		totalInscrit += curentInscrit;
    		totalNoParticipant += curentNoParticipant;
    		totalParticipant += curentParticipant;
    	}
    	
		tabDom.rows[1].cells[1].innerHTML = totalInscrit;
		tabDom.rows[2].cells[1].innerHTML = totalNoParticipant;
		tabDom.rows[3].cells[1].innerHTML = totalParticipant;
    	
    }
    function generateTable() {//Genere le tableau en fonction du nombre de semaine
        if (document.getElementById("tableau").firstElementChild != null) {
            document.getElementById("tableau").removeChild(document.getElementById("tableau").firstElementChild);
        }
        
        document.getElementById("tableau").style.width = 61*(sheetNames.length+2) + 60 + "px";

        var tableau = document.getElementById("tableau").appendChild(document.createElement("tbody"));
        var r0 = document.createElement("tr");
        var r1 = document.createElement("tr");
        
        
        var r0ctemp = document.createElement("td");
        r0ctemp.style.width = "120px";
        r0ctemp.appendChild(document.createTextNode(translations['collectes'][localStorage.lang])); // EG "Collectes"
        r0.appendChild(r0ctemp);
        
        var r1c0 = document.createElement("td");
        r1c0.style.width = "120px";
        r1c0.appendChild(document.createTextNode(translations['inscrits'][localStorage.lang])); // EG "Inscrits"
        r1.appendChild(r1c0);


        r0.appendChild(document.createElement("td"));
        r0.lastChild.appendChild(document.createTextNode("Total"));
        for (var i = 0; i < sheetNames.length; i++) {
            var r0ctemp = document.createElement("td");
            if(menu >= 2){
                r0ctemp.appendChild(document.createTextNode((i + 1)));
            }	else	{
                r0ctemp.appendChild(document.createTextNode(i + "\u2192" + (i + 1)));
            }
            r0.appendChild(r0ctemp);
            r1.appendChild(document.createElement("td"));
        }
        /*
        r0.appendChild(document.createElement("td"));
        r0.lastChild.appendChild(document.createTextNode("Total"));*/
        r1.appendChild(document.createElement("td"));

        var r2 = r1.cloneNode(true);
        r2.firstChild.firstChild.textContent = translations['notparticipant'][localStorage.lang]; //"Non participants";
        r2.style.width = "120px";
        var r3 = r1.cloneNode(true);
        r3.firstChild.firstChild.textContent = translations['participant'][localStorage.lang]; // "Participants";
        r3.style.width = "120px";

        tableau.appendChild(r0);
        tableau.appendChild(r1);
        tableau.appendChild(r2);
        tableau.appendChild(r3);
    }