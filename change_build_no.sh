#!/bin/sh

versionNo=`awk '/ios-CFBundleVersion/ {print $4}' FS='"' whatta-burger/config.xml`

echo "versionNo [$versionNo]"
versionNo=$(($versionNo+1))
echo "new versionNo [$versionNo]"
echo ""
echo "Replacing iOs version number"
sed -i "s/ios-CFBundleVersion=\"107\"/ios-CFBundleVersion=\"$versionNo\"/g" */config.xml 
