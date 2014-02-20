var appObject = {
    webrtc: null,
    createRoom: function () {
        var val = $('#sessionInput').val().toLowerCase().replace(/\s/g, '-').replace(/[^A-Za-z0-9_\-]/g, '');
        var loc = "console.html?" + val;
        window.location.replace(loc);
    },
    initConsole: function () {
        // grab the room from the URL
        var room = location.search && location.search.split('?')[1];

        // create our webrtc connection
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
        // when it's ready, join if we got a room from the URL
        appObject.webrtc.on('readyToCall', function () {
            // you can name it anything
            if (room) appObject.webrtc.joinRoom(room);
        });
        if (room) {
            appObject.setRoom(room);
        }
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
    setRoom: function (name) {
        $("title").text($("title").text()+" - "+name);
    },
    isFullScreen:function(){
        return !!(document.webkitIsFullScreen || document.mozFullScreen || document.isFullScreen);
    }
}