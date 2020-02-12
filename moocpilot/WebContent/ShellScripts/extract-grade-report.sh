#!/bin/bash
#!/bin/bash
COOKIES_FILE=$(mktemp)
LOGIN=$1
PASSWORD=$2
REPORT_NAME=$3
COURSE_ID=$4
PLATFORM_URL=$5

echo "extract-grade-report	$LOGIN	$PASSWORD	$COURSE_ID	$PLATFORM_URL" >> /tmp/mooc.log

################### Login
curl -s --referer $PLATFORM_URL $PLATFORM_URL -c $COOKIES_FILE -o /dev/null
TOKEN=$(awk '/csrftoken/{print $7}' $COOKIES_FILE)

LOGIN_URL="${PLATFORM_URL}login_ajax"
curl -s --referer $PLATFORM_URL $LOGIN_URL -d "email=$LOGIN&password=$PASSWORD&csrfmiddlewaretoken=$TOKEN" -b $COOKIES_FILE -c $COOKIES_FILE -o /dev/null
TOKEN=$(awk '/csrftoken/{print $7}' $COOKIES_FILE)
#################### End Login


# Get a the report list and find the right report URL (there is a time based token on the URL now)

MOOC_URL=${PLATFORM_URL}courses/$COURSE_ID

REPORT_URL=$(curl -s --referer $MOOC_URL/instructor#view-data_download -b $COOKIES_FILE --request POST $MOOC_URL/instructor/api/list_report_downloads -H "X-CSRFToken: $TOKEN" -b $COOKIES_FILE | jq -r '.downloads[] | select (.name | contains("'${REPORT_NAME}'")) | .url')

[[ $REPORT_URL =~ ^/.* ]] && REPORT_URL=${PLATFORM_URL::-1}$REPORT_URL

curl -s --referer $PLATFORM_URL $REPORT_URL -b $COOKIES_FILE