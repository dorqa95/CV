const babel = require('gulp-babel');
const watch = require('gulp-watch');
const gulp = require('gulp');
const stylint = require('gulp-stylint');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const cleancss = require('gulp-clean-css');
const stylus = require('gulp-stylus');
const livereload = require('gulp-livereload');
const log = require('fancy-log');
const poststylus = require('poststylus');
const autoprefixer = require('autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const rucksack = require('rucksack-css');
const plumber = require('gulp-plumber');
const colors = require('ansi-colors');
const sourcemaps = require('gulp-sourcemaps');

/** Variables */
const source = 'dev/';
const dest = '';

const paths = {
    phps: [`${dest}**/*.php`, '!node_modules/**/*'],
    htmls: [`${dest}**/*.html`, '!node_modules/**/*']
};

gulp.task('vendorjs', () =>
    gulp
        .src(['node_modules/babel-polyfill/dist/polyfill.js', `${source}assets/vendor/**/*.js`])
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest(`${dest}assets/js`))
        .on('error', e => {
            log.error(colors.red(`[ERROR] VendorJS was failed: ${e}`));
        })
);

gulp.task('vendorcss', () =>
    gulp
        .src([`${source}assets/vendor/**/*.css`])
        .pipe(concat('vendor.min.css'))
        .pipe(
            cleancss({
                compatibility: 'ie8',
                level: {
                    1: {},
                    2: {}
                }
            })
        )
        .pipe(gulp.dest(`${dest}assets/css`))
        .on('error', e => {
            log.error(colors.red(`[ERROR] VendorCSS was failed: ${e}`));
        })
);

gulp.task('js', () => {
    gulp.src(`${source}assets/js/*.js`)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js'))
        .pipe(
            babel({
                presets: [
                    [
                        'env',
                        {
                            targets: {
                                browsers: ['last 2 versions', 'ie >= 9']
                            }
                        }
                    ]
                ]
            })
        )
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(`${dest}assets/js`))
        .on('error', e => {
            log.error(colors.red(`[ERROR] JS build was failed: ${e}`));
        })
        .pipe(livereload());
});

gulp.task('lint', () =>
    gulp
        .src(`${source}assets/css/**/*.styl`)
        .pipe(stylint())
        .pipe(stylint.reporter())
);

const processors = [
    rucksack,
    gcmq
];

gulp.task('css', () =>
    gulp
        .src(`${source}assets/css/style.styl`)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(
            stylus({
                use: [poststylus(processors)],
                'include css': false
            })
        )
        .pipe(rename({ suffix: '.min' }))
        .pipe(
            cleancss({
                compatibility: 'ie8',
                level: {
                    1: {},
                    2: {}
                }
            })
        )
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(`${dest}assets/css`))
        .on('error', e => {
            log.error(colors.red(`[ERROR] CSS build was failed: ${e}`));
        })
        .pipe(livereload())
);

/* Watchers */
gulp.task('watch', () => {
    watch(`${source}assets/css/**/*.styl`, () => {
        gulp.start('css');
    });

    watch(`${source}assets/js/**/*.js`, () => {
        gulp.start('js');
    });

    watch(`${source}assets/css/*.css`, file => {
        log.info(colors.blue('[INFO] Style has been changed!'));
        livereload.changed(file.path);
    });

    watch(paths.htmls, file => {
        log.info(colors.green('[INFO] HTML has been changed!'));
        livereload.changed(file.path);
    });

    watch(paths.phps, file => {
        log.info(colors.yellow('[INFO] PHP has been changed!'));
        livereload.changed(file.path);
    });

    livereload.listen();
});

/* Default task */
gulp.task('buildVendors', ['vendorcss', 'vendorjs']);
gulp.task('default', ['css', 'js']);
