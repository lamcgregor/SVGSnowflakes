module.exports = function (grunt) {
    'use strict';
    grunt.registerTask('listItems', 'Lists the handlebars pages', function () {
        var sourceUrl = 'source/html/pages/';
        var files = grunt.file.expand(sourceUrl + '**/*.{hbs,handlebars}');
        if (files.length > 0) {
            var contents = '<h2>List of pages:</h2><ul>';
            for (var i = 0; i < files.length; i++) {
                var temp = files[i].split(sourceUrl);
                var title;
                if (temp[1].indexOf('handlebars') < 0) {
                    title = temp[1].split('.hbs');
                } else {
                    title = temp[1].split('.handlebars');
                }
                contents += '<li><a href="' + title[0] + '.html">' + title[0] + '</li>';
            }
            contents += '</ul>';
        }
        grunt.file.write('source/html/partials/fileList.handlebars', contents);
    });
    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('assemble');
    grunt.initConfig({
        config: {
            source: 'source/',
            dest: 'dist/'
        },
        connect: {
            options: {
                port: 9012,
                livereload: 35729,
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: '<%= config.dest %>'
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= config.dest %>',
                    livereload: false
                }
            }
        },
        stylus: {
            dev: {
                options: {
                    linenos: true,
                    compress: false
                },
                files: { '<%= config.dest %>css/global.css': '<%= config.source %>css/**/*.styl' }
            }
        },
        copy: {
            files: {
                files: [
                    {
                        src: ['*.*'],
                        dest: '<%= config.dest %>images/',
                        cwd: '<%= config.source %>images/',
                        expand: true
                    },
                    {
                        src: ['*.*'],
                        dest: '<%= config.dest %>css/images/',
                        cwd: '<%= config.source %>css/images/',
                        expand: true
                    }
                ]
            },
            js: {
                files: [{
                        src: ['*.js'],
                        dest: '<%= config.dest %>js/',
                        cwd: '<%= config.source %>js/',
                        expand: true
                    }]
            }
        },
        watch: {
            scripts: {
                options: { livereload: true },
                files: ['<%= config.source %>js/*.js'],
                tasks: ['newer:copy:js']
            },
            html: {
                options: { livereload: true },
                files: [
                    '<%= config.source %>html/**/*.{html,hbs,handlebars,json,yml}',
                    '!<%= config.source %>html/partials/fileList.{hbs,handlebars}'
                ],
                tasks: [
                    'listItems',
                    'assemble'
                ]
            },
            css: {
                options: { livereload: true },
                files: ['<%= config.source %>/css/**/*.styl'],
                tasks: ['newer:stylus:dev']
            },
            images: {
                options: { livereload: true },
                files: ['<%= config.source %>images/*.*'],
                tasks: ['newer:copy:files']
            }
        },
        assemble: {
            options: {
                flatten: false,
                partials: ['<%= config.source %>html/partials/**/*.{hbs,handlebars}'],
                layout: ['<%= config.source %>html/layouts/default.handlebars'],
                data: ['<%= config.source %>html/data/**/*.{json,yml}']
            },
            pages: {
                files: [{
                        expand: true,
                        cwd: '<%= config.source %>html/pages/',
                        dest: '<%= config.dest %>',
                        src: ['**/*.{hbs,handlebars}'],
                        ext: '.html'
                    }]
            }
        }
    });
    grunt.registerTask('build', [
        'listItems',
        'assemble',
        'stylus:dev',
        'copy:js',
        'copy:files'
    ]);
    grunt.registerTask('dev', [
        'listItems',
        'assemble',
        'newer:stylus:dev',
        'newer:copy:js',
        'newer:copy:files'
    ]);
    grunt.registerTask('default', [
        'dev',
        'connect:livereload',
        'watch'
    ]);
};