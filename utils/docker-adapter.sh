#!/bin/bash

set -x

cur=`dirname "$0"`

if [ "$BUILD_IMAGE" == "Y" ]; then
	echo "converting images"
	$cur/image-convert.sh
fi

sed -ie "s/Happy Wedding/$TITLE/g" $cur/../dist/public/index.html

cd $cur/../
npm start
