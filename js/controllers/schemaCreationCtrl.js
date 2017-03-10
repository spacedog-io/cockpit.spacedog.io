angular.module('spaceDogCockpit.controllers')

.controller('SchemaCreationCtrl', function($scope, $rootScope, $state) {

  $scope.dataTypes = SpaceDog.DataTypes;

  $scope.schemaData = {
    type: 'a',
    acl: [
      {
        role:'admin',
        content: SpaceDog.DataPermission.all.map(function(dp){ 
          return {
            name:dp,
            checked:SpaceDog.DataPermission.default_admin.indexOf(dp)!=-1
          }
        })
      },
      {
        role:'user',
        content: SpaceDog.DataPermission.all.map(function(dp){ 
          return {
            name:dp,
            checked:SpaceDog.DataPermission.default_user.indexOf(dp)!=-1
          }
        })
      },
      {
        role:'key',
        content: SpaceDog.DataPermission.all.map(function(dp){ 
          return {
            name:dp,
            checked:SpaceDog.DataPermission.default_key.indexOf(dp)!=-1
          }
        })
      }
    ],
    fields : [
    ],
  };

  $scope.addAcl = function(){
    $scope.schemaData.acl.push({ 
      role: '', 
      content: SpaceDog.DataPermission.all.map(function(dp){ return { name:dp, checked:false }; }) 
    })
  }

  $scope.removeAcl = function(index){
    $scope.schemaData.acl.splice(index, 1);
  }

  $scope.addField = function(){
    $scope.schemaData.fields.push({
      type:$scope.dataTypes[0]
    })
  }

  $scope.removeField = function(index){
    $scope.schemaData.fields.splice(index, 1);
  }

  $scope.submit = function(){
    console.log($scope.schemaData)

    var payload = {
      "_acl":{}
    }

    $scope.schemaData.acl.forEach(function(acl){
      payload['_acl'][acl.role] = acl.content
        .filter(function(acl_content){ return acl_content.checked===true; })
        .map(function(acl_content){ return acl_content.name; });
    });

    $scope.schemaData.fields.forEach(function(field){
      payload[field.name] = {
        '_type':field.type.name
      };
    });

    SpaceDog.Schema.create($scope.schemaData.type, payload, function(err, data){
      if (err !== null) {
        console.error(err);
      } else {
        console.log(data);
        $scope.loadSchemas();
      }
    })

  }

})