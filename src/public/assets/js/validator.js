function Validator(formSelector){
    var _this = this;
    var formRules={};
    function getParent(element, selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    function getDataResponseFromUrl(method, url,value){
        var httpRequest = new XMLHttpRequest();
        value = JSON.stringify(value);
        httpRequest.open(method,url,false);
        httpRequest.setRequestHeader('Content-Type','application/json');
        httpRequest.send(value);
        return httpRequest.responseText;
    }
    /*
        Quy uoc rules:
            +co loi return thong bao loi
            +Khong loi return undefined
            ^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$
    */
    var validatorRules = {
        required: function(value){
            return value? undefined:"Vui lòng nhập trường này";
        },
        notSpace: function(value){
            var regex =/^([A-z0-9!@#$%^&*().,<>{}[\]<>?_=+\-|;:\'\"\/])*[^\s]\1*$/
            return value.match(regex)? undefined : "Không được chứa khoảng trắng";
        },
        min:function(min){
            return function(value){
                return value.length>=min? undefined:`Vui lòng nhập ít nhất ${min} kí tự`;
            }
        },
        max:function(max){
            return function(value){
                return value.length<=max? undefined:`Vui lòng nhập tối đa ${max} kí tự`;
            }
        },
        equal:function(value){
            var password = $("#passwordRegister").val();
            return password!==value && password!=''? "Nhập lại mật khẩu không khớp": undefined;
            // if(password<repassword) return "Nhập lại mật khẩu không khớp";
            // return undefined;
        },
        existName: function(value){
            var obj = {'checkUserName': value};
            var data = getDataResponseFromUrl("POST","/register/checkUserName",obj);
            return data=='0' ? undefined : "Tên tài khoản đã tồn tại";
        },
        existEmail: function(value){
            var obj = {'checkEmail': value};
            var data = getDataResponseFromUrl("POST","/register/checkEmail",obj);
            return data=='0' ? undefined : "Email đã được dùng";
        },
        allAlpha: function(value){
            var regex = /^[a-zA-Z]+$/;
            return value.match(regex)? undefined : "Chỉ bao gồm kí tự chữ cái";
        },
        alphaNum: function(value){
            var regex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{3,}$/;
            return value.match(regex)? undefined : "Phải có ít nhất 1 kí tự hoa, 1 kí tự thường và 1 số";
        },
        email: function(value){
            var regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
            return value.match(regex)? undefined : "Email không hợp lệ";
        }
    }
    //lay ra form 
    var formElement = document.querySelector(formSelector);
    //chi xu li neu co id form nay
    if(formElement){
        var inputs = formElement.querySelectorAll('[name][rules]');
        for(var input of inputs){
            var passwordinput , repasswordinput ;
            var rules = input.getAttribute('rules').split('|');
            for(var rule of rules){

                var ruleArray;
                var isRuleHasValue = rule.includes(':');
                if(isRuleHasValue){
                    ruleArray = rule.split(':');
                    rule=ruleArray[0];
                }
                var ruleFunction = validatorRules[rule];
                if(isRuleHasValue){
                    ruleFunction = ruleFunction(ruleArray[1]);
                }
                if(Array.isArray(formRules[input.name])){
                    formRules[input.name].push(ruleFunction);
                }
                else{
                    formRules[input.name]=[ruleFunction];
                }
            }
            //listening event de validate(blur,change)
            // input.onkeyup = handleValidate;
            // input.onblur = handleValidate;
            input.onchange = handleValidate;
            input.oninput = handleClearErrMess;
            //
        }
        //Ham thuc hien validate
        function handleValidate(event){
            var rules = formRules[event.target.name];
            var errMess="";
            for(var rule of rules){
                errMess = rule(event.target.value);
                if(errMess) break;
            }
            
            // Neu co loi thi hien thong bao
            if(errMess){
                var formGroup = getParent(event.target, '.auth-form__group');
                if(formGroup){
                    formGroup.classList.add('invalid');
                    var formMess = formGroup.querySelector('.form-message');
                    if(formMess){
                        formMess.innerText = errMess;
                    }
                }
            }
            return !errMess;
        }
        //xoa bo thong bao loi khi nhap dung
        function handleClearErrMess(event){
            var formGroup = getParent(event.target, '.auth-form__group');
            if(formGroup.classList.contains('invalid')){
                formGroup.classList.remove('invalid');

                var formMess = formGroup.querySelector('.form-message');
                if(formMess){
                    formMess.innerText = '';
                }
            }
        }
    }
    //xu li submit form
    formElement.onsubmit = function(event){
        event.preventDefault();

        var inputs = formElement.querySelectorAll('[name][rules]');
        var isValid = true;
        for(var input of inputs){
            if(!handleValidate({ target: input })){
                isValid = false;
            }
        }
        // Khi khong co loi thi submit form
        if(isValid){
            if(typeof _this.onSubmit === 'function'){
                var enableInputs = formElement.querySelectorAll('[name]');
                var formValues = Array.from(enableInputs).reduce(function(values,input){
                    switch(input.type){
                        case 'radio':
                            values[input.name] = formElement.querySelector('input[name="'+input.name+'"]');
                            break;
                        case 'checkbox':
                            if(!input.matches(':checked')){
                                values[input.name] = '';
                                return values;
                            }
                            if(!Array.isArray(values[input.name])){
                                values[input.name] = [];

                            }
                            values[input.name].push(input.value);
                            break;
                        case 'file':
                            values[input.name] = input.files;
                            break;
                        default:
                            values[input.name] = input.value;
                    }
                    return values;
                },{});

                _this.onSubmit(formValues);
            }
            else{
                formElement.submit();
            }
        }
        else return false;
    }
    //kiem tra co the submit hay khong
    function checkSubmit(event){
        var rules = formRules[event.target.name];
        var errMess="";
        for(var rule of rules){
            errMess = rule(event.target.value);
            if(errMess) break;
        }
        
        // Neu co loi thi hien thong bao
        if(errMess){
            return false;
        }
        else return true;
    }
    //
    var inputs1 = formElement.querySelectorAll('[name][rules]');
    var isValid1 = true;// co the kha dung khi submit hay khong
    for(var input of inputs1){
        if(!checkSubmit({ target: input })){
            isValid1 = false;
        }
    }
    return isValid1;
}