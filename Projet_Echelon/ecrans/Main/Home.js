import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useParams } from '../../useParams';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleStop, faPlay, faRoute } from '@fortawesome/free-solid-svg-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const Home = ({route}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { fontSize, mode } = useParams();

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
      fontSize: (parseInt(fontSize) + 10),
    },
    mappingButton: {
      backgroundColor: mode ? '#FF5733' : '#C70039',
      fontSize: (parseInt(fontSize) + 14),
    },
  };

  useEffect(() => {
    if (route.params?.success){
      Toast.show({
        type: 'success',
        text1: t(route.params.success)
      });
    }
  }, [route])

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
              <FontAwesomeIcon icon={faPlay} size={parseInt(fontSize) + 10} color={mode ? '#333' : '#fff'} />
              <Text style={{ fontSize: dynamicStyles.launchButton.fontSize, color: dynamicStyles.textLabel.color }}>
                {t("Home.buttons.launch")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.mappingButton, dynamicStyles.mappingButton]}
              onPress={() => navigation.navigate('Mapping')}
            >
              <FontAwesomeIcon icon={faRoute} size={parseInt(fontSize) + 10} color={mode ? '#333' : '#fff'} />
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
              <FontAwesomeIcon icon={faCircleStop} size={parseInt(fontSize) + 10} color={mode ? '#333' : '#fff'} />
              <Text style={{ fontSize: dynamicStyles.mappingButton.fontSize, marginLeft: 10, color: dynamicStyles.textLabel.color }}>
                {t("Home.buttons.deactivate")}
              </Text>
            </TouchableOpacity>
          </>
        }
      </View>
        <Toast />
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
    flex: 1,
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
    alignItems: 'center',
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginTop: 20,
    width: 270,
  },
});
