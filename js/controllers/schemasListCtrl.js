angular.module('spaceDogCockpit.controllers')

.controller('SchemasListCtrl', function($scope, $rootScope, $state) {

    SpaceDog.Schema.list(function(err, data) {
      if (err !== null) {
        console.error(err);
      } else {
        console.log(data);
      }
    });

})