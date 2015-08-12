angular.module('lindat-aai').controller('MetadataCompareController', ['$http', '$q', '$modal', function($http, $q, $modal) {
  var vm = this;

  vm.metadata1 = 'https://infra.clarin.eu/aai/prod_md_about_spf_idps.xml';
  vm.metadata2 = 'https://mds.edugain.org/';

  vm.gridData = [];
  vm.filterType = '';

  var aggregations = {
    countNonEmpty: {
      label: '',
      aggregationFn: function (aggregation, fieldValue) {
        if (fieldValue) {
          aggregation.count = (aggregation.count || 0) + 1;
        }
      },
      finalizerFn: function (aggregation) {
        aggregation.value = aggregation.count || 0;
      }
    }
  };

  var metadataColTpl = '<div class="ui-grid-cell-contents" title="TOOLTIP">' +
    '<button ng-if="COL_FIELD && COL_FIELD.length > 0" title="See metadata" class="btn btn-xs" ng-click="grid.appScope.vm.showMetadata(grid.appScope.vm[col.name], COL_FIELD)">' +
    '<i class="glyphicon glyphicon-eye-open"></i>' +
    '</button> ' +
    '{{COL_FIELD CUSTOM_FILTERS}}</div>';

  vm.gridOpts = {
    enableFiltering: true,
    enableSorting: true,
    showGridFooter: true,
    enableGridMenu: true,
    exporterMenuPdf: false,
    columnDefs: [
      { name: 'type', width: 100 },
      { name:'metadata1', cellTemplate: metadataColTpl },
      { name:'metadata2', cellTemplate: metadataColTpl }
    ],
    data: []
  };

  var bothColTpl = '<div class="ui-grid-cell-contents text-center" ' +
    'ng-class="{\'text-success\': COL_FIELD, \'text-danger\': !COL_FIELD}"><span ng-switch="COL_FIELD">' +
    '<span ng-switch-when="true">&#10004;</span>' +
    '<span ng-switch-when="false">&#10007</span>' +
    '<span ng-switch-default>{{COL_FIELD CUSTOM_FILTERS}}</span>' +
    '</span></div>';

  vm.statsOpts = {
    enableSorting: true,
    enableFiltering: true,
    enableGridMenu: true,
    exporterMenuPdf: false,
    showGridFooter: true,
    showColumnFooter: true,
    treeCustomAggregations: aggregations,
    columnDefs: [
      { name:'domain', width: 100, grouping: { groupPriority: 0 }, sort: { priority: 0, direction: 'asc' } },
      { name:'metadata1', treeAggregationType: 'countNonEmpty', cellTemplate: metadataColTpl },
      { name:'both', width: 60, treeAggregationType: 'countNonEmpty', cellTemplate: bothColTpl },
      { name:'metadata2', treeAggregationType: 'countNonEmpty', cellTemplate: metadataColTpl }
    ],
    data: []
  };

  function extractTopDomain(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    //find & remove port number
    domain = domain.split(':')[0];

    return _.last(domain.split('.'));
  }

  vm.showMetadata = function (url, entityId) {
    $modal.open({
      templateUrl: 'metadata-modal.html',
      controller: 'MetadataModalController',
      controllerAs: 'vm',
      size: 'lg',
      resolve: {
        url: function () {
          return url;
        },
        entityId: function () {
          return entityId;
        }
      }
    });
  };

  vm.filterMetadata = function (type) {
    var newData = type ?
      _.filter(vm.gridData, function (item) { return item.type == type; }) : vm.gridData;
    vm.gridOpts.data = vm.statsOpts.data = newData;
  };

  vm.compareMetadata = function (m1, m2) {
    var m = vm.gridData = [],
      m1Entities = _.indexBy(m1, function (item) { return item[0] }),
      m2Entities = _.indexBy(m2, function (item) { return item[0] }),
      m1Keys = _.keys(m1Entities),
      m2Keys = _.keys(m2Entities),
      both = _.intersection(m1Keys, m2Keys),
      only1 = _.difference(m1Keys, m2Keys),
      only2 = _.difference(m2Keys, m1Keys);

    _.forEach(both, function (item) {
      m.push({
        type: m1Entities[item][1],
        domain: extractTopDomain(item),
        metadata1: item,
        both: true,
        metadata2: item
      });
    });

    _.forEach(only1, function (item) {
      m.push({
        type: m1Entities[item][1],
        domain: extractTopDomain(item),
        metadata1: item,
        both: false,
        metadata2: null
      });
    });

    _.forEach(only2, function (item) {
      m.push({
        type: m2Entities[item][1],
        domain: extractTopDomain(item),
        metadata1: null,
        both: false,
        metadata2: item
      });
    });

    vm.filterMetadata(vm.filterType);
  };

  vm.submit = function (url1, url2) {
    vm.loading = true;
    $q.all([
      $http.get('./metadata', { params: {url: url1} }),
      $http.get('./metadata', { params: {url: url2} })
    ]).then(function (ms) {
      var m1 = vm.m1 = ms[0].data,
          m2 = vm.m2 = ms[1].data;
      vm.compareMetadata(m1, m2);
    }, function (err) {
      vm.error = err.data;
    }).finally(function () {
      vm.loading = false;
    });
  };
}]);
