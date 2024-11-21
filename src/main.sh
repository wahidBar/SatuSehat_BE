#!/bin/bash
# echo "Today is " `date`


#looing
# for i in {1..5}
# do
#   echo "Welcome $i times"
# done


# for FILE in s3://payload-interoperabilitas
# do
#   echo "ok";
# done

node main.js


flist=$(aws s3 ls s3://payload-interoperabilitas/ | awk '{print $4}' )
for file in $flist
do {
# mengirim file json ke satu sehat   
curl -X POST http://54.254.253.67:5000


# memindah file json ke bucket lain (sukses)
 aws s3 mv s3://payload-interoperabilitas/$file s3://payload-output/
}
done


aws s3 ls s3://payload-output


#kirim payload ke satu sehat
# node testing.js


#pindahkan file payload yang telah dikirim ke folder output
# aws s3 mv s3://payload-interoperabilitas/payload.json s3://payload-output/

#cek apakah file nya sudah tidak ada
# aws s3 ls s3://payload-interoperabilitas

#cek apakah file nya sudah pindah ke folder baru
# aws s3 ls s3://payload-output

#hapus file yang telah dikirimkan
# aws s3 rm s3://payload-interoperabilitas/payload.json

# aws s3 ls s3://payload-output --recursive