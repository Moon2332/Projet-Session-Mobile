import React from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const CustomInput = ({
  label,
  value,
  onChangeText,
  isPassword,
  error,
  mode,
  toggleVisibility,
  isPasswordVisible,
  showEyeIcon,
  fontSize
}) => {

  const dynamicStyles = {
    inputContainer: {
      marginBottom: 15,
      width: 320
    },
    label: {
      fontSize: fontSize,
      color: mode ? '#000' : '#666',
    },
    inputWrapper: {
      position: 'relative',
    },
    input: {
      padding: 15,
      borderRadius: 10,
      borderWidth: 1,
      fontSize: fontSize,
      backgroundColor: mode ? '#ccc' : '#333',
      color: mode ? '#333' : '#ccc',
    },
    eyeIconContainer: {
      position: 'absolute',
      right: 10,
      top: '50%',
      transform: [{ translateY: -12 }],
    },
    errorText: {
      color: 'red',
      fontSize: fontSize,
      marginTop: 5,
    },
  };

  return (
    <View style={dynamicStyles.inputContainer}>
      <Text style={dynamicStyles.label}>{label}</Text>
      <View style={dynamicStyles.inputWrapper}>
        <TextInput
          style={dynamicStyles.input}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword}
        />
        {showEyeIcon && (
          <TouchableOpacity onPress={toggleVisibility} style={dynamicStyles.eyeIconContainer}>
            <FontAwesomeIcon icon={isPasswordVisible ? faEye : faEyeSlash} size={(parseInt(fontSize) + 4)} color={mode ? '#333' : '#000'} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={dynamicStyles.errorText}>{error}</Text>}
    </View>
  );
};

export default CustomInput;
