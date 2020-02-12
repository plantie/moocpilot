#!/bin/bash

LOGIN=$1
PASSWORDFUN=$2
PASSWORDEDX=$3



echo -e   "\n----- get-posts: FUN\n"
#./get-posts.sh $LOGIN $PASSWORDFUN courses/course-v1:MinesTelecom+04003+session09/discussion/forum  https://www.fun-mooc.fr/

echo -e   "\n----- get-thread: FUN\n"
./get-thread.sh $LOGIN $PASSWORDFUN course-v1:MinesTelecom+04013+session04 1ea2ff1721f4f7a8e2605722921780ab556af901/threads/5e43c18823146a0001003212 https://www.fun-mooc.fr/

exit
echo -e   "\n----- verifyUser: FUN\n"
./verifUser.sh $LOGIN $PASSWORDFUN https://www.fun-mooc.fr/

echo -e   "\n----- verifyUser: EDX\n"
./verifUser.sh $LOGIN $PASSWORDEDX https://courses.edx.org/

echo -e   "\n----- verifyCourse: FUN\n"
./verifCourse.sh $LOGIN $PASSWORDFUN course-v1:MinesTelecom+04011+session07 https://www.fun-mooc.fr/

echo -e   "\n----- verifyCourse: EDX\n"
./verifCourse.sh $LOGIN $PASSWORDEDX course-v1:IMTx+CS101+3T2019 https://courses.edx.org/

echo -e   "\n----- getCourseInfo: FUN\n"
./getCourseInfo.sh $LOGIN $PASSWORDFUN course-v1:MinesTelecom+04011+session07 https://www.fun-mooc.fr/ | grep field-course

echo -e   "\n----- getCourseInfo: EDX\n"
./getCourseInfo.sh $LOGIN $PASSWORDEDX course-v1:IMTx+CS101+3T2019 https://courses.edx.org/ | grep field-course


echo -e   "\n----- get-reports: FUN\n"
./get-reports.sh $LOGIN $PASSWORDFUN course-v1:MinesTelecom+04011+session07 https://www.fun-mooc.fr/

echo -e   "\n----- edx-get-reports: edX\n"
./get-reports.sh $LOGIN $PASSWORDEDX course-v1:IMTx+CS101+3T2019 https://courses.edx.org/

echo -e   "\n----- extract-grade-report: FUN\n"
./extract-grade-report.sh $LOGIN $PASSWORDFUN "MinesTelecom_04011_session07_grade_report_2020-01-10-2133.csv" course-v1:MinesTelecom+04011+session07 https://www.fun-mooc.fr/

echo -e   "\n----- extract-grade-report: edX\n"
./extract-grade-report.sh $LOGIN $PASSWORDEDX "IMTx_CS101_3T2019_grade_report_2019-11-18-2024.csv" course-v1:IMTx+CS101+3T2019  https://courses.edx.org/


echo -e   "\n----- generate-grade-report: FUN\n"
#./generate-grade-report.sh $LOGIN $PASSWORDFUN course-v1:MinesTelecom+04011+session07 https://www.fun-mooc.fr/

echo -e   "\n----- generate-grade-report: edX\n"
#./generate-grade-report.sh $LOGIN $PASSWORDEDX course-v1:IMTx+CS101+3T2019 https://courses.edx.org/




