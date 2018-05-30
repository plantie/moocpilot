var cursorIsMoving = false;
var orderByDate = false;
var actualWeek = -1;

// EG: delta Top due to 2 lines added 
var dTop = 45;
var globalWeekNumber; // global variable added
var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
widthMax = x-500;
heightMax = y-160;

var diameter;
if(widthMax < heightMax){
	diameter = widthMax;
}	else	{
	diameter = heightMax;
}

var radius = diameter / 2,
	    innerRadius = radius - 120;
var cluster = d3.layout.cluster()
		.size([360, innerRadius])
		.sort(null)
		.separation(function(a, b) {return (a.parent == b.parent ? 1 : 5); })
		.value(function(d) { return d.size; });

var bundle = d3.layout.bundle();

var line = d3.svg.line.radial()
    .interpolate("bundle")
    .tension(.85)
    .radius(function(d) { return d.y; })
    .angle(function(d) { return d.x / 180 * Math.PI; });



var fisheye = d3.fisheye.circular()
.radius(50)
.distortion(2.25);
/* baseDisplay()
 * construct base SVG #svgCore
 */

function baseDisplay(){
	document.querySelector("#titleView a").innerHTML = "Forum (" + "<a href = 'https://www.fun-mooc.fr/courses/" + dataset[0].content.course_id + "/discussion/forum'>"+translations['link'][localStorage.lang]+"</a>" + ")" ;
    document.querySelector("#titleView").style.width = getTextWidth("Forum (lien)", "20px arial") + "px";

	d3.select("#svgCore").remove();

	var svg = d3.select("body").append("svg")
		.attr("id", "svgCore")
	    .attr("width", diameter)
	    .attr("height", diameter)
	  .append("g")
	    .attr("transform", "translate(" + radius + "," + radius + ")");
	

	d3.select("#svgCore")
		.append("path")
			.attr("id", "forumCursor")
        	.attr("d", "M 7.5 25 L 0 10 L 15 10 L 7.5 25")
			.attr("fill", "black")
			.attr("transform", "translate("+ radius +"," + (radius - innerRadius - 18)  + ")") 
			.on("mousedown", function(){
				document.getElementById("svgCore").className.baseVal += "grabbing";
				document.getElementById("forumCursor").className.baseVal += "grabbing";
				cursorIsMoving = true;
			})
			.on("mouseup", function(){
				document.getElementById("svgCore").className.baseVal = "";
				document.getElementById("forumCursor").className.baseVal = "";
				cursorIsMoving = false;
				leaveArea();
			});
	
	
	d3.select("#svgCore")
		.append("circle")
		.attr("cx", radius)
		.attr("cy", radius)
		.attr("r", innerRadius + 7)
		.style("pointer-events", "none")
		.style("fill", "transparent")
		.style("stroke","black")
		.style("stroke-width","1");

	link = svg.append("g").selectAll(".link"),
	    node = svg.append("g").selectAll(".node");

	d3.select(self.frameElement).style("height", diameter + "px");

	

}
// EG sort pos0 according to...
function changeNameOrder(flag) {
	//~ console.log("changeNameOrder !");
	pos0 = flag ? posAlpha : posCluster;
	useData(parseInt($("#weekPos").val())); // redraw wheel
}

// EG: pos0 keep position of users...
//~ var pos0 = {};
	
var posCluster = {}; // from cluster
var posAlpha; // undefined at start
var pos0 = posCluster;

function displayData(){
	baseDisplay();
	if(partDataset.length == 0){
		return;
	}
	
	var nodes = cluster.nodes(packageHierarchy(classes)),
	links = packageImports(nodes);


	node = node
	.data(nodes.filter(function(n) { return !n.children; }))
	.enter().append("text")
	.attr("class", "node")
	.attr("dy", ".31em")
	.each(function(d, i){
		// EG: keep values of cluster pos
		if (!(d.name in posCluster)) {
			posCluster[d.name] = d.x;
}
		d.x = pos0[d.name]; // pos0 is posCluster OR posAlpha
		  d.basePos = this.getCTM();
		  d.actualPos = new Object();
		  d.actualPos.x = d.basePos.e;
		  d.actualPos.y = d.basePos.f;
	  	  var numberOfPost = 0;
  		  var numberOfAnswer = 0;
		  numberOfPost = partDataset.filter(function(pD){
	    			return pD.content.username == d.name;
    			}).length;
  			    			  
  			  for(var i = 0; i < partDataset.length;i++){
  				  var pos = partDataset[i].content.quantityPeople[0].indexOf(d.name);
  				  if(pos != -1){
  					numberOfAnswer += partDataset[i].content.quantityPeople[1][pos];
  				  }
  			  }
  		  
		  d.numberOfPost = numberOfPost;
		  d.numberOfAnswer = numberOfAnswer;
		})
	.attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); })
	.style("text-anchor", function(d) { d.orient = d.x < 180; return d.x < 180 ? "start" : "end"; })
	.on("mousedown", function(d){resetPostPanel();actualisePersonPanel(d.name, d.hierarchy); cursorCalc([d.basePos.e, d.basePos.f], true);});

	// moved after as positions could be changed
	link = link
	.data(bundle(links))
	.enter().append("path")
	.each(function(d,i) { d.source = d[0], d.target = d[d.length - 1]; /*if (i<10) console.log(d);*/})
	//.style("stroke", function(d){return color(globalWeekNumber)})
	.attr("class", function(d){return "link";}) //  "week"+d.week
	//.attr("class", "link")
	.attr("d", line);

	var nodeStart = node.filter(function(n){return n.orient});

	nodeStart.insert("tspan").text(function(d) { return d.key; });
	nodeStart.insert("tspan").text(function(d){if(d.numberOfPost == 0){return " "}	else	{ return " ("+ d.numberOfPost +")"}}).style("fill", "red");
	nodeStart.insert("tspan").text(function(d){if(d.numberOfAnswer == 0){return " "}	else	{ return " ("+ d.numberOfAnswer +")"}}).style("fill", "green");

	var nodeEnd = node.filter(function(n){return !n.orient});

	nodeEnd.insert("tspan", ":first-child").text(function(d) { return d.key; });
	nodeEnd.insert("tspan", ":first-child").text(function(d){if(d.numberOfPost == 0){return " "}	else	{ return " ("+ d.numberOfPost +")"}}).style("fill", "red");
	nodeEnd.insert("tspan", ":first-child").text(function(d){if(d.numberOfAnswer == 0){return " "}	else	{ return " ("+ d.numberOfAnswer +")"}}).style("fill", "green");
	
	d3.select("#svgCore").on("mousemove", function() {
			if(!cursorIsMoving){
				return;
			}
			
			if(d3.event.buttons == 1){
			  	var mousePos = d3.mouse(this);
			  	cursorCalc(mousePos, true);
				fisheyeCalc();
			}	else	{
				document.getElementById("svgCore").className.baseVal = "";
				document.getElementById("forumCursor").className.baseVal = "";
				cursorIsMoving = false;
				leaveArea();
			}
	});
}

