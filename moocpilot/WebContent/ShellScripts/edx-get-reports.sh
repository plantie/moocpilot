#!/bin/bash
COOKIES_FILE=$(mktemp)
LOGIN=$1
PASSWORD=$2
MOOC_URL=$3
#MOOC_URL=https://courses.edx.org/courses/course-v1:IMTx+NET01x+1T2017
MOOC_BASE=https://courses.edx.org/login?next=/dashboard

# Open the welcome page to initiate seesion cookies
curl -s --cookie-jar $COOKIES_FILE $MOOC_BASE 1>/dev/null

# Simulate login in the to right window
curl -s --referer $MOOC_BASE 1>/dev/null -v https://courses.edx.org/user_api/v1/account/login_session/ 1>/dev/null -H "X-CSRFToken: 123" -b "csrftoken=123" -d "email=$LOGIN&password=$PASSWORD" --cookie-jar $COOKIES_FILE 1>/dev/null

# Simulate click on the "Generate Grade Report" button
curl --referer $MOOC_URL/instructor#view-data_download -b $COOKIES_FILE --request POST $MOOC_URL/instructor/api/list_report_downloads -H "X-CSRFToken: 123" -b "csrftoken=123"

# Delete Cookies file
rm $COOKIES_FILE