

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.io.PrintWriter;

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
        // TODO Auto-generated constructor stub
    }
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	@SuppressWarnings("resource")
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	    if(!Connect.isCookieTrue(request.getCookies(), getServletContext().getRealPath("/ShellScripts/password.txt"))){
	    	return;
	    }
	    response.setContentType("application/javascript");

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
		try {
			fout = new FileOutputStream(getServletContext().getRealPath("/ShellScripts") + "/funUserParameters.ser");
	    	ObjectOutputStream oos = new ObjectOutputStream(fout);
	    	oos.writeObject(funUserParameters);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		FunCsvGetter.getCollectList(getServletContext().getRealPath("/ShellScripts"));		

		PrintWriter pw = response.getWriter() ;
	    pw.write("Worked");
	}

}
