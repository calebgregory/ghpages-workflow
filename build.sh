#!/bin/sh

# clean and prepare public directory
rm -rf public
mkdir public

# compile jade to html ( -P : prettify )
./node_modules/.bin/jade src -P
cd src
find . -name "*.html" | cpio -pdvm ../public
cd ..
rm -rf src/**/*.html public/**/_*.html public/_partials
