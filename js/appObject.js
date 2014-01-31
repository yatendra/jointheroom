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
                    button.text(bool ? 'Share Screen' : 'Stop Sharing');
                };

        setButton(true);

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
        document.body.onclick = function (e) {
            if (e.target.tagName.toUpperCase() === "VIDEO") {
                var video = e.target;
                var inVideo = $("#" + video.id);
                var outVideo = $("#main video");
                var inVideoPaused = inVideo.get(0)? inVideo.get(0).paused : true;
                var outVideoPaused = outVideo.get(0)? outVideo.get(0).paused : true;
                if (inVideo.attr("id") != outVideo.attr("id")) {
                    $("#scroller").append(outVideo);
                    $("#main").append(inVideo);
                    if (!inVideoPaused) {
                        inVideo.get(0).play();
                    }
                    if (!outVideoPaused) {
                        outVideo.get(0).play();
                    }
                }
            }
        };
    },
    setRoom: function (name) {
        $('#room').text("Room: " + name);
        $('#link').html('Link to join: <a href="mailto:?subject=Join%20me%20for%20video%20conference&body=' + encodeURIComponent(location.href) + '">' + location.href + '</a>');
    }
}