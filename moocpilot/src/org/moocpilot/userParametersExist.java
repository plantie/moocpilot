package org.moocpilot;


import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.PrintWriter;
import java.util.logging.Level;

/**
 * Servlet implementation class userParametersExist
 */
@WebServlet("/userParametersExist")
public class userParametersExist extends HttpServlet {
    private static final long serialVersionUID = 1L;

    /**
     * @see HttpServlet#HttpServlet()
     */
    public userParametersExist() {
        super();
    }

    /**
     * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String moocId = request.getParameter("moocId");
        MoocPilotLogger.LOGGER.log(Level.INFO, "userParametersExist doPost, moocId=" + moocId);

        if (!Connect.isCookieTrue(request.getCookies(), getServletContext().getRealPath("/data/password.txt"))) {
            //if(!Connect.isCookieTrue(request.getCookies(), getServletContext().getRealPath("/ShellScripts/password.txt"))){
            return;
        }
        response.setContentType("application/javascript");
        PrintWriter pw = response.getWriter();
		/*
		File f = new File(getServletContext().getRealPath("/ShellScripts") + "/funUserParameters.ser");
		if(f.exists() && !f.isDirectory()){
		    pw.write("worked");
		}	else	{
		    pw.write("not worked");
		}*/
        FunUserParameters funUserParameters;
        try {
//MoocPilotLogger.LOGGER.log(Level.INFO,"fn: "+getServletContext().getRealPath("/data") + "/" + moocId + "/funUserParameters.ser");
            FileInputStream fin = new FileInputStream(getServletContext().getRealPath("/data/" + moocId) + "/funUserParameters.ser");
            //FileInputStream fin = new FileInputStream(getServletContext().getRealPath("/ShellScripts") + "/funUserParameters.ser");
            ObjectInputStream ois = new ObjectInputStream(fin);
            funUserParameters = (FunUserParameters) ois.readObject();
            String statut;
            if (funUserParameters.isEdx) {
                statut = "isEdx";
            } else {
                statut = "isFun";
            }
            pw.write("worked | " + statut);
//MoocPilotLogger.LOGGER.log(Level.INFO,"OK");
        } catch (ClassNotFoundException | IOException e) {
            pw.write("not worked");
            MoocPilotLogger.LOGGER.log(Level.INFO, "not OK, " + e);
        }
    }

}
