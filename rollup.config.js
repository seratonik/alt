const rollup = require( 'rollup' );
const commonjs = require ('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');

let Config = {
    entry: 'src/index.js',
    dest: 'dist/alt.es6.js',
    sourceMap: true,
    format: 'cjs',
    plugins: [
        nodeResolve({
            module: true,
            jsnext: true, main: true,
        }),
        commonjs({
        }),
        babel({
            exclude: 'node_modules/**',
            plugins:[
                'transform-class-properties',
                'transform-es2015-arrow-functions',
                'transform-es2015-shorthand-properties',
                'transform-es2015-parameters',
                'transform-object-rest-spread',
                'transform-es2015-destructuring',
                'transform-es2015-spread',
            ]
        })
    ]
};


export default Config;