var nearestNode;
var previousNearestNode;

function cursorCalc(mousePos, needSelectNode){
		var dx = mousePos[0] - radius,
		    dy = mousePos[1] - radius,
		    dist = Math.sqrt(dx*dx + dy*dy);
		mousePos[0] = radius + dx * (innerRadius + 10) / dist,
		mousePos[1] = radius + dy * (innerRadius + 10) / dist;
	  	
	  	d3.select("#test").attr("cx", mousePos[0]).attr("cy", mousePos[1]);


	  	var rotationNeeded = Math.atan2(mousePos[1]-radius, mousePos[0]-radius) * 180 / Math.PI + 90;
	  	d3.select("#forumCursor").attr("transform", "translate(" + (mousePos[0] - 7.5) + "," + (mousePos[1]-7.5) + ") rotate(" + rotationNeeded +" 7.5,7.5)");
	  	

		if(!needSelectNode){
			return;
		}
		nearestNode = undefined;
		var nearestNodeDistance = 1000;
		node.each(function(d){
			var nodeDistance = Math.abs(mousePos[0] - d.basePos.e) + Math.abs(mousePos[1] - d.basePos.f);
			if(nodeDistance<nearestNodeDistance){
				nearestNodeDistance = nodeDistance;
				nearestNode = this;
			}
		});
		selectNode(d3.select(nearestNode).data()[0]);
}

function fisheyeCalc(forced){
		if(!forced && (classes.length < 180 || previousNearestNode == nearestNode)){
	  		return;
	  	}
		previousNearestNode = nearestNode;

		var mousePos = new Array();
		mousePos[0] = d3.select(previousNearestNode).data()[0].basePos.e;
		mousePos[1] = d3.select(previousNearestNode).data()[0].basePos.f;
		
		fisheye.focus(mousePos);

		var xPositive = mousePos[0] < radius ? -1 : 1;
		var yPositive = mousePos[1] > radius ? -1 : 1;
		
		node.filter(function(n){
			n.fisheye = fisheye(n.basePos.e, n.basePos.f);
			return n.fisheye.x != n.actualPos.x || n.fisheye.y != n.actualPos.y;
		}).attr("transform", function(d) {
				d.actualPos = d.fisheye;
				var newRotate = d.x - 90;
				var xEcart = d.fisheye.x - d.basePos.e;
				var yEcart = d.fisheye.y - d.basePos.f;

				newRotate += xEcart * yPositive + yEcart * xPositive;
				return "rotate(" + newRotate + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); 
			});
}

function leaveArea(){
	node.filter(function(n){
			return n.basePos.e != n.actualPos.x || n.basePos.f != n.actualPos.y;
		}).attr("transform", function(d) {return "rotate(" + (d.x-90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); });
	previousNearestNode = undefined;
}


function getScreenCoords(x, y, ctm) {
    var xn = ctm.e + x*ctm.a + y*ctm.c;
    var yn = ctm.f + x*ctm.b + y*ctm.d;
    return { x: xn, y: yn };
}

function selectNode(d) {
  node
      .each(function(n) { n.target = n.source = false; });
	
  link.classed("link--message", false);

  link
      .classed("link--target", function(l) { if (l.target === d) return l.source.source = true; })
      .classed("link--source", function(l) { if (l.source === d) return l.target.target = true; })
    .filter(function(l) { return l.target === d || l.source === d; })
      .each(function() { this.parentNode.appendChild(this); });

  node
      .classed("node--target", function(n) { return n.target && d.name != n.name; })
      .classed("node--source", function(n) { return n.source && d.name != n.name; })
      .classed("nodeHover", function(n) { return d.name == n.name; })
}

function mouseouted(d) {
  link
      .classed("link--target", false)
      .classed("link--source", false);

  node
      .classed("node--target", false)
      .classed("node--source", false)
      .classed("nodeHover", false);
}


// Lazily construct the package hierarchy from class names.
function packageHierarchy(classes) {
  var map = {};

  function find(name, data) {
    var node = map[name], i;
    if (!node) {
      node = map[name] = data || {name: name, children: []};
      if (name.length) {
        node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
        node.parent.children.push(node);
        node.key = name.substring(i + 1);
      }
    }
    return node;
  }

  // EG: list of usernames
  var names = [];
  classes.forEach(function(d) {
    find(d.hierarchy, d);
    // EG get list of names...
    names.push(d.name);
  });
  // EG: create positions according to order
  names.sort(Intl.Collator().compare); // Alphabetic
  console.log(names);
  if (posAlpha === undefined) {
    posAlpha = {};
    names.forEach(function(name,i){
	posAlpha[name] = 360.0*i/names.length;
	});
  }

  return map[""];
}

// Return a list of imports for the given array of nodes.
function packageImports(nodes) {
  var map = {},
      imports = [];

  // Compute a map from name to node.
  nodes.forEach(function(d) {
    map[d.name] = d;
  });

  // For each import, construct a link from the source to target node.
  nodes.forEach(function(d) {
	    if (d.imports) d.imports.forEach(function(i) {
    	   	imports.push({source: map[d.name], target: map[i]});
    });
  });
console.log("packageImports, imports="+imports.length);
console.log(imports);
  return imports;
}


var dataset;

function getData(){
	//~ alert('getData !');

    document.getElementById("waitingPanel").style.display = "inherit";	
	d3.json("data/"+localStorage.moocId+"/forum.json" + getRandom(), function(error, dataBrut) {
	//d3.json("Csv/forum.json" + getRandom(), function(error, dataBrut) {
			if (error) {
				document.getElementById("waitingPanel").style.display = "none";
				alert("Aucun fichier disponible");
				throw error;
			}
            document.getElementById("waitingPanel").style.display = "none";
			dataset = dataBrut;
			
			//~ alert('GET 1');
			getFirstDate();
			getFirstFunDate();
			replaceUndefined();
			useData(parseInt(document.getElementById("weekPos").value));
			createNoOrphanDataset();
			//~ alert('GET ..6');
			// EG: added load of "removedThreads.txt"
			//~ console.log("GET "+'data/'+localStorage.moocId+'/removedThreads.txt');
			//~ alert('GET 7');
			$.get( 'data/'+localStorage.moocId+'/removedThreads.txt'+ getRandom(), function( txt ) {
				//~ alert(txt);
				console.log(txt);
				hidePosts(txt.split(/\r\n|\n/));
				//~ lines.forEach(function (x){
				}
			);
			createOrphanDataset();
	});
}

