'use strict';

(function () {

	'use strict';

	angular.module('app', ['ui.router', 'ngAnimate', 'ngMessages', 'toastr', 'satellizer']).config(appConfig);

	appConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$authProvider', 'toastrConfig', '$locationProvider'];
	function appConfig($stateProvider, $urlRouterProvider, $authProvider, toastrConfig, $locationProvider) {

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
		$stateProvider.state('admin', {
			url: '/admin',
			templateUrl: '../partials/admin.html',
			controller: 'CAdmin',
			controllerAs: 'controller'
		}).state('home', {
			url: '/home',
			templateUrl: '../partials/home.html',
			controller: 'CLogin',
			controllerAs: 'controller',
			resolve: {
				loginRequired: loginRequired
			}
		}).state('about', {
			url: '/about',
			templateUrl: '../partials/about.html',
			controller: 'CMain',
			controllerAs: 'controller'
		}).state('landing', {
			url: '/',
			templateUrl: '../partials/landingpage.html',
			controller: 'CLogin',
			controllerAs: 'controller'
		}).state('landing2', {
			url: '',
			templateUrl: '../partials/landingpage.html',
			controller: 'CLogin',
			controllerAs: 'controller'
		}).state('billboard', {
			url: '/admin/billboard',
			templateUrl: '../partials/billboard.html',
			controller: 'CBillboard',
			controllerAs: 'controller'
		});

		// $locationProvider.html5Mode(true);

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