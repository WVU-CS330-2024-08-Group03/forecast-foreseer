$(function(){
    /**
     * Variables for date, dob (Date of Birth), year, month, and day
     * comparisons between date and dob. Also creates variables for month, year, and day strings
     */
    let date = new Date();
    let dob;
    let year;
    let month;
    let day;
    let monthString;
    let yearString;
    let dayString;
    let meetsAge = false;
    let minAge = 13;

    /**
     * Determines minimum date (date furthest in the past, 1920 is further than 1950) allowed to be
     * entered into the field. Arbitralily 150 years before the current date. Also creates variables
     * that hold the information for the current date.
     */
    let curYear = date.getFullYear();
    let curMonth = date.getMonth();
    let curDay = date.getDate();
    let minMonth = curMonth+1;
    let minDate = curYear-150+"-"+minMonth+"-"+curDay;
    let dateString;
    $("#birthDate").attr("min", minDate);

    /**
     * Variables for password and username verification. Includes regular expressions to determine what
     * characters are currently in the inputs, to determine if the username/password are valid
     */
    let passInput;
    let passValid = false;
    let usernameInput;
    let usernameValid = false;
    let regExp1 = /[a-z]/;
    let regExp2 = /[A-Z]/;
    let regExp3 = /[!-/]+|[:-@]+|[[-`]+|[{-~]+/;
    let regExp4 = /[0-9]/;
    let regExp5 = /\s|[!-']|\/|[:-@]|[[-^]|`|[{-~]/;

    /**
     * Checks age of user. Compares year to wanted age. Gets more specific, if values == a given.
     * Checks month if year is equal, checks day if month is equal.
     */
    function ageCheck() {
        //Gets substring of birth date input
        monthString = $("#birthDate").val().substring(5,7);

        //Gets substring of birth date input
        yearString = $("#birthDate").val().substring(0,4);

        //Gets substring of birth date input
        dayString = $("#birthDate").val().substring(8);

        //Puts substrings together to get date in format yyyy/mm/dd
        dateString = yearString+"/"+monthString+"/"+dayString;

        //Creates new date using the dateString value
        dob = new Date(dateString);

        //Determine age using current date and birth date
        year = curYear - dob.getFullYear();
        month = curMonth - dob.getMonth();
        day = curDay - dob.getDate();

        /**
         * The following if statements determine if the input birth date is valid. If the year
         * does not meet the requirements, it falls to the month, then the day. Displays message
         * if user does not meet the minimum age, else user birth date is valid.
         */
        if (minAge>year) {
            $("#isAge").css({display: 'block'});
            meetsAge = false;
        }
        else if (minAge==year) {
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
    }
    $("#birthDate").on("change", ageCheck);
    
    /**
     * Checks if the password meets all requirements. Compares input characters to see if it has
     * at least one symbol, uppercase, lowercase, and number by using regExp1 through regExp4.
     * Displays messages detailing what is missing.
     */
    function checkPassword(){
        passInput = $("#password").val();
        if(regExp1.test(passInput) && regExp2.test(passInput)){
            $("#missLetter").css({display: 'none'})
        }
        else {
            $("#missLetter").css({display: 'block'})
        }

        if (regExp3.test(passInput)){
            $("#missSymbol").css({display: 'none'})
        }
        else {
            $("#missSymbol").css({display: 'block'})
        }

        if (regExp4.test(passInput)){
            $("#missNumber").css({display: 'none'})
        }
        else {
            $("#missNumber").css({display: 'block'})
        }

        if(regExp1.test(passInput)&&regExp2.test(passInput)&&regExp3.test(passInput)&&regExp4.test(passInput)){
            passValid=true;
        }
        else{
            passValid=false;
        }
    }
    $("#password").on("input", checkPassword);

    /**
     * Toggles the visibility of the password. Changes the password input field
     * between type password and type text to toggle visibility.
     */
    function showPassword(){
        if ($("#password").attr('type')==="password"){
            $("#password").attr('type', 'text');
        }
        else{
            $("#password").attr('type', 'password');
        }
    }
    $("#showPass").on("change", showPassword);

    /**
     * Checks if the username is valid. Uses regExp5 to determine if the username contains any white
     * space characters or special characters other than - . and _
     */
    function checkUsername(){
        usernameInput = $("#username").val();
        if (regExp5.test(usernameInput)){
            $("#badChars").css({display: 'block'});
            usernameValid = false;
        }
        else{
            $("#badChars").css({display: 'none'});
            usernameValid = true;
        }
    }
    $("#username").on("input", checkUsername);

    /**
     * When the user tries to submit the form, checks if age, password, and username are valid.
     * If any of these are not valid, the form does not submit.
     */
    $("#userInfoForm").on("submit", function(){
        if (meetsAge==false || passValid==false || usernameValid==false){
            console.log("Form failed to submit");
            event.preventDefault();
        }

        if (usernameValid==false){
            console.log("Form failed to submit");
            event.preventDefault();
        }
    });
});