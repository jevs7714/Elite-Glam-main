import { StyleSheet, Text, View, FlatList, Animated, TouchableOpacity } from 'react-native'
import React, { useRef, useState } from 'react'
import images from '@/constants/images';
import OnboardItem from './OnboardItem';
import Paginator from './Paginator';
import { router } from 'expo-router';

const DATA = [
    {
      id: 1,
      title: "Look Stunning,",
      subtitle: "Rent Effortlessly!",
      description: "Find the perfect dress or suit for any special occasion with confidence",
      image: images.Gown,
    },
    {
      id: 2,
      title: "Browse Collections",
      subtitle: "Find Your Style",
      description: "Explore our wide range of designer dresses and formal wear",
      image: images.Suite,
    },
    {
      id: 3,
      title: "Easy Rental",
      subtitle: "Simple Returns",
      description: "Hassle-free booking and return process for your convenience",
      image: images.GownDes,
    },
];
  


const OnboardingScreen = () => {

    const [currentIndex, setCurrentIndex] = useState(0);

    const scrollX = useRef(new Animated.Value(0)).current;

    const slidesRef = useRef(null);

    const scrollToNextSlide = () => {
        if (currentIndex < DATA.length - 1) {
            slidesRef.current.scrollToIndex({
                index: currentIndex + 1,
                animated: true
            });
            setCurrentIndex(currentIndex + 1);
        } else {
            // Navigate to your main app screen
            // If using React Navigation:
            // navigation.navigate('MainApp');

            router.push('/login');
        }
    };

    const viewableItemsChanged = useRef(({ viewableItems }) => {
        setCurrentIndex(viewableItems[0]?.index ?? 0);
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <View style={styles.container}>
      <View style = {{flex: 3}}>
      <FlatList 
            data={DATA}
            renderItem={({ item }) => (
                <OnboardItem 
                    title={item.title}
                    subtitle={item.subtitle}
                    description={item.description}
                    image={item.image}
                />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            bounces={false}
            keyExtractor={(item) => item.id.toString()}
            onScroll={Animated.event([{nativeEvent: {contentOffset: { x: scrollX }}}], {
                useNativeDriver: false,
            })}
            scrollEventThrottle={32}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={viewConfig}
            ref={slidesRef}
            scrollEnabled={false}
      />
      </View>
       <Paginator data={DATA} scrollX={scrollX} currentIndex={currentIndex}/>
       <TouchableOpacity 
            style={styles.button} 
            onPress={scrollToNextSlide}
        >
            <Text style={styles.buttonText}>
                {currentIndex === DATA.length - 1 ? 'Get Started' : 'Next'}
            </Text>
        </TouchableOpacity>
    </View>
    
  )
}

export default OnboardingScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  button: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: '#6B3FA0',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  }
})