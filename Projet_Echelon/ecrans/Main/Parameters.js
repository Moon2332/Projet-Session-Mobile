import { StyleSheet, Text, View, Switch, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Dropdown } from 'react-native-element-dropdown'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import { useParams } from '../../useParams'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { faArrowUpRightFromSquare, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { logout } from '../../api/user';


const Parameters = () => {
  const { t, i18n } = useTranslation()
  const navigation = useNavigation()

  const { fontSize, mode, langue, updateFontSize, updateMode, updateLanguage } = useParams()

  const [fontS, setFontSize] = useState(fontSize.toString())
  const [modeU, setMode] = useState(mode)
  const [lang, setLangue] = useState(langue)

  const langues = [
    { value: 'en', label: t("Parameters.language.english") },
    { value: 'fr', label: t("Parameters.language.french") },
    { value: 'es', label: t("Parameters.language.spanish") }
  ]

  const polices = [
    { value: "16", label: t("Parameters.police.small") },
    { value: "22", label: t("Parameters.police.medium") },
    { value: "30", label: t("Parameters.police.large") },
  ]

  useEffect(() => {
    const stocker = async () => {
      try {
        if (modeU !== mode) {
          updateMode(modeU)
        }
        if (fontS !== fontSize.toString()) {
          updateFontSize(fontS)
        }
        if (lang !== langue) {
          updateLanguage(lang)
        }
      } catch (e) {
        console.error(t("Errors.save.save"), e);
      }
    };

    stocker()
  }, [modeU, fontS, lang, mode, fontSize, langue])


  const dynamicStyles = {
    container: {
      backgroundColor: modeU ? '#f7f7f7' : '#333',
    },
    textLabel: {
      color: modeU ? '#333' : '#fff',
    },
    dropdown: {
      borderColor: modeU ? '#ccc' : '#444',
      backgroundColor: modeU ? '#fff' : '#444',
    },
    buttonNotification: {
      borderColor: modeU ? '#ccc' : '#444',
      backgroundColor: modeU ? '#fff' : '#444',
    },
    buttonSignOut: {
      backgroundColor: modeU ? '#FF5733' : '#C70039',
    },
  }

  const signout = async () => {
    try {
      const response = await logout();
      navigation.reset({
        index:0,
        routes:[
          {
            name:'Auth',
            params:{
              screen:'Intro',
              params:{
                success: t(response.message)
              }
            }
          }
        ]
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      <View style={[styles.container, dynamicStyles.container]}>
        <View style={styles.section}>
          <Text style={[styles.textLabel, dynamicStyles.textLabel, { fontSize: (parseInt(fontS) + 4).toString() }]}>
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
            itemTextStyle={{ fontSize: fontS.toString() }}
            selectedTextStyle={{ fontSize: fontS.toString() }}
            />
        </View>

        <View style={styles.section}>
          <Text style={[styles.textLabel, dynamicStyles.textLabel, { fontSize: (parseInt(fontS) + 4).toString() }]}>
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
            itemTextStyle={{ fontSize: fontS.toString() }}
            selectedTextStyle={{ fontSize: fontS.toString() }}
          />
          <Text style={{color: 'red', fontSize: 12}}>*{t('Attention')}*</Text>
        </View>

        <View style={styles.switchSection}>
          <Text style={[styles.textLabel, dynamicStyles.textLabel, { fontSize: (parseInt(fontS) + 4).toString() }]}>
            {modeU ? t("Parameters.mode.light") : t("Parameters.mode.dark")}
          </Text>
          <Switch value={modeU} onValueChange={(newValue) => setMode(newValue)} />
        </View>

        <TouchableOpacity
          style={[styles.buttonNotification, dynamicStyles.buttonNotification]}
          onPress={() => navigation.navigate("Account")}
        >
          <Text style={{ fontSize: (parseInt(fontS) + 4).toString() }}>{t("Account.buttons.account")}</Text>
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} size={(parseInt(fontS) + 4)} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonSignOut, dynamicStyles.buttonSignOut]}
          onPress={() => signout()}
        >
          <FontAwesomeIcon icon={faRightFromBracket} size={(parseInt(fontS) + 10)} />
          <Text style={{ fontSize: (parseInt(fontS) + 4).toString(), marginLeft: 10 }}>{t("Account.buttons.signout")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Parameters

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
  },
  dropdown: {
    height: 50,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  buttonNotification: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#ccc',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 20,
    alignSelf: 'stretch'
  },
  buttonSignOut: {
    flexDirection: 'row',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: '30%',
    alignSelf: 'center',
  },
})