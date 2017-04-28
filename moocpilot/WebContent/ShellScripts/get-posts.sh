#!/bin/bash
COOKIES_FILE=$(mktemp)
LOGIN=$1
PASSWORD=$2
CIBLED_URL=$3

# Simulate login in the to right window
curl -s --referer https://www.fun-mooc.fr/ 1>/dev/null https://www.fun-mooc.fr/login_ajax -H "X-CSRFToken: 123" -b "csrftoken=123" -d "email=$LOGIN&password=$PASSWORD" --cookie-jar $COOKIES_FILE 1>/dev/null

#curl $CIBLED_URL -b $COOKIES_FILE -H "X-CSRFToken: 123" -b "csrftoken=123"
curl $CIBLED_URL -H "Host: www.fun-mooc.fr" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0" -H "Accept: application/json, text/javascript, */*; q=0.01" -H "Accept-Language: fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3" --compressed -H "X-Requested-With: XMLHttpRequest" -H "Connection: keep-alive" -b $COOKIES_FILE -H "X-CSRFToken: 123" -b "csrftoken=123"
#curl $CIBLED_URL -b $COOKIES_FILE -H "X-CSRFToken: 123" -b "csrftoken=123"

# Delete Cookies file
rm $COOKIES_FILE
