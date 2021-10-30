$(function () {
    //Kết nối tới server socket đang lắng nghe
    var socket = io();
    //Socket nhận data và append vào giao diện
    socket.on("connect", () => {
        var url = window.location.href;
        var urlSplit =url.split('/');
        var usernameUrl = urlSplit[urlSplit.length-1];
        // console.log(socket.id);
        socket.emit("joinroom",usernameUrl);
    });
    socket.on("send", function (data) {
        console.log(data);
        var username = $('#usernameSocket').val();
        var objMessage={};
        var url = window.location.href;
        var urlSplit =url.split('/');
        var usernameUrl = urlSplit[urlSplit.length-1];
        var usernameReceive = $('#usernameSocket').val();
        console.log(username);
        console.log(data.username);
        // alert(JSON.stringify(username));
        if(username==data.username){
            $("#contentCol2").append("<p class='message__container'>" + "<span class='content-message' style='background-color:blue;'>" + data.message + "</span> :Bạn"+"</p><br>");
            $("#contentCol2").scrollTop($("#contentCol2")[0].scrollHeight);
            $(document).ready(function(){
                $('.listImgAfterUpload').each(function(){
                    $(this).click(function(){
                        var w = window.innerWidth;
                        var h = window.innerHeight;
                        var imgSrc = $(this).attr('src');
                        window.open(imgSrc,'_blank');
                    });
                });
            });
            if(data.size==1){
                if(data.username=='admin'){
                    objMessage.from=data.username;
                    objMessage.to=usernameUrl;
                    objMessage.content=data.message;
                }
                else{
                    objMessage.from=data.username;
                    objMessage.to='admin';
                    objMessage.content=data.message;
                }
                socket.emit("receiver",objMessage);
            }
        }
        else {
            $("#contentCol2").append("<p class='message__container-1'>" + data.username + ": "+"<span class='content-message-1'>" + data.message + "</span>"+"</p><br>");
            $("#contentCol2").scrollTop($("#contentCol2")[0].scrollHeight);
            $(document).ready(function(){
                $('.listImgAfterUpload').each(function(){
                    $(this).click(function(){
                        var w = window.innerWidth;
                        var h = window.innerHeight;
                        var imgSrc = $(this).attr('src');
                        window.open(imgSrc,'_blank');
                    });
                });
            });
            objMessage.from=data.username;
            objMessage.to=usernameReceive;
            objMessage.content=data.message;
            socket.emit("receiver",objMessage);
        }
    });
    
    //Bắt sự kiện click gửi message
    $("#btnSendMessage").on('click', function () {
        // alert($('#contentCol2')[0].scrollHeight);
        var username = $('#usernameSocket').val();
        var message = '<i class="fas fa-thumbs-up ms-2 iconFooterCol2"></i>';
        var url = window.location.href;
        var urlSplit =url.split('/');
        var usernameUrl = urlSplit[urlSplit.length-1];
        if (message == '') {
            alert('Please enter message!!');
        } else {
            //Gửi dữ liệu cho socket
            socket.emit('send', {username: username, message: message,usernameUrl:usernameUrl});
            $('#inputMessage').val('');
            
        }
    });
    $("#inputMessage").on('keyup',function(event) {
        var fileLength = $('#fileImage')[0].files.length;
        var fileDocumentLength = $('#fileDocument')[0].files.length;
        if(fileLength>0){
            var loadIcon =`<lord-icon
                            src="https://cdn.lordicon.com/xjovhxra.json"
                            trigger="loop"
                            colors="primary:#ffffff,secondary:#b4b4b4"
                            style="width:100px;height:50px">
                        </lord-icon>`;
            $("#contentCol2").append("<p class='message__container waitImgUpload'>" + "<span class='content-message' style='background-color:blue;'>" +"Đang gửi "+ fileLength+ " ảnh<br>" + loadIcon + "</span> :Bạn"+"</p><br>");
            $("#contentCol2").scrollTop($("#contentCol2")[0].scrollHeight);
            var url = "https://api.cloudinary.com/v1_1/dq7zeyepu/image/upload";
            var totalData = ``;
            var files = document.querySelector("#fileImage").files;
            console.log(files);
            var formData = new FormData();
            async function uploadImage() {
                for (let i = 0; i < files.length; i++) {
                    let file = files[i];
                    formData.append("file", file);
                    formData.append("upload_preset", "kkurekfz");
                    formData.append("folder", "avatar");
                    await fetch(url, {
                        method: "POST",
                        body: formData
                    })
                    .then(async function(response){
                        var data = await response.text();
                        var dataJson = await JSON.parse(data);
                        totalData+= `<img src="${dataJson.secure_url}" width="50px" height="50px" class="me-1 border cursor listImgAfterUpload">`;
                        if(i==fileLength-1){
                            var username = $('#usernameSocket').val();
                            var message = totalData;
                            var url = window.location.href;
                            var urlSplit =url.split('/');
                            var usernameUrl = urlSplit[urlSplit.length-1];
                            //Gửi dữ liệu cho socket
                            $('.waitImgUpload').remove();
                            socket.emit('send', {username: username, message: message,usernameUrl:usernameUrl, typeMess:'image'});
                                $('#inputMessage').val('');
                            }
                    });
                }
                var $el = $('#fileImage');
                $('#listImg').html('');
                $el.wrap('<form>').closest('form').get(0).reset();
                $el.unwrap();
                $("#inputMessage").val('');
            }
            uploadImage();
        }
        else if(fileDocumentLength>0){
            var loadIcon =`<lord-icon
                            src="https://cdn.lordicon.com/xjovhxra.json"
                            trigger="loop"
                            colors="primary:#ffffff,secondary:#b4b4b4"
                            style="width:100px;height:50px">
                        </lord-icon>`;
            $("#contentCol2").append("<p class='message__container waitDocUpload'>" + "<span class='content-message' style='background-color:blue;'>" +"Đang gửi "+ fileDocumentLength+ " tệp tin<br>" + loadIcon + "</span> :Bạn"+"</p><br>");
            $("#contentCol2").scrollTop($("#contentCol2")[0].scrollHeight);
            var url = "https://api.cloudinary.com/v1_1/dq7zeyepu/auto/upload";
            var totalData = ``;
            var files = document.querySelector("#fileDocument").files;
            var formData = new FormData();
            async function uploadFile(){
                for (let i = 0; i < files.length; i++) {
                    let file = files[i];
                    formData.append("file", file);
                    formData.append("upload_preset", "kkurekfz");
                    formData.append("folder", "Document");
                    await fetch(url, {
                        method: "POST",
                        body: formData
                    })
                    .then(async function(response){
                        console.log(i);
                        var data = await response.text();
                        var dataJson = await JSON.parse(data);
                        var extendFile = await dataJson.public_id.split('.')[1];
                        console.log(dataJson);
                        totalData+= `<a href="${dataJson.secure_url}" style="font-weight: bold;" class="me-1 listDocAfterUpload text-white" target="_blank">${dataJson.original_filename}.${extendFile}</a>&nbsp;`;
                        if(i==fileDocumentLength-1){
                            var username = $('#usernameSocket').val();
                            var message = await totalData;
                            var url = window.location.href;
                            var urlSplit =url.split('/');
                            var usernameUrl = urlSplit[urlSplit.length-1];
                            //Gửi dữ liệu cho socket
                            $('.waitDocUpload').remove();
                            socket.emit('send', {username: username, message: message,usernameUrl:usernameUrl, typeMess:'document'});
                                $('#inputMessage').val('');
                            }
                    });
                }
                var $el = $('#fileDocument');
                $('#listDocument').html('');
                $el.wrap('<form>').closest('form').get(0).reset();
                $el.unwrap();
                $("#inputMessage").val('');
            }
            uploadFile();
            
        }
        else{
            var url = window.location.href;
            var urlSplit =url.split('/');
            var usernameUrl = urlSplit[urlSplit.length-1];
            if(event.which===13){
                var username = $('#usernameSocket').val();
                var message = $('#inputMessage').val();
                if (message == '\n' || message=='') {
                    alert('Vui lòng nhập nội dung!!');
                    $("#inputMessage").val('')
                } else {
                    //Gửi dữ liệu cho socket
                    socket.emit('send', {username: username, message: message,usernameUrl:usernameUrl, typeMess:'text'});
                    $('#inputMessage').val('');
                }
            }
        }
    });
})
