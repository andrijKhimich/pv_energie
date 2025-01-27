const deployFolder = 'build';
const devFolder = 'src';

const path = {
	build: {
		html: `${deployFolder}/`,
		scss: `${deployFolder}/css/`,
		js: `${deployFolder}/js/`,
		images: `${deployFolder}/images/`,
		sprite: `${deployFolder}/images/sprite`,
		fonts: `${deployFolder}/fonts/`,
		files: `${deployFolder}/files/`,

		// video: `${deployFolder}/video/`,
	},
	src: {
		html: `${devFolder}/*.html`,
		scss: `${devFolder}/scss/style.scss`,
		js: `${devFolder}/js/script.js`,
		images: `${devFolder}/images/**/*.{jpg,png,gif,ico,webp}`,
		sprite: `${devFolder}/images/sprite/*.svg`,
		svg: `${deployFolder}/images/**/*.svg`,
		fonts: `${devFolder}/fonts/**/*.ttf`,
		files: `${devFolder}/files/**/*.*`,
	},
	watch: {
		html: `${devFolder}/**/*.html`,
		scss: `${devFolder}/scss/**/*.scss`,
		js: `${devFolder}/js/**/*.js`,
		images: `${devFolder}/images/**/*.{jpg,png,svg,gif,ico,webp}`,
		sprite: `${devFolder}/images/sprite/*.svg`,
		files: `${devFolder}/files/**/*.*`,
	},
	clean: `./${deployFolder}/`,
};
// base
import gulp from 'gulp';
import browserSync from 'browser-sync';
import { deleteAsync } from 'del';
import newer from 'gulp-newer';
import ifPlugin from 'gulp-if';

//html
import fileinclude from 'gulp-file-include';

// scss
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';
import GulpCleanCss from 'gulp-clean-css';
import autoPrefixer from 'gulp-autoprefixer';
import gulpGroupCssMediaQueries from 'gulp-group-css-media-queries';
import sourcemaps from 'gulp-sourcemaps';

// js
import webpack from 'webpack-stream';
import babel from 'gulp-babel';

// images
// import webp from 'gulp-webp';
import imagemin from 'gulp-imagemin';
import gulpSVGSprite from 'gulp-svg-sprite';
import gulpCheerio from 'gulp-cheerio';

// fonts
import fonter from 'gulp-fonter-fix';
import ttf2woff2 from 'gulp-ttf2woff2';
global.app = {
	isBuild: process.argv.includes('--build'),
	isDev: !process.argv.includes('--build'),
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
	return gulp
		.src(path.src.html)
		.pipe(fileinclude())
		.pipe(gulp.dest(path.build.html))
		.pipe(browserSync.stream());
};
const files = () => {
	return gulp.src(path.src.files).pipe(gulp.dest(path.build.files));
};

export const reset = () => {
	return deleteAsync(path.clean);
};

const sass = gulpSass(dartSass);

const scss = () => {
	return gulp
		.src(path.src.scss)
		.pipe(sourcemaps.init(app.isDev))
		.pipe(sass({ outputStyle: 'expanded' }))
		.pipe(gulpGroupCssMediaQueries())
		.pipe(
			autoPrefixer({
				grid: true,
				overrideBrowserlist: ['last 3 versions'],
				cascade: true,
			})
		)
		.pipe(gulp.dest(path.build.scss))
		.pipe(GulpCleanCss())
		.pipe(rename({ extname: '.min.css' }))
		.pipe(sourcemaps.write('../css'))
		.pipe(gulp.dest(path.build.scss))
		.pipe(browserSync.stream());
};

const js = () => {
	return gulp
		.src(path.src.js)
		.pipe(
			babel({
				presets: ['@babel/env'],
			})
		)
		.pipe(
			webpack({
				mode: app.isBuild ? 'production' : 'development',
				entry: './src/js/script.js',
				resolve: {
					extensions: ['.js'], // add your other extensions here
				},
				output: {
					filename: 'script.min.js',
				},
			})
		)

		.pipe(gulp.dest(path.build.js))
		.pipe(browserSync.stream());
};

const images = () => {
	return gulp
		.src(path.src.images)
		.pipe(newer(path.build.images))
		// .pipe(ifPlugin(app.isDev, webp()))
		.pipe(ifPlugin(app.isDev, gulp.dest(path.build.images)))
		.pipe(ifPlugin(app.isDev, gulp.src(path.src.images)))
		.pipe(ifPlugin(app.isDev, newer(path.build.images)))
		.pipe(
			ifPlugin(
				app.isBuild,
				imagemin({
					progressive: true,
					svgoPlugins: [{ removeViewBox: false }],
					interlaced: true,
					optimizationLevel: 7, //to 7
				})
			)
		)
		// .pipe(gulp.dest(path.build.images))
		// .pipe(gulp.src(path.src.svg))
		.pipe(gulp.dest(path.build.images))
		.pipe(browserSync.stream());
};

