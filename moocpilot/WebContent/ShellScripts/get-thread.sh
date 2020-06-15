#!/bin/bash
COOKIES_FILE=$(mktemp)
LOGIN=$1
PASSWORD=$2
COURSE_ID=$3
THREAD_URI=$4
PLATFORM_URL=$5


echo "get-threads	$LOGIN	$PASSWORD	$COURSE_ID	$PLATFORM_URL" >> /tmp/mooc.log

################### Login
curl -s --referer $PLATFORM_URL $PLATFORM_URL -c $COOKIES_FILE -o /dev/null
TOKEN=$(awk '/csrftoken/{print $7}' $COOKIES_FILE)

LOGIN_URL="${PLATFORM_URL}login_ajax"
curl -s --referer $PLATFORM_URL $LOGIN_URL -d "email=$LOGIN&password=$PASSWORD&csrfmiddlewaretoken=$TOKEN" -b $COOKIES_FILE -c $COOKIES_FILE -o /dev/null
TOKEN=$(awk '/csrftoken/{print $7}' $COOKIES_FILE)
#################### End Login

#~ cat $COOKIES_FILE
#~ echo "CSRF: $TOKEN"
#~ cat $COOKIES_FILE

# TODO: fix forum thread actions
exit


FORUM_URL=${PLATFORM_URL}/courses/$COURSE_ID/discussion/forum
H1="User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
H2="Accept: application/json, text/javascript, */*; q=0.01"
H3="Accept-Language: en-GB,en;q=0.5"
H3="Accept-Language: fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3"
H4="Referer: $FORUM_URL"

PARAMS_AJAX="?ajax=1&resp_skip=0&resp_limit=25"
curl -s $FORUM_URL/${THREAD_URI}$PARAMS_AJAX -H '$H1' -H '$H2' --compressed -H 'X-CSRFToken: $TOKEN' -H 'X-Requested-With: XMLHttpRequest'    -b $COOKIES_FILE

# Delete Cookies file
rm $COOKIES_FILE
