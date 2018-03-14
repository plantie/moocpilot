package org.moocpilot;
import java.util.ArrayList;


public class Eleve {
	//Class représentante un Eleve
	int id;
	String login;
	String email;
	int dateInscription;
	ArrayList<Note> tabNotes;
	String cohorte;
	
	
	public Eleve(int id, String login, String email, int dateInscription, ArrayList<Note> tabNotes, String cohorte){
	    this.id = id;
	    this.login = login;
	    this.email = email;
	    this.dateInscription = dateInscription;
	    this.tabNotes = tabNotes;
	    this.cohorte = cohorte;
	}
}
