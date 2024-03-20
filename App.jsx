import React, { useEffect, useState } from 'react';
import FontAwsomeIcon from 'react-native-vector-icons/FontAwesome5';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  Keyboard,
  ActivityIndicator,
  Platform
} from 'react-native';

const App = () => {

  const [nameCity, setNameCity] = useState('');
  const [dataApi, setDataApi] = useState('');
  const [sourceImg, setSourceImg] = useState(`http://openweathermap.org/img/wn/few clouds@2x.png`);
  const [dataNameCity, setDataNameCity] = useState('');
  const [dataWeather, setDataWeather] = useState('');
  const [dataCountryCity, setDataCountryCity] = useState('');
  const [dataTemperatureCity, setDataTemperatureCity] = useState('');
  const [message, setMessage] = useState('Informe o nome de uma cidade!');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const getDataApi = async () => {
    setLoading(true);
    Keyboard.dismiss();
    setTimeout(() => {
    if (!nameCity.trim()) {
      setMessage('Informe o nome de uma cidade!');
      setIsError(true);
        setLoading(false);
        return;
      } else {
        
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${nameCity}&units=metric&appid=6d4aba9f933494e221f0be226f2a6fe1&lang=pt_br`)
        .then((response) => {
          if (response.status === 404) {
            setMessage('Cidade não encontrada. Verifique o nome e tente novamente.');
            setIsError(true);
            setLoading(false);
          }
          response.json()
          .then((data) => {
            setDataApi(data);
            setIsError(false);
            setLoading(false);
          })
          .catch((err) => {
            console.log('erro ao obter dados', err)
          });
        })
        setNameCity('');
      }
    }, 1500);
      
    }
    
    
    
    const handleInformationContainer = () => {
    try {
      let descriptionCityCustom = dataApi.weather[0].description
      let firstLetterDescription = descriptionCityCustom[0];
      descriptionCityCustom = descriptionCityCustom.replace(firstLetterDescription, firstLetterDescription.toUpperCase())
      setDataNameCity(dataApi.name);
      setDataTemperatureCity(Math.round(dataApi.main.temp));
      setDataCountryCity(dataApi.sys.country);
      setDataWeather(descriptionCityCustom);
      setSourceImg(`http://openweathermap.org/img/wn/${dataApi.weather[0].icon}@2x.png`);

    } catch (error) {
      setMessage("Cidade não encontrada. Verifique o nome e tente novamente.");
      setIsError(true)
    }

  }

  useEffect(() => {
    if (dataApi) {
      handleInformationContainer();
    }
  })


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerInput}>
        <TextInput
          style={styles.input}
          placeholder='Digite o nome da Cidade'
          onChangeText={setNameCity}
          value={nameCity}
        />
        <TouchableOpacity style={styles.searchIcon} onPress={getDataApi}>
          <FontAwsomeIcon
            name='search'
            size={30}
          />
        </TouchableOpacity>
      </View>

      {(dataApi && !loading && !isError) &&
        <View style={styles.informationContainer}>
          <Image style={{ width: 150, height: 150 }} source={{ uri: sourceImg }} />
          <Text style={styles.textDescription}>{dataWeather}</Text>
          <Text style={styles.textCity}>{dataNameCity}, {dataCountryCity}</Text>
          <Text style={styles.textTemperature}>{dataTemperatureCity}°C</Text>
        </View>
      }

      {(isError  && !loading) &&
        <View style={styles.informationContainer}>
          <Text style={[styles.title, { color: 'red' }]}>{message}</Text>
          <FontAwsomeIcon
            name='frown'
            size={100}
            color={'red'}
          />
        </View>
      }

      {(!dataApi && !isError && !loading) &&
        <View style={styles.informationContainer}>
          <Text style={styles.title}>{message}</Text>
        </View>
      }

      {loading && <ActivityIndicator style={styles.spinner} size={Platform.OS === 'ios' ? 'large': 150} />}

    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCDCDC',
    alignItems: 'center'
  },
  informationContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: '30%',
  },
  containerInput: {
    flexDirection: 'row'
  },
  textDescription: {
    marginTop: 10,
    color: 'black',
    fontWeight: 'bold',
    fontSize: 25,
  },
  textCity: {
    color: 'black',
    fontSize: 25
  },
  textTemperature: {
    fontSize: 70,
    color: 'black',
    marginTop: 15
  },
  input: {
    width: "80%",
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
    marginTop: 10,
    fontSize: 20
  },
  searchIcon: {
    marginTop: '5%',
    marginLeft: '3%'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: "10%"
  },
  spinner: {
    marginVertical: '50%',
    width: 100
  }
});

export default App;