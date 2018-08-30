#!/bin/bash
COOKIES_FILE=$(mktemp)
LOGIN=$1
PASSWORD=$2
URL=$3

echo "verifUser	$LOGIN	$PASSWORD	$URL" >> /tmp/mooc.log

#~ echo "URL: ${URL}"

# Simulate login in the to right window
#~ curl -s --referer https://www.fun-mooc.fr/ https://www.fun-mooc.fr/login_ajax -H "X-CSRFToken: 123" -b "csrftoken=123" -d "email=$LOGIN&password=$PASSWORD" --cookie-jar $COOKIES_FILE
#return "success": true si elle est valide

curl -s --referer $URL/ $URL/ -c $COOKIES_FILE -o /dev/null
#~ curl -s --referer $URL/ $URL/login_ajax -H "X-CSRFToken: 123" -b "csrftoken=123" -d "email=$LOGIN&password=$PASSWORD" --cookie-jar $COOKIES_FILE
TOKEN=$(awk '/csrftoken/{print $7}' $COOKIES_FILE)
#~ cat $COOKIES_FILE
#~ echo "CSRF: $TOKEN"

curl -s --referer $URL/ $URL/login_ajax -H "X-CSRFToken: $TOKEN" -d "email=$LOGIN&password=$PASSWORD" -b $COOKIES_FILE


# Delete Cookies file
rm $COOKIES_FILE



### EDX

#LOGIN=mooc.imt@gmail.com
#PASSWORD=MOOCpilot@2018
#URL=https://courses.edx.org/

#URL=https://www.fun-mooc.fr/

# 1) recup cooky (-c write cooky file)
# curl -s --referer $URL $URL -c /tmp/COOKIES

# 2) get cooky 
# grep csrftoken /tmp/COOKIES
# courses.edx.org	FALSE	/	TRUE	1562607215	csrftoken	iyPOUnrB5xz2nqzXieHj8RwhJVKUwIGBKkUTlWNWp30Gw9EA2tips5GUSvLpLT6A

# 3) request... (-b read cooky file)
# curl -s --referer $URL ${URL}login_ajax -H "X-CSRFToken: iyPOUnrB5xz2nqzXieHj8RwhJVKUwIGBKkUTlWNWp30Gw9EA2tips5GUSvLpLT6A" -d "email=$LOGIN&password=$PASSWORD" -b /tmp/COOKIES
