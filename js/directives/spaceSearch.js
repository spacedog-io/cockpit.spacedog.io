angular.module('spaceDogCockpit.directives')

.directive('spaceSearch', function($timeout, $rootScope) {
    return {
        template : '<div class="space-search">'
+'                      <div class="cntr space-search">'
+'                          <div class="cntr-innr">'
+'                            <label class="search" for="inpt_search">'
+'                                  <input ng-model="q" id="space-search-input" type="text" />'
+'                              </label>'
+'                          </div>'
+'                      </div>'
+'                   </div>',
        restrict: 'E',
        scope: {
            q:'='
        },
        link: function (scope, element, attrs) {

            var input = element.find("input"),
                label = element.find('label'),
                _previousTimeout;

            if(!(scope.q==undefined || scope.q == "")) {
                label.addClass('active');
            }

            input.on('focus', function () {
                label.addClass('active');
            });

            input.on('blur', function () {
                if(scope.q==undefined || scope.q == "") {
                    label.removeClass('active');
                }
            });

            input.on('keyup', function(){
                if (_previousTimeout) {
                    $timeout.cancel(_previousTimeout)
                }
                _previousTimeout = $timeout(function(){
                    console.log("keyup !")
                    $rootScope.$broadcast("should_update_q")
                },500)
            })
        }
    }
})