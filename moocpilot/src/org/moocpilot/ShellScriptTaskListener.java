package org.moocpilot;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import java.io.*;
import java.util.*;
import java.util.Timer;
import java.util.logging.Level;
/*
 *
 *
 */


/**
 * Application Lifecycle Listener implementation class ShellScriptTaskListener
 */
@WebListener
public class ShellScriptTaskListener implements ServletContextListener, Serializable {
    public static final long SIX_HOURS_MS = 1000 * 60 * 60 * 6;
    public static final long FULL_DAY_MS = (1000 * 60 * 60 * 24);
    public static final int TASK_TYPE_RETRIEVE = 0;
    public static final int TASK_TYPE_PROCESS = 1;


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
//~ MoocPilotLogger.LOGGER.log(Level.INFO,"ShellScriptTaskListener");
    }

    /**
     * @see ServletContextListener#contextDestroyed(ServletContextEvent)
     */
    public void contextDestroyed(ServletContextEvent arg0) {
        timer.cancel();
    }

    /**
     * @see ServletContextListener#contextInitialized(ServletContextEvent)
     */
    public void contextInitialized(ServletContextEvent arg0) {
        path = arg0.getServletContext().getRealPath("/data");
        MoocPilotLogger.LOGGER.log(Level.INFO, "ShellScriptTaskListener.contextInitialized, path=" + path);
        //path = arg0.getServletContext().getRealPath("/ShellScripts");
        try {
            setTimerTasks();
        } catch (ClassNotFoundException | IOException e) {
            e.printStackTrace();
        }
    }

    // Get iterator over timers from "timerDatas.ser"
    protected ArrayList<timerData> readTimerData() {
        try {
            FileInputStream fin = new FileInputStream(path + "/timerDatas.ser");
            ObjectInputStream ois = new ObjectInputStream(fin);
            ArrayList<timerData> timerDatas = (ArrayList<timerData>) ois.readObject();
            // Filter out timerData with Type == 1

            return filterOutTimerData(timerDatas);
        } catch (ClassNotFoundException | IOException e) {
            return new ArrayList<timerData>();// empty list
        }
    }

    private ArrayList<timerData> filterOutTimerData(ArrayList<timerData> timerDatas) {
        // Filter out timerData with Type == 1
        ArrayList<timerData> ts = new ArrayList<timerData>();
        for (timerData tdata : timerDatas) {
            if (tdata.type == 0) {
                ts.add(tdata);
            }
        }
        return ts;
    }

    protected void saveTimerData(ArrayList<timerData> timerDatas) {
        try {
            ArrayList<timerData> ts = filterOutTimerData(timerDatas);
            FileOutputStream fout = new FileOutputStream(path + "/timerDatas.ser");
            ObjectOutputStream oos = new ObjectOutputStream(fout);
            oos.writeObject(ts);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    // EG: update to keep moocId
    @SuppressWarnings({"resource", "unchecked"})
    public String getTimerList(String moocId) {
        MoocPilotLogger.LOGGER.log(Level.INFO, "ShellScriptTaskListener.getTimerList, path=" + path + ", moocId=" + moocId);

        ArrayList<timerData> timerDatas = readTimerData();
        Iterator<timerData> it = timerDatas.iterator();
        String result = "";
        while (it.hasNext()) {
            timerData td = it.next();
            if (td.moocId.equals(moocId)) { // EG added moocId test
                if (!result.equals("")) {
                    result += "_";
                }
                result += td.geThisOrtNextDate().getTime() + "-" + td.delay;
            }
        }
        return result;
    }


    @SuppressWarnings({"unchecked", "resource"})
    public void removeTimer(String moocId) {
        //public void removeTimer(int indexTimer){//removetimer 0 suffit du coup pour reset all si un seul timer
        MoocPilotLogger.LOGGER.log(Level.INFO, "ShellScriptTaskListener.removeTimer " + moocId);

        ArrayList<timerData> timerDatas = readTimerData();

        // safe remove correct items
        Iterator<timerData> it = timerDatas.iterator();
        while (it.hasNext()) {
            timerData td = it.next();
            if (td.moocId.equals(moocId)) {
                MoocPilotLogger.LOGGER.log(Level.INFO, "    removeTimer for " + td.moocId);
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

    @SuppressWarnings({"resource", "unchecked"})
    protected void setTimerTasks() throws ClassNotFoundException, IOException {
        MoocPilotLogger.LOGGER.log(Level.INFO, "ShellScriptTaskListener.setTimerTasks");
        if (timer != null) {
            timer.cancel();
        }
        timer = new Timer();
        ArrayList<timerData> timerDatas = readTimerData();

        for (int i = 0; i < timerDatas.size(); i++) {
            timerData td = timerDatas.get(i);
            setTimerRetrieveCollect(td.getTimeBefore(), td.delay * ShellScriptTaskListener.FULL_DAY_MS, td.moocId);
            setTimerProcessCollect(td.getTimeBefore(), td.delay * ShellScriptTaskListener.FULL_DAY_MS + ShellScriptTaskListener.SIX_HOURS_MS, td.moocId);
        }
        saveTimerData(timerDatas);
    }

    @SuppressWarnings({"unchecked", "resource"})
    public void addTimerTask(Date dayStart, long delay, String moocId) {
        MoocPilotLogger.LOGGER.log(Level.INFO, "ShellScriptTaskListener.addTimerTask, moocId=" + moocId);

        ArrayList<timerData> timerDatas = readTimerData();

        timerData timerData = new timerData(dayStart, delay, moocId);

        timerDatas.add(timerData);

        setTimerRetrieveCollect(timerData.getTimeBefore(), delay * ShellScriptTaskListener.FULL_DAY_MS, moocId);
        setTimerProcessCollect(timerData.getTimeBefore(), delay * ShellScriptTaskListener.FULL_DAY_MS + ShellScriptTaskListener.SIX_HOURS_MS, moocId);
        saveTimerData(timerDatas);
    }

    protected void setTimerRetrieveCollect(long timeBefore, long delayBetween, final String moocId) {
        class SetCollectTask extends TimerTask {
            private String moocId;

            public SetCollectTask(String moocId) {
                this.moocId = moocId;
            }

            @Override
            public void run() {

                MoocPilotLogger.LOGGER.log(Level.INFO, "SetCollect");
                try {
                    FunCsvGetter.startCollect(path + "/" + this.moocId);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

        }
        TimerTask timerTask = new SetCollectTask(moocId);
        timer.scheduleAtFixedRate(timerTask, timeBefore, delayBetween);
    }

    protected void setTimerProcessCollect(long timeBefore, long delayBetween, String moocId) {
        class GetCollectTask extends TimerTask {
            private String moocId;

            public GetCollectTask(String moocId) {
                this.moocId = moocId;
            }

            @Override
            public void run() {
                MoocPilotLogger.LOGGER.log(Level.INFO, "GetCollect");
                try {
                    FunCsvGetter.getCollectList(path + "/" + this.moocId);

                    String contextPath = path + "/" + this.moocId;
                    CsvList csvList = new CsvList(contextPath);
                    ArrayList<String> csvListName = new ArrayList<String>();
                    CsvTraitement csvTraitement = new CsvTraitement(csvList.getPathCourse("0", csvListName), csvListName);
                    csvTraitement.SaveResponse(path + "/" + this.moocId + "/versionLoaded.txt");
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

        }
        TimerTask timerTask = new GetCollectTask(moocId);
        timer.scheduleAtFixedRate(timerTask, timeBefore, delayBetween);
        //timer.scheduleAtFixedRate(timerTask, 3000, 7);
    }

    // EG: update to keep moocId
    public static class timerData implements Serializable {
        private static final long serialVersionUID = 4233740471441119448L;
        @Deprecated
        int type = ShellScriptTaskListener.TASK_TYPE_RETRIEVE; // We will not use this value anymore

        Date dayStart;
        long delay;
        String moocId;

        @Deprecated
        public timerData(int type, Date dayStart, long delay, String moocId) {
            this.type = type;
            this.dayStart = dayStart;
            this.delay = delay;
            this.moocId = moocId;
        }

        public timerData(Date dayStart, long delay, String moocId) {
            this.dayStart = dayStart;
            this.delay = delay;
            this.moocId = moocId;
        }

        public Date geThisOrtNextDate() {
            Date nextDate = new Date(this.dayStart.getTime());//on prend le time de daystart
            Date actualDate = new Date();//on prend le time de actualDate
            while (nextDate.before(actualDate)) { // We increment the date from delay x fullday each time
                // La prochaine date est dépassée donc on prends la suivante
                nextDate = new Date(nextDate.getTime() + this.delay * ShellScriptTaskListener.FULL_DAY_MS);
            }
            return nextDate;
        }

        public long getTimeBefore() {
            Date nextDate = this.geThisOrtNextDate();
            Date actualDate = new Date();//on prends le timestamp actuel
            return nextDate.getTime() - actualDate.getTime();
        }
    }
}
