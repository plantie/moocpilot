package org.moocpilot;
import java.io.FileReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;
import java.util.Arrays;
//EG: writer
import java.io.BufferedWriter;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;

public class CsvTraitement {
	/*Class permettant le traitement du fichier csv
	 *1-Lis le fichier
	 *2-Utilise commons csv pour le transformer en objet java
	 *3-Lis l'objet java afin de repérer des élèments significatif du fichier(détection des bords, des pages utils, du noms des exercices...)
	 *4-On creer le tableau contenant l'ensemble des donnees (les élèves avec leurs notes)
	 *5-maintenant que le fichier est traiter on peut utilisé Response afin d'en ressortir un fichier JSON et de le return
	 */
	
	//-------------Données en dure :
	//Représente le marquage prédéfini du fichier XLS a modifié en cas de changement de format
	int columnUsername;
	int columnGrade; // Added by EG
	int columnEmail = -1;
	int columnCohorte = -1;
	int columnCertificate = -1;
	// EG: 
	int columnCertificateEligible = -1; // Certificate Eligible
	ArrayList<Integer> columnWeek1 = new ArrayList<Integer>(); // Index of exo Week 1
	ArrayList<Integer> columnWeek2 = new ArrayList<Integer>(); // Index of exo Week 2

	int N = 0; // Nombre d'inscrits
	int Nok = 0; // Nombre d'inscrits dont Certificate Eligible = 'Y'
	int N1 = 0; // Nombre d'inscrits ayant une note semaine 1 > 0
	int N1ok = 0; // Nombre d'inscrits ayant une note semaine 1 > 0 ET Certificate Eligible = 'Y'
	int N2 = 0; // Nombre d'inscrits ayant une note semaine 2 > 0
	int N2ok = 0; // Nombre d'inscrits ayant une note semaine 2 > 0 ET Certificate Eligible = 'Y'
	int[] resTab;
	
	//--------------
	ArrayList<List<CSVRecord>> recordsList;
	ArrayList<Eleve> tabEleves;//Liste de l'ensemble des élèves
	ArrayList<Integer> sheetList;//Liste des différentes pages contenant les données
	Hashtable<Integer, Hashtable<Integer, Integer>> tabHashtable;//List qui pour une semaine données return une Liste avec en clé l'id de l'élève et en attribut ça position dans workbook
	ArrayList<Integer> tabEleveIndex;//Liste contenant tout les id des élèves existants
	ArrayList<String> listColumnName;//Noms des colonnes (Ex : login, td, ...)
	ArrayList<String> listColumnNoteName;//Noms des types de notes du fichier
	ArrayList<Integer> listColumnUtilsName;//Numéro des columns
	Response response;//L'objet response représentant le résultat utile de l'objet
	ArrayList<String> csvListName;
	
