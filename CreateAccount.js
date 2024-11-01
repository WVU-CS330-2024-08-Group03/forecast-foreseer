$(function(){
    let date;
    let dob;
    let year;
    let month;
    let day;
    function ageCheck() {
        date = new Date();
        monthString = $("#birthDate").val().substring(5,7);
        yearString = $("#birthDate").val().substring(0,4);
        dayString = $("#birthDate").val().substring(8);
        dateString = yearString+"/"+monthString+"/"+dayString;
        dob = new Date(dateString);
        year = date.getFullYear() - dob.getFullYear();
        month = date.getMonth() - dob.getMonth();
        day = date.getDate() - dob.getDate();
        if (13>year) {
            $("#isAge").css({display: 'block'});
        }
        else if (13==year) {
            if (month<0) {
                $("#isAge").css({display: 'block'});
            }
            else if (month==0) {
                if(day<0) {
                    $("#isAge").css({display: 'block'});
                }
                else {
                    $("#isAge").css({display: 'none'});
                }
            }
            else {
                $("#isAge").css({display: 'none'});
            }
        }
        else {
            $("#isAge").css({display: 'none'});
        }
       //console.log("Birthdate changed");
    }
    $("#birthDate").on("change", ageCheck);
});