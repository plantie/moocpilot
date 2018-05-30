package org.moocpilot;


import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.ObjectInputStream;
import java.io.PrintWriter;
import java.lang.ProcessBuilder.Redirect;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class FunCsvGetter
 */
@WebServlet("/RemoveTask")
@MultipartConfig

public class RemoveTask extends HttpServlet {
	private static final long serialVersionUID = 1L;
	public static String userName;
	public static String userPassword;
	public static String instituteName;
	public static String courseId;
	public static String sessionName;
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RemoveTask() {
        super();
    }
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
    
    
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String moocId = request.getParameter("moocId"); 
System.out.println("RemoveTask.doPost, moocId="+moocId);
		String contextPath = getServletContext().getRealPath("/data/"+moocId);
	    if(!Connect.isCookieTrue(request.getCookies(), getServletContext().getRealPath("/data/password.txt"))){
	    //if(!Connect.isCookieTrue(request.getCookies(), getServletContext().getRealPath("/ShellScripts/password.txt"))){
	    	return;
	    }
	    response.setContentType("application/javascript");
	    
		ShellScriptTaskListener shellScriptTaskListener = new ShellScriptTaskListener();
		shellScriptTaskListener.removeTimer(moocId);
	    
	    PrintWriter pw = response.getWriter() ;
	    pw.write("Done");
	}
}
