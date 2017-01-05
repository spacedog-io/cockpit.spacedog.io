angular.module('spaceDogCockpit.controllers')

.controller('SchemasListCtrl', function($scope, $rootScope, $state) {

    SpaceDog.Schema.list(function(err, data){
        $scope.mainStore.schemas = Object.keys(data).map(function(k){
            return {
                type:k,
                fields: Object.keys(data[k]).map(function(l){
                    return {
                        fieldname : l,
                        fielddata : data[k][l]
                    }
                })
            }
        })        
        $scope.$apply();
    })

})