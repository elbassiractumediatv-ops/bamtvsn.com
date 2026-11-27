import React from 'react';
import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {C} from '../components/UI';
export default function RootLayout(){return <><StatusBar style="dark" backgroundColor={C.bg}/><Stack screenOptions={{headerShown:false,contentStyle:{backgroundColor:C.bg}}}><Stack.Screen name="(tabs)"/><Stack.Screen name="article/[slug]"/><Stack.Screen name="video/[slug]"/></Stack></>;}
