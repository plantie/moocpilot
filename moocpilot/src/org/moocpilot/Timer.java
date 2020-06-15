package org.moocpilot;

import java.util.Date;
import java.util.logging.Level;

public class Timer {
    /*
     * Class permettant d'obtenir les timer des différentes étapes du procédé dans la console.
     */
    String name;//Le nom du timer
    Date startDate;//Le départ du timer
    Date lastDate;//La dernière date entré


    public Timer(String name) {
        this.name = name;
        this.startDate = new Date();
        this.lastDate = startDate;
        start();
    }

    private void start() {
        MoocPilotLogger.LOGGER.log(Level.INFO, "---------------------------------" + this.name + "-----" + this.startDate + "---------------------------------");
    }

    public void End() {
        MoocPilotLogger.LOGGER.log(Level.INFO, "---------------------------------" + this.name + "-----" + this.lastDate + "-----" + (this.startDate.getTime() - this.lastDate.getTime()) + "ms--------------------");
    }

    public void DisplayTimer(String message) {
        Date tempDate = new Date();
        MoocPilotLogger.LOGGER.log(Level.INFO, "Timer : " + this.name + " | Context : " + message + " | Time : " + tempDate.toString() + " | Time Difference : " + (tempDate.getTime() - this.lastDate.getTime()) + "ms");
        this.lastDate = tempDate;
    }
}
