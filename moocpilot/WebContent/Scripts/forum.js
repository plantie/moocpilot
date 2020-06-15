document.getElementById("weekPos").value = -1;
orderByDate = document.getElementById("orderByDate").checked;
function changeWeek(newWeek){
	document.getElementById("weekPosText").innerText = translations['week'][localStorage.lang]+": " + (parseInt(newWeek)+1);
	actualWeek = parseInt(newWeek);
	useData(actualWeek);
}

function changeOrder(){
	orderByDate = document.querySelectorAll('input[name="orderType"]')[1].checked;
	actualiseTables();
}

courseName(function(){
	//~ alert('courseName...');
	callSavedJSON(function(){
		getData();
		dataReceived = true;
		});
	//getData();
	}, "");


/*
// removed...
callSavedJSON(euhhh);

function euhhh(){
	getData();
}
*/