var color;

var firstDate = new Date();
var lastDate = new Date(0);
var startWeekDate;
var weekMax = 0;
function getFirstDate(){
	for(var i = 0; i < dataset.length; i++){
		var testedDate = new Date(dataset[i].content.created_at);
		if(testedDate < firstDate){
			firstDate = testedDate;
		}
		if(testedDate > lastDate){
			lastDate = testedDate;
		}
	}
	weekMax = Math.ceil((lastDate.getTime()-firstDate.getTime())/1000/60/60/24/7);
	document.getElementById("weekPos").max = weekMax-1;
	
	// EG: colors
	color = d3.scale.linear()
          .domain([-1, weekMax])
          .range(['#FF0000', '#0000FF']);
	startWeekDate = new Date(firstDate.getTime());
	startWeekDate.setDate(startWeekDate.getDate() - startWeekDate.getDay() + 1);
	startWeekDate.setHours(8);
	startWeekDate.setMinutes(0);
	startWeekDate.setSeconds(0);
console.log("getFirstDate: startWeekDate="+startWeekDate+", weekMax="+weekMax);
}

var firstFunDate;
function getFirstFunDate(){
	var indexDate = 200;
	tabEleves.forEach(function(e){
		e.tabNotes.forEach(function(n){
			if(n.semaine != -1 && n.semaine < indexDate){
				indexDate = n.semaine;
			}
		});
	});
	firstFunDate = new Date(collectNames[indexDate-1].slice(-19).slice(0,10));
	firstFunDate = new Date(firstFunDate.getTime() - 1000*60*60*24*7);
console.log("getFirstFunDate, firstFunDate="+firstFunDate);
}

function replaceUndefined(){
	for(var i = 0; i < dataset.length;i++){
		replaceUndefinedOfPost(dataset[i].content);
	}
}

function replaceUndefinedOfPost(element){
	if(element.username == undefined){
		element.username = "Anonyme";
	}
	if(element.children != undefined){
		for(var i = 0; i < element.children.length; i++){
			replaceUndefinedOfPost(element.children[i]);
		}
	}

	if(element.non_endorsed_responses != undefined){
		for(var i = 0; i < element.non_endorsed_responses.length; i++){
			replaceUndefinedOfPost(element.non_endorsed_responses[i]);
		}
	}
}

var partDataset;

/* getPartDataset(weekNumber)
 * 
 * return filtered dataset
 */
function getPartDataset(weekNumber){
	globalWeekNumber = weekNumber;
	var partStart = new Date(startWeekDate.getTime() + 1000 * 60 * 60 * 24 * 7 * weekNumber);
	var partEnd = new Date(startWeekDate.getTime() + 1000 * 60 * 60 * 24 * 7 * (weekNumber+1));
	var result = dataset.filter(function(d){
		var actualDate = new Date(d.content.created_at);
		var flag = actualDate > partStart && actualDate < partEnd;
		if (flag) d.week = weekNumber;
		return flag; 
	});
console.log("getPartDataset("+weekNumber+"): "+result.length);
	return result;
}

var classes;

function useData(weekNumber){
	globalWeekNumber = weekNumber;
console.log("useData, week="+weekNumber);
	classes = new Array();
	if(weekNumber>= 0){
		partDataset = getPartDataset(weekNumber);
	}	else	{
		partDataset = dataset;
/*
// EG: add difference 
var t0=startWeekDate.getTime();
dataset.forEach(function(d){
  var t=new Date(d.content.created_at).getTime();
  d.week = Math.floor((t-t0)/1000/60/60/24/7);
  //console.log(d.content.created_at+": "+t+", "+t0+" => "+d.week);
})
*/
	}
	if(partDataset.length == 0){
		//return;
	}
	
	
  	for(var i = 0; i < partDataset.length; i++){
  		var post = partDataset[i];
  		var classe = classes.filter(function(c){
			return c.name == post.content.username;
  		});
  		if(classe.length == 0){
	  		classe = new Object();
	  		classes.push(classe);
	  		classe.name = post.content.username;
  			classe.size = 1;
  			classe.imports = new Array();
  		}	else	{
  			classe = classe[0];
  		}
		var listPeople = new Array();
		listPeople.push(classe.name);
		listPeople = getListPeople(listPeople, post.content);
		listPeople.splice(0,1);
		
		post.content.quantityPeople = count(listPeople);
		post.content.quantityPeople[1][post.content.quantityPeople[0].indexOf(post.content.username)]--;

		classe.imports = classe.imports.concat(listPeople).unique();
		
		for(var j = 0; j < listPeople.length; j++){
			var answererExist = classes.filter(function(c){
	  			return c.name == listPeople[j];
	  		});
	  		if(answererExist.length == 0){
	  			createAnswerer(listPeople[j]);
	  		}
		}
  	}

	classes.forEach(function(c){
if (c.name=="EGo41") {
	console.log("EGo41=");
	console.log(c);
}
		var eleve = tabEleves.filter(function(tE){return c.name == tE.login});
		if(eleve.length != 0){
			c.hierarchy = eleve[0].cohorte + "." + c.name;
		}	else	{
			c.hierarchy = "Default Group." + c.name;
		}

	});
console.log("useData: partDataset, classes=");
console.log(partDataset);
console.log(classes);
	
  	displayData();
  	actualiseTables();
	actualiseOthers();
}

function count(arr) {
    var a = [], b = [], prev;

    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }

    return [a, b];
}

function createAnswerer(answererName){
	classe = new Object();
	classe.name = answererName;
	classe.size = 1;
	classe.imports = new Array();
  	classes.push(classe);
}




function getListPeople(listPeople, element){
	listPeople.push(element.username);

	if(element.children != undefined){
		for(var i = 0; i < element.children.length; i++){
			listPeople = getListPeople(listPeople, element.children[i]);
		}
	}

	if(element.non_endorsed_responses != undefined){
		for(var i = 0; i < element.non_endorsed_responses.length; i++){
			listPeople = getListPeople(listPeople, element.non_endorsed_responses[i]);
		}
	}
	return listPeople;
}

function getOrphan(partDataset){
	return partDataset.filter(function(pD){
	if(pD.content.children != undefined){
	return pD.content.children.length == 0;
	}
	if(pD.content.non_endorsed_responses != undefined){
	return pD.content.non_endorsed_responses.length == 0;
	}
	});
}

function getNoOrphan(partDataset){
	return partDataset.filter(function(pD){
	if(pD.content.children != undefined){
	return pD.content.children.length != 0;
	}
	if(pD.content.non_endorsed_responses != undefined){
	return pD.content.non_endorsed_responses.length != 0;
	}
	});
}

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

