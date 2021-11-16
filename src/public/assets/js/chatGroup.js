$(function () {
    //Kết nối tới server socket đang lắng nghe
    var socket = io();
    $('.wrapPreview').on('click', function () {
        var idRoom =$(this).attr('id');
        socket.emit("joinroom",idRoom);
        socket.emit('sendRoomSize',idRoom);
    });
    
    $('.wrapPreviewNew').on('click', function () {
        var idRoom =$(this).attr('id');
        socket.emit("joinroom",idRoom);
        socket.emit('sendRoomSize',idRoom);
    });
    //Socket nhận data và append vào giao diện
    socket.on("connect", () => {
        var idRoom =$('#idMess').val();
        socket.emit("joinroom",idRoom);
        socket.emit('sendRoomSize',idRoom);
        socket.on("roomSize", (data) => {
            if(data==1){
                $('#iconStatusOnline').removeClass('green');
                $('#iconStatusOnline').addClass('text-secondary');
            }
        });
    });
    socket.on("sendGroup", function (data) {
        // console.log(data);
        var usernameYou = $('#usernameYou').val();
        var element = data;
        if(element.typeMess=='image' || element.typeMess=='video'){
            var listMediaCol3 = ``;
            if(element.typeMess =='image'){
                var split1 =element.content.split('href=')[1];
                var link =``;
                if(split1) link = split1.split(' target="_blank">');
                listMediaCol3 = `<a href=${link[0]} target="_blank">
                    <img src=${link[0]} width="50px" height="50px" alt="" class="img-thumbnail">
                </a>`;
            }
            // video
            else{
                listMediaCol3 = `${element.content.replace('text-white','text-primary')}`;
            }
            $('#listMediaInCol3').append(listMediaCol3);

        }
        else{
            if(element.typeMess=='document') $('#listDocumentInCol3').append(`<div>${element.content.replace('text-white','text-primary')}</div>`);
        }
        // alert(JSON.stringify(username));
        if(usernameYou==data.from){
            $("#contentCol2").append("<p class='message__container'>" + "<span class='content-message' style='background-color:rgb(0, 66, 233);'>" + data.content + "</span> :Bạn"+"</p><br>");
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
        }
        else {
            $("#contentCol2").append("<p class='message__container-1'>" + data.from + ": "+"<span class='content-message-1'>" + data.content + "</span>"+"</p><br>");
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
        }
    });

    //Bắt sự kiện click gửi message
    $("#btnSendMessage").on('click', function () {
        var idMess = $('#idMess').val();
        var nameGroup = $('#nameFriendCol2').text();
        var idRoom=idMess;
        socket.emit("joinroom",idRoom);
        var usernameYou = $('#usernameYou').val();
        var message = '<i class="fas fa-thumbs-up ms-2 iconFooterCol2"></i>';
        if (message == '') {
            alert('Please enter message!!');
        } else {
            //Gửi dữ liệu cho socket
            socket.emit('sendGroup', {from: usernameYou, to: nameGroup, content: message,typeMess:'iconLike', idRoom,idMess});
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
            $("#contentCol2").append("<p class='message__container waitImgUpload'>" + "<span class='content-message' style='background-color:blue;'>" +"Đang gửi "+ fileLength+ " ảnh<br>" + loadIcon + "</span> :Bạn"+"</p>");
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
                        totalData+= `<a href="${dataJson.secure_url}" target="_blank"><img src="${dataJson.secure_url}" width="50px" height="50px" class="img-thumbnail cursor listImgAfterUpload m-1"></a>`;
                        if(i==fileLength-1){
                            var usernameYou = $('#usernameYou').val();
                            var nameGroup = $('#nameFriendCol2').text();
                            var message = totalData;
                            var idRoom =$('#idMess').val();
                            socket.emit("joinroom",idRoom);

                            //Gửi dữ liệu cho socket
                            $('.waitImgUpload').remove();
                            socket.emit('sendGroup', {from: usernameYou, to: nameGroup, content: message, typeMess:'image',idMess:idRoom});
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
            $("#contentCol2").append("<p class='message__container waitDocUpload'>" + "<span class='content-message' style='background-color:blue;'>" +"Đang gửi "+ fileDocumentLength+ " tệp tin<br>" + loadIcon + "</span> :Bạn"+"</p>");
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
                        if(dataJson.format) extendFile = dataJson.format;
                        console.log(dataJson);
                        totalData+= `<a href="${dataJson.secure_url}" style="font-weight: bold;" class="me-1 listDocAfterUpload text-white" target="_blank">${dataJson.original_filename}.${extendFile}</a>&nbsp;`;
                        if(i==fileDocumentLength-1){
                            var usernameYou = $('#usernameYou').val();
                            var nameGroup = $('#nameFriendCol2').text();
                            var message = await totalData;
                            //Gửi dữ liệu cho socket
                            $('.waitDocUpload').remove();
                            var idRoom =$('#idMess').val();
                            socket.emit("joinroom",idRoom);
                            if(dataJson.resource_type=='video' || dataJson.resource_type=='image'){
                                if(dataJson.resource_type=='video'){
                                    socket.emit('sendGroup', {from: usernameYou, to:nameGroup, content: message, typeMess:'video',idMess:idRoom});
                                    $('#inputMessage').val('');
                                }
                                if(dataJson.resource_type=='image'){
                                    socket.emit('sendGroup', {from: usernameYou, to:nameGroup, content: message, typeMess:'image',idMess:idRoom});
                                    $('#inputMessage').val('');
                                }
                
                            }
                            else{
                                socket.emit('sendGroup', {from: usernameYou, to:nameGroup, content: message, typeMess:'document',idMess:idRoom});
                                $('#inputMessage').val('');
                            }
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
            if(event.which===13){
                var usernameYou = $('#usernameYou').val();
                var nameGroup = $('#nameFriendCol2').text();
                var message = $('#inputMessage').val();
                if (message == '\n' || message=='') {
                    alert('Vui lòng nhập nội dung!!');
                    $("#inputMessage").val('')
                } else {
                    //Gửi dữ liệu cho socket
                    var idRoom =$('#idMess').val();
                    socket.emit("joinroom",idRoom);
                    socket.emit('sendGroup', {from: usernameYou, to:nameGroup, content: message, typeMess:'text',idMess:idRoom});
                    $('#inputMessage').val('');
                }
            }
        }
    });
})
