	Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

var smileyPath = ["M12 10c-2.332 0-4.145 1.636-5.093 2.797l.471.58c1.286-.819 2.732-1.308 4.622-1.308s3.336.489 4.622 1.308l.471-.58c-.948-1.161-2.761-2.797-5.093-2.797zm-3.501-6c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z",
                "M16 14h-8v-2h8v2zm-7.5-9c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z",
                "M17.507 9.941c-1.512 1.195-3.174 1.931-5.506 1.931-2.334 0-3.996-.736-5.508-1.931l-.493.493c1.127 1.72 3.2 3.566 6.001 3.566 2.8 0 4.872-1.846 5.999-3.566l-.493-.493zm-9.007-5.941c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z",
                "M18 10h-12c.331 1.465 2.827 4 6.001 4 3.134 0 5.666-2.521 5.999-4zm-9.5-6c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z"];

var espacement = 70;
var delimitation = new Array();
var marge = 35;
var topMarge = 110;
var previousSelectedCircle;
var previousSelectedCircleCohorte;
var previousSelectedI;
var previousSelectedJ;
var visualisedCohorteI;
var visualisedCohorteJ;
var cursor;
var previousColumn;
var selectedDataset;
var realDataset;
var circleRow;
var studentInfoMargin;
var previousUniqueId;
//document.getElementById("simulCalque").addEventListener("click", simuleCalque);

// EG: table of labels
// Label changed according to R6
d3Label = [
  // 0
  {"fr" : "Progressions cumulées",
   "en": "Cumulative progressions"},
  // 1
  {"fr" : "Dernier exercice réalisé par chaque élève", //"Progressions Réparties",
   "en": "Spread progressions"},
  // 2
  {"fr" : "Résultats d’un élève, datés dans le temps", //"Suivi individuel",
   "en": "Student results, with datestamp"},
];


function bulleClique(d, i, j, allDataset, cohorteDataset, selectedDataset, d3Event) {
	if (cohorteDataset.length != 0) {
        openBullePopup(cohorteDataset[d].listEleves, i, j, d3Event.layerX, d3Event.layerY, espacement);
    } else {
        openBullePopup(allDataset[d].listEleves, i, j, d3Event.layerX, d3Event.layerY, espacement);
    }
    changeCircle(i, j);
}

/*
referenceDataset contient soit un string soit un entier représentant un id de bulle


*/
var lockGenere;

var previousReferenceDataset;
var previousAllDataset;
var previousAllDatasetData;
var previousCohorteDataset;
var previousCohorteDatasetData;
var previousSelectedDataset;
var previousSelectedDatasetData;
var previousSelectedCohorteDatasetData;
var previousSelectedGlobalDatasetData;
var previousUniqueDataset;

