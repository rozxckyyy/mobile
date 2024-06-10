import React, { useState} from 'react';
import { StyleSheet, Text, View, TextInput, Button, SafeAreaView, StatusBar, FlatList, TouchableOpacity} from 'react-native';
import axios from 'axios';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState(null);
  const [show, setShow] = useState(false)
  const [safeProducts, setSafeProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFoodData = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`https://api.edamam.com/api/food-database/v2/parser?ingr=${searchQuery}&app_id=35f1bd2d&app_key=e389fde7aa464f0d22ccd6500e9cbcde`);
      if (response.data.hints.lenght > 0) {
        setProducts(response.data);
      }
      setLoading(false)
    } catch (error) {
      console.error('error:', error);
      setLoading(false)
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.productItem}>
      <Text>{item.label}</Text>
      <Text>Calories: {item.nutrients.ENERC_KCAL}</Text>
      <Text>Nutritional Value: {item.nutrients.PROCNT}</Text>
      <Text>Fats: {item.nutrients.FAT}</Text>
      <Text>Carbohydrates: {item.nutrients.CHOCDF}</Text>
    </View>
  )

  const showSafeProducts = () => {
    if (show) {
      return (
          <FlatList
          data={safeProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item.foodId}
          style={styles.list}
        />
      )
    }
  }

  const renderProductItem = () => {
    if (products) {
      return (
        <TouchableOpacity style={styles.productItem} onPress={() => addSafe(products.hints[0].food)}>
          <Text>{products.hints[0].food.label}</Text>
          <Text>Calories: {products.hints[0].food.nutrients.ENERC_KCAL}</Text>
          <Text>Nutritional Value: {products.hints[0].food.nutrients.PROCNT}</Text>
          <Text>Fats: {products.hints[0].food.nutrients.FAT}</Text>
          <Text>Carbohydrates: {products.hints[0].food.nutrients.CHOCDF}</Text>
        </TouchableOpacity>
      )
    }
  };

  const addSafe = (item) => {
    setSafeProducts([item, ...safeProducts]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar></StatusBar>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
        <Button title="Search" onPress={fetchFoodData} />

        <Button title={show ? 'Close safe' : 'Open safe'} onPress={() => setShow(!show)}/>

        <Button title="Remove all safe" onPress={() => setSafeProducts([])}/>
      
        {show ? showSafeProducts() : renderProductItem()}

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    marginBottom: 16,
    borderRadius: 5,
  },
  productItem: {
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  list: {
    height: '100%'
  }
});

export default App;