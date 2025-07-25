import React, { useEffect } from 'react'
import { View,Text } from 'react-native'
import { router } from 'expo-router'



export default function Index () {
    // useEffect(() => {
    //   handleNavigate();
    // }, [])
    

    // const handleNavigate = () => {
    //     router.push('/SignInScreen');
    // }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Welcome to the TeamPad App!</Text>
        </View>
    )
}

