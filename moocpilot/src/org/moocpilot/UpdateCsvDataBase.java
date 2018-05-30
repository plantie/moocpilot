package org.moocpilot;


import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class userParametersExist
 */
@WebServlet("/UpdateCsvDataBase")
public class UpdateCsvDataBase extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UpdateCsvDataBase() {
        super();
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String moocId = request.getParameter("moocId"); 
System.out.println("UpdateCsvDataBase doPost, moocId="+moocId);		
	    if(!Connect.isCookieTrue(request.getCookies(), getServletContext().getRealPath("/data/password.txt"))){
	    //if(!Connect.isCookieTrue(request.getCookies(), getServletContext().getRealPath("/ShellScripts/password.txt"))){
	    	return;
	    }
	    String contextPath = getServletContext().getRealPath("/data/"+moocId);
	    response.setContentType("application/javascript");
		FunCsvGetter.getCollectList(contextPath);
		//FunCsvGetter.getCollectList(getServletContext().getRealPath("/ShellScripts"));
	}

}
