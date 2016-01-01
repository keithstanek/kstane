#!/bin/sh

directory=$1

buildNo=`cat build_no.txt`
buildNo=$(($buildNo+1))
`echo $buildNo > build_no.txt`

echo "directory [$directory] buildNo [$buildNo]"
echo ""

zip -r "../target/$directory-$buildNo.zip" ../$directory/ -x "../$directory/platforms/*" "../$directory/.git/*"
