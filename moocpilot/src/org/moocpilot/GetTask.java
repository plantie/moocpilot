package org.moocpilot;


import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.logging.Level;

/**
 * Servlet implementation class FunCsvGetter
 */
@WebServlet("/GetTask")
@MultipartConfig

public class GetTask extends HttpServlet {
    private static final long serialVersionUID = 1L;
    public static String userName;
    public static String userPassword;
    public static String instituteName;
    public static String courseId;
    public static String sessionName;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public GetTask() {
        super();
    }

    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
     */


    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String moocId = request.getParameter("moocId");
        MoocPilotLogger.LOGGER.log(Level.INFO, "GetTask.doPost, moocId=" + moocId);
        String contextPath = getServletContext().getRealPath("/data/" + moocId);
        if (!Connect.isCookieTrue(request.getCookies(), getServletContext().getRealPath("/data/password.txt"))) {
            //if(!Connect.isCookieTrue(request.getCookies(), getServletContext().getRealPath("/ShellScripts/password.txt"))){
            return;
        }
        response.setContentType("application/javascript");

        ShellScriptTaskListener shellScriptTaskListener = new ShellScriptTaskListener();


        PrintWriter pw = response.getWriter();
        pw.write(shellScriptTaskListener.getTimerList(moocId));
    }
}
