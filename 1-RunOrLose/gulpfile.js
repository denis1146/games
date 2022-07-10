let srcFolder = 'src';
let buildFolder = 'build';

let path = {
  src: {
    html: [`${srcFolder}/*.html`, `!${srcFolder}/_*.html`],
    css: `${srcFolder}/scss/style.scss`,
    img: `${srcFolder}/img/**/*.{png,jpg,gif,svg,ico,webp}`,
  },
  build: {
    html: `${buildFolder}/`,
		css: `${buildFolder}/css/`,
    img: `${buildFolder}/img/`,
  },
  watch: {
    html: `${srcFolder}/**/*.html`,
    css: `${srcFolder}/scss/**/*.scss`,
    img: `${srcFolder}/img/**/*.{png,jpg,gif,svg,ico,webp}`,
  },
  clean: `${buildFolder}/`,
}

const gulp = require('gulp');
const deldest = require('del');
const browserSynchroniz = require('browser-sync').create();
const scss = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const autoPrefixer = require('gulp-autoprefixer');
const compressCss = require('gulp-clean-css');
const groupMedia = require('gulp-group-css-media-queries');

function browserSync(params) {
  browserSynchroniz.init(
    {
      server: {
        baseDir: `${buildFolder}/`
      },
      port: 3000,
      notify: false,
    }
  );
}

function html(params) {
  return gulp.src(path.src.html)
    .pipe(gulp.dest(path.build.html))
    .pipe(browserSynchroniz.stream());
}

function css(params) {
  return gulp.src(path.src.css)
    .pipe(
      scss({
        outputStyle: 'expanded'
      })
    )
    .pipe(groupMedia())
    .pipe(
      autoPrefixer({
        overrideBrowserslist: ['last 5 version'],
        cascade: true
      })
    )
    .pipe(gulp.dest(path.build.css))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(compressCss())
    .pipe(gulp.dest(path.build.css))
    .pipe(browserSynchroniz.stream());
}

function img() {
  return gulp.src(path.src.img)
    .pipe(gulp.dest(path.build.img))
    .pipe(browserSynchroniz.stream());
}

function watchFiles(params) {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.img], img);
}

function clean() {
  return deldest(path.clean)
}

let build = gulp.series(clean, gulp.parallel(html, css, img));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.html = html;
exports.css = css;
exports.img = img;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;
