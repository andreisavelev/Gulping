"use strict";

var gulp 			= require("gulp"),
	less 			= require("gulp-less"),
	gutil           = require('gulp-util'),
	cssMinify 		= require("gulp-minify-css"),
	jsUglify 		= require("gulp-uglify"),
	concat 			= require("gulp-concat"),
	rev 			= require('gulp-rev'),
	revCollector 	= require("gulp-rev-collector"),
	revOutdated     = require('gulp-rev-outdated'),
	connect 		= require("gulp-connect"),
	path 			= require("path"),
	opn 			= require("opn"),
	rimraf          = require('rimraf'),
	through         = require('through2');

function cleaner() {
    return through.obj(function(file, enc, cb){
        rimraf( path.resolve( (file.cwd || process.cwd()), file.path), function (err) {
            if (err) {
                this.emit('error', new gutil.PluginError('Cleanup old files', err));
            }
            this.push(file);
            cb();
        }.bind(this));
    });
};



// Компиляция LESS
gulp.task("lessCompile", function () {
	return gulp.src(["./src/bower/bootstrap/less/bootstrap.less", "./src/less/*.less"])
				.pipe(concat("style.less"))
				.pipe(less({
					paths: [ path.join(__dirname), "less", "includes" ]
				}))
				.pipe(cssMinify())
				.pipe(gulp.dest("./app/assets/css/"))
});

// Версионирование подключаемых фалов
gulp.task("revCss", function () {
	return gulp.src(["./src/bower/bootstrap/less/bootstrap.less", "./src/less/*.less"])
				.pipe(concat("style.less"))
				.pipe(less({
					paths: [ path.join(__dirname), "less", "includes" ]
				}))
				.pipe(cssMinify())
				.pipe(rev())
				.pipe(gulp.dest("./app/assets/css/"))
				.pipe(rev.manifest())
				.pipe(gulp.dest("./src/manifest/"))
});

gulp.task('revCollector', ["revCss"], function () {
    return gulp.src(['./src/manifest/*.json', './app/*.html'])
		        .pipe( revCollector({
		            replaceReved: true
		        }))
		        .pipe( gulp.dest('./app/') );
});

gulp.task('clean', function() {
    gulp.src( ['./app/assets/css/*.css'], {read: false})
        .pipe( revOutdated( ) ) // leave 1 latest asset file for every file name prefix.
        .pipe( cleaner() );

    return;
});

// Сжатие js
gulp.task("jsCompress", function () {
	gulp.src(["./src/bower/requirejs/require.js"])
			.pipe(jsUglify())
			.pipe(gulp.dest("./app/assets/js/"))
});

// Запускаем локальный сервер
gulp.task('connect', function() {
  connect.server({
    root: './app',
    livereload: true,
    port: 5555
  });
  opn("http://localhost:5555");
});


// Работа с HTML
gulp.task('html', function () {
  gulp.src('./app/*.html')
    .pipe(connect.reload());
});

// Работа с CSS
gulp.task('css', function () {
  gulp.src('./app/assets/css/style.min.css')
    .pipe(connect.reload());
});

// Работа с JS
gulp.task('js', function () {
  gulp.src('./app/assets/js/app.js')
    .pipe(connect.reload());
});

// Вотчер
gulp.task('watch', ["lessCompile", "jsCompress", "rev"], function () {
  gulp.watch(['./app/*.html'], ['html']);
  gulp.watch(["./src/bower/bootstrap/less/bootstrap.less", "./src/less/*.less"], ["lessCompile"]);
  gulp.watch(['./app/assets/css/style.min.css'], ['css']);
  gulp.watch(['./app/assets/js/app.js'], ['js']);
});

// Дефолтная задача
gulp.task('default', ['connect', 'watch']);