function actualiseTables(){
	var postSize = new Array();
	
	if(orderByDate){
		var ordonnedByPosts = classes.filter(function(pD){return pD.numberOfPost != 0})
		var ordonnedByPostAnswers = classes.filter(function(pD){return pD.numberOfAnswer != 0})
		var postOrdonnedNoOrphan = partDataset.filter(function(pD){
			if(pD.content.children != undefined){
			return pD.content.children.length != 0;
			}
			if(pD.content.non_endorsed_responses != undefined){
			return pD.content.non_endorsed_responses.length != 0;
			}
			}).sort(function(a, b){return a.content.created_at > b.content.created_at ? 1 : -1;});
		var postOrdonnedOrphan = partDataset.filter(function(pD){
			if(pD.content.children != undefined){
			return pD.content.children.length == 0;
			}
			if(pD.content.non_endorsed_responses != undefined){
			return pD.content.non_endorsed_responses.length == 0;
			}
			}).sort(function(a, b){return a.content.created_at > b.content.created_at ? 1 : -1;});
	}	else	{
		var ordonnedByPosts = classes.filter(function(pD){return pD.numberOfPost != 0;}).sort(function(a, b){return a.numberOfPost < b.numberOfPost ? 1 : -1;});
		var ordonnedByPostAnswers = classes.filter(function(pD){return pD.numberOfAnswer != 0;}).sort(function(a, b){return a.numberOfAnswer < b.numberOfAnswer ? 1 : -1;});
		var postOrdonnedNoOrphan = partDataset.filter(function(pD){
			if(pD.content.children != undefined){
			return pD.content.children.length != 0;
			}
			if(pD.content.non_endorsed_responses != undefined){
			return pD.content.non_endorsed_responses.length != 0;
			}
			}).sort(function(a, b){return a.content.quantityPeople[1].reduce(function(pv, cv) { return pv + cv; }, 0) < b.content.quantityPeople[1].reduce(function(pv, cv) { return pv + cv; }, 0) ? 1 : -1;});
		var postOrdonnedOrphan = partDataset.filter(function(pD){
			if(pD.content.children != undefined){
			return pD.content.children.length == 0;
			}
			if(pD.content.non_endorsed_responses != undefined){
			return pD.content.non_endorsed_responses.length == 0;
			}
			}).sort(function(a, b){return a.content.created_at > b.content.created_at ? 1 : -1;});
	}

console.log("classes, partDataset, postOrdonnedNoOrphan, postOrdonnedOrphan:");
console.log(classes);
console.log(partDataset);
//~ console.log(postOrdonnedNoOrphan);
//~ console.log(postOrdonnedOrphan);
	
	var topTable = document.querySelectorAll(".topTable");

	var new_tbody = document.createElement('tbody');

	var new_row = new_tbody.insertRow(0);
	new_row.className += "firstRow";

	var new_cell_0 = document.createElement('th');
	new_cell_0.innerHTML = "";
	new_row.appendChild(new_cell_0);
	var new_cell_1 = document.createElement('th');
	new_cell_1.innerHTML = translations['leftTable1E'][localStorage.lang]; //"Emetteur";
	new_row.appendChild(new_cell_1);
	var new_cell_2 = document.createElement('th');
	new_cell_2.innerHTML = translations['leftTable1C'][localStorage.lang]; //"Commentateur";
	new_row.appendChild(new_cell_2);

	var new_row = new_tbody.insertRow(1);

	new_row.insertCell(0);
	var new_cell_1 = new_row.insertCell(1);
	new_cell_1.innerHTML = "void";
	new_row.insertCell(2);


	var topTableRows = topTable[0].rows;

	for(var i = 1; i <= ordonnedByPosts.length || i <= ordonnedByPostAnswers.length; i++){
		var new_row = new_tbody.insertRow(i+1);

		var new_cell_0 = new_row.insertCell(0);
		new_cell_0.innerHTML = i;

		var new_cell_1 = new_row.insertCell(1);
		var new_cell_2 = new_row.insertCell(2);
		
		if(i > ordonnedByPosts.length){
			new_cell_1.innerHTML = "";
		}	else	{
			new_cell_1.innerText = ordonnedByPosts[i-1].name;
			new_cell_1.pos = i-1;
			new_cell_1.onmousedown = function(){
				leaveArea();
				resetPostPanel();
				actualisePersonPanel(ordonnedByPosts[this.pos].name, ordonnedByPosts[this.pos].hierarchy);
				cursorCalc([ordonnedByPosts[this.pos].basePos.e, ordonnedByPosts[this.pos].basePos.f], true);
			};
		}
		new_cell_1.onmouseover = function(){
			$('.isHover').css('display', '');
			// gauche table 1, emetteur
			$('#topTableHover')
				.html(ordonnedByPosts[this.pos].name)
				.css({'display': 'inherit', 'top': this.getBoundingClientRect().top - 242-dTop + "px", 'left': "115px"});
			//~ document.getElementById("topTableHover").innerHTML = ordonnedByPosts[this.pos].name;
			//~ document.getElementById("topTableHover").style.display = "inherit";
			//~ document.getElementById("topTableHover").style.top = this.getBoundingClientRect().top - 242 + "px";
			//~ document.getElementById("topTableHover").style.left = "115px";
		}
		new_cell_1.onmouseout = function(){
			$('.isHover').css('display', '');
			// document.getElementById("topTableHover").style.display = "";
		}
		

		if(i > ordonnedByPostAnswers.length){
			new_cell_2.innerText = "";
		}	else	{
			new_cell_2.innerText = ordonnedByPostAnswers[i-1].name;
			new_cell_2.pos = i-1;
			new_cell_2.onmousedown = function(){
				leaveArea();
				resetPostPanel();
				actualisePersonPanel(ordonnedByPostAnswers[this.pos].name, ordonnedByPostAnswers[this.pos].hierarchy);
				cursorCalc([ordonnedByPostAnswers[this.pos].basePos.e, ordonnedByPostAnswers[this.pos].basePos.f], true);
			};
		}
		new_cell_2.onmouseover = function(){
			$('.isHover').css('display', '');
			// gauche table 1, commentateur
			$('#topTableHover')
				.html(ordonnedByPostAnswers[this.pos].name)
				.css({'display': 'inherit', 'top': this.getBoundingClientRect().top - 242-dTop + "px", 'left': ""});
			//~ document.getElementById("topTableHover").innerHTML = ordonnedByPostAnswers[this.pos].name;
			//~ document.getElementById("topTableHover").style.display = "inherit";
			//~ document.getElementById("topTableHover").style.top = this.getBoundingClientRect().top - 242 + "px";
			//~ document.getElementById("topTableHover").style.left = "";
		}
		new_cell_2.onmouseout = function(){
			$('.isHover').css('display', '');
			// document.getElementById("topTableHover").style.display = "";
		}
	}

	$('.isHover').css('display', '');
	
	topTable[0].replaceChild(new_tbody, topTable[0].firstElementChild)


	var new_tbody = document.createElement('tbody');

	var new_row = new_tbody.insertRow(0);
	new_row.className += "firstRow";
	var new_cell_0 = document.createElement('th');
	new_cell_0.innerHTML = "";
	new_row.appendChild(new_cell_0);
	var new_cell_1 = document.createElement('th');
	new_cell_1.innerHTML = translations['leftTable2'][localStorage.lang]; //"Messages commentés";
	new_row.appendChild(new_cell_1);

	

	var new_row = new_tbody.insertRow(1);

	new_row.insertCell(0);
	var new_cell_1 = new_row.insertCell(1);
	new_cell_1.innerHTML = "void";


	for(var i = 1; i <= postOrdonnedNoOrphan.length; i++){
		var new_row = new_tbody.insertRow(i+1);

		var new_cell_0 = new_row.insertCell(0);
		new_cell_0.innerHTML = i;

		var new_cell_1 = new_row.insertCell(1);


		if(i-1 > postOrdonnedNoOrphan.length){
			new_cell_1.innerText = "";
		}	else	{
			new_cell_1.innerText = postOrdonnedNoOrphan[i-1].content.title;
			new_cell_1.pos = i-1;			
			new_cell_1.onmousedown = function(){
				leaveArea();
				link.classed("link--message", false);
				mouseouted();
				var pos = this.pos;
				link.filter(function(d){
					if(d.length < 3){
						return false;
					}
					return d[0].name == postOrdonnedNoOrphan[pos].content.username && postOrdonnedNoOrphan[pos].content.quantityPeople[0].indexOf(d[2].name) != -1;
				}).classed("link--message", true).each(function() { this.parentNode.appendChild(this); });
				node
					.classed("node--target", function(n) { return postOrdonnedNoOrphan[pos].content.quantityPeople[0].indexOf(n.name) != -1 && postOrdonnedNoOrphan[pos].content.username != n.name;})
					.classed("node--source", function(n) { if(postOrdonnedNoOrphan[pos].content.username == n.name){nearestNode = this;} return postOrdonnedNoOrphan[pos].content.username == n.name; })
				
				cursorCalc([nearestNode.__data__.basePos.e, nearestNode.__data__.basePos.f], false);
				actualisePostPanel(postOrdonnedNoOrphan[this.pos].content.id, undefined, true);
			};
			new_cell_1.onmouseover = function(){
				$('.isHover').css('display', '');

				var ans = postOrdonnedNoOrphan[this.pos].content;
				var url = localStorage.baseUrl+"/discussion/forum/"+ans.commentable_id+"/threads/"+ans.id; // ans.thread_id
				// gauche, table 2, message commenté
				$('#tableMessageHover')
					.html("<a target='FUN' href='"+url+"'>link</a>, <a href='#hide' onclick='hidePost(\""+ans.id+"\")'><img src='Ressources/hide.png'/></a><br/>\"" + ans.body + "\"" +"<span>" + ans.username + "</span>")
					.css({'display': 'inherit', 'top': this.getBoundingClientRect().top - 394-dTop + "px"});
				//~ $('#tableMessageHover').mouseout(function(){$(this).hide()});
				//~ document.getElementById("tableMessageHover").innerHTML = "\"" + postOrdonnedNoOrphan[this.pos].content.body + "\"" +"<span>" + postOrdonnedNoOrphan[this.pos].content.username + "</span>";
				//~ document.getElementById("tableMessageHover").style.display = "inherit";
				//~ document.getElementById("tableMessageHover").style.top = this.getBoundingClientRect().top - 394 + "px";
			}
			new_cell_1.onmouseout = function(){
				//document.getElementById("tableMessageHover").style.display = "";
			}
		}
	}
	// EG: added
	$('.isHover').css('display', '');

	topTable[1].replaceChild(new_tbody, topTable[1].firstElementChild);

	var new_tbody = document.createElement('tbody');

	var new_row = new_tbody.insertRow(0);
	new_row.className += "firstRow";
	var new_cell_0 = document.createElement('th');
	new_cell_0.innerHTML = "";
	new_row.appendChild(new_cell_0);
	var new_cell_1 = document.createElement('th');
	new_cell_1.innerHTML = translations['leftTable3'][localStorage.lang]; //"Messages orphelins";
	new_row.appendChild(new_cell_1);

	

	var new_row = new_tbody.insertRow(1);

	new_row.insertCell(0);
	var new_cell_1 = new_row.insertCell(1);
	new_cell_1.innerHTML = "void";


	for(var i = 1; i <= postOrdonnedOrphan.length; i++){
		var new_row = new_tbody.insertRow(i+1);

		var new_cell_0 = new_row.insertCell(0);
		new_cell_0.innerHTML = i;

		var new_cell_1 = new_row.insertCell(1);


		if(i-1 > postOrdonnedOrphan.length){
			new_cell_1.innerText = "";
		}	else	{
			new_cell_1.innerText = postOrdonnedOrphan[i-1].content.title;
			new_cell_1.pos = i-1;			
			new_cell_1.onmousedown = function(){
				link.classed("link--message", false);
				mouseouted();
				var pos = this.pos;
				node
					.classed("node--source", function(n) { if(postOrdonnedOrphan[pos].content.username == n.name){nearestNode = this;}  return postOrdonnedOrphan[pos].content.username == n.name; })
				
				cursorCalc([nearestNode.__data__.basePos.e, nearestNode.__data__.basePos.f], false);
				fisheyeCalc(true);
				actualisePostPanel(postOrdonnedOrphan[this.pos].content.id, undefined, true);
			};
			new_cell_1.onmouseover = function(){
				$('.isHover').css('display', '');
				// gauche, table 3
				var ans = postOrdonnedOrphan[this.pos].content;
				var url = localStorage.baseUrl+"/discussion/forum/"+ans.commentable_id+"/threads/"+ans.id; // ans.thread_id
				$('#tableOrphanHover')
					// No need to hide !   <a href='#hide' onclick='hidePost(\""+ans.id+"\")'><img src='Ressources/hide.png'/></a>
					.html("<a target='FUN' href='"+url+"'>link</a><br/>\"" + ans.body + "\"" +"<span>" + ans.username + "</span>")
					.css({'display': 'inherit', 'top': this.getBoundingClientRect().top-543-dTop + "px"});
				//~ document.getElementById("tableOrphanHover").innerHTML = "\"" + ans.body + "\"" +"<span>" + ans.username + "</span>";
				//~ document.getElementById("tableOrphanHover").style.display = "inherit";
				//~ document.getElementById("tableOrphanHover").style.top = this.getBoundingClientRect().top - 543 + "px";
			}
			new_cell_1.onmouseout = function(){
				//~ document.getElementById("tableOrphanHover").style.display = "";
			}
		}
	}
	// EG added
	$('.isHover').css('display', '');

	topTable[2].replaceChild(new_tbody, topTable[2].firstElementChild);
}


