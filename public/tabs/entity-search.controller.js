angular.module('lindat-aai').controller('EntitySearchController', ['$http', function($http) {
  var vm = this;

  vm.feedUrl = 'https://lindat.mff.cuni.cz/Shibboleth.sso/DiscoFeed';

  var htmlTpl = '<div class="ui-grid-cell-contents"><span ng-repeat="item in COL_FIELD">[{{item.lang}}] {{item.value}}<br></span></div>';
  vm.gridOpts = {
    rowHeight: 50,
    enableFiltering: true,
    enableSorting: true,
    showGridFooter: true,
    enableGridMenu: true,
    exporterMenuPdf: false,
    columnDefs: [
      { name:'entityId', field: 'entityID' },
      { name:'DisplayNames', field: 'DisplayNames', cellTemplate: htmlTpl },
      { name:'Descriptions', field: 'Descriptions', cellTemplate: htmlTpl }
    ],
    data: []
  };

  vm.search = function(url) {
    console.log(url);
    $http.get('./feed', { params: { url: url } })
      .success(function(data) {
        vm.error = null;
        vm.gridOpts.data = data;
      })
      .error(function(error) {
        vm.error = error;
      });
  };
}]);
