var gulp        = require('gulp'),
    browserSync = require('browser-sync').create(),
    runSeq      = require('run-sequence'),
    $           = require('gulp-load-plugins')({
                    pattern: ['browser-sync',
                              'del',
                              'gulp-*',
                              'main-bower-files',
                              'wiredep']
                  });

gulp.task('autoprefixer', function() {
  return gulp.src('public/css/main.css')
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('public/css'));
});

gulp.task('babel:dev', function() {
  return gulp.src('src/js/*.js')
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('public/js'));
});

gulp.task('babel:prod', function() {
  return gulp.src('src/js/*.js')
    .pipe($.babel())
    .pipe(gulp.dest('public/js'));
});

gulp.task('bower', function() {
  return gulp.src($.mainBowerFiles('**/*.js'))
    .pipe($.concat('build.js'))
    .pipe(gulp.dest('public/lib'));
});

gulp.task('clean', function() {
  $.del('public');
})

gulp.task('jade:dev', function() {
  gulp.src(['src/**/*.jade', '!src/**/_*.jade'])
    .pipe($.jade({ pretty: true }))
    .pipe(gulp.dest('public'));
});

gulp.task('jade:prod', function() {
  return gulp.src(['src/**/*.jade', '!src/**/_*.jade'])
    .pipe($.jade())
    .pipe(gulp.dest('public'));
});

gulp.task('sass:dev', function() {
  gulp.src('src/_styles/main.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream());
});

gulp.task('sass:prod', function() {
  return gulp.src('src/_styles/main.scss')
    .pipe($.sass({
        outputStyle: 'compressed'
      })
      .on('error', $.sass.logError)
    )
    .pipe(gulp.dest('public/css'));
});

gulp.task('uglify-lib', function() {
  return gulp.src('public/lib/*.js')
    .pipe($.uglify())
    .pipe(gulp.dest('public/lib'));
})

gulp.task('build', ['clean'], function(cb) {
  runSeq([
      'jade:prod',
      'sass:prod',
      'babel:prod',
      'bower'
    ],
    [
      'autoprefixer',
      'uglify-lib'
    ],
    cb);
});

gulp.task('serve', ['jade:dev', 'sass:dev', 'babel:dev'], function() {

  browserSync.init({
    server: {
      baseDir: 'public/'
    }
  });

  gulp.watch('src/**/*.jade', ['jade:dev']);
  gulp.watch('src/**/*.scss', ['sass:dev']);
  gulp.watch('src/**/*.js', ['babel:dev']);
  gulp.watch('src/**/*.scss', ['autoprefixer']);

  gulp.watch(['public/*.html', 'public/*.css', 'public/js/*.js']).on('change', browserSync.reload);
});

gulp.task('default', ['serve']);
