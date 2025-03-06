import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import i18next from 'i18next'
import '../../i18n'
import { useParams } from '../../useParams'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import CustomInput from '../../composants/CustomInput'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons'
import { deleteUserInfo, getUserInfo, saveUserInfo } from "../../api/secureStore";
import { update, deleteUser, updatePassword } from '../../api/user'
import { faArrowLeft, faFloppyDisk, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons/faTrashCan'
import Toast from 'react-native-toast-message';
import CustomModal from '../../composants/CustomModal'
import AlertModal from '../../composants/AlertModal'

const Account = () => {
    const { t, i18n } = useTranslation()
    const navigation = useNavigation()
    const { fontSize, mode, langue } = useParams();

    const [id, setID] = useState("")
    const [lastName, setLastName] = useState("")
    const [firstName, setFirstName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordA, setPasswordA] = useState("")
    const [passwordC, setPasswordC] = useState("")
    const [error, setError] = useState([]);
    const [visible, setVisible] = useState([]);
    const [visibleAlert, setVisibleAlert] = useState([]);
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

        if (lastName === "")
            tempErrors.errorLastName = t('Errors.required_fields.lastname');
        if (firstName === "")
            tempErrors.errorFirstName = t('Errors.required_fields.firstname');
        if (email === "")
            tempErrors.errorEmail = t('Errors.required_fields.email.empty');
        else if (!validateEmail(email))
            tempErrors.errorEmail = t('Errors.required_fields.email.invalid');

        setError(tempErrors);
        setisError(Object.keys(tempErrors).length === 0)

        return Object.keys(tempErrors).length === 0;
    }

    const validateFormPassword = () => {
        let tempErrors = [];

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

        if (passwordA === "")
            tempErrors.errorPasswordA = t('Errors.required_fields.password');
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

    const edit = async () => {
        const user = await getUserInfo();

        try {
            if(email != user.email || firstName != user.firstname || lastName != user.lastname) {
                if (validateForm()){
                    const response = await update(id, lastName, firstName, email)
                    setFirstName(response.user.firstname)
                    setLastName(response.user.lastname)
                    setEmail(response.user.email)
                    
                    Toast.show({
                        type: 'success',
                        text1: t(response.message)
                    });
                }
            } else {
                Toast.show({
                    type: 'info',
                    text1: t('Messages.no_changes')
                  });
            }
        } catch (error) {
            console.log(error)
            Toast.show({
                type: 'error',
                text2: t(error.message)
              });
        }
    }

    const editPassword = async () => {
        try {
            if (validateFormPassword()){
                const response = await updatePassword(passwordA, password, passwordC)
                
                Toast.show({
                    type: 'success',
                    text1: t(response.message)
                });

                setVisible(false)
            }
        } catch (error) {
            console.log(error)
            Toast.show({
                type: 'error',
                text2: t(error.message)
              });
        }
    }

    const drop = async () => {
        try {
            const response = await deleteUser()
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
            Toast.show({
                type: 'error',
                text1: t(error.message)
              });
        }
    }

    useEffect(() => {
        const getUser = async () => {
            const user = await getUserInfo()
            setID(user.id)
            setFirstName(user.firstname)
            setLastName(user.lastname)
            setEmail(user.email)
        }

        getUser()
    }, [])

    const dynamicStyles = {
        container: {
          backgroundColor: mode ? '#f7f7f7' : '#333',
        },
        textLabel: {
          color: mode ? '#333' : '#fff',
        },
        launchButton: {
          backgroundColor: mode ? '#33FF57' : '#3ACF29',
          fontSize: (parseInt(fontSize) + 10).toString(),
        },
        mappingButton: {
          backgroundColor: mode ? '#FF5733' : '#C70039',
          fontSize: (parseInt(fontSize) + 14).toString(),
        },
    };

    return (
        <SafeAreaView style={[styles.container, dynamicStyles.container]}>
            <View style={styles.containerView}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <FontAwesomeIcon icon={faArrowLeft} size={(parseInt(fontSize))} />
                </TouchableOpacity>
                <Text style={[styles.title_pages, , { fontSize: (parseInt(fontSize) + 10).toString() }]}>{t('Account.buttons.account')}</Text>

                <CustomInput
                    label={t("InputFields.lastname")}
                    value={lastName}
                    onChangeText={(value) => onChangeText(value, setLastName)}
                    error={error.errorLastName}
                    fontSize={fontSize}
                    mode={mode}
                />

                <CustomInput
                    label={t("InputFields.firstname")}
                    value={firstName}
                    onChangeText={(value) => onChangeText(value, setFirstName)}
                    error={error.errorFirstName}
                    mode={mode}
                    fontSize={fontSize}
                />

                <CustomInput
                    label={t("InputFields.email")}
                    value={email}
                    onChangeText={(value) => onChangeText(value, setEmail)}
                    keyboardType='email-address'
                    fontSize={fontSize}
                    mode={mode}
                    error={error.errorEmail}
                />

                <CustomModal
                    visible={visible}
                    setVisible={setVisible}
                    password={password}
                    setPassword={(value) => onChangeText(value, setPassword)}
                    passwordA={passwordA}
                    setPasswordA={(value) => onChangeText(value, setPasswordA)}
                    passwordC={passwordC}
                    setPasswordC={(value) => onChangeText(value, setPasswordC)}
                    error={error}
                    setError={setError}
                    onPressSave={editPassword}
                    fontSize={fontSize}
                    mode={mode}
                />

                <AlertModal
                    visible={visibleAlert}
                    setVisible={setVisibleAlert}
                    onPressConfirm={drop}
                    mode={mode}
                    message={t("Delete")}
                />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        onPress={() => edit()} 
                        style={styles.button}
                    >
                        <FontAwesomeIcon icon={faFloppyDisk} size={(parseInt(fontSize) + 4)} />
                        <Text style={[styles.txtButton, { fontSize: (parseInt(fontSize) + 4).toString() }]}>{t("Account.buttons.save")}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => setVisible(true)} 
                        style={styles.button}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} size={(parseInt(fontSize) + 4)} />
                        <Text style={[styles.txtButton, { fontSize: (parseInt(fontSize) + 4).toString() }]}>{t("Account.buttons.password")}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={() => setVisibleAlert(true)} 
                        style={styles.button}
                    >
                        <FontAwesomeIcon icon={faTrashCan} size={(parseInt(fontSize) + 4)} />
                        <Text style={[styles.txtButton, { fontSize: (parseInt(fontSize) + 4).toString() }]}>{t("Account.buttons.delete")}</Text>
                    </TouchableOpacity>

                </View>
            </View>
            <Toast />

        </SafeAreaView >
    )
}

export default Account

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
        justifyContent: "center"
    },
    title: {
        fontWeight: 'bold',
        textAlign: 'center'
    },
    title_pages: {
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10
    },
    subtitle: {
        textAlign: 'center'
    },
    image: {
        height: 300,
        width: 300
    },
    backButton: {
        position: 'absolute',
        left: 10,
        top: 0, 
        padding: 10,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        margin: 20
    },
    txtButton: {
        marginLeft: 10
    },
    noAccountRow: {
        flexDirection: 'row'
    },
    txtNoAccount: {
        color: 'blue',
        borderBottomWidth: 1
    },
    buttonContainer: {
        flexDirection: 'column',
        width: 300,
        justifyContent: 'space-around'
    }
})