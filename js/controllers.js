angular.module('spaceDogCockpit.controllers', [])

.controller('LoginCtrl', function($scope, AuthService, $rootScope, $state, ErrorFormatService) {

  $scope.loginData = {
		username:'',
		password:'',
    rememberMe:true
	};

  var loginSuccess = function(response, rememberMe){
    if (response.data.credentials.roles.indexOf('admin') == -1) {
      $scope.error = "Vous n'avez pas le rôle [admin] suffisant pour vous connecter"
      $rootScope.hideLoading();
    } else {
      AuthService.setAccessToken(response.data.accessToken, rememberMe, $scope.loginData.username)
      $rootScope.hideLoading();

      // $state.go('app.home')
      $state.go('app.requests')
      // $state.go('app.admins')
      // $state.go('app.admin', {id:"AVe-NE9mUm-r44yDpKG8", credential_id:"AVe-NE7hUm-r44yDpKG6" })
    }
  }

  if (AuthService.hasAccessToken()) {
    $rootScope.showLoading();
    AuthService.tryLogin().then(function(response){
      loginSuccess(response, true)
    }, function(e){
      $scope.error = ErrorFormatService.format(e);
      AuthService.forgetAccessToken();
      $rootScope.hideLoading();
    })
  }

  $scope.login = function(){
    $scope.error = undefined;
    $rootScope.showLoading();
    AuthService.login($scope.loginData).then(function(response){
      loginSuccess(response, $scope.loginData.rememberMe)
    }, function(e){
      $rootScope.hideLoading();
      $scope.error = ErrorFormatService.format(e);
    })
  }



})

.controller('AppCtrl', function($scope, AuthService, $rootScope){

  $scope.logout = function(){
    $rootScope.showLoading();
    AuthService.logout().then(function(){
      AuthService.forgetAccessToken();
      location.reload();
    }, function(){
      AuthService.forgetAccessToken();
      location.reload();
    })
  }

})

.controller('HomeCtrl', function($scope){
})

.controller('RequestsCtrl', function($scope, $rootScope, RequestService, ErrorFormatService){

  $scope.filtersData = {};
  $scope.loadingNextDisabled = false;
  $scope.nextPageAvailable = true;
  $scope.processedDisabled = false;
  $scope.clientsList = [];

  var get = function(isNextPage){
    $rootScope.showLoading();
    $scope.loadingNextDisabled = true;

    RequestService.search($scope.filtersData).then(function(result){
      if (isNextPage) {
        $scope.requests = $scope.requests.concat(result.data.results);
      } else {
        $scope.requests = result.data.results;
      }

      _.forEach($scope.requests, function (data) {
          RequestService.getAppUser(data.meta.createdBy).then(function (response) {
              if(!_.isEmpty(response.data.results[0])){
                  data.client.firstname = response.data.results[0].firstname;
                  data.client.lastname = response.data.results[0].lastname;
                  data.client.tel = response.data.results[0].tel;
                  data.client.email = response.data.results[0].email;
              }
          }, function (e) {
              console.error(e);
          });
      })
      $rootScope.hideLoading();

      if ($scope.requests.length == result.data.total) {
        $scope.loadingNextDisabled = true;
        $scope.nextPageAvailable = false;
      } else {
        $scope.loadingNextDisabled = false;
        $scope.nextPageAvailable = true;
      }
    }, function(e){
      $scope.error = ErrorFormatService.format(e);
      $rootScope.hideLoading();
      $scope.loadingNextDisabled = true;
    })
  }

  var search = function(n, o){

          $scope.requests = [];
          RequestService.resetPaginationSession();
          get();
  };

  $scope.updateProcessed = function(value){
      $scope.processedDisabled = true;
    RequestService.updateProcessed(value.meta.id, value.processed).then(function (response) {
        $scope.processedDisabled = false;
    }, function (e) {
        console.error(e);
    });
  };

  var setClientSelect = function () {
        RequestService.getClients().then(function (response) {
         $scope.clientsList = response.data.results;
        }, function (e) {
            console.error(e);
        });
  }

  $scope.$watch('filtersData.requestType', search)
  $scope.$watch('filtersData.wasteType', search)
  $scope.$watch('filtersData.desiredTime', search)
  $scope.$watch('filtersData.desiredClient', search)
  $scope.$watch('filtersData.desiredProcess', search)

  RequestService.resetPaginationSession();
  get();
  setClientSelect();

  $scope.loadMore = function(){
    if ($scope.nextPageAvailable) {
      RequestService.setToLoadNextPage();
      get(true);
    }
  }
})

