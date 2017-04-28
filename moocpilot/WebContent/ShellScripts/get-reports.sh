#!/bin/bash
COOKIES_FILE=$(mktemp)
LOGIN=$1
PASSWORD=$2
CIBLED_URL=$3

# Simulate login in the to right window
curl -s --referer https://www.fun-mooc.fr/ 1>/dev/null https://www.fun-mooc.fr/login_ajax -H "X-CSRFToken: 123" -b "csrftoken=123" -d "email=$LOGIN&password=$PASSWORD" --cookie-jar $COOKIES_FILE 1>/dev/null

curl $CIBLED_URL -b $COOKIES_FILE -H "X-CSRFToken: 123" -b "csrftoken=123"

# Delete Cookies file
rm $COOKIES_FILE
