'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var changed = require('gulp-changed');

var marko_ax5 = require('gulp-marko-ax5');

var PATHS = {
    assets: {
        src: "src/ax5docs/assets"
    },
    ax5docs: {
        css_src: "src/ax5docs/assets/css",
        css_dest: "src/ax5docs/assets/css",
        ax5core: "src/ax5docs/assets/lib/ax5core",
        doc_src: "src/ax5docs/_src_",
        doc_dest: "src/ax5docs"
    },
    ax5core: {
        src: "src/ax5core/js",
        dest: "src/ax5core/dist",
        doc_src: "src/ax5docs/_src_ax5core",
        doc_dest: "src/ax5docs/ax5core"
    },
    "bootstrap-ax5dialog": {
        src: "src/bootstrap-ax5dialog/src",
        dest: "src/bootstrap-ax5dialog/dist",
        doc_src: "src/ax5docs/_src_bootstrap-ax5dialog",
        doc_dest: "src/ax5docs/bootstrap-ax5dialog"
    }
};

/**
 * SASS
 */
gulp.task('SASS', function () {
    return gulp.src(PATHS.ax5docs.css_src + '/docs.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest(PATHS.ax5docs.css_dest));
});

/**
 * for ax5core
 */
gulp.task('AX5CORE-scripts', function () {
    return gulp.src(PATHS.ax5core.src + '/*.js')
        .pipe(concat('ax5core.js'))
        .pipe(gulp.dest(PATHS.ax5core.dest))
        .pipe(concat('ax5core.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(PATHS.ax5core.dest));
});

/**
 * ax5docs templete render
 */
gulp.task('AX5CORE-docs', function () {
    return gulp.src(PATHS.ax5core.doc_src + '/**/*.html')
        .pipe(changed(PATHS.ax5core.doc_dest, {extension: '.html', hasChanged: changed.compareSha1Digest}))
        .pipe(marko_ax5({
            projectName: "ax5core",
            layoutPath: PATHS.assets.src + '/_layouts/index.marko'
        }))
        .pipe(gulp.dest(PATHS.ax5core.doc_dest));
});
gulp.task('docs:all', function () {
    gulp.src(PATHS.ax5core.doc_src + '/**/*.html')
        .pipe(marko_ax5({
            projectName: "ax5core",
            layoutPath: PATHS.assets.src + '/_layouts/index.marko'
        }))
        .pipe(gulp.dest(PATHS.ax5core.doc_dest));

    gulp.src(PATHS['bootstrap-ax5dialog'].doc_src + '/**/*.html')
        .pipe(marko_ax5({
            projectName: "bootstrap-ax5dialog",
            layoutPath: PATHS.assets.src + '/_layouts/index.marko'
        }))
        .pipe(gulp.dest(PATHS['bootstrap-ax5dialog'].doc_dest));

    gulp.src(PATHS['ax5docs'].doc_src + '/**/*.html')
        .pipe(marko_ax5({
            projectName: "ax5ui",
            layoutPath: PATHS.assets.src + '/_layouts/root.marko'
        }))
        .pipe(gulp.dest(PATHS['ax5docs'].doc_dest));
});

gulp.task('AX5DIALOG-docs', function () {
    return gulp.src(PATHS['bootstrap-ax5dialog'].doc_src + '/**/*.html')
        .pipe(changed(PATHS['bootstrap-ax5dialog'].doc_dest, {extension: '.html', hasChanged: changed.compareSha1Digest}))
        .pipe(marko_ax5({
            projectName: "bootstrap-ax5dialog",
            layoutPath: PATHS.assets.src + '/_layouts/index.marko'
        }))
        .pipe(gulp.dest(PATHS['bootstrap-ax5dialog'].doc_dest));
});

/**
 * watch
 */
gulp.task('default', function () {
    gulp.watch(PATHS.ax5docs.css_src + '/**/*.scss', ['SASS']);
    gulp.watch(PATHS.ax5core.src + '/*.js', ['AX5CORE-scripts']);
    gulp.watch(PATHS.ax5core.doc_src + '/**/*.html', ['AX5CORE-docs']);
    gulp.watch(PATHS.assets.src + '/_layouts/index.marko', ['AX5CORE-docs', 'AX5DIALOG-docs']);

    gulp.watch(PATHS['bootstrap-ax5dialog'].doc_src + '/**/*.html', ['AX5DIALOG-docs']);

});