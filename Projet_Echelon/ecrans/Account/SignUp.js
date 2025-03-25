import { Platform, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, ScrollView, Switch } from 'react-native'
import React, { useState } from 'react'
import '../../i18n'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import CustomInput from '../../composants/CustomInput'
import { SafeAreaView } from 'react-native-safe-area-context'
import { signup, login } from '../../api/user'

const SignUp = () => {
    const { t } = useTranslation()
    const navigation = useNavigation()

    const [lastName, setLastName] = useState("")
    const [firstName, setFirstName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordC, setPasswordC] = useState("")
    const [session, setSession] = useState(false)
    const [error, setError] = useState([]);
    const [isError, setIsError] = useState(false);

    const [isPasswordVisible, setIsPasswordVisible] = useState(true)
    const [isPasswordCVisible, setIsPasswordCVisible] = useState(true)
    const [isLoading, setIsLoading] = useState(false);


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

        const validatePassword = (password) => {
            if (password.length < 8) {
                return t("Errors.password_constraints.greater_than_8");
            }
            if (!/[A-Z]/.test(password)) {
                return t("Errors.password_constraints.upper_case");
            }
            if (!/[a-z]/.test(password)) {
                return t("Errors.password_constraints.lower_case");
            }
            if (!/\d/.test(password)) {
                return t("Errors.password_constraints.number");
            }
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                return t("Errors.password_constraints.special_caracter");
            }

            return '';
        };

        if (lastName === "")
            tempErrors.errorLastName = t('Errors.required_fields.lastname');
        if (firstName === "")
            tempErrors.errorFirstName = t('Errors.required_fields.firstname');
        if (email === "")
            tempErrors.errorEmail = t('Errors.required_fields.email.empty');
        else if (!validateEmail(email))
            tempErrors.errorEmail = t('Errors.required_fields.email.invalid');
        if (password === "")
            tempErrors.errorPassword = t('Errors.required_fields.password');
        else if (validatePassword(password) !== '')
            tempErrors.errorPassword = validatePassword(password);
        if (passwordC === "")
            tempErrors.errorPasswordC = t('Errors.required_fields.confirm_password');
        else if (password !== passwordC)
            tempErrors.errorPasswordC = t('Errors.password_constraints.mismatch');

        setError(tempErrors)
        setIsError(Object.keys(tempErrors).length === 0)

        return Object.keys(tempErrors).length === 0;
    }

    const submitForm = async () => {
        if (validateForm()) {
            setIsLoading(true)
            try {
                const response = await signup(email, firstName, lastName, password)
                await login(email, password, session);
                navigation.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'Menu',
                            params: {
                                screen: 'Home',
                                params: {
                                    success: response.message
                                }
                            }
                        }
                    ]
                })
            } catch (error) {
                const parsedData = JSON.parse(error.message);
                Toast.show({
                    type: 'error',
                    text1: t(parsedData.message),
                    text2: t(parsedData.message2)
                });
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? "padding" : 'height'}
            style={styles.container}
        >
            <ScrollView style={styles.scrollview}>
                <SafeAreaView>
                    <View style={styles.containerView}>
                        <Text style={styles.title_pages}>{t('titles_pages.create')}</Text>
                        <View style={styles.inputContainer}>
                            <CustomInput
                                label={t("InputFields.lastname")}
                                value={lastName}
                                onChangeText={(value) => onChangeText(value, setLastName)}
                                error={error.errorLastName}
                                fontSize={16}
                            />

                            <CustomInput
                                label={t("InputFields.firstname")}
                                value={firstName}
                                onChangeText={(value) => onChangeText(value, setFirstName)}
                                error={error.errorFirstName}
                                fontSize={16}
                            />

                            <CustomInput
                                label={t("InputFields.email")}
                                value={email}
                                onChangeText={(value) => onChangeText(value, setEmail)}
                                keyboardType='email-address'
                                error={error.errorEmail}
                                fontSize={16}
                            />

                            <CustomInput
                                label={t("InputFields.password")}
                                value={password}
                                onChangeText={(value) => onChangeText(value, setPassword)}
                                error={error.errorPassword}
                                toggleVisibility={() => setIsPasswordVisible(!isPasswordVisible)}
                                isPassword={isPasswordVisible}
                                showEyeIcon={true}
                                fontSize={16}
                            />

                            <CustomInput
                                label={t("InputFields.confirm_password")}
                                value={passwordC}
                                onChangeText={(value) => onChangeText(value, setPasswordC)}
                                error={error.errorPasswordC}
                                fontSize={16}
                                toggleVisibility={() => setIsPasswordCVisible(!isPasswordCVisible)}
                                isPassword={isPasswordCVisible}
                                showEyeIcon={true}
                            />
                            <View style={styles.switchSection}>
                                <Text style={{ fontSize: 16 }}>{t("InputFields.session")}</Text>
                                <Switch value={session} onValueChange={(newValue) => setSession(newValue)} />
                            </View>
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => navigation.goBack()}
                            >
                                <Text style={styles.txtButton}>{t("Account.buttons.return")}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => submitForm()}
                            >
                                <Text style={styles.txtButton}>{t("Account.buttons.create")} !</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {
          isLoading && (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#FF6347" />
            </View>
          )
        }
                </SafeAreaView>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default SignUp

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollview: {
        padding: 10
    },
    containerView: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10
    },
    inputContainer: {
        justifyContent: "center",
        fontFamily: "serif",
        width: '90%',
    },
    title: {
        fontSize: 80,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: "serif"
    },
    title_pages: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        fontFamily: "serif"
    },
    subtitle: {
        fontSize: 30,
        textAlign: 'center',
        fontFamily: "serif"
    },
    image: {
        height: 300,
        width: 300
    },
    switchSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 20,
        marginBottom: 5,
    },
    button: {
        borderWidth: 2,
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        margin: 20
    },
    txtButton: {
        fontSize: 20,
        fontFamily: "serif"
    },
    noAccountRow: {
        flexDirection: 'row'
    },
    txtNoAccount: {
        color: 'blue',
        borderBottomWidth: 1,
        fontFamily: "serif"
    },
    eyeIcon1: {
        position: 'absolute',
        right: 5,
        top: '66%',
        padding: 10,
    },
    eyeIcon2: {
        position: 'absolute',
        right: 5,
        top: '86%',
        padding: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    loading: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      }
})