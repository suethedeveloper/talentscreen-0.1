/**
* Created by Sue on 4/28/2016.
*/

talentScreen.controller("takeQuizController",['$scope','$rootScope','$cookieStore','$localStorage','tsQuizTemplate','codeCompiler','UserMedia','$timeout','$http','$sce','video','choiceQuizValidationService','quizResults',function($scope,$rootScope,$cookieStore,$localStorage,tsQuizTemplate,codeCompiler,UserMedia,$timeout,$http,$sce,video,choiceQuizValidationService,quizResults){
    if ($rootScope.testtype === 2)
        var totalTimeForCodingQuiz = 0;

    if ($rootScope.testtype !== 1)
        var totalTimeForQuiz = 0;

    var count = 1;

    var sessiondata = $cookieStore.get("session");

    $scope.sessiondata = sessiondata;
    $scope.counter = 5;
    $scope.count15 = true;
    $scope.totalTimeTaken = 0;

    if ($rootScope.testtype === 3){
        $scope.ngTimer=true;
        $scope.videoQuizContainer=true;
        $scope.recordingShow=true;
        $scope.timerBlink=true;
        $scope.normalTimer=false;
        $scope.playlistOpen = false;
        var videourl=[];
        var blobCount=1;
        var fileName;
        var recordAudio,recordVideo;
        var videoQuizResults=[];
        var isFirefox = !!navigator.mozGetUserMedia;
    }

    $scope.startQuiz=function(){
        if ($rootScope.testtype === 3) {
            UserMedia.get().then(function (response) {
                if (response.status == 400) {
                    $scope.videoQuizContainer = false;
                    $scope.videoNotSupported = true;
                    $scope.startButton = false;
                } else {
                    window.stream = response.stream;
                    var options = {
                        mimeType: 'video/webm', // or video/mp4 or audio/ogg
                        audioBitsPerSecond: 128000,
                        videoBitsPerSecond: 128000
                        // if this line is provided, skip above two
                    }
                    recordAudio = RecordRTC(window.stream, options);
                    recordAudio.startRecording();
                }
            });
        }

        $scope.quizStartAccepted=false;
        $scope.countDown=true;
        $localStorage.quiz="";
        var jsonData={type:"questions",token:sessiondata.token,candidateid:sessiondata.data._id,testtype:$rootScope.testtype,testlevel:$rootScope.selectedLevel,testsubject:$rootScope.selectSubject,count:levelCount};
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
            if ($rootScope.testtype === 3) { $scope.countDown=false; }
        }
        else if($scope.counter<12){
            $scope.normalTimer=true;
            $scope.timerBlink=false;
        }

        $scope.counter--;
        mytimeout = $timeout($scope.onTimeout, 1000);
    };

    $scope.$on('timer-stopped', function(event, remaining) {
        if ($rootScope.testtype === 1 || ($rootScope.testtype === 2 && !$scope.resultStatus)){
            if (count===1) {$scope.questions=$localStorage.quiz.questions;}
        }
        if ($rootScope.testtype === 1){
            if(remaining === 0) {
                $scope.normalTimer=false;
                $scope.timerBlink=true;
                if($localStorage.quiz.questions) {
                    $scope.countDown = false;
                    if (count != 1) {
                        $scope.totalTimeTaken = $scope.totalTimeTaken + (60 - $scope.counter);
                        //choiceStudentAnswer(count - 1);
                        choiceQuizValidationService.choiceStudentAnswer($scope, $localStorage, count - 1);
                    }
                    if (count > $scope.questions.length) {
                        choiceQuizValidationService.choiceQuizValidation(sessiondata, $scope, $localStorage, quizResults);
                    }
                    else {
                        $scope.counter = 59;
                        //choiceQuestion(count);
                        choiceQuizValidationService.choiceQuestion($scope, count);
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
        } else if ($rootScope.testtype === 2){
            if($scope.resultStatus){
                $scope.totalTimeTaken=$scope.totalTimeTaken+($localStorage.quiz.questions[count-2].time-$scope.counter);
                totalTimeForCodingQuiz=totalTimeForCodingQuiz+$localStorage.quiz.questions[count-2].time;
                $scope.resultStatus=false;
                $scope.counter=10;
                $scope.codingQuizBegin=false;
                codingCompilation(count-1);
                mytimeout = $timeout($scope.onTimeout, 1000);

            } else {
                if(remaining === 0) {
                    $scope.countDown=false;
                    var lang = $rootScope.language;
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

                    $scope.cmModel = $rootScope.codeTextTemplate;

                    if (count > $scope.questions.length) {
                        codingQuizValidation()
                    } else {
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
        } else if ($rootScope.testtype === 3){
            recordAudio.stopRecording(function(url) {
                recordAudio.getDataURL(function(audioDataURL) {
                    if(count>1){
                        videourl[blobCount-1]=url;}
                    postFiles(blobCount,audioDataURL);
                    blobCount++;
                });
            });
            if(remaining === 0) {
                if(count === 1){
                    $scope.questions=$localStorage.quiz.questions;

                }
                if (count > 1) {
                    $scope.totalTimeTaken = $scope.totalTimeTaken + ($localStorage.quiz.questions[count - 2].time - $scope.counter);
                    $localStorage.quiz.questions[count - 2].candidatetime = $scope.counter;
                    totalTimeForQuiz = totalTimeForQuiz + $localStorage.quiz.questions[count - 2].time;
                }
                if (count > $scope.questions.length) {
                    $scope.recordingShow=false;
                    $scope.normalTimer = true;
                    $scope.timerBlink = true;
                    $timeout.cancel(mytimeout);
                    $scope.count15 = true;
                    window.stream.getTracks().forEach(function(track) {
                        track.stop();});
                    setTimeout(function(){
                        showRecordings();},10000);

                }
                else {
                    if (window.URL) {
                        $scope.videostream = $sce.trustAsResourceUrl(window.URL.createObjectURL(window.stream));
                    }
                    else
                    {
                        $scope.videostream = $sce.trustAsResourceUrl(window.stream);
                    }
                    var options = {
                        mimeType: 'video/webm', // or video/mp4 or audio/ogg
                        audioBitsPerSecond: 128000,
                        videoBitsPerSecond: 128000
                        // if this line is provided, skip above two
                    };
                    recordAudio = RecordRTC(window.stream, options);
                    recordAudio.startRecording();
                    $scope.counter = $localStorage.quiz.questions[count - 1].time;
                    if (count == $scope.questions.length) {
                        $scope.count14 = true;
                        $scope.count15 = false;
                    }
                    videoQuestion(count);
                    $scope.videoQuizBegin = true;
                    count++;
                    mytimeout = $timeout($scope.onTimeout, 1000);
                }
            }
        }
    });

    $scope.cancelQuiz=function(){
        if ($rootScope.testtype === 1) { //for choice quiz
            $scope.$broadcast('timer-stopped', 0);
        } else { //for coding & video quiz
            $scope.$broadcast('timer-stopped', $scope.counter);
            $scope.quizTypes=false;
        }
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

    if ($rootScope.testtype === 2) {
        $scope.compile = function () {
            codingCompilation(count);
        };
    }

    // CHOICE QUIZ
    //function choiceQuestion(questionNumber) {
    //    $scope.$broadcast('timer-start');
    //    $scope.timerRunning = true;
    //    $scope.questionNo=questionNumber
    //    $scope.questionText = $scope.questions[questionNumber-1].question;
    //    $scope.answer1Text = $scope.questions[questionNumber-1].answer1;
    //    $scope.answer2Text = $scope.questions[questionNumber-1].answer2;
    //    $scope.answer3Text = $scope.questions[questionNumber-1].answer3;
    //    $scope.answer4Text = $scope.questions[questionNumber-1].answer4;
    //    $scope.answer1 = "";
    //    $scope.answer2 = "";
    //    $scope.answer3 = "";
    //    $scope.answer4 = "";
    //}
    //function choiceStudentAnswer(count){
    //    if($scope.answer1){$localStorage.quiz.questions[count-1].candidateanswer=MD5("a");$localStorage.quiz.questions[count-1].answeredornot="Y";}
    //    else if($scope.answer2){$localStorage.quiz.questions[count-1].candidateanswer=MD5("b");$localStorage.quiz.questions[count-1].answeredornot="Y";}
    //    else if($scope.answer3){$localStorage.quiz.questions[count-1].candidateanswer=MD5("c");$localStorage.quiz.questions[count-1].answeredornot="Y";}
    //    else if($scope.answer4){$localStorage.quiz.questions[count-1].candidateanswer=MD5("d");$localStorage.quiz.questions[count-1].answeredornot="Y";}
    //}

    //CODING QUIZ
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
            language: $rootScope.languageid,
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

    // VIDEO QUIZ
    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
    function showRecordings(){
        $scope.ngTimer=false;
        $scope.recordingPlay=true;
        $scope.playVideo = function playVideo(sourceUrl) {
            video.addSource('webm', sourceUrl, true);
        };
        $scope.getVideoName = function getVideoName(videoModel) {
            return "Unknown Video";
        };

        for(var i=0;i<videourl.length;i++){
            video.addSource('webm',videourl[i]);
        }

    };
    function videoQuestion(questionNumber){
        $scope.timerRunning = true;
        $scope.questionNo=questionNumber
        $scope.questionText = $scope.questions[questionNumber-1].question;
    }
    function postFiles(fileCount,audioDataURL) {
        fileName =sessiondata.data._id+fileCount+guid();
        var files = { };
        files.audio = {
            question:$scope.questionText,
            name: fileName +  '.webm' ,
            type:  'video/webm' ,
            contents: audioDataURL
        };
        videoQuizResults[fileCount-1]={"fileName":files.audio.name,"status":"pending"};
        files.isFirefox = isFirefox;
        files.type="video";
        $http({
            method: 'POST',
            url: apiURL+'/api/v1/talentscreen/video',
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify(files)
        }).success(function (response){
            console.log({sucess:response});
            for(var a in videoQuizResults)
            {
                if(videoQuizResults[a].fileName == response.filename){
                    videoQuizResults[a]={"fileName":files.audio.name,"status":"sucess"}
                }
                if(videoQuizResults.length == $scope.questions.length){
                    if(videoQuizResults[videoQuizResults.length-1].status=="sucess"){
                        var jsonData={type:"result",data:videoQuizResults,fileName:$localStorage.quiz._id};
                        console.log(videoQuizResults);
                        UserMedia.post(jsonData).then(function(response){
                            console.log(response);
                        });
                    }
                }
            }
        });
    }

}]);

talentScreen.service('choiceQuizValidationService', function(){
    this.choiceQuizValidation = function(sessiondata, $scope, $localStorage, quizResults){
        console.log("choiceQuizValidation",this);
        console.log("$localStorage",$localStorage);
        $scope.quizBegin=false;
        var correctAnswerCount=0;
        var attempted=0;


        console.log("$localStorage.quiz.questions.length",$localStorage.quiz.questions.length);

        for(var i=0;i<$localStorage.quiz.questions.length;i++){
            console.log("attempted",i, attempted);
            if($localStorage.quiz.questions[i].answeredornot=="Y"){
                attempted++;
                if($localStorage.quiz.questions[i].originalanswer==$localStorage.quiz.questions[i].candidateanswer){
                    correctAnswerCount++;
                    $localStorage.quiz.questions[i].correctanswerornot="Y"
                }
            }
        }
        console.log("attempted2",i, attempted);
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
        });
    };
    this.choiceQuestion = function($scope, questionNumber){
        console.log("choiceQuestion", this);
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
        console.log("choiceQuestion 222", this);
    };
    this.choiceStudentAnswer = function($scope, $localStorage, count){

        if($scope.answer1){$localStorage.quiz.questions[count-1].candidateanswer=MD5("a");$localStorage.quiz.questions[count-1].answeredornot="Y";}
        else if($scope.answer2){$localStorage.quiz.questions[count-1].candidateanswer=MD5("b");$localStorage.quiz.questions[count-1].answeredornot="Y";}
        else if($scope.answer3){$localStorage.quiz.questions[count-1].candidateanswer=MD5("c");$localStorage.quiz.questions[count-1].answeredornot="Y";}
        else if($scope.answer4){$localStorage.quiz.questions[count-1].candidateanswer=MD5("d");$localStorage.quiz.questions[count-1].answeredornot="Y";}
        console.log($localStorage.quiz.questions[count-1]);
        console.log("choiceStudentAnswer 2222",this);
        console.log($localStorage.quiz.questions[count-1].candidateanswer, $localStorage.quiz.questions[count-1].answeredornot);
    };
});

/*
*     function choiceQuestion(questionNumber) {
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
* */