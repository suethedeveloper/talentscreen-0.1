/**
 * Created by sande on 4/19/2016.
 */
talentScreen.controller("videoQuizController",['$scope','$cookieStore','$localStorage','tsQuizTemplate','UserMedia','$timeout','$http','$sce','video',function($scope,$cookieStore,$localStorage,tsQuizTemplate,UserMedia,$timeout,$http,$sce,video){
    var count=1;
    $scope.counter = 5;
    $scope.ngTimer=true;
    $scope.count15 = true;
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
    var totalTimeForQuiz=0;
    var isFirefox = !!navigator.mozGetUserMedia;
    var sessiondata=$cookieStore.get("session");
    var jsonData={type:"subject",token:sessiondata.token,testtype:3};
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
        var jsonData={type:"level",token:sessiondata.token,subjectid:$scope.selectSubject,testtype:3};
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
        $scope.quizLevels=false;
        $scope.quizStartAccepted=true;

    };
    $scope.onTimeout = function() {
        if($scope.counter ===  1) {
            $scope.countDown=false;
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
        if(remaining === 0) {
            if(count === 1){
                $scope.questions=$localStorage.quiz.questions;
            }
            if (count > 1) {
                recordAudio.stopRecording(function(url) {
                    recordAudio.getDataURL(function(audioDataURL) {
                        videourl[blobCount]=url;
                        postFiles(blobCount, audioDataURL);
                        blobCount++;
                    });
                });
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
                showRecordings();
            }
            else {
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
    });
    $scope.startQuiz=function(){
            UserMedia.get().then(function (response) {
                if(response.status==400){
                    $scope.videoQuizContainer=false;
                    $scope.videoNotSupported=true;
                    $scope.startButton=false;
                }
                else{
                    window.stream=response.stream;
                    $scope.quizStartAccepted=false;
                    $scope.countDown=true;
                    $localStorage.quiz="";
                    var jsonData={type:"questions",token:sessiondata.token,candidateid:sessiondata.data._id,testtype:3,testlevel:$scope.selectedLevel,testsubject:$scope.selectSubject,count:levelCount};
                    tsQuizTemplate.show(jsonData).$promise.then(function (data){
                        $localStorage.quiz=data;
                    });
                    mytimeout = $timeout($scope.onTimeout, 1000);
                }});



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
        stoprecording();
        $scope.resultStatus=false;
        $scope.$broadcast('timer-stopped', 0);
        $timeout.cancel(mytimeout);
    };
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
        $scope.videostream = $sce.trustAsResourceUrl(window.URL.createObjectURL(window.stream));
        var options = {
            mimeType: 'video/webm', // or video/mp4 or audio/ogg
            audioBitsPerSecond: 128000,
            videoBitsPerSecond: 128000
            // if this line is provided, skip above two
        };
        recordAudio = RecordRTC(window.stream, options);
        recordAudio.startRecording();
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
                if(videoQuizResults[a].fileName==response.filename){
                    videoQuizResults[a]={"fileName":files.audio.name,"status":"sucess"}
                }
                if(videoQuizResults.length==$scope.questions.length){
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



