import gulp from "gulp";
import { deleteAsync } from "del";
import gulpSass from "gulp-sass";
import dartSass from "sass";
import gulpRename from "gulp-rename";
import cleanCss from "gulp-clean-css";
const sass = gulpSass(dartSass);



const paths = {

  html: {
    src: "src/*.html",
    dest: "app",

  },

  styles: {
    src: "src/styles/**/*.scss",
    dest: "app/css/"
  },

  scripts: {
    src: "src/scripts/**/*.js",
    dest: "app/js/"
  }


}


function clean() {
  return deleteAsync(["app/"]);
}

function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sass())
    .pipe(cleanCss())
    .pipe(gulpRename({
      basename: "style",
      suffix: ".min"
    }))
    .pipe(gulp.dest(paths.styles.dest))
}

function watch() {
  gulp.watch(paths.styles.src, styles)
}

const build = gulp.series(clean, styles, watch);

export { clean };
export { styles as css };
export { watch };


export default build;

