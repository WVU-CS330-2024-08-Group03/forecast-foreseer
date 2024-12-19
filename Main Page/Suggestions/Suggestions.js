$(document).ready(function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            $.ajax({
                url: `http://localhost:3000/api/currentWeather?lat=${lat}&lon=${lon}`,
                method: 'GET',
                success: function (data) {
                    console.log('Weather data received:', data); // Debug log to check the data
                    const temperature = data.temperatureF;

                    // Determine the suggestion based on temperature only
                    let suggestion = '';

                    if (temperature > 85) {
                        suggestion = "Stay hydrated and limit physical exertion to prevent overheating. Ideal for indoor activities.";
                    } else if (temperature > 60 && temperature <= 85) {
                        suggestion = "Suitable weather for most activities. Stay hydrated if outdoors for extended periods.";
                    } else if (temperature <= 60) {
                        suggestion = "Wear multiple layers, focus on thermal insulating clothing, and limit exposure to cold temperatures.";
                    } else {
                        suggestion = "Unable to provide suggestions due to missing data.";
                    }

                    // Display the suggestion
                    $('#suggestionsText').text(suggestion);
                },
                error: function (err) {
                    console.error('Error fetching weather data:', err);
                    $('#suggestionsText').text('Failed to retrieve weather data. Please try again later.');
                }
            });
        }, showError);
    } else {
        console.error("Geolocation is not supported by this browser.");
        $('#suggestionsText').text('Geolocation is not supported by this browser.');
    }
});

function showError(error) {
    console.error("Geolocation error:", error);
    $('#suggestionsText').text('Error retrieving your location.');
}
