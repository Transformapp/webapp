'use strict';

angular.module('transformAppApp')
  .filter('languageFormatter', function () {
    return function (input, languageType) {
    	var formattedString = "";
    	if (languageType == "people") {
    		if (input == 1) {
    			formattedString += input + " person";
    		}
    		else {
    			formattedString += input + " people";
    		}
    	}
    	return formattedString;
    };
  });
