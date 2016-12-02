module.exports = function(karma) {
    karma.set({
      browsers: ['Chrome', 'Firefox'],
      files: [
				'node_modules/angular/angular.js',
	    	'node_modules/angular-mocks/angular-mocks.js',
	    	'node_modules/angular-ui-router/release/angular-ui-router.js',
	      'node_modules/angular-animate/angular-animate.js',
	      'node_modules/angular-messages/angular-messages.js',
	      'node_modules/angular-toastr/dist/angular-toastr.js',
	      'node_modules/satellizer/dist/satellizer.js',
	      'server/app/dist/js/main.js',
				'server/app/dist/js/controllers/*.js',
				'server/app/dist/js/factories/*.js',
				'tests/*.spec.js',
      ],
			'plugins' : [
				'karma-mocha',
				'karma-chai',
				'karma-chrome-launcher',
				'karma-firefox-launcher',
			],
      frameworks: ['mocha', 'chai'],
      singleRun: true 	// change back to false
    });
};
