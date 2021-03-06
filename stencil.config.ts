import fs from 'fs';
import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { postcss } from '@stencil/postcss';
import postCSSPresetEnv from 'postcss-preset-env';
import cssnano from 'cssnano';
import { createFilter } from 'rollup-pluginutils';
import replace from '@rollup/plugin-replace';

const pkgManifest = JSON.parse(fs.readFileSync('package.json', 'utf8'));

interface Options {
  include?: string;
  exclude?: string;
}

function gql(opts: Options = {}) {
  if (!opts.include) {
    opts.include = 'src/**/*.graphql'; // eslint-disable-line no-param-reassign
  }

  const filter = createFilter(opts.include, opts.exclude);

  return {
    name: 'gql',
    // eslint-disable-next-line consistent-return
    transform(code, id) {
      if (filter(id)) {
        return {
          code: `export default ${JSON.stringify(code)}`,
        };
      }
    },
  };
}

function svg(opts: Options = {}) {
  const filter = createFilter(opts.include || '**/*.svg', opts.exclude);

  return {
    name: 'svg',
    // eslint-disable-next-line consistent-return
    transform(code, id) {
      if (filter(id)) {
        // Rollup by default returns a base64 URL. Decode that back into HTML for SVGs
        const transformed = code.replace(/'[^']+'/, (data) =>
          JSON.stringify(
            Buffer.from(data.replace('data:image/svg+xml;base64,', ''), 'base64').toString('utf8')
          )
        );
        return { code: transformed };
      }
    },
  };
}

export const config: Config = {
  namespace: 'manifold-invoices',
  globalStyle: 'src/styles/styles.scss',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  testing: {
    moduleNameMapper: {
      '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
        '<rootDir>/__mocks__/fileMock.js',
    },
    testPathIgnorePatterns: ['/node_modules/'],
    transformIgnorePatterns: ['node_modules/(?!@manifoldco/manifold-init)'],
    transform: {
      '\\.graphql$': './jest-transform-graphql',
    },
  },
  plugins: [
    gql(),
    svg(), // import SVGs from Mercury
    sass(),
    postcss({
      plugins: [cssnano(), postCSSPresetEnv()],
    }),
    replace({
      exclude: 'node_modules/**',
      delimiters: ['<@', '@>'],
      values: {
        NPM_PACKAGE_VERSION: pkgManifest.version,
      },
    }),
  ],
};
