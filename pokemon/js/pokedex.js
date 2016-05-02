var pokeApp = angular.module('pokedex', ['ngResource']);

pokeApp.config(['$resourceProvider', function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);

var pokeApiUrl = "http://pokeapi.co/"
var pokeDetailsApiUrl = pokeApiUrl + 'api/v1/pokemon/:id';

pokeApp.controller('searchController', function($scope, Pokemon, Link, $log, $http){

      $scope.searchById = function(pokeId){
            Link.setPokeId(pokeId);
      };

      $scope.choosedPokemon = function(pokeName){
            Link.setPokeName(pokeName);
            $log.log(pokeName);
      };

      $http({
              method: 'GET',
              url: 'http://pokeapi.co/api/v1/pokedex/1',
          }).then(function (response) {
                  $log.log(response.data.pokemon);
                  $scope.pokemons = response.data.pokemon;
          });
});

pokeApp.controller('detailsController', function($scope, Pokemon, Link, $log){
  $scope.$watch(function () {
     return Link.getPokeId();
 }, function () {
           Pokemon.get({id: Link.getPokeId()}, function (response) {

                if (response.national_id !== undefined){
                  $scope.poke = response;
                  $scope.poke.info = '#' + $scope.poke.national_id + ' ' + $scope.poke.name;
                  $scope.poke.image = 'http://pokeapi.co/media/img/' + $scope.poke.national_id + '.png';
                }

           });
 }, true);

 $scope.$watch(function () {
    return Link.getPokeName();
}, function () {
          Pokemon.get({id: Link.getPokeName()}, function (response) {
                  if (response.national_id !== undefined){
                    $scope.poke = response;
                    $scope.poke.info = '#' + $scope.poke.national_id + ' ' + $scope.poke.name;
                    $scope.poke.image = 'http://pokeapi.co/media/img/' + $scope.poke.national_id + '.png';
                  }

          });
}, true);
});

pokeApp.factory('Pokemon', ['$resource', function($resource){
        return $resource(pokeDetailsApiUrl, {id:'@id'});
}]);

pokeApp.factory('Link', function(){
var pokeId = 0;
var pokeName;

var poke = {

  getPokeId : function(){
     return pokeId;
  },

  setPokeId : function(pkid){
     pokeId = pkid;
  },

  getPokeName : function(){
     return pokeName;
  },

  setPokeName : function(name){
     pokeName = name;
  }
};
return poke;
});
