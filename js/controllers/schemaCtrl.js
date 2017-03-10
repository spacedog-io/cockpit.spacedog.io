angular.module('spaceDogCockpit.controllers')

.controller('SchemaCtrl', function($scope, $rootScope, $state) {

    $scope.size = 20;

    var session = new SpaceDog.Data.PaginationSession(0, $scope.size)

    var search = function(){

        var payload = {}

        if ($scope.mainStore.q) {
            payload = {
                "query": {
                    "match" : {
                        "_all" : $scope.mainStore.q
                    }
                }
            };
        }

        SpaceDog.Data.search({
            "type":$state.params.type,
            "payload":payload
        }, function(err, data){
            if (err!=null) {
                $scope.error = err
            } else {
                $scope.data = data;
            }
            $scope.$apply()
        }, session)

    }

    search()

    $scope.$watch('mainStore.schemas', function(n,o){
        if (n && n.length > 0) {
            $scope.schema = $scope.mainStore.schemas.filter(function(s){
                return s.type == $state.params.type
            })[0]
        }
    })

    $scope.$on('should_update_q', search)
    

    $scope.from = function(){
        return session.getFrom()
    }
    $scope.isNextPageAvailable = function(){
        return session.isNextPageAvailable()
    }
    $scope.isPrevPageAvailable = function(){
        return session.isPrevPageAvailable()
    }

    $scope.prevPage = function(){
        session.pointPrevPage()
        search()
    }

    $scope.nextPage = function(){
        session.pointNextPage()
        search()
    }



})