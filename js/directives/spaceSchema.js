angular.module('spaceDogCockpit.directives')

.directive('spaceSchema', function() {
    return {
        template : '<div ng-include="\'/templates/spaceSchema.html\'"></div>',
        restrict: 'E',
        scope: {
            schema:'=',
            mini:'='
        },
        link: function (scope, element, attrs) {
            scope.Utils = {
                keys : Object.keys
            }
        }
    }
})