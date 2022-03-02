import gulp from 'gulp';
import gpug from 'gulp-pug';
import del from 'del';

const routes = {
  pug: {
    src: 'src/*.pug',
    dest: 'build',
  },
};

export const pug = () =>
  gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));

export const clean = () => del(['build']);

export const dev = gulp.series([clean, pug]);
