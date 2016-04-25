/**
 * Created by Whitebox on 3/13/2016.
 */
talentScreen.controller('subjectController',['$scope','$localStorage','tsCategory','tsQuizCount','popularity','subjectService','latestService',function($scope,$localStorage,tsCategory,tsQuizCount,popularity,subjectService,latestService){
    $scope.popularityShow=true;
    $scope.subjectShow=true;
    $scope.latestShow=true;
    $scope.normal=false;
    $scope.video=false;
    $scope.limit = 3;
    $scope.categoryName="Category";
    $scope.SortBy="Sort by";
    /*$scope.popularity=function(){
        alert("hi");
        $scope.popularity=false;
        $scope.normal=true;
        $scope.subject=true;
        $scope.latest=true;
        $scope.category=true;
        $scope.video=false;
        if(!$localStorage.popularity){
            var jsonData={
                type:"popularity"
            }
            popularity.postData({type:"popularity"}).then(function (response){
                for(var i in response){
                    if (!response[i].icon_class){
                        response[i].icon_class=' fa fa-book';
                        console.log( response[i].icon_class);
                    }
                    if(response[i].videoquiz == 0){
                        $scope.video=true;
                    }
                }
                /!*$scope.popularity=true;*!/
                $scope.popularityData= response;
                $scope.loadMore = function() {
                    if ($scope.limit + 5 < $scope.popularityData.length) {
                        $scope.limit += 5;
                    } else {
                        $scope.limit = $scope.popularityData.length;
                    }
                };
                $scope.loadMore();
                $localStorage.popularity=response;
            });
        }else {
            $scope.popularityData= $localStorage.popularity;
            $scope.loadMore = function() {
                if ($scope.limit + 5 < $scope.popularityData.length) {
                    $scope.limit += 5;
                } else {
                    $scope.limit = $scope.popularityData.length;
                }
            };
            $scope.loadMore();
        }
    }*/
    $scope.dropdown=[{name:"Popularity",fun:"popularitys()",id:1},{name:"Subjects",fun:"subjects()",id:2},{name:"Latest Added",fun:"lastdates()",id:3}];
    $scope.all=[{name:"ALL",fun:"category(0)"}];

    $scope.popularitys=function(){
        $scope.test='';
        $scope.popularityShow=false;
        $scope.subjectShow=true;
        $scope.latestShow=true;
        $scope.normal=true;
        $scope.categoryName="Category";
        $scope.SortBy="Popularity";
        if(!$localStorage.popularity){
            var jsonData={
                type:"popularity"
            }
            popularity.postData({type:"popularity"}).then(function (response){
                for(var i in response){
                    if (!response[i].icon_class){
                        response[i].icon_class=' fa fa-book';
                        console.log( response[i].icon_class);
                    }
                    if(response[i].videoquiz == 0){
                        $scope.video=true;
                    }
                }
                $localStorage.popularity=response;
                $scope.popularityData=$localStorage.popularity;
                $scope.loadMore = function() {
                    if ($scope.limit + 2 < $localStorage.popularity.length) {
                        $scope.limit += 2;
                    } else {
                        $scope.limit = $localStorage.popularity.length;
                    }
                };
                $scope.loadMore();
            });
        }
        else{
            $scope.popularityData= $localStorage.popularity;
            $scope.loadMore = function() {
                if ($scope.limit + 2 < $localStorage.popularity.length) {
                    $scope.limit += 2;
                } else {
                    $scope.limit = $localStorage.popularity.length;
                }
            };
            $scope.loadMore();
        }


    };
    $scope.subjects=function(){
        $scope.test='';
        $scope.popularityShow=true;
        $scope.subjectShow=false;
        $scope.latestShow=true;
        $scope.normal=true;
        $scope.categoryName="Category";
        $scope.SortBy="Subjects";
        if(!$localStorage.subjecttab){
            var jsonData={
                type:"subject"
            }
            subjectService.postData({type:"subject"}).then(function (response){
                for(var i in response){
                    if (!response[i].icon_class){
                        response[i].icon_class=' fa fa-book';
                        console.log( response[i].icon_class);
                    }
                    if(response[i].videoquiz == 0){
                        $scope.video=true;
                    }
                }
                $localStorage.subjecttab=response;
                $scope.subjectData=$localStorage.subjecttab;
                $scope.loadMore = function() {
                    if ($scope.limit + 3 < $localStorage.subjecttab.length) {
                        $scope.limit += 3;
                    } else {
                        $scope.limit = $localStorage.subjecttab.length;
                    }
                };
                $scope.loadMore();
            });
        }
        else{
            $scope.subjectData= $localStorage.subjecttab;
            $scope.loadMore = function() {
                if ($scope.limit + 3 < $localStorage.subjecttab.length) {
                    $scope.limit += 3;
                } else {
                    $scope.limit = $localStorage.subjecttab.length;
                }
            };
            $scope.loadMore();
        }


    };
    $scope.lastdates=function(){
        $scope.test='';
        $scope.popularityShow=true;
        $scope.subjectShow=true;
        $scope.latestShow=false;
        $scope.normal=true;
        $scope.categoryName="Category";
        $scope.SortBy="Latest Added";
        if(!$localStorage.latesttab){
            var jsonData={
                type:"latest"
            }
            latestService.postData({type:"latest"}).then(function (response){
                for(var i in response){
                    if (!response[i].icon_class){
                        response[i].icon_class=' fa fa-book';
                        console.log( response[i].icon_class);
                    }
                    if(response[i].videoquiz == 0){
                        $scope.video=true;
                    }
                }
                $localStorage.latesttab=response;
                $scope.latestData=$localStorage.latesttab;
                $scope.loadMore = function() {
                    if ($scope.limit + 3 < $localStorage.latesttab.length) {
                        $scope.limit += 3;
                    } else {
                        $scope.limit = $localStorage.latesttab.length;
                    }
                };
                $scope.loadMore();
            });
        }
        else{
            $scope.latestData= $localStorage.latesttab;
            $scope.loadMore = function() {
                if ($scope.limit + 3 < $localStorage.latesttab.length) {
                    $scope.limit += 3;
                } else {
                    $scope.limit = $localStorage.latesttab.length;
                }
            };
            $scope.loadMore();
        }


    };

    if(!$localStorage.subjectDesign){
        tsQuizCount.query().$promise.then(function (data) {
            console.log(data);
            for(var i in data){
                if (!data[i].icon_class){
                    data[i].icon_class=' fa fa-book';
                    console.log( data[i].icon_class);
                }
                if(data[i].videoquiz == 0){
                    $scope.video=true;
                }
            }
            $scope.dataNew=data;
            $scope.loadMore = function() {
                if ($scope.limit + 5 < data.length) {
                    $scope.limit += 5;
                } else {
                    $scope.limit = data.length;
                }
            };
            $scope.loadMore();
            $localStorage.subjectDesign=data;

        });
    }else{
        $scope.dataNew= $localStorage.subjectDesign;
        $scope.loadMore = function() {
            if ($scope.limit + 5 < $scope.dataNew.length) {
                $scope.limit += 5;
            } else {
                $scope.limit = $scope.dataNew.length;
            }
        };
        $scope.loadMore();
    }
    var counter = 0;

    if(!$localStorage.subjectCategory){
        tsCategory.query().$promise.then(function (data) {
            $scope.dataNewCat=data;
            /* console.log($scope.dataNew[0]);*/
            $localStorage.subjectCategory=data;


        });
    }else{
        $scope.dataNewCat= $localStorage.subjectCategory;

    }
    $scope.category=function(id){
        $scope.test='';
        $scope.popularityShow=true;
        $scope.normal=false;
        $scope.subjectShow=true;
        $scope.latestShow=true;
        $scope.dataNew=[];
        $scope.SortBy="Sort by";
        if(id==0){
            $scope.dataNew=$localStorage.subjectDesign;
            $scope.categoryName="All";
        }
        for(var a=0;a<$localStorage.subjectCategory.length;a++){
            if($localStorage.subjectCategory[a].id==id){
                $scope.categoryName=$localStorage.subjectCategory[a].name;
            }
        }
        var categeorySubjects=$localStorage.subjectDesign;
        for(var i=0;i<categeorySubjects.length;i++)
        {
            if($localStorage.subjectDesign[i].categoryid==id){

               /* $scope.categoryName=$localStorage.subjectCategor;*/
                $scope.dataNew.push($localStorage.subjectDesign[i]);

            }

        }
    }


}]);

