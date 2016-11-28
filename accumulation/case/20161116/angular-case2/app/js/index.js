var routerApp = angular.module('routerApp', ['ui.router']);
routerApp.config(function($stateProvider, $urlRouterProvider) {
    /*路由重定向 $urlRouterProvider:如果没有路由引擎能匹配当前的导航状态，那它就会默认将路径路由至 home.html,  
     *这个页面就是状态名称被声明的地方. */
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'tpls/home.html'
        })
        /*  nested list with custom controller*/
        .state('home.list', {
            url: '/list',
            templateUrl: 'tpls/home-list.html',
            controller: function($scope) {
                $scope.topics = ['Butterscotch', 'Black Current', 'Mango'];
            },
            onEnter: function() {
                //点击进入路由
                alert("enter");
            },
            onExit: function() {
                //点击退出路由
                alert("exit");
            }
        })
        // nested list with just some random string data
        .state('home.paragraph', {
            url: '/paragraph',
            template: 'I could sure use a scoop of ice-cream. '
        })
        .state('about', {
            url: '/about',
            /* view 用在该状态下有多个 ui-view 的情况，可以对不同的 ui-view 使用特定的 template, controller, resolve data
             绝对 view 使用 '@' 符号来区别，比如 'columnOne@about' 表明名为 'columnOne' 的 ui-view 使用了 'about' 状态的
             模板(template)，相对 view 则无*/
            views: {
                // 无名 view
                '': {
                    templateUrl: 'tpls/about.html'
                },
                // for "ui-view='columnOne'"
                'columnOne@about': {
                    template: '这里是第一列的内容'
                },
                // for "ui-view='columnTwo'"
                'columnTwo@about': {
                    templateUrl: 'tpls/table-data.html',
                    controller: 'Controller'
                }
            }
        });
});

routerApp.controller('Controller', function($scope) {
    $scope.message = 'test';
    $scope.topics = [{
        name: 'Butterscotch',
        price: 50
    }, {
        name: 'Black Current',
        price: 100
    }, {
        name: 'Mango',
        price: 20
    }];
});

routerApp.run(function($rootScope, $urlRouter) {
    //$bob = $urlRouter.href(new UrlMatcher("/about/:person"), {
    //    person: "bob"
    //});

    //alert($bob)
});