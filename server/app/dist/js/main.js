'use strict';

(function () {

	'use strict';

	angular.module('app', ['ui.router', 'ngAnimate', 'ngMessages', 'toastr', 'satellizer']).config(appConfig);

	appConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$authProvider', 'toastrConfig'];
	function appConfig($stateProvider, $urlRouterProvider, $authProvider, toastrConfig) {

		// ------------------------------------------------------------
		// Angular Toast Configurations
		// ------------------------------------------------------------
		angular.extend(toastrConfig, {
			iconClasses: {
				error: 'toast-error',
				info: 'toast-info',
				success: 'toast-success',
				warning: 'toast-warning'
			}
		});

		// ------------------------------------------------------------
		// Satellizer Resolve Options
		// ------------------------------------------------------------
		var skipIfLoggedIn = ['$q', '$auth', function ($q, $auth) {
			var deferred = $q.defer();
			if ($auth.isAuthenticated()) {
				deferred.reject();
			} else {
				deferred.resolve();
			}

			return deferred.promise;
		}];

		var loginRequired = ['$q', '$location', '$auth', function ($q, $location, $auth) {
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
		$stateProvider.state('home', {
			url: '/',
			templateUrl: '../partials/home.html',
			controller: 'CLogin',
			controllerAs: 'controller',
			resolve: {
				loginRequired: loginRequired
			}
		}).state('login', {
			url: '/login',
			templateUrl: '../partials/login.html',
			controller: 'CLogin',
			controllerAs: 'controller',
			resolve: {
				skipIfLoggedIn: skipIfLoggedIn
			}
		}).state('about', {
			url: '/about',
			templateUrl: '../partials/about.html',
			controller: 'CMain',
			controllerAs: 'controller'
		}).state('admin', {
			url: '/admin',
			templateUrl: '../partials/admin.html',
			controller: 'CAdmin',
			controllerAs: 'controller'
		});

		// ------------------------------------------------------------
		// Satellizer Authentication Providers
		// ------------------------------------------------------------
		var domain = window.location.origin;
		var redirect = window.location.origin + '/';

		$authProvider.signupUrl = domain + '/auth/signup';
		$authProvider.loginUrl = domain + '/auth/login';

		$authProvider.facebook({
			clientId: '950583835073331',
			name: 'facebook',
			url: domain + '/auth/facebook',
			authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
			redirectUri: redirect,
			requiredUrlParams: ['display', 'scope'],
			scope: ['email'],
			scopeDelimiter: ',',
			display: 'popup',
			oauthType: '2.0',
			popupOptions: { width: 580, height: 400 }
		});

		$authProvider.twitter({
			url: domain + '/auth/twitter',
			authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
			redirectUri: redirect,
			oauthType: '1.0',
			popupOptions: { width: 495, height: 645 }
		});
	}
})();