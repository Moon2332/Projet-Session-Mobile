import { StyleSheet, Text, View, Switch, TouchableOpacity, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Modal, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useParams } from '../../useParams';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowUpRightFromSquare, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { logout } from '../../api/user';

const Parameters = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation()

  const { fontSize, mode, langue, speedUnit, updateFontSize, updateMode, updateLanguage, updateSpeedUnit } = useParams();
  const [fontS, setFontSize] = useState(fontSize.toString());
  const [modeU, setMode] = useState(mode);
  const [lang, setLangue] = useState(langue);
  const [speed, setSpeedUnit] = useState(speedUnit);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const langues = [
    { value: 'en', label: t("Parameters.language.english") },
    { value: 'fr', label: t("Parameters.language.french") }
  ];

  const polices = [
    { value: "16", label: t("Parameters.police.small") },
    { value: "22", label: t("Parameters.police.medium") },
    { value: "30", label: t("Parameters.police.large") },
  ];

  const speedUnits = [
    { value: 'm/s', label: t("Parameters.unit.metersPerSecond") },
    { value: 'km/h', label: t("Parameters.unit.kilometersPerHour") },
  ];

  useEffect(() => {
    const stocker = async () => {
      try {
        if (modeU !== mode) {
          updateMode(modeU);
        }
        if (fontS !== fontSize.toString()) {
          updateFontSize(fontS);
        }
        if (lang !== langue) {
          updateLanguage(lang);
        }
        if (speed !== speedUnit) {
          updateSpeedUnit(speed);
        }
      } catch (e) {
        console.error(t("Errors.save.save"), e);
      }
    };

    stocker();
  }, [modeU, fontS, lang, speed]);

  const dynamicStyles = {
    container: {
      backgroundColor: modeU ? '#f0f4f8' : '#181818',
    },
    textLabel: {
      color: modeU ? '#2f3640' : '#ecf0f1',
    },
    dropdown: {
      borderColor: modeU ? '#dfe4ea' : '#7f8c8d',
      backgroundColor: modeU ? '#ffffff' : '#34495e',
    },
    buttonNotification: {
      borderColor: modeU ? '#dfe4ea' : '#7f8c8d',
      backgroundColor: modeU ? '#4cd137' : '#e74c3c',
    },
    buttonSignOut: {
      backgroundColor: modeU ? '#ff9f43' : '#e74c3c',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: mode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
    },
    modalContent: {
      width: '90%',
      padding: 20,
      backgroundColor: mode ? '#2F2F2F' : '#FFFFFF',
      borderRadius: 35,
      elevation: 5,
      shadowColor: mode ? '#fff' : '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10,
    },
    button: {
      backgroundColor: modeU ? '#FF5733' : '#33FF57',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      margin: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: modeU ? '#FFFFFF' : '#000000',
      fontSize: 16,
      fontWeight: 'bold',
    },
  };

  const signout = async () => {
    try {
      const response = await logout();
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Auth',
            params: {
              screen: 'Intro',
              params: {
                success: t(response.message),
              },
            },
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? "padding" : 'height'}
      style={[styles.container, dynamicStyles.container]}
    >
      <ScrollView style={styles.scrollview}>
        <SafeAreaView>
          <View style={styles.containerView}>
            <View style={styles.section}>
              <Text style={[styles.textLabel, dynamicStyles.textLabel, { fontSize: parseInt(fontS) + 4 }]}>
                {t("Parameters.label.police")}
              </Text>
              <Dropdown
                data={polices}
                maxHeight={300}
                labelField="label"
                valueField="value"
                value={fontS}
                onChange={item => setFontSize(item.value)}
                style={[styles.dropdown, dynamicStyles.dropdown]}
                itemTextStyle={{ fontSize: parseInt(fontS) }}
                selectedTextStyle={{ fontSize: parseInt(fontS) }}
              />
            </View>

            <View style={styles.section}>
              <Text style={[styles.textLabel, dynamicStyles.textLabel, { fontSize: parseInt(fontS) + 4 }]}>
                {t("Parameters.label.language")}
              </Text>
              <Dropdown
                data={langues}
                maxHeight={300}
                labelField="label"
                valueField="value"
                value={lang}
                onChange={item => setLangue(item.value)}
                style={[styles.dropdown, dynamicStyles.dropdown]}
                itemTextStyle={{ fontSize: parseInt(fontS) }}
                selectedTextStyle={{ fontSize: parseInt(fontS) }}
              />
              {/* <Text style={{ color: 'red', fontSize: 12 }}>*{t('Attention')}*</Text> */}
            </View>

            <View style={styles.section}>
              <Text style={[styles.textLabel, dynamicStyles.textLabel, { fontSize: parseInt(fontS) + 4 }]}>
                {t("Parameters.label.unit")}
              </Text>
              <Dropdown
                data={speedUnits}
                maxHeight={300}
                labelField="label"
                valueField="value"
                value={speed}
                onChange={item => setSpeedUnit(item.value)}
                style={[styles.dropdown, dynamicStyles.dropdown]}
                itemTextStyle={{ fontSize: parseInt(fontS) }}
                selectedTextStyle={{ fontSize: parseInt(fontS) }}
              />
            </View>


            <View style={styles.switchSection}>
              <Text style={[styles.textLabel, dynamicStyles.textLabel, { fontSize: parseInt(fontS) + 4 }]}>
                {modeU ? t("Parameters.mode.light") : t("Parameters.mode.dark")}
              </Text>
              <Switch value={modeU} onValueChange={(newValue) => setMode(newValue)} />
            </View>

            <TouchableOpacity
              style={[styles.buttonNotification, dynamicStyles.buttonNotification]}
              onPress={() => navigation.navigate("Account")}
            >
              <Text style={{ fontSize: parseInt(fontS) + 4 }}>{t("Account.buttons.account")}</Text>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} size={parseInt(fontS) + 4} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.buttonSignOut, dynamicStyles.buttonSignOut]}
              onPress={() => setIsModalVisible(true)}
            >
              <FontAwesomeIcon icon={faRightFromBracket} size={parseInt(fontS) + 10} />
              <Text style={{ fontSize: parseInt(fontS) + 4, marginLeft: 10 }}>
                {t("Account.buttons.signout")}
              </Text>
            </TouchableOpacity>
          </View>

          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setIsModalVisible(false)}
          >
            <View style={dynamicStyles.modalContainer}>
              <View style={dynamicStyles.modalContent}>
                <Text style={{ fontSize: 18 }}>{t("Account.logout")}</Text>
                <View style={dynamicStyles.modalButtons}>
                  <TouchableOpacity
                    style={dynamicStyles.button}
                    onPress={() => setIsModalVisible(false)}
                  >
                    <Text style={dynamicStyles.buttonText}>{t("Account.buttons.no")}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={dynamicStyles.button}
                    onPress={() => signout()}
                  >
                    <Text style={dynamicStyles.buttonText}>{t("Account.buttons.yes")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Parameters;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollview: {
    padding: 10,
  },
  containerView: {
    paddingHorizontal: 10,
    justifyContent: "center",
    alignContent: "center",
    paddingVertical: '10%'
  },
  section: {
    marginBottom: 20,
  },
  switchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  textLabel: {
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
    fontFamily: "serif",
  },
  dropdown: {
    height: 50,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#cccccc',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  buttonNotification: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#cccccc',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 20,
    alignSelf: 'stretch',
  },
  buttonSignOut: {
    flexDirection: 'row',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: '25%',
    alignSelf: 'center',
  },
});
