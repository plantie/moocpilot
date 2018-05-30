package org.moocpilot;


import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class IsConnect
 */
@WebServlet("/IsConnect")
public class IsConnect extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public IsConnect() {
        super();
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
System.out.println("IsConnect doPost");
	    response.setContentType("application/javascript");
	    
	    PrintWriter pw = response.getWriter() ;
	    /*on remplace ce qu'il y a entre le dernier et l'avant dernier / par "storage"
	     * 
	     * 
	     * 
	     */
	    //if(Connect.isCookieTrue(request.getCookies(), "C:\\Users\\sulex\\workspace\\.metadata\\.plugins\\org.eclipse.wst.server.core\\tmp1\\wtpwebapps\\storage\\direct-mooc")){//getServletContext().getRealPath("/ShellScripts/password.txt"))){
	    if(Connect.isCookieTrue(request.getCookies(), getServletContext().getRealPath("/data/password.txt"))){
	    //if(Connect.isCookieTrue(request.getCookies(), getServletContext().getRealPath("/ShellScripts/password.txt"))){
		    pw.write("You are connected");
	    }	else	{
		    pw.write("You are not connected");
	    }
	}

}
