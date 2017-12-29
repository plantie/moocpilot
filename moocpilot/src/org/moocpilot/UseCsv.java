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
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		/*
		 * Entr�e : num�ro cours
		 * Effet : change le fichier JSON avec les donn�es CSV de num�ro cours
		 * Sortie : Rien
		 * Faire des tests de s�curit�
		 */
	    if(!Connect.isCookieTrue(request.getCookies(), getServletContext().getRealPath("/ShellScripts/password.txt"))){
	    	return;
	    }
	    @SuppressWarnings("resource")
		java.util.Scanner s = new java.util.Scanner(request.getPart("courseId").getInputStream()).useDelimiter("\\A");
	    String courseId = s.hasNext() ? s.next() : "";
		
	    String contextPath = getServletContext().getRealPath("/Csv");
	    CsvList csvList = new CsvList(contextPath);
	    ArrayList<String> csvListName = new ArrayList<String>();
		CsvTraitement csvTraitement = new CsvTraitement(csvList.getPathCourse(courseId, csvListName), csvListName);
		csvTraitement.SaveResponse(getServletContext().getRealPath("/UploadedFiles")+ "/versionLoaded.txt");
	    response.setContentType("application/javascript");
	    PrintWriter pw = response.getWriter() ;
	    pw.write("done");
	}

}
