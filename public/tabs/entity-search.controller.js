angular.module('lindat-aai').controller('EntitySearchController', ['$http', '$sce', function($http, $sce) {
  var vm = this;

  vm.feedUrl = 'https://lindat.mff.cuni.cz/Shibboleth.sso/DiscoFeed';

  var htmlTpl = '<div class="ui-grid-cell-contents"><span ng-repeat="item in COL_FIELD">[{{item.lang}}] {{item.value}}<br></span></div>';
  vm.gridOpts = {
    rowHeight: 50,
    enableFiltering: true,
    enableSorting: true,
    showGridFooter: true,
    columnDefs: [
      { name:'entityId', field: 'entityID' },
      { name:'DisplayNames', field: 'DisplayNames', cellTemplate: htmlTpl },
      { name:'Descriptions', field: 'Descriptions', cellTemplate: htmlTpl },
    ],
    data: []
  }

  function formatLangCol(res) {
    var arr = [];
    if (!res) {
      return '';
    }
    for (var i = 0, ii = res.length; i < ii; i++) {
      var val = res[i], str = '';
      if (val.lang) {
        str += '[' + val.lang + '] ';
      }
      str += val.value;
      arr.push(str);
    };

    return $sce.trustAsHtml(arr.join('<br>'));
  }

  vm.search = function(url) {
    console.log(url);
    $http.get('./feed', { params: { url: url } })
      .success(function(data) {
        vm.error = null;
        vm.gridOpts.data = data;
      })
      .error(function(error, status) {
        vm.error = error;
      });
  };
}]);
