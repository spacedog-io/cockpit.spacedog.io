angular.module('spaceDogCockpit.controllers')

.controller('AppCtrl', function($scope, $rootScope, $state) {

    $scope.logout = function() {
        SpaceDog.Credentials.forget()
        $state.go('login')
    }

    $scope.backendId = SpaceDog.getBackendId

})