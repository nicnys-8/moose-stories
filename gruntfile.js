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
            }
            /*,
                        client: {
                            src: [
                                "public/js/*",
                            ],
                            options: {
                                "strict": true,
                                "browser": true,
                                "globals": {
                                    "io": true
                                }
                            }
                        }*/
        },
        csslint: {
            all: ["public/css/*"]
        },
        jsonlint: {
            all: []
        },

        // Enable client side 'require'
        browserify: {
            build: {
                src: "public/js/game.js",
                dest: "public/js/bundle.js"
            },
            options: {
                browserifyOptions: {
                    debug: true
                }
            },
        },

        watch: {
            files: "js/*",
            tasks: ["browserify"]
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
        }
    });
    grunt.registerTask("lint", ["jshint", "jsonlint"]);
    grunt.registerTask("build", ["browserify", "watch"]);
    grunt.registerTask("default", ["lint", "nodemon"]);
};
