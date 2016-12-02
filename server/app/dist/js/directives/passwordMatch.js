'use strict';

angular.module('app').directive('passwordMatch', function () {
  return {
    require: 'ngModel',
    scope: {
      otherModelValue: '=passwordMatch'
    },
    link: function link(scope, element, attributes, ngModel) {
      ngModel.$validators.compareTo = function (modelValue) {
        return modelValue === scope.otherModelValue;
      };
      scope.$watch('otherModelValue', function () {
        ngModel.$validate();
      });
    }
  };
});