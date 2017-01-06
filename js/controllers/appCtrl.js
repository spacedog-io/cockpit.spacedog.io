angular.module('spaceDogCockpit.controllers')

.controller('AppCtrl', function($scope, $rootScope, $state) {

    $scope.Math = window.Math;

    $scope.mainStore = {
        schemas:[],
        backendId:SpaceDog.getBackendId(),
        q:null
    }
    
    $scope.logout = function() {
        SpaceDog.Credentials.forget()
        $state.go('login')
    }

    $scope.backendId = SpaceDog.getBackendId

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