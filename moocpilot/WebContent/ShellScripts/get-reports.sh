#!/bin/bash
COOKIES_FILE=$(mktemp)
LOGIN=$1
PASSWORD=$2
CIBLED_URL=$3
URL=$4

echo "get-reports	$LOGIN	$PASSWORD	$CIBLED_URL	$URL" >> /tmp/mooc.log

curl -s --referer $URL/ $URL/ -c $COOKIES_FILE -o /dev/null
#~ curl -s --referer $URL/ $URL/login_ajax -H "X-CSRFToken: 123" -b "csrftoken=123" -d "email=$LOGIN&password=$PASSWORD" --cookie-jar $COOKIES_FILE
TOKEN=$(awk '/csrftoken/{print $7}' $COOKIES_FILE)
#~ cat $COOKIES_FILE
#~ echo "CSRF: $TOKEN"
#~ echo "CIBLED: $CIBLED_URL"

# Simulate login in the to right window
#~ curl -s --referer https://www.fun-mooc.fr/ 1>/dev/null https://www.fun-mooc.fr/login_ajax -H "X-CSRFToken: 123" -b "csrftoken=123" -d "email=$LOGIN&password=$PASSWORD" --cookie-jar $COOKIES_FILE 1>/dev/null
#~ curl -s --referer $URL 1>/dev/null $URL/login_ajax -H "X-CSRFToken: 123" -b "csrftoken=123" -d "email=$LOGIN&password=$PASSWORD" -c $COOKIES_FILE
curl -s --referer $URL $URL/login_ajax -H "X-CSRFToken: $TOKEN" -d "email=$LOGIN&password=$PASSWORD" -b $COOKIES_FILE  -c $COOKIES_FILE -o /dev/null
TOKEN=$(awk '/csrftoken/{print $7}' $COOKIES_FILE)
#~ cat $COOKIES_FILE
#~ echo "CSRF: $TOKEN"
#~ cat $COOKIES_FILE

#~ curl $CIBLED_URL -b $COOKIES_FILE -H "X-CSRFToken: 123" -b "csrftoken=123"
curl -X POST --referer $URL $URL/$CIBLED_URL -b $COOKIES_FILE -H "X-CSRFToken: $TOKEN" -H "Accept: application/json, text/javascript, */*; q=0.01"
#~ curl $CIBLED_URL -b $COOKIES_FILE -H "X-CSRFToken: $TOKEN"
#~ echo "CSRF='$TOKEN'"

# Delete Cookies file
rm $COOKIES_FILE


#~ sh /home/goudot/Documents/myConnecTech/ProjetMOOCpilot/moocpilot-working/moocpilot/WebContent/ShellScripts/get-reports.sh mooc.imt@gmail.com MOOCpilot@2018 "courses/course-v1:MinesTelecom+04017+session04/instructor/api/list_report_downloads"  https://www.fun-mooc.fr
#~ sh /home/goudot/Documents/myConnecTech/ProjetMOOCpilot/moocpilot-working/moocpilot/WebContent/ShellScripts/get-reports.sh mooc.imt@gmail.com MOOCpilot@2018 "courses/course-v1:IMTx+DMx102+2T2018/instructor/api/list_report_downloads"  https://courses.edx.org

# mooc.imt@gmail.com	MOOCpilot@2018	IMTx	DMx102	2T2018