function newGenereSVG(referenceDataset, allDataset, allDatasetData, cohorteDataset, cohorteDatasetData, cohorteGlobalDatasetData, selectedDataset, selectedDatasetData, selectedCohorteDatasetData, selectedGlobalDatasetData, uniqueDataset) {
	if (allDatasetData == undefined) {
        return;
    }
	
	if(document.querySelector('input[name="weekModeOption"]:checked').value == "1"){
		referenceDataset = orderByWeek(referenceDataset);
		uniqueDataset = orderByWeek(uniqueDataset);
	}
    
    lockGenere = true;

    sizeByType = document.getElementById("maxCategorieToggle").checked;
    onlyCohorte = document.getElementById("onlyDisplaySelectedCohorte").checked;

	document.getElementById("infoContains").value = "";//TO MOVE


    d3.select("#svgCore")
       .remove();
    var width = espacement * (referenceDataset.length) + marge;
    var height = espacement * (referenceDataset[0].length) + topMarge;

    newActualiseTableau(referenceDataset, allDataset, cohorteDataset, selectedDataset);

    svg = d3.select("#svgPanel")
                .append("svg")
                .classed("svg", true)
                .attr("id", "svgCore")
                .attr("width", width + 30)
                .attr("height", height)
                .attr("transform", "translate(" + 0 + "," + -50 + ")")
                .on('mouseover', function () {newZoomColum(Math.floor((d3.event.layerX) / espacement - 1.1), allDatasetData, cohorteDatasetData, cohorteGlobalDatasetData, selectedDatasetData, selectedCohorteDatasetData, selectedGlobalDatasetData) })
			    .on('mouseout', function () { newZoomColum(0, allDatasetData, cohorteDatasetData, cohorteGlobalDatasetData, selectedDatasetData, selectedCohorteDatasetData, selectedGlobalDatasetData) });

        svg.append("g").attr("id", "stockBulleDeplacement");

    document.getElementById("svgPanel").style.width = width + 30 + "px";

    var hLine = svg.append("line")
					.attr("x1", marge)
					.attr("y1", espacement + topMarge)
					.attr("x2", width)
					.attr("y2", espacement + topMarge)
					.style("stroke", "black")
					.style("stroke-width", 3);
    VLine = svg.append("line")
					.attr("x1", espacement+marge)
					.attr("y1", topMarge)
					.attr("x2", espacement + marge)
					.attr("y2", height)
					.style("stroke", "black")
					.style("stroke-width", 3);
    
    var breakLine = svg.append("line")
		.attr("x1", marge)
		.attr("y1", topMarge)
		.attr("x2", espacement+marge)
		.attr("y2", espacement + topMarge)
		.style("stroke", "black")
		.style("stroke-width", 3);
    
    title = svg.append("text")
	.text(function(){
		if(document.querySelector('input[name="visualisationMode"]:checked').value == "0" && document.getElementById("studentSelect").parentElement.style.display == "none"){
			return d3Label[0][localStorage.lang];
			//return "Progressions cumulées";
		}	else	if(document.querySelector('input[name="visualisationMode"]:checked').value == "1"){
			return d3Label[1][localStorage.lang];
			//return "Progressions Réparties";
		}	else	{
			return d3Label[2][localStorage.lang];
			//return "Suivi individuelXXX";
		}
		
	})
	.attr("font-size", "30px")
	.attr("text-decoration", "underline")
	.attr("x",width/2-150)
	.attr("y",40);
    
	if(document.querySelector('input[name="visualisationMode"]:checked').value == "0" && document.getElementById("studentSelect").parentElement.style.display == "none"){
    	document.getElementById("moreOf").disabled = false;
    	document.getElementById("moreOf").parentElement.firstElementChild.style.color = "black";
		document.querySelector("#titleView a").innerText = d3Label[0][localStorage.lang]; //"Progressions cumulées";
        document.querySelector("#titleView").style.width = getTextWidth(d3Label[0][localStorage.lang]/*"Progressions cumulées"*/, "20px arial") + "px";
	}	else	if(document.querySelector('input[name="visualisationMode"]:checked').value == "1"){
    	document.getElementById("moreOf").disabled = false;
    	document.getElementById("moreOf").parentElement.firstElementChild.style.color = "black";
	    document.querySelector("#titleView a").innerText = d3Label[1][localStorage.lang]; //"Progressions Réparties";
        document.querySelector("#titleView").style.width = getTextWidth(d3Label[1][localStorage.lang]/*"Progressions Réparties"*/, "20px arial") + "px";
	}	else	{
    	document.getElementById("moreOf").disabled = true;
    	document.getElementById("moreOf").parentElement.firstElementChild.style.color = "dimgray";
	    document.querySelector("#titleView a").innerText = d3Label[2][localStorage.lang]; //"Suivi individuel";
        document.querySelector("#titleView").style.width = getTextWidth(d3Label[2][localStorage.lang]/*"Suivi individuel"*/, "20px arial") + "px";
	}
    
    textSemaineInscription = svg.append("text")
		.text("Collecte")
		.attr("font-size", "12px")
		.attr("x",espacement - 20)
		.attr("y",espacement/5 + topMarge);
    /*
    textSemaineInscription = svg.append("text")
		.text("d'inscription")
		.attr("font-size", "8px")
		.attr("x",espacement-10)
		.attr("y",espacement/5+10 + topMarge);*/

	textDéroulement = svg.append("text")
		.text("Exercices")
		.attr("font-size", "12px")
		.attr("x",espacement/1.75 - 20)
		.attr("y",espacement/1.16 + topMarge);
    
    textEmailHeader = svg.append("text")
					.text("")
					.attr("font-size", "16px")
					.attr("x",espacement+marge+marge)
					.attr("y",16 + topMarge);
    
    textEmail = svg.append("text")
    				.text("")
    				.attr("font-size", "14px")
    				.attr("x",espacement+marge+marge+70)
    				.attr("y",16 + topMarge);
   
    
    var cursorCorner = ["M0 10 L0 0 L10 0","M60 0 L70 0 L70 10","M70 60 L70 70 L60 70","M10 70 L0 70 L0 60"];
    cursor = svg.append("g").selectAll('.cursorCorner')
			    .data(cursorCorner)
			    .enter().append("path")
			    .attr("transform", "")
    			.attr("d", function(d){return d;})
    			.classed("cursorCorner", true)
    			.style("display", "none");
 
    delimitation = new Array();
    if(document.querySelector('input[name="weekModeOption"]:checked').value == "1"){
    	delimitation.push(2);
        for (var i = 0; i < listWeekStart.length; i++) {
            delimitation.push(listWeekStart[i] + listWeekSize[i] + 1);
        }
    }	else	{
        for (var i = 0; i < listTypeStart.length; i++) {
            delimitation.push(listTypeStart[i] + listTypeSize[i] + 1);
        }
    }


    delimitationsSVG = svg.append("g").attr("id", "Délimitations").selectAll('.line').data(delimitation);

    delimitationSVGPart = delimitationsSVG.enter()
                            .append("line")
                            .attr("x1", marge)
                            .attr("y1", function (d) { return d * espacement + topMarge; })
                            .attr("x2", width)
                            .attr("y2", function (d) { return d * espacement + topMarge; })
                            .classed("delimitation", true);

    buttonsSVG = svg.append("g").attr("id", "Buttons").selectAll('.line').data(getButtonsNormalPositions());

    buttonSVGPart = buttonsSVG.enter()
		    .append("path")
		    .classed("svgButton", true)
		    .attr("transform", function (d) { return "translate(0 "+(d * espacement + marge - 14 + topMarge)+") rotate(90 12 12)";})
		    .attr("d", "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z")
		    .attr("fill", "black")
		    .attr("state", "unrolled");
		
	buttonSVGPartSelectable = buttonsSVG.enter()
			.append("rect")
		    .attr("x", 0)
		    .attr("y", function (d) { return d * espacement + marge - 14 + topMarge; })
		    .attr("width", "25")
		    .attr("height", "26")
		    .style("opacity", "0")
		    .attr("cursor", "pointer")
		    .on('click', function (d, i) {
		        if (buttonSVGPart[0][i].getAttribute("state") == "unrolled") {
		            roll(d3.select(buttonSVGPart[0][i]));//, d * espacement + marge - 3);
		        } else {
		            unroll(d3.select(buttonSVGPart[0][i]));//, d * espacement + marge - 3);
		        }
		    });

	buttonsSVGText = buttonsSVG.enter().append("text")
                        .text(function (d, i) { if(document.querySelector('input[name="weekModeOption"]:checked').value == "1"){if(i == 0){return "Grade"}else{return "S" + (i)};} else {return listTypeName[i];} })
                        .attr("x", 0)
                        .attr("y", function (d) { return d * espacement + marge - 14 + topMarge; });


    function unroll(button) {
    	button.attr("state", "unrolled");
        rollingSVG(allDataset, cohorteDataset, selectedDataset);
    }
    function roll(button) {
    	button.attr("state", "rolled");
        rollingSVG(allDataset, cohorteDataset, selectedDataset);
    }

    // TIP 

    d3.selectAll(".d3-tip")
    .remove();
    tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .style("background", function(d,i,j){if(uniqueId.length != 0){return "blue";}else{return "black";}})
	  //.style("visibility", function(d,i,j){console.log(i); console.log(j);if(uniqueId.length != 0 && uniqueDataset[j][i].length == 0){return "hidden";}else{return "inherit";}})
	  .html(function (d, i, j) {
		  tip.style("visibility", "");
		  if(uniqueId.length != 0){
			  if(uniqueDataset[j][i].length !=0){
				  return "Id : " + uniqueId[0].id + "<br/>Nom : " + uniqueId[0].login + "<br/>Email : " + uniqueId[0].email; 
			  }	else	{
				  tip.style("visibility", "hidden");
				  return "";
			  }
		  }
		  
		  
	      var partInscrit;
	      var partParticipants;
	      if (cohorteDataset.length == 0) {
	          partInscrit = (allDataset[d].listEleves.length / document.getElementById("tableau").rows[1].cells[j].innerHTML * 100).toFixed(2);
	          partParticipants = (allDataset[d].listEleves.length / document.getElementById("tableau").rows[3].cells[j].innerHTML * 100).toFixed(2);
	      } else {
	          partInscrit = (cohorteDataset[d].listEleves.length / document.getElementById("tableau").rows[1].cells[j].innerHTML * 100).toFixed(2);
	          partParticipants = (cohorteDataset[d].listEleves.length / document.getElementById("tableau").rows[3].cells[j].innerHTML * 100).toFixed(2);
	      }

	      if(isNaN(partInscrit)){
	    	  partInscrit = 0;
	      }
	      if(isNaN(partParticipants)){
	    	  partParticipants = 0;
	      }
	      var str = partInscrit;
	      var en;
	      if(j == referenceDataset.length-1){
	    	  en = "au total";
	      }	else	{
	    	  en = "en C"+j;
	      }
	      if(menu >= 2 || j == referenceDataset.length-1){
	    	  str += "% du total des inscrits " + en;
	    	  str += "<br/>" + partParticipants + "% du total des participants " + en;
	      }	else	{
		      if(j == 1){
		    	  str += "% du total des inscrits avant C" + j;
			      str += "<br/>" + partParticipants + "% du total des participants avant C";
		      }	else	{
		    	  str += "% du total des inscrits entre C" + (j-1) +" et C" + j;
			      str += "<br/>" + partParticipants + "% du total des participants entre C" + (j-1) +" et C";
		      }
	      }
	   
	      str += "<br/> Cliquez sur la bulle pour afficher le détail";
	      return str;
	  });
	  
    svg.call(tip);
    //____tip________________________

    tip2 = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function (d, i, j) {	
		  return "C" + j +" : " + collectNames[j-1].substring(collectNames[j-1].length - 19, collectNames[j-1].length - 9);
	  });
	  
  svg.call(tip2);
    
    
    //On click





    //____On click_____________________

    circleRow = svg.selectAll('.row')
    .data(referenceDataset)
    .enter().append('g');
    

    circleRow.append("rect")
    .attr("width", espacement*0.9)
    .attr("height", "100%")
    .attr("x", function(d,i){if(i == referenceDataset.length-1){return (1 + 0.5) * espacement + marge + 0.05*espacement;} else {return (i+1 + 0.5) * espacement + marge + 0.05*espacement; }})
    .attr("fill", "transparent");
    
    circle = circleRow.selectAll('.circle')
    .data(function (d, i, j) { return d })
    .enter().append('circle')
    .style("opacity", function(){
		if(document.getElementById("crossCircle").checked && uniqueId.length == 1){
			return 0.5;
		}	else	{
			return 1;
		}})
	.attr('r', function (d, i, j) {
	    if (i > 0 && j > 0) {
	        if (onlyCohorte && cohorteDataset.length != 0) {
	            return 0;
	        }
	        if (sizeByType) {
	            return allDatasetData[d].typeSize;
	        } else {
	            return allDatasetData[d].globalSize;
	        }
	    }
	})
	.style("display", function(d,i,j){if(i == 0) {return "none";}})
    .attr("cx", function (d, i, j) { if(j == referenceDataset.length-1){return (1 + 0.5) * espacement + marge;} else {return (j+1 + 0.5) * espacement + marge; }})
    .attr("cy", function (d, i, j) { return (i + 0.5) * espacement + topMarge; })
    .classed({
        'circlePair': function (d, i, j) { return j % 2 == 0; },
        'circleImpair': function (d, i, j) { return j % 2 != 0; }

    })
	.on('mouseover', tip.show)
	.on('mouseout', tip.hide)
	.on('click', function (d, i, j) {bulleClique(d, i, j, allDataset, cohorteDataset, selectedDataset, d3.event) });

    circleCohorte = circleRow.selectAll('.circle')
    .data(function (d, i, j) { return d })
    .enter().append('circle')
    .style("opacity", function(){
		if(document.getElementById("crossCircle").checked && uniqueId.length == 1){
			return 0.5;
		}	else	{
			return 1;
		}})
	.attr('r', function (d, i, j) {
	    if (i > 0 && j > 0 && cohorteDataset.length != 0) {
	        if (onlyCohorte) {
	            if (sizeByType) {
	                return cohorteDatasetData[d].typeSize;
	            } else {
	                return cohorteDatasetData[d].globalSize;
	            }
	        } else {
	            if (sizeByType) {
	                return cohorteGlobalDatasetData[d].typeSize;
	            } else {
	                return cohorteGlobalDatasetData[d].globalSize;
	            }
	        }
	    }
	})
	.style("display", function(d,i,j){if(i == 0) {return "none";}})
    .attr("fill", "yellow")
    .attr("cursor", "pointer")
    .classed("circleCohorte", true)
	.attr("cx", function (d, i, j) { if(j == referenceDataset.length-1){return (1 + 0.5) * espacement + marge;} else {return (j+1 + 0.5) * espacement + marge; }})
    .attr("cy", function (d, i, j) { return (i + 0.5) * espacement + topMarge; })
	.on('mouseover', tip.show)
	.on('mouseout', tip.hide)
	.on('click', function (d, i, j) { bulleClique(d, i, j, allDataset, cohorteDataset, selectedDataset, d3.event) });

    circleSelected = circleRow.selectAll('.circle')
        .data(function (d, i, j) { return d })
        .enter().append('circle')
        .attr('r', function (d, i, j) {
            if (i > 0 && j > 0 && selectedDataset.length!=0) {
                if (cohorteDataset!=0 && onlyCohorte) {
                    if (sizeByType) {
                        return selectedCohorteDatasetData[d].typeSize;
                    } else {
                        return selectedCohorteDatasetData[d].globalSize;
                    }
                } else {
                    if (sizeByType) {
                        return selectedGlobalDatasetData[d].typeSize;
                    } else {
                        return selectedGlobalDatasetData[d].globalSize;
                    }
                }
            }
        })
        .attr("fill", function () { if (cohorteDataset.length == 0) { return "green"; } else { return "yellow"; } })
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("pointer-events", "none")
        .attr("cursor", "pointer")
        .attr("cx", function (d, i, j) { if(j == referenceDataset.length-1){return (1 + 0.5) * espacement + marge;} else {return (j+1 + 0.5) * espacement + marge; }})
        .attr("cy", function (d, i, j) { return (i + 0.5) * espacement + topMarge; })
	    .on('click', function (d, i, j) { bulleClique(d, i, j, allDataset, cohorteDataset, selectedDataset, d3.event) });
           
    
    circleOut = circleRow.selectAll('.circle')

    .data(function (d, i, j) { return d; })
    .enter().append('circle')
	.attr('r', function (d, i, j) {
	    if (i > 0 && j > 0 && circle[j][i].getAttribute("r") < 22 && circleCohorte[j][i].getAttribute("r") < 22 && circleSelected[j][i].getAttribute("r") < 22) {
	        return 22;
	    } else {
	        return 0;
	    }
	})
    .attr("cx", function (d, i, j) { if(j == referenceDataset.length-1){return (1 + 0.5) * espacement + marge;} else {return (j+1 + 0.5) * espacement + marge; }})
    .attr("cy", function (d, i, j) { return (i + 0.5) * espacement + topMarge; })
    .classed('circleOut', true)
	.on('mouseover', tip.show)
	.on('mouseout', tip.hide)
	.on('click', function (d, i, j) { bulleClique(d, i, j, allDataset, cohorteDataset, selectedDataset, d3.event) });


    
    collectNamesText = circleRow.selectAll('.circle')
    .data(function (d, i, j) { return d; }) //lines
   	.enter() //text displays normally
    .append("text")
    .style("display", "")
    .text(function (d, i, j) { if(i == 0 && j != 0 && j < collectNames.length+1){return collectNames[j-1].substring(collectNames[j-1].length - 19, collectNames[j-1].length - 9);}})
    .attr("transform", function(d,i,j){return "translate("+((j + 1.5) * espacement + marge)+","+ ((i + 0.5) * espacement - 15 + topMarge) + ") rotate(-45)";});

    
    circleTextBackground = circleRow.selectAll('.circle')
						    .data(function (d, i, j) { return d; }) //lines
						    .enter() //text displays normally
						    .append("rect")
			                .attr("x", function (d, i, j) { if(j == referenceDataset.length-1){return (1 + 0.5) * espacement + marge-22;} else {return (j+1 + 0.5) * espacement + marge-22; }})
			                .attr("y", function (d, i, j) {
			                		if(i==0 && j != 0){
			                			return (i + 0.5) * espacement - espacement/5 + topMarge; 
			                		}	else	{
				                        return (i + 0.5) * espacement - espacement/5-19 + topMarge;
			                		}
			                })
						    .attr("width", function (d, i, j) {
		                		if(i==0 && j != 0){
		                			return "54";
		                		}	else	{
			                        return "44";
		                		}})
						    .attr("height", function (d, i, j) {
		                		if(i==0 && j != 0){
		                			return "42";
		                		}	else	{
			                        return "22";
		                		}})
						    .style("pointer-events", function(d,i,j){
						    	if(i == 0 && j != 0){
						    		return "";
						    	}	else	{
						    		return "none";
						    	}
						    })
						    .attr("fill", "#EBE8DE")
						    .style("opacity", function(d, i, j){
						    	if((document.getElementById("isDisplayNumber").checked || uniqueId.length != 0) && i>0 && j>0){
						    		return 1;
						    	}	else	{
						    		return 0;
						    	}
						    });
						    
    circleText = circleRow.selectAll('.circle')
                .data(function (d, i, j) { return d; }) //lines
                .enter() //text displays normally
                .append("text")
                .attr("x", function (d, i, j) { if(j==0){return (0.5) * espacement + marge;}else if(j == referenceDataset.length-1){return (1 + 0.5) * espacement + marge;} else {return (j+1 + 0.5) * espacement + marge; }})
                .attr("y", function (d, i, j) {
                    if (i == 0 || j == 0) {
                        return (i + 0.5) * espacement + 6 + topMarge;
                    } else {
                        return (i + 0.5) * espacement -espacement/5 + topMarge;
                    }
                })
				.style("opacity", function(d, i, j){
					if((!document.getElementById("isDisplayNumber").checked || uniqueId.length != 0) && i>0 && j>0){
						return 0;
					}	else	{
						return 1;
					}
				})                
                .classed("circleText", true)
                .call(wrap, espacement, allDataset, cohorteDataset, selectedDataset);
    
    cross = circleRow.selectAll('.circle')
    .data(function (d, i, j) { return d })
    .enter().append('path')
    .attr("d", function(d,i,j){
    	if(j < uniqueDataset.length && i > 0 && j > 0 && uniqueId.length != 0 && uniqueDataset[j][i] != 0){ //&& !document.getElementById("crossCircle").checked){
        	return "M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7z";
    	}
    })
    .attr("fill", function(d,i,j){
    	if(j < uniqueDataset.length && i > 0 && j > 0 && uniqueId.length != 0 && uniqueDataset[j][i] != 0){
    		if(Math.ceil(uniqueId[0].tabNotes[realIndex(i-1)].note/0.25)-1 < 2){
    			return "#ff8005";
    		}	else	{
    			return "blue";
    		}
    	}
    })
    .attr("pointer-events", "none")
    .attr("cursor", "pointer")
    .attr("transform", function (d,i,j) {
    	var xValue;
    	if(j == referenceDataset.length-1){
    		xValue = ((1 + 0.5) * espacement + marge - 18);
    	}	else	{
    		xValue = ((j + 1.5) * espacement + marge - 18);
    	}
    	return "translate("+xValue+" "+((i + 0.5) * espacement-34 + topMarge)+") rotate(0 0 0) scale(1.5 1.5)";});

    crossSmiley = circleRow.selectAll('.circle')
    .data(function (d, i, j) { return d })
    .enter().append('path')
    .attr("d", function(d,i,j){
    	if(j < uniqueDataset.length && i > 0 && j > 0 && uniqueId.length != 0 && uniqueDataset[j][i] != 0){ //&& !document.getElementById("crossCircle").checked){
        	return smileyPath[Math.ceil(uniqueId[0].tabNotes[realIndex(i-1)].note/0.25)-1];
    	}
    })
    .attr("fill", "#EBE8DE")
    .attr("pointer-events", "none")
    .attr("cursor", "pointer")
    .attr("transform", function (d,i,j) { 
    	var xValue;
    	if(j == referenceDataset.length-1){
    		xValue = ((1 + 0.5) * espacement + marge - 18);
    	}	else	{
    		xValue = ((j + 1.5) * espacement + marge - 18);
    	}
    	return "translate("+xValue+" "+((i + 0.5) * espacement-34 + topMarge)+") rotate(0 0 0) scale(1.5 1.5)";});
    
    circleTextBackgroundUpdate();

    
    /*
    for(var i = 0; i< getButtonsNormalPositions().length; i++){
    	roll(d3.select(buttonSVGPart[0][i]));
    }*/
    
    
    if(document.getElementById("studentSelect").parentElement.style.display != "none"){
	    d3.selectAll(".circlePair,.circleImpair,.circleCohorte").transition().delay(300)
	    .attr("r", function(d,i){
	    	if(d3.select(this).attr("r") != 0 && d3.select(this).attr("r") != null) {
	    		return 5;
	    	}	else	{
	    		return 0;
	    	}
	    })
	    .style("fill", "grey");
	    d3.selectAll(".circleText").filter(function(d,i){return i >= referenceDataset[0].length && i % referenceDataset[0].length != 0}).style("fill", "grey");
        circle.filter(function(d,i,j) { return j == referenceDataset.length -1 && i != 0}).call(function(d,i,j){
        	for(var i = 1; i < referenceDataset[0].length; i++){
        		if(cohorteDataset.length == 0){
                	getGradeDataForPie(d3.select(this)[0][0][referenceDataset.length-1][i-1], allDataset[referenceDataset[referenceDataset.length-1][i]].listEleves);
        		}	else	{
                	getGradeDataForPie(d3.select(this)[0][0][referenceDataset.length-1][i-1], cohorteDataset[referenceDataset[referenceDataset.length-1][i]].listEleves);
        		}
        	}
        });
        displayPieTip();
    }
    
    previousReferenceDataset = referenceDataset;
    previousAllDataset = allDataset;
    previousAllDatasetData = allDatasetData;
    previousCohorteDataset = cohorteDataset;
    previousCohorteDatasetData = cohorteDatasetData;
    previousSelectedDataset = selectedDataset;
    previousSelectedDatasetData = selectedDatasetData;
    previousSelectedCohorteDatasetData = selectedCohorteDatasetData;
    previousSelectedGlobalDatasetData = selectedGlobalDatasetData;
    previousUniqueDataset = uniqueDataset;
    previousUniqueId = uniqueId;

    document.getElementById("minimapContent").innerHTML = document.getElementById("content").outerHTML
    minimapCadre();
    lockGenere = false;
}



