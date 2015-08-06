angular.module('lindat-aai').controller('MetadataCompareController', ['$http', '$sce', function($http, $sce) {
  var vm = this;

  vm.metadata1 = 'https://infra.clarin.eu/aai/prod_md_about_spf_idps.xml';
  vm.metadata2 = 'https://mds.edugain.org/';

  vm.gridOpts = {
    enableFiltering: true,
    enableSorting: true,
    showGridFooter: true,
    columnDefs: [
      { name: 'type', width: 100 },
      { name:'metadata1' },
      { name:'metadata2' }
    ],
    data: []
  }

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

  vm.compareMetadata = function (m1, m2, type) {
    if (type) {
      m1 = _.filter(m1, function (item) { return item[1] == type; });
      m2 = _.filter(m2, function (item) { return item[1] == type; });
    }
    var m = vm.gridOpts.data = [],
      m1Entities = _.indexBy(m1, function (item) { return item[0] }),
      m2Entities = _.indexBy(m2, function (item) { return item[0] }),
      m1Keys = _.keys(m1Entities),
      m2Keys = _.keys(m2Entities),
      both = _.intersection(m1Keys, m2Keys),
      only1 = _.difference(m1Keys, m2Keys),
      only2 = _.difference(m2Keys, m1Keys);

    // domain stats
    var domains = {
      both: _.groupBy(both, extractTopDomain),
      m1: _.groupBy(only1, extractTopDomain),
      m2: _.groupBy(only2, extractTopDomain)
    };
    domains.all = _.union(_.keys(domains.both), _.keys(domains.m1), _.keys(domains.m2)).sort();

    vm.stats = {
      both: both.length,
      m1: only1.length,
      m2: only2.length,
      domains: domains
    };

    _.forEach(both, function (item) {
      m.push({
        type: m1Entities[item][1],
        metadata1: item,
        metadata2: item
      });
    });

    _.forEach(only1, function (item) {
      m.push({
        type: m1Entities[item][1],
        metadata1: item,
        metadata2: ''
      });
    });

    _.forEach(only2, function (item) {
      m.push({
        type: m2Entities[item][1],
        metadata1: '',
        metadata2: item
      });
    });
  };

  vm.submit = function (url1, url2) {
    vm.loading = true;
    var loader = 2, m1, m2;

    function loaded() {
      loader--;
      if (loader === 0) {
        vm.m1 = m1;
        vm.m2 = m2;
        vm.compareMetadata(m1, m2);
        vm.loading = false;
      }
    }

    $http.get('./metadata', { params: {url: url1} })
      .success(function (data) {
        m1 = data;
        loaded();
      });

    $http.get('./metadata', { params: {url: url2} })
      .success(function (data) {
        m2 = data;
        loaded();
      });
  };
}]);
