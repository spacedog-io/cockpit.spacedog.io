angular.module('spaceDogCockpit.controllers')

.controller('LoginCtrl', function($scope, $rootScope, $state, ErrorFormatService) {

  $scope.loginData = {
    username:'',
    password:'',
    backendId:'',
    rememberMe:true
  };

  var loginSuccess = function(data){

    if (data.credentials.roles.indexOf('admin') == -1) {

      $scope.error = "Vous n'avez pas le rôle [admin] suffisant pour vous connecter"

      $rootScope.hideLoading();

    } else {

      $state.go('app.schemas')

      $rootScope.hideLoading();

    }
  }


  var loginError = function(err) {
    $scope.error = ErrorFormatService.format(err);
    
    SpaceDog.Credentials.forget();

    $rootScope.hideLoading()
  }

  var loginCallback = function(err, data) {

    if (err!=null) {

      loginError(err)

    } else {

      loginSuccess(data)
    }

    $scope.$apply()
  }


  if (SpaceDog.Credentials.canTryLogin()) {

    $rootScope.showLoading()

    SpaceDog.Credentials.loginWithSavedCredentials(loginCallback)
  }


  $scope.login = function(){

    $scope.error = undefined;

    $rootScope.showLoading();

    SpaceDog.initialize($scope.loginData.backendId)

    SpaceDog.Credentials.login($scope.loginData, loginCallback)

  }



})