// t: 0=postOrdonnedNoOrphan, 1=postOrdonnedOrphan, 2=listAnswers, 4=postAnswers
function hidePost(id){
	console.log("hidePost "+id);
	  $.post('DataMngt?action=threadRemove&moocId='+localStorage.moocId+'&id='+id, function(msg){
		//~ alert(msg);
		//~ document.location.href = "."
		});
	//$.ajax({url: '/DataMngt?moocId='+localStorage.moocId+'&id='+id, type: 'PUT'});
	//$.put('/DataMngt?moocId='+localStorage.moocId+'&id='+id)
	hidePosts([id]);
/*
	console.log("hidePost "+id); // remove from display & in storage
	partDataset.forEach(function(x,i){
		if (x.content.id == id) {
			console.log("len "+partDataset.length);
			console.log("remove "+i+":"+x+", "+id+" then useData");
			partDataset.splice(i, 1); // remove element !
			console.log("len "+partDataset.length);
			useData(parseInt($("#weekPos").val())); // redraw wheel
		}
	});
*/
}

// remove posts from obj {id1: 1, id2:1, ...}
function hidePosts(list){
	console.log("hidePosts");
	console.log(list);
	//~ alert('hide'+list);
	var obj={};
	list.forEach(function(x){obj[x.replace(/\n/, "")]=1;});
	console.log("Forum len before "+partDataset.length);
	console.log(obj);
	partDataset.forEach(function(x, i){
		if (x.content.id in obj) {
			console.log("Forum remove "+i+":"+x.content.id);
			partDataset.splice(i, 1); // remove element !
		}
	});
	console.log("Forum len after "+partDataset.length);
	useData(parseInt($("#weekPos").val())); // redraw wheel
}

