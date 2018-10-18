package test;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import org.junit.Assert;
import org.junit.Test;
import org.moocpilot.ShellScriptTaskListener;

import java.util.ArrayList;
import java.util.Date;
import java.util.concurrent.ScheduledExecutorService;

import org.moocpilot.ShellScriptTaskListener.timerData;

public class ShellScriptTaskListenerTest {
    public class ShellScriptTaskListenerMock extends ShellScriptTaskListener {
        ArrayList<timerData> timerDatas;

        public ShellScriptTaskListenerMock(ArrayList<timerData> d) {
            this.timerDatas = d;
        }

        protected ArrayList<timerData> readTimerData() {
            return this.timerDatas;
        }

        protected void saveTimerData(ArrayList<timerData> timerDatas) {
        }
    }

    @Test
    public void getTimerList() {
        ArrayList<timerData> timerData = (new Gson()).fromJson(
        "[{\"type\":0,\"dayStart\":\"Sep 29, 2018 11:29:54 PM\",\"delay\":7,\"moocId\":\"MinesTelecom04026session03\"},\n" +
                "            {\"type\":1,\"dayStart\":\"Oct 21, 2018 5:29:54 AM\",\"delay\":7,\"moocId\":\"MinesTelecom04026session03\"},\n" +
                "            {\"type\":0,\"dayStart\":\"Oct 2, 2018 12:18:36 PM\",\"delay\":7,\"moocId\":\"Dartmouth_IMTxDART.IMT.C.062T2018\"},\n" +
                "            {\"type\":1,\"dayStart\":\"Oct 23, 2018 6:18:36 PM\",\"delay\":7,\"moocId\":\"Dartmouth_IMTxDART.IMT.C.062T2018\"},\n" +
                "            {\"type\":0,\"dayStart\":\"Oct 2, 2018 12:19:18 PM\",\"delay\":7,\"moocId\":\"Dartmouth_IMTxDART.IMT.C.041T2018\"},\n" +
                "        {\"type\":1,\"dayStart\":\"Oct 23, 2018 6:19:18 PM\",\"delay\":7,\"moocId\":\"Dartmouth_IMTxDART.IMT.C.041T2018\"},\n" +
                "        {\"type\":0,\"dayStart\":\"Oct 2, 2018 12:29:15 PM\",\"delay\":7,\"moocId\":\"Dartmouth_IMTxDART.IMT.C.052T2018\"},\n" +
                "        {\"type\":1,\"dayStart\":\"Oct 23, 2018 6:29:15 PM\",\"delay\":7,\"moocId\":\"Dartmouth_IMTxDART.IMT.C.052T2018\"},\n" +
                "        {\"type\":0,\"dayStart\":\"Oct 2, 2018 12:13:42 PM\",\"delay\":7,\"moocId\":\"Dartmouth_IMTxDART.IMT.C.072T2018\"},\n" +
                "        {\"type\":1,\"dayStart\":\"Oct 23, 2018 6:13:42 PM\",\"delay\":7,\"moocId\":\"Dartmouth_IMTxDART.IMT.C.072T2018\"},\n" +
                "        {\"type\":0,\"dayStart\":\"Oct 3, 2018 11:07:23 PM\",\"delay\":7,\"moocId\":\"MinesTelecom04003session07\"},\n" +
                "        {\"type\":1,\"dayStart\":\"Oct 18, 2018 5:07:23 AM\",\"delay\":7,\"moocId\":\"MinesTelecom04003session07\"},\n" +
                "        {\"type\":0,\"dayStart\":\"Oct 9, 2018 12:14:36 PM\",\"delay\":7,\"moocId\":\"Dartmouth_IMTxDART.IMT.C.011T2018\"},\n" +
                "        {\"type\":1,\"dayStart\":\"Oct 23, 2018 6:14:36 PM\",\"delay\":7,\"moocId\":\"Dartmouth_IMTxDART.IMT.C.011T2018\"},\n" +
                "        {\"type\":0,\"dayStart\":\"Oct 10, 2018 12:23:36 PM\",\"delay\":7,\"moocId\":\"Dartmouth_IMTxDART.IMT.C.021T2018\"},\n" +
                "        {\"type\":1,\"dayStart\":\"Oct 17, 2018 6:23:36 PM\",\"delay\":7,\"moocId\":\"Dartmouth_IMTxDART.IMT.C.021T2018\"}]",
                new TypeToken<ArrayList<timerData>>(){}.getType());
        ArrayList<timerData> d = new ArrayList<timerData> (timerData);
        ShellScriptTaskListener sl = new ShellScriptTaskListenerMock(d);
        Assert.assertEquals("1540311222000-7",sl.getTimerList("Dartmouth_IMTxDART.IMT.C.072T2018"));
    }

    @Test
    public void timerDataGeThisOrtNextDate() {
        long currentTimeL = new Date().getTime();
        timerData td = null;
        Date nextDate = null;
        // Here we expect to have the date on the following week as the timer Start date is past
        td = new timerData(
                ShellScriptTaskListener.TASK_TYPE_RETRIEVE,
                new Date(currentTimeL-2000),
                7,
                "Dartmouth_IMTxDART.IMT.C.021T2018");
        nextDate = td.geThisOrtNextDate();
        Assert.assertEquals(currentTimeL + 7 * ShellScriptTaskListener.FULL_DAY_MS - 2000, nextDate.getTime());

        // Here we expect to have the date on the following week as the timer Start date is past 2x the delay
        td = new timerData(
                ShellScriptTaskListener.TASK_TYPE_RETRIEVE,
                new Date(currentTimeL- 14 * ShellScriptTaskListener.FULL_DAY_MS - 2000 ),
                7,
                "Dartmouth_IMTxDART.IMT.C.021T2018");
        nextDate = td.geThisOrtNextDate();
        Assert.assertEquals(currentTimeL + 7 * ShellScriptTaskListener.FULL_DAY_MS - 2000, nextDate.getTime());

        // Here we expect to have the next date on the same day
        td = new timerData(
                ShellScriptTaskListener.TASK_TYPE_RETRIEVE,
                new Date(currentTimeL + 1000),
                7,
                "Dartmouth_IMTxDART.IMT.C.021T2018");
        nextDate = td.geThisOrtNextDate();

        Assert.assertEquals(currentTimeL+ 1000, nextDate.getTime());
    }

    @Test
    public void timerDataGetTimeBefore() {
        long currentTimeL = new Date().getTime();
        timerData td = null;
        long ts = 0;
        long timediff = 0;
        final long ERROR_MARGIN = 5;
        // Here we expect to have the date on the same day + 1000 ms
        td = new timerData(
                ShellScriptTaskListener.TASK_TYPE_RETRIEVE,
                new Date(currentTimeL+1000),
                7,
                "Dartmouth_IMTxDART.IMT.C.021T2018");
        ts = td.getTimeBefore();
        timediff = 1000;
        Assert.assertTrue(ts  > (timediff - ERROR_MARGIN) &&  ts < (timediff + ERROR_MARGIN ));

        // Here we expect to have the date on the following week
        td = new timerData(
                ShellScriptTaskListener.TASK_TYPE_RETRIEVE,
                new Date(currentTimeL-1000),
                7,
                "Dartmouth_IMTxDART.IMT.C.021T2018");
        ts = td.getTimeBefore();
        timediff = (7 * ShellScriptTaskListener.FULL_DAY_MS - 1000);
        Assert.assertTrue(ts  > (timediff - ERROR_MARGIN) &&  ts < (timediff + ERROR_MARGIN ));

    }

}