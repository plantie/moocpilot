package org.moocpilot;


import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.ObjectInputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.lang.ProcessBuilder.Redirect;
import java.util.ArrayList;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class FunCsvGetter
 *
 * EG: updated location of files:
 * /ShellScripts/password.txt -> /data/password.txt
 */
@WebServlet("/FunCsvGetter")
@MultipartConfig

public class FunCsvGetter extends HttpServlet {
	private static final long serialVersionUID = 1L;
	public static String userName;
	public static String userPassword;
	public static String instituteName;
	public static String courseId;
	public static String sessionName;
	public static boolean isEdx;
	public static boolean isFunUpdated;//
	
	public static String localPath = null;
	public static String MOD = "/../../ShellScripts";

    /**
     * @see HttpServlet#HttpServlet()
     */
    public FunCsvGetter() {
        super();
    }
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
    
    
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String moocId = request.getParameter("moocId"); 
System.out.println("FunCsvGetter.doPost, moocId="+moocId);
		String contextPath = getServletContext().getRealPath("/data/"+moocId);
	    if (localPath==null) {
		// EG: get local path used in all functions
		localPath = getServletContext().getRealPath("/");
		System.out.println("*** FunCsvGetter: localPath="+localPath);
	    }
		
	    if(!Connect.isCookieTrue(request.getCookies(), getServletContext().getRealPath("/data/password.txt"))){
	    //if(!Connect.isCookieTrue(request.getCookies(), getServletContext().getRealPath("/ShellScripts/password.txt"))){
	    	return;
	    }
	    response.setContentType("application/javascript");

		java.util.Scanner s = new java.util.Scanner(request.getPart("startDay").getInputStream()).useDelimiter("\\A");
	    Date startDay = new Date(Long.parseLong(s.hasNext() ? s.next() : ""));
		
		java.util.Scanner s1 = new java.util.Scanner(request.getPart("delay").getInputStream()).useDelimiter("\\A");
	    int delayIndex = Integer.parseInt(s1.hasNext() ? s1.next() : "");
		long delay = 0;
        switch (delayIndex) {
        case 0:  delay = 7;
        			break;
        case 1:  delay = 14;
			        break;
        case 2:  delay = 28;
        			break;
        default: 
        	delay = -1;
        	break;
	    }	    
        if(delay == -1){
        	return;
        }
        startDay.setTime(startDay.getTime() + (long)(Math.random() * 1800000));
        
