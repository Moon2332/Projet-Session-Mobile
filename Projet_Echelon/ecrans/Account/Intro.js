import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import '../../i18n'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import CustomInput from '../../composants/CustomInput'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import { login } from '../../api/user';
import Toast from 'react-native-toast-message';

const Intro = ({route}) => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const [visible, setVisible] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState([]);
  const [isError, setIsError] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prevState => !prevState)
  }

  const onChangeText = (value, setInput) => {
    setInput(value);

    if (isError)
      validateForm();
  }

  const validateForm = () => {
    let tempErrors = [];

    const validateEmail = (email) => {
      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      return regex.test(email);
    };

    if (email === "")
      tempErrors.errorEmail = t('Errors.required_fields.email.empty');
    else if (!validateEmail(email))
      tempErrors.errorEmail = t('Errors.required_fields.email.invalid');

    if (password === "")
      tempErrors.errorPassword = t('Errors.required_fields.password');


    setError(tempErrors);
    setIsError(Object.keys(tempErrors).length === 0)

    return Object.keys(tempErrors).length === 0;
  }

  const submitForm = async () => {
    if (validateForm()) {
      try {
            const response = await login(email, password);
            navigation.reset({
              index:0,
              routes:[
                {
                  name:'Menu',
                  params:{screen:'Home'}
                }
              ]
            })
            Toast.show({
              type: 'success',
              text1: t(response.message)
            });
      } catch (error) {
        console.log("Error - " + error)
        const parsedData = JSON.parse(error.message);
        Toast.show({
          type: 'error',
          text1: t(parsedData.message),
          text2: t(parsedData.message2)
        });
      }
    }
  }

  useEffect(() => {
    if(route.params) {
      if(route.params.success) {
        Toast.show({
          type: 'success',
          text1: route.params.success,
        });
      }
    }
  }, [ route ])

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.containerView, !visible && { justifyContent: 'center' }]}>
        {
          visible &&
          <>
            <View>
              <Text style={styles.title}>ECHELON</Text>
              <Text style={styles.subtitle}>{t('subtitle')}</Text>
            </View>

            <Image source={require("../../assets/Cam.png")} style={styles.image} />

            <TouchableOpacity
              style={styles.button}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.txtButton}>{t("Account.buttons.start")}</Text>
            </TouchableOpacity>
          </>
        }

        {
          !visible &&
          <>
            <Text style={styles.title_pages}>{t('titles_pages.authentification')}</Text>

            <View style={styles.inputContainer}>
              <CustomInput
                label={t("InputFields.email")}
                value={email}
                onChangeText={(value) => onChangeText(value, setEmail)}
                keyboardType='email-address'
                error={error.errorEmail}
              />

              <CustomInput
                label={t("InputFields.password")}
                value={password}
                onChangeText={(value) => onChangeText(value, setPassword)}
                isPassword={!isPasswordVisible}
                error={error.errorPassword}
              />
              <TouchableOpacity onPress={() => togglePasswordVisibility()} style={styles.eyeIcon}>
                <FontAwesomeIcon icon={isPasswordVisible ? faEye : faEyeSlash} size={24} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => submitForm()}
            >
              <Text style={styles.txtButton}>{t("Account.buttons.signin")}</Text>
            </TouchableOpacity>

            <View style={styles.noAccountRow}>
              <Text>{t("Account.no_account")} ? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("SignUp")}
              >
                <Text style={styles.txtNoAccount}>{t("Account.buttons.create_account")}!</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        <Toast />
      </View>
      
    </SafeAreaView>
  )
}

export default Intro

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    padding: 10
  },
  inputContainer: {
    justifyContent: "center",
    fontFamily:"serif",
    width: '80%',
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily:"serif"
  },
  title_pages: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
    fontFamily:"serif"
  },
  subtitle: {
    fontSize: 30,
    textAlign: 'center',
    fontFamily:"serif"
  },
  image: {
    height: 300,
    width: 300
  },
  button: {
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 50,
    paddingVertical: 20,
    marginTop: 20,
    marginBottom: 20
  },
  txtButton: {
    fontSize: 20,
    fontFamily:"serif"
  },
  noAccountRow: {
    flexDirection: 'row'
  },
  txtNoAccount: {
    color: 'blue',
    borderBottomWidth: 1,
    fontFamily:"serif"
  },
  eyeIcon: {
    position: 'absolute',
    right: 5,
    top: '65%',
    padding: 10,
},
})