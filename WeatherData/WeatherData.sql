CREATE TABLE WeatherData (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Location NVARCHAR(100),
    Temperature FLOAT,
    WeatherDescription NVARCHAR(100),
    Precipitation FLOAT,
    Humidity INT,
    UVIndex INT,
    WindSpeed FLOAT,
    Timestamp DATETIME
);