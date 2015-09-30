var gulp = require('gulp');
var concat = require('gulp-concat');
var del = require('del');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');

var paths = {
    scripts: ['client/js/**/*.js'],
    html: ['client/html/**/*.html'],
    scss: ['client/scss/**/*.scss'],
    data: ['client/data/*.*']
};

gulp.task('clean', function() {
    return del(['build']);
});

gulp.task('cleanall', function(){
    return del(['build', 'dist']);
});

gulp.task('scripts', ['clean'], function() {
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(sourcemaps.write()) // doesn't work yet.
        .pipe(gulp.dest('dist/'));
});

gulp.task('html', ['clean'], function(){
    return gulp.src(paths.html)
        .pipe(gulp.dest('dist/'));
});

gulp.task('data', ['clean'], function(){
    return gulp.src(paths.data)
        .pipe(gulp.dest('dist/'));
});

gulp.task('scss', ['clean'], function(){
    return gulp.src(paths.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('app.css'))
        .pipe(gulp.dest('dist/'));
});

gulp.task('all', ['scripts', 'html', 'scss', 'data']);

gulp.task('watch', function(){
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.html, ['html']);
    gulp.watch(paths.scss, ['scss']);
});