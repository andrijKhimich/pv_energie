const deployFolder = "build";
const devFolder = "src";

const path = {
  build: {
    html: `${deployFolder}/`,
    scss: `${deployFolder}/css/`,
    js: `${deployFolder}/js/`,
    images: `${deployFolder}/images/`,
    fonts: `${deployFolder}/fonts/`,
    files: `${deployFolder}/files/`,
  },
  src: {
    html: `${devFolder}/*.html`,
    scss: `${devFolder}/scss/style.scss`,
    js: `${devFolder}/js/script.js`,
    images: `${devFolder}/images/**/*.{jpg,png,gif,ico,webp,svg}`,
    fonts: `${devFolder}/fonts/**/*.*`,
    files: `${devFolder}/files/**/*.*`,
  },
  watch: {
    html: `${devFolder}/**/*.html`,
    scss: `${devFolder}/scss/**/*.scss`,
    js: `${devFolder}/js/**/*.js`,
    images: `${devFolder}/images/**/*.{jpg,png,svg,gif,ico,webp}`,
    fonts: `${devFolder}/fonts/**/*.*`,
    files: `${devFolder}/files/**/*.*`,
  },
  clean: `./${deployFolder}/`,
};

// base
import gulp from "gulp";
import browserSync from "browser-sync";
import {deleteAsync} from "del";

//html
import fileinclude from "gulp-file-include";

// scss
import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import rename from "gulp-rename";
import GulpCleanCss from "gulp-clean-css";
import autoPrefixer from "gulp-autoprefixer";
import gulpGroupCssMediaQueries from "gulp-group-css-media-queries";
import sourcemaps from "gulp-sourcemaps";

// js
import webpack from "webpack-stream";
import babel from "gulp-babel";

global.app = {
  isBuild: process.argv.includes("--build"),
  isDev: !process.argv.includes("--build"),
};

const server = () => {
  browserSync.init({
    server: {
      baseDir: `./${deployFolder}/`,
    },
    port: 3000,
    notify: true,
  });
};

const html = () => {
  return gulp.src(path.src.html).pipe(fileinclude()).pipe(gulp.dest(path.build.html)).pipe(browserSync.stream());
};

export const reset = () => {
  return deleteAsync(path.clean);
};

const sass = gulpSass(dartSass);

const scss = () => {
  return gulp
    .src(path.src.scss)
    .pipe(sourcemaps.init(app.isDev))
    .pipe(sass({outputStyle: "expanded"}))
    .pipe(gulpGroupCssMediaQueries())
    .pipe(
      autoPrefixer({
        grid: true,
        overrideBrowserlist: ["last 3 versions"],
        cascade: true,
      })
    )
    .pipe(gulp.dest(path.build.scss))
    .pipe(GulpCleanCss())
    .pipe(rename({extname: ".min.css"}))
    .pipe(sourcemaps.write("../css"))
    .pipe(gulp.dest(path.build.scss))
    .pipe(browserSync.stream());
};

const js = () => {
  return gulp
    .src(path.src.js)
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(
      webpack({
        mode: app.isBuild ? "production" : "development",
        entry: "./src/js/script.js",
        resolve: {
          extensions: [".js"], // add your other extensions here
        },
        output: {
          filename: "script.min.js",
        },
      })
    )

    .pipe(gulp.dest(path.build.js))
    .pipe(browserSync.stream());
};

const images = () => {
  return gulp.src(path.src.images).pipe(gulp.dest(path.build.images)).pipe(browserSync.stream());
};

const fonts = () => {
  return gulp.src(path.src.fonts).pipe(gulp.dest(path.build.fonts)).pipe(browserSync.stream());
};
const files = () => {
  return gulp.src(path.src.files).pipe(gulp.dest(path.build.files)).pipe(browserSync.stream());
};

const watchFiles = () => {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.scss], scss);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.images], images);
  gulp.watch([path.watch.fonts], fonts);
  gulp.watch([path.watch.files], files);
  // TODO: check all files are watched
};

const mainTasks = gulp.parallel(html, scss, js, images, fonts);

const dev = gulp.series(reset, mainTasks, gulp.parallel(watchFiles, server));
const build = gulp.series(reset, mainTasks);
const serve = gulp.series(server);

export {dev};
export {build};
export {serve};

gulp.task("default", dev);
