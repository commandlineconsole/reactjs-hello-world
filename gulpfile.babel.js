import {
  Preset,
  CleanJavascripts,
  RollupIife,
  RollupUmd,
  EsLint,
  Aggregate,
  Uglify,
  parallel,
  series
} from 'gulp-pipeline'
import gulp from 'gulp'
import pkg from './package.json'
import moment from 'moment'

const preset = Preset.baseline()

const rollupConfig = {
  babel: {
    presets: ['react', 'es2015-rollup']
  },
  nodeEnvReplace: {
    enabled: true
  },
  options: {
    moduleName: 'HelloWorld',
    banner: `/*!
  * ${pkg.name} v${pkg.version} (${pkg.homepage})
  * Copyright ${moment().format("YYYY")} ${pkg.author}
  * Licensed under ${pkg.license}
  */`
  }
}

const js = new Aggregate(gulp, 'js',
  series(gulp,
    new CleanJavascripts(gulp, preset),
    new EsLint(gulp, preset),
    // new Mocha(gulp, preset),
    parallel(gulp,
      new RollupIife(gulp, preset, rollupConfig, {
        options: {
          dest: 'helloWorld.iife.js',
        }
      }),
      new RollupUmd(gulp, preset, rollupConfig, {
        options: {
          dest: 'helloWorld.umd.js',
        }
      })
    )
  )
)

const defaultRecipes = new Aggregate(gulp, 'default', js)

const all = new Aggregate(gulp, 'all',
  series(gulp,
    defaultRecipes,
    parallel(gulp,
      // new CssNano(gulp, preset),
      new Uglify(gulp, preset, {
        task: {name: 'iife:uglify'},
        source: {
          glob: 'helloWorld.iife.js'
        }
      })
    )
  )
)
