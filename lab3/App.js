import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

const App = () => {
  const [query, setQuery] = useState('');
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placeDetails, setPlaceDetails] = useState(null);
  const [show, setShow] = useState(false);
  const [safe, setSafe] = useState([])

  const fetchPlaces = async () => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
      const data = await response.json();
      setPlaces(data);
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  const fetchPlaceDetails = async (placeId) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/details?format=json&place_id=${placeId}`);
      const data = await response.json();
      setPlaceDetails(data);
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  const viewDetails = async (place) => {
    setSafe([place, ...safe])
    setSelectedPlace(place);
    await fetchPlaceDetails(place.place_id);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => viewDetails(item)} style={styles.itemContainer}>
      <Text style={styles.place}>{item.display_name}</Text>
    </TouchableOpacity>
  );

  const renderSafe = ({ item }) => (
    <TouchableOpacity onPress={() => del(item)} style={styles.itemContainer}>
      <Text style={styles.place}>{item.display_name}</Text>
    </TouchableOpacity>
  );

  const del = (item) => {
    setSafe(safe.filter((i) => i.place_id != item.place_id))
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar></StatusBar>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Поиск места"
          placeholderTextColor="#666666"
          value={query}
          onChangeText={setQuery}
        />
        <TouchableOpacity style={styles.button} onPress={fetchPlaces}>
          <Text style={styles.buttonText}>Поиск</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setShow(!show)}>
          <Text style={styles.buttonText}>{show ? 'Скрыть сохраненное' : 'Показать сохраненное'}</Text>
        </TouchableOpacity>
        {selectedPlace && (
          <TouchableOpacity onPress={() => setSelectedPlace(null)}>
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsTitle}>{selectedPlace.display_name}</Text>
              {placeDetails && (
                <View>
                  <Text style={styles.detail}>Тип: {placeDetails.type}</Text>
                  <Text style={styles.detail}>Тип OSM: {placeDetails.osm_type}: {placeDetails.osm_id}</Text>
                  <Text style={styles.detail}>Категория: {placeDetails.category}</Text>
                  <Text style={styles.detail}>Нажмите на карточку, чтобы скрыть</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
        {show ? (
          <FlatList
          data={safe}
          renderItem={renderSafe}
          keyExtractor={(item) => item.place_id.toString()}
          style={styles.list}
        />
        ) : (
          <FlatList
          data={places}
          renderItem={renderItem}
          keyExtractor={(item) => item.place_id.toString()}
          style={styles.list}
        />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  input: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
    color: '#333333',
  },
  button: {
    marginTop: 6,
    backgroundColor: '#1e90ff',
    padding: 8,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  list: {
    marginTop: 20,
    flexGrow: 0,
  },
  itemContainer: {
    marginBottom: 10,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 10,
  },
  place: {
    fontSize: 16,
    color: '#333333',
  },
  detailsContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fafafa',
    borderRadius: 8,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555555',
  },
});

export default App;
