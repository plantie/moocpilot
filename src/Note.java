
public class Note {
	//Class représentante une Note
	private String nom;
	private double note;
	private int semaine;
	public Note(String name, double grade, int week){
		this.SetNom(name);
		this.SetNote(grade);
		this.SetSemaine(week);
	}
	public String GetNom() {
		return nom;
	}
	public void SetNom(String nom) {
		this.nom = nom;
	}
	public double GetNote() {
		return note;
	}
	public void SetNote(double note) {
		this.note = note;
	}
	public int GetSemaine() {
		return semaine;
	}
	public void SetSemaine(int semaine) {
		this.semaine = semaine;
	}
}