var previousSelectedElement;
var personPanelsRotation = 0;

function actualisePersonPanel(personName, hierarchy, titleRelevant){

	document.querySelectorAll(".personName").forEach(function(cl){
		cl.innerText = personName;
	});
	document.querySelectorAll(".personCohort").forEach(function(cl){
		if(hierarchy == ""){
			cl.innerText = "";
		}	else	{
			cl.innerText = "(" + hierarchy.substring(0, i = hierarchy.lastIndexOf(".")) + ")";
		}
	});

    document.querySelector("#personAnswersPanel").style.transform = "rotateY(" + personPanelsRotation + "deg)";
	personPanelsRotation+=360;

	updatePostTable(personName, hierarchy, titleRelevant);

	var listAnswersPost = partDataset.filter(function(pD){	return pD.content.quantityPeople[0].indexOf(personName) != -1;});
	var listAnswers = new Array();
	for(var i = 0; i < listAnswersPost.length; i++){
		listAnswers = getListElementByName(listAnswers, listAnswersPost[i].content, personName, true, listAnswersPost[i].content.title);
	}

	var answersTable = document.getElementById("personAnswersTable");

	var new_tbody = document.createElement('tbody');

	var new_row = new_tbody.insertRow(0);
	new_row.className += "firstRow";

	var new_cell_0 = document.createElement('th');
	new_cell_0.innerHTML = translations['rightTable3'][localStorage.lang]; //"Commentaires";
	new_row.appendChild(new_cell_0);

	var new_row = new_tbody.insertRow(1);

	var new_cell_0 = new_row.insertCell(0);
	new_cell_0.innerHTML = "void";

	for(var i = 1; i <= listAnswers.length; i++){
		var new_row = new_tbody.insertRow(i+1);

		var new_cell_0 = new_row.insertCell(0);
		new_cell_0.pos = i-1;
		new_cell_0.title = listAnswers[i-1].title;
		if(titleRelevant != undefined){
			d3.select(new_cell_0).classed("irrelevant", function(){return this.title != titleRelevant;});
		}

		new_cell_0.innerText = replaceAll(listAnswers[i-1].body, /[\n\r]+/g, "");
		new_cell_0.onmousedown = function(){
console.log("onmousedown...");
			if(previousSelectedElement != undefined){
				previousSelectedElement.style.background = "";
			}
			previousSelectedElement = this;
			this.style.background = "linear-gradient(to right, transparent 95%, green 5%)";

			var associatedPost = findAnswerPost(listAnswers[this.pos].body);

			leaveArea();
			link.classed("link--message", false);
			mouseouted();

			link.filter(function(d){
				if(d.length < 3){
					return false;
				}
				return d[0].name == associatedPost.content.username && associatedPost.content.quantityPeople[0].indexOf(d[2].name) != -1;
			}).classed("link--message", true).each(function() { this.parentNode.appendChild(this); });
			node
				.classed("node--target", function(n) { return associatedPost.content.quantityPeople[0].indexOf(n.name) != -1 && associatedPost.content.username != n.name;})
				.classed("node--source", function(n) { if(associatedPost.content.username == n.name){nearestNode = this;} return associatedPost.content.username == n.name; })
				
			cursorCalc([nearestNode.__data__.basePos.e, nearestNode.__data__.basePos.f], false);

			actualisePostPanel(associatedPost.content.id, listAnswers[this.pos].body, false);
			//document.getElementById("personAnswersTableHover").style.display = "";
			var exist = false;
			d3.selectAll("#personPostsTable td").classed("irrelevant", function(){if(associatedPost.content.title != this.title){return true;}else{exist = true;return false;}});
			if(!exist){
				document.querySelector("#personMessagesPanel .personInfos").style.color = "grey";
			}	else	{
				document.querySelector("#personMessagesPanel .personInfos").style.color = "";
			}
			d3.selectAll("#personAnswersTable td").classed("irrelevant", function(){return associatedPost.content.title != this.title;});
		}
		new_cell_0.onmouseover = function(){
			$('.isHover').css('display', '');
			// EG: droite, table 3
			var ans = listAnswers[this.pos];
			var url = localStorage.baseUrl+"/discussion/forum/"+ans.commentable_id+"/threads/"+ans.thread_id;
			// https://www.fun-mooc.fr/courses/course-v1:MinesTelecom+04018+session03/discussion/forum/98c16964959625e624872fc98e51468de63e823d/threads/5a39d6d4a0241e174f005e72
			$('#personAnswersTableHover')
				// HIDE ? , <a href='#hide' onclick='hidePost(\""+ans.thread_id+"\")'><img src='Ressources/hide.png'/></a>
				.html("<span>Commentaire au message : <a target='FUN' href='"+url+"'>" + findAnswerPost(ans.body).content.title + "</a></span>" + "\"" + ans.body + "\"")
				.css({'display': 'inherit', 'top': this.getBoundingClientRect().top - 532 + "px"});
			//~ document.getElementById("personAnswersTableHover").innerHTML = "<span>Commentaire au message : " + findAnswerPost(listAnswers[this.pos].body).content.title + "</span>" + "\"" + listAnswers[this.pos].body + "\"";
			//~ document.getElementById("personAnswersTableHover").style.display = "inherit";
			//~ document.getElementById("personAnswersTableHover").style.top = this.getBoundingClientRect().top - 532 + "px";
		}
		new_cell_0.onmouseout = function(){
			//~ $('#personAnswersTableHover').css('display', '');
			//document.getElementById("personAnswersTableHover").style.display = "";
		}
	}
	answersTable.replaceChild(new_tbody, answersTable.firstElementChild);
	// EG: added when update table...
	$('.isHover').css('display', '');
}

