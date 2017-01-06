angular.module('spaceDogCockpit.directives')

.directive('spaceField', function() {
    return {
        template : '<div ng-include="\'/templates/spaceField.html\'"></div>',
        restrict: 'E',
        scope: {
            field:'=',
            value:'='
        },
        link: function (scope, element, attrs) {
            console.log("spaceField ")
        }
    }
})