/*Mise à jour : 
 * onlyAll 0
 * onlyCohorte 1
 * onlySelected 2
 * Non dataChange 3
 */

function newUpdateSVG(referenceDataset, allDataset, allDatasetData, cohorteDataset, cohorteDatasetData, cohorteGlobalDatasetData, selectedDataset, selectedDatasetData, selectedCohorteDatasetData, selectedGlobalDatasetData, level, uniqueDataset) {
    if (previousReferenceDataset == undefined || referenceDataset.length != previousReferenceDataset.length || referenceDataset[0].length != previousReferenceDataset[0].length) {
        console.log("Stop");
        return;
    }

    title.text(function(){
	if(document.querySelector('input[name="visualisationMode"]:checked').value == "0" && document.getElementById("studentSelect").parentElement.style.display == "none"){
    	document.getElementById("moreOf").disabled = false;
    	document.getElementById("moreOf").parentElement.firstElementChild.style.color = "black";
		document.querySelector("#titleView a").innerText = "Progressions cumulées";
        document.querySelector("#titleView").style.width = getTextWidth("Progressions cumulées", "20px arial") + "px";
	}	else	if(document.querySelector('input[name="visualisationMode"]:checked').value == "1"){
    	document.getElementById("moreOf").disabled = false;
    	document.getElementById("moreOf").parentElement.firstElementChild.style.color = "black";
		document.querySelector("#titleView a").innerText = "Progressions Réparties";
        document.querySelector("#titleView").style.width = getTextWidth("Progressions Réparties", "20px arial") + "px";
	}	else	{
    	document.getElementById("moreOf").disabled = true;
    	document.getElementById("moreOf").parentElement.firstElementChild.style.color = "dimgray";
	    document.querySelector("#titleView a").innerText = "Suivi individuel";
        document.querySelector("#titleView").style.width = getTextWidth("Suivi individuel", "20px arial") + "px";
	}});
    
	if(document.querySelector('input[name="weekModeOption"]:checked').value == "1"){
		referenceDataset = orderByWeek(referenceDataset);
		uniqueDataset = orderByWeek(uniqueDataset);
	}
	
    sizeByType = document.getElementById("maxCategorieToggle").checked;
    onlyCohorte = document.getElementById("onlyDisplaySelectedCohorte").checked;

    if (circleRow == undefined) {
        return;
    }
    
    if(level<3){

	    //niveau 2
	    circleRow.data(referenceDataset);// on met les nouvelles données puis on actualise tout les cercles.
    	
	    //niveau 2
	    circleSelected.data(function (d, i, j) { return d })
			.transition()
			.duration(750)
			.attr('r', function (d, i, j) {
			    if (i > 0 && j > 0 && selectedDataset.length != 0) {
			        if (cohorteDataset != 0 && onlyCohorte) {
			            if (sizeByType) {
			                return selectedCohorteDatasetData[d].typeSize;
			            } else {
			                return selectedCohorteDatasetData[d].globalSize;
			            }
			        } else {
			        	if(selectedGlobalDatasetData[d] != undefined){
				            if (sizeByType) {
				                return selectedGlobalDatasetData[d].typeSize;
				            } else {
				                return selectedGlobalDatasetData[d].globalSize;
				            }
			        	}
			        }
			    }
			})
	        .attr("fill", function () { if (cohorteDataset.length == 0) { return "green"; } else { return "yellow"; } });
	    circleSelected.on('click', function (d, i, j) { bulleClique(d, i, j, allDataset, cohorteDataset, selectedDataset, d3.event) });    
	    
	    
    	if(level<2){

        	//niveau 1
            if (document.getElementById("cohorteSelect").value != "") {
                //textEmailHeader.text("Cohorte :");
                //textEmail.text(document.getElementById("cohorteSelect").value);

                d3.selectAll("td")[0][0].innerHTML = "Cohorte :" + document.getElementById("cohorteSelect").value;
                d3.selectAll("td")[0][0].style.backgroundColor = "Yellow";
            } else {
                //textEmailHeader.text("");
                //textEmail.text("");
                d3.selectAll("td")[0][0].innerHTML = "";
                d3.selectAll("td")[0][0].style.backgroundColor = "";
            }
            //niveau 1
    	    newActualiseTableau(referenceDataset, allDataset, cohorteDataset, selectedDataset);
    	
    	    //niveau 1
    	    tip.style("background", function(){if(uniqueId.length != 0){return "blue";}else{return "black";}})
    	    	.html(function (d, i, j) {
        			tip.style("visibility", "");
    			  if(uniqueId.length != 0 && j < uniqueDataset.length){
    				  if(uniqueDataset[j][i].length !=0){
    					  var result = Math.round(uniqueId[0].tabNotes[realIndex(i-1)].note*1000)/1000;
    					  if(result > 0.5){
    						  tip.style("background", "blue");
    					  }	else	{
    						  tip.style("background", "#ff8005");
    					  }
    					  return "Nom : " + uniqueId[0].login + "<br/>Result : " + Math.round(uniqueId[0].tabNotes[realIndex(i-1)].note*1000)/1000; 
    				  }	else	{
    					  tip.style("visibility", "hidden");
    					  return "";
    				  }
    			  }
    		      var partInscrit;
    		      var partParticipants;
    		      if (cohorteDataset.length == 0) {
    		          partInscrit = (allDataset[d].listEleves.length / document.getElementById("tableau").rows[1].cells[j].innerHTML * 100).toFixed(2);
    		          partParticipants = (allDataset[d].listEleves.length / document.getElementById("tableau").rows[3].cells[j].innerHTML * 100).toFixed(2);
    		      } else {
    		          partInscrit = (cohorteDataset[d].listEleves.length / document.getElementById("tableau").rows[1].cells[j].innerHTML * 100).toFixed(2);
    		          partParticipants = (cohorteDataset[d].listEleves.length / document.getElementById("tableau").rows[3].cells[j].innerHTML * 100).toFixed(2);
    		      }

    		      if(isNaN(partInscrit)){
    		    	  partInscrit = 0;
    		      }
    		      if(isNaN(partParticipants)){
    		    	  partParticipants = 0;
    		      }
    		      var str = partInscrit;
    		      var en;
    		      if(j == referenceDataset.length-1){
    		    	  en = "au total";
    		      }	else	{
    		    	  en = "en C"+j;
    		      }
    		      if(menu >= 2 || j == referenceDataset.length-1){
    		    	  str += "% du total des inscrits " + en;
    		    	  str += "<br/>" + partParticipants + "% du total des participants " + en;
    		      }	else	{
    			      if(j == 1){
    			    	  str += "% du total des inscrits avant C" + j;
    				      str += "<br/>" + partParticipants + "% du total des participants avant C";
    			      }	else	{
    			    	  str += "% du total des inscrits entre C" + (j-1) +" et C" + j;
    				      str += "<br/>" + partParticipants + "% du total des participants entre C" + (j-1) +" et C";
    			      }
    		      }
    		   
    		      str += "<br/> Cliquez sur la bulle pour afficher le détail";
    		      return str;
    			  /*
    	        var partInscrit;
    	        var partParticipants;
    	        if (cohorteDataset.length == 0) {
    	            partInscrit = (allDataset[d].listEleves.length / document.getElementById("tableau").rows[1].cells[j].innerHTML * 100).toFixed(2);
    	            partParticipants = (allDataset[d].listEleves.length / document.getElementById("tableau").rows[3].cells[j].innerHTML * 100).toFixed(2);
    	        } else {
    	            partInscrit = (cohorteDataset[d].listEleves.length / document.getElementById("tableau").rows[1].cells[j].innerHTML * 100).toFixed(2);
    	            partParticipants = (cohorteDataset[d].listEleves.length / document.getElementById("tableau").rows[3].cells[j].innerHTML * 100).toFixed(2);
    	        }
    	        
    		      var str = partInscrit;
    		      if(menu >= 2){
    		    	  str += "% du total des inscrits en C" + j;
    		    	  str += "<br/>" + partParticipants + "% du total des participants en C" + j;
    		      }	else	{
    			      if(j == 1){
    			    	  str += "% du total des inscrits avant C" + j;
    				      str += "<br/>" + partParticipants + "% du total des participants avant C" + j;
    			      }	else	{
    			    	  str += "% du total des inscrits entre C" + (j-1) +" et C" + j;
    				      str += "<br/>" + partParticipants + "% du total des participants entre C" + (j-1) +" et C" + j;
    			      }
    		      }
    	        return str;*/
    	    });

    	    //niveau 1
    	    circleCohorte.data(function (d, i, j) { return d })
    			.transition()
    			.duration(750)
    			.attr('r', function (d, i, j) {
    			    if (i > 0 && j > 0 && cohorteDataset.length != 0) {
    			        if (onlyCohorte) {
    			            if (sizeByType) {
    			                return cohorteDatasetData[d].typeSize;
    			            } else {
    			                return cohorteDatasetData[d].globalSize;
    			            }
    			        } else {
    			            if (sizeByType) {
    			                return cohorteGlobalDatasetData[d].typeSize;
    			            } else {
    			                return cohorteGlobalDatasetData[d].globalSize;
    			            }
    			        }
    			    }
    			});
    	    circleCohorte.on('click', function (d, i, j) { bulleClique(d, i, j, allDataset, cohorteDataset, selectedDataset, d3.event) })
							.style("opacity", function(){
								if(document.getElementById("crossCircle").checked && uniqueId.length == 1){
									return 0.5;
								}	else	{
									return 1;
								}
							});
    	    
    	    studentInfoMargin = 0;
    	    
    	    if(previousUniqueId.length != uniqueId.length){
        	    if(uniqueId.length == 1){
        	    	document.getElementById("isDisplayNumber").checked = false;
        	    }	else	{
        	    	document.getElementById("isDisplayNumber").checked = true;
        	    }
    	    }
    	    
    	    cross.data(function (d, i, j) { return d })
    			.transition()
    			.duration(750)
			    .attr("fill", function(d,i,j){
			    	if(j < uniqueDataset.length && i > 0 && j > 0 && uniqueId.length != 0 && uniqueDataset[j][i] != 0){
			    		if(Math.ceil(uniqueId[0].tabNotes[realIndex(i-1)].note/0.25)-1 < 2){
			    			return "#ff8005";
			    		}	else	{
			    			return "blue";
			    		}
			    	}
			    })
    			.attr("d", function(d,i,j){
			    	if(j < uniqueDataset.length && i > 0 && j > 0 && uniqueId.length == 1 && uniqueDataset[j][i] != 0){// && !document.getElementById("crossCircle").checked){
			    		if(studentInfoMargin == 0){
			    			studentInfoMargin = (j + 0.5) * espacement + marge - 15 - 75;
			    		}
				    	return "M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7z";
			    	}	else {
			    	return "";
			    	}});
    	    
    	    crossSmiley.data(function (d, i, j) { return d })
    			.transition()
    			.duration(750)
    			.attr("d", function(d,i,j){
			    	if(j < uniqueDataset.length && i > 0 && j > 0 && uniqueId.length == 1 && uniqueDataset[j][i] != 0){// && !document.getElementById("crossCircle").checked){
				    	return smileyPath[Math.ceil(uniqueId[0].tabNotes[realIndex(i-1)].note/0.25)-1];
			    	}	else {
			    	return "";
			    	}});
    	    

    	    

    	    
    		if(level<1){
    		    //niveau 0
    		    circle.data(function (d, i, j) { return d })
    				.transition()
    				.duration(750)
    				.attr('r', function (d, i, j) {
    				    if (i > 0 && j > 0) {
    				        if (onlyCohorte && cohorteDataset.length != 0) {
    				            return 0;
    				        }
    				        if (sizeByType) {
    				            return allDatasetData[d].typeSize;
    				        } else {
    				            return allDatasetData[d].globalSize;
    				        }
    				    }
    				});
    		    circle.on('click', function (d, i, j) { bulleClique(d, i, j, allDataset, cohorteDataset, selectedDataset, d3.event) })
		    			.style("opacity", function(){        				
		    				if(document.getElementById("crossCircle").checked && uniqueId.length != 0){
		    					return 0.5;
		    				}	else	{
		    					return 1;
		    				}
		    			});
    		    

    		    //niveau 1
    			circleText.call(wrap, espacement, allDataset, cohorteDataset, selectedDataset);
    		}
    	    //niveau 2
    	    circleOut.data(function (d, i, j) { return d })
    		.transition()
    		.delay(1600)
        	.attr('r', function (d, i, j) {
        		//a réfléchir
        	    if (i > 0 && j > 0){// && circle[j][i].getAttribute("r") < 22 && circleCohorte[j][i].getAttribute("r") < 22 && circleSelected[j][i].getAttribute("r") < 22) {
        	        return 22;
        	    } else {
        	        return 0;
        	    }
        	})
    	    circleOut.on('click', function (d, i, j) { bulleClique(d, i, j, allDataset, cohorteDataset, selectedDataset, d3.event) });
    	}
    }
    removePie();
    if(document.getElementById("studentSelect").parentElement.style.display != "none"){
	    d3.selectAll(".circlePair,.circleImpair,.circleCohorte").transition().delay(300)
	    .attr("r", function(d,i){
	    	if(d3.select(this).attr("r") != 0 && d3.select(this).attr("r") != null) {
	    		return 5;
	    	}	else	{
	    		return 0;
	    	}
	    })
	    .style("fill", "grey");
	    d3.selectAll(".circleText").filter(function(d,i){return i >= referenceDataset[0].length && i % referenceDataset[0].length != 0}).style("fill", "grey");
        circle.filter(function(d,i,j) { return j == referenceDataset.length -1 && i != 0}).call(function(d,i,j){
        	for(var i = 1; i < referenceDataset[0].length; i++){
        		if(cohorteDataset.length == 0){
                	getGradeDataForPie(d3.select(this)[0][0][referenceDataset.length-1][i-1], allDataset[referenceDataset[referenceDataset.length-1][i]].listEleves);
        		}	else	{
                	getGradeDataForPie(d3.select(this)[0][0][referenceDataset.length-1][i-1], cohorteDataset[referenceDataset[referenceDataset.length-1][i]].listEleves);
        		}
        	}
        });
        displayPieTip();
    }	else	{
	    d3.selectAll(".circlePair,.circleImpair,.circleCohorte").style("fill", "");
    }
    
    
    //niveau 3
    svg.on('mouseover', function () { newZoomColum(Math.floor((d3.event.layerX) / espacement - 1.1), allDatasetData, cohorteDatasetData, cohorteGlobalDatasetData, selectedDatasetData, selectedCohorteDatasetData, selectedGlobalDatasetData) })
       .on('mouseout', function () { newZoomColum(0, allDatasetData, cohorteDatasetData, cohorteGlobalDatasetData, selectedDatasetData, selectedCohorteDatasetData, selectedGlobalDatasetData) });

    changeMoreOf = false;
    
	//document.getElementById("studentInfo").style.marginLeft = studentInfoMargin + "px";

    setTimeout(function(){
        document.getElementById("minimapContent").innerHTML = document.getElementById("content").outerHTML
        minimapCadre();
    }, 400);
    
    
    previousReferenceDataset = referenceDataset;
    previousAllDataset = allDataset;
    previousAllDatasetData = allDatasetData;
    previousCohorteDataset = cohorteDataset;
    previousCohorteDatasetData = cohorteDatasetData;
    previousSelectedDataset = selectedDataset;
    previousSelectedDatasetData = selectedDatasetData;
    previousSelectedCohorteDatasetData = selectedCohorteDatasetData;
    previousSelectedGlobalDatasetData = selectedGlobalDatasetData;
    previousUniqueDataset = uniqueDataset;
    previousUniqueId = uniqueId;
    circleTextBackgroundUpdate();
}
	
