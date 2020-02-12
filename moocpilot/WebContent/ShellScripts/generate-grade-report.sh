#!/bin/bash
COOKIES_FILE=$(mktemp)
LOGIN=$1
PASSWORD=$2
COURSE_ID=$3
PLATFORM_URL=$4

echo "generate-grade-report	$LOGIN	$PASSWORD	$COURSE_ID	$PLATFORM_URL" >> /tmp/mooc.log

################### Login
curl -s --referer $PLATFORM_URL $PLATFORM_URL -c $COOKIES_FILE -o /dev/null
TOKEN=$(awk '/csrftoken/{print $7}' $COOKIES_FILE)

LOGIN_URL="${PLATFORM_URL}login_ajax"
curl -s --referer $PLATFORM_URL $LOGIN_URL -d "email=$LOGIN&password=$PASSWORD&csrfmiddlewaretoken=$TOKEN" -b $COOKIES_FILE -c $COOKIES_FILE -o /dev/null
TOKEN=$(awk '/csrftoken/{print $7}' $COOKIES_FILE)
#################### End Login

MOOC_REAL_URL=${PLATFORM_URL}courses/$COURSE_ID
curl -s --referer $MOOC_REAL_URL/instructor#view-data_download -b $COOKIES_FILE --request POST $MOOC_REAL_URL/instructor/api/calculate_grades_csv -H "X-CSRFToken: $TOKEN" -b $COOKIES_FILE

rm $COOKIES_FILE

#~ curl $URL/$CIBLED_URL -H '$H1' -H '$H2' --compressed -H 'X-CSRFToken: $TOKEN' -H 'X-Requested-With: XMLHttpRequest'    -b $COOKIES_FILE
