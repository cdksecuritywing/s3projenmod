const { JsiiProject } = require('projen');
const project = new JsiiProject({
  author: 'securitywing',
  authorAddress: 'syras@securitywing.com',
  defaultReleaseBranch: 'main',
  name: '@cdksecuritywing/s3projenmod',
  repositoryUrl: 'https://github.com/cdksecuritywing/s3projenmod.git',

  jest: false,
  devDeps: [
    'fs-extra',
    '@types/fs-extra@^8',

  ],
  deps: ['projen'],
  peerDeps: ['projen'],
  npmDistTag: 'latest',
  npmRegistryUrl: 'https://npm.pkg.github.com',

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
  // release: undefined,      /* Add release management to this project. */
});
project.synth();