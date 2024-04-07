import gulp from "gulp";
import { deleteAsync } from "del";
import gulpSass from "gulp-sass";
import * as dartSass from "sass";
import gulpRename from "gulp-rename";
import cleanCss from "gulp-clean-css";
import babel from "gulp-babel";
import uglify from "gulp-uglify-es";
import notify from "gulp-notify";
import concat from "gulp-concat";
import gulpSourcemaps from "gulp-sourcemaps";
import browserSync from "browser-sync";
import autoprefixer from "gulp-autoprefixer"
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
    .pipe(gulpSourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleanCss({
      level: 2
    }))
    .pipe(gulpRename({
      basename: "style",
      suffix: ".min"
    }))
    .pipe(gulpSourcemaps.write())
    .pipe(gulp.dest(paths.styles.dest))
}

function watch() {
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
}

const build = gulp.series(
  clean,
  gulp.parallel(styles, scripts),
  watch
)

function scripts() {
  return gulp
    .src(paths.scripts.src)
    .pipe(gulpSourcemaps.init())
    .pipe(concat("scripts.js"))
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(uglify.default().on("error", notify.onError()))
    .pipe(gulpSourcemaps.write("./"))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}


export { clean };
export { styles as css };
export { watch };
export { scripts };



export default build;

