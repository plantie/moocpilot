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
 * Servlet implementation class Upload
 */
@WebServlet("/Upload")
@MultipartConfig //!!!!!!!!!!!!NE PAS OUBLIER permet � la servlet de comprendre l'objet multipart re�u
public class Upload extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Upload() {
        super();
        // TODO Auto-generated constructor stub
    }


	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		/*request est un fichier XLS
		 *On traite � l'aide de XlsTraitement
		 *On utilise Response afin de pr�parer la r�ponse et de la r�cup�rer en JSON
		 *On retourne le JSON obtenu
		 */
	    response.setContentType("application/javascript");
	    PrintWriter pw = response.getWriter() ;
		XlsTraitement xlsTraitement = new XlsTraitement(request.getPart("file").getInputStream());
	    pw.write(xlsTraitement.GetResponse());
		
		
		/*XlsTraitement xlsTraitement = new XlsTraitement(request.getPart("file").getInputStream());
	    response.setContentType("application/javascript");
	    PrintWriter pw = response.getWriter() ;
	    pw.write(xlsTraitement.GetResponse());
	    String contextPath = getServletContext().getRealPath("/UploadedFiles");
		CsvTraitement csvTraitement = new CsvTraitement(contextPath);
	    response.setContentType("application/javascript");
	    PrintWriter pw = response.getWriter() ;
	    pw.write(csvTraitement.GetResponse());*/
	}
}
