import babel from 'rollup-plugin-babel'

const pkg = require('./package.json')

export default {
  input: 'src/index.js',
  plugins: [
    babel({
      externalHelpers: true
    })
  ],
  external: ['react', 'prop-types'],
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      name: 'reactLocalReducer'
    },
    {
      file: pkg.module,
      format: 'es'
    }
  ]
}
