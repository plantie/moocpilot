function Eleve(id, login, email, dateInscription, tabNotes, cohorte) {
    this.id = id;
    this.login = login;
    this.email = email;
    this.dateInscription = dateInscription;
    this.tabNotes = tabNotes;
    this.cohorte = cohorte;
	
    //déclaration des fonctions associées:
    this.afficheEleve = afficheEleve;
    this.afficheEleveNote = afficheEleveNote;
    this.afficheEleveNoteCSV = afficheEleveNoteCSV;
    
    
    this.getEleveId = getEleveId;
    this.getEleveLogin = getEleveLogin;
    this.getEleveEmail = getEleveEmail;
    this.getEleveDateInscription = getEleveDateInscription;
    this.getEleveTabNotes = getEleveTabNotes;
    
    this.setEleveId = setEleveId;
    this.setEleveLogin = setEleveLogin;
    this.setEleveEmail = setEleveEmail;
    this.setEleveDateInscription = setEleveDateInscription;
}

function EleveNoFunction(id, login, email, dateInscription, tabNotes) {
    this.id = id;
    this.login = login;
    this.email = email;
    this.dateInscription = dateInscription;
    this.tabNotes = tabNotes;
}
//TIME TO GETTER
function EleveReparse(falseEleve) {
    falseEleve.tabNotes.forEach(function (element, index) {
        falseEleve.tabNotes[index] = NoteReparse(element);
    });
    return new Eleve(falseEleve.id, falseEleve.login, falseEleve.email, falseEleve.dateInscription, falseEleve.tabNotes);
}

function getEleveId() {
    return this.id;
}

function getEleveLogin() {
    return this.login;
}

function getEleveEmail() {
    return this.email;
}

function getEleveDateInscription() {
    return this.dateInscription;
}

function getEleveTabNotes(){
    return this.tabNotes;
}


//Time to SETTER
function setEleveId(id) {
    this.id = id;
}

function setEleveLogin(login) {
    this.login = login;
}

function setEleveEmail(email) {
    this.email = email;
}

function setEleveDateInscription(dateInscription) {
    this.dateInscription = dateInscription;
}

//TIME TO FUNCTIONS
function afficheEleve() {
    console.log("id:"+this.id + "login:"+this.login + "email:"+this.email + "dateInscription:"+this.dateInscription);
}
function afficheEleveNote() {
    for (var i = 0; i<this.tabNotes.length; i++) {
        this.tabNotes[i].afficheNote();
    }
}

function afficheEleveNoteCSV() {
    var str = "";
    for (var i = 0; i<this.tabNotes.length-1; i++) {
        if (this.tabNotes[i].getNoteNote() > 0) {
            str += "1;";
        } else {
            str += "0;";
        }
    }
    if (this.tabNotes[this.tabNotes.length-1].getNoteNote() > 0) {
        str += "1";
    } else {
        str += "0";
    }
    return str;
}