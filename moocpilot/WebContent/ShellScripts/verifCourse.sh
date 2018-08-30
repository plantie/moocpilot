#!/bin/bash
COOKIES_FILE=$(mktemp)
LOGIN=$1
PASSWORD=$2
CIBLED_URL=$3
URL=$4

echo "verifCourse	$LOGIN	$PASSWORD	$CIBLED_URL	$URL" >> /tmp/mooc.log

curl -s --referer $URL/ $URL/ -c $COOKIES_FILE -o /dev/null
#~ curl -s --referer $URL/ $URL/login_ajax -H "X-CSRFToken: 123" -b "csrftoken=123" -d "email=$LOGIN&password=$PASSWORD" --cookie-jar $COOKIES_FILE
TOKEN=$(awk '/csrftoken/{print $7}' $COOKIES_FILE)
#~ cat $COOKIES_FILE
#~ echo "CSRF: $TOKEN"
#~ echo "CIBLED: $CIBLED_URL"

# Simulate login in the to right window
#~ curl -s --referer https://www.fun-mooc.fr/ 1>/dev/null https://www.fun-mooc.fr/login_ajax -H "X-CSRFToken: 123" -b "csrftoken=123" -d "email=$LOGIN&password=$PASSWORD" --cookie-jar $COOKIES_FILE 1>/dev/null
curl -s --referer $URL $URL/login_ajax -H "X-CSRFToken: $TOKEN" -d "email=$LOGIN&password=$PASSWORD" -b $COOKIES_FILE -o /dev/null

#~ curl $CIBLED_URL -b $COOKIES_FILE -H "X-CSRFToken: 123" -b "csrftoken=123"
curl -s --referer $URL $URL/$CIBLED_URL -H "X-CSRFToken: $TOKEN" -b $COOKIES_FILE
#https://www.fun-mooc.fr/courses/MinesTelecom/04003S05/session05/instructor/api/list_report_downloads
#contient <!DOCTYPE html> si false


# Delete Cookies file
rm $COOKIES_FILE


# sh /home/goudot/Documents/myConnecTech/ProjetMOOCpilot/moocpilot-working/moocpilot/WebContent/ShellScripts/verifCourse.sh mooc.imt@gmail.com MOOCpilot@2018 courses/course-v1:MinesTelecom+04017+session04/instructor/api/list_report_downloads  https://www.fun-mooc.fr
