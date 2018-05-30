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
@MultipartConfig //!!!!!!!!!!!!NE PAS OUBLIER permet à la servlet de comprendre l'objet multipart reçu
public class Upload extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Upload() {
        super();
    }


	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// EG: TODO PATH ?????????????????
		/*request est un fichier XLS
		 *On traite à l'aide de XlsTraitement
		 *On utilise Response afin de préparer la réponse et de la récupérer en JSON
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
