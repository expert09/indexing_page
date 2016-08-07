var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    gulpsync = $.sync(gulp),
	browserSync = require('browser-sync'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    gutil = require('gulp-util'),
    babelify = require('babelify'),
    buffer = require('vinyl-buffer'),
    rename = require('gulp-rename'),
    flow = require('gulp-flowtype'),
    react = require('gulp-react'),
    sass = require('gulp-ruby-sass'), 
    notify = require("gulp-notify") ,
    bower = require('gulp-bower');
 
var dependencies = [
    'react',
    'react-dom',
    'react-addons',
    'react-addons-update'
];

var config = {
     sassPath: './src/sass',
     bowerDir: './bower_components' 
}

gulp.task('bower', function() { 
    return bower()
        .pipe(gulp.dest(config.bowerDir)) 
});

gulp.task('icons', function() { 
    return gulp.src(config.bowerDir + '/fontawesome/fonts/**.*') 
        .pipe(gulp.dest('./web/fonts')); 
});

gulp.task('css', function() { 
    return sass(config.sassPath + '/style.scss', {
        style: 'compressed',
        loadPath: [
            './src/sass',
            config.bowerDir + '/bootstrap-sass/assets/stylesheets',
            config.bowerDir + '/font-awesome/scss',
        ]}) 
        .pipe(gulp.dest('./web/css')); 
});

gulp.task('compile', function () {
    gulp.src('./src/*.jsx')
    .pipe($.concat('app.js'))
    .pipe(gulp.dest('./web'));

    return browserify('./web/app.js', {
            debug: true,
            require: dependencies,
        })
        .transform("babelify", {presets: ["es2015", "react"]})
        .bundle()
        .on('error',gutil.log)
        .pipe(source('app.js'))
        .pipe(gulp.dest('./web'))
        ;
        /*.pipe(buffer())
        .pipe($.uglify())
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('./web'))*/;

});

gulp.task('flow', function() {
    gulp.src('./web/*.js')
    .pipe(flow({
        all: false,
        weak: false,
        killFlow: false,
        beep: true,
        abort: false
    }))
    .pipe(react({ stripTypes: true }))
    .pipe(gulp.dest('./web'));
});

gulp.task('browsersync', function() {
    
    browserSync({
        notify: false,
        port: 3000,
        server: {
            baseDir: './web'
        }
    });

});

gulp.task('serve', gulpsync.sync([
    'bower', 
    'icons', 
    'css',
    'compile',
    'flow',
    'browsersync'
]), function() {
	log('Frontend server starting ...');
});

// log to console using
function log(msg) {
    $.util.log($.util.colors.blue(msg));
}