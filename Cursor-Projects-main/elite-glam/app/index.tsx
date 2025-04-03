import { Text, View, Image } from "react-native";
import { useState } from "react";
import images  from "../constants/images";
import OnboardingScreen from "@/components/OnboardingScreen";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";

export default function Index() {


  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <OnboardingScreen/>
    </View>
  );
}
