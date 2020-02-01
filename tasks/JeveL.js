import { src, dest, series, parallel } from 'gulp'
import { cfg, dsrc } from './config'

import browserify from "browserify"
import source from 'vinyl-source-stream'
import tsify from "tsify"
import ts from 'gulp-typescript'
import sourcemaps from 'gulp-sourcemaps'
import buffer from 'vinyl-buffer'
import closureCompiler from 'google-closure-compiler'
import rename from'gulp-rename'

exports.JeveL = parallel(JeveLBuild);

function JeveLBuild()
{
    const cc = closureCompiler.gulp();
    
    return browserify({
        basedir: cfg.dir.src,
        debug: cfg.isDebug(),
        entries: [ cfg.src.JeveL + '.ts' ],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify, { "target": "ES5" })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    // .pipe(cc(cfg.closure.compiler))
    .pipe(rename({ basename: cfg.src.JeveL }))
    .pipe(sourcemaps.write('./'))
    .pipe(dest(cfg.dir.obj));
}