function circleTextBackgroundUpdate(){
    circleTextBackground.style("opacity", function (d, i, j) {
    							if(i==0 || j ==0){
    								return 0;
    							}
						        if (!document.getElementById("isDisplayNumber").checked) {
						            return 0;
						        } else {
						            return 1;
						        }
						    });
    circleText.style("opacity", function (d, i, j) {
        if (!document.getElementById("isDisplayNumber").checked && i > 0 && j > 0) {
            return 0;
        } else {
            return 1;
        }
    });
}

	
function rollingSVG(allDataset, cohorteDataset, selectedDataset) {

    var displayedPosition = getDisplayedPosition();
    var relativeDelimitation = getRelativeDelimitation(displayedPosition);
    
	var newDisplayedPosition = JSON.parse(JSON.stringify(displayedPosition));
	for(var i = displayedPosition.length-1; i > 0;i--){
		if(displayedPosition[i]-1 != displayedPosition[i-1]){
			newDisplayedPosition[i] = -1;
		}
	}	
	displayedPosition = newDisplayedPosition;
    
    delimitationsSVG.data(relativeDelimitation);

    delimitationSVGPart.attr("y1", function (d) { return d * espacement + topMarge; })
                        .attr("y2", function (d) { return d * espacement + topMarge; });

    
    buttonsSVG.data(getButtonsActualPositions(relativeDelimitation));
    buttonSVGPart.data(getButtonsActualPositions(relativeDelimitation))
    			.attr("transform", function (d,i) {if(d3.select(this).attr("state") == "rolled"){
    				displayedPosition[(relativeDelimitation[i]-1)] = -1;
	    			return "translate(0 "+(d * espacement + marge - 14 + topMarge)+")";
	    		}	else	{
	    			return "translate(0 "+(d * espacement + marge - 14 + topMarge)+") rotate(90 12 12)";
	    		}
    	});

		buttonSVGPartSelectable.data(getButtonsActualPositions(relativeDelimitation)).attr("y", function (d) { return d * espacement + marge - 14 + topMarge; });
	buttonsSVGText.attr("y", function (d) { return d * espacement + marge - 14 + topMarge; });
	
	var actualCursor = cursor.attr("transform").split(",");
	if(actualCursor[0] != ""){
		cursor.attr("transform", function(){
			if(displayedPosition.indexOf(previousSelectedI) != -1){
				return actualCursor[0]+","+  (displayedPosition.indexOf(previousSelectedI) * espacement + topMarge) + ")";
			}	else	{
				return actualCursor[0]+","+  (-2 * espacement + topMarge) + ")";
			}

		});
	}
			
	
    circle.data(function (d, i, j) { return d })
    .attr("cy", function (d, i, j) {
    	if(displayedPosition.indexOf(i) == -1){
    		return -5*espacement + topMarge;
    	}	else	{
        	return (displayedPosition.indexOf(i) + 0.5) * espacement + topMarge; 
    	}
    })
	;
    
    circleCohorte.data(function (d, i, j) { return d })
    .attr("cy", function (d, i, j) {
    	if(displayedPosition.indexOf(i) == -1){
    		return -5*espacement + topMarge;
    	}	else	{
        	return (displayedPosition.indexOf(i) + 0.5) * espacement + topMarge; 
    	}
    })
	;
    
    circleSelected.data(function (d, i, j) { return d })
    .attr("cy", function (d, i, j) {
    	if(displayedPosition.indexOf(i) == -1){
    		return -5*espacement + topMarge;
    	}	else	{
        	return (displayedPosition.indexOf(i) + 0.5) * espacement + topMarge; 
    	}
    })
	;

    circleOut.data(function (d, i, j) { return d })
    .attr("cy", function (d, i, j) {
    	if(displayedPosition.indexOf(i) == -1){
    		return -5*espacement + topMarge;
    	}	else	{
        	return (displayedPosition.indexOf(i) + 0.5) * espacement + topMarge; 
    	}
    })
	;
    circleText.data(function (d, i, j) { return d })
                        .attr("y", function (d, i, j) {
                           	if(displayedPosition.indexOf(i) == -1){
                           		d3.select(this).selectAll('tspan').attr("y", -5*espacement + topMarge);
                        		return -5*espacement;
                        	}	else	{
                        		if (i == 0){
	                           		d3.select(this).selectAll('tspan').attr("y", (displayedPosition.indexOf(i) + 0.5) * espacement + 6 + topMarge);
	                                return (displayedPosition.indexOf(i) + 0.5) * espacement + 6 + topMarge;	
                        		}
	                            if (j == 0) {
	                            	var tSpans = d3.select(this).selectAll('tspan');
	                            	if(tSpans[0].length == 2){
	                            		tSpans.attr("y", (displayedPosition.indexOf(i) + 0.5) * espacement + 6 + topMarge);
	                            	}	else	{
	                            		tSpans.attr("y", (displayedPosition.indexOf(i) + 0.5) * espacement + 6-20 + topMarge);
	                            	}
	                                return (displayedPosition.indexOf(i) + 0.5) * espacement + 6 + topMarge;	                                
	                            } else {
	                           		d3.select(this).selectAll('tspan').attr("y", (displayedPosition.indexOf(i) + 0.5) * espacement - espacement / 5 + topMarge);
	                                return (displayedPosition.indexOf(i) + 0.5) * espacement - espacement / 5 + topMarge;
	                            }
                        	}
                        });
    

    cross.data(function (d, i, j) { return d })
    .attr("transform", function (d, i, j) {
    	if(displayedPosition.indexOf(i) == -1){
    	    return "translate("+((j + 0.5) * espacement + marge - 18)+" "+(-5 * espacement + topMarge)+") rotate(0 0 0) scale(1.5 1.5)";
    	}	else	{
        	var xValue;
        	if(j == referenceDataset.length-1){
        		xValue = ((1 + 0.5) * espacement + marge - 18);
        	}	else	{
        		xValue = ((j + 1.5) * espacement + marge - 18);
        	}
    	    return "translate("+xValue+" "+((displayedPosition.indexOf(i)  + 0.5) * espacement-34 + topMarge)+") rotate(0 0 0) scale(1.5 1.5)";
    	}
    })
    
    crossSmiley.data(function (d, i, j) { return d })
    .attr("transform", function (d, i, j) {
    	if(displayedPosition.indexOf(i) == -1){
    	    return "translate("+((j + 0.5) * espacement + marge - 18)+" "+(-5 * espacement + topMarge)+") rotate(0 0 0) scale(1.5 1.5)";
    	}	else	{
        	var xValue;
        	if(j == referenceDataset.length-1){
        		xValue = ((1 + 0.5) * espacement + marge - 18);
        	}	else	{
        		xValue = ((j + 1.5) * espacement + marge - 18);
        	}
    	    return "translate("+xValue+" "+((displayedPosition.indexOf(i)  + 0.5) * espacement-34 + topMarge)+") rotate(0 0 0) scale(1.5 1.5)";
    	}
    })
    
    removePie();
    if(document.getElementById("studentSelect").parentElement.style.display != "none"){
	    d3.selectAll(".circlePair,.circleImpair,.circleCohorte").transition().delay(300)
	    .attr("r", function(d,i){
	    	if(d3.select(this).attr("r") != 0 && d3.select(this).attr("r") != null) {
	    		return 5;
	    	}	else	{
	    		return 0;
	    	}
	    })
	    .style("fill", "grey");
	    d3.selectAll(".circleText").filter(function(d,i){return i >= referenceDataset[0].length && i % referenceDataset[0].length != 0}).style("fill", "grey");
        circle.filter(function(d,i,j) { return j == referenceDataset.length -1 && i != 0}).call(function(d,i,j){
        	for(var i = 1; i < referenceDataset[0].length; i++){
        		if(cohorteDataset.length == 0){
                	getGradeDataForPie(d3.select(this)[0][0][referenceDataset.length-1][i-1], allDataset[referenceDataset[referenceDataset.length-1][i]].listEleves);
        		}	else	{
                	getGradeDataForPie(d3.select(this)[0][0][referenceDataset.length-1][i-1], cohorteDataset[referenceDataset[referenceDataset.length-1][i]].listEleves);
        		}
        	}
        });
        displayPieTip();
    }
    
    VLine.attr("y2", espacement * relativeDelimitation[relativeDelimitation.length-1] + topMarge);
    
    setTimeout(function(){
        document.getElementById("minimapContent").innerHTML = document.getElementById("content").outerHTML
        minimapCadre();
    }, 200);
}

