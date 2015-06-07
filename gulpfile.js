var gulp = require("gulp"),
	less = require("gulp-less"),
	path = require("path"),
	cssMinify = require("gulp-minify-css"),
	jsUglify = require("gulp-uglify"),
	concat = require("gulp-concat"),
	connect = require("gulp-connect"),
	opn = require("opn");

// Компиляция LESS
gulp.task("lessCompile", function () {
	return gulp.src(["./src/bower/bootstrap/less/bootstrap.less", "./src/less/*.less"])
				.pipe(concat("style.min.less"))
				.pipe(less({
					paths: [ path.join(__dirname), "less", "includes" ]
				}))
				.pipe(cssMinify())
				.pipe(gulp.dest("./app/assets/css/"))
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
gulp.task('watch', ["lessCompile", "jsCompress"], function () {
  gulp.watch(['./app/*.html'], ['html']);
  gulp.watch(["./src/bower/bootstrap/less/bootstrap.less", "./src/less/*.less"], ["lessCompile"]);
  gulp.watch(['./app/assets/css/style.min.css'], ['css']);
  gulp.watch(['./app/assets/js/app.js'], ['js']);
});

// Дефолтная задача
gulp.task('default', ['connect', 'watch']);