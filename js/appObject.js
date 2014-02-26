var appObject = {
    webrtc: null,
    username:'',
    accessCode:'',
    roomJoined:false,
    roomName:"",
    isReadyToCall:false,
    createRoom: function () {
        var val = $('#sessionInput').val().toLowerCase().replace(/\s/g, '-').replace(/[^A-Za-z0-9_\-]/g, '');
        var loc = "console.html?" + val;
        window.location.replace(loc);
    },
    showChangePassword: function(){
        $("#changePasswordModal").modal("show");
    },
    changePassword: function(){
        var password=$("#accesscode2").val();
        if(password && password!="") {
            appObject.webrtc.changePassword(password);
            $("#changePasswordModal").modal("hide");
        }
    },
    joinRoom: function(){
        appObject.username=$("#username").val();
        appObject.accessCode=$("#accesscode").val();
        if (appObject.roomName) {
            appObject.webrtc.joinRoom(appObject.roomName,appObject.accessCode,function(err,roomDescription){
                if (err) {
                    $(".errorMessage").text(err);
                }
                else{
                    $("#screen1").addClass("hidden");
                    $("#screen2").removeClass("hidden");
                    $("#accesscode2").val(appObject.accessCode);
                }                    
            });
        }
    },
    enterRoom: function(){
        // grab the room from the URL
        appObject.roomName = location.search && location.search.split('?')[1];
        // create our webrtc connection if not already readytocall
        if(!appObject.isReadyToCall){
            appObject.webrtc = new SimpleWebRTC({
                url: "https://signalmaster.herokuapp.com",
                // the id/element dom element that will hold "our" video
                localVideoEl: 'localVideo',
                // the id/element dom element that will hold remote videos
                remoteVideosEl: 'scroller',
                // immediately ask for camera access
                autoRequestMedia: true,
                log: true
            });
        }
        //if already readytocall join the room
        if(appObject.isReadyToCall) appObject.joinRoom();
        // when it's ready, join if we got a room from the URL
        appObject.webrtc.on('readyToCall', function () {
            appObject.isReadyToCall=true;
            appObject.joinRoom();
        });
        if (appObject.roomName) {
            $("title").text($("title").text()+" - "+appObject.roomName);
        }
        return false;
    },
    initConsole: function () {
        var button = $('#shareScreenButton'),
                setButton = function (bool) {
                    button.attr("data-original-title", bool ? 'Share Screen' : 'Stop Sharing');
                };

        setButton(true);
        var videoButton = $('#videoButton'),
                setVideoButton = function (bool) {
                    videoButton.attr("data-original-title", bool ? 'Enable video' : 'Disable video');
                };

        setVideoButton(true);

        button.click(function () {
            if (appObject.webrtc.getLocalScreen()) {
                appObject.webrtc.stopScreenShare();
                setButton(true);
            } else {
                appObject.webrtc.shareScreen(function (err) {
                if (err) {
                        setButton(true);
                    } else {
                        setButton(false);
                    }
                });
            }
        });
        videoButton.click(function () {
            if ($("#localVideo").attr("src")==undefined) {
                appObject.webrtc.startLocalVideo();
                setVideoButton(false);
            } else {
                appObject.webrtc.stopLocalVideo();
                $("#localVideo").removeAttr("src");
                setVideoButton(true);
            }
        });
        document.body.onclick = function (e) {
            if (e.target.tagName.toUpperCase() === "VIDEO") {
                var video = e.target;
                video.requestFullScreen = video.webkitRequestFullScreen || image.mozRequestFullScreen || image.requestFullScreen;
                video.requestFullScreen();
            }
        };
    },
    isFullScreen:function(){
        return !!(document.webkitIsFullScreen || document.mozFullScreen || document.isFullScreen);
    }
}