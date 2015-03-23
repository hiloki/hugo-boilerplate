var gulp         = require('gulp');
var concat       = require('gulp-concat');
var csscomb      = require('gulp-csscomb');
var csso         = require('gulp-csso');
var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer-core');
var mqpacker     = require('css-mqpacker');
var sequence     = require('run-sequence').use(gulp);

var LIB_JS_FILES = [
  'bower_components/jquery/dist/jquery.min.js'
];

var APP_JS_FILES = [
  'static/js/app.js'
];

var LIB_CSS_FILES = [
  'bower_components/normalize.css/normalize.css',
  'bower_components/highlight.js/src/styles/solarized_light.css'
];

var APP_CSS_FILES = [
  'static/css/app.css'
];

gulp.task('watch', function () {
  gulp.watch(APP_JS_FILES, function () {
    gulp.start('js:app');
  });

  gulp.watch(APP_CSS_FILES, function () {
    gulp.start('css:app');
  });
});

gulp.task('build', function () {
  sequence('js', 'css');
});

gulp.task('js', function () {
  gulp.start('js:lib', 'js:app');
});

gulp.task('css', function () {
  gulp.start('css:lib', 'css:app');
});

gulp.task('js:lib', function () {
  gulp.src(LIB_JS_FILES)
    .pipe(concat('lib.min.js'))
    .pipe(gulp.dest('_public/js'));
});

gulp.task('js:app', function () {
  var uglify = require('gulp-uglify');

  gulp.src(APP_JS_FILES)
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('_public/js'));
});

gulp.task('css:lib', function () {
  gulp.src(LIB_CSS_FILES)
    .pipe(concat('lib.min.css'))
    .pipe(csscomb())
    .pipe(csso())
    .pipe(gulp.dest('_public/css'));
});

gulp.task('css:app', function () {
  var processors = [
    autoprefixer({browsers: ['last 2 version']}),
    mqpacker
  ];

  gulp.src(APP_CSS_FILES)
    .pipe(concat('app.min.css'))
    .pipe(postcss(processors))
    .pipe(csscomb())
    .pipe(csso())
    .pipe(gulp.dest('_public/css'));
});
