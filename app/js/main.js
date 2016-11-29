(() => {

	'use strict';

	angular
	.module('app', ['ui.router', 'satellizer'])
	.config(appConfig);

	appConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$authProvider'];
	function appConfig($stateProvider, $urlRouterProvider, $authProvider)
	{

		// ------------------------------------------------------------
		// Satellizer Resolve Options
		// ------------------------------------------------------------
		var skipIfLoggedIn = ['$q', '$auth', function($q, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.reject();
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    }];

    var loginRequired = ['$q', '$location', '$auth', function($q, $location, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.resolve();
      } else {
        $location.path('/login');
      }
      return deferred.promise;
    }];



    // ------------------------------------------------------------
		// Angular State Routes
		// ------------------------------------------------------------
		$stateProvider
		.state('home',
		{
			url: 					'/',
			templateUrl: 	'partials/home.html',
			controller: 	'CMain',
	    controllerAs: 'controller',
	    resolve: {
        loginRequired: loginRequired
      }
	  })
	  .state('login',
	  {
	  	url: 					'/login',
	  	templateUrl: 	'partials/login.html',
	  	controller: 	'CAuthentication',
	  	controllerAs: 'controller',
	  	resolve: {
        skipIfLoggedIn: skipIfLoggedIn
      }
	  })



	  // ------------------------------------------------------------
		// Satellizer Authentication Providers
		// ------------------------------------------------------------
    $authProvider.facebook({
      clientId: '950583835073331',
      name: 'facebook',
		  url: 'http://localhost:8000/auth/facebook',
		  authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
		  redirectUri: window.location.origin + '/',
		  requiredUrlParams: ['display', 'scope'],
		  scope: ['email'],
		  scopeDelimiter: ',',
		  display: 'popup',
		  oauthType: '2.0',
		  popupOptions: { width: 580, height: 400 }
    });
	}

})();
