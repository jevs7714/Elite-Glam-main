import { StyleSheet, Text, View, Pressable } from 'react-native'
import React, { ReactElement } from 'react'


const CustomButton = ({title, handlePress}) => {
  return (
   <Pressable 
    onPress={handlePress}
   >
    {({pressed}) => (
        <View style={[styles.container, 
            {
                backgroundColor: pressed ? "indigo" : "rebeccapurple",
            },
        ]}>
        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
            {title}
        </Text>
    </View>
    )}
    
   </Pressable>
  )
}

export default CustomButton

const styles = StyleSheet.create({
    container:{
        alignItems:'center',
        justifyContent:'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        width: 150,

    },
    title:{
        color: "white",
        fontSize: 18,
        flexShrink:1,
        fontWeight:600,
    },
})