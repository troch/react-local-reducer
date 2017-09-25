import babel from 'rollup-plugin-babel'

const pkg = require('./package.json')

const babelConfig = {
  presets: [['env', { modules: false }], 'react'],
  plugins: [
    ['transform-object-rest-spread', { useBuiltIns: true }],
    'transform-class-properties',
    ['transform-runtime', { regenerator: false }]
  ],
  runtimeHelpers: true,
  babelrc: false
}

export default {
  input: 'src/index.js',
  plugins: [babel(babelConfig)],
  external: ['react', 'prop-types', 'babel-runtime'],
  output: [
    {
      file: pkg.main,
      format: 'cjs'
    },
    {
      file: pkg.module,
      format: 'es'
    }
  ]
}
