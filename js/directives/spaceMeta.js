angular.module('spaceDogCockpit.directives')

.directive('spaceMeta', function() {
    return {
        template : '<div ng-include="\'/templates/spaceMeta.html\'"></div>',
        restrict: 'E',
        scope: {
            metaData:'=',
        },
        link: function (scope, element, attrs) {
            // console.log("spaceMeta items=",scope.metaData)
        }
    }
})