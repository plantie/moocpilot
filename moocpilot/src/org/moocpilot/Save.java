package org.moocpilot;


import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.tomcat.util.http.fileupload.IOUtils;

/**
 * Servlet implementation class Save
 */
@WebServlet("/Save")
@MultipartConfig
public class Save extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Save() {
        super();
    }

	@SuppressWarnings("resource")
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String moocId = request.getParameter("moocId"); 
System.out.println("Save doPost, moocId="+moocId); 
		
		/*Cette fonction prend en request un fichier XLS
		 * Elle le traite est l'écrit à l'emplacement voulu
		 * Elle return "done" si elle a bien marché
		 */
	    if(!Connect.isCookieTrue(request.getCookies(), getServletContext().getRealPath("/data/password.txt"))){
	    //if(!Connect.isCookieTrue(request.getCookies(), getServletContext().getRealPath("/ShellScripts/password.txt"))){
	    	return;
	    }
	    response.setContentType("application/javascript");

		java.util.Scanner s = new java.util.Scanner(request.getPart("typeRequest").getInputStream()).useDelimiter("\\A");
	    String typeRequest = s.hasNext() ? s.next() : "";
	    
		if(typeRequest.equals("xls")){
			XlsTraitement xlsTraitement = new XlsTraitement(request.getPart("file").getInputStream());
		    String contextPath = getServletContext().getRealPath("/data/"+moocId)+ "/versionLoaded.txt";
		    //String contextPath = getServletContext().getRealPath("/UploadedFiles")+ "/versionLoaded.txt";
		    xlsTraitement.SaveResponse(contextPath);
		}	else	{
			
			java.util.Scanner s1 = new java.util.Scanner(request.getPart("fileName").getInputStream()).useDelimiter("\\A");
		    String fileName = s1.hasNext() ? s1.next() : "";
		    
			java.util.Scanner s2 = new java.util.Scanner(request.getPart("realFileName").getInputStream()).useDelimiter("\\A");
		    String realFileName = s2.hasNext() ? s2.next() : "";
		    
		    String contextPath = getServletContext().getRealPath("/Csv");
		    String filePath = contextPath + "/"+fileName+".csv";
		    String csvListPath = contextPath;

		    
		    String[] fileNameParts = fileName.split("-");
		    CsvList csvList = new CsvList(csvListPath);
		    csvList.addWeek(fileNameParts[0], Integer.parseInt(fileNameParts[1]), realFileName);
		    csvList.save();
		    
			InputStream in = request.getPart("file").getInputStream();
			OutputStream out;
			out = new FileOutputStream(filePath);
			
			IOUtils.copy(in,out);
			
			in.close();
			out.close();
		}
	    PrintWriter pw = response.getWriter() ;
	    
	    pw.write("done");
	}

}
