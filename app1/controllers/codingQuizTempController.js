/**
 * Created by sande on 4/19/2016.
 */
talentScreen.controller("codingQuizController",['$scope','$cookieStore','$localStorage','tsQuizTemplate','codeCompiler','$timeout','quizResults',function($scope,$cookieStore,$localStorage,tsQuizTemplate,codeCompiler,$timeout,quizResults){
    $scope.counter = 5;
    var count=1;
    $scope.count15 = true;
    var sessiondata=$cookieStore.get("session");
    var totalTimeForCodingQuiz=0;
    var totalTimeForQuiz=0;
    var jsonData={type:"subject",token:sessiondata.token,testtype:2};
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
        var jsonData={type:"level",token:sessiondata.token,subjectid:$scope.selectSubject,testtype:2};
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
            var jsonData={type:"language",token:sessiondata.token,subjectid:$scope.selectSubject};
            tsQuizTemplate.query(jsonData).$promise.then(function (data) {
                $scope.language=data[0].name;
                $scope.languageid=data[0].id;
                $scope.codeTextTemplate=data[0].template;
            });
        $scope.quizLevels=false;
        $scope.quizStartAccepted=true;

    };
    $scope.cancelQuiz=function(){
        $scope.$broadcast('timer-stopped', $scope.counter);
        $scope.counter = 5;
        $timeout.cancel(mytimeout);
        $scope.countDown=false;
        $scope.quizTypes=false;
    };
    $scope.nextQuestion=function(){
        $scope.resultStatus=false;
        $scope.$broadcast('timer-stopped', 0);
        $timeout.cancel(mytimeout);
    };
    $scope.finishQuestion=function(){
        $scope.resultStatus=false;
        $scope.$broadcast('timer-stopped', 0);
        $timeout.cancel(mytimeout);
    };
    $scope.compile = function () {
        codingCompilation(count);
    };
    $scope.startQuiz=function(){
        $scope.quizStartAccepted=false;
        $scope.countDown=true;
        $localStorage.quiz="";
        var jsonData={type:"questions",token:sessiondata.token,candidateid:sessiondata.data._id,testtype:2,testlevel:$scope.selectedLevel,testsubject:$scope.selectSubject,count:levelCount};
        tsQuizTemplate.show(jsonData).$promise.then(function (data){
            $localStorage.quiz=data;
        });
        mytimeout = $timeout($scope.onTimeout, 1000);
    };
    $scope.onTimeout = function() {
        if($scope.counter ===  1) {
            $scope.$broadcast('timer-stopped', 0);
            $timeout.cancel(mytimeout);
            $scope.normalTimer=false;
            $scope.timerBlink=true;
        }
        else if($scope.counter<12){
            $scope.normalTimer=true;
            $scope.timerBlink=false;
        }

        $scope.counter--;
        mytimeout = $timeout($scope.onTimeout, 1000);

    };
    $scope.$on('timer-stopped', function(event, remaining) {
        if($scope.resultStatus){
            $scope.totalTimeTaken=$scope.totalTimeTaken+($localStorage.quiz.questions[count-2].time-$scope.counter);
            totalTimeForCodingQuiz=totalTimeForCodingQuiz+$localStorage.quiz.questions[count-2].time;
            $scope.resultStatus=false;
            $scope.counter=10;
            $scope.codingQuizBegin=false;
            codingCompilation(count-1);
            mytimeout = $timeout($scope.onTimeout, 1000);

        }else{
            if(count===1){$scope.questions=$localStorage.quiz.questions;}
            if(remaining === 0) {
                $scope.countDown=false;
                var lang = $scope.language;
                $scope.cmOption = {
                    lineNumbers: true,
                    lineWrapping: true,
                    indentWithTabs: true,
                    theme: 'twilight',
                    electricChars: true,
                    mode: lang.toLowerCase(),
                    onLoad: function (_cm) {
                        $scope.modeChanged = function () {
                            _cm.setOption("mode", lang.toLowerCase());
                        };
                        $scope.codemirrorLoaded = function (_editor) {
                            var _doc = _editor.getDoc();
                            _editor.clear();
                            _editor.focus();
                            _doc.markClean();
                        };

                    }
                };
                $scope.cmModel = $scope.codeTextTemplate;
                if (count > $scope.questions.length) {
                    codingQuizValidation()
                }
                else {
                    if (count > 1) {
                        if (!$scope.resultStatus && $scope.counter > 1) {
                            $scope.totalTimeTaken = $scope.totalTimeTaken + ($localStorage.quiz.questions[count - 2].time - $scope.counter);
                            totalTimeForQuiz = totalTimeForQuiz + $localStorage.quiz.questions[count - 2].time;

                        }
                    }
                    $scope.counter = $localStorage.quiz.questions[count - 1].time;
                    $scope.codingQuizBegin = true;
                    $scope.cmModel = null;
                    codingQuestion(count);
                    if (count == $scope.questions.length) {
                        $scope.count14 = true;
                        $scope.count15 = false;
                    }
                    $scope.codingQuizBeginresult = true;
                    count++;
                    $scope.resultStatus = true;
                    mytimeout = $timeout($scope.onTimeout, 1000);
                }


            }
        }
    });
    function codingQuestion(questionNumber){
        $scope.isSomething=true;
        $scope.questionNo=questionNumber;
        $scope.questionText = $scope.questions[questionNumber-1].question;
        $scope.cmModel = $scope.codeTextTemplate;
        $scope.info=null;
        $scope.result=null;
    }
    function codingCompilation(count){
        var data1 = {
            language: $scope.languageid,
            editor: 1,
            content: $scope.cmModel
        };
        codeCompiler.postData(data1).then(function(response){

            message = '';

            if (response.data.Warnings) {
                message += 'Warnings: ' + response.data.Warnings + '\n';
            }

            if (response.data.Errors) {
                message += 'Errors: ' + response.data.Errors + '\n';
            }

            if (response.data.Stats) {
                message += 'Errors: ' +response.data.Stats + '\n';
            }

            $scope.result = response.data.Result;
            $scope.info = message;
            $localStorage.quiz.questions[count-1].candidateanswer=$scope.cmModel;
            $localStorage.quiz.questions[count-1].compiledOrNot="Y";
            $localStorage.quiz.questions[count-1].result=response.data.Result;
            $localStorage.quiz.questions[count-1].error=message;
            if(response.data.Result){
                $localStorage.quiz.questions[count-1].atempted="Y";}
        });
    }
    function codingQuizValidation(){
        var attemptedcodingQuestion=0;
        for(var i=0;i<$localStorage.quiz.questions.length;i++)
        {
            if($localStorage.quiz.questions[i].atempted=="Y")
            {
                attemptedcodingQuestion++;
            }
        }
        function z(n) {return (n<10? '0' : '') + n;}
        var seconds=$scope.totalTimeTaken%60;
        var minutes=Math.floor($scope.totalTimeTaken/60);
        var hours=Math.floor(minutes/60);
        $localStorage.quiz.timetaken=z(hours)+':'+z(minutes)+':'+z(seconds);
        $localStorage.quiz.atempted=attemptedcodingQuestion;
        var jsonData={data:$localStorage.quiz,token:sessiondata.token};
        quizResults.postData(jsonData).then(function(response){
            $scope.codingQuizBegin=false;
            $scope.codingQuizBeginresult=false;
            var jsonData={totalTime:z(Math.floor(Math.floor(totalTimeForQuiz/60)/60))+':'+z(Math.floor(totalTimeForQuiz/60))+':'+z(totalTimeForQuiz%60),totalTimeTaken:response.timetaken,atemptedQuestions:response.atempted,totalQuestions:$localStorage.quiz.questions.length};


        });
    }

}]);
