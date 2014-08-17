'use strict';

ngAuth.directive("toggleVisible", function() {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            element.on('click', function() {
            	$('div.form-auth').toggle('500');
            });
        }
    };
});
