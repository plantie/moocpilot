package org.moocpilot;


import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.lang.ProcessBuilder.Redirect;
//EG: writer
import java.io.File;
import java.io.FileWriter;

/**
 * Servlet implementation class Upload
 */
@WebServlet("/DataMngt")
public class DataMngt extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public DataMngt() {
        super();
    }


	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String action = request.getParameter("action"); // Save / Restore
System.out.println("DataMngt.doPost, action="+action);

	    response.setContentType("application/javascript");
	    PrintWriter pw = response.getWriter();
		
		if (action.equals("threadRemove")) {
			String moocId = request.getParameter("moocId"); 
			String id = request.getParameter("id");
System.out.println("DataMngt.doPost, moocId="+moocId+", id="+id);
			// EG: append current course ID
			File f = new File(getServletContext().getRealPath("/data/"+moocId)+"/removedThreads.txt");
			FileWriter fw = new FileWriter(f, true);
			id = id+"\n";
			fw.write(id.toCharArray(), 0, id.length());
			fw.close();
			pw.write("Thread removed");
			return;
		}




		
	    if(!Connect.isCookieTrue(request.getCookies(), getServletContext().getRealPath("/data/password.txt"))){
	    //if(!Connect.isCookieTrue(request.getCookies(), getServletContext().getRealPath("/ShellScripts/password.txt"))){
	    	return;
	    }
		
		
	    ProcessBuilder pb;
	    String contextPath = getServletContext().getRealPath("/");
	    unlockPermission("/data"+action+".sh", contextPath+"/ShellScripts");
	    pb = new ProcessBuilder(contextPath+"/ShellScripts/data"+action+".sh", contextPath);
		pb.redirectError(Redirect.INHERIT);
		Process p = pb.start();
		
	    pw.write("OK");
	}

// Copy FunCsvGetter.java	
	private static void unlockPermission(String scriptName, String contextPath) throws IOException{
System.out.println("DataMngt.unlockPermission: "+contextPath+scriptName);
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
