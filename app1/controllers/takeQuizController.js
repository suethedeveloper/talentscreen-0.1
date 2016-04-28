///**
// * Created by Sue on 4/28/2016.
// */
talentScreen.controller("takeQuizController",['$scope','$rootScope','$cookieStore','$localStorage','tsQuizTemplate','codeCompiler','$timeout','quizResults',function($scope,$rootScope,$cookieStore,$localStorage,tsQuizTemplate,codeCompiler,$timeout,quizResults){
    $scope.counter = 5;
    $scope.count15 = true;
    $scope.totalTimeTaken=0;
    var count=1;
    var sessiondata=$cookieStore.get("session");
    $scope.subjectName="";
    $scope.quizSubject=true;
    $scope.sessiondata = sessiondata;

    $scope.startQuiz=function(){
        $scope.quizStartAccepted=false;
        $scope.countDown=true;
        $localStorage.quiz="";
        var jsonData={type:"questions",token:sessiondata.token,candidateid:sessiondata.data._id,testtype:1,testlevel:$rootScope.selectedLevel,testsubject:$rootScope.selectSubject,count:levelCount};
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
        if(count===1){$scope.questions=$localStorage.quiz.questions;}
        if(remaining === 0) {
            $scope.normalTimer=false;
            $scope.timerBlink=true;
            if($localStorage.quiz.questions) {
                $scope.countDown = false;
                if (count != 1) {
                    $scope.totalTimeTaken = $scope.totalTimeTaken + (60 - $scope.counter);
                    choiceStudentAnswer(count - 1);
                }
                if (count > $scope.questions.length) {
                    choiceQuizValidation();
                }
                else {
                    $scope.counter = 59;
                    choiceQuestion(count);
                    if (count == $scope.questions.length) {
                        $scope.count14 = true;
                        $scope.count15 = false;
                    }
                    mytimeout = $timeout($scope.onTimeout, 1000);
                    $scope.quizBegin = true;
                    count++;
                }
            }
        }

    });

    function choiceQuizValidation(){
        $scope.quizBegin=false;
        var correctAnswerCount=0;
        var attempted=0;
        for(var i=0;i<$localStorage.quiz.questions.length;i++){
            if($localStorage.quiz.questions[i].answeredornot=="Y"){
                attempted++;
                if($localStorage.quiz.questions[i].originalanswer==$localStorage.quiz.questions[i].candidateanswer){
                    correctAnswerCount++;
                    $localStorage.quiz.questions[i].correctanswerornot="Y"
                }
            }
        }
        $localStorage.quiz.correctanswers=correctAnswerCount;
        $localStorage.quiz.atempted=attempted;
        function z(n) {return (n<10? '0' : '') + n;}
        var seconds=$scope.totalTimeTaken%60;
        var minutes=Math.floor($scope.totalTimeTaken/60);
        $localStorage.quiz.timetaken=z(minutes)+':'+z(seconds);
        var jsonData={data:$localStorage.quiz,token:sessiondata.token};
        quizResults.postData(jsonData).then(function(response){
            $scope.showResults=true;
            $scope.atemptedQuestions=response.atempted;
            $scope.correctAnswers=response.correctanswers;
            $scope.totalTime=response.timetaken;
            var input=$localStorage.quiz.questions.length*60;
            var jsonData= {totalTime:z(Math.floor(input/60))+':'+z(input%60),totalTimeTaken:response.timetaken,atemptedQuestions:response.atempted,correctAnswers:response.correctanswers,totalQuestions:$localStorage.quiz.questions.length};
            console.log(jsonData);
        });
    }
    function choiceQuestion(questionNumber) {
        $scope.$broadcast('timer-start');
        $scope.timerRunning = true;
        $scope.questionNo=questionNumber
        $scope.questionText = $scope.questions[questionNumber-1].question;
        $scope.answer1Text = $scope.questions[questionNumber-1].answer1;
        $scope.answer2Text = $scope.questions[questionNumber-1].answer2;
        $scope.answer3Text = $scope.questions[questionNumber-1].answer3;
        $scope.answer4Text = $scope.questions[questionNumber-1].answer4;
        $scope.answer1 = "";
        $scope.answer2 = "";
        $scope.answer3 = "";
        $scope.answer4 = "";
    }
    function choiceStudentAnswer(count){
        if($scope.answer1){$localStorage.quiz.questions[count-1].candidateanswer=MD5("a");$localStorage.quiz.questions[count-1].answeredornot="Y";}
        else if($scope.answer2){$localStorage.quiz.questions[count-1].candidateanswer=MD5("b");$localStorage.quiz.questions[count-1].answeredornot="Y";}
        else if($scope.answer3){$localStorage.quiz.questions[count-1].candidateanswer=MD5("c");$localStorage.quiz.questions[count-1].answeredornot="Y";}
        else if($scope.answer4){$localStorage.quiz.questions[count-1].candidateanswer=MD5("d");$localStorage.quiz.questions[count-1].answeredornot="Y";}
    }
    $scope.cancelQuiz=function(){
        $scope.$broadcast('timer-stopped', 0);
        $scope.counter = 5;
        $timeout.cancel(mytimeout);
        $scope.countDown=false;

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

}]);