.controller('AdminsCtrl', function($scope, AdminService, ErrorFormatService, $rootScope){

  var get = function(){
    AdminService.get().then(function(result){
      $rootScope.hideLoading();
      $scope.admins = result.data.results;
    }, function(e){
      $rootScope.hideLoading();
      $scope.error = ErrorFormatService.format(e);
    })
  }

  get();

  $scope.delete = function(admin) {
    $rootScope.showLoading();
    if (confirm("Êtes-vous certain de vouloir supprimer cet administrateur ?")) {
      AdminService.delete(admin.meta.id, admin.credential_id).then(function(){
        get();
      }, function(e){
        $rootScope.hideLoading();
        $scope.error = ErrorFormatService.format(e);
      })
    }
  }

})

.controller('NewAdminCtrl', function($scope, AdminService, $rootScope, $state, ErrorFormatService){

  $scope.newAdminData = {
    username:undefined,
    firstname:undefined,
    lastname:undefined,
    password:undefined,
    passwordConfirmation:undefined
  }

  $scope.submit = function(){
    $scope.error = undefined;

    if (_.isEmpty($scope.newAdminData.username) ||
        _.isEmpty($scope.newAdminData.firstname) ||
        _.isEmpty($scope.newAdminData.lastname) ||
        _.isEmpty($scope.newAdminData.password) ||
        _.isEmpty($scope.newAdminData.passwordConfirmation)) {
      $scope.error = "Tout les champs sont obligatoires."
      return;
    }

    if ($scope.newAdminData.password != $scope.newAdminData.passwordConfirmation) {
      $scope.error = "Les mots de passes ne sont pas identiques."
      return;
    }

    $rootScope.showLoading();
    AdminService.post($scope.newAdminData).then(function(){
      $rootScope.hideLoading();
      $state.go('app.admins');
    }, function(e){
      $rootScope.hideLoading();
      $scope.error = ErrorFormatService.format(e);
    })
  }

})

.controller('AdminCtrl', function($scope, AdminService, ErrorFormatService, $rootScope, $stateParams){


  var find = function(){
    $rootScope.showLoading();

    AdminService.find($stateParams.id, $stateParams.credential_id).then(function(adminDto){
      $rootScope.hideLoading();
      $scope.adminData = adminDto;
    }, function(e){
      $rootScope.hideLoading();
      $scope.error = ErrorFormatService.format(e);
    })
  }
  find();

  $scope.submitData = function(){
    $scope.error = undefined;

    $rootScope.askPassword().then(function(challengedAuthorizationHeader){

      $rootScope.showLoading();

      AdminService.put(challengedAuthorizationHeader, $stateParams.id, $stateParams.credential_id, $scope.adminData).then(function(){
        find();
      }, function(e){
        $rootScope.hideLoading();
        $scope.error = ErrorFormatService.format(e);
      })

    })
  }

  $scope.submitPassword = function(){
    $scope.error = undefined;

    if ($scope.newPasswordData.password != $scope.newPasswordData.passwordConfirmation) {
      $scope.error = "Les mots de passes ne sont pas identiques."
      return;
    }

    $rootScope.askPassword().then(function(challengedAuthorizationHeader){

      $rootScope.showLoading();

      AdminService.putPassword(challengedAuthorizationHeader, $stateParams.credential_id, $scope.newPasswordData.password).then(function(){
        // ? less is moar
        $rootScope.hideLoading();
      }, function(e){
        $rootScope.hideLoading();
        $scope.error = ErrorFormatService.format(e);
      })
    });

  }

})