function calque(event){
	d3.event.preventDefault();
	var zoomValue = d3.event.deltaY;
	var indexUsedMax = 0;
	d3.select(this).selectAll(".circleCalque")
									.attr("zoom", function(){
										if(zoomValue<0){
											return parseFloat(d3.select(this).attr("zoom"))+0.5;
										}	else	{
											if(parseFloat(d3.select(this).attr("zoom"))>1){
												return parseFloat(d3.select(this).attr("zoom"))-0.5;
											}	else	{
												return 1;
											}
										}
									})
									.attr("r", function(d, i, j) { 
								    if (i > 0) {
								        if (Array.isArray(usedMax)) {
								            if (delimitation.indexOf(i) != -1) {//si i est dans délimitiation
								                indexUsedMax = delimitation.indexOf(i)+1;//alors on met l'index de j dans indexUsedMax
								            }
						
								            if (Math.ceil(d.length / usedMax[indexUsedMax] * espacement / 2) > 35) {
								                return espacement / 2*parseFloat(d3.select(this).attr("zoom"));
								            }
								            return Math.ceil(d.length / usedMax[indexUsedMax] * espacement / 2 * parseFloat(d3.select(this).attr("zoom")));
								        } else {
								        	if (Math.ceil(d.length / usedMax * espacement / 2) > 35) {
								                return espacement / 2*(d3.select(this).attr("zoom"));
								            }
								            return Math.ceil(d.length / usedMax * espacement / 2*parseFloat(d3.select(this).attr("zoom")));
								        }
						  		    }
									});
}

