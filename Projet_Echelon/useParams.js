import * as SecureStore from "expo-secure-store"
import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { createContext, useContext, useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import "./i18n"

const ParamsContext = createContext()

export const useParams = () => {
    return useContext(ParamsContext)
}

export const ParamsProvider = ({ children }) => {
    const [fontSize, setFontSize] = useState("")
    const [mode, setMode] = useState(true)
    const [langue, setLangue] = useState("")
    const [speedUnit, setSpeedUnit] = useState("");

    const { i18n } = useTranslation()

    useEffect(() => {
        const fetchSettings = async () => {
          try {
            setFontSize(await AsyncStorage.getItem("fontSize") || 16)
      
            setMode(await AsyncStorage.getItem("mode") === "true" ? true : false)
    
            setLangue(await AsyncStorage.getItem("langue") || 'fr')

            setSpeedUnit(await AsyncStorage.getItem("speedUnit") || "m/s")
          } catch (e) {
            console.log("Error in app" + e)
          }

          i18n.changeLanguage(langue)
        }

        fetchSettings()
    }, []);

    const updateFontSize = async (c) => {
        await AsyncStorage.setItem("fontSize", c)
        setFontSize(c)
    }

    const updateMode = async (c) => {
        await AsyncStorage.setItem("mode", c.toString())
        setMode(c)
    }

    const updateLanguage = async (c) => {
        await AsyncStorage.setItem("langue", c)
        setLangue(c)
        i18n.changeLanguage(c)
    }

    const updateSpeedUnit = async (c) => {
        await AsyncStorage.setItem("speeedUnit", c);
        setSpeedUnit(c);
    };

    return (
        <ParamsContext.Provider value={{ fontSize, mode, langue, speedUnit, updateFontSize, updateMode, updateLanguage, updateSpeedUnit }}>
            {children}
        </ParamsContext.Provider>
    )
}
