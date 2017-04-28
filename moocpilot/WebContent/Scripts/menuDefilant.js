var listElementDefilant = document.getElementsByClassName("elementDefilant");
var indexElementVisible = 0;
for(var i = 1; i < listElementDefilant.length; i++){
	listElementDefilant[i].style.transition = "none";
	listElementDefilant[i].style.transform = "translate(-100%)";
}

function nextElement(){
	listElementDefilant[indexElementVisible].style.transform = "translate(-100%)";
	if(indexElementVisible == listElementDefilant.length-1){
		indexElementVisible = 0;
	}	else	{
		indexElementVisible++;
	}
	listElementDefilant[indexElementVisible].style.transition = "none";	
	listElementDefilant[indexElementVisible].style.transform = "translate(100%)";
	setTimeout(function(){
		listElementDefilant[indexElementVisible].style.transition = "transform 1s ease 0.1s";
		listElementDefilant[indexElementVisible].style.transitionDelay = "0.1s";
		listElementDefilant[indexElementVisible].style.transform = "translate(0)";
	},100);
}

function previousElement(){
	listElementDefilant[indexElementVisible].style.transform = "translate(100%)";
	if(indexElementVisible == 0){
		indexElementVisible = listElementDefilant.length-1;
	}	else	{
		indexElementVisible--;
	}
	listElementDefilant[indexElementVisible].style.transition = "none";	
	listElementDefilant[indexElementVisible].style.transform = "translate(-100%)";
	setTimeout(function(){
		listElementDefilant[indexElementVisible].style.transition = "transform 1s ease 0.1s";
		listElementDefilant[indexElementVisible].style.transitionDelay = "0.1s";
		listElementDefilant[indexElementVisible].style.transform = "translate(0)";
	},100);
}