angular.module('spaceDogCockpit.services')

.service('ErrorFormatService', function(){

  this.format = function(e) {
    return "Erreur ! "+ e.error.message + " ("+ e.error.code + " | " + e.status +")"
  }

})
