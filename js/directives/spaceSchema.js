angular.module('spaceDogCockpit.directives')

.directive('spaceSchema', function() {
    return {
        template : '<div ng-include="\'/templates/schemas/spaceSchema.html\'"></div>',
        restrict: 'E',
        scope: {
            schema:'='
        },
        link: function (scope, element, attrs) {
            scope.Utils = {
                keys : Object.keys
            }

            console.log("scope.schema", scope.schema)
        }
    }
})