const spriteSvg = () => {
	return gulp
		.src(path.src.sprite, {})
		.pipe(
			gulpSVGSprite({
				mode: {
					stack: {
						sprite: '../sprite.svg',
						example: false,
					},
				},
			})
		)
		.pipe(
			gulpCheerio({
				run: function ($) {
					$('[fill]').removeAttr('fill');
					$('[stroke]').removeAttr('stroke');
					$('[style]').removeAttr('style');
					$('[class]').removeAttr('class');
					$('[width]').removeAttr('width');
					$('[height]').removeAttr('height');
					$('style').remove();
				},
				parserOptions: {
					xmlMode: true,
				},
			})
		)
		.pipe(gulp.dest(path.build.sprite));
};

const otfToTtf = () => {
	return gulp
		.src(`${path.src.fonts}/*.otf`, {})
		.pipe(
			fonter({
				formats: ['ttf'],
			})
		)
		.pipe(app.gulp.dest(path.src.fonts));
};

const ttfToWoff = () => {
	return gulp
		.src(path.src.fonts)
		.pipe(
			fonter({
				formats: ['woff'],
			})
		)
		.pipe(gulp.dest(path.build.fonts))
		.pipe(gulp.src(path.src.fonts))
		.pipe(ttf2woff2())
		.pipe(gulp.dest(path.build.fonts))
		.pipe(gulp.src(`${path.src.fonts}/*.woff`))
		.pipe(gulp.dest(path.build.fonts))
		.pipe(gulp.src(`${path.src.fonts}/*.woff2`))
		.pipe(gulp.dest(path.build.fonts));
};

// const js = () => {
// 	src([
// 		// js libs uncomment what you need

// 		// jQuery
// 		// "node_modules/jquery/dist/jquery.min.js",

// 		// svg support in all browsers
// 		'node_modules/svg4everybody/dist/svg4everybody.min.js', // no jQuery needed

// 		// modal
// 		// "node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.js",

// 		// animation
// 		// "src/libs/gsap-and-scrollTrigger.js",
// 		// "src/libs/jarallax.min.js"

// 		// tooltips
// 		// "node_modules/@popperjs/core/dist/umd/popper.min.js",

// 		// counter
// 		// "node_modules/jquery-nice-select/js/jquery.nice-select.min.js",

// 		// swiper slider
// 		// "node_modules/swiper/swiper-bundle.min.js",
// 	])
// 		// .pipe(sourcemaps.init())
// 		.pipe(concat('libs.min.js'))
// 		// .pipe(sourcemaps.write('./'))
// 		.pipe(dest(path.build.js));

// 	return (
// 		src(path.src.js)
// 			// .pipe(sourcemaps.init())
// 			.pipe(
// 				babel({
// 					presets: ['@babel/env'],
// 				})
// 			)
// 			.pipe(dest(path.build.js))
// 			.pipe(uglify())
// 			.pipe(
// 				rename({
// 					extname: '.min.js',
// 				})
// 			)
// 			// .pipe(sourcemaps.write('./'))
// 			.pipe(dest(path.build.js))
// 			.pipe(browsersync.stream())
// 	);
// };

// const spriteSvg = () => {
// 	return src(`${devFolder}/images/sprite-svg/*.svg`) // svg files for sprite
// 		.pipe(
// 			svgSprite({
// 				mode: {
// 					stack: {
// 						sprite: '../sprite.svg', //sprite file name
// 					},
// 				},
// 			})
// 		)
// 		.pipe(
// 			cheerio({
// 				run: function ($) {
// 					$('[fill]').removeAttr('fill');
// 					$('[stroke]').removeAttr('stroke');
// 					$('[style]').removeAttr('style');
// 					$('[class]').removeAttr('class');
// 					$('[width]').removeAttr('width');
// 					$('[height]').removeAttr('height');
// 					$('style').remove();
// 				},
// 				parserOptions: {
// 					xmlMode: true,
// 				},
// 			})
// 		)
// 		.pipe(gulp.dest(`${deployFolder}/images/sprite-svg/`));
// };

// const clearCache = () => {
// 	return cache.clearAll();
// };

// const clean = () => {
// 	return del(path.clean);
// };

const watchFiles = () => {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.scss], scss);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.images], images);
	gulp.watch([path.watch.sprite], spriteSvg);

	// gulp.watch([path.watch.fonts], fonts);
	gulp.watch([path.watch.files], files);
	// gulp.watch([path.watch.video], video);
	// TODO: check all files are watched
};

// gulp.task('default', files); // const build = gulp.series(gulp.parallel(html));
// const watch = gulp.parallel(build, watchFiles);

export { otfToTtf };

const mainTasks = gulp.parallel(
	files,
	html,
	scss,
	js,
	images,
	spriteSvg,
	ttfToWoff
);

const dev = gulp.series(reset, mainTasks, gulp.parallel(watchFiles, server));
const build = gulp.series(reset, mainTasks);
const serve = gulp.series(server);

export { dev };
export { build };
export { serve };

// export {sourcemaps};
// export {spriteSvg};

gulp.task('default', dev);

// export const javascript = javascript;
// export const html = html;
// exports.css = css;
// exports.js = js;
// exports.images = images;
// exports.svgSprite = svgSprite;
// exports.fonts = fonts;
// exports.files = files;
// exports.video = video;
// exports.build = build;
// exports.watch = watch;
// exports.default = watch;