function simuleCalque(){
	indexUsedMax= 0;
	circleCalque.attr("zoom", function(d, i, j){
		if(i>0 && j>1){
			if(parseInt(circle[j][1].getAttribute("r")) != 0){
				return parseInt(circle[1][1].getAttribute("r"))/parseInt(circle[j][1].getAttribute("r"));
			}	else	{
				return 0;
			}
		}
	})
	.attr("r", function(d, i, j) { 
	    if (i>0 && j>1) {
	        if (Array.isArray(usedMax)) {
	            if (delimitation.indexOf(i) != -1) {//si i est dans délimitiation
	                indexUsedMax = delimitation.indexOf(i)+1;//alors on met l'index de j dans indexUsedMax
	            }

	            if (Math.ceil(d.length / usedMax[indexUsedMax] * espacement / 2) > 35) {
	                return espacement / 2*parseFloat(d3.select(this).attr("zoom"));
	            }
	            return Math.ceil(d.length / usedMax[indexUsedMax] * espacement / 2 * parseFloat(d3.select(this).attr("zoom")));
	        } else {
	        	if (Math.ceil(d.length / usedMax * espacement / 2) > 35) {
	                return espacement / 2*(d3.select(this).attr("zoom"));
	            }
	        	return Math.ceil(d.length / usedMax * espacement / 2)*parseFloat(d3.select(this).attr("zoom"));
	        }
		    }
		});
}

