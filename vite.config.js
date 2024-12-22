import { defineConfig } from 'vite'
import { resolve } from 'path'

const useHash = false

const config = {
  ElmaUMDController: {
    entry: resolve(__dirname, './src/ElmaUMDController/index.ts'),
  },
  ElmaReactLauncher: {
    entry: resolve(__dirname, './src/ElmaReactLauncher/index.ts'),
  },
  ElmaDeclineLib: {
    entry: resolve(__dirname, './src/ElmaDeclineLib/index.ts'),
  },
}

const currentConfig = config[process.env.LIB_NAME]
const libName = process.env.LIB_NAME

if (currentConfig === undefined) {
  throw new Error('LIB_NAME is not defined or is not valid')
}

export default defineConfig({
  define: {
    'process.env': { NODE_ENV: 'production' },
  },

  build: {
    lib: {
      ...currentConfig,
      outDir: './dist/' + libName,
      formats: ['umd', 'es'],
      name: libName,
      fileName: (format) =>
        `${libName}${useHash ? '-[hash]' : ''}.${format}.js`,
    },
    emptyOutDir: false,
  },
})

// import { defineConfig } from 'vite'
// import { resolve } from 'path'

// // Make `useHash` dynamic based on environment
// const useHash = process.env.USE_HASH === 'true'

// // Library config mapping
// const config = {
//   ElmaUMDController: {
//     entry: resolve(__dirname, './src/ElmaUMDController/index.ts'),
//   },
//   ElmaReactLauncher: {
//     entry: resolve(__dirname, './src/ElmaReactLauncher/index.ts'),
//   },
//   ElmaDeclineLib: {
//     entry: resolve(__dirname, './src/ElmaDeclineLib/index.ts'),
//   },
// }

// // Default library or from environment variable
// const libName = process.env.LIB_NAME || 'defaultLibName'
// const currentConfig = config[libName]

// if (!currentConfig) {
//   throw new Error(
//     `Invalid LIB_NAME: '${libName}' provided. Valid options are: ${Object.keys(
//       config
//     ).join(', ')}`
//   )
// }

// // Common build configuration
// const buildConfig = {
//   outDir: `./dist/${libName}`,
//   formats: ['umd', 'es'],
//   name: libName,
//   fileName: (format) => `${libName}${useHash ? '-[hash]' : ''}.${format}.js`,
// }

// export default defineConfig({
//   define: {
//     'process.env': { NODE_ENV: 'production' },
//   },
//   resolve: {
//     alias: {
//       '@src': resolve(__dirname, 'src'),
//     },
//   },
//   build: {
//     lib: {
//       ...currentConfig,
//       ...buildConfig,
//     },
//     emptyOutDir: false,
//     rollupOptions: {
//       output: {
//         // manualChunks(id) {
//         //   if (id.includes('src/common')) {
//         //     return 'common'
//         //   }
//         // },
//       },
//     },
//   },
// })
