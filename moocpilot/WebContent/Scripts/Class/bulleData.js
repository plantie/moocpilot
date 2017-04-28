function BulleData(bulleId) {
	this.bulleId = bulleId;
	this.globalSize = 0;
	this.typeSize = 0;
	this.weekSize = 0;
	this.registerWeekSize = 0;
	this.typeByRegisterWeekSize = 0;

	this.bulleDataSetUp = bulleDataSetUp;
	this.getSizeRelativeTo = getSizeRelativeTo;
}
/*
function bulleDataSetUp(bulleList) {
    this.globalSize = this.getSizeRelativeTo(bulleList, globalBulleMax);
    this.typeSize = this.getSizeRelativeTo(bulleList, typeList[bulleList[this.bulleId].typeId].max);
    this.registerWeekSize = this.getSizeRelativeTo(bulleList, registerWeekList[bulleList[this.bulleId].registerWeekId].max);
    this.typeByRegisterWeekSize = this.getSizeRelativeTo(bulleList, typeByRegisterWeekList[bulleList[this.bulleId].typeId][bulleList[this.bulleId].registerWeekId].max);
}*/

function bulleDataSetUp(bulleList, globalBulleMax, typeList, registerWeekList, typeByRegisterWeekList) {
    this.globalSize = this.getSizeRelativeTo(bulleList, globalBulleMax);
    this.typeSize = this.getSizeRelativeTo(bulleList, typeList[bulleList[this.bulleId].typeId].max);
    this.registerWeekSize = this.getSizeRelativeTo(bulleList, registerWeekList[bulleList[this.bulleId].registerWeekId].max);
    this.typeByRegisterWeekSize = this.getSizeRelativeTo(bulleList, typeByRegisterWeekList[bulleList[this.bulleId].typeId][bulleList[this.bulleId].registerWeekId].max);
}

function bulleToTDataSetUp(bulleList){
    this.globalSize = this.getSizeRelativeTo(bulleList, globalBulleMax);
    this.typeSize = this.getSizeRelativeTo(bulleList, typeList[bulleList[this.bulleId].typeId].max);
    this.registerWeekSize = this.getSizeRelativeTo(bulleList, registerWeekList[bulleList[this.bulleId].registerWeekId].max);
    this.typeByRegisterWeekSize = this.getSizeRelativeTo(bulleList, typeByRegisterWeekList[bulleList[this.bulleId].typeId][bulleList[this.bulleId].registerWeekId].max);
}

function getSizeRelativeTo(bulleList, max) {
    if (document.getElementById("sizeMethod").checked) {
        var maxCircleSize = (espacement / 2) * (espacement / 2) * Math.PI;
        var surface = Math.ceil(bulleList[this.bulleId].listEleves.length / max * maxCircleSize)
        var result = Math.sqrt(surface / Math.PI);
    } else {
        var result = Math.ceil(bulleList[this.bulleId].listEleves.length / max * espacement / 2);//vision classique
    }


    if (isNaN(result)) {
        return 0;
    } else {
        return result;
    }
}

