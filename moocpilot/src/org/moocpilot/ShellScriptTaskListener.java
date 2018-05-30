package org.moocpilot;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Collections;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

/*
 * 
 *
 */



/**
 * Application Lifecycle Listener implementation class ShellScriptTaskListener
 *
 */
@WebListener
public class ShellScriptTaskListener implements ServletContextListener,  Serializable  {
	/**
	 * 
	 */
	private static final long serialVersionUID = -2833890063987032071L;
	public static Timer timer;
	private static String path;
	
	// EG ajout path ?
	//private String contextPath;
	//~ private String moocId;
    /**
     * Default constructor. 
     */
    public ShellScriptTaskListener() { // String contextPath
//~ System.out.println("ShellScriptTaskListener");
    }

	/**
     * @see ServletContextListener#contextDestroyed(ServletContextEvent)
     */
    public void contextDestroyed(ServletContextEvent arg0)  { 
    	timer.cancel();
    }

	/**
     * @see ServletContextListener#contextInitialized(ServletContextEvent)
     */
    public void contextInitialized(ServletContextEvent arg0)  { 
    	path = arg0.getServletContext().getRealPath("/data");
System.out.println("ShellScriptTaskListener.contextInitialized, path="+path);
    	//path = arg0.getServletContext().getRealPath("/ShellScripts");
    	try {
			setTimerTasks();
		} catch (ClassNotFoundException | IOException e) {
			e.printStackTrace();
		}
    }
    
    // Get iterator over timers from "timerDatas.ser"
    ArrayList<timerData> readTimerData() {
	try {
		FileInputStream fin = new FileInputStream(path + "/timerDatas.ser");
	    	ObjectInputStream ois = new ObjectInputStream(fin);
	    	ArrayList<timerData> timerDatas = (ArrayList<timerData>) ois.readObject();
		return timerDatas; //timerDatas.iterator();
	} catch (ClassNotFoundException | IOException e) {
		return new ArrayList<timerData>();// empty list
	}
    }
    
    void saveTimerData(ArrayList<timerData> timerDatas) {
	try {
		FileOutputStream fout = new FileOutputStream(path + "/timerDatas.ser");
	    	ObjectOutputStream oos = new ObjectOutputStream(fout);
	    	oos.writeObject(timerDatas);
	} catch (IOException e) {
			e.printStackTrace();
	}
    }
    
    
    
    // EG: update to keep moocId
    @SuppressWarnings({ "resource", "unchecked" })
	public String getTimerList(String moocId){
System.out.println("ShellScriptTaskListener.getTimerList, path="+path+", moocId="+moocId);

	ArrayList<timerData> timerDatas = readTimerData();
	Iterator<timerData> it = timerDatas.iterator();
	String result = "";
	while (it.hasNext()) {
		timerData td = it.next();
		if(td.type == 0 && td.moocId.equals(moocId)){ // EG added moocId test
			if(!result.equals("")){
				result+="_";
			}
			result += td.dayStart.getTime() + "-" + td.delay;
		}
	}
	return result;	
    }
    
    
    @SuppressWarnings({ "unchecked", "resource" })
	public void removeTimer(String moocId){
	//public void removeTimer(int indexTimer){//removetimer 0 suffit du coup pour reset all si un seul timer
System.out.println("ShellScriptTaskListener.removeTimer "+moocId);

	ArrayList<timerData> timerDatas = readTimerData();
		
		// safe remove correct items
		Iterator<timerData> it = timerDatas.iterator();
		while (it.hasNext()) {
			timerData td = it.next();
			if (td.moocId.equals(moocId)) {
System.out.println("    removeTimer "+td.type+" for "+td.moocId);
				it.remove();
			}
		}
		//~ if(indexTimer >= timerDatas.size()-1){
			//~ return;
		//~ }
		
		//~ timerDatas.remove(indexTimer);
		//~ timerDatas.remove(indexTimer);
	saveTimerData(timerDatas);

		try {
			setTimerTasks();
		} catch (ClassNotFoundException | IOException e) {
			e.printStackTrace();
		}
    }
    
