angular.module('spaceDogCockpit.controllers')

.controller('SchemaCtrl', function($scope, $rootScope, $state) {

    $scope.size = 5;

    $scope.$watch('mainStore.schemas', function(n,o){
        if (n && n.length > 0) {
            $scope.schema = $scope.mainStore.schemas.filter(function(s){
                return s.type == $state.params.type
            })[0]
        }
    })
    
    var session = new SpaceDog.Data.PaginationSession(0, $scope.size)
window._session = session;

    $scope.from = function(){
        console.log("from !" + session.getFrom())
        return session.getFrom()
    }
    $scope.isNextPageAvailable = function(){
        console.log("isNextPageAvailable !" + session.isNextPageAvailable())
        return session.isNextPageAvailable()
    }
    $scope.isPrevPageAvailable = function(){
        console.log("isPrevPageAvailable !" + session.isPrevPageAvailable())
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

    var search = function(){

        SpaceDog.Data.search({
            "type":$state.params.type
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


})