angular.module('spaceDogCockpit.directives')

.directive('spaceTuple', function() {
    return {
        template : '<div ng-include="\'/templates/spaceTuple.html\'"></div>',
        restrict: 'E',
        scope: {
            tuple:'=',
            schemaDefinition:'=',
            topLevel : '=?',
        },
        link: function (scope, element, attrs) {

            scope.disabled = angular.isDefined(scope.active) ? scope.active : false;
            scope.topLevel = angular.isDefined(scope.topLevel) ? scope.topLevel : false;

            scope.getFieldDefinition = function (prop){

                var fields = scope.schemaDefinition.fields || scope.schemaDefinition["_fields"]

                var def = fields.find(function(f) { return f.fieldname == prop })
                if (def) {
                    return def.fielddata
                }
                return null
            }

            var transformTuple = function(o) {

                var keys = Object.keys(o).filter(function(k){ return k != "$$hashKey" })

                // tableau de { order:# data:{...} }
                var sortMe = []
                keys.forEach(function(k) {
                    if (scope.schemaDefinition) {

                        var fields = scope.schemaDefinition.fields || scope.schemaDefinition["_fields"]

                        var def = fields.find(function(f) { return f.fieldname==k })
                        
                        if (k == "meta") {
                            def = {
                                fielddata : { 
                                    _type : "meta"
                                }
                            }
                        }

                        if (def == undefined) {
                            console.warn("SpaceTuple # no schema definition found for attribute ", k, " in schema", scope.schemaDefinition)
                        } else {
                            // console.log("switch on type = ", def.fielddata["_type"])
                            switch (def.fielddata["_type"]) {

                                case "boolean" :
                                    sortMe.push({ order:0, data:k });
                                    break

                                case "string":
                                    sortMe.push({ order:5, data:k })
                                    break

                                case "text":
                                    sortMe.push({ order:10, data:k })
                                    break;

                                case "object":
                                    sortMe.push({ order:20, data:k })
                                    break;

                                case "array":
                                    sortMe.push({ order:30, data:k })
                                    break;

                                case "meta":
                                    sortMe.push({ order:80, data:k })
                                    break;

                                default:
                                    sortMe.push({ order:100, data:k })
                                    break;
                            }
                        }
                    }
                })

                var sortF = function(a,b){
                    if (a.order < b.order)
                        return -1;
                    if (a.order > b.order)
                        return 1;
                    return b.data.localeCompare(a.data);
                }
                var sorted = sortMe.sort(sortF).sort(sortF)

                return sorted.map(function(s){ return s.data; });
            }

            scope.$watch("tuple", function(n,o){
                if (n) {
                    scope.items = transformTuple(scope.tuple);
                }
            })
        }
    }
})