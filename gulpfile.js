const colors = require('ansi-colors');
const autoprefixer = require('autoprefixer');
const log = require('fancy-log');
const gulp = require('gulp');
const babel = require('gulp-babel');
const gulpCleanCss = require('gulp-clean-css');
const concat = require('gulp-concat');
const gulpGroupCssMediaQueries = require('gulp-group-css-media-queries');
const livereload = require('gulp-livereload');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const gulpStylelint = require('gulp-stylelint');
const stylus = require('gulp-stylus');
const terser = require('gulp-terser');
const poststylus = require('poststylus');
const rucksack = require('rucksack-css');

/** Variables */
const source = 'dev/assets/';
const dest = './';

const paths = {
    phps: [`${dest}**/*.php`, '!node_modules/**/*'],
    htmls: [`${dest}**/*.html`, '!node_modules/**/*']
};

function vendorJs() {
    return gulp
        .src([
            'node_modules/babel-polyfill/dist/polyfill.js',
            `${source}vendor/**/*.js`
        ], { encoding: false })
        .pipe(concat('vendor.min.js'))
        .pipe(terser())
        .pipe(gulp.dest(`${dest}assets/js`))
        .on('error', e => log.error(colors.red(`[ERROR] VendorJS was failed: ${e}`)));
}

function vendorCss() {
    return gulp
        .src([`${source}vendor/**/*.css`], { encoding: false })
        .pipe(concat('vendor.min.css'))
        .pipe(gulpCleanCss())
        .pipe(gulp.dest(`${dest}assets/css`))
        .on('error', e => log.error(colors.red(`[ERROR] VendorCSS was failed: ${e}`)));
}

function js() {
    return gulp
        .src(`${source}js/*.js`, { encoding: false })
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js'))
        .pipe(
            babel({
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            targets: {
                                browsers: [
                                    'last 2 versions',
                                    'not dead',
                                    'not < 1%',
                                ]
                            }
                        }
                    ]
                ]
            })
        )
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(`${dest}assets/js`))
        .on('error', e => log.error(colors.red(`[ERROR] JS build was failed: ${e}`)))
        .pipe(livereload());
}

function lint() {
    return gulp
        .src([`${source}css/layout/*.styl`, `${source}css/modules/**/*.styl`])
        .pipe(gulpStylelint({
            reporters: [{ formatter: 'string', console: true }]
        }));
}

const processors = [
    autoprefixer({ cascade: false }),
    rucksack,
    gulpGroupCssMediaQueries
];

function css() {
    return gulp
        .src(`${source}css/style.styl`, { encoding: false })
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(
            stylus({
                use: [poststylus(processors)],
                'include css': false
            })
        )
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulpCleanCss())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(`${dest}assets/css`))
        .on('error', e => log.error(colors.red(`[ERROR] CSS build was failed: ${e}`)))
        .pipe(livereload());
}

function watchFiles() {
    livereload.listen();

    gulp.watch(`${source}css/**/*.styl`, gulp.series(css));

    gulp.watch(`${source}js/**/*.js`, gulp.series(js));

    gulp.watch(`${dest}assets/css/*.css`, file => {
        log.info(colors.blue('[INFO] Style has been changed!'));
        livereload.changed(file);
    });

    gulp.watch(paths.htmls, file => {
        log.info(colors.green('[INFO] HTML has been changed!'));
        livereload.changed(file);
    });

    gulp.watch(paths.phps, file => {
        log.info(colors.yellow('[INFO] PHP has been changed!'));
        livereload.changed(file);
    });
}

/* Exported Tasks */
gulp.task('vendorjs', vendorJs);
gulp.task('vendorcss', vendorCss);
gulp.task('js', js);
gulp.task('lint', lint);
gulp.task('css', css);
gulp.task('watch', watchFiles);
gulp.task('buildVendors', gulp.parallel(vendorCss, vendorJs));
gulp.task('default', gulp.parallel(css, js));
