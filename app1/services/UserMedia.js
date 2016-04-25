
talentScreen.service('UserMedia', ['$q','$http', function($q,$http) {
        navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||navigator.mediaDevices.getUserMedia||navigator.msGetUserMedia;
    var constraints = {
        audio: true,
        video: true
    };
    var deferred = $q.defer();
    this.get = function() {
        navigator.getUserMedia(
            constraints,
            function(stream) { deferred.resolve({status:200,stream:stream}); },
            function errorCallback(error) {
                deferred.resolve({status:400,stream:error});
            }
        );
        return deferred.promise;
    }
    this.post=function(elements){
        var promise = $http({
            method: 'POST',
            url: apiURL+'/api/v1/talentscreen/merge',
            headers: {'Content-Type': 'application/json'},
            data: elements
        }).success(function (response){
            return response;
        });
        return promise ;

    };


}]);
