package org.moocpilot;
import java.io.BufferedWriter;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Hashtable;

import com.google.gson.Gson;


public class Response {
	/*
	 * Class permettant de g�rer la r�ponse � renvoyer aux clients
	 * Elle rassemble les variables n�cessaires au client
	 * Et permet de les retourner sous forme de JSON
	 * Elle peut aussi stocker une erreur server qui prendra la place des donn�es
	 */
	boolean error;//si le fichier est un fichier d'erreur
	ArrayList<Eleve> tabEleves;
	ArrayList<Integer> sheetList;
	Hashtable<Integer, Hashtable<Integer, Integer>> tabHashtable;
	ArrayList<String> csvListName;
	String errorLog;//Le log d'erreur
	
	public Response(ArrayList<Eleve> tabEleves,	ArrayList<Integer> sheetList, Hashtable<Integer, Hashtable<Integer, Integer>> tabHashtable, ArrayList<String> csvListName){
		//Constructeur d'un rapport contenant les donn�es trait�es
		this.error = false;
		this.tabEleves = tabEleves;
		this.sheetList = sheetList;
		this.tabHashtable = tabHashtable;
		this.csvListName = csvListName;
	}
	
	public Response(String errorLog){//Constructeur d'un rapport d'erreur
		this.error = true;
		this.errorLog = errorLog;
	}
	
	public String ToJson(){//Return this sous forme de JSON
		Gson gsonWorker = new Gson();
		String extracted = gsonWorker.toJson(this);
		return extracted;
	}
	
	public void Save(String path){//Sauvegarde le JSON � l'emplacement Path
		try (Writer writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(path), "utf-8"))) {
			writer.write(this.ToJson());
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
