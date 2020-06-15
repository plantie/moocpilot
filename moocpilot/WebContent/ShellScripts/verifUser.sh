#!/bin/bash
COOKIES_FILE=$(mktemp)
LOGIN=$1
PASSWORD=$2
PLATFORM_URL=$3

echo "verifUser	$LOGIN	$PASSWORD	$PLATFORM_URL" >> /tmp/mooc.log
################### Login
curl -s --referer $PLATFORM_URL $PLATFORM_URL -c $COOKIES_FILE -o /dev/null
TOKEN=$(awk '/csrftoken/{print $7}' $COOKIES_FILE)

LOGIN_URL="${PLATFORM_URL}login_ajax"
curl -s --referer $PLATFORM_URL $LOGIN_URL -d "email=$LOGIN&password=$PASSWORD&csrfmiddlewaretoken=$TOKEN" -b $COOKIES_FILE -c $COOKIES_FILE
TOKEN=$(awk '/csrftoken/{print $7}' $COOKIES_FILE)
#################### End Login

# Delete Cookies file
rm $COOKIES_FILE



# Alternative login method with edX
# Open the welcome page to initiate seesion cookies
#curl -s -c $COOKIES_FILE $URL_BASE -o /dev/null
#TOKEN=$(awk '/csrftoken/{print $7}' $COOKIES_FILE)
# Simulate login in the to right window
#curl -s --referer $URL_BASE $URL_BASE/user_api/v1/account/login_session/ \
#        -H "X-CSRFToken: $TOKEN" -d "email=$LOGIN&password=$PASSWORD" -b $COOKIES_FILE  -c $COOKIES_FILE
#TOKEN=$(awk '/csrftoken/{print $7}' $COOKIES_FILE)
#End Login