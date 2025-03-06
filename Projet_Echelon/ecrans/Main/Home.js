import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useParams } from '../../useParams';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleStop, faPlay, faRoute } from '@fortawesome/free-solid-svg-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { fontSize, mode, langue } = useParams();

  const [isActivated, setIsActivated] = useState(false);

  const dynamicStyles = {
    container: {
      backgroundColor: mode ? '#f7f7f7' : '#333',
    },
    textLabel: {
      color: mode ? '#333' : '#fff',
    },
    launchButton: {
      backgroundColor: mode ? '#33FF57' : '#3ACF29',
      fontSize: parseInt(fontSize) + 10, // Convert fontSize to a number
    },
    mappingButton: {
      backgroundColor: mode ? '#FF5733' : '#C70039',
      fontSize: parseInt(fontSize) + 14, // Convert fontSize to a number
    },
  };

  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      <View style={styles.containerView}>
        { 
          !isActivated &&
          <>
            <Image source={require("../../assets/R.png")} style={styles.image} />
            
            <TouchableOpacity
              style={[styles.launchButton, dynamicStyles.launchButton]}
              onPress={() => setIsActivated(true)}
            >
              <FontAwesomeIcon icon={faPlay} size={35} color={mode ? '#333' : '#fff'} />
              <Text style={{ fontSize: dynamicStyles.launchButton.fontSize, color: dynamicStyles.textLabel.color }}>
                {t("Home.buttons.launch")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.mappingButton, dynamicStyles.mappingButton]}
              onPress={() => navigation.navigate('Mapping')}
            >
              <FontAwesomeIcon icon={faRoute} size={35} color={mode ? '#333' : '#fff'} />
              <Text style={{ fontSize: dynamicStyles.mappingButton.fontSize, marginLeft: 10, color: dynamicStyles.textLabel.color }}>
                {t("Home.buttons.mapping")}
              </Text>
            </TouchableOpacity>
          </>
        }

        { 
          isActivated &&
          <>
            <Text style={styles.title}>{ t("Home.title.activated")}</Text>
            <Image source={require("../../assets/R.png")} style={styles.image} />

            <TouchableOpacity
              style={[styles.launchButton, dynamicStyles.mappingButton]}
              onPress={() => setIsActivated(false)}
            >
              <FontAwesomeIcon icon={faCircleStop} size={35} color={mode ? '#333' : '#fff'} />
              <Text style={{ fontSize: dynamicStyles.mappingButton.fontSize, marginLeft: 10, color: dynamicStyles.textLabel.color }}>
                {t("Home.buttons.deactivate")}
              </Text>
            </TouchableOpacity>
          </>
        }
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  containerView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 50,
    marginBottom: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily:"serif"
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 30,
  },
  launchButton: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderColor: '#ccc',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginTop: 20,
    width: 270,
  },
  mappingButton: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    paddingVertical: 40,
    marginTop: 20,
    width: 270,
  },
});
