async function Setup() {
    try {
      var idYou = $('#idYou').val();
      peer = new Peer(idYou,{
        debug: 3,
        config: {
          iceServers: [{
            urls: ["stun:ss-turn1.xirsys.com"]
          }, {
            username: "YX5ln94dST7Kw3Sfs8h6oO1GApjoofmAlOUA8BTPwLc3ShgqLQMlxL_75dpSqVeOAAAAAGEaYEluaWVubHVhbm5nYW5oY3Q0NjY=",
            credential: "40ff7ba8-fe91-11eb-8e5b-0242ac140004",
            urls: [
              "turn:ss-turn1.xirsys.com:80?transport=udp",
              "turn:ss-turn1.xirsys.com:3478?transport=udp",
              "turn:ss-turn1.xirsys.com:80?transport=tcp",
              "turn:ss-turn1.xirsys.com:3478?transport=tcp",
              "turns:ss-turn1.xirsys.com:443?transport=tcp",
              "turns:ss-turn1.xirsys.com:5349?transport=tcp"
            ]
          }]
        }
      });
      peer.on('open', function (id) {
        $('#my-id').text(peer.id);
      });
      var constraints = { audio: false, video: true };
      var streamLocal = null;
      var vidLocal = await document.getElementById("my-video");
      var socket =io();
      $('#btnCall').on('click',async function(){
          var dataConnection1 = await peer.connect($('#idFriend').val());
          peer.on('connection',function(){
            alert('ket noi thanh cong');
          })
          dataConnection1.on('open', function(id){
            dataConnection1.send('audio');
          });
          dataConnection1.on('data', function(data){
            alert(data);
          });
          constraints = { audio: true, video: false };
          var idYou = $('#idYou').val();
          var idFriend = $('#idFriend').val();
          var idRoom ='';
          if(idYou.localeCompare(idFriend)==1) idRoom=idFriend+idYou;
          else idRoom=idYou+idFriend;
          socket.emit('sendRoomSize',idRoom);
          socket.once('roomSize',async function(data){
              if(data<2){
                  $('#notifyCantCall').removeClass('d-none');
                  $('.iconWaitCall').hide();
                  $('#btnCloseCall').hide();
                  $('#videoCallModal').modal('show');
                  $('#statusOnlineCol2').text('Không online');
                  $('#iconStatusOnline').removeClass('green');
                  $('#iconStatusOnline').addClass('text-secondary');
              }
              else{
                  $('.iconWaitCall').show();
                  $('#notifyCantCall').addClass('d-none');
                  $('#statusOnlineCol2').text('Online');
                  $('#iconStatusOnline').addClass('green');
                  $('#iconStatusOnline').removeClass('text-secondary');
                  streamLocal = await navigator.mediaDevices.getUserMedia(constraints);
                  $('#videoCallModal').modal('show');
                  vidLocal.srcObject = streamLocal;
                  window.localStream = streamLocal;
                  vidLocal.onloadedmetadata = function (e) {
                    vidLocal.play();
                  }
        
                  var dataConnection = peer.connect($('#idFriend').val());
                  dataConnection.on('data', async function(data) {
                    if(data=='cancel'){
                      swal("Người được gọi đã từ chối cuộc gọi")
                      .then(()=>{
                        $('#videoCallModal').modal('hide');
                        $('#videoCallModal').on('hidden.bs.modal',async function (e) {
                          var tracks = await streamLocal.getTracks();
                          tracks.forEach(function(track) {
                            track.stop();
                          });
                          vidLocal.srcObject = null;
                          window.localStream = null;
                          // alert('da gan null');
                        });
                      })
                    }
                    if(data=='closeCall'){
                      swal("Người được gọi đã kết thúc cuộc gọi")
                      .then(()=>{
                        $('#videoCallModal').modal('hide');
                        $('#videoCallModal').on('hidden.bs.modal',async function (e) {
                          var tracks = await streamLocal.getTracks();
                          tracks.forEach(function(track) {
                            track.stop();
                          });
                          vidLocal.srcObject = null;
                          window.localStream = null;
                          var vid = document.getElementById("their-video");
                          vid.srcObject = null;
                        });
                      })
                    }
                  });
                  //
                  var call = peer.call($('#idFriend').val(), streamLocal);
                  call.on('stream',async function (stream1) {
                    var vid = document.getElementById("their-video");
                    $('.iconWaitCall').addClass('d-none');
                    vid.srcObject = stream1;
                    vid.onloadedmetadata = function (e) {
                      vid.play();
                    };
                    //call = mediaConnection

                    $('#btnCloseCall').on('click',async function(e){
                      e.preventDefault();
                      dataConnection.send('closeCall');
                      $('#videoCallModal').modal('hide');
                      var tracks =await streamLocal.getTracks();
                      tracks.forEach(function(track) {
                        track.stop();
                      });
                      vidLocal.srcObject = null;
                      window.localStream = null;
                      var vid = document.getElementById("their-video");
                      vid.srcObject = null;
                    });
                  });
                  call.on('close', function(){
                    alert('close');
                  });
              }
          });
      });
      
      //// nguoi gui ////

      $('#btnVideoCall').on('click',function(){
        var idYou = $('#idYou').val();
        var idFriend = $('#idFriend').val();
        var idRoom ='';
        if(idYou.localeCompare(idFriend)==1) idRoom=idFriend+idYou;
        else idRoom=idYou+idFriend;
        socket.emit('sendRoomSize',idRoom);
        socket.once('roomSize',async function(data){
            if(data<2){
                $('#notifyCantCall').removeClass('d-none');
                $('.iconWaitCall').hide();
                $('#btnCloseCall').hide();
                $('#videoCallModal').modal('show');
                $('#statusOnlineCol2').text('Không online');
                $('#iconStatusOnline').removeClass('green');
                $('#iconStatusOnline').addClass('text-secondary');
            }
            else{
                $('.iconWaitCall').show();
                $('#notifyCantCall').addClass('d-none');
                $('#statusOnlineCol2').text('Online');
                $('#iconStatusOnline').addClass('green');
                $('#iconStatusOnline').removeClass('text-secondary');
                streamLocal = await navigator.mediaDevices.getUserMedia(constraints);
                $('#videoCallModal').modal('show');
                vidLocal.srcObject = streamLocal;
                window.localStream = streamLocal;
                vidLocal.onloadedmetadata = function (e) {
                  vidLocal.play();
                }
      
                var dataConnection = peer.connect($('#idFriend').val());
                dataConnection.on('data', async function(data) {
                  if(data=='cancel'){
                    swal("Người được gọi đã từ chối cuộc gọi")
                    .then(()=>{
                      $('#videoCallModal').modal('hide');
                      $('#videoCallModal').on('hidden.bs.modal',async function (e) {
                        var tracks = await streamLocal.getTracks();
                        tracks.forEach(function(track) {
                          track.stop();
                        });
                        vidLocal.srcObject = null;
                        window.localStream = null;
                        // alert('da gan null');
                      });
                    })
                  }
                  if(data=='closeCall'){
                    swal("Người được gọi đã kết thúc cuộc gọi")
                    .then(()=>{
                      $('#videoCallModal').modal('hide');
                      $('#videoCallModal').on('hidden.bs.modal',async function (e) {
                        var tracks = await streamLocal.getTracks();
                        tracks.forEach(function(track) {
                          track.stop();
                        });
                        vidLocal.srcObject = null;
                        window.localStream = null;
                        var vid = document.getElementById("their-video");
                        vid.srcObject = null;
                      });
                    })
                  }
                });
                //
                var call = peer.call($('#idFriend').val(), streamLocal);
                call.on('stream',async function (stream1) {
                  var vid = document.getElementById("their-video");
                  $('.iconWaitCall').addClass('d-none');
                  vid.srcObject = stream1;
                  vid.onloadedmetadata = function (e) {
                    vid.play();
                  };
                  //call = mediaConnection

                  $('#btnCloseCall').on('click',async function(e){
                    e.preventDefault();
                    dataConnection.send('closeCall');
                    $('#videoCallModal').modal('hide');
                    var tracks =await streamLocal.getTracks();
                    tracks.forEach(function(track) {
                      track.stop();
                    });
                    vidLocal.srcObject = null;
                    window.localStream = null;
                    var vid = document.getElementById("their-video");
                    vid.srcObject = null;
                  });
                });
                call.on('close', function(){
                  alert('close');
                });
            }
        });
      });
      ////nguoi nhan////
      peer.on('connection',async function(dataConnection) { 
        alert('co ket noi');
        dataConnection.on('open', async function(data) {
          dataConnection.send('audio');
        });
        dataConnection.on('data', function(data) {
          alert(data);
          if(data=='audio') constraints = { audio: true, video: false };
          if(data=='closeCall'){
            swal("Người gọi đã kết thúc cuộc gọi")
            .then(()=>{
              $('#videoCallModal').modal('hide');
              $('#videoCallModal').on('hidden.bs.modal',async function (e) {
                var tracks = await streamLocal.getTracks();
                tracks.forEach(function(track) {
                  track.stop();
                });
                vidLocal.srcObject = null;
                window.localStream = null;
                var vid = document.getElementById("their-video");
                vid.srcObject = null;
              });
            })
          }
        });
        //
        peer.on('call', async function (call) {
        
          swal({
              title: "Thông báo",
              text: "Có cuộc gọi đến",
              icon: "warning",
              buttons: ["Từ chối", "Nghe máy"],
              dangerMode: true,
          })
          .then(async (willDelete) => {
              if (willDelete) {
                streamLocal = await navigator.mediaDevices.getUserMedia(constraints);
                vidLocal.srcObject = streamLocal;
                window.localStream = streamLocal;
                vidLocal.onloadedmetadata = function (e) {
                  vidLocal.play();
                }
                call.answer(streamLocal);
                call.on('stream',async  function (stream1) {
                  // $('#their-video');
                  $('.iconWaitCall').addClass('d-none');
                  var vid = document.getElementById("their-video");
                  // alert("nhan stream(ban la nguoi duoc goi): " + stream1);
                  $('#videoCallModal').modal('show');
                  vid.srcObject = stream1;
                  // vid.play();
                  vid.onloadedmetadata = function (e) {
                    vid.play();
                  };
                  //call = mediaConnection
                  $('#btnCloseCall').on('click',async function(e){
                    e.preventDefault();
                    dataConnection.send('closeCall');
                    $('#videoCallModal').modal('hide');
                    var tracks = await streamLocal.getTracks();
                    // alert(tracks)
                    tracks.forEach(function(track) {
                      track.stop();
                    });
                  });
                });
              } 
              else {
                
                dataConnection.send('cancel');
                swal("Đã từ chối cuộc gọi");
              }
          });
          
        })

      });
    }
    catch {
      alert("co loi xay ra");
    }
  }
  Setup();