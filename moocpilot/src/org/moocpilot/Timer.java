package org.moocpilot;
import java.util.Date;


public class Timer {
	/*
	 * Class permettant d'obtenir les timer des diff�rentes �tapes du proc�d� dans la console.
	 */
	String name;//Le nom du timer
	Date startDate;//Le d�part du timer
	Date lastDate;//La derni�re date entr�
	
	public Timer(String name){
		this.name = name;
		this.startDate = new Date();
		this.lastDate = startDate;
		start();
	}
	
	private void start(){
		System.out.println("---------------------------------"+this.name+"-----"+this.startDate+"---------------------------------");
	}
	
	public void End(){
		System.out.println("---------------------------------"+this.name+"-----"+this.lastDate+"-----"+(this.startDate.getTime()-this.lastDate.getTime())+"ms--------------------");
	}
	
	public void DisplayTimer(String message){
		Date tempDate = new Date();
		System.out.println("Timer : "+this.name+" | Context : "+message+" | Time : "+tempDate.toString()+" | Time Difference : " + (tempDate.getTime()-this.lastDate.getTime())+"ms");
		this.lastDate = tempDate;
	}
}
