
// legacy to recycle

.service('AuthService', function($http, CONSTANTS) {

  var _accessToken = localStorage.getItem(CONSTANTS.LOCALSTORAGE.ACCESS_TOKEN);

  this.login = function(loginData) {
    localStorage.setItem(CONSTANTS.LOCALSTORAGE.USERNAME, loginData.username);

    return $http({
      method:'GET',
      url:CONSTANTS.SPACEDOG.BASE_URL+CONSTANTS.SPACEDOG.REST.LOGIN,
      headers:{
        'Authorization':'Basic '+btoa(loginData.username+':'+loginData.password)
      }
    })
  }

  this.logout = function() {
    return $http({
      method:'GET',
      url:CONSTANTS.SPACEDOG.BASE_URL+CONSTANTS.SPACEDOG.REST.LOGOUT,
      headers:{
        'Authorization':'Bearer '+_accessToken
      }
    })
  }

  this.setAccessToken = function(accessToken, rememberMe, username) {
    _accessToken = accessToken;

    $http.defaults.headers.common.Authorization = "Bearer "+accessToken;

    if (rememberMe == false) {
      this.forgetAccessToken();
    } else {
      localStorage.setItem(CONSTANTS.LOCALSTORAGE.ACCESS_TOKEN, accessToken)
    }
  }

  this.tryLogin = function(){
    return $http({
      method:'GET',
      url:CONSTANTS.SPACEDOG.BASE_URL+CONSTANTS.SPACEDOG.REST.LOGIN,
      headers:{
        'Authorization':'Bearer '+_accessToken
      }
    })
  }

  this.forgetAccessToken = function(){
    localStorage.removeItem(CONSTANTS.LOCALSTORAGE.ACCESS_TOKEN)
    _accessToken = undefined;
  }

  this.hasAccessToken = function(){
    return _accessToken != undefined && _accessToken != null;
  }

})

.service('RequestService', function ($http, CONSTANTS) {

  var _size = 10;
  var _from = 0;

  this.resetPaginationSession = function(){
    _from = 0;
  }

  this.setToLoadNextPage = function(){
    _from = _from + _size;
  }

  this.updateProcessed = function(id, value){
    return $http({
      method:"PUT",
      url:CONSTANTS.SPACEDOG.BASE_URL + CONSTANTS.SPACEDOG.REST.REQUEST + "/" + id,
      data:{
        processed: value
      }
    })
  }

  this.getClients = function(){
    return $http({
        method: "POST",
        url: CONSTANTS.SPACEDOG.BASE_URL + CONSTANTS.SPACEDOG.REST.SEARCH_CLIENT,
        data: {
          from : 0, size : 100,
          sort: [{"name": "asc"}],
          query: {
            bool: {
              must: [
                {
                  term: {
                    "active": true
                  }
                }
              ]
            }
          }
        }
      })
    }

    this.getAppUser = function (username) {
        return $http({
            method: "POST",
            url: CONSTANTS.SPACEDOG.BASE_URL + CONSTANTS.SPACEDOG.REST.SEARCH_APPUSER,
            data: {
                query: {
                    bool: {
                        must: [
                            {
                                term: {
                                    "meta.createdBy": username
                                }
                            }
                        ]
                    }
                }
            }
        })
    }

  this.search = function(filtersData){

    var searchData = {
      "size":_size,
      "from":_from,
      "sort":{
        "meta.createdAt":{
          "order":"desc"
        }
      }
    };
    if ( !_.isEmpty(filtersData.wasteType)
      || !_.isEmpty(filtersData.requestType)
      || _.isDate(filtersData.desiredTime)
      || !_.isEmpty(filtersData.desiredClient)
      || !_.isEmpty(filtersData.desiredProcess)) {
      searchData.query = {
        "bool":{
          "must":[ ]
        }
      };
    }

    if (!_.isEmpty(filtersData.wasteType))
      searchData.query.bool.must.push({ "term":{ "wasteType" : filtersData.wasteType }})
    if (!_.isEmpty(filtersData.requestType))
      searchData.query.bool.must.push({ "term":{ "requestType" : filtersData.requestType }})
    if (_.isDate(filtersData.desiredTime))
      searchData.query.bool.must.push({ "term":{ "desiredTime.date" : moment(filtersData.desiredTime).format('YYYY-MM-DD') }})
    if (!_.isEmpty(filtersData.desiredClient))
      searchData.query.bool.must.push({ "term":{ "client.number" : filtersData.desiredClient }})
    if (!_.isEmpty(filtersData.desiredProcess)) {
      searchData.query.bool.must.push({"term": {"processed": filtersData.desiredProcess}})
    }

    return $http({
      method: "POST",
      url: CONSTANTS.SPACEDOG.BASE_URL + CONSTANTS.SPACEDOG.REST.SEARCH_REQUEST,
      data:searchData
    })

  }

})