function getIds(listEleve){
    var ids = new Array();
    for (var i = 0; i < listEleve.length; i++) {
        ids.push(listEleve[i].id.toString());
    }
    return ids;
}

function newActualiseTableau(referenceDataset, allDataset, cohorteDataset, selectedDataset) {//ENLEVER tout les document.get
    var sommeInscrits = 0;
    var sommeParticipants = 0;
    var sommeNonParticipants = 0;
    
	var alreadyCounted = 0;
	var tempTab = new Array();
	var totalTab = new Array();
    for (var i = 1; i < referenceDataset.length-1; i++) {
        if (cohorteDataset.length != 0) {
            if (i == 1) {
                document.getElementById("tableau").rows[1].cells[i].innerHTML = Object.keys(TabHashtable[i - 1]).length - Object.keys(TabHashtable[i - 1]).diff(getIds(listCohorteId)).length;
                alreadyCounted += parseInt(document.getElementById("tableau").rows[1].cells[i].innerHTML);
            } else {
            	if(menu >= 2){
                    document.getElementById("tableau").rows[1].cells[i].innerHTML = (Object.keys(TabHashtable[i - 1]).length - Object.keys(TabHashtable[i - 1]).diff(getIds(listCohorteId)).length);
            	}	else	{
                    document.getElementById("tableau").rows[1].cells[i].innerHTML = (Object.keys(TabHashtable[i - 1]).length - Object.keys(TabHashtable[i - 1]).diff(getIds(listCohorteId)).length - alreadyCounted);
            	}
                alreadyCounted += parseInt(document.getElementById("tableau").rows[1].cells[i].innerHTML);            	
            }
            tempTab = cohorteDataset[referenceDataset[i][1]].listEleves;
            for (var k = 2; k < referenceDataset[i].length; k++) {
                tempTab = tempTab.concat(cohorteDataset[referenceDataset[i][k]].listEleves.diff(tempTab));
            }
        } else {
            if (i == 1) {
                document.getElementById("tableau").rows[1].cells[i].innerHTML = Object.keys(TabHashtable[i - 1]).length;
            } else {
            	if(menu >= 2){
                    document.getElementById("tableau").rows[1].cells[i].innerHTML = Object.keys(TabHashtable[i - 1]).length - Object.keys(TabHashtable[i - 2]).length + parseInt(document.getElementById("tableau").rows[1].cells[i-1].innerHTML);
            	}	else	{
                    document.getElementById("tableau").rows[1].cells[i].innerHTML = Object.keys(TabHashtable[i - 1]).length - Object.keys(TabHashtable[i - 2]).length;
            	}
            }
            
           	tempTab = allDataset[referenceDataset[i][1]].listEleves;

            for (var k = 2; k < referenceDataset[i].length; k++) {
                tempTab = tempTab.concat(allDataset[referenceDataset[i][k]].listEleves.diff(tempTab));
            }
        }
        totalTab = totalTab.concat(tempTab).unique(); 

        document.getElementById("tableau").rows[3].cells[i].innerHTML = tempTab.length;
        document.getElementById("tableau").rows[2].cells[i].innerHTML = document.getElementById("tableau").rows[1].cells[i].innerHTML - document.getElementById("tableau").rows[3].cells[i].innerHTML;
        if (document.getElementById("tableau").rows[3].cells[i].innerHTML == 0) {
            //document.getElementById("tableau").rows[1].cells[i].innerHTML = 0;
            //document.getElementById("tableau").rows[2].cells[i].innerHTML = 0;
        }
        sommeInscrits += parseInt(document.getElementById("tableau").rows[1].cells[i].innerHTML);
        sommeParticipants += parseInt(document.getElementById("tableau").rows[3].cells[i].innerHTML);
        sommeNonParticipants += parseInt(document.getElementById("tableau").rows[2].cells[i].innerHTML);
    }


    if(menu >= 2){
        document.getElementById("tableau").rows[1].cells[sheetNames.length + 1].innerHTML = document.getElementById("tableau").rows[1].cells[sheetNames.length].innerHTML;
        document.getElementById("tableau").rows[3].cells[sheetNames.length + 1].innerHTML = totalTab.length;
        document.getElementById("tableau").rows[2].cells[sheetNames.length + 1].innerHTML = parseInt(document.getElementById("tableau").rows[1].cells[sheetNames.length + 1].innerHTML) - totalTab.length;
    }	else	{
        document.getElementById("tableau").rows[1].cells[sheetNames.length + 1].innerHTML = sommeInscrits;
        document.getElementById("tableau").rows[3].cells[sheetNames.length + 1].innerHTML = sommeParticipants;
        document.getElementById("tableau").rows[2].cells[sheetNames.length + 1].innerHTML = sommeNonParticipants;
    }

    for (var i = 0; i < document.getElementById("tableau").rows.length; i++) {
        for (var j = 0; j < document.getElementById("tableau").rows[0].cells.length; j++) {
            document.getElementById("tableau").rows[i].cells[j].style.opacity = 1;
            if (document.getElementById("tableau").rows[3].cells[j].innerHTML == 0) {
                document.getElementById("tableau").rows[i].cells[j].style.opacity = 0.2;
            }
        }
    }
}


function getUnrolledInput() {
    var unrolledInputIndex = new Array();

    [].forEach.call(document.getElementsByClassName("svgButton"), function(svgButton, index, array){
        if (svgButton.attributes["state"].value == "unrolled") {
            unrolledInputIndex.push(index);
        }
    });  
    return unrolledInputIndex;
}

function getDisplayedPosition() {
    var displayedPosition = new Array();
    displayedPosition.push(0);
    var unrolledInputIndex = getUnrolledInput();

    for (var i = 0; i < delimitation.length; i++) {
        if (i == 0) {
            if (unrolledInputIndex.indexOf(i) != -1) {
                displayedPosition = displayedPosition.concat(listNumberFromTo(1, delimitation[i] - 1));
            } else {
                displayedPosition.push(delimitation[i] - 1);
            }
        } else {
            if (unrolledInputIndex.indexOf(i) != -1) {
                displayedPosition = displayedPosition.concat(listNumberFromTo(delimitation[i-1], delimitation[i] - 1));
            } else {
                displayedPosition.push(delimitation[i] - 1);
            }
        }
    }
    return displayedPosition;
}

function listNumberFromTo(from, to) {
    var numberFromTo = new Array();
    for (var i = from; i < to + 1; i++){
        numberFromTo.push(i);
    }
     return numberFromTo;
}

function getRelativeDelimitation(displayedPosition) {
    var relativeDelimitation = new Array();
    delimitation.forEach(function(position, index, array){
        relativeDelimitation.push(displayedPosition.indexOf(position-1)+1);
    });
    return relativeDelimitation;
}

