angular.module('spaceDogCockpit.controllers')

.controller('LoginCtrl', function($scope, $rootScope, $state) {

  $scope.loginData = {
    username:'',
    password:'',
    backendId:'',
    rememberMe:true
  };

  var loginSuccess = function(data){
    console.log(data);
    if (data.credentials.roles.indexOf('admin') == -1) {
      $scope.error = "Vous n'avez pas le rôle [admin] suffisant pour vous connecter"
      $rootScope.hideLoading();
    } else {
      // $state.go('app.home')
      $state.go('app.schemas')
      $rootScope.hideLoading();
      // $state.go('app.admins')
      // $state.go('app.admin', {id:"AVe-NE9mUm-r44yDpKG8", credential_id:"AVe-NE7hUm-r44yDpKG6" })
    }
  }

  // if (AuthService.hasAccessToken()) {
  //   $rootScope.showLoading();
  //   AuthService.tryLogin().then(function(response){
  //     loginSuccess(response, true)
  //   }, function(e){
  //     $scope.error = ErrorFormatService.format(e);
  //     AuthService.forgetAccessToken();
  //     $rootScope.hideLoading();
  //   })
  // }

  $scope.login = function(){
    $scope.error = undefined;
    $rootScope.showLoading();

    SpaceDog.initialize($scope.loginData.backendId)
    SpaceDog.Credentials.login($scope.loginData, function(err, data) {
      if (err!=null) {
        
        $rootScope.hideLoading();
        $scope.error = ErrorFormatService.format(err);

      } else {
          
        loginSuccess(data)
        
      }
    })

  }



})