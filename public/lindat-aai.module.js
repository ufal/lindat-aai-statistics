angular.module('lindat-aai', [
  'ui.bootstrap',
  'ui.router',
  'ui.grid',
  'ui.grid.autoResize',
  'ui.grid.selection',
  'ui.grid.exporter',
  'ui.grid.grouping',
  'hljs',
  'lindat',
  'angular-loading-bar']);

// Add new tab here
angular.module('lindat-aai').constant('TABS', [
  'entity-search',
  'metadata-compare'
]);

angular.module('lindat-aai').config(['$stateProvider', '$urlRouterProvider', 'TABS', function ($stateProvider, $urlRouterProvider, TABS) {

  $urlRouterProvider.otherwise('/' + _.first(TABS));

  angular.forEach(TABS, function (tab) {
    $stateProvider.state(tab, {
      url: '/' + tab,
      templateUrl: 'tabs/' + tab + '.html',
      controller: _.capitalize(_.camelCase(tab)) + 'Controller',
      controllerAs: 'vm'
    });
  });
}]);

angular.module('lindat-aai').controller('LindatAAIController', ['TABS', function(TABS) {
  this.tabs = _.map(TABS, function (tab) {
    return {
      name: tab,
      title: _.startCase(tab)
    }
  })
}]);
