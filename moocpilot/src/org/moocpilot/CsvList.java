package org.moocpilot;
import com.google.gson.Gson;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;

public class CsvList {
	ArrayList<Course> listCourse; // What will be in csvList.json
	String path;
	public CsvList(String path) throws JsonSyntaxException, JsonIOException, FileNotFoundException{
System.out.println("CsvList.CsvList, path="+path);
		
		// EG: create file if not exist
		File f = new File(path+"/csvList.json");
		if(!f.exists()) { // create
			try{
			FileWriter fw = new FileWriter(f);
			fw.write("[]".toCharArray(), 0, 2);
			fw.close();
			//Files.write(f, "[]");
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		

	    Gson gson = new Gson();
	    this.listCourse = new ArrayList<Course>(Arrays.asList(gson.fromJson(new FileReader(path+"/csvList.json"), Course[].class)));
	    this.path = path;
//System.out.println("CsvList done " +path);
	}
	
	public void addCourse(String courseId){
System.out.println("CsvList.addCourse: "+courseId);
		this.listCourse.add(new Course(courseId));
	}
	public void addWeek(String courseId, int week, String weekName){
System.out.println("CsvList.addWeek: "+courseId);
		Course actualCourse = getCourse(courseId);
		if(actualCourse == null){
			addCourse(courseId);
			actualCourse = this.listCourse.get(this.listCourse.size()-1);
		}
		actualCourse.addWeek(weekName);
	}
	
	public void removeWeek(String courseId, int week){
		Course actualCourse = getCourse(courseId);
		if(actualCourse != null){
			actualCourse.removeWeek(week, this.path);
		}
	}
	
	public void moveWeek(String courseId, int week, boolean positive){
		Course actualCourse = getCourse(courseId);
		if(actualCourse != null){
			actualCourse.moveWeek(week, positive);
		}
	}
	
	private Course getCourse(String courseId){
	    for(Course course : listCourse) {
	        if(course.getCourseId().equals(courseId)) {
	            return course;
	        }
	    }
	    return null;
	}
	
	public void changeWeekName(String courseId, int week, String newName){
		Course actualCourse = getCourse(courseId);
		if(actualCourse != null){
			actualCourse.changeName(week, newName);
		}
	}
	
	public void changeWeekIsActive(String courseId, int week, boolean newState){
		Course actualCourse = getCourse(courseId);
		if(actualCourse != null){
			actualCourse.changeIsActive(week, newState);
		}
	}	
		
	public ArrayList<String> getPathCourse(String courseId, ArrayList<String> csvListName){
		ArrayList<String> paths;
		Course actualCourse = getCourse(courseId);
		if(actualCourse == null){
			return null;
		}
		paths = actualCourse.ToString(this.path, csvListName);		
		return paths;
	}
	
	public void save(){//Sauvegarde le JSON à l'emplacement Path
		Gson gsonWorker = new Gson();
		String listCourseStringified = gsonWorker.toJson(this.listCourse);
		try (Writer writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(this.path+"/csvList.json"), "utf-8"))) {
			writer.write(listCourseStringified);
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public boolean nameExist(String courseId, String weekName) {
		Course actualCourse = getCourse(courseId);
		return actualCourse.nameExist(weekName);
	}
}

class Course
{
	String courseId;
	ArrayList<Week> weekList;
	public Course(String courseId){
		this.courseId = courseId;
		this.weekList = new ArrayList<Week>();
	}
	
	public boolean nameExist(String weekName) {		
		for(int i = 0; i < this.weekList.size(); i++){
			if(this.weekList.get(i).name.equals(weekName)){
				return true;
			}
		}
		return false;
	}
	/*
	public void addWeek(int week){
		if(!this.weekList.contains(week)){
			this.weekList.add(week);
		}
	}*/
	
	public void addWeek(String weekName){
		this.weekList.add(new Week(this.weekList.size(), weekName));
		ordonWeeks();
	}
	
	public void ordonWeeks(){
		ArrayList<Week> ordenedWeeks = new ArrayList<Week>(this.weekList);
		Collections.sort(ordenedWeeks, new Comparator<Week>(){
		    public int compare(Week s1, Week s2) {
		    	return s1.name.compareTo(s2.name);
		    }
		});
		for(int i = 0; i < ordenedWeeks.size(); i++){
			this.weekList.get(ordenedWeeks.get(i).getId()).pos = i;
		}
		
	}
	
	public void removeWeek(int week, String path){
		if(week == this.weekList.size()-1){//si c'est le dernier élement
			int deletedPos = this.weekList.get(week).pos;
			this.weekList.remove(week);
			this.removeFile(path+"/0-"+ week + ".csv");
			for(int i = 0; i < this.weekList.size(); i++){
				if(this.weekList.get(i).pos > deletedPos){
					this.weekList.get(i).pos--;
				}
			}
		}	else	{
			int deletedPos = this.weekList.get(week).pos;
			for(int i = 0; i < this.weekList.size(); i++){
				if(week == i){
					this.weekList.remove(week);//need to remove le fichier csv aussi
					this.removeFile(path+"/0-"+ i + ".csv");
				}
				if(week <= i){
					this.weekList.get(i).changeIdRemove();
					try {
						this.renameFile("0-"+ i + ".csv", path+"/0-"+ (i+1) + ".csv");
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
				if(this.weekList.get(i).pos > deletedPos){
					this.weekList.get(i).pos--;
				}
			}
		}
	}
	
	private void removeFile(String path){
		File file = new File(path);
		file.delete();
	}
	
	private void renameFile(String newName, String path) throws IOException{
		
		Path source = Paths.get(path);
		Files.move(source, source.resolveSibling(newName));
	}
	
	public void changeName(int week, String newName){
		this.weekList.get(week).changeName(newName);
	}
	
	public void changeIsActive(int week, boolean newState){
		this.weekList.get(week).changeIsActive(newState);
	}
	
	public void moveWeek(int week, boolean positive){
		int originalPos = this.weekList.get(week).pos;
		int cibledChangedPos;
		if(positive){
			if(this.weekList.size()-1 <= originalPos){
				return;
			}
			cibledChangedPos = this.weekList.get(week).pos+1;
		}	else	{
			if(0 >= originalPos){
				return;
			}
			cibledChangedPos = this.weekList.get(week).pos-1;
		}

		for(int i = 0; i < this.weekList.size(); i++){
			if(this.weekList.get(i).pos == originalPos){
				this.weekList.get(i).pos = cibledChangedPos;
			}	else	if(this.weekList.get(i).pos == cibledChangedPos){
				this.weekList.get(i).pos = originalPos;
			}
		}

		/*
		if(positive){
			if(week<this.weekList.size()){
				for(int i = 0; i < this.weekList.size(); i++){
					if(this.weekList.get(i).pos == this.weekList.get(week).pos){
						this.weekList.get(i).pos++;
					}	else	if(this.weekList.get(i).pos == this.weekList.get(week).pos +1){
						this.weekList.get(i).pos--;
					}
				}
			}
		}	else	{
			if(week>0){
				for(int i = 0; i < this.weekList.size(); i++){
					if(this.weekList.get(i).pos == this.weekList.get(week).pos){
						this.weekList.get(i).pos--;
					}	else	if(this.weekList.get(i).pos == this.weekList.get(week).pos - 1){
						this.weekList.get(i).pos++;
					}
				}
			}
		}*/
	}
	/*
	public void moveWeek(int originWeek, int finalWeek){//ne marche pas
		ArrayList<Integer> newWeekList = new ArrayList<Integer>();
		if(this.weekList.contains(originWeek) && this.weekList.contains(finalWeek)){
			for(int i = 0; i <= this.weekList.size(); i++){
				if(i == originWeek){
					this.weekList.add(this.weekList.get(finalWeek));
				}	else	if(i == finalWeek){
					this.weekList.add(this.weekList.get(originWeek));
				}	else	{
					this.weekList.add(this.weekList.get(i));
				}
			}
		}
	}*/
	
	public String getCourseId(){
		return this.courseId;
	}
	
	public ArrayList<String> ToString(String path, ArrayList<String> csvListName){
		ArrayList<String> strWeeks = new ArrayList<String>();

		
		ArrayList<Week> ordenedWeeks = new ArrayList<Week>(this.weekList);
		Collections.sort(ordenedWeeks, new Comparator<Week>(){
		    public int compare(Week s1, Week s2) {
		        return Integer.compare(s1.getPos(),s2.getPos());
		    }
		});
				
		for(int i = 0; i<ordenedWeeks.size(); i++){
			if(ordenedWeeks.get(i).getIsActive()){
				strWeeks.add(path+"/"+this.courseId+"-"+ordenedWeeks.get(i).getId()+".csv");
				csvListName.add(ordenedWeeks.get(i).name);
			}
		}

	    return strWeeks;
	}
}

class Week{
	int id;
	int pos;
	String name;
	boolean isActive;
	public Week(int id, String name){
		this.id = id;
		this.pos = id;
		this.name = name;
		this.isActive = true;
	}
	
	public void changeId(int id){
		this.id = id;
	}
	
	public void changeIdRemove(){
		this.id--;
	}
	
	public int getId(){
		return this.id;
	}
	
	public void changePos(int pos){
		this.pos = pos;
	}	
	public int getPos(){
		return this.pos;
	}
	
	public void changeIsActive(boolean isActive){
		this.isActive = isActive;
	}	
	public boolean getIsActive(){
		return this.isActive;
	}

	public void changeName(String name){
		this.name = name;
	}
}

