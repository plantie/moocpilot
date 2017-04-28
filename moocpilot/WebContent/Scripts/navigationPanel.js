var onglets = document.querySelectorAll("#menu li a:last-child");
for(var i = 0; i<onglets.length;i++){
	onglets[i].parentElement.addEventListener("click", function(){updateOnglet(this);actualisation();});
}
updateOnglet(onglets[0].parentElement);

function updateOnglet(onglet){
	menu = Array.prototype.indexOf.call(document.querySelector("#menu").children, onglet);
	selectedView();
}
function selectedView(){
	for(var i = 0; i<onglets.length;i++){
		if(i == menu){
			onglets[i].style.display = "inherit";
		}	else	{
			onglets[i].style.display = "";
		}
	}
}

function nextWeek(){
	document.getElementById("slideBar").stepUp(1);
	actualisation();
}

function previousWeek(){
	document.getElementById("slideBar").stepDown(1);
	actualisation();
}
	