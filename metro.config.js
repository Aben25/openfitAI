const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the project root directory
const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

// Add custom resolver for @ alias
config.resolver.extraNodeModules = {
  '@': path.resolve(projectRoot),
};

// 1. Add support for path aliases
config.resolver.sourceExts = ['js', 'jsx', 'ts', 'tsx', 'json', 'cjs', 'mjs'];

// 2. Handle symlinks properly
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// 3. Make sure all dependencies are properly resolved
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
];

// 4. Allow for better error handling
config.transformer.unstable_allowRequireContext = true;

// 5. Specify watchFolders to include the entire project
config.watchFolders = [projectRoot];

module.exports = config; 