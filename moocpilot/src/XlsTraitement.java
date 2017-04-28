import java.io.InputStream;
import java.util.ArrayList;
import java.util.Hashtable;

import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;

public class XlsTraitement {
	/*Class permettant le traitement du fichier xls
	 *1-Lis le fichier
	 *2-Utilise POI pour le transformer en objet java
	 *3-Lis l'objet java afin de repérer des élèments significatif du fichier(détection des bords, des pages utils, du noms des exercices...)
	 *4-On creer le tableau contenant l'ensemble des donnees (les élèves avec leurs notes)
	 *5-maintenant que le fichier est traiter on peut utilisé Response afin d'en ressortir un fichier JSON et de le return
	 */
	
	//-------------Données en dure :
	//Représente le marquage prédéfini du fichier XLS a modifié en cas de changement de format

	int indexEntete;
	int columnUsername;
	int columnEmail;
	int columnCohorte;

	//--------------
	HSSFWorkbook workbook;//Objet obtenu par POI
	ArrayList<Eleve> tabEleves;//Liste de l'ensemble des élèves
	ArrayList<Integer> sheetList;//Liste des différentes pages contenant les données
	Hashtable<Integer, Hashtable<Integer, Integer>> tabHashtable;//List qui pour une semaine données return une Liste avec en clé l'id de l'élève et en attribut ça position dans workbook
	ArrayList<Integer> tabEleveIndex;//Liste contenant tout les id des élèves existants
	ArrayList<String> listColumnName;//Noms des colonnes (Ex : login, td, ...)
	ArrayList<String> listColumnNoteName;//Noms des types de notes du fichier
	Response response;//L'objet response représentant le résultat utile de l'objet
	
	/*public XlsTraitement(String path) throws IOException{
		/*
		 * !!!!!!!!A mettre à jour à l'aide de l'autre constructeur avant utilisation
		 * Lecture d'un fichier en local pour traitement
		 * 
		 */
	/*
	    FileInputStream file = new FileInputStream(new File(path));
	      System.out.println("Time InputStream:"+ new Date().toString());

	    //Get the workbook instance for XLS file 
		this.workbook = new HSSFWorkbook(file);
	      System.out.println("Time SetWorkbook:"+ new Date().toString());

		this.sheetList = GetSheetIndexUtil();
	      System.out.println("Time GetSheetIndexUtil:"+ new Date().toString());

		this.tabHashtable = SetHashTable();
	      System.out.println("Time SetHashTable:"+ new Date().toString());

		this.tabEleveIndex = SetTabEleveIndex();
	      System.out.println("Time SetTabEleveIndex:"+ new Date().toString());

		this.listColumnName = SetListColumnName();
	      System.out.println("Time SetListColumnName:"+ new Date().toString());

		this.tabEleves = SetTabEleve();
	      System.out.println("Time SetTabEleve:"+ new Date().toString());
		if(this.response == null){
			 SetResponse();
		}
	}*/
	
	
	public XlsTraitement(InputStream downloadedFile){
		Timer timer = new Timer("Xls Traitement");
		try{
			InputStream file;
			try{ //on lit le fichier
			    file = downloadedFile;
			} catch(Exception e){
				throw new Exception("Fichier non reçu");
			}
			timer.DisplayTimer("InputStream");
			
			try{
				this.workbook = new HSSFWorkbook(file);
			} catch(Exception e){
				throw new Exception("Fichier non conforme aux normes XLS");
			}
			timer.DisplayTimer("SetWorkbook");
	
			setIndexEntete();
			timer.DisplayTimer("SetIndexEntete");
			
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
	
			this.tabEleves = SetTabEleve();
			timer.DisplayTimer("SetTabEleve:");
			timer.End();

		    if(this.response == null){
		    	SetResponse();
		    }		
		}	catch(Exception e){
			System.out.println(e.toString());
			SetResponse(e.getMessage());
		}
	}
	
	private void SetResponse(){//Créer la réponse à l'aide des variables créé
		//this.response = new Response(this.tabEleves, this.sheetList, this.tabHashtable);
	}
	private void SetResponse(String errorLog){//Créer la réponse à l'aide du rapport d'erreur
		this.response = new Response(errorLog);
	}
		
