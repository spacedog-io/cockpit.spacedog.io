angular.module('spaceDogCockpit.controllers')

.controller('SchemaCtrl', function($scope, $rootScope, $state) {

    $scope.schema = $scope.mainStore.schemas.filter(function(s){
        return s.type == $state.params.type
    })[0]

    // Get data ?
    // 
    // SpaceDog.Schema.list(function(err, data){
    //     $scope.mainStore.schemas = Object.keys(data).map(function(k){
    //         return {
    //             type:k,
    //             schema:data[k]
    //         }
    //     })        
    //     $scope.$apply();
    // })

})