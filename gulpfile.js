const colors = require('ansi-colors');
const autoprefixer = require('autoprefixer');
const log = require('fancy-log');
const gulp = require('gulp');
const babel = require('gulp-babel');
const cleancss = require('gulp-clean-css');
const concat = require('gulp-concat');
const gcmq = require('gulp-group-css-media-queries');
const livereload = require('gulp-livereload');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const gulpStylelint = require('gulp-stylelint');
const stylus = require('gulp-stylus');
const terser = require('gulp-terser');
const watch = require('gulp-watch');
const poststylus = require('poststylus');
const rucksack = require('rucksack-css');

/** Variables */
const source = 'dev/assets/';
const dest = './';

const paths = {
    phps: [`${dest}**/*.php`, '!node_modules/**/*'],
    htmls: [`${dest}**/*.html`, '!node_modules/**/*']
};

gulp.task('vendorjs', () =>
    gulp
        .src([
            'node_modules/babel-polyfill/dist/polyfill.js',
            `${source}vendor/**/*.js`
        ])
        .pipe(concat('vendor.min.js'))
        .pipe(terser())
        .pipe(gulp.dest(`${dest}assets/js`))
        .on('error', e => {
            log.error(colors.red(`[ERROR] VendorJS was failed: ${e}`));
        })
);

gulp.task('vendorcss', () =>
    gulp
        .src([`${source}vendor/**/*.css`])
        .pipe(concat('vendor.min.css'))
        .pipe(
            cleancss()
        )
        .pipe(gulp.dest(`${dest}assets/css`))
        .on('error', e => {
            log.error(colors.red(`[ERROR] VendorCSS was failed: ${e}`));
        })
);

gulp.task('js', () =>
    gulp
        .src(`${source}js/*.js`)
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
        .on('error', e => {
            log.error(colors.red(`[ERROR] JS build was failed: ${e}`));
        })
        .pipe(livereload())
);

gulp.task('lint', () =>
    gulp
        .src([`${source}css/layout/*.styl`, `${source}css/modules/**/*.styl`])
        .pipe(gulpStylelint({
            reporters: [
                {formatter: 'string', console: true}
            ]
        }))
);

const processors = [
    autoprefixer({
        cascade: false
    }),
    rucksack,
    gcmq
];

gulp.task('css', () =>
    gulp
        .src(`${source}css/style.styl`)
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
            cleancss()
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
    watch(`${source}css/**/*.styl`, gulp.series('css'));

    watch(`${source}js/**/*.js`, gulp.series('js'));

    watch(`${dest}assets/css/*.css`, file => {
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
gulp.task('buildVendors', gulp.parallel('vendorcss', 'vendorjs'));
gulp.task('default', gulp.parallel('css', 'js'));
