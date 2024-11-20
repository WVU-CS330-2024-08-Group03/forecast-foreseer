$(function(){
    function showPassword(){
        if ($("#password").attr('type')==="password"){
            $("#password").attr('type', 'text');
        }
        else{
            $("#password").attr('type', 'password');
        }
    }
    $("#showPass").on("change", showPassword);
});