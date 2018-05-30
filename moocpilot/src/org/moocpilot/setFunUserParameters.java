package org.moocpilot;


import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.io.PrintWriter;
import java.io.File;
import java.io.FileWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class setFunUserParameters
 */
@WebServlet("/setFunUserParameters")
@MultipartConfig

public class setFunUserParameters extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public setFunUserParameters() {
        super();
    }
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	@SuppressWarnings("resource")
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String moocId = request.getParameter("moocId"); 
System.out.println("setFunUserParameters.doPost "+moocId);
	    if(!Connect.isCookieTrue(request.getCookies(), getServletContext().getRealPath("/data/password.txt"))){
	    //if(!Connect.isCookieTrue(request.getCookies(), getServletContext().getRealPath("/ShellScripts/password.txt"))){
	    	return;
	    }
	    response.setContentType("application/javascript");
System.out.println("setFunUserParameters.doPost 2");

		java.util.Scanner s = new java.util.Scanner(request.getPart("userName").getInputStream()).useDelimiter("\\A");
	    String userName = s.hasNext() ? s.next() : "";

		java.util.Scanner s1 = new java.util.Scanner(request.getPart("userPassword").getInputStream()).useDelimiter("\\A");
	    String userPassword = s1.hasNext() ? s1.next() : ""; 

		java.util.Scanner s3 = new java.util.Scanner(request.getPart("instituteName").getInputStream()).useDelimiter("\\A");
	    String instituteName = s3.hasNext() ? s3.next() : "";

		java.util.Scanner s4 = new java.util.Scanner(request.getPart("courseId").getInputStream()).useDelimiter("\\A");
	    String courseId = s4.hasNext() ? s4.next() : "";
	    

		java.util.Scanner s5 = new java.util.Scanner(request.getPart("sessionName").getInputStream()).useDelimiter("\\A");
	    String sessionName = s5.hasNext() ? s5.next() : "";
	    
		java.util.Scanner s6 = new java.util.Scanner(request.getPart("isEdx").getInputStream()).useDelimiter("\\A");
	    boolean isEdx = (s6.hasNext() ? s6.next() : "").equals("true");
	    
	    boolean isFunUpdated = false;
	    	    
System.out.println("setFunUserParameters.doPost->"+userName+", "+courseId);

	    if(!isEdx){
	    	if(FunCsvGetter.loginWorking(getServletContext().getRealPath("/ShellScripts"), userName, userPassword)){
	    		if(!FunCsvGetter.courseInformationsWorking(getServletContext().getRealPath("/ShellScripts"), userName, userPassword, instituteName, courseId, sessionName, false)){
	    			if(!FunCsvGetter.courseInformationsWorking(getServletContext().getRealPath("/ShellScripts"), userName, userPassword, instituteName, courseId, sessionName, true)){
		    			PrintWriter pw = response.getWriter() ;
		    		    pw.write("Error : Course Informations");
		    		    return;
	    			}	else	{
	    				isFunUpdated = true;
	    			}
	    		}
	    	}	else	{
				PrintWriter pw = response.getWriter() ;
			    pw.write("Error : User Informations");
			    return;
	    	}
	    }	else	{
	    	
	    }
	    
	    FunUserParameters funUserParameters = new FunUserParameters(userName, userPassword, instituteName, courseId, sessionName, isEdx, isFunUpdated);
    	FileOutputStream fout;
		String newPath = getServletContext().getRealPath("/")+"/data/"+funUserParameters.instituteName+funUserParameters.courseId+funUserParameters.sessionName;
		try {
			System.out.println("DIR "+newPath);
			new File(newPath).mkdirs();
			fout = new FileOutputStream(newPath + "/funUserParameters.ser");
			//fout = new FileOutputStream(getServletContext().getRealPath("/ShellScripts") + "/funUserParameters.ser");
	    	ObjectOutputStream oos = new ObjectOutputStream(fout);
	    	oos.writeObject(funUserParameters);
			
			// EG: append current course ID
			File f = new File(getServletContext().getRealPath("/")+"/data/courses.txt");
			FileWriter fw = new FileWriter(f, true);
			String line=instituteName+"	"+courseId+"	"+sessionName+"	"+isEdx+"	"+isFunUpdated+"\n";
			fw.write(line.toCharArray(), 0, line.length());
			fw.close();
			
			
			
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		System.out.println("before getCollectList");
		FunCsvGetter.getCollectList(newPath);
		//System.out.println(" was using '"+getServletContext().getRealPath("/ShellScripts")+"' -> "+newPath);
		//FunCsvGetter.getCollectList(getServletContext().getRealPath("/ShellScripts"));		

		PrintWriter pw = response.getWriter() ;
	    pw.write("Worked");
	}

}
