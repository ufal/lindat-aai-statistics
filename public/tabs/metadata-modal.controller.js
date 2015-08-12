angular.module('lindat-aai').controller('MetadataModalController', ['$http', 'url', 'entityId', function($http, url, entityId) {
  var vm = this;

  vm.entityId = entityId;

  $http.get('./metadata/entity', { params: { url: url, id: entityId }})
    .success(function (data) {
      vm.data = data;
    });
}]);
