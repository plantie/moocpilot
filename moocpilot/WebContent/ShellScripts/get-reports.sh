#!/bin/bash
COOKIES_FILE=$(mktemp)
LOGIN=$1
PASSWORD=$2
COURSE_ID=$3
PLATFORM_URL=$4

echo "get-reports	$LOGIN	$PASSWORD	$COURSE_ID $CIBLED_URL	$PLATFORM_URL" >> /tmp/mooc.log

################### Login
curl -s --referer $PLATFORM_URL $PLATFORM_URL -c $COOKIES_FILE -o /dev/null
TOKEN=$(awk '/csrftoken/{print $7}' $COOKIES_FILE)

LOGIN_URL="${PLATFORM_URL}login_ajax"
curl -s --referer $PLATFORM_URL $LOGIN_URL -d "email=$LOGIN&password=$PASSWORD&csrfmiddlewaretoken=$TOKEN" -b $COOKIES_FILE -c $COOKIES_FILE -o /dev/null
TOKEN=$(awk '/csrftoken/{print $7}' $COOKIES_FILE)
#################### End Login


REPORT_DL_PAGE=${PLATFORM_URL}courses/$COURSE_ID/instructor/api/list_report_downloads
curl -X POST --referer $PLATFORM_URL $REPORT_DL_PAGE -b $COOKIES_FILE -H "X-CSRFToken: $TOKEN" -H "Accept: application/json, text/javascript, */*; q=0.01"

rm $COOKIES_FILE
