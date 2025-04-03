import { StyleSheet, Text, View, Image, useWindowDimensions } from 'react-native'
import React from 'react'

export default function OnboardItem({ title, subtitle, description, image }) {
    const { width } = useWindowDimensions();

    return (
        <View style={[styles.container, { width }]}>
            <Image 
                source={image} 
                style={[styles.image, { width, resizeMode: 'contain' }]}
            />
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    image: {
        flex: 0.7,
        justifyContent: 'center',
    },
    content: {
        flex: 0.3,
        alignItems: 'center',
    },
    title: {
        fontWeight: '800',
        fontSize: 28,
        marginBottom: 10,
        color: '#333',
        textAlign: 'center',
    },
    subtitle: {
        fontWeight: '600',
        fontSize: 24,
        color: '#6B3FA0', // Purple theme color
        textAlign: 'center',
    },
    description: {
        fontWeight: '300',
        color: '#62656b',
        textAlign: 'center',
        paddingHorizontal: 64,
    },
})