function getButtonsNormalPositions(){
	buttonsNormalPositions = new Array();
	buttonsNormalPositions.push(1);
	return buttonsNormalPositions.concat(delimitation.slice(0, -1));
}

function getButtonsActualPositions(relativeDelimitation){
	buttonsActualPositions = new Array();
	buttonsNormalPositions = getButtonsNormalPositions();
	buttonsNormalPositions.forEach(function(position, index, array){
		if(getDisplayedPosition().indexOf(position) != -1){
			buttonsActualPositions.push(getDisplayedPosition().indexOf(position));
		}	else	{
			buttonsActualPositions.push(getDisplayedPosition().indexOf(delimitation[index]-1));
		}
	});
	return buttonsActualPositions;
}

function simplifyDataset(dataset){
	var simplifiedArray = dataset.slice(0);
	for(var i = 1; i < simplifiedArray.length; i++){
		simplifiedArray[i] = dataset[i].slice(0);
		for(var j = 1; j < simplifiedArray[i].length; j++){
			simplifiedArray[i][j] = simplifiedArray[i][j].length;
		}
	}
	return simplifiedArray;
}

function createBulleMovement(position, size){
	if(parseInt(position[1])<parseInt(position[3]) && !changeMoreOf){
	var bulle = d3.select("#stockBulleDeplacement").append("circle")
	.style("fill", "green")
    .attr('r', size*2)
    .attr("cx", (parseInt(position[0])+0.5) * espacement + marge + (Math.random()*8-4))
    .attr("cy", (parseInt(position[1])+0.5) * espacement);
	
	bulle.transition().duration(1500)
    .attr("cx", (parseInt(position[2])+0.5) * espacement + marge + (Math.random()*6-3))
    .attr("cy", (parseInt(position[3])+0.5) * espacement)
	.remove();
	}
}

function vector4(x1, y1, x2, y2){
	return x1+"-"+y1+"-"+x2+"-"+y2;
}
function getElementXOfVector4(vector4, x){
	return vector4.split("-")[x];
}

function changeCircle(i,j){
	if(i != undefined){
		cursor.style("display","inherit")
		var tempX = circle[j][i].getAttribute("cx") - 35;
		var tempY = circle[j][i].getAttribute("cy") - 35;
		cursor.attr("transform", "translate("+tempX+","+tempY+")");
	}	else	{
		if(cursor!=undefined){
			cursor.style("display","none")
		}
	}
	previousSelectedI = i;
	previousSelectedJ = j;
}

function changeSelectedCohorte(i,j){
	if(visualisedCohorteI != undefined && 	(visualisedCohorteI != i || visualisedCohorteJ != j)){
		circleCohorte[visualisedCohorteJ][visualisedCohorteI].style.stroke = "";
	}
	if(i != undefined){
		//circleCohorte[j][i].style.stroke = "red";
	}

	visualisedCohorteI = i;
	visualisedCohorteJ = j;
}

function setStrokeColor(cible, color){
	cible.style.stroke = color;
}

function resetStokeColor(circle){
	cible.style.stroke = "";
}




function newZoomColum(cibledColumn, allDatasetData, cohorteDatasetData, cohorteGlobalDatasetData, selectedDatasetData, selectedCohorteDatasetData, selectedGlobalDatasetData) {
    if (!document.getElementById("isZooming").checked || allDatasetData == undefined) {
        return;
    }        
    cibledColumn--;
        circle.data(function (d, i, j) { return d })
		.transition()
		.duration(250)
		.attr('r', function (d, i, j) {
		    if (i > 0 && j > 0) {
		        if (onlyCohorte && cohorteDatasetData.length != 0) {
		            return 0;
		        }
		        if (j == cibledColumn) {
		            if (sizeByType) {
		                return allDatasetData[d].typeByRegisterWeekSize;
		            } else {
		                return allDatasetData[d].registerWeekSize;
		            }
		        } else {
		            if (sizeByType) {
		                return allDatasetData[d].typeSize;
		            } else {
		                return allDatasetData[d].globalSize;
		            }
		        }
		    } else {
		        return 0;
		    }
		});
        
	    if (cohorteDatasetData.length != 0) {
	        circleCohorte.data(function (d, i, j) { return d })
			.transition()
			.duration(250)
			.attr('r', function (d, i, j) {
			    if (i > 0 && j > 0 && cohorteDatasetData.length != 0) {
			        if (onlyCohorte) {
			            if (j == cibledColumn) {
			                if (sizeByType) {
			                    return cohorteDatasetData[d].typeByRegisterWeekSize;
			                } else {
			                    return cohorteDatasetData[d].registerWeekSize;
			                }
			            } else {
			                if (sizeByType) {
			                    return cohorteDatasetData[d].typeSize;
			                } else {
			                    return cohorteDatasetData[d].globalSize;
			                }
			            }
			        } else {
			            if (j == cibledColumn) {
			                if (sizeByType) {
			                    return cohorteGlobalDatasetData[d].typeByRegisterWeekSize;
			                } else {
			                    return cohorteGlobalDatasetData[d].registerWeekSize;
			                }
			            } else {
			                if (sizeByType) {
			                    return cohorteGlobalDatasetData[d].typeSize;
			                } else {
			                    return cohorteGlobalDatasetData[d].globalSize;
			                }
			            }
			        }
			    } else {
			        return 0;
			    }
			});
	    }
	    
	       
        if(selectedDatasetData.length != 0){
            circleSelected.data(function (d, i, j) { return d })
    		.transition()
    		.duration(250)
    		.attr('r', function (d, i, j) {
    		    if (i > 0 && j > 0 && selectedDatasetData.length != 0) {
    		        if (cohorteDatasetData.length != 0 && onlyCohorte) {
    		            if (j == cibledColumn) {
    		                if (sizeByType) {
    		                    return selectedCohorteDatasetData[d].typeByRegisterWeekSize;
    		                } else {
    		                    return selectedCohorteDatasetData[d].registerWeekSize;
    		                }
    		            } else {
    		                if (sizeByType) {
    		                    return selectedCohorteDatasetData[d].typeSize;
    		                } else {
    		                    return selectedCohorteDatasetData[d].globalSize;
    		                }
    		            }
    		        } else {
    		            if (j == cibledColumn) {
    		                if (sizeByType) {
    		                    return selectedGlobalDatasetData[d].typeByRegisterWeekSize;
    		                } else {
    		                    return selectedGlobalDatasetData[d].registerWeekSize;
    		                }
    		            } else {
    		                if (sizeByType) {
    		                    return selectedGlobalDatasetData[d].typeSize;
    		                } else {
    		                    return selectedGlobalDatasetData[d].globalSize;
    		                }
    		            }
    		        }
    		    } else {
    		        return 0;
    		    }
    		});
        }

        
        circleOut.data(function (d, i, j) { return d })
		.transition()
		.duration(250)
    	.attr('r', function (d, i, j) {
    	    if (i > 0 && j > 0 && circle[j][i].getAttribute("r") < 22 && circleCohorte[j][i].getAttribute("r") < 22 && circleSelected[j][i].getAttribute("r") < 22) {
    	        return 22;
    	    } else {
    	        return 0;
    	    }
    	});
    
        previousColumn = cibledColumn;
}

function wrap(text, width, allDataset, cohorteDataset, selectedDataset) {
	var forcedNewLine = true;
	text.each(function() {
		var text = d3.select(this);
		if(d3.select(this).data()[0] != undefined){
			if(typeof(d3.select(this).data()[0]) != "number"){
				var words = text.data()[0].split(/\s+/).reverse();
			} else {
				if (selectedDataset.length != 0 && text.data()[0] < selectedDataset.length) {
					var words = [selectedDataset[text.data()[0]].listEleves.length.toString()];
				} else if (cohorteDataset.length != 0) {
					var words = [cohorteDataset[text.data()[0]].listEleves.length.toString()];
				} else {
					var words = [allDataset[text.data()[0]].listEleves.length.toString()];
				}
			}
			 
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

function getGradeDataForPie(bulle, listEleve){
	var listElevesObjects = tabEleves.filter(function( eleve ) {
		  return listEleve.indexOf(eleve.id) != -1;
	});
	
	var orangePart = 0;
	var bluePart = 0;
	var tot = 0;
	
	for(var i = 0; i<listElevesObjects.length; i++){
		tot+=listElevesObjects[i].tabNotes[0].note;
		if(listElevesObjects[i].tabNotes[0].note< 0.5){
			orangePart++;
		}	else	{
			bluePart++;
		}
	}
	var moy = Math.round(tot/(bluePart+orangePart) * 100)/100;
	var pourcent = (orangePart + bluePart)/100;
	var data = [bluePart/pourcent, orangePart/pourcent];
	var names = [bluePart, orangePart, listEleve.length];;
	gradePie(bulle, data, names, moy);
}
