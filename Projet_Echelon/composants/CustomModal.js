import React, { useState } from "react";
import { Text, View, Modal, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEye, faEyeSlash, faX } from "@fortawesome/free-solid-svg-icons";
import CustomInput from "./CustomInput";
import { useTranslation } from 'react-i18next';

const CustomModal = ({
  visible,
  setVisible,
  passwordA,
  setPasswordA,
  password,
  setPassword,
  passwordC,
  setPasswordC,
  error,
  setError,
  onPressSave,
  fontSize,
  mode
}) => {
  const { t } = useTranslation();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordAVisible, setIsPasswordAVisible] = useState(false);
  const [isPasswordCVisible, setIsPasswordCVisible] = useState(false);

  const dynamicStyles = {
    container: {
      backgroundColor: mode ? '#f7f7f7' : '#333',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '90%',
      padding: 20,
      borderRadius: 35,
      backgroundColor: mode ? '#666' : '#F8F8F8',
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      width: 330,
    },
    buttons: {
      borderRadius: 30,
      borderWidth: 2,
      paddingVertical: 10,
      paddingHorizontal: 20,
      margin: 5,
      backgroundColor: mode ? '#FF5733' : '#33FF57',
    },
    buttonText: {
      color: mode ? '#FFFFFF' : '#000000',
      fontSize: parseInt(fontSize)
    },
    cancelButton: {
      backgroundColor: mode ? '#FF5733' : '#C70039',
    },
  };

  return (
    <View>
      <Modal transparent={true} animationType="fade" visible={visible} onRequestClose={() => [setVisible(false), setPassword(''), setPasswordC(''), setError([])]}>
        <View style={dynamicStyles.modalContainer}>
          <View style={dynamicStyles.modalContent}>
            <CustomInput
              label={t("InputFields.old_password")}
              value={passwordA}
              onChangeText={setPasswordA}
              isPassword={!isPasswordAVisible}
              error={error.errorPasswordA}
              mode={mode}
              toggleVisibility={() => setIsPasswordAVisible(!isPasswordAVisible)}
              isPasswordVisible={isPasswordAVisible}
              showEyeIcon={true}
              fontSize={fontSize}
            />

            <CustomInput
              label={t("InputFields.new_password")}
              value={password}
              onChangeText={setPassword}
              isPassword={!isPasswordVisible}
              error={error.errorPassword}
              mode={mode}
              toggleVisibility={() => setIsPasswordVisible(!isPasswordVisible)}
              isPasswordVisible={isPasswordVisible}
              showEyeIcon={true}               
              fontSize={fontSize}
            />

            <CustomInput
              label={t("InputFields.confirm_new_password")}
              value={passwordC}
              onChangeText={setPasswordC}
              isPassword={!isPasswordCVisible}
              error={error.errorPasswordC}
              mode={mode}
              toggleVisibility={() => setIsPasswordCVisible(!isPasswordCVisible)}
              isPasswordVisible={isPasswordCVisible}
              showEyeIcon={true}
              fontSize={fontSize}
            />

            {/* Buttons */}
            <View style={dynamicStyles.buttonsContainer}>
              <TouchableOpacity
                style={[dynamicStyles.buttons, dynamicStyles.cancelButton]}
                onPress={() => [setVisible(false), setPassword(''), setPasswordC(''), setError([])]}
              >
                <Text style={dynamicStyles.buttonText}>{t('Account.buttons.cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={dynamicStyles.buttons}
                onPress={onPressSave}
              >
                <Text style={dynamicStyles.buttonText}>{t('Account.buttons.save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomModal;