.service('AdminService', function($http, $q, CONSTANTS){

  var deferred = $q.defer()

  this.get = function(){
    return $http({
      method: "GET",
      url: CONSTANTS.SPACEDOG.BASE_URL + CONSTANTS.SPACEDOG.REST.ADMIN + "?refresh=true",
    })
  }

  this.post = function(newAdminData) {
    var deferred = $q.defer();

    // HTTP POST /credentials
    $http({
      method:"POST",
      url: CONSTANTS.SPACEDOG.BASE_URL + CONSTANTS.SPACEDOG.REST.CREDENTIALS,
      data:{
        username:newAdminData.username,
        password:newAdminData.password,
        email:newAdminData.username,
        level:"ADMIN"
      }
    }).then(function(result){
      var credential_id = result.data.id;

      $http({
        method:"POST",
        url:CONSTANTS.SPACEDOG.BASE_URL+CONSTANTS.SPACEDOG.REST.ADMIN,
        data:{
          lastname:newAdminData.lastname,
          firstname:newAdminData.firstname,
          credential_id:credential_id
        }
      }).then(deferred.resolve, deferred.reject);

    }, deferred.reject)

    return deferred.promise;
  }

  this.delete = function(id, credential_id) {
    return $q.all([
      $http({
        method:"DELETE",
        url:CONSTANTS.SPACEDOG.BASE_URL+CONSTANTS.SPACEDOG.REST.ADMIN + "/" + id
      }),
      $http({
        method:"DELETE",
        url:CONSTANTS.SPACEDOG.BASE_URL+CONSTANTS.SPACEDOG.REST.CREDENTIALS + "/" + credential_id
      })
    ])
  }

  this.find = function(id, credential_id) {
    var deferred = $q.defer();

    $q.all([
      $http({
        method:"GET",
        url:CONSTANTS.SPACEDOG.BASE_URL+CONSTANTS.SPACEDOG.REST.ADMIN + "/" + id
      }),
      $http({
        method:"GET",
        url:CONSTANTS.SPACEDOG.BASE_URL+CONSTANTS.SPACEDOG.REST.CREDENTIALS + "/" + credential_id
      })
    ]).then(function(res){

      deferred.resolve({
        username:res[1].data.username,
        email:res[1].data.email,
        firstname:res[0].data.firstname,
        lastname:res[0].data.lastname
      });

    }, deferred.reject)

    return deferred.promise;
  }

  this.put = function(challengedAuthorizationHeader, id, credential_id, adminData){
    return $q.all([
      $http({
        method:"PUT",
        url:CONSTANTS.SPACEDOG.BASE_URL+CONSTANTS.SPACEDOG.REST.ADMIN + "/" + id,
        data:{
          firstname:adminData.firstname,
          lastname:adminData.lastname
        }
      }),
      $http({
        method:"PUT",
        url:CONSTANTS.SPACEDOG.BASE_URL+CONSTANTS.SPACEDOG.REST.CREDENTIALS + "/" + credential_id,
        headers:{
          "Authorization":challengedAuthorizationHeader
        },
        data:{
          email:adminData.username,
          username:adminData.username
        }
      })
    ])
  }

  this.putPassword = function(challengedAuthorizationHeader, credential_id, password) {
    return $http({
      method:"PUT",
      url:CONSTANTS.SPACEDOG.BASE_URL+CONSTANTS.SPACEDOG.REST.CREDENTIALS + "/" + credential_id,
      data:{
        password:password
      },
      headers:{
        "Authorization":challengedAuthorizationHeader
      }
    })
  }

})

.service('ClientService', function($http, CONSTANTS) {
    this.get = function () {
        return $http({
            method: "POST",
            url: CONSTANTS.SPACEDOG.BASE_URL + CONSTANTS.SPACEDOG.REST.SEARCH_CLIENT + "?refresh=true",
            data: {
                "from" : 0, "size" : 100,
                "sort": [{"name": "asc"}],
                "query": {
                    "term": {
                        "active": true
                    }
                }
            }
        })
    }

  this.put = function (id, value) {
    return $http({
      method: "PUT",
      url: CONSTANTS.SPACEDOG.BASE_URL + CONSTANTS.SPACEDOG.REST.CLIENT + "/" + id,
      data: value
    })
  }

  this.getClientById = function (id) {
    return $http({
      method: "GET",
      url: CONSTANTS.SPACEDOG.BASE_URL + CONSTANTS.SPACEDOG.REST.CLIENT + "/" + id
    })
  }

  this.post = function (newClientData) {
    return $http({
      method: "POST",
      url: CONSTANTS.SPACEDOG.BASE_URL + CONSTANTS.SPACEDOG.REST.CLIENT,
      data: {
        name: newClientData.name,
        number: newClientData.number,
        active: true
      }
    })
  }
})

.service('ResetPasswordService', function($http, CONSTANTS) {

  this.setPassword = function(credential_id, passwordResetCode, newPassword) {

    var params = {
      password: newPassword
    };
    var data = Object.keys(params).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
    }).join('&')

    return $http({
      method:'POST',
      url:CONSTANTS.SPACEDOG.BASE_URL +'credentials/'+credential_id+'/password?passwordResetCode='+passwordResetCode,
      data:data,
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }

})
