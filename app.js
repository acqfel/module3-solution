(function () {
'use strict';


angular.module('NarrowItDownApp',[])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com/menu_items.json")
.directive('foundItems',FoundItems);

function FoundItems(){
    var ddo={
    templateUrl:'itemsloaderindicator.template.html',
    scope:{
      items: '<',
      onRemove: '&'
     },
     controller: FoundItemsController,
        controllerAs: 'ctrl',
        bindToController: true
    };
    return ddo;
}

function FoundItemsController() {
   console.log(this.found);
}

NarrowItDownController.$inject=['MenuSearchService'];
function NarrowItDownController(MenuSearchService){
  var menu = this;
  menu.getMatchedMenuItems=function(searchTerm){
  var promise=MenuSearchService.getMatchedMenuItems(menu.searchTerm);
  promise.then( function(response){
    console.log(response);
    menu.found=response;
    console.log(menu.found);
      if (menu.found.length===0) {
        menu.message = "NOTHING FOUND";
      }
      else{
        menu.message='';
      }
  });
  };
  menu.removeitem=function(index){
  menu.found.splice(index,1);
  };
}

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath){
  var service = this;
  service.getMatchedMenuItems = function (searchTerm) {
  return $http({method:"GET",
               url: (ApiBasePath)})
  .then(function(response){
    var menu=response.data;
    var foundItems1=[];
    console.log(menu.menu_items.length);
    console.log(searchTerm);
    for(var i=0;i<menu.menu_items.length;i++){
      
      if((searchTerm!= null) && (searchTerm!=" ") && (menu.menu_items[i].description.toLowerCase().indexOf(searchTerm.toLowerCase())!== -1))
      {
        console.log(menu.menu_items[i].description.toLowerCase());
        console.log(searchTerm.toLowerCase());
        foundItems1.push(menu.menu_items[i]);
      }
    }
    console.log(foundItems1);
    return foundItems1;
    })
    .catch(function(error){
    console.log("Something went terribly wrong.");
    });
  
  };
}

})();