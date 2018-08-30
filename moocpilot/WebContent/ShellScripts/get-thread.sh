#!/bin/bash
COOKIES_FILE=$(mktemp)
LOGIN=$1
PASSWORD=$2
CIBLED_URL=$3
URL=$4

echo "get-thread	$LOGIN	$PASSWORD	$CIBLED_URL	$URL" >> /tmp/mooc.log

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

H1="User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
H2="Accept: application/json, text/javascript, */*; q=0.01"
H3="Accept-Language: en-GB,en;q=0.5"
H3="Accept-Language: fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3"
H4="Referer: https://courses.edx.org/courses/course-v1:IMTx+DMx102+2T2018/discussion/forum/"


# Simulate login in the to right window
#~ curl -s --referer https://www.fun-mooc.fr/ 1>/dev/null https://www.fun-mooc.fr/login_ajax -H "X-CSRFToken: 123" -b "csrftoken=123" -d "email=$LOGIN&password=$PASSWORD" --cookie-jar $COOKIES_FILE 1>/dev/null

#curl $CIBLED_URL -b $COOKIES_FILE -H "X-CSRFToken: 123" -b "csrftoken=123"
#curl "https://www.fun-mooc.fr/courses/MinesTelecom/04003S05/session05/discussion/forum/a0c2f24e13b947e3b754ad1c87781714/threads/57f56b401a28e37b7b000146?ajax=1&resp_skip=0&resp_limit=25" -H "Host: www.fun-mooc.fr" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0" -H "Accept: application/json, text/javascript, */*; q=0.01" -H "Accept-Language: fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3" --compressed -H "X-Requested-With: XMLHttpRequest" -H "Connection: keep-alive" -b $COOKIES_FILE -H "X-CSRFToken: 123" -b "csrftoken=123" >> output2.txt
#~ curl $CIBLED_URL -H "Host: www.fun-mooc.fr" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0" -H "Accept: application/json, text/javascript, */*; q=0.01" -H "Accept-Language: fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3" --compressed -H "X-Requested-With: XMLHttpRequest" -H "Connection: keep-alive" -b $COOKIES_FILE -H "X-CSRFToken: 123" -b "csrftoken=123"
curl $URL/$CIBLED_URL -H '$H1' -H '$H2' --compressed -H 'X-CSRFToken: $TOKEN' -H 'X-Requested-With: XMLHttpRequest'    -b $COOKIES_FILE
#~ curl $URL/$CIBLED_URL -H "Host: www.fun-mooc.fr" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0" -H "Accept: application/json, text/javascript, */*; q=0.01" -H "Accept-Language: fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3" --compressed -H "X-Requested-With: XMLHttpRequest" -H "Connection: keep-alive" -b $COOKIES_FILE -H "X-CSRFToken: $TOKEN"
#curl $CIBLED_URL -b $COOKIES_FILE -H "X-CSRFToken: 123" -b "csrftoken=123"

# Delete Cookies file
rm $COOKIES_FILE
