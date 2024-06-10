import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, SafeAreaView, FlatList } from 'react-native';
import axios from 'axios';

const WeatherApp = () => {
  const [location, setLocation] = useState({ lat: 51.5085, lon: -0.1257 });
  const [weatherData, setWeatherData] = useState(null);
  const [weatherNextData, setWeatherNextData] = useState(null);
  const [icon, setIcon] = useState(null);
  const apiKey = '820c40edd20e547b89c46200a500f6a2';

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&cnt=5&appid=${apiKey}&units=metric`)
      .then(response => {
        setWeatherNextData(response.data.list);
      })
      .catch(error => {
        console.log(error);
      });
  }, [location]);

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&cnt=5&appid=${apiKey}&units=metric`)
      .then(response => {
        setWeatherData(response.data);
        setIcon(response.data.weather[0].icon);
      })
      .catch(error => {
        console.log(error);
      });
  }, [location]);

  const handleLocationChange = (newLocation) => {
    const locations = {
      London: { lat: 51.5085, lon: -0.1257 },
      Paris: { lat: 48.8534, lon: 2.3488 },
      NewYork: { lat: 40.7143, lon: -74.006 },
      Tokyo: { lat: 35.6895, lon: 139.6917 },
      Sydney: { lat: -33.8679, lon: 151.2073 }
    };
    setLocation(locations[newLocation]);
  };

  const ItemWeather = ({ data }) => (
    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
      <Text>Date: {data.dt_txt}</Text>
      <Text>Temperature: {data.main.temp} °C</Text>
      <Text>Humidity: {data.main.humidity}%</Text>
      <Text>Wind Speed: {data.wind.speed} m/s</Text>
    </View>
  );

  const WeatherListData = () => (
    <SafeAreaView>
      <FlatList
        data={weatherNextData}
        renderItem={({ item }) => <ItemWeather data={item} />}
        keyExtractor={item => item.dt_txt}
      />
    </SafeAreaView>
  );
  
  return (
    <SafeAreaView style={{ flex: 1, padding: 10 }}>
      <StatusBar />
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 20 }}>Current weather in {weatherData?.name}</Text>
        <Text style={{ fontSize: 18 }}>Temperature: {weatherData?.main?.temp} °C</Text>
        <Text style={{ fontSize: 18 }}>Humidity: {weatherData?.main?.humidity}%</Text>
        <Text style={{ fontSize: 18 }}>Wind Speed: {weatherData?.wind?.speed} m/s</Text>
      </View>
      <WeatherListData />
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
        <TouchableOpacity onPress={() => handleLocationChange('London')}>
          <Text style={{ fontSize: 16 }}>London</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleLocationChange('Paris')}>
          <Text style={{ fontSize: 16 }}>Paris</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleLocationChange('NewYork')}>
          <Text style={{ fontSize: 16 }}>New York</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleLocationChange('Tokyo')}>
          <Text style={{ fontSize: 16 }}>Tokyo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleLocationChange('Sydney')}>
          <Text style={{ fontSize: 16 }}>Sydney</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WeatherApp;