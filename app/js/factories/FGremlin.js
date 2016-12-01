(() => {

	'use strict';

	angular
		.module('app')
		.factory('FGremlin', function()
		{



			// ------------------------------------------------------------
			// Name: unleash
			// Initiates Gremlin moneky testing
			// ------------------------------------------------------------
			const unleash = function(form)
			{
				// Unleash the monkey!!!
	  		gremlins.createHorde().unleash();
			}



			return {
				unleash,
			}



		})
})();
