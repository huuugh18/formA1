$(document).ready(function(){
    $('#startDateInput').prop('min', toIsoDate(new Date())) 
})
function toIsoDate(date){
    var isoDate = date.toISOString().substring(0,10);
    return isoDate
}

function verifyFormComplete(){
    console.log('verify form run')
    // --- Name Input
    if ($('#nameInput').val()=='' || $('#nameInput').val() == null){
        alert ('Name must be filled out')
        return false;
    }
    // --- Email Input
    if ($('#emailInput').val() =='' || $('#emailInput').val() == null){ 
        alert ('Not valid e-mail address')
        return false
    }
    // --- Date Input
    if (
            $('#startDateInput').val() == '' ||
            $('#startDateInput').val() == undefined || 
            $('#endDateInput').val() == '' ||
            $('#endDateInput').val() == undefined
       ){
            alert ('Select start date and/or end date')
            return false
    }
    // --- Week 1
    if (
            $('.workoutChecksW1:checked').length !== $('.workoutChecksW1').length ||
            $('#w1d2AL').val() == null || 
            $('#w1d2AE').val() == null || 
            $('#w1d6AL').val() == null || 
            $('#w1d6AE').val() == null
        ){
            alert ('Week 1 Workouts not completed')
            return false
    }
    // --- Week 2
    if (
            $('.workoutChecksW2:checked').length !== $('.workoutChecksW2').length ||
            $('#w2d2AL').val() == null || 
            $('#w2d2AE').val() == null || 
            $('#w2d6AL').val() == null || 
            $('#w2d6AE').val() == null
        ){
            alert ('Week 2 Workouts not completed')
            return false
    }
    // --- Week 3
    if (
            $('.workoutChecksW3:checked').length !== $('.workoutChecksW3').length ||
            $('#w3d2AL').val() == null || 
            $('#w3d2AE').val() == null || 
            $('#w3d6AL').val() == null || 
            $('#w3d6AE').val() == null
        ){
            alert ('Week 3 Workouts not completed')
            return false
    }
    // --- Week 4
    if (
            $('.workoutChecksW4:checked').length !== $('.workoutChecksW4').length ||
            $('#w4d2AL').val() == null || 
            $('#w4d2AE').val() == null || 
            $('#w4d6AL').val() == null || 
            $('#w4d6AE').val() == null
        ){
            alert ('Week 4 Workouts not completed')
            return false
    }
    // --- Comment Box
    if ($('#userComment').val() == ''){
        alert ('Please comment on your program or ask questions')
        return false
    }

}