.controller("ClientsCtrl", function ($scope, ClientService) {
    var getClients = function () {
        ClientService.get().then(function (response) {
            $scope.clients = response.data.results;
        }, function (e) {
            console.error(e);
        })
    };

    getClients();

    $scope.removeData = function (client) {
        client.active = false;
        ClientService.put(client.meta.id, client).then(function (response) {
            getClients();
        }, function (e) {
            console.error(e);
        });
    }
})

.controller("ClientCtrl", function ($scope, ClientService, $state) {
    ClientService.getClientById($state.params.id).then(function (response) {
        $scope.clientData = response.data;
    }, function (e) {
        console.error(e);
    })

    $scope.editData = function () {

        if (_.isEmpty($scope.clientData.name) || _.isEmpty($scope.clientData.number)) {
            $scope.error = "Tout les champs sont obligatoires."
            return;
        }

        var clients = null;
        var clientWithSameNumber = null;

        ClientService.get().then(function (response) {
            clients = response.data.results;
            clientWithSameNumber = _.find(clients, function (o) {
                if (o.number == $scope.clientData.number && o.active == true && o.meta.id != $scope.clientData.meta.id) {
                    return o;
                }
            })

            if (clientWithSameNumber != null) {
                $scope.error = "Un client porte déjà ce numéro client.";
                return;
            }

            ClientService.put($state.params.id, $scope.clientData).then(function (response) {
                $state.go("app.clients");
            }, function (e) {
                console.error(e);
            })

        }, function (e) {
            console.error(e);
        })
    }
})

.controller("NewClientCtrl", function ($scope, ClientService, $state) {
    $scope.newClientData = {
        name: undefined,
        number: undefined,
        id_filter: undefined
    }

    $scope.createClient = function () {
        if (_.isEmpty($scope.newClientData.name) || _.isEmpty($scope.newClientData.number)) {
            $scope.error = "Tout les champs sont obligatoires."
            return;
        }

        ClientService.get().then(function (response) {
            $scope.clients = response.data.results;

            result = _.find($scope.clients, function (o) {
                if (o.number == $scope.newClientData.number && o.active == true) {
                    return o;
                }
            })

            if (result != null) {
                $scope.error = "Ce client éxiste déjà.";
                return;
            }

            ClientService.post($scope.newClientData).then(function (response) {
                $state.go("app.clients");
            }, function (e) {
                console.error(e);
            });

        }, function (e) {
            console.error(e);
        })
    }
})

.controller("PasswordResetCtrl", function(ErrorFormatService, $scope, $stateParams, $rootScope, ResetPasswordService){

  $scope.passwordResetData = {
    password:null,
    passwordConfirmation:null
  }

  $scope.reset = function(){
    $scope.error = "";

    if (_.isEmpty($scope.passwordResetData.password) || _.isEmpty($scope.passwordResetData.passwordConfirmation)) {
      $scope.error = "Veuillez renseigner les 2 champs";
      return;
    } else if (!_.isNumber(parseInt($scope.passwordResetData.password,10)) && !_.isNumber(parseInt($scope.passwordResetData.passwordConfirmation,10))) {
      $scope.error = "Le mot de passe doit contenir 4 chiffres";
      return;
    } else if (_.trim($scope.passwordResetData.password).length != 4 || _.trim($scope.passwordResetData.passwordConfirmation).length != 4) {
      $scope.error = "Le mot de passe doit contenir 4 chiffres";
      return;
    } else if ($scope.passwordResetData.password != $scope.passwordResetData.passwordConfirmation) {
      $scope.error = "Les mots de passe ne sont pas égaux.";
      return;
    } else {
      $rootScope.showLoading();
      ResetPasswordService.setPassword($stateParams.credentialId,
        $stateParams.passwordResetCode,
        $scope.passwordResetData.password)
      .then(function(){
        $rootScope.hideLoading();
        $scope.success = "Nouveau mot de passe changé avec succès";
      }, function(e) {

        $rootScope.hideLoading();
        $scope.error = ErrorFormatService.format(e);
      })
    }

  }


})
