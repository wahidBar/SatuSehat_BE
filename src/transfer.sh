#!/bin/bash

# CURRENTDATE=`date +"%Y-%m-%d %T"`
# echo ${CURRENTDATE}


START_DATE_TIME=`date +"%Y-%m-%d %T"`
END_DATE_TIME=`date -d "$dd 8 hour" "+%Y-%m-%d %H:%M:%S"`
echo ${START_DATE_TIME}
echo ${END_DATE_TIME}

# WIB jam minus 7
# UPDATE_DATE=`date -d "$dd 1 hour" "+%Y-%m-%d %H:%M:%S"`
# echo ${UPDATE_DATE}

node main.js

# membaca file json di direktori payload
flist=$(ls payload )
for file in $flist
do {
  #menuliskan file json  
  echo $file
  
  #memindah file json ke aws s3
  aws s3 cp payload/$file s3://payload-interoperabilitas/ 
  
}
done

echo "finished"