	    automaticCollect(startDay, delay, contextPath, moocId);
	}
	
	private void automaticCollect(Date startDay, long delay, String contextPath, String moocId){
		ShellScriptTaskListener shellScriptTaskListener = new ShellScriptTaskListener();
		shellScriptTaskListener.addTimerTask(0, startDay, delay, moocId);
		shellScriptTaskListener.addTimerTask(1, new Date(startDay.getTime() + (1000 * 60 * 60 * 6)), delay, moocId);//30000
	}
	
	private static boolean setUserParameters(String path){//TESTED
System.out.println("FunCsvGetter setUserParameters, path="+path);
		FunUserParameters funUserParameters;
		try {
			FileInputStream fin = new FileInputStream(path + ""+"/funUserParameters.ser");
			//FileInputStream fin = new FileInputStream(path + "/funUserParameters.ser");
			ObjectInputStream ois = new ObjectInputStream(fin);
			funUserParameters = (FunUserParameters) ois.readObject();
		} catch (ClassNotFoundException | IOException e) {
			System.out.println("setUserParameters ERROR");
			return false;
		}
		userName = funUserParameters.userName;
		userPassword = funUserParameters.userPassword;
		instituteName = funUserParameters.instituteName;
		courseId = funUserParameters.courseId;
		sessionName = funUserParameters.sessionName;
		isEdx = funUserParameters.isEdx;
		isFunUpdated = funUserParameters.isFunUpdated;
System.out.println("	setUserParameters OK, userName="+userName);
		return true;
	}
	
	public static void startCollect(String contextShellScriptsPath) throws IOException{
System.out.println("FunCsvGetter startCollect, contextShellScriptsPath="+contextShellScriptsPath);
		if(!setUserParameters(contextShellScriptsPath)){
			return;
		}
		

	    
	    String cibledFile;
		String path;
	    if(!isEdx){
		    unlockPermission("/generate-grade-report.sh", contextShellScriptsPath+MOD);
		    if(!isFunUpdated){
		    	cibledFile = "https://www.fun-mooc.fr/courses/"+instituteName+"/"+courseId+"/"+sessionName;
		    }	else	{
			    cibledFile = "https://www.fun-mooc.fr/courses/course-v1:"+instituteName+"+"+courseId+"+"+sessionName;
		    }
			path = contextShellScriptsPath+MOD + "/generate-grade-report.sh";
	    }	else	{
		    unlockPermission("/edx-generate-grade-report.sh", contextShellScriptsPath+MOD);
		    cibledFile = "https://courses.edx.org/courses/"+"course-v1:IMTx+NET01x+1T2017";
			path = contextShellScriptsPath+MOD + "/edx-generate-grade-report.sh";
	    }
		
		ProcessBuilder pb = new ProcessBuilder(path, userName, userPassword, cibledFile);
		pb.redirectError(Redirect.INHERIT);
		pb.start();
	}
	
	private static boolean extractFile(String cibledFile, String contextShellScriptsPath) throws IOException{
System.out.println("FunCsvGetter extractFile "+cibledFile+", "+contextShellScriptsPath+", localPath="+localPath);
		
		if(!setUserParameters(contextShellScriptsPath)){
			return false;
		}
	
	    String contextPath = contextShellScriptsPath;
	    //String contextPath = contextShellScriptsPath.substring(0, contextShellScriptsPath.length()- 12) + "Csv";
	    		//getServletContext().getRealPath("/Csv");
	    String csvListPath = contextPath;
		
	    CsvList csvList = new CsvList(csvListPath);
	    int index;
	    if(csvList.listCourse.size() == 0){
	    	index = 0;
	    }	else	{
		    index = csvList.listCourse.get(0).weekList.size();
	    }
	    
	    String filePath = contextPath + "/0-"+index+".csv";
	    String cibledFileName;
	    if(!isEdx){
		    cibledFileName = cibledFile.substring(cibledFile.lastIndexOf("/")+1);
	    }	else	{
		    cibledFileName = cibledFile.substring(cibledFile.indexOf(sessionName.substring(sessionName.indexOf(":")+1).replace("+", "_")), cibledFile.indexOf(".csv")+4);
	    }
	    if(csvList.listCourse.size() != 0 && csvList.nameExist("0", cibledFileName)){
	    	return false;
	    }
	    csvList.addWeek("0", index, cibledFileName);
	    csvList.save();
		System.out.println("extractFile "+cibledFile+", "+contextShellScriptsPath);
	    	    
		File output = new File(filePath);

	    String path;
	    ProcessBuilder pb;
	    
	    if(!isEdx){
		    unlockPermission("/extract-grade-report.sh", contextShellScriptsPath+MOD);
			path = contextShellScriptsPath+MOD + "/extract-grade-report.sh";
			pb = new ProcessBuilder(path, userName, userPassword, cibledFile);
	    }	else	{
		    unlockPermission("/edx-extract-grade-report.sh", contextShellScriptsPath+MOD);
			path = contextShellScriptsPath+MOD + "/edx-extract-grade-report.sh";
			pb = new ProcessBuilder(path, cibledFile);
	    }
		System.out.println("extractFile "+cibledFile+", "+contextShellScriptsPath);
		pb.redirectOutput(output);
		pb.redirectError(Redirect.INHERIT);
		Process p = pb.start();
		try {
			p.waitFor();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		return true;
	}

	public static boolean loginWorking(String contextPath, String testedUserName, String testedUserPassword) throws IOException{
System.out.println("FunCsvGetter.loginWorking, contextPath(ShellScripts)="+contextPath+", testedUserName="+testedUserName);
	    unlockPermission("/verifUser.sh", contextPath);

		String path = contextPath + "/verifUser.sh";
		ProcessBuilder pb = new ProcessBuilder(path, testedUserName, testedUserPassword);
		pb.redirectError(Redirect.INHERIT);
		Process p = pb.start();
		
		BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
		StringBuilder builder = new StringBuilder();
		String line = null;
		while ( (line = reader.readLine()) != null) {
		   builder.append(line);
		   builder.append(System.getProperty("line.separator"));
		}
		String result = builder.toString();
		return result.indexOf("\"success\": true") != -1;
	}

	public static boolean courseInformationsWorking(String contextPath, String testedUserName, String testedUserPassword, String testedInstituteName, String testedCourseId, String testedSessionName, boolean isFunUpdated) throws IOException{
System.out.println("FunCsvGetter.courseInformationsWorking, contextPath(ShellScripts)="+contextPath+", testedUserName="+testedUserName);
	    unlockPermission("/verifCourse.sh", contextPath);

		String path = contextPath + "/verifCourse.sh";
		
		ProcessBuilder pb;
	    if(!isFunUpdated){
	    	pb = new ProcessBuilder(path, testedUserName, testedUserPassword, "https://www.fun-mooc.fr/courses/"+testedInstituteName+"/"+testedCourseId+"/"+testedSessionName+"/instructor/api/list_report_downloads");
	    }	else	{
			pb = new ProcessBuilder(path, testedUserName, testedUserPassword, "https://www.fun-mooc.fr/courses/course-v1:"+testedInstituteName+"+"+testedCourseId+"+"+testedSessionName+"/instructor/api/list_report_downloads");
	    }
		pb.redirectError(Redirect.INHERIT);
		Process p = pb.start();
		
		BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
		StringBuilder builder = new StringBuilder();
		String line = null;
		while ( (line = reader.readLine()) != null) {
		   builder.append(line);
		   builder.append(System.getProperty("line.separator"));
		}
		String result = builder.toString();
	    
		return result.indexOf("<!DOCTYPE html>") == -1;
	}
	
	public static void getCollectList(String contextPath) throws IOException{//work
System.out.println("FunCsvGetter.getCollectList, contextPath="+contextPath);

		// NEW CONTEXT PATH !
		if(!setUserParameters(contextPath)){
			return;
		}
		String path;
		ProcessBuilder pb;
		if(!isEdx){
		    unlockPermission("/get-reports.sh", contextPath+MOD);
			path = contextPath+MOD + "/get-reports.sh";
		    if(!isFunUpdated){
				pb = new ProcessBuilder(path, userName, userPassword, "https://www.fun-mooc.fr/courses/"+instituteName+"/"+courseId+"/"+sessionName+"/instructor/api/list_report_downloads");
		    }	else	{
				pb = new ProcessBuilder(path, userName, userPassword, "https://www.fun-mooc.fr/courses/course-v1:"+instituteName+"+"+courseId+"+"+sessionName+"/instructor/api/list_report_downloads");
		    }
		}	else	{
		    unlockPermission("/edx-get-reports.sh", contextPath+MOD);
			path = contextPath+MOD + "/edx-get-reports.sh";
			pb = new ProcessBuilder(path, userName, userPassword, "https://courses.edx.org/courses/"+sessionName);
		}
		
		pb.redirectError(Redirect.INHERIT);
		Process p = pb.start();
		
		BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
		StringBuilder builder = new StringBuilder();
		String line = null;
		while ( (line = reader.readLine()) != null) {
//~ System.out.println("    FunCsvGetter.getCollectList + "+line);
		   builder.append(line);
		   builder.append(System.getProperty("line.separator"));
		}
		String result = builder.toString();
		//grade_report_2
System.out.println("    FunCsvGetter.getCollectList, result="+result);
		
		String lineStart;
		if(!isEdx){
			lineStart = "\"name\":";
		}	else	{
			lineStart = "\"url\":";
		}
		
		boolean unknownFiles = true;
		int searchIndex = result.indexOf(lineStart, 0);
		String fileName;
		while(unknownFiles && searchIndex != -1){
			searchIndex = result.indexOf("\"", searchIndex+6);
			fileName = result.substring(searchIndex+1, result.indexOf("\"", searchIndex+1));
System.out.println("    FunCsvGetter.getCollectList, fileName="+fileName);
			if(fileName.indexOf("grade_report") != -1 && fileName.indexOf("problem_grade_report") == -1 && fileName.indexOf("grade_report_err") == -1/* && dateAfterSeptember(fileName)*/){
				if(!isEdx){
				    if(!isFunUpdated){
				    	if(!extractFile("https://www.fun-mooc.fr/get-grades/"+instituteName+"/"+courseId+"/"+sessionName+"/"+fileName, contextPath)){
				    		unknownFiles = false;
						}
				    }	else	{
						if(!extractFile("https://www.fun-mooc.fr/get-grades/course-v1:"+instituteName+"+"+courseId+"+"+sessionName+"/"+fileName, contextPath)){
							unknownFiles = false;
						}
				    }
				}	else	{
					if(!extractFile(fileName, contextPath)){
						unknownFiles = false;
					}
				}
			}			
			searchIndex = result.indexOf(lineStart, searchIndex);
		}
	}
	
	public static void getPostsList(String contextPath2, String contextPath) throws IOException{//work
System.out.println("FunCsvGetter getPostsList, contextPath2="+contextPath2+", "+contextPath);
		
		if(!setUserParameters(contextPath)){
			return;
		}
		
		ArrayList<String> idList = new ArrayList<String>();
		ArrayList<String> commentableIdList = new ArrayList<String>();
		
		int actualPage = 1;
		int maxPage = 1;
		while(actualPage <= maxPage){
System.out.println("	FunCsvGetter getPostsList, actualPage="+actualPage);
			String path;
			ProcessBuilder pb;
			if(!isEdx){//a adapté
			    unlockPermission("/get-posts.sh", contextPath+MOD);
				path = contextPath+MOD + "/get-posts.sh";
				
			    if(!isFunUpdated){
					pb = new ProcessBuilder(path, userName, userPassword, 
							"https://www.fun-mooc.fr/courses/"+instituteName+"/"+courseId+"/"+sessionName+"/discussion/forum?ajax=1&page="+actualPage+"&sort_key=date&sort_order=desc");
			    }	else	{
					pb = new ProcessBuilder(path, userName, userPassword, 
							"https://www.fun-mooc.fr/courses/course-v1:"+instituteName+"+"+courseId+"+"+sessionName+"/discussion/forum?ajax=1&page="+actualPage+"&sort_key=date&sort_order=desc");
			    }
			}	else	{
				return;
			}
			
			pb.redirectError(Redirect.INHERIT);
			Process p = pb.start();
			
			BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
			StringBuilder builder = new StringBuilder();
			String line = null;
			while ( (line = reader.readLine()) != null) {
			   builder.append(line);
			   builder.append(System.getProperty("line.separator"));
			}
			String result = builder.toString();
			//grade_report_2
			
			String lineStartId;
			String lineStartCommentableId;
	
			lineStartId = "\"id\"";
			lineStartCommentableId = "\"commentable_id\"";
			/*
			if(!isEdx){
				lineStartId = "\"id\"";
				lineStartCommentableId = "\"commentable_id\"";
			}	else	{
				//lineStartId = "\"url\":";
			}*/
			
			boolean unknownFiles = true;
			int searchIndex = result.indexOf(lineStartId, 0);
			String fileName;
			while(unknownFiles && searchIndex != -1){
				searchIndex = result.indexOf("\"", searchIndex+5);
				fileName = result.substring(searchIndex+1, result.indexOf("\"", searchIndex+1));
				idList.add(fileName);
				
				searchIndex = result.indexOf(lineStartCommentableId, searchIndex);
				searchIndex = result.indexOf("\"", searchIndex+16);
				fileName = result.substring(searchIndex+1, result.indexOf("\"", searchIndex+1));
				commentableIdList.add(fileName);

				searchIndex = result.indexOf(lineStartId, searchIndex);
			}
			
			if(actualPage == 1){
				searchIndex = result.indexOf("\"num_pages\"", searchIndex);
				searchIndex = result.indexOf(":", searchIndex);
				
				//maxPage = 1; //Coupure a enlever après test
				maxPage = Integer.parseInt(result.substring(searchIndex+2, result.indexOf(",", searchIndex+1)));
			}
			System.out.println("_________________________________");
			actualPage++;
		}
		
		getPosts(contextPath, contextPath2, idList, commentableIdList);
	}
	
	private static void getPosts(String contextPath, String contextPath2, ArrayList<String> idList, ArrayList<String> commentableIdList) throws IOException{
System.out.println("FunCsvGetter getPosts, contextPath2="+contextPath+", "+contextPath2);

		Timer timer = new Timer("Forum Download");
        StringBuilder posts = new StringBuilder();
		posts.append("[");
		for(int i = 0; i < idList.size();i++){
			String path;
			ProcessBuilder pb;
			if(!isEdx){//a adapté
			    unlockPermission("/get-thread.sh", contextPath+MOD);
				path = contextPath+MOD + "/get-thread.sh";
			    if(!isFunUpdated){
			    	pb = new ProcessBuilder(path, userName, userPassword, 
							"https://www.fun-mooc.fr/courses/"+instituteName+"/"+courseId+"/"+sessionName+"/discussion/forum/"+ commentableIdList.get(i) +"/threads/" + idList.get(i) + "?ajax=1&resp_skip=0&resp_limit=25");
			    }	else	{
			    	pb = new ProcessBuilder(path, userName, userPassword, 
							"https://www.fun-mooc.fr/courses/course-v1:"+instituteName+"+"+courseId+"+"+sessionName+"/discussion/forum/"+ commentableIdList.get(i) +"/threads/" + idList.get(i) + "?ajax=1&resp_skip=0&resp_limit=25");
			    }
				
			}	else	{
				return;
			}
			
			pb.redirectError(Redirect.INHERIT);
			Process p = pb.start();
			
			BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
			StringBuilder builder = new StringBuilder();
			String line = null;
			while ( (line = reader.readLine()) != null) {
			   builder.append(line);
			   builder.append(System.getProperty("line.separator"));
			}
			String result = builder.toString();
			
			posts.append(result);
			
			if(i+1<idList.size()){
				posts.append(",");
			}
		}
		posts.append("]");
		timer.DisplayTimer("Ending:");
		timer.End();
		@SuppressWarnings("resource")
		Writer writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(contextPath2 + "/forum.json"), "utf-8"));
		writer.append(posts);
		writer.close();
	}
	
	
	/*
	private static boolean dateAfterSeptember(String name){
		String date = name.substring(name.length()-19, name.length()-9);
		return date.compareTo("2016-09-01") > 0;
	}*/
	
	// Called every time !!!0
	private static void unlockPermission(String scriptName, String contextPath) throws IOException{
System.out.println("FunCsvGetter.unlockPermission: "+contextPath+scriptName);
	    String [] command = {"/bin/chmod","+x",contextPath + scriptName};
	    Runtime rt = Runtime.getRuntime();
	    Process pr = rt.exec( command );
	    try {
			pr.waitFor();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	    
	}

}
