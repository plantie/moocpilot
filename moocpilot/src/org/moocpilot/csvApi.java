package org.moocpilot;


import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
/**
 * Servlet implementation class csvApi
 */
@WebServlet("/csvApi")
@MultipartConfig
public class csvApi extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public csvApi() {
        super();
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	@SuppressWarnings("resource")
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String moocId = request.getParameter("moocId"); 
System.out.println("csvApi doPost, moocId="+moocId);		

	    if(!Connect.isCookieTrue(request.getCookies(), getServletContext().getRealPath("/data/password.txt"))){
	    //if(!Connect.isCookieTrue(request.getCookies(), getServletContext().getRealPath("/ShellScripts/password.txt"))){
	    	return;
	    }
	    
	    response.setContentType("application/javascript");

		java.util.Scanner s = new java.util.Scanner(request.getPart("idRequest").getInputStream()).useDelimiter("\\A");
	    int idRequest = Integer.parseInt(s.hasNext() ? s.next() : "");
	    
		s = new java.util.Scanner(request.getPart("idCsv").getInputStream()).useDelimiter("\\A");
	    int idCsv = Integer.parseInt(s.hasNext() ? s.next() : "");
	    
		String contextPath = getServletContext().getRealPath("/data/"+moocId);
		//String contextPath = getServletContext().getRealPath("/Csv");
	    String csvListPath = contextPath;
	    CsvList csvList = new CsvList(csvListPath);
System.out.println("csvApi doPost, idRequest="+idRequest+", idCsv="+idCsv+", csvListPath="+csvListPath);		
	    
	    
	    /*
	     * 0 : Remove
	     * 1 : moveUp
	     * 2 : moveDown
	     * 3 : changeName
	     * 4 : changeIsActive
	     * 5 : changeFile
	     */
	    
	    switch(idRequest){
	    	case 0 :
	    		csvList.removeWeek("0", idCsv);
	    		break;
	    	case 1 :
	    		csvList.moveWeek("0", idCsv, false);
	    		break;
	    	case 2 :
	    		csvList.moveWeek("0", idCsv, true);
	    		break;
	    	case 3 :
	    		s = new java.util.Scanner(request.getPart("newName").getInputStream()).useDelimiter("\\A");
	    	    String newName = s.hasNext() ? s.next() : "";
	    		csvList.changeWeekName("0", idCsv, newName);
	    		break;
	    	case 4 :
	    		s = new java.util.Scanner(request.getPart("newState").getInputStream()).useDelimiter("\\A");
	    	    boolean newState = (s.hasNext() ? s.next() : "").equals("true");
	    		csvList.changeWeekIsActive("0", idCsv, newState);
	    		break;
	    	case 5 :
	    		csvList.moveWeek("0", idCsv, false);
	    		break;
	    	default :
	    		System.out.println("Bad Request");
	    }
	    csvList.save();

	    PrintWriter pw = response.getWriter() ;
	    pw.write("done");
	}

}
