function Note(nom, note, semaine)
{
    this.nom = nom;
    this.note = note;
    this.semaine = semaine;
    
    //déclaration des fonctions associées:
    
    this.getNoteNom = getNoteNom;
    this.getNoteNote = getNoteNote;
    this.getNoteSemaine = getNoteSemaine;
    this.setNoteNom = setNoteNom;
    this.setNoteNote = setNoteNote;
    this.setNoteSemaine = setNoteSemaine;
    
    this.afficheNote = afficheNote;
}

function NoteReparse(falseNote) {
    return new Note(falseNote.nom, falseNote.note, falseNote.semaine);
}

//TIME TO GETTER

function getNoteNom() {
    return this.nom;
}

function getNoteNote() {
    return this.note;
}

function getNoteSemaine() {
    return this.semaine;
}


//Time to SETTER

function setNoteNom(nom) {
    this.nom = nom;
}

function setNoteNote(note) {
    this.note = note;
}

function setNoteSemaine(semaine) {
    this.semaine = semaine;
}

//TIME TO FUNCTIONS

function afficheNote()
{
    console.log("nom:" + this.nom + "note:" + this.note + "semaine:" +this.semaine);
}