module.exports = function(karma) {
    karma.set({
      browsers: ['Chrome', 'Firefox'],
      files: [
				'node_modules/angular/angular.js',
	    	'node_modules/angular-mocks/angular-mocks.js',
	      'app/js/main.js',
				'app/js/controllers/*.js',
				'app/js/factories/*.js',
				'tests/*.spec.js',
      ],
			'plugins' : [
				'karma-mocha',
				'karma-chai',
				'karma-chrome-launcher',
				'karma-firefox-launcher',
			],
      frameworks: ['mocha', 'chai'],
      singleRun: false
    });
};
