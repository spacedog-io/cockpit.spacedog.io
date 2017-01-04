angular.module('spaceDogCockpit.constants', [])

.constant('CONSTANTS', {

    LOCALSTORAGE: {
      ACCESS_TOKEN:"SPACEDOGCOCKPIT_REMEMBERED_ACCESS_TOKEN",
      USERNAME:"SPACEDOGCOCKPIT_REMEMBERED_USERNAME"
    },

    SPACEDOG: {

      // * Dev
      BASE_URL: "https://spacedogcockpit-dev.spacedog.io/1/",
      // * Pré-prod
      // * Prod ? automatiser dans le build

    }

});