	public CsvTraitement(ArrayList<String> paths, ArrayList<String> csvListName){
System.out.println("CsvTraitement.CsvTraitement, csvListName="+csvListName);
		Timer timer = new Timer("Csv Traitement");
		this.csvListName = csvListName;
		try{
			recordsList = SetRecordsList(paths);
			timer.DisplayTimer("Records");
	
			stopWrongFiles();
			
			this.sheetList = GetSheetIndexUtil();
			timer.DisplayTimer("GetSheetIndexUtil");
	
			this.tabHashtable = SetHashTable();
			timer.DisplayTimer("SetHashTable");
	
			this.tabEleveIndex = SetTabEleveIndex();
			timer.DisplayTimer("SetTabEleveIndex");
				
			this.listColumnName = SetListColumnName();
			timer.DisplayTimer("SetListColumnName");

			this.listColumnNoteName = SetListColumnNoteName();
			timer.DisplayTimer("SetListColumnNoteName");

			this.listColumnUtilsName = SetListColumnUtilsName();
			timer.DisplayTimer("SetListColumnUtilsName");
				
			this.tabEleves = SetTabEleve();
			timer.DisplayTimer("SetTabEleve:");
			timer.End();
			
			
			
			List<CSVRecord> sheet = this.recordsList.get(this.recordsList.size()-1); // last sheet.
			resTab = new int[this.listColumnUtilsName.size()];
			
			N = sheet.size();
			for(int line=1; line<sheet.size(); line++) {
				CSVRecord rec = sheet.get(line);
				
				for(int i=0; i<this.listColumnUtilsName.size(); i++) {
					double v = Double.parseDouble(rec.get(this.listColumnUtilsName.get(i)));
					if (v>0) resTab[i]++;
				}
				
				
				
				double noteW1 = 0.0;
				double noteW2 = 0.0;
				boolean certifOK = rec.get(columnCertificateEligible).equals("Y");
				for(int i=0; i<columnWeek1.size(); i++) {
					double note = Double.parseDouble(rec.get(columnWeek1.get(i)));
					if (noteW1 < note) noteW1 = note;
  //~ System.out.println("   note1 "+columnWeek1.get(i)+": ("+rec.get(columnWeek1.get(i))+")"+note+", max "+noteW1);
				}
				for(int i=0; i<columnWeek2.size(); i++) {
					double note = Double.parseDouble(rec.get(columnWeek2.get(i)));
					if (noteW2 < note) noteW2 = note;
  //~ System.out.println("   note2 "+columnWeek2.get(i)+"("+rec.get(columnWeek2.get(i))+"): "+note+", max "+noteW2);
				}
				if (certifOK) Nok++;
				if (noteW1>0.0) N1++;
				if (noteW1>0.0 && noteW2>0.0) N2++;
				if (certifOK && noteW1>0.0) N1ok++;
				if (certifOK && noteW2>0.0) N2ok++;
				
//System.out.println("   "+rec.get(columnUsername)+", note ("+noteW1+", "+noteW2+"), grade:"+rec.get(columnGrade)+", Ns "+Nok+","+N1+","+N2+","+N1ok+","+N2ok);
			}
System.out.println("CertificateEligible: "+Nok+" / inscrit: "+N);
System.out.println("   listColumnUtilsName="+this.listColumnUtilsName+" -> resTab="+Arrays.toString(resTab)+", listColumnNoteName="+this.listColumnNoteName);

		    if(this.response == null){
		    	SetResponse();
		    }		
		}	catch(Exception e){
			System.out.println(e);
			System.out.println(e.getMessage());
			SetResponse(e.getMessage());
		}
	}

	
	
	
	
	
	private void SetResponse(){//Créer la réponse à l'aide des variables créé
		this.response = new Response(this.tabEleves, this.sheetList, this.tabHashtable, this.csvListName);
	}
	private void SetResponse(String errorLog){//Créer la réponse à l'aide du rapport d'erreur
		this.response = new Response(errorLog);
	}
		
	public String GetResponse(){//Return la réponse en JSON
		return this.response.ToJson();
	}
	
