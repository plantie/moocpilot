#!/bin/bash
COOKIES_FILE=$(mktemp)
LOGIN=$1
PASSWORD=$2
MOOC_URL=$3
URL=$4
#MOOC_URL=https://courses.edx.org/courses/course-v1:IMTx+NET01x+1T2017
MOOC_BASE=https://courses.edx.org/login?next=/dashboard

echo "generate-grade-report	$LOGIN	$PASSWORD	$MOOC_URL	$URL" >> /tmp/mooc.log

curl -s --referer $URL/ $URL/ -c $COOKIES_FILE -o /dev/null
#~ curl -s --referer $URL/ $URL/login_ajax -H "X-CSRFToken: 123" -b "csrftoken=123" -d "email=$LOGIN&password=$PASSWORD" --cookie-jar $COOKIES_FILE
TOKEN=$(awk '/csrftoken/{print $7}' $COOKIES_FILE)
#~ cat $COOKIES_FILE
#~ echo "CSRF: $TOKEN file $COOKIES_FILE"
#~ echo "CIBLED: $CIBLED_URL"

# Simulate login in the to right window
#~ curl -s --referer https://www.fun-mooc.fr/ 1>/dev/null https://www.fun-mooc.fr/login_ajax -H "X-CSRFToken: 123" -b "csrftoken=123" -d "email=$LOGIN&password=$PASSWORD" --cookie-jar $COOKIES_FILE 1>/dev/null
#~ curl -s --referer $URL 1>/dev/null $URL/login_ajax -H "X-CSRFToken: 123" -b "csrftoken=123" -d "email=$LOGIN&password=$PASSWORD" -c $COOKIES_FILE
curl -s --referer $URL $URL/login_ajax -H "X-CSRFToken: $TOKEN" -d "email=$LOGIN&password=$PASSWORD" -b $COOKIES_FILE  -c $COOKIES_FILE -o /dev/null
TOKEN=$(awk '/csrftoken/{print $7}' $COOKIES_FILE)
#~ cat $COOKIES_FILE
#~ echo "CSRF: $TOKEN"
#~ cat $COOKIES_FILE


# Open the welcome page to initiate seesion cookies
#~ curl -s --cookie-jar $COOKIES_FILE $MOOC_BASE 1>/dev/null

# Simulate login in the to right window
#~ curl -s --referer $MOOC_BASE 1>/dev/null -v https://courses.edx.org/user_api/v1/account/login_session/ 1>/dev/null -H "X-CSRFToken: 123" -b "csrftoken=123" -d "email=$LOGIN&password=$PASSWORD" --cookie-jar $COOKIES_FILE 1>/dev/null

# Simulate click on the "Generate Grade Report" button
#~ curl --referer $URL/$MOOC_URL/instructor#view-data_download -b $COOKIES_FILE --request POST $URL/$MOOC_URL/instructor/api/calculate_grades_csv -H "X-CSRFToken: $TOKEN"
#~ curl  -H "$H1" -H "$H2" $URL/$MOOC_URL/instructor/api/calculate_grades_csv -H "X-CSRFToken: $TOKEN" -H 'X-Requested-With: XMLHttpRequest' -b $COOKIES_FILE --data ''
#~ https://courses.edx.org/courses/course-v1:IMTx+DMx102+2T2018/instructor/api/calculate_grades_csv
curl $URL/$MOOC_URL/instructor/api/calculate_grades_csv\
	-H 'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0'\
	-H 'Accept: application/json, text/javascript, */*; q=0.01'\
	-H 'Accept-Language: en-GB,en;q=0.5'\
	-H "Referer: $URL/$MOOC_URL/instructor"\
	-H "X-CSRFToken: $TOKEN"\
	-H 'X-Requested-With: XMLHttpRequest'\
	-H 'Connection: keep-alive' \
	--data ''\
	-b $COOKIES_FILE
	#~ --compressed\
	#~ -H 'Cookie: optimizelyEndUserId=oeu1508138278033r0.9673622918416198; ajs_user_id=%2218847226%22; ajs_group_id=null; ajs_anonymous_id=%222d3e4e3b-aca3-4a6d-b554-61c7f5c087e8%22; _ga=GA1.2.1194468948.1508138278; sailthru_hid=678502b76bd85f2587e6a08a401a2bf45ace3f5352ba1e507957bfe4e5f106256497f28941178f1457539f76; prod-edx-csrftoken=YrgL3bYRwiy4v4E9yx81yiiTslAyhDjItCOwhguMAZaWo34nuOFfhXYanMHbetay; csrftoken=tWQtpTfigs9CfCvVcEScNr4GSOn6ESyAUlCVo4iTHMGtCPTTbtdSQGDHSHJ1u6dZ; __cfduid=d05d54c688f9da45f41c86820fedff3511526551546; ki_t=1527529172367%3B1531380231758%3B1531389188122%3B11%3B61; ki_r=; prod.edx.utm={"utm_source":"course-email","utm_medium":"partner-marketing","utm_campaign":"imtx","utm_content":"fun-course-mailing-arduino","created_at":1527630310054}; prod-edx-cookie-policy-viewed=true; experiments_is_enterprise=false; __utma=201676869.1194468948.1508138278.1530771207.1530771207.1; __utmz=201676869.1530771207.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _gid=GA1.2.1526235371.1531380232; prod-edx-sessionid="1|sopts6bq87klny76ly5pm9t4epoansv7|cfOIedXnSl3j|IjA2N2UyOGVkNWE1YjI0MmI0NTBkYWFiMjUyZWNiZTA2OWFiNGE1NDNkYmQ1ZDc3NzRlMTU2N2ZjMWI2NGE4MzIi:1fdY9o:D3d7Fexsc1C_ryWI33mBu7q9f6M"; edxloggedin=true; prod-edx-language-preference=en; prod-edx-user-info="{\"username\": \"MOOCpilot\"\054 \"version\": 1\054 \"enrollmentStatusHash\": \"c4216a71e945848281717a5ce37d8ab7\"\054 \"header_urls\": {\"learner_profile\": \"https://courses.edx.org/u/MOOCpilot\"\054 \"resume_block\": \"https://courses.edx.org/courses/course-v1:IMTx+DMx102+2T2018/jump_to/block-v1:IMTx+DMx102+2T2018+type@html+block@c55a87af50ca480989533ff1d89b2e5d\"\054 \"logout\": \"https://courses.edx.org/logout\"\054 \"account_settings\": \"https://courses.edx.org/account/settings\"}}"; AWSELB=D1EF6B6510E347E5B895826CD53CF4FD55E0CFA9A9FFA4D0509C04A79307C543BC7A564BF3088B022E408581E377AF28ABEFDC2ECB583EAE591F65FD084E6693F1009EDC31; _gat=1; _gali=data_download'

rm $COOKIES_FILE

#~ curl $URL/$CIBLED_URL -H '$H1' -H '$H2' --compressed -H 'X-CSRFToken: $TOKEN' -H 'X-Requested-With: XMLHttpRequest'    -b $COOKIES_FILE
