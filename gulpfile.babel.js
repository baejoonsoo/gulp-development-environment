import gulp from 'gulp';
import gpug from 'gulp-pug';
import del from 'del';
import ws from 'gulp-webserver';
import image from 'gulp-image';
const sass = require('gulp-sass')(require('node-sass'));
import autop from 'gulp-autoprefixer';
import miniCSS from 'gulp-csso';
import bro from 'gulp-bro';
import babelify from 'babelify';
import ghPages from 'gulp-gh-pages';

sass.compiler = require('node-sass');

const routes = {
  pug: {
    watch: 'src/**/*.pug',
    src: 'src/*.pug',
    dest: 'build',
  },
  img: {
    src: 'src/img/*',
    dest: 'build/img',
  },
  scss: {
    src: 'src/scss/style.scss',
    watch: 'src/scss/**/.*scss',
    dest: 'build/css',
  },
  js: {
    src: 'src/js/main.js',
    watch: 'src/js/**/*.js',
    dest: 'build/js',
  },
};

const pug = () =>
  gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));

const img = () =>
  gulp.src(routes.img.src).pipe(image()).pipe(gulp.dest(routes.img.dest));

const clean = () => del(['build', '.publish']);

const webServer = () =>
  gulp.src('build').pipe(ws({ livereload: true, open: true }));

const js = () =>
  gulp
    .src(routes.js.src)
    .pipe(
      bro({
        transform: [
          babelify.configure({ presets: ['@babel/preset-env'] }),
          ['uglifyify', { global: true }],
        ],
      }),
    )
    .pipe(gulp.dest(routes.js.dest));

const styles = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(autop())
    .pipe(miniCSS())
    .pipe(gulp.dest(routes.scss.dest));

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.img.src, img);
  gulp.watch(routes.scss.watch, styles);
  gulp.watch(routes.js.watch, js);
};

const ghDeploy = () => gulp.src('build/**/*').pipe(ghPages());

const prepare = gulp.series([clean, img]);
const assets = gulp.series([pug, styles, js]);
const live = gulp.parallel([webServer, watch]);

export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, live]);
export const deploy = gulp.series([build, ghDeploy, clean]);
