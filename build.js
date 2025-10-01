import * as esbuild from 'esbuild'

import packageJson from './package.json' with { type: 'json' }

console.log(`The project name is: ${packageJson.name}`)

const exportStatements = {
    vue: {
        contents: `export * from 'vue/dist/vue.esm-bundler.js'`,
        define: {
            __VUE_OPTIONS_API__: String(true),
            __VUE_PROD_DEVTOOLS__: String(true),
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: String(false),
        },
    },
    d3: {
        contents: `export * from 'd3'`,
    },
    'markdown-it': {
        contents: `export { default as markdownit } from 'markdown-it'`,
    },
    yaml: {
        contents: `export * from 'yaml'`,
    },
}

const configs = Object.entries(exportStatements).map(([name, config]) => ({
    bundle: true,
    minify: false,
    format: 'esm',
    define: config.define || {},
    stdin: {
        contents: config.contents,
        resolveDir: process.cwd(),
        loader: 'js',
    },
    outfile: `vendor/${name}.js`,
}))

// console.dir(configs)

try {
    console.time('Build')
    await Promise.all(configs.map((c) => esbuild.build(c)))
    console.timeEnd('Build')
} catch (err) {
    console.error(err)
}