	public String GetResponse(){//Return la réponse en JSON
		return this.response.ToJson();
	}
	
	public void SaveResponse(String path){//Sauvegarde la réponse à l'emplacement path
		this.response.Save(path);
	}
	
	private void setIndexEntete(){
		Sheet actualSheet = null;
		for(int i = 0; i<this.workbook.getNumberOfSheets(); i++){
			actualSheet = this.workbook.getSheetAt(i);
			if(actualSheet.getSheetName().substring(0, 1).equals("S")){
				try{
					Integer.parseInt(actualSheet.getSheetName().substring(1));
					break;
				} catch (NumberFormatException e) {
				}
			}
		}
		for(int i = 0; i<=actualSheet.getLastRowNum(); i++){
			if(GetStringFromCell(actualSheet.getRow(i).getCell(0)).equals("id")){
				this.indexEntete = i;
			}
		}
	}
	
	private ArrayList<Integer> GetSheetIndexUtil(){//Return l'ensemble des pages contenants des données.
		ArrayList<Integer> sheetIndexUtil = new ArrayList<Integer>();
		Sheet actualSheet;
		for(int i = 0; i<this.workbook.getNumberOfSheets(); i++){
			actualSheet = this.workbook.getSheetAt(i);
			if(actualSheet.getLastRowNum() > indexEntete && actualSheet.getRow(indexEntete).getCell(0) != null && (actualSheet.getRow(indexEntete).getCell(0).getCellType() == Cell.CELL_TYPE_STRING ||  (actualSheet.getRow(indexEntete).getCell(0).getCellType() == Cell.CELL_TYPE_FORMULA && actualSheet.getRow(indexEntete).getCell(0).getCachedFormulaResultType() == Cell.CELL_TYPE_STRING)) && actualSheet.getRow(indexEntete).getCell(0).getStringCellValue().equals("id")){
				sheetIndexUtil.add(i);
			}
		}
		
		return sheetIndexUtil;
	}
	
