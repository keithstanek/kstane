#!/bin/sh

directory=$1
buildNo=$2

echo "directory [$directory] buildNo [$buildNo]"
echo ""

zip -r "$directory-$buildNo.zip" $directory/ -x "$directory/platforms/*" "$directory/.git/*"