var personPanelPostRotation= 0;
function updatePostTable(personName, hierarchy, titleRelevant){
	document.querySelector("#personMessagesPanel .personInfos").style.color = "";
    document.querySelector("#personMessagesPanel").style.transform = "rotateY(" + personPanelPostRotation + "deg)";
	personPanelPostRotation += 360;

	var listPosts = partDataset.filter(function(pD){	return pD.content.username == personName;}).sort(function(a, b){return a.content.created_at > b.content.created_at ? 1 : -1;});

	var postsTable = document.getElementById("personPostsTable")

	var new_tbody = document.createElement('tbody');

	var new_row = new_tbody.insertRow(0);
	new_row.className += "firstRow";

	var new_cell_0 = document.createElement('th');
	new_cell_0.innerHTML = translations['rightTable1'][localStorage.lang]; //"Messages";
	new_row.appendChild(new_cell_0);

	var new_row = new_tbody.insertRow(1);

	var new_cell_0 = new_row.insertCell(0);
	new_cell_0.innerHTML = "void";

	var relevantOne;

	for(var i = 1; i <= listPosts.length; i++){
		var new_row = new_tbody.insertRow(i+1);

		var new_cell_0 = new_row.insertCell(0);
		new_cell_0.pos = i-1;	
		if(titleRelevant != undefined){
			d3.select(new_cell_0).classed("irrelevant", function(){
				if(listPosts[i-1].content.title != titleRelevant){
					return true;
				}	else	{
					relevantOne = this;
					return false;
				}
			});
		}
		new_cell_0.title = listPosts[i-1].content.title;

		new_cell_0.innerText = listPosts[i-1].content.title;
		new_cell_0.onmousedown = function(){
			document.querySelector("#personMessagesPanel .personInfos").style.color = "";
			if(previousSelectedElement != undefined){
				previousSelectedElement.style.background = "";
			}
			previousSelectedElement = this;
			this.style.background = "linear-gradient(to right, transparent 95%, red 5%)";


			leaveArea();
			link.classed("link--message", false);
			mouseouted();
			var pos = this.pos;
			link.filter(function(d){
				if(d.length < 3){
					return false;
				}
				return d[0].name == listPosts[pos].content.username && listPosts[pos].content.quantityPeople[0].indexOf(d[2].name) != -1;
			}).classed("link--message", true).each(function() { this.parentNode.appendChild(this); });
			node
				.classed("node--target", function(n) { return listPosts[pos].content.quantityPeople[0].indexOf(n.name) != -1 && listPosts[pos].content.username != n.name;})
				.classed("node--source", function(n) { if(listPosts[pos].content.username == n.name){nearestNode = this;} return listPosts[pos].content.username == n.name; })
				
			cursorCalc([nearestNode.__data__.basePos.e, nearestNode.__data__.basePos.f], false);

			d3.selectAll("#personPostsTable td").classed("irrelevant", function(){return listPosts[pos].content.title != this.title;});
			d3.selectAll("#personAnswersTable td").classed("irrelevant", function(){return listPosts[pos].content.title != this.title;});

			actualisePostPanel(listPosts[this.pos].content.id, undefined, false);
			
		}
		new_cell_0.onmouseover = function(){
			$('.isHover').css('display', '');
			// EG: droite, table 1
			var ans = listPosts[this.pos].content;
			var url = localStorage.baseUrl+"/discussion/forum/"+ans.commentable_id+"/threads/"+ans.id; // ans.thread_id
			$('#personPostsTableHover')
				// HIDE , <a href='#hide' onclick='hidePost(\""+ans.id+"\")'><img src='Ressources/hide.png'/></a>
				.html("<span><a target='FUN' href='"+url+"'>" + ans.title + "</a></span>" + "\"" + ans.body + "\"")
				.css({'display': 'inherit', 'top': this.getBoundingClientRect().top - 125 + "px"});
			//~ document.getElementById("personPostsTableHover").innerHTML = "<span>" + listPosts[this.pos].content.title + "</span>" + "\"" + listPosts[this.pos].content.body + "\"";
			//~ //document.getElementById("personPostsTableHover").innerHTML = listPosts[this.pos].content.title;
			//~ document.getElementById("personPostsTableHover").style.display = "inherit";
			//~ document.getElementById("personPostsTableHover").style.top = this.getBoundingClientRect().top - 125 + "px";
		}
		new_cell_0.onmouseout = function(){
			//document.getElementById("personPostsTableHover").style.display = "";
		}
	}

	postsTable.replaceChild(new_tbody, postsTable.firstElementChild);

	
	if(titleRelevant != undefined){
		try {
			document.getElementById("personPostsTable").parentElement.scrollTo(0, relevantOne.offsetTop - 23);
		} catch (e) {
		}
		
	}	

}



function findAnswerPost(answer){
	for(var i = 0; i < partDataset.length; i++){
		if(answerIsInPost(answer, partDataset[i].content)){
			break;
		}
	}
	return partDataset[i];
}

function answerIsInPost(answer, element){
	if(element.body == answer){
		return true;
	}

	if(element.children != undefined){
		for(var i = 0; i < element.children.length; i++){
			if(answerIsInPost(answer, element.children[i])){
				return true;
			}
		}
	}

	if(element.non_endorsed_responses != undefined){
		for(var i = 0; i < element.non_endorsed_responses.length; i++){
			if(answerIsInPost(answer, element.non_endorsed_responses[i])){
				return true;
			}
		}
	}
	return false;
}

var postPanelRotation = 0;
//var postAnswersTableHover = document.getElementById("postAnswersTableHover");