	public void SaveResponse(String path){//Sauvegarde la réponse à l'emplacement path
System.out.println("CsvTraitement.SaveResponse path="+path+" & STATS");
		this.response.Save(path);
		
		// EG: save stats...

		try (Writer writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(path+".stats"), "utf-8"))) {
			writer.write("{");
				for(int i=0; i<this.listColumnUtilsName.size(); i++) {
					int idx = this.listColumnUtilsName.get(i);
					writer.write("\""+listColumnName.get(idx)+"\":"+resTab[i]+", ");
				}
			writer.write("\n\"N\":"+N+",\"Nok\":"+Nok+",\"N1\":"+N1+",\"N2\":"+N2+",\"N1ok\":"+N1ok+",\"N2ok\":"+N2ok+"}");
		} catch (Exception e) {
			e.printStackTrace();
		}

		
		
	}
	
	
	private ArrayList<List<CSVRecord>> SetRecordsList(ArrayList<String> pathList) throws Exception{
		/*
		 * Entrée : Liste de path
		 * Sortie : Liste de records
		 */
		ArrayList<List<CSVRecord>> recordsList = new ArrayList<List<CSVRecord>>();
		for(int i = 0; i < pathList.size(); i++){
			try{ //on lit le fichier
				Reader in = new FileReader(pathList.get(i));

				recordsList.add(copyIterator(CSVFormat.EXCEL.parse(in).iterator()));
				in.close();
			} catch(Exception e){
				throw new Exception("Fichier non trouvé");
			}
		}
		return recordsList;
	}
	
	private ArrayList<Integer> GetSheetIndexUtil(){//Return l'ensemble des pages contenants des données.		
		ArrayList<Integer> sheetIndexUtil = new ArrayList<Integer>();
		for(int i = 0; i < this.recordsList.size(); i++){
			sheetIndexUtil.add(i+1);
		}
		return sheetIndexUtil;
	}
	/* --------- PAS REVISER -------------*/

	private Hashtable<Integer, Hashtable<Integer, Integer>> SetHashTable(){//Return le une Hastable<Semaine, <idEleve, positionDansWorkbook> >
		Hashtable<Integer, Hashtable<Integer, Integer>> tabHashtable = new Hashtable<Integer, Hashtable<Integer, Integer>>(this.sheetList.size());
		Hashtable<Integer, Integer> tempHashtable;
		for(int i = 0; i < this.sheetList.size(); i++){
			tempHashtable = new Hashtable<Integer, Integer>();
			for(int j = 1; j < this.recordsList.get(i).size(); j++){
				tempHashtable.put(Integer.parseInt(this.recordsList.get(i).get(j).get(0)), j);
			}
			tabHashtable.put(i, tempHashtable);
		}
		return tabHashtable;
	}
	
	private ArrayList<Integer> SetTabEleveIndex(){//Return la liste de l'ensemble des id élèves
		ArrayList<Integer> finalTabEleveIndex = new ArrayList<Integer>();
		
		
		for(int i = 0; i < this.tabHashtable.size(); i++){
			for(Integer key : this.tabHashtable.get(i).keySet()){
					if(!finalTabEleveIndex.contains(key)){
						finalTabEleveIndex.add(key);
//System.out.println("CsvTraitement.SetTabEleveIndex, i:"+i+", key:"+key);
					}
			}
		}		
		return finalTabEleveIndex;
	}
	
	private ArrayList<Eleve> SetTabEleve(){//return le tableau contenant l'ensemble des élèves
		ArrayList<Eleve> finalTabEleve = new ArrayList<Eleve>();
			for(int i = 0; i < tabEleveIndex.size(); i++){
				finalTabEleve.add(SetEleve(tabEleveIndex.get(i)));
			}
		return finalTabEleve;
	}
	
	private void stopWrongFiles(){
System.out.println("CsvTraitement.stopWrongFiles, size="+this.recordsList.size());
		CSVRecord lastColumn = this.recordsList.get(this.recordsList.size()-1).get(0);
		System.out.println(lastColumn.toString());
		for(int i = this.recordsList.size()-2 ; i>=0 ; i--){
			if(this.recordsList.get(i).size() != 0){
				CSVRecord checkedColumn = this.recordsList.get(i).get(0);
				System.out.println(checkedColumn.toString());
				//if(!lastColumn.toString().equals(checkedColumn.toString())){
				if(lastColumn.size() != checkedColumn.size()){
					this.recordsList.subList(0, i+1).clear();
					this.csvListName.subList(0, i+1).clear();
					return;
				}
			}
		}
		
		
	}
	
	private ArrayList<String> SetListColumnName(){//return le tableau contenant l'ensemble des noms des colonnes
		ArrayList<String> finalListColumnName = new ArrayList<String>();
		CSVRecord columnName = this.recordsList.get(0).get(0);
		String actualColumn;
		for(int i = 0; i < columnName.size(); i++){
			actualColumn = columnName.get(i);
			finalListColumnName.add(actualColumn);
			if(finalListColumnName.get(i).equals("username") || finalListColumnName.get(i).equals("Username")){
				this.columnUsername = i;
			}
			if(finalListColumnName.get(i).equals("email") || finalListColumnName.get(i).equals("Email")){
				this.columnEmail = i;
			}
			if(finalListColumnName.get(i).equals("Cohort Name")){
				this.columnCohorte = i;
			}
			if(finalListColumnName.get(i).equals("Verification Status")){
				this.columnCertificate = i;
			}
			// EG: add 'Certificate Eligible'
			if(finalListColumnName.get(i).equals("Certificate Eligible")){
				this.columnCertificateEligible = i;
			}
			
			
		}
System.out.println("CsvTraitement.SetListColumnName, columnUsername:"+this.columnUsername+", columnCohorte:"+this.columnCohorte);
		return finalListColumnName;
	}
	
	private ArrayList<String> SetListColumnNoteName(){
		ArrayList<String> finalListColumnNoteName = new ArrayList<String>();
		
		for(int i = 0; i < this.listColumnName.size(); i++){
			if(listColumnName.get(i).indexOf("Avg") != -1){
				finalListColumnNoteName.add(listColumnName.get(i).substring(0, listColumnName.get(i).length()-4));
System.out.println("CsvTraitement.SetListColumnNoteName, add "+listColumnName.get(i).substring(0, listColumnName.get(i).length()-4)); // QCM, TP
			}
		}
		
		return finalListColumnNoteName;
	}
	
	private ArrayList<Integer> SetListColumnUtilsName(){		
		ArrayList<Integer> listUtilsName = new ArrayList<Integer>();
		
		boolean hasStarted = false;
		for(int i = 0; i < this.listColumnName.size(); i++){
			String colName = listColumnName.get(i);
			if(hasStarted){
				if(colName.indexOf("Enrollment Track") != -1){
					break;
				}
				if(colName.indexOf("Avg") == -1 && colName.indexOf("Cohort Name") == -1){
					listUtilsName.add(i);
System.out.println("CsvTraitement.SetListColumnUtilsName, add "+i+": "+colName); // 2(grade),3,4,5,6(QCM), 8,9,10(TP)
					// Check if this is exo/TP/QZ "1"
					if (colName.indexOf("1") > 0) {
						columnWeek1.add(i);
					}
					if (colName.indexOf("2") > 0) {
						columnWeek2.add(i);
					}
				}
			}	else	{
				if(colName.equalsIgnoreCase("grade")){
				//if(listColumnName.get(i).equals("grade") || listColumnName.get(i).equals("Grade")){
					hasStarted = true;
					listUtilsName.add(i);
					columnGrade = i;
System.out.println("CsvTraitement.SetListColumnUtilsName,, add "+i+": "+colName); // QCM, TP
				}
			}
		}
System.out.println("CsvTraitement.SetListColumnUtilsName, columnWeek1 "+columnWeek1+", columnWeek2 "+columnWeek2+", listUtilsName "+listUtilsName);
		return listUtilsName;
	}
	
	private int getFirstColumnContain(String text){//return la première colonne contenant text
		for(int i = 0; i < this.listColumnName.size(); i++){
			if(this.listColumnName.get(i).indexOf(text) != -1){
				return i;
			}
		}
		return -1;
	}
	
	private int getLastColumnContain(String text){//return la dernière colonne contenant text
		for(int i = this.listColumnName.size()-1; i>=0; i--){
			if(listColumnName.get(i).indexOf(text) != -1){
				return i-1;
			}
		}
		return -1;
	}
	
	private Eleve SetEleve(int newId){
		/*
		 * Retourne à partir d'un idEleve un objet élèves
		 * Cet Eleve contient des notes qui sont obtenu en cherchant dans le workbook
		 */
	    int id = newId;
	    String login = "-1";
	    String email = "-1";
	    String cohorte = "Default Group";
	    ArrayList<Note> tabNotes = new ArrayList<Note>();
	    int semaineInscription = -1;
	    String typeNote;
	    List<CSVRecord> actualSheet;
	    CSVRecord actualRow;
	    int tempRow;
	    double tempNote;
	    int tempTabNotesSize;
	    
        int firstColumnContain;
        int lastColumnContain;
        int actualColumnContain;
        
        

               
	        for (int i = 0; i<sheetList.size(); i++) {
	        	if(tabHashtable.get(i).containsKey(newId)){
	        		tempRow = tabHashtable.get(i).get(newId);
	        		actualSheet = this.recordsList.get(i);
	        		actualRow = actualSheet.get(tempRow);

	        		if(semaineInscription == -1){
	        			semaineInscription = i+1;
		        		login = actualRow.get(this.columnUsername);
		        		if(this.columnEmail != -1){
			        		email = actualRow.get(this.columnEmail);
		        		}	else	{
			        		email = "Unknown";
		        		}
		        	}
		        	if(this.columnCohorte != -1 && !actualRow.get(this.columnCohorte).equals("")){
			        	cohorte = actualRow.get(this.columnCohorte);
		        	}
		        	if(this.columnCertificate != -1 && actualRow.get(this.columnCertificate).equals("ID Verified") && cohorte.equals("Default Group")){
			        	cohorte = "Certificate";
		        	}
		        	
	    	        for(int j = 0; j < this.listColumnUtilsName.size(); j++){
	    	        	if(tabNotes.size() < this.listColumnUtilsName.size()){
							String nom = listColumnName.get(this.listColumnUtilsName.get(j));
							tabNotes.add(new Note(nom, 0, -1));
	    	        	}
	    	        	if(actualRow.get(this.listColumnUtilsName.get(j)).equals("Not Attempted") || actualRow.get(this.listColumnUtilsName.get(j)).equals("Not Available")){
		    	        	tempNote = 0;
	    	        	}	else	{
		    	        	//System.out.println(actualRow.get(this.listColumnUtilsName.get(j)));
		    	        	tempNote = Double.parseDouble(actualRow.get(this.listColumnUtilsName.get(j)));
	    	        	}
	                    if (tabNotes.get(j).GetNote() != tempNote) {
	                        tabNotes.get(j).SetNote(tempNote);
	                        tabNotes.get(j).SetSemaine(i+1);
	                    }
	    	        }
	    	        
	        	}
	        }
//System.out.println("CsvTraitement.SetEleve id="+id+", login="+login+", email="+email+", semaineInscription="+semaineInscription+", tabNotes=..."+", cohorte="+cohorte);
	    return new Eleve(id, login, email, semaineInscription, tabNotes, cohorte);
	}
	
	public static <T> List<T> copyIterator(Iterator<T> iter) {
	    List<T> copy = new ArrayList<T>();
	    while (iter.hasNext())
	        copy.add(iter.next());
	    return copy;
	}

}
