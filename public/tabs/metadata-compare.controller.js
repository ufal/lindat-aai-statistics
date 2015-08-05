angular.module('lindat-aai').controller('MetadataCompareController', ['$http', '$sce', function($http, $sce) {
  var vm = this;

  vm.metadata1 = 'https://infra.clarin.eu/aai/prod_md_about_spf_idps.xml';
  vm.metadata2 = 'https://mds.edugain.org/';

  vm.gridOpts = {
    enableFiltering: true,
    enableSorting: true,
    showGridFooter: true,
    columnDefs: [
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

  function compareMetadata(m1, m2) {
    var m = vm.gridOpts.data = [],
      both = _.intersection(m1, m2)
      only1 = _.difference(m1, m2),
      only2 = _.difference(m2, m1);

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
        metadata1: item,
        metadata2: item
      });
    });

    _.forEach(only1, function (item) {
      m.push({
        metadata1: item,
        metadata2: ''
      });
    });

    _.forEach(only2, function(item) {
      m.push({
        metadata1: '',
        metadata2: item
      });
    });
  }

  vm.submit = function (url1, url2) {
    vm.loading = true;
    var loader = 2, m1, m2;

    function loaded() {
      loader--;
      if (loader === 0) {
        compareMetadata(m1, m2);
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
