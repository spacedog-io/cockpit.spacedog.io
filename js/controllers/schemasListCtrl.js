angular.module('spaceDogCockpit.controllers')

.controller('SchemasListCtrl', function($scope, $rootScope, $state) {

    SpaceDog.Schema.list(function(err, data){
        $scope.mainStore.schemas = Object.keys(data).map(function(k){
            return {
                type:k,
                schema:data[k]
            }
        })        
        $scope.$apply();
    })

})