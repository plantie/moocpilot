document.getElementById("weekPos").value = -1;
orderByDate = document.getElementById("orderByDate").checked;
function changeWeek(newWeek){
	document.getElementById("weekPosText").innerText = "Semaine: " + (parseInt(newWeek)+1);
	actualWeek = parseInt(newWeek);
	useData(actualWeek);
}

function changeOrder(){
	orderByDate = document.querySelectorAll('input[name="orderType"]')[1].checked;
	actualiseTables();
}

callSavedJSON(euhhh);

function euhhh(){
	getData();
}