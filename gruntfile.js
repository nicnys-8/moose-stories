"use strict";

module.exports = function(grunt) {
    require("load-grunt-tasks")(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        // Linting
        jshint: {
            server: {
                src: [
                    "gruntfile.js",
                    "server.js"
                ],
                options: {
                    "strict": "global",
                    "node": true,
                }
            },
            client: {
                src: [
                    "public/js/*",
                ],
                options: {
                    "node": true,
                    "browser": true,
                    "validthis": true
                }
            }
        },
        csslint: {
            all: ["public/css/*"]
        },
        jsonlint: {
            all: []
        },

        browserify: {
            game: {
                src: ['public/js/objects/**/*.js', 'public/js/game.js'],
                dest: 'public/dist/js/game-bundle.js',
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
            },
            editor: {
                src: ['public/js/objects/**/*.js', 'public/js/editor.js'],
                dest: 'public/dist/js/editor-bundle.js',
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
            }
        },

        watch: {
            game: {
                files: ['public/js/**'],
                tasks: ['browserify'],
                options: {
                    spawn: false,
                },
            }
        },

        // Run the server
        nodemon: {
            script: "server.js",
            options: {
                watch: [
                    "server.js",
                    "app/*",
                    "config/*"
                ]
            }
        },

        concurrent: {
            dev: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
    });
    grunt.registerTask("lint", ["jshint", "jsonlint"]);
    grunt.registerTask("default", ["browserify", "concurrent"]);
};
