import React from 'react';
import {Tabs} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {C} from '../../components/UI';
export default function TabsLayout(){return <Tabs id="main-tabs" screenOptions={{headerShown:false,tabBarActiveTintColor:C.green,tabBarInactiveTintColor:'#7D8981',tabBarStyle:{height:64,paddingTop:7,paddingBottom:8,borderTopColor:C.line,backgroundColor:C.white},tabBarLabelStyle:{fontSize:10,fontWeight:'700'}}}>
<Tabs.Screen name="index" options={{title:'Accueil',tabBarIcon:({color,size})=><Ionicons name="home" color={String(color)} size={size}/>}}/>
<Tabs.Screen name="actualites" options={{title:'Actualités',tabBarIcon:({color,size})=><Ionicons name="newspaper" color={String(color)} size={size}/>}}/>
<Tabs.Screen name="videos" options={{title:'Vidéos',tabBarIcon:({color,size})=><Ionicons name="play-circle" color={String(color)} size={size}/>}}/>
<Tabs.Screen name="direct" options={{title:'Direct',tabBarIcon:({color,size})=><Ionicons name="radio" color={String(color)} size={size}/>}}/>
<Tabs.Screen name="favoris" options={{title:'Favoris',tabBarIcon:({color,size})=><Ionicons name="bookmark" color={String(color)} size={size}/>}}/>
<Tabs.Screen name="recherche" options={{href:null}}/>
<Tabs.Screen name="menu" options={{href:null}}/>
</Tabs>;}
