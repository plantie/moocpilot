#!/bin/bash
COOKIES_FILE=$(mktemp)
LOGIN=$1
PASSWORD=$2
COURSE_ID=$3
PLATFORM_URL=$4

echo "getCourseInfo	$LOGIN	$PASSWORD	$COURSE_ID	$PLATFORM_URL" >> /tmp/mooc.log

################### Login
curl -s --referer $PLATFORM_URL $PLATFORM_URL -c $COOKIES_FILE -o /dev/null
TOKEN=$(awk '/csrftoken/{print $7}' $COOKIES_FILE)

LOGIN_URL="${PLATFORM_URL}login_ajax"
curl -s --referer $PLATFORM_URL $LOGIN_URL -d "email=$LOGIN&password=$PASSWORD&csrfmiddlewaretoken=$TOKEN" -b $COOKIES_FILE -c $COOKIES_FILE -o /dev/null
TOKEN=$(awk '/csrftoken/{print $7}' $COOKIES_FILE)
#################### End Login

COURSE_INFO_PAGE=${PLATFORM_URL}courses/$COURSE_ID/instructor#view-course_info
curl -s --referer $PLATFORM_URL  $COURSE_INFO_PAGE -b $COOKIES_FILE

# Delete Cookies file
rm $COOKIES_FILE
