package org.moocpilot;


import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.bind.annotation.adapters.HexBinaryAdapter;

import com.sun.org.apache.xerces.internal.impl.dv.util.HexBin;

/**
 * Servlet implementation class Connect
 *
 * Either cookies or password are usesd.
 * If password is provided, it is compared to content of '/data/password.txt' file
 *
 */

/**
 * Servlet implementation class Connect
 */
@MultipartConfig
@WebServlet("/Connect")
public class Connect extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Connect() {
        super();
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	@SuppressWarnings("resource")
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	    response.setContentType("application/javascript");

		java.util.Scanner s = new java.util.Scanner(request.getPart("pwd").getInputStream()).useDelimiter("\\A");
	    String password = s.hasNext() ? s.next() : "";
	    
	    String path = getServletContext().getRealPath("/data/password.txt");
	    //String path = getServletContext().getRealPath("/ShellScripts/password.txt");
	    
	    if(isRealPassword(path, password)){
	    	Cookie cookie = new Cookie("password", password);
	    	response.addCookie(cookie);
		    PrintWriter pw = response.getWriter() ;
		    pw.write("You are connected");
	    }	else	{
		    PrintWriter pw = response.getWriter() ;
		    pw.write("Bad Password");
	    }
	}
	
	public static boolean isCookieTrue(Cookie[] cookies, String path) throws IOException{
		boolean result =false;
		if(cookies != null) {
		    for (int i = 0; i < cookies.length; i++) {
		    	if(cookies[i].getName().equals("password")){
		    		result = isRealPassword(path, cookies[i].getValue());
		    	}
		    }
		}
		return result;
	}
	
/**
 * Check if provided string is equals to stored pass
 *
 * @param  path  path of file storing correct pass
 * @param  testedString provided string to be tested
 * @return      True if OK, False otherwise
 */
	public static boolean isRealPassword(String path, String testedString) throws IOException{
		
	    MessageDigest digest = null;
		try {
			digest = MessageDigest.getInstance("SHA-256");
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
		
	    byte[] hash = digest.digest((testedString+"s18qfad9sq565qz4adf9").getBytes(StandardCharsets.UTF_8));
	    String tested = String.format("%064x", new java.math.BigInteger(1, hash));
	    
	    
	    byte[] encoded = Files.readAllBytes(Paths.get(path));
	    String saved = new String(encoded, StandardCharsets.UTF_8);

	    // EGo: Check string against data in file (no AES...)
	    //System.out.println("Connect isRealPassword, testedString="+testedString+", saved="+saved);
	    return saved.equals(testedString);
		
	    //return saved.equals(tested);
	}

}
