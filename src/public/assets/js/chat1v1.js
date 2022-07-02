$(function () {
    //Kết nối tới server socket đang lắng nghe
    var socket = io();
    $('.wrapPreview').on('click', function () {
        var idYou = $('#idYou').val();
        var idFriend = $('#idFriend').val();
        var idRoom ='';
        if(idYou.localeCompare(idFriend)==1) idRoom=idFriend+idYou;
        else idRoom=idYou+idFriend;
        socket.emit("joinroom",idRoom);
        socket.emit('sendRoomSize',idRoom);
    });
    
    $('.wrapPreviewNew').on('click', function () {
        var idYou = $('#idYou').val();
        var idFriend = $('#idFriend').val();
        var idRoom ='';
        if(idYou.localeCompare(idFriend)==1) idRoom=idFriend+idYou;
        else idRoom=idYou+idFriend;
        socket.emit("joinroom",idRoom);
        socket.emit('sendRoomSize',idRoom);
    });
    //Socket nhận data và append vào giao diện
    socket.on("connect", () => {
        var idYou = $('#idYou').val();
        var idFriend = $('#idFriend').val();
        var idRoom ='';
        if(idYou.localeCompare(idFriend)==1) idRoom=idFriend+idYou;
        else idRoom=idYou+idFriend;
        socket.emit("joinroom",idRoom);
        socket.emit('sendRoomSize',idRoom);
        socket.on("roomSize", (data) => {
            if(data==1){
                $('#statusOnlineCol2').text('Không online');
                $('#iconStatusOnline').removeClass('green');
                $('#iconStatusOnline').addClass('text-secondary');
            }
            
        });
    });
    socket.on("send", function (data) {
        console.log(data);
        var usernameYou = $('#usernameYou').val();
        console.log(usernameYou);
        var url = window.location.href;
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
                    text: "Xóa tin nhắn này?",
                    icon: "warning",
                    dangerMode: true,
                    buttons: ["Hủy bỏ", "Đồng ý"],
                })
                .then((willDelete) => {
                    if (willDelete) {
                        $.post('/me/deleteMessage1v1',{idMessage, idMess},function(data){
                            if(data=='xoathanhcong'){
                                swal({
                                    title: "Thông báo",
                                    text: "Đã Xóa",
                                    icon: "success",
                                    button: "Đóng",
                                })
                                .then(()=>{
                                    parentElement.remove();
                                });
                            }
                            else if(data=='xoathanhcongfile'){
                                swal({
                                    title: "Thông báo",
                                    text: "Đã Xóa",
                                    icon: "success",
                                    button: "Đóng",
                                })
                                .then(()=>{
                                    var spantag = parentElement.children('span').children('a');
                                    parentElement.remove();
                                    if(spantag.attr('idfile')){
                                        var idFileInCol3 = spantag.attr('idfile');
                                        $('.'+idFileInCol3).remove();
                                    }
                                });
                            }
                            else{
                                swal({
                                    title: "Thông báo",
                                    text: "Xóa thất bại, có lỗi xảy ra!",
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
                    text: "Xóa tin nhắn này?",
                    icon: "warning",
                    dangerMode: true,
                    buttons: ["Hủy bỏ", "Đồng ý"],
                })
                .then((willDelete) => {
                    if (willDelete) {
                        $.post('/me/deleteMessage1v1',{idMessage, idMess},function(data){
                            if(data=='xoathanhcong'){
                                swal({
                                    title: "Thông báo",
                                    text: "Đã Xóa",
                                    icon: "success",
                                    button: "Đóng",
                                })
                                .then(()=>{
                                    parentElement.remove();
                                });
                            }
                            else if(data=='xoathanhcongfile'){
                                swal({
                                    title: "Thông báo",
                                    text: "Đã Xóa",
                                    icon: "success",
                                    button: "Đóng",
                                })
                                .then(()=>{
                                    var spantag = parentElement.children('span').children('a');
                                    parentElement.remove();
                                    if(spantag.attr('idfile')){
                                        var idFileInCol3 = spantag.attr('idfile');
                                        $('.'+idFileInCol3).remove();
                                    }
                                });
                            }
                            else{
                                swal({
                                    title: "Thông báo",
                                    text: "Xóa thất bại, có lỗi xảy ra!",
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

    //Bắt sự kiện click gửi message
    $("#btnSendMessage").on('click', function () {
        var idYou = $('#idYou').val();
        var idMess = $('#idMess').val();
        var idFriend = $('#idFriend').val();
        var idRoom ='';
        if(idYou.localeCompare(idFriend)==1) idRoom=idFriend+idYou;
        else idRoom=idYou+idFriend;
        socket.emit("joinroom",idRoom);
        // alert($('#contentCol2')[0].scrollHeight);
        var usernameYou = $('#usernameYou').val();
        var usernameFriend = $('#usernameFriend').val();
        var message = '<i class="fas fa-thumbs-up ms-2 iconFooterCol2"></i>';
        if (message == '') {
            alert('Please enter message!!');
        } else {
            //Gửi dữ liệu cho socket
            socket.emit('send', {from: usernameYou, to:usernameFriend, content: message,typeMess:'iconLike', idRoom, idFriend,idMess});
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
                            var usernameFriend = $('#usernameFriend').val();
                            var message = totalData;
                            var idYou = $('#idYou').val();
                            var idFriend = $('#idFriend').val();
                            var idMess = $('#idMess').val();
                            var idRoom ='';
                            if(idYou.localeCompare(idFriend)==1) idRoom=idFriend+idYou;
                            else idRoom=idYou+idFriend;
                            socket.emit("joinroom",idRoom);

                            //Gửi dữ liệu cho socket
                            $('.waitImgUpload').remove();
                            socket.emit('send', {from: usernameYou,to:usernameFriend, content: message, typeMess:'image', idRoom, idFriend,idMess});
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
                            var usernameFriend = $('#usernameFriend').val();
                            var message = await totalData;
                            //Gửi dữ liệu cho socket
                            $('.waitDocUpload').remove();

                            var idYou = $('#idYou').val();
                            var idFriend = $('#idFriend').val();
                            var idMess = $('#idMess').val();
                            var idRoom ='';
                            if(idYou.localeCompare(idFriend)==1) idRoom=idFriend+idYou;
                            else idRoom=idYou+idFriend;
                            socket.emit("joinroom",idRoom);
                            if(dataJson.resource_type=='video' || dataJson.resource_type=='image' && dataJson.format!='pdf'){
                                if(dataJson.resource_type=='video'){
                                    socket.emit('send', {from: usernameYou, to:usernameFriend, content: message, typeMess:'video', idRoom, idFriend,idMess});
                                    $('#inputMessage').val('');
                                }
                                if(dataJson.resource_type=='image'){
                                    socket.emit('send', {from: usernameYou, to:usernameFriend, content: message, typeMess:'image', idRoom, idFriend,idMess});
                                    $('#inputMessage').val('');
                                }
                
                            }
                            else{
                                socket.emit('send', {from: usernameYou, to:usernameFriend, content: message, typeMess:'document', idRoom, idFriend,idMess});
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
            var url = window.location.href;
            if(event.which===13){
                var usernameYou = $('#usernameYou').val();
                var usernameFriend = $('#usernameFriend').val();
                var message = $('#inputMessage').val();
                if (message == '\n' || message=='') {
                    alert('Vui lòng nhập nội dung!!');
                    $("#inputMessage").val('')
                } else {
                    //Gửi dữ liệu cho socket
                    var idYou = $('#idYou').val();
                    var idFriend = $('#idFriend').val();
                    var idMess = $('#idMess').val();
                    var idRoom ='';
                    if(idYou.localeCompare(idFriend)==1) idRoom=idFriend+idYou;
                    else idRoom=idYou+idFriend;
                    socket.emit("joinroom",idRoom);
                    socket.emit('send', {from: usernameYou, to:usernameFriend, content: message, typeMess:'text', idRoom, idFriend,idMess});
                    $('#inputMessage').val('');
                }
            }
        }
    });
})
