angular.module('lindat-aai', ['ui.bootstrap', 'ui.grid', 'angular-loading-bar']);

angular.module('lindat-aai').controller('LindatAAIController', function() {
  this.tabs = [
    { title: 'Entity Search', url: 'tabs/entity-search.html' },
    { title: 'Metadata Compare', url: 'tabs/metadata-compare.html' }
  ];
});
