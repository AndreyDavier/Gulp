import gulp from "gulp";
import { deleteAsync } from "del";
import gulpSass from "gulp-sass";
import dartSass from "sass";
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
    .pipe(gulp.dest(paths.styles.dest))
}

export { clean };
export { styles };

