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

    $scope.loadSchemas = function(){

        SpaceDog.Schema.list(function(err, data){

            // recursive method to transform a schema
            var transformSchema = function(o){
                var fields = Object.keys(o).map(function(l){
                        return {
                            fieldname : l,
                            fielddata : o[l]
                        }
                    }).filter(function(f) {
                        return f.fieldname.indexOf("_") != 0
                    })

                _.each(fields, function(f){
                    if (f.fielddata["_type"] == "object") {
                        f.fielddata["_fields"] = transformSchema(f.fielddata)
                    }
                })

                return fields
            }

            $scope.mainStore.schemas = Object.keys(data).map(function(k){
                var fields = transformSchema(data[k])
                return {
                    foo:k,
                    type:k,
                    fields: fields
                }
            })      

            // DEBUG
            window._schemas = $scope.mainStore.schemas

            $scope.$apply();
        })
    }

    $scope.loadSchemas();

})