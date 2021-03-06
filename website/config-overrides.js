const path = require('path');
const { override, addWebpackAlias, disableEsLint } = require('customize-cra');

const projectDir = process.cwd();

module.exports = override(
  disableEsLint(),
  addWebpackAlias({
    ['@assets']: path.resolve(projectDir, 'src/assets'),
    ['@components']: path.resolve(projectDir, 'src/components'),
    ['@data']: path.resolve(projectDir, 'src/data'),
    ['@hooks']: path.resolve(projectDir, 'src/hooks'),
    ['@pages']: path.resolve(projectDir, 'src/pages'),
    ['@routes']: path.resolve(projectDir, 'src/routes'),
    ['@styles']: path.resolve(projectDir, 'src/styles'),
    ['@utils']: path.resolve(projectDir, 'src/utils'),
  }),
);