    @SuppressWarnings({ "resource", "unchecked" })
	private void setTimerTasks() throws ClassNotFoundException, IOException{
System.out.println("ShellScriptTaskListener.setTimerTasks");
    	if(timer != null){
        	timer.cancel();
    	}
    	timer = new Timer();
	ArrayList<timerData> timerDatas = readTimerData();
		
    	for(int i = 0; i<timerDatas.size();i++){
            switch (timerDatas.get(i).type) {
	            case 0:  setTimerSetCollect(timerDatas.get(i).getTimeBefore(), timerDatas.get(i).delay * (1000 * 60 * 60 * 24), timerDatas.get(i).moocId);
	                     break;
	            case 1:  setTimerGetCollect(timerDatas.get(i).getTimeBefore(), timerDatas.get(i).delay * (1000 * 60 * 60 * 24), timerDatas.get(i).moocId);
	                     break;
	            default: break;
	        }
        }
    }
    
    @SuppressWarnings({ "unchecked", "resource" })
	public void addTimerTask(int type, Date dayStart, long delay, String moocId){
System.out.println("ShellScriptTaskListener.addTimerTask, moocId="+moocId);
    	System.out.println("Task type " + type + " day :" + dayStart.toString() + " delay :" +delay+", "+moocId);

	ArrayList<timerData> timerDatas = readTimerData();
    	
    	timerDatas.add(new timerData(type, dayStart, delay, moocId));
        switch (type) {
	        case 0:  setTimerSetCollect(timerDatas.get(timerDatas.size()-1).getTimeBefore(), delay*(1000 * 60 * 60 * 24), moocId);
	                 break;
	        case 1:  setTimerGetCollect(timerDatas.get(timerDatas.size()-1).getTimeBefore(), delay*(1000 * 60 * 60 * 24), moocId);
	                 break;
	        default: break;
	    }
    	
	saveTimerData(timerDatas);
    }
    
    private void setTimerSetCollect(long timeBefore, long delayBetween, String moocId){
	final String moocId2 = moocId;
    	TimerTask timerTask = new TimerTask() {
    	    @Override
    	    public void run() {
    	    	
    	    	System.out.println("SetCollect");
    	    	try {
					FunCsvGetter.startCollect(path+"/"+moocId2);
				} catch (IOException e) {
					e.printStackTrace();
				}
    	    };
    	};
    	timer.scheduleAtFixedRate(timerTask,timeBefore,delayBetween);
    } 
    private void setTimerGetCollect(long timeBefore, long delayBetween, String moocId){
	final String moocId2 = moocId;
    	TimerTask timerTask = new TimerTask() {
    	    @Override
    	    public void run() {
    	    	System.out.println("GetCollect");
    	    	try {
					FunCsvGetter.getCollectList(path+"/"+moocId2);
					
				    String contextPath = path+"/"+moocId2;
				    //String contextPath = getClass().getClassLoader().getResource("/Csv").getPath();
				    CsvList csvList = new CsvList(contextPath);
				    ArrayList<String> csvListName = new ArrayList<String>();
					CsvTraitement csvTraitement = new CsvTraitement(csvList.getPathCourse("0", csvListName), csvListName);
					csvTraitement.SaveResponse(getClass().getClassLoader().getResource(("../../data/"+moocId2+"/versionLoaded.txt")).getPath());
					//csvTraitement.SaveResponse(getClass().getClassLoader().getResource(("../../UploadedFiles/versionLoaded.txt")).getPath());
				} catch (IOException e) {
					e.printStackTrace();
				}
    	    };
    	};
    	timer.scheduleAtFixedRate(timerTask,timeBefore,delayBetween);
    }
    
    // EG: update to keep moocId
    public class timerData implements Serializable {
	private static final long serialVersionUID = 4233740471441119448L;
		
	int type;//0 = set collect; 1 = get collecte
    	Date dayStart;
    	long delay;
	String moocId;

        public timerData(int type, Date dayStart, long delay, String moocId) {
        	this.type = type;
        	this.dayStart = dayStart;
        	this.delay = delay;
        	this.moocId = moocId;
        }
        
        public long getTimeBefore(){//vérifié la logique
        	
        	Date nextDate = new Date(this.dayStart.getTime());//on prend le time de daystart
        	Date actualDate = new Date();//on prend le time de actualDate
        	
        	while(nextDate.before(actualDate)){
        		nextDate = new Date(nextDate.getTime() + this.delay * (1000 * 60 * 60 * 24));
        	}
        	return nextDate.getTime()-actualDate.getTime();
        }
        
    }
}
