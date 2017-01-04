angular.module('spaceDogCockpit', [
    'ui.router',
    'spaceDogCockpit.controllers',
    'spaceDogCockpit.services',
    'spaceDogCockpit.constants'
])

    .run(function () {
        moment.locale('fr');
    })

    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('passwordReset', {
              url:'/passwordReset/:credentialId/:passwordResetCode',
              templateUrl : 'templates/passwordReset.html',
              controller: 'PasswordResetCtrl'
            })

            .state('login', {
                url: '/',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            })

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/app.html',
                controller: 'AppCtrl'
            })
            .state('app.home', {
                url: '/home',
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            })
            .state('app.requests', {
                url: '/requests',
                templateUrl: 'templates/requests.html',
                controller: 'RequestsCtrl'
            })
            .state('app.admins', {
                url: '/admins',
                templateUrl: 'templates/admin/admins.html',
                controller: 'AdminsCtrl'
            })
            .state('app.new_admin', {
                url: '/new_admin',
                templateUrl: 'templates/admin/new_admin.html',
                controller: 'NewAdminCtrl'
            })
            .state('app.admin', {
                url: '/admin/:id/:credential_id',
                templateUrl: 'templates/admin/admin.html',
                controller: 'AdminCtrl'
            })
            .state('app.clients', {
                url: '/clients',
                templateUrl: 'templates/client/clients.html',
                controller: 'ClientsCtrl'
            })
            .state('app.new_client', {
                url: '/new_client',
                templateUrl: 'templates/client/new_client.html',
                controller: 'NewClientCtrl'
            })
            .state('app.client', {
                url: '/client/:id',
                params: {
                    value: null
                },
                templateUrl: 'templates/client/client.html',
                controller: 'ClientCtrl'
            })

        if (location.hash.indexOf('passwordReset') == -1) {
          location.hash = '/';
        }
    })


    .run(function ($rootScope) {
        $rootScope.showLoading = function () {
            $rootScope.loading = true;
        };

        $rootScope.hideLoading = function () {
            $rootScope.loading = false;
        };
    })

    .run(function ($rootScope, $q, CONSTANTS) {
        $rootScope.askingPassword = false;
        $rootScope.askPassword = function () {
            var deferred = $q.defer();
            $rootScope.askedPassword = "";
            $rootScope.askedUsername = localStorage.getItem(CONSTANTS.LOCALSTORAGE.USERNAME)
            if (!$rootScope.askingPassword) {
                $rootScope.submitAskedPassword = function () {
                    $rootScope.askingPassword = false;
                    deferred.resolve('Basic ' + btoa($rootScope.askedUsername + ":" + $rootScope.askedPassword));
                }
                $rootScope.cancelAskedPassword = function () {
                    $rootScope.askingPassword = false;
                    deferred.reject();
                }
                $rootScope.askingPassword = true;
            }
            return deferred.promise;
        }


    })
