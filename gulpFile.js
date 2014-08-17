var gulp = require('gulp')
var shell = require('gulp-shell')

// Run project
gulp.task('run', shell.task([
    // mac/*nix
    'node_modules/node-webkit-builder/bin/nwbuild -v 0.10.1 --run ./'
    // windows
    // 'node node_modules/node-webkit-builder/bin/nwbuild -v 0.10.1 --run ./'
]));

// Compile project
gulp.task('build-osx', shell.task([
    // mac/*nix
    'node_modules/node-webkit-builder/bin/nwbuild -v 0.10.1 -p osx ./'
    // windows
    //'node node_modules/node-webkit-builder/bin/nwbuild -v 0.10.1 -p osx ./'
]));

// Compile project
gulp.task('build-win', shell.task([
    // mac/*nix
    'node_modules/node-webkit-builder/bin/nwbuild -v 0.10.1 -p win ./'
    // windows
    //'node node_modules/node-webkit-builder/bin/nwbuild -v 0.10.1 -p win ./'
]));

// Compile project
gulp.task('build-linux', shell.task([
    // mac/*nix
    'node_modules/node-webkit-builder/bin/nwbuild -v 0.10.1 -p linux32,linux64 ./'
    // windows
    //'node node_modules/node-webkit-builder/bin/nwbuild -v 0.10.1 -p linux32,linux64 ./'
]));
