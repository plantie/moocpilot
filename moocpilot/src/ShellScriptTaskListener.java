
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

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
    /**
     * Default constructor. 
     */
    public ShellScriptTaskListener() {
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
    	path = arg0.getServletContext().getRealPath("/ShellScripts");
    	try {
			setTimerTasks();
		} catch (ClassNotFoundException | IOException e) {
			e.printStackTrace();
		}
    }
    
    @SuppressWarnings({ "resource", "unchecked" })
	public String getTimerList(){
    	FileInputStream fin;
    	ArrayList<timerData> timerDatas;
    	String result = "";
		try {
			fin = new FileInputStream(path + "/timerDatas.ser");
	    	ObjectInputStream ois = new ObjectInputStream(fin);
	    	timerDatas = (ArrayList<timerData>) ois.readObject();
		} catch (ClassNotFoundException | IOException e) {
			return result;
		}
		for(int i = 0; i<timerDatas.size();i++){
			if(timerDatas.get(i).type == 0){
				if(!result.equals("")){
					result+="_";
				}
				result+=timerDatas.get(i).dayStart.getTime() + "-" + timerDatas.get(i).delay;
			}
		}
		return result;	
    }
    
    
    @SuppressWarnings({ "unchecked", "resource" })
	public void removeTimer(int indexTimer){//removetimer 0 suffit du coup pour reset all si un seul timer
    	FileInputStream fin;
    	ArrayList<timerData> timerDatas;
		try {
			fin = new FileInputStream(path + "/timerDatas.ser");
	    	ObjectInputStream ois = new ObjectInputStream(fin);
	    	timerDatas = (ArrayList<timerData>) ois.readObject();
		} catch (ClassNotFoundException | IOException e) {
			return ;
		}
		if(indexTimer >= timerDatas.size()-1){
			return;
		}
		
		timerDatas.remove(indexTimer);
		timerDatas.remove(indexTimer);

    	FileOutputStream fout;
		try {
			fout = new FileOutputStream(path + "/timerDatas.ser");
	    	ObjectOutputStream oos = new ObjectOutputStream(fout);
	    	oos.writeObject(timerDatas);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		try {
			setTimerTasks();
		} catch (ClassNotFoundException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }
    
    @SuppressWarnings({ "resource", "unchecked" })
	private void setTimerTasks() throws ClassNotFoundException, IOException{
    	if(timer != null){
        	timer.cancel();
    	}
    	timer = new Timer();
    	ArrayList<timerData> timerDatas;
		try {
	    	FileInputStream fin = new FileInputStream(path + "/timerDatas.ser");
	    	ObjectInputStream ois = new ObjectInputStream(fin);
	    	timerDatas = (ArrayList<timerData>) ois.readObject();
		} catch (ClassNotFoundException | IOException e) {
			timerDatas = new ArrayList<timerData>();
		}
		
    	for(int i = 0; i<timerDatas.size();i++){
            switch (timerDatas.get(i).type) {
	            case 0:  setTimerSetCollect(timerDatas.get(i).getTimeBefore(), timerDatas.get(i).delay * (1000 * 60 * 60 * 24));
	                     break;
	            case 1:  setTimerGetCollect(timerDatas.get(i).getTimeBefore(), timerDatas.get(i).delay * (1000 * 60 * 60 * 24));
	                     break;
	            default: break;
	        }
        }
    }
    
    @SuppressWarnings({ "unchecked", "resource" })
	public void addTimerTask(int type,Date dayStart,long delay){
    	FileInputStream fin;
    	ArrayList<timerData> timerDatas;
    	System.out.println("Task type " + type + " day :" + dayStart.toString() + " delay :" +delay);
		try {
			fin = new FileInputStream(path + "/timerDatas.ser");
	    	ObjectInputStream ois = new ObjectInputStream(fin);
	    	timerDatas = (ArrayList<timerData>) ois.readObject();
		} catch (ClassNotFoundException | IOException e) {
			timerDatas = new ArrayList<timerData>();
		}
    	
    	timerDatas.add(new timerData(type,dayStart,delay));
        switch (type) {
	        case 0:  setTimerSetCollect(timerDatas.get(timerDatas.size()-1).getTimeBefore(), delay*(1000 * 60 * 60 * 24));
	                 break;
	        case 1:  setTimerGetCollect(timerDatas.get(timerDatas.size()-1).getTimeBefore(), delay*(1000 * 60 * 60 * 24));
	                 break;
	        default: break;
	    }
    	
    	FileOutputStream fout;
		try {
			fout = new FileOutputStream(path + "/timerDatas.ser");
	    	ObjectOutputStream oos = new ObjectOutputStream(fout);
	    	oos.writeObject(timerDatas);
		} catch (IOException e) {
			e.printStackTrace();
		}
    }
    
    private void setTimerSetCollect(long timeBefore, long delayBetween){
    	TimerTask timerTask = new TimerTask() {
    	    @Override
    	    public void run() {
    	    	
    	    	System.out.println("SetCollect");
    	    	try {
					FunCsvGetter.startCollect(path);
				} catch (IOException e) {
					e.printStackTrace();
				}
    	    };
    	};
    	timer.scheduleAtFixedRate(timerTask,timeBefore,delayBetween);
    } 
    private void setTimerGetCollect(long timeBefore, long delayBetween){
    	TimerTask timerTask = new TimerTask() {
    	    @Override
    	    public void run() {
    	    	System.out.println("GetCollect");
    	    	try {
					FunCsvGetter.getCollectList(path);
					
					
				    String contextPath = getClass().getClassLoader().getResource("/Csv").getPath();
				    CsvList csvList = new CsvList(contextPath);
				    ArrayList<String> csvListName = new ArrayList<String>();
					CsvTraitement csvTraitement = new CsvTraitement(csvList.getPathCourse("0", csvListName), csvListName);
					csvTraitement.SaveResponse(getClass().getClassLoader().getResource(("../../UploadedFiles/versionLoaded.txt")).getPath());
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
    	    };
    	};
    	timer.scheduleAtFixedRate(timerTask,timeBefore,delayBetween);
    }
    
    public class timerData implements Serializable {
		private static final long serialVersionUID = 4233740471441119448L;
		
		int type;//0 = set collect; 1 = get collecte
    	Date dayStart;
    	long delay;
        public timerData(int type,Date dayStart,long delay) {
        	this.type = type;
        	this.dayStart = dayStart;
        	this.delay = delay;
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
