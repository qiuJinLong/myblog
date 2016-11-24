var bookModule = angular.module("bookModule", ["ui.router"]);

bookModule.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/index");

    $stateProvider.state("index", {
        url:"/index",
        views: {
            "":{
                templateUrl:"tpls/index.html"
            },
            "main@index":{
                templateUrl: "tpls/main.html"
            },
            "topbar@index": {
                templateUrl:"tpls/topbar.html"
            }
        }
    }).state("index.usermng", {
        url:"/usermng",
        views: {
            "main@index": {
                templateUrl:"tpls/usermng.html",
                controller: function($scope, $state) {
                    $scope.addUserType = function() {
                        $state.go("index.usermng.addusertype")
                    }
                }
            }
        }
    }).state("index.usermng.highendusers", {
        url:"/highendusers",
        templateUrl:"tpls/highendusers.html"
    }).state("index.usermng.normalendusers", {
        url:"/normalendusers",
        templateUrl: "tpls/normalendusers.html"
    }).state("index.usermng.lowendusers", {
        url:"/lowendusers",
        templateUrl:"tpls/lowendusers.html"
    }).state("index.usermng.addusertype", {
        url: '/addusertype',
        templateUrl: 'tpls/addusertypeform.html',
        controller: function($scope, $state) {
            $scope.backToPrevious = function() {
                window.history.back();
            }
        }
    })


    .state("index.permission", {
        url:"/permission",
        views: {
            "main@index": {
                template:'<div class="jumbotron text-center"><h3>这是权限管理模块</h3></div>'
            }
        }
    }).state("index.report", {
        url:"/report",
        views: {
            "main@index": {
                template: '<div class="jumbotron text-center"><h3>这是报表管理模块</h3></div>'
            }
        }
    }).state("index.setting", {
        url:"/setting",
        views: {
            "main@index": {
                template:'<div class="jumbotron text-center"><h3>这是系统设置模块</h3></div>'
            }
        }
    });
});