angular.module('spaceDogCockpit.directives')

.directive('spaceTuple', function() {
    return {
        template : '<div ng-include="\'/templates/spaceTuple.html\'"></div>',
        restrict: 'E',
        scope: {
            tuple:'='
        },
        link: function (scope, element, attrs) {
            scope.Utils = {
                keys : Object.keys
            }
        }
    }
})