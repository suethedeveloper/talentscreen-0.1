/**
 * Created by Sue on 4/27/2016.
 */
talentScreen.controller("preQuizController",['$scope','$rootScope','$cookieStore','$localStorage','tsQuizTemplate','codeCompiler','$timeout',function($scope,$rootScope,$cookieStore,$localStorage,tsQuizTemplate,codeCompiler,$timeout){
    var count=1;
    var sessiondata=$cookieStore.get("session");
    $scope.subjectName="";
    $scope.quizSubject=true;
    $scope.sessiondata = sessiondata;

    var jsonData={type:"subject",token:sessiondata.token,testtype:$scope.testtype};

    tsQuizTemplate.query(jsonData).$promise.then(function (data) {
        if(data[0].status==400 || data[0].status==403 ||data[0].status==404 || data[0].status==500){
            alert(data[0].message);
        }
        else{
            $localStorage.subject=data;
            $scope.subjects=data;
            $scope.quizSubject=true;}
    });


    $scope.selectSubjectChanged=function(){
        $scope.levels=[];
        $scope.quizSubject=false;

        var subjects=$localStorage.subject;
        for(var i=0;i<subjects.length;i++)
        {
            if(subjects[i].id==$scope.selectSubject)
            {
                $scope.subjectName=subjects[i].name;
                $scope.iconurl=subjects[i].icon_class;
                $scope.heading="Subject";
            }
        }
        var jsonData={type:"level",token:sessiondata.token,subjectid:$scope.selectSubject,testtype:$scope.testtype};
        tsQuizTemplate.query(jsonData).$promise.then(function (data) {
            if(data[0].status==400 || data[0].status==403 ||data[0].status==404 || data[0].status==500){
                alert(data[0].message);
            }  else{
                $localStorage.level=data;
                $scope.levels=data;
                $scope.quizLevels=true;}
        });
    };

    $scope.selectLevelChanged=function(){
        var level=$localStorage.level;
        for(var i=0;i<level.length;i++){
            if(level[i].id==$scope.selectedLevel)
            {
                levelCount=level[i].count;
            }
        }
        if ($scope.testtype === 2){
            var jsonData={type:"language",token:sessiondata.token,subjectid:$scope.selectSubject};
            tsQuizTemplate.query(jsonData).$promise.then(function (data) {
                $scope.language=data[0].name;
                $scope.languageid=data[0].id;
                $scope.codeTextTemplate=data[0].template;
            });
        }

        $scope.quizLevels=false;
        $rootScope.quizStartAccepted=true;
        $rootScope.selectedLevel = $scope.selectedLevel;
        $rootScope.selectSubject = $scope.selectSubject;
        $rootScope.subjectName = $scope.subjectName;
        $rootScope.iconurl = $scope.iconurl;
    };
}]);