(() => {

	'use strict';

	angular
		.module('app')
		.factory('FLocalStorage', function()
		{



			// ------------------------------------------------------------
			// Name: set
			// Abstract: Handling function to save to localStorage
			// ------------------------------------------------------------
			const set = function(name, data)
			{
				// Is the data bad?
				if(data === undefined || data === null)
				{
					// Yes, notify of a warning
					alert('WARNING: The data you were trying to save in localStorage is not complete, and your data was not saved. If this problem persists, please contact support');
				}
				else
				{
					// No, save it to localStorage
					localStorage.setItem(name, JSON.stringify(data));
				}
			}



			// ------------------------------------------------------------
			// Name: get
			// Abstract: Handling function to get from localStorage
			// ------------------------------------------------------------
			const get = function(name)
			{
				return JSON.parse(localStorage.getItem(name));
			}



			return {
				set,
				get,
			}



		})
})();
