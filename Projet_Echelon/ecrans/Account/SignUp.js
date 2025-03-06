import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView, ScrollView } from 'react-native'
import React, { useState } from 'react'
import i18next from 'i18next'
import '../../i18n'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import CustomInput from '../../composants/CustomInput'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'

const SignUp = () => {
    const { t, i18n } = useTranslation()
    const navigation = useNavigation()

    const [lastName, setLastName] = useState("")
    const [firstName, setFirstName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordC, setPasswordC] = useState("")
    const [error, setError] = useState([]);
    const [isError, setisError] = useState([]);

    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [isPasswordCVisible, setIsPasswordCVisible] = useState(false)

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(prevState => !prevState)
    }

    const togglePasswordCVisibility = () => {
        setIsPasswordCVisible(prevState => !prevState)
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
        
        setError(tempErrors);
        setisError(Object.keys(tempErrors).length === 0)

        return Object.keys(tempErrors).length === 0;
    }

    const submitForm = () => {
        if (validateForm()) {
            console.log("yess")
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
                            />

                            <CustomInput
                                label={t("InputFields.firstname")}
                                value={firstName}
                                onChangeText={(value) => onChangeText(value, setFirstName)}
                                error={error.errorFirstName}
                            />

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
                            <TouchableOpacity onPress={() => togglePasswordVisibility()} style={styles.eyeIcon1}>
                                <FontAwesomeIcon icon={isPasswordVisible ? faEye : faEyeSlash} size={24} />
                            </TouchableOpacity>

                            <CustomInput
                                label={t("InputFields.confirm_password")}
                                value={passwordC}
                                onChangeText={(value) => onChangeText(value, setPasswordC)}
                                isPassword={!isPasswordCVisible}
                                error={error.errorPasswordC}
                            />
                            <TouchableOpacity onPress={() => togglePasswordCVisibility()} style={styles.eyeIcon2}>
                                <FontAwesomeIcon icon={isPasswordCVisible ? faEye : faEyeSlash} size={24} />
                            </TouchableOpacity>
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
        fontFamily:"serif"
    },
    title: {
        fontSize: 80,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily:"serif"
    },
    title_pages: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
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
        paddingHorizontal: 20,
        paddingVertical: 10,
        margin: 20
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
    }
})