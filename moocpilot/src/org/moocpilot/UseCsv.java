package org.moocpilot;


import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class UseCsv
 */
@WebServlet("/UseCsv")
@MultipartConfig
public class UseCsv extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UseCsv() {
        super();
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String moocId = request.getParameter("moocId"); 
System.out.println("UseCsv.doPost, moocId="+moocId);
		/*
		 * Entrée : numéro cours
		 * Effet : change le fichier JSON avec les données CSV de numéro cours
		 * Sortie : Rien
		 * Faire des tests de sécurité
		 */
	    if(!Connect.isCookieTrue(request.getCookies(), getServletContext().getRealPath("/data/password.txt"))){
	    //if(!Connect.isCookieTrue(request.getCookies(), getServletContext().getRealPath("/ShellScripts/password.txt"))){
	    	return;
	    }
	    @SuppressWarnings("resource")
		java.util.Scanner s = new java.util.Scanner(request.getPart("courseId").getInputStream()).useDelimiter("\\A");
	    String courseId = s.hasNext() ? s.next() : "";
		
	    String contextPath = getServletContext().getRealPath("/data/"+moocId);
System.out.println("  UseCsv.doPost, contextPath="+moocId);
	    //String contextPath = getServletContext().getRealPath("/Csv");
	    CsvList csvList = new CsvList(contextPath);
	    ArrayList<String> csvListName = new ArrayList<String>();
		CsvTraitement csvTraitement = new CsvTraitement(csvList.getPathCourse(courseId, csvListName), csvListName);
		csvTraitement.SaveResponse(getServletContext().getRealPath("/data/"+moocId)+"/versionLoaded.txt");
		//csvTraitement.SaveResponse(getServletContext().getRealPath("/UploadedFiles")+ "/versionLoaded.txt");
	    response.setContentType("application/javascript");
	    PrintWriter pw = response.getWriter() ;
	    pw.write("done");
	}

}