	private Hashtable<Integer, Hashtable<Integer, Integer>> SetHashTable(){//Return le une Hastable<Semaine, <idEleve, positionDansWorkbook> >
		Hashtable<Integer, Hashtable<Integer, Integer>> tabHashtable = new Hashtable<Integer, Hashtable<Integer, Integer>>(this.sheetList.size());
		Hashtable<Integer, Integer> tempHashtable;
		for(int i = 0; i < this.sheetList.size(); i++){
			tempHashtable = new Hashtable<Integer, Integer>();
			for(int j = indexEntete+1; j <= this.workbook.getSheetAt(sheetList.get(i)).getLastRowNum(); j++){
				tempHashtable.put((int)this.workbook.getSheetAt(sheetList.get(i)).getRow(j).getCell(0).getNumericCellValue(), j);
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
	
	private ArrayList<String> SetListColumnName(){//return le tableau contenant l'ensemble des noms des colonnes
		ArrayList<String> finalListColumnName = new ArrayList<String>();
		HSSFRow columnNameRow = this.workbook.getSheetAt(sheetList.get(0)).getRow(indexEntete);
		for(int i = 0; i < columnNameRow.getLastCellNum(); i++){
			if(GetStringFromCell(columnNameRow.getCell(i)).equals("")){
				break;
			}
			finalListColumnName.add(GetStringFromCell(columnNameRow.getCell(i)));
			if(finalListColumnName.get(i).equals("username")){
				
				this.columnUsername = i;
			}
			if(finalListColumnName.get(i).equals("email")){
				this.columnEmail = i;
			}
			if(finalListColumnName.get(i).equals("Cohort Name")){
				this.columnCohorte = i;
			}
		}
		return finalListColumnName;
	}
	
	private ArrayList<String> SetListColumnNoteName(){
		ArrayList<String> finalListColumnNoteName = new ArrayList<String>();
		
		for(int i = 0; i < this.listColumnName.size(); i++){
			if(listColumnName.get(i).indexOf("Avg") != -1){
				finalListColumnNoteName.add(listColumnName.get(i).substring(0, listColumnName.get(i).length()-4));
			}
		}
		
		return finalListColumnNoteName;
	}
	
	private int getFirstColumnContain(String text){//return la première colonne contenant text
		for(int i = 0; i < this.listColumnName.size(); i++){
			if(listColumnName.get(i).indexOf(text) != -1){
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
	
	private String GetStringFromCell(Cell cell){//return un string quelque soit le type de la cell
		String stringValue;
		if(cell == null){
			return "";
		}
        switch (cell.getCellType()) {
	        case Cell.CELL_TYPE_STRING:
	        	stringValue = cell.getStringCellValue();
	            break;
	        case Cell.CELL_TYPE_NUMERIC:
	        	stringValue = String.valueOf(cell.getNumericCellValue());
	            break;
	        case Cell.CELL_TYPE_BOOLEAN:
	        	stringValue = cell.getBooleanCellValue()? "true" : "false";
	            break;
	        case Cell.CELL_TYPE_FORMULA:
	        	if(cell.getCachedFormulaResultType() == Cell.CELL_TYPE_STRING){
	        		stringValue = cell.getStringCellValue();
        		}	else	{
        			stringValue = String.valueOf(cell.getNumericCellValue());
	        	}
	            break;
	        default:
	        	stringValue = "";
        }
        return stringValue;
	}
	
	private Eleve SetEleve(int newId){
		/*
		 * Retourne à partir d'un idEleve un objet élèves
		 * Cet Eleve contient des notes qui sont obtenu en cherchant dans le workbook
		 */
	    int id = newId;
	    String login = "-1";
	    String email = "-1";
	    String cohorte = "Unknown";
	    ArrayList<Note> tabNotes = new ArrayList<Note>();
	    int semaineInscription = -1;
	    String typeNote;
	    Sheet actualSheet;
	    Row actualRow;
	    int tempRow;
	    double tempNote;
	    int tempTabNotesSize;
	    
        int firstColumnContain;
        int lastColumnContain;
        int actualColumnContain;
	    for (int k = 0; k < this.listColumnNoteName.size(); k++) {
	    	typeNote = this.listColumnNoteName.get(k);
	        firstColumnContain = getFirstColumnContain(typeNote);
	        lastColumnContain = getLastColumnContain(typeNote);
	        tempTabNotesSize = tabNotes.size();
	        
	        
	        for (int i = 0; i<sheetList.size(); i++) {
	        	if(tabHashtable.get(i).containsKey(newId)){
	        		tempRow = tabHashtable.get(i).get(newId);
	        		actualSheet = this.workbook.getSheetAt(sheetList.get(i));
	        		actualRow = actualSheet.getRow(tempRow);

	        		if(semaineInscription == -1){
	        			semaineInscription = i+1;
		        		login = GetStringFromCell(actualRow.getCell(this.columnUsername));
		        		if(this.columnEmail != 0){
			        		email = GetStringFromCell(actualRow.getCell(this.columnEmail));
		        		}	else	{
			        		email = "Unknown";
		        		}
	        		}
	        		if(!GetStringFromCell(actualRow.getCell(this.columnCohorte)).equals("")){
		        		cohorte = GetStringFromCell(actualRow.getCell(this.columnCohorte));
	        		}
	        		for(actualColumnContain = firstColumnContain; actualColumnContain <= lastColumnContain; actualColumnContain++){
	    	        	if(tabNotes.size() <= actualColumnContain-firstColumnContain+tempTabNotesSize){
							String nom = listColumnName.get(actualColumnContain);
							tabNotes.add(new Note(nom, 0, -1));
	    	        	}
	    	        	tempNote = actualRow.getCell(actualColumnContain).getNumericCellValue();
	                    if (tabNotes.get(actualColumnContain-firstColumnContain+tempTabNotesSize).GetNote() != tempNote) {
	                        tabNotes.get(actualColumnContain-firstColumnContain+tempTabNotesSize).SetNote(tempNote);
	                        tabNotes.get(actualColumnContain-firstColumnContain+tempTabNotesSize).SetSemaine(i+1);
	                    }
	    	        }
	    	        
	        	}
	        }
	    }
	    return new Eleve(id, login, email, semaineInscription, tabNotes, cohorte);
	}
}
