#!/bin/bash

set -x
cur=`dirname "$0"`
src=$cur/../src/public/images/*
dst=$cur/../dist/public/images

rm -rf $dst
mkdir -p $dst/normal
mkdir -p $dst/blur
cp -vR $src $dst

for i in `ls $dst`; do
	[ -d $dst/$i ] && continue
  gm convert -size 1280x1280 $dst/$i -resize 1280x1280 $dst/normal/$i
  gm convert $dst/normal/$i -blur 0x4 $dst/blur/$i
	rm -f $dst/$i;
done
