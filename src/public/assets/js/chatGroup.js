$(function () {
    //Kết nối tới server socket đang lắng nghe
    var socket = io();
    var socketDeleteMessage = io();
    $('.wrapPreview').on('click', function () {
        var idRoom =$(this).attr('id');
        socket.emit("joinroom",idRoom);
        socket.emit('sendRoomSize',idRoom);
        socket.once('roomSize',async function(data){
            if(data<2){
                $('#statusOnlineCol2').text('Không online');
                $('#iconStatusOnline').removeClass('green');
                $('#iconStatusOnline').addClass('text-secondary');
            }
            else{
                $('#statusOnlineCol2').text('Online');
                $('#iconStatusOnline').addClass('green');
                $('#iconStatusOnline').removeClass('text-secondary');
            }
        });
    });
    
    $('.wrapPreviewNew').on('click', function () {
        var idRoom =$(this).attr('id');
        socket.emit("joinroom",idRoom);
        socket.emit('sendRoomSize',idRoom);
        socket.once('roomSize',async function(data){
            if(data<2){
                $('#statusOnlineCol2').text('Không online');
                $('#iconStatusOnline').removeClass('green');
                $('#iconStatusOnline').addClass('text-secondary');
            }
            else{
                $('#statusOnlineCol2').text('Online');
                $('#iconStatusOnline').addClass('green');
                $('#iconStatusOnline').removeClass('text-secondary');
            }
        });
    });
    //Socket nhận data và append vào giao diện
    socket.on("connect", () => {
        var idRoom =$('#idMess').val();
        socket.emit("joinroom",idRoom);
        socket.emit('sendRoomSize',idRoom);
        socket.on("roomSize", (data) => {
            if(data<2){
                $('#statusOnlineCol2').text('Không online');
                $('#iconStatusOnline').removeClass('green');
                $('#iconStatusOnline').addClass('text-secondary');
            }
        });
    });
    socket.on("sendGroup", function (data) {
        // console.log(data);
        var usernameYou = $('#usernameYou').val();
        var element = data;
        var idElement =0;
        $('.content-message').each(function () {
            idElement++;
        });
        $('.content-message-1').each(function () {
            idElement++;
        });
        if(element.typeMess=='image' || element.typeMess=='video'){
            var listMediaCol3 = ``;
            if(element.typeMess =='image'){
                var split1 =element.content.split('href=')[1];
                var link =``;
                if(split1) link = split1.split(' target="_blank"');
                var classAndIdfile=``;
                if(link[1].indexOf('idfile')>=0){
                    classAndIdfile = ``+link[1].split('style="font-weight: bold;"')[1];
                    classAndIdfile = classAndIdfile.split('>')[0];
                }
                if(element.content.indexOf('img')>=0){
                    listMediaCol3+=element.content;
                }
                else{
                    listMediaCol3 = `<a href=${link[0]} target="_blank">
                    <img src=${link[0]} width="50px" height="50px" alt="" ${classAndIdfile}>
                    </a>`;
                }
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
            $("#contentCol2").append("<p class='message__container'>" + "<span class='content-message' style='background-color:rgb(0, 66, 233);'>" + data.content + "</span> :Bạn"+`<br><i class="fas fa-backspace d-none iconDeleteMessage cursor" id="${idElement}"></i>`+"</p><br>");
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
            $('.message__container').on('mouseover', function(){
                $(this).children('.iconDeleteMessage').removeClass('d-none');
            });
            $('.message__container').on('mouseout', function(){
                $(this).children('.iconDeleteMessage').addClass('d-none');
            });
            $('.iconDeleteMessage').on('click',function(){
                var idMess=$('#idMess').val();
                var idMessage = $(this).attr('id');
                var parentElement = $(this).parent();
                swal({
                    title: "Thông báo",
                    text: "Thu hồi tin nhắn này?",
                    icon: "warning",
                    dangerMode: true,
                    buttons: ["Hủy bỏ", "Đồng ý"],
                })
                .then((willDelete) => {
                    if (willDelete) {
                        $.post('/me/deleteMessage',{idMessage, idMess},function(data){
                            if(data=='xoathanhcong'){
                                swal({
                                    title: "Thông báo",
                                    text: "Đã thu hồi",
                                    icon: "success",
                                    button: "Đóng",
                                })
                                .then(()=>{
                                    parentElement.remove();
                                    var idYou = $('#idYou').val();
                                    socketDeleteMessage.emit('deleteMessage',{idMessage, idYou, idMess});
                                    $('.iconDeleteMessage').each(function(){
                                        var idElement = $(this).attr('id');
                                        if(idElement>idMessage){
                                            $(this).attr('id',parseInt(idElement)-1);
                                        }
                                    });
                                });
                            }
                            else if(data=='xoathanhcongfile'){
                                swal({
                                    title: "Thông báo",
                                    text: "Đã thu hồi",
                                    icon: "success",
                                    button: "Đóng",
                                })
                                .then(()=>{
                                    var spantag = parentElement.children('span').children('a');
                                    parentElement.remove();
                                    if(spantag.attr('idfile')){
                                        var idFileInCol3 = spantag.attr('idfile');
                                        $('.'+idFileInCol3).remove();
                                        var idYou = $('#idYou').val();
                                        socketDeleteMessage.emit('deleteMessage',{idMessage,idYou,idMess,idFileInCol3});
                                        $('.iconDeleteMessage').each(function(){
                                            var idElement = $(this).attr('id');
                                            if(idElement>idMessage){
                                                $(this).attr('id',parseInt(idElement)-1);
                                            }
                                        });
                                    }
                                });
                            }
                            else{
                                swal({
                                    title: "Thông báo",
                                    text: "Thu hồi thất bại, có lỗi xảy ra!",
                                    icon: "error",
                                    button: "Đóng",
                                });
                            }
                        });
                    } 
                    else {
                        swal("Đã hủy xóa");
                    }
                });
            });
        }
        else {
            $("#contentCol2").append("<p class='message__container-1'>" + data.from + ": "+"<span class='content-message-1'>" + data.content + "</span>"+`<br><i class="fas fa-backspace d-none iconDeleteMessage cursor" id="${idElement}"></i>`+"</p><br>");
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
            $('.message__container').on('mouseover', function(){
                $(this).children('.iconDeleteMessage').removeClass('d-none');
            });
            $('.message__container').on('mouseout', function(){
                $(this).children('.iconDeleteMessage').addClass('d-none');
            });
            $('.iconDeleteMessage').on('click',function(){
                var idMess=$('#idMess').val();
                var idMessage = $(this).attr('id');
                var parentElement = $(this).parent();
                swal({
                    title: "Thông báo",
                    text: "Thu hồi tin nhắn này?",
                    icon: "warning",
                    dangerMode: true,
                    buttons: ["Hủy bỏ", "Đồng ý"],
                })
                .then((willDelete) => {
                    if (willDelete) {
                        $.post('/me/deleteMessage',{idMessage, idMess},function(data){
                            if(data=='xoathanhcong'){
                                swal({
                                    title: "Thông báo",
                                    text: "Đã thu hồi",
                                    icon: "success",
                                    button: "Đóng",
                                })
                                .then(()=>{
                                    parentElement.remove();
                                    var idYou = $('#idYou').val();
                                    socketDeleteMessage.emit('deleteMessage',{idMessage, idYou, idMess});
                                    $('.iconDeleteMessage').each(function(){
                                        var idElement = $(this).attr('id');
                                        if(idElement>idMessage){
                                            $(this).attr('id',parseInt(idElement)-1);
                                        }
                                    });
                                });
                            }
                            else if(data=='xoathanhcongfile'){
                                swal({
                                    title: "Thông báo",
                                    text: "Đã thu hồi",
                                    icon: "success",
                                    button: "Đóng",
                                })
                                .then(()=>{
                                    var spantag = parentElement.children('span').children('a');
                                    parentElement.remove();
                                    if(spantag.attr('idfile')){
                                        var idFileInCol3 = spantag.attr('idfile');
                                        $('.'+idFileInCol3).remove();
                                        var idYou = $('#idYou').val();
                                        socketDeleteMessage.emit('deleteMessage',{idMessage,idYou,idMess,idFileInCol3});
                                        $('.iconDeleteMessage').each(function(){
                                            var idElement = $(this).attr('id');
                                            if(idElement>idMessage){
                                                $(this).attr('id',parseInt(idElement)-1);
                                            }
                                        });
                                    }
                                });
                            }
                            else{
                                swal({
                                    title: "Thông báo",
                                    text: "Thu hồi thất bại, có lỗi xảy ra!",
                                    icon: "error",
                                    button: "Đóng",
                                });
                            }
                        });
                    } 
                    else {
                        swal("Đã hủy xóa");
                    }
                });
            });
        }
    });
    // socketDeleteMessage.on('deleteMessage',function(data){
    //     if(data.idMess==$('#idMess').val() && data.idYou != $('#idYou').val()){
    //         var parentContent = $('#'+data.idMessage).parent();
    //         if(data.idFileInCol3){
    //             $('#'+data.idMessage).remove();
    //             $('.'+data.idFileInCol3).remove();
    //         }
    //         else{
    //             $('#'+data.idMessage).remove();
    //         }
    //         parentContent.children('span').html('<p class="fw-bold">Nội dung bị xóa bởi người gửi</p>');
    //         $('.iconDeleteMessage').each(function(){
    //             var idElement = $(this).attr('id');
    //             if(idElement>data.idMessage){
    //                 $(this).attr('id',parseInt(idElement)-1);
    //             }
    //         });
    //     }
    // });
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
                        totalData+= `<a href="${dataJson.secure_url}" target="_blank" class=" ${dataJson.asset_id}" idfile="${dataJson.asset_id}"><img src="${dataJson.secure_url}" width="50px" height="50px" class="img-thumbnail cursor listImgAfterUpload m-1"></a>`;
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
                        totalData+= `<a href="${dataJson.secure_url}" target="_blank" style="font-weight: bold;" class="me-1 listDocAfterUpload text-white ${dataJson.asset_id}" idfile="${dataJson.asset_id}">${dataJson.original_filename}.${extendFile}</a>&nbsp;`;
                        if(i==fileDocumentLength-1){
                            var usernameYou = $('#usernameYou').val();
                            var nameGroup = $('#nameFriendCol2').text();
                            var message = await totalData;
                            //Gửi dữ liệu cho socket
                            $('.waitDocUpload').remove();
                            var idRoom =$('#idMess').val();
                            socket.emit("joinroom",idRoom);
                            if(dataJson.resource_type=='video' || dataJson.resource_type=='image' && dataJson.format!='pdf'){
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
