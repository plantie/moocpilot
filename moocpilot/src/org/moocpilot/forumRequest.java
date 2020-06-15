package org.moocpilot;


import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.logging.Level;

/**
 * Servlet implementation class forumRequest
 */
@WebServlet("/forumRequest")
public class forumRequest extends HttpServlet {
    private static final long serialVersionUID = 1L;


    /**
     * @see HttpServlet#HttpServlet()
     */
    public forumRequest() {
        super();
    }

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    /*
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		FunCsvGetter.getPostsList(getServletContext().getRealPath("/Csv"), getServletContext().getRealPath("/ShellScripts"));
	}*/


    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String moocId = request.getParameter("moocId");
        MoocPilotLogger.LOGGER.log(Level.INFO, "forumRequest doPost, moocId=" + moocId);
        FunCsvGetter.getPostsList(getServletContext().getRealPath("/data/" + moocId), getServletContext().getRealPath("/data/" + moocId));
        //FunCsvGetter.getPostsList(getServletContext().getRealPath("/Csv"), getServletContext().getRealPath("/ShellScripts"));
    }

}
