import gulp, { dest } from "gulp";
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
import autoprefixer from "gulp-autoprefixer";
import imagemin from "gulp-imagemin";
import htmlmin from "gulp-htmlmin";
import size from "gulp-size";
import newer from "gulp-newer";
import ts from "gulp-typescript";

const sass = gulpSass(dartSass);



const paths = {

  html: {
    src: "src/*.html",
    dest: "app",

  },

  styles: {
    src: ["src/styles/**/*.scss", "src/styles/**/*.sass"],
    dest: "app/styles/"
  },

  scripts: {
    src: ["src/scripts/**/*.js", "src/scripts/**/*.ts"],
    dest: "app/scripts/"
  },
  images: {
    src: "src/img/*",
    dest: "app/img"
  }


}


function clean() {
  return deleteAsync(["app/", "!app/img"]);
}

function html() {
  return gulp.src(paths.html.src)
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(size({
      showFiles: true
    }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
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
    // .pipe(gulpRename({
    //   basename: "style",
    //   suffix: ".min"
    // }))
    .pipe(gulpSourcemaps.write(""))
    .pipe(size())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

function img() {
  return gulp.src(paths.images.src)
    .pipe(newer(paths.images.dest))

    .pipe(imagemin({
      progressive: true
    }))
    .pipe(size({
      showFiles: true
    }))
    .pipe(gulp.dest(paths.images.dest))
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "app",
    },
  });
  gulp.watch("src/*html", html);
  gulp.watch(paths.images.src, img);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
}

const build = gulp.series(
  clean,
  html,
  gulp.parallel(styles, scripts, img),
  watch
)

function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(ts({
      noImplicitAny: true,
      outFile: 'scripts.js'
    }))
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
    .pipe(size({
      showFiles: true
    }))
    .pipe(browserSync.stream());
}


export { clean };
export { styles as css };
export { watch };
export { scripts };
export { img };
export { html };





export default build;

