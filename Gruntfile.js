module.export = function(grunt) {

    grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            cssmin: {
                options: {
                    
                },
                target: {
                    files: [{                    
                        'css/site.min.css': ['css/bootstrap.css', 'css/bootstrap-theme.css']
                    }]
                }
            }
        });

        grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['cssmin']);

}