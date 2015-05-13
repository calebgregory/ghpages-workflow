#!/bin/sh

# clean and prepare public directory
rm -rf public
mkdir public

# compile jade to html ( -P : prettify )
./node_modules/.bin/jade src -P
cd src
find . -name "*.html" | cpio -pdvm ../public
cd ..
rm -rf src/**/*.html \
       src/*.html \
       public/**/_*.html \
       public/_partials

# compile sass to css
./node_modules/.bin/node-sass \
  --output-style compressed \
  --source-map-embed \
  src/_styles/main.scss public/css/main.css

# convert ES6 JS to ES5

./node_modules/.bin/babel src --out-dir public -s inline
