function Category(id, name, start, size, max){
	this.id = id;
	this.name = name;
	this.start = start;
	this.size = size;
	this.max = max;

	this.setMax = setMax;
}

function CrossCategory(id1, id2, max) {
    this.id1 = id1;
    this.id2 = id2;
    this.max = max;
    
    this.setMax = setMax;
}

function setMax(newMax) {
    if (this.max < newMax) {
        this.max = newMax;
    }
}