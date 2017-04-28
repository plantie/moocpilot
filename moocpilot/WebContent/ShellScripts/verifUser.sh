#!/bin/bash
COOKIES_FILE=$(mktemp)
LOGIN=$1
PASSWORD=$2

# Simulate login in the to right window
curl -s --referer https://www.fun-mooc.fr/ https://www.fun-mooc.fr/login_ajax -H "X-CSRFToken: 123" -b "csrftoken=123" -d "email=$LOGIN&password=$PASSWORD" --cookie-jar $COOKIES_FILE
#return "success": true si elle est valide


# Delete Cookies file
rm $COOKIES_FILE
