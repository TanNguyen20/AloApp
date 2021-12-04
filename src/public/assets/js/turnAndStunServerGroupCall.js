async function Setup() {
    try {
        var socket = io();
        socket.emit('joinroom', $('#idMess').val());
        //// nguoi gui ////
        // goi voice
        $('#btnCall').on('click', function () {
            $('#list-video').html('');
            $('video').remove();
            $('p').remove();
            socket.emit('voiceCallGroup', $('#idMess').val());
            const Video = Twilio.Video;
            if (Video.isSupported) {
                $('#videoCallModal').modal('show');
                $('.iconWaitCall').show();
                $.post('/me/sendAccessToken', { 'idMess': $('#idMess').val(), 'idMember': $('#idYou').val() }, function (data) {
                    Video.connect(data, { name: $('#idMess').val() }).then(room => {
                        //chi audio
                        room.localParticipant.videoTracks.forEach(publication => {
                            publication.track.stop();
                            publication.unpublish();
                        });
                        room.localParticipant.audioTracks.forEach(publication => {
                            $('#list-video').append(publication.track.attach());
                            // $('#list-video').append(`<lord-icon
                            //     class="iconVoiceCall col-4 border"
                            //     src="https://cdn.lordicon.com/fpipqhrr.json"
                            //     trigger="loop"
                            //     colors="primary:#121331,secondary:#08a88a"
                            //     style="width:250px;height:250px">
                            // </lord-icon>`);
                        });
                        //notify
                        console.log(`Successfully joined a Room: ${room}`);
                        console.log(`Connected to the Room as LocalParticipant "${room.localParticipant.identity}"`);
                        // Member join into room
                        room.on('participantConnected', participant => {
                            console.log(`Participant "${participant.identity}" connected`);
                            participant.tracks.forEach(publication => {
                                if (publication.isSubscribed) {
                                    publication.videoTracks.forEach(publication => {
                                        $('.iconWaitCall').hide();
                                        $('#list-video').append(publication.track.attach());
                                        $('video').addClass('w-50 h-50 img-thumbnail border col-4');
                                        $('video').hide();
                                        $('#list-video').append(`<lord-icon
                                            class="iconVoiceCall col-4 border"
                                            src="https://cdn.lordicon.com/fpipqhrr.json"
                                            trigger="loop"
                                            colors="primary:#121331,secondary:#08a88a"
                                            style="width:250px;height:250px">
                                        </lord-icon>`);
                                    });
                                }
                            });
                            // them audio nguoi tham gia sau cho nguoi tham gia truoc
                            participant.on('trackSubscribed', track => {
                                $('.iconWaitCall').hide();
                                $('#list-video').append(track.attach());
                                $('video').addClass('w-50 h-50 img-thumbnail border col-4');
                                $('video').hide();
                                $('#list-video').append(`<lord-icon
                                    class="iconVoiceCall col-4 border"
                                    src="https://cdn.lordicon.com/fpipqhrr.json"
                                    trigger="loop"
                                    colors="primary:#121331,secondary:#08a88a"
                                    style="width:250px;height:250px">
                                </lord-icon>`);
                            });
                        });
                        // nguoi tham gia disconnect khoi room
                        room.once('participantDisconnected', participant => {
                            console.log(`Participant "${participant.identity}" has disconnected from the Room`);
                        });
                        //
                        $('#btnCloseCall').on('click', function () {
                            room.disconnect();
                        });
                        window.addEventListener('beforeunload', function (e) {
                            e.preventDefault();
                            room.disconnect();
                        });
                        room.on('disconnected', room => {
                            swal('Bạn đã rời cuộc gọi');
                            $('video').remove();
                            $('#videoCallModal').modal('hide');
                            // Detach the local media elements
                            room.localParticipant.tracks.forEach(publication => {
                                const attachedElements = publication.track.detach();
                                attachedElements.forEach(element => element.remove());
                            });
                        });


                        room.participants.forEach(participant => {
                            participant.tracks.forEach(publication => {
                                if (publication.track) {
                                    $('.iconWaitCall').hide();
                                    $('#list-video').append(publication.track.attach());
                                    $('video').addClass('w-50 h-50 img-thumbnail border col-4');
                                    $('video').hide();
                                    $('#list-video').append(`<lord-icon
                                        class="iconVoiceCall col-4 border"
                                        src="https://cdn.lordicon.com/fpipqhrr.json"
                                        trigger="loop"
                                        colors="primary:#121331,secondary:#08a88a"
                                        style="width:250px;height:250px">
                                    </lord-icon>`);
                                }
                            });

                            participant.on('trackSubscribed', track => {
                                $('.iconWaitCall').hide();
                                $('#list-video').append(track.attach());
                                $('video').addClass('w-50 h-50 img-thumbnail border col-4');
                                $('video').hide();
                                $('#list-video').append(`<lord-icon
                                    class="iconVoiceCall col-4 border"
                                    src="https://cdn.lordicon.com/fpipqhrr.json"
                                    trigger="loop"
                                    colors="primary:#121331,secondary:#08a88a"
                                    style="width:250px;height:250px">
                                </lord-icon>`);
                            });
                        });
                        //////////////
                    }, error => {
                        if (error.message == 'Permission denied') swal("Quyền truy cập camera đã bị chặn vui lòng bật lại");
                        console.error(`Unable to connect to Room: ${error.message}`);
                    }
                    );
                });
            }
            else {
                swal("Trình duyệt của bạn không hỗ trợ gọi video");
            }
        });
        // goi video
        $('#btnVideoCall').on('click', function () {
            $('video').remove();
            $('#list-video').html('');
            socket.emit('videoCallGroup', $('#idMess').val());
            const Video = Twilio.Video;
            if (Video.isSupported) {
                $('#videoCallModal').modal('show');
                $('.iconWaitCall').show();
                $.post('/me/sendAccessToken', { 'idMess': $('#idMess').val(), 'idMember': $('#idYou').val() }, function (data) {
                    Video.connect(data, { name: $('#idMess').val() }).then(room => {
                        // chi video khong audio
                        //my video
                        room.localParticipant.videoTracks.forEach(publication => {
                            if (publication.track) {
                                $('#list-video').append(publication.track.attach());
                                $('video').addClass('w-50 h-50 img-thumbnail border col-4');
                            }
                        });
                        //tat audio
                        room.localParticipant.audioTracks.forEach(publication => {
                            publication.track.disable();
                        });

                        //notify
                        console.log(`Successfully joined a Room: ${room}`);
                        console.log(`Connected to the Room as LocalParticipant "${room.localParticipant.identity}"`);
                        // Member join into room
                        room.on('participantConnected', participant => {
                            console.log(`Participant "${participant.identity}" connected`);
                            participant.tracks.forEach(publication => {
                                if (publication.isSubscribed) {
                                    publication.audioTracks.forEach(publication => {
                                        publication.track.disable();
                                    });
                                    publication.videoTracks.forEach(publication => {
                                        $('.iconWaitCall').hide();
                                        $('#list-video').append(publication.track.attach());
                                        $('video').addClass('w-50 h-50 img-thumbnail border col-4');
                                    });
                                }
                            });
                            // them video nguoi tham gia sau cho nguoi tham gia truoc
                            participant.on('trackSubscribed', track => {
                                $('.iconWaitCall').hide();
                                $('#list-video').append(track.attach());
                                $('video').addClass('w-50 h-50 img-thumbnail border col-4');
                            });
                        });
                        // Log Participants as they disconnect from the Room
                        room.once('participantDisconnected', participant => {
                            console.log(`Participant "${participant.identity}" has disconnected from the Room`);
                        });
                        //
                        $('#btnCloseCall').on('click', function () {
                            room.disconnect();
                        });
                        window.addEventListener('beforeunload', function (e) {
                            e.preventDefault();
                            room.disconnect();
                        });
                        room.on('disconnected', room => {
                            swal('Bạn đã rời cuộc gọi');
                            $('video').remove();
                            $('#videoCallModal').modal('hide');
                            // Detach the local media elements
                            room.localParticipant.tracks.forEach(publication => {
                                const attachedElements = publication.track.detach();
                                attachedElements.forEach(element => element.remove());
                            });
                        });


                        room.participants.forEach(participant => {
                            participant.tracks.forEach(publication => {
                                if (publication.track) {
                                    $('.iconWaitCall').hide();
                                    $('#list-video').append(publication.track.attach());
                                    $('video').addClass('w-50 h-50 img-thumbnail border col-4');
                                }
                            });

                            participant.on('trackSubscribed', track => {
                                $('.iconWaitCall').hide();
                                $('#list-video').append(track.attach());
                                $('video').addClass('w-50 h-50 img-thumbnail border col-4');
                            });
                        });
                        //////////////
                    }, error => {
                        if (error.message == 'Permission denied') swal("Quyền truy cập camera đã bị chặn vui lòng bật lại");
                        console.error(`Unable to connect to Room: ${error.message}`);
                    }
                    );
                });
            }
            else {
                swal("Trình duyệt của bạn không hỗ trợ gọi video");
            }
        });
        socket.on('videoCallGroup', function (data) {
            if (data == $('#idMess').val()) {
                swal({
                    title: "Thông báo",
                    text: "Có cuộc gọi video nhóm",
                    icon: "warning",
                    buttons: ["Từ chối", "Nghe máy"],
                    dangerMode: true,
                })
                    .then(async (willDelete) => {
                        if (willDelete) {
                            $('video').remove();
                            const Video = Twilio.Video;
                            if (Video.isSupported) {
                                $('#videoCallModal').modal('show');
                                $.post('/me/sendAccessToken', { 'idMess': $('#idMess').val(), 'idMember': $('#idYou').val() }, function (data) {
                                    Video.connect(data, { name: 'new-room' }).then(room => {
                                        // chi video khong audio
                                        //my video
                                        room.localParticipant.videoTracks.forEach(publication => {
                                            if (publication.track) {
                                                $('#list-video').append(publication.track.attach());
                                                $('video').addClass('w-50 h-50 img-thumbnail border col-4');
                                            }
                                        });
                                        //tat audio
                                        room.localParticipant.audioTracks.forEach(publication => {
                                            publication.track.disable();
                                        });
                                        //
                                        //chi audio
                                        /*room.localParticipant.videoTracks.forEach(publication => {
                                            publication.track.stop();
                                            publication.unpublish();
                                        });*/
                                        //
                                        room.localParticipant.audioTracks.forEach(publication => {
                                            $('#list-video').append(publication.track.attach());
                                        });
                                        //notify
                                        console.log(`Successfully joined a Room: ${room}`);
                                        console.log(`Connected to the Room as LocalParticipant "${room.localParticipant.identity}"`);
                                        // Member join into room
                                        room.on('participantConnected', participant => {
                                            console.log(`Participant "${participant.identity}" connected`);
                                            participant.tracks.forEach(publication => {
                                                if (publication.isSubscribed) {
                                                    publication.audioTracks.forEach(publication => {
                                                        $('.iconWaitCall').hide();
                                                        publication.track.disable();
                                                    });
                                                    publication.videoTracks.forEach(publication => {
                                                        $('.iconWaitCall').hide();
                                                        $('#list-video').append(publication.track.attach());
                                                        $('video').addClass('w-50 h-50 img-thumbnail border col-4');
                                                    });
                                                }
                                            });
                                            // them video nguoi tham gia sau cho nguoi tham gia truoc
                                            participant.on('trackSubscribed', track => {
                                                $('.iconWaitCall').hide();
                                                $('#list-video').append(track.attach());
                                                $('video').addClass('w-50 h-50 col-4');
                                            });
                                        });
                                        // Log Participants as they disconnect from the Room
                                        room.once('participantDisconnected', participant => {
                                            console.log(`Participant "${participant.identity}" has disconnected from the Room`);
                                        });
                                        //
                                        $('#btnCloseCall').on('click', function () {
                                            room.disconnect();
                                        });
                                        window.addEventListener('beforeunload', function (e) {
                                            e.preventDefault();
                                            room.disconnect();
                                        });
                                        room.on('disconnected', room => {
                                            swal('Bạn đã rời cuộc gọi');
                                            $('video').remove();
                                            $('#videoCallModal').modal('hide');
                                            // Detach the local media elements
                                            room.localParticipant.tracks.forEach(publication => {
                                                const attachedElements = publication.track.detach();
                                                attachedElements.forEach(element => element.remove());
                                            });
                                        });


                                        room.participants.forEach(participant => {
                                            participant.tracks.forEach(publication => {
                                                if (publication.track) {
                                                    $('.iconWaitCall').hide();
                                                    $('#list-video').append(publication.track.attach());
                                                    $('video').addClass('w-50 h-50 img-thumbnail border col-4');
                                                }
                                            });

                                            participant.on('trackSubscribed', track => {
                                                $('.iconWaitCall').hide();
                                                $('#list-video').append(track.attach());
                                                $('video').addClass('w-50 h-50 img-thumbnail border col-4');
                                            });
                                        });
                                        //////////////
                                    }, error => {
                                        if (error.message == 'Permission denied') swal("Quyền truy cập camera đã bị chặn vui lòng bật lại");
                                        console.error(`Unable to connect to Room: ${error.message}`);
                                    }
                                    );
                                });
                            }
                            else {
                                swal("Trình duyệt của bạn không hỗ trợ gọi video");
                            }
                        }
                        else {
                            $('video').remove();
                            swal('Đã từ chối cuộc gọi');
                        }
                    });
            }
        });
        socket.on('voiceCallGroup', function (data) {
            if (data == $('#idMess').val()) {
                swal({
                    title: "Thông báo",
                    text: "Có cuộc gọi thoại nhóm",
                    icon: "warning",
                    buttons: ["Từ chối", "Nghe máy"],
                    dangerMode: true,
                })
                    .then(async (willDelete) => {
                        if (willDelete) {
                            $('video').remove();
                            const Video = Twilio.Video;
                            if (Video.isSupported) {
                                $('#videoCallModal').modal('show');
                                $.post('/me/sendAccessToken', { 'idMess': $('#idMess').val(), 'idMember': $('#idYou').val() }, function (data) {
                                    Video.connect(data, { name: 'new-room' }).then(room => {
                                        // chi video khong audio
                                        //my video
                                        room.localParticipant.videoTracks.forEach(publication => {
                                            if (publication.track) {
                                                $('#list-video').append(publication.track.attach());
                                                $('video').addClass('w-50 h-50 img-thumbnail border col-4');
                                                $('video').hide();
                                                $('#list-video').append(`<lord-icon
                                                    class="iconVoiceCall col-4 border"
                                                    src="https://cdn.lordicon.com/fpipqhrr.json"
                                                    trigger="loop"
                                                    colors="primary:#121331,secondary:#08a88a"
                                                    style="width:250px;height:250px">
                                                </lord-icon>`);
                                            }
                                        });

                                        //chi audio
                                        room.localParticipant.videoTracks.forEach(publication => {
                                            publication.track.stop();
                                            publication.unpublish();
                                        });
                                        room.localParticipant.audioTracks.forEach(publication => {
                                            $('#list-video').append(publication.track.attach());
                                        });
                                        //notify
                                        console.log(`Successfully joined a Room: ${room}`);
                                        console.log(`Connected to the Room as LocalParticipant "${room.localParticipant.identity}"`);
                                        // Member join into room
                                        room.on('participantConnected', participant => {
                                            console.log(`Participant "${participant.identity}" connected`);
                                            participant.tracks.forEach(publication => {
                                                if (publication.isSubscribed) {
                                                    publication.audioTracks.forEach(publication => {
                                                        $('.iconWaitCall').hide();
                                                        publication.track.disable();
                                                    });
                                                    publication.videoTracks.forEach(publication => {
                                                        $('.iconWaitCall').hide();
                                                        $('#list-video').append(publication.track.attach());
                                                        $('video').addClass('w-50 h-50 img-thumbnail border col-4');
                                                        $('video').hide();
                                                        $('#list-video').append(`<lord-icon
                                                            class="iconVoiceCall col-4 border"
                                                            src="https://cdn.lordicon.com/fpipqhrr.json"
                                                            trigger="loop"
                                                            colors="primary:#121331,secondary:#08a88a"
                                                            style="width:250px;height:250px">
                                                        </lord-icon>`);
                                                    });
                                                }
                                            });
                                            // them video nguoi tham gia sau cho nguoi tham gia truoc
                                            participant.on('trackSubscribed', track => {
                                                $('.iconWaitCall').hide();
                                                $('#list-video').append(track.attach());
                                                $('video').addClass('w-50 h-50 img-thumbnail border col-4');
                                                $('video').hide();
                                                $('#list-video').append(`<lord-icon
                                                    class="iconVoiceCall col-4 border"
                                                    src="https://cdn.lordicon.com/fpipqhrr.json"
                                                    trigger="loop"
                                                    colors="primary:#121331,secondary:#08a88a"
                                                    style="width:250px;height:250px">
                                                </lord-icon>`);
                                            });
                                        });
                                        // Log Participants as they disconnect from the Room
                                        room.once('participantDisconnected', participant => {
                                            console.log(`Participant "${participant.identity}" has disconnected from the Room`);
                                        });
                                        //
                                        $('#btnCloseCall').on('click', function () {
                                            room.disconnect();
                                        });
                                        window.addEventListener('beforeunload', function (e) {
                                            e.preventDefault();
                                            room.disconnect();
                                        });
                                        room.on('disconnected', room => {
                                            swal('Bạn đã rời cuộc gọi');
                                            $('video').remove();
                                            $('#videoCallModal').modal('hide');
                                            // Detach the local media elements
                                            room.localParticipant.tracks.forEach(publication => {
                                                const attachedElements = publication.track.detach();
                                                attachedElements.forEach(element => element.remove());
                                            });
                                        });


                                        room.participants.forEach(participant => {
                                            participant.tracks.forEach(publication => {
                                                if (publication.track) {
                                                    $('.iconWaitCall').hide();
                                                    $('#list-video').append(publication.track.attach());
                                                    $('video').addClass('w-50 h-50 img-thumbnail border col-4');
                                                    $('video').hide();
                                                    $('#list-video').append(`<lord-icon
                                                        class="iconVoiceCall col-4 border"
                                                        src="https://cdn.lordicon.com/fpipqhrr.json"
                                                        trigger="loop"
                                                        colors="primary:#121331,secondary:#08a88a"
                                                        style="width:250px;height:250px">
                                                    </lord-icon>`);
                                                }
                                            });

                                            participant.on('trackSubscribed', track => {
                                                $('.iconWaitCall').hide();
                                                $('#list-video').append(track.attach());
                                                $('video').addClass('w-50 h-50 img-thumbnail border col-4');
                                                $('video').hide();
                                                $('#list-video').append(`<lord-icon
                                                    class="iconVoiceCall col-4 border"
                                                    src="https://cdn.lordicon.com/fpipqhrr.json"
                                                    trigger="loop"
                                                    colors="primary:#121331,secondary:#08a88a"
                                                    style="width:250px;height:250px">
                                                </lord-icon>`);
                                            });
                                        });
                                        //////////////
                                    }, error => {
                                        if (error.message == 'Permission denied') swal("Quyền truy cập camera đã bị chặn vui lòng bật lại");
                                        console.error(`Unable to connect to Room: ${error.message}`);
                                    }
                                    );
                                });
                            }
                            else {
                                swal("Trình duyệt của bạn không hỗ trợ gọi video");
                            }
                        }
                        else {
                            $('video').remove();
                            swal('Đã từ chối cuộc gọi');
                        }
                    });
            }
        });

    }
    catch {
        alert("co loi xay ra");
    }
}
Setup();