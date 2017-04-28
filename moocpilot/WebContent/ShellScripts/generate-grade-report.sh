#!/bin/bash
COOKIES_FILE=$(mktemp)
LOGIN=$1
PASSWORD=$2
MOOC_URL=$3

# Simulate login in the to right window
curl -s --referer https://www.fun-mooc.fr/ 1>/dev/null https://www.fun-mooc.fr/login_ajax -H "X-CSRFToken: 123" -b "csrftoken=123" -d "email=$LOGIN&password=$PASSWORD" --cookie-jar $COOKIES_FILE 1>/dev/null


# Simulate click on the "Generate Grade Report" button
curl --referer $MOOC_URL/instructor#view-data_download/ -b $COOKIES_FILE --request POST  $MOOC_URL/instructor/api/calculate_grades_csv -H "X-CSRFToken: 123" -b "csrftoken=123"

rm $COOKIES_FILE