function actualisePostPanel(postId, scrollTo, needPersonUpdate){
	//document.getElementById("postTitle").innerText = postTitle;
	
	document.querySelector("#postPanel").style.transform = "rotateY(" + postPanelRotation + "deg)";
	postPanelRotation+=360;

	var post = partDataset.filter(function(pD){	return pD.content.id  == postId;})[0];
	var postTitle = post.content.title;
	var postAnswers = getAllAnswers(new Array(), post.content, -1);

	var postBody = postAnswers.splice(0,1);

	var spans = document.querySelectorAll("#postBodyContainer span");
	spans[0].innerHTML = postBody[0].title;
	spans[1].innerHTML = postBody[0].username;

	document.getElementById("postBody").innerText = "\"" + postBody[0].body + "\"";
	document.getElementById("postBodyContainer").style.display = "inherit";

	if(needPersonUpdate){
		var postUser = classes.filter(function(c){
			return c.name == postBody[0].username;
		})[0];
		actualisePersonPanel(postUser.name, postUser.hierarchy, postTitle);
	}
	

	var postAnswersTable = document.getElementById("postAnswersTable")

	var new_tbody = document.createElement('tbody');

	var new_row = new_tbody.insertRow(0);
	new_row.className += "firstRow";

	var new_cell_0 = document.createElement('th');
	new_cell_0.innerHTML = translations['rightTable2'][localStorage.lang]; //"Réponses au message";
	new_row.appendChild(new_cell_0);

	var new_row = new_tbody.insertRow(1);

	var new_cell_0 = new_row.insertCell(0);
	new_cell_0.innerHTML = "void";

	for(var i = 1; i <= postAnswers.length; i++){
		var new_row = new_tbody.insertRow(i+1);

		var new_cell_0 = new_row.insertCell(0);
		new_cell_0.pos = i-1;

		var indent = "";
		for(var j = 0; j < postAnswers[i-1].level; j++){
			indent+= "\t";
		}
		new_cell_0.innerText = indent + replaceAll(postAnswers[i-1].body, /[\n\r]+/g, "");
		if(postAnswers[i-1].body == scrollTo){
			scrollTo = new_cell_0;
		}

		/*
		new_cell_0.onmousedown = function(){
			leaveArea();
			link.classed("link--message", false);
			mouseouted();
			var pos = this.pos;
			link.filter(function(d){
				if(d.length < 3){
					return false;
				}
				return d[0].name == post.content.username && post.content.quantityPeople[0].indexOf(d[2].name) != -1;
			}).classed("link--message", true).each(function() { this.parentNode.appendChild(this); });
			node
				.classed("node--target", function(n) { return post.content.quantityPeople[0].indexOf(n.name) != -1 && post.content.username != n.name;})
				.classed("node--source", function(n) { if(post.content.username == n.name){nearestNode = this;} return post.content.username == n.name; })
				
			cursorCalc([nearestNode.__data__.basePos.e, nearestNode.__data__.basePos.f], false);
		};*/

		new_cell_0.onmouseover = function(){
			$('.isHover').css('display', '');
			// EG: droite, table 2
			var ans = postAnswers[this.pos];
			var url = localStorage.baseUrl+"/discussion/forum/"+ans.commentable_id+"/threads/"+ans.id; // ans.thread_id
			$('#postAnswersTableHover')
				// HIDE , <a href='#hide' onclick='hidePost(\""+ans.id+"\")'><img src='Ressources/hide.png'/></a>
				.html("<a target='FUN' href='"+url+"'>link</a><br/>\"" + ans.body + "\"" +"<span>" + ans.username + "</span>")
				.css({'display': 'inherit', 'top': this.getBoundingClientRect().top - 290 + "px"});
			//~ postAnswersTableHover.innerText = "\"" + postAnswers[this.pos].body + "\"";
			//~ var localSpan = document.createElement("span");
			//~ localSpan.innerText = postAnswers[this.pos].username;
			//~ postAnswersTableHover.appendChild(localSpan);
			//~ postAnswersTableHover.style.display = "inherit";
			//~ postAnswersTableHover.style.top = this.getBoundingClientRect().top - 290 + "px";
		}
		new_cell_0.onmouseout = function(){
			//postAnswersTableHover.style.display = "";
		}
	}
	// EG: Added
	$('.isHover').css('display', '');
	postAnswersTable.replaceChild(new_tbody, postAnswersTable.firstElementChild);
	
	if(scrollTo != undefined){
		document.getElementById("postAnswersTable").parentElement.scrollTo(0, scrollTo.offsetTop - 23);
		scrollTo.style.background = "green";

/*
		setTimeout(function(){
			scrollTo.style.transition = "1s all";
			scrollTo.style.background = "";
		}, 200);*/
	}
}


function resetPostPanel(){
	var postAnswersTable = document.getElementById("postAnswersTable");
	postAnswersTable.replaceChild(document.createElement('tbody'), postAnswersTable.firstElementChild);
	document.getElementById("postBodyContainer").style.display = "";
}

function getListElementByName(listElement, element, name, isPost, title){
	element.title = title;
	if(element.username == name && !isPost){
		listElement.push(element);
	}

	if(element.children != undefined){
		for(var i = 0; i < element.children.length; i++){
			listElement = getListElementByName(listElement, element.children[i], name, false, title);
		}
	}

	if(element.non_endorsed_responses != undefined){
		for(var i = 0; i < element.non_endorsed_responses.length; i++){
			listElement = getListElementByName(listElement, element.non_endorsed_responses[i], name, false, title);
		}
	}
	return listElement;
}

function getAllAnswers(listAnswers, element, level){
	element.level = level;
	listAnswers.push(element)

	if(element.children != undefined){
		for(var i = 0; i < element.children.length; i++){
			listAnswers = getAllAnswers(listAnswers, element.children[i], level+1);
		}
	}

	if(element.non_endorsed_responses != undefined){
		for(var i = 0; i < element.non_endorsed_responses.length; i++){
			listAnswers = getAllAnswers(listAnswers, element.non_endorsed_responses[i], level+1);
		}
	}
	return listAnswers;
}

function actualiseOthers(){
	actualisePersonPanel("","");
	resetPostPanel();
}

function createNoOrphanDataset(){
	noOrphanByWeek = new Array();
	for (var i = 0; i < weekMax; i++) {
		var weekNoOrphan = new Object;
		weekNoOrphan.date = new Date(startWeekDate.getTime() + 1000*60*60*24*7*i).toISOString();
		weekNoOrphan.quantity = getNoOrphan(getPartDataset(i)).length;
		noOrphanByWeek.push(weekNoOrphan);
	}
}


function createOrphanDataset(){
	orphanByWeek = new Array();
	for (var i = 0; i < weekMax; i++) {
		var weekOrphan = new Object;
		weekOrphan.date = new Date(startWeekDate.getTime() + 1000*60*60*24*7*i).toISOString();
		weekOrphan.quantity = getOrphan(getPartDataset(i)).length;
		orphanByWeek.push(weekOrphan);
	}
	
	displaySimpleGraph();
}


function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

