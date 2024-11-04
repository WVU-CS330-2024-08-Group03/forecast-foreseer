$(function(){
    /**
     * Variables for date, dob (Date of Birth), year, month, and day
     * comparisons between date and dob. Also creates variables for month, year, and day strings
     */
    let date;
    let dob;
    let year;
    let month;
    let day;
    let monthString;
    let yearString;
    let dayString;
    let meetsAge = false;

    /**
     * Checks age of user. Compares year to wanted age. Gets more sepcific, if values == a given.
     * Checks month if year is equal, checks day if month is equal.
     */
    function ageCheck() {
        //Stores a date into the date variable
        date = new Date();
        //Gets substring of birth date input
        monthString = $("#birthDate").val().substring(5,7);
        //Gets substring of birth date input
        yearString = $("#birthDate").val().substring(0,4);
        //
        dayString = $("#birthDate").val().substring(8);
        dateString = yearString+"/"+monthString+"/"+dayString;
        dob = new Date(dateString);
        year = date.getFullYear() - dob.getFullYear();
        month = date.getMonth() - dob.getMonth();
        day = date.getDate() - dob.getDate();
        if (13>year) {
            $("#isAge").css({display: 'block'});
            meetsAge = false;
        }
        else if (13==year) {
            if (month<0) {
                $("#isAge").css({display: 'block'});
                meetsAge = false;
            }
            else if (month==0) {
                if(day<0) {
                    $("#isAge").css({display: 'block'});
                    meetsAge=false;
                }
                else {
                    $("#isAge").css({display: 'none'});
                    meetsAge=true;
                }
            }
            else {
                $("#isAge").css({display: 'none'});
                meetsAge=true;
            }
        }
        else {
            $("#isAge").css({display: 'none'});
            meetsAge=true;
        }
       //console.log("Birthdate changed");
    }
    $("#birthDate").on("change", ageCheck);
    

    $("#userInfoForm").on("submit", function(){
        if (meetsAge==false){
            console.log("Form failed to submit")
            event.preventDefault();
        }
    });
});