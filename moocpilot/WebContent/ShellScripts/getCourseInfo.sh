#!/bin/bash
COOKIES_FILE=$(mktemp)
LOGIN=$1
PASSWORD=$2
CIBLED_URL=$3
URL=$4

echo "getCourseInfo	$LOGIN	$PASSWORD	$CIBLED_URL	$URL" >> /tmp/mooc.log

curl -s --referer $URL/ $URL/ -c $COOKIES_FILE -o /dev/null
TOKEN=$(awk '/csrftoken/{print $7}' $COOKIES_FILE)

echo $TOKEN $LOGIN $PASSWORD $URL/$CIBLED_URL

# Simulate login in the to right window
curl -s --referer $URL $URL/login_ajax -H "X-CSRFToken: $TOKEN" -d "email=$LOGIN&password=$PASSWORD" -b $COOKIES_FILE  -c $COOKIES_FILE -o /dev/null
TOKEN=$(awk '/csrftoken/{print $7}' $COOKIES_FILE)
curl -s --referer $URL $URL/$CIBLED_URL -H "X-CSRFToken: $TOKEN" -b $COOKIES_FILE

# Delete Cookies file
rm $COOKIES_FILE


# ./getCourseInfo.sh mooc.imt@gmail.com MOOCpilot@2018 courses/course-v1:MinesTelecom+04003+session07/instructor#view-course_info  https://www.fun-mooc.fr
