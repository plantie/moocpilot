package org.moocpilot;
import java.io.Serializable;

public class FunUserParameters  implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 6595222866394897788L;
	
	String userName;
	String userPassword;
	String instituteName;
	String courseId;
	String sessionName;
	boolean isEdx;
	boolean isFunUpdated;
	
	public FunUserParameters(String userName, String userPassword, String instituteName, String courseId, String sessionName, boolean isEdx, boolean isFunUpdated){
		this.userName = userName;
		this.userPassword = userPassword;
		this.instituteName = instituteName;
		this.courseId = courseId;
		this.sessionName = sessionName;
		this.isEdx = isEdx;
		this.isFunUpdated = isFunUpdated;
	}
}
