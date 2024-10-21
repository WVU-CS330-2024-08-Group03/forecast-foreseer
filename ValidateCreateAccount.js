function ageCount() {
    let date = new Date();
    let dob = document.getElementById("birthDate");
    let year = date.getFullYear() - dob.getFullYear();
    let month = date.getMonth() - dob.getMonth();
    let day = date.getDay() - dob.getDay();
    let ageInDays = year * 365 + month * 30 + day;
    const minAge = 4745;
    if (minAge > ageInDays) {
        $("#isAge").removeClass("notVisible");
    }
}