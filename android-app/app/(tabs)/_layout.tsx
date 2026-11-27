import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
export default function TabLayout() {
  return <Tabs screenOptions={{ headerStyle: { backgroundColor: '#087A3B' }, headerTintColor: '#fff', headerTitleStyle: { fontWeight: '800' }, tabBarActiveTintColor: '#087A3B', tabBarInactiveTintColor: '#7B857E', tabBarStyle: { height: 64, paddingBottom: 8, paddingTop: 7 }, tabBarLabelStyle: { fontSize: 11, fontWeight: '700' } }}>
    <Tabs.Screen name="index" options={{ title: 'BAM TV SN', tabBarLabel: 'Accueil', tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} /> }} />
    <Tabs.Screen name="actualites" options={{ title: 'Actualités', tabBarIcon: ({ color, size }) => <Ionicons name="newspaper" color={color} size={size} /> }} />
    <Tabs.Screen name="videos" options={{ title: 'Vidéos', tabBarIcon: ({ color, size }) => <Ionicons name="play-circle" color={color} size={size} /> }} />
    <Tabs.Screen name="direct" options={{ title: 'Direct', tabBarIcon: ({ color, size }) => <Ionicons name="radio" color={color} size={size} /> }} />
    <Tabs.Screen name="menu" options={{ title: 'Menu', tabBarIcon: ({ color, size }) => <Ionicons name="menu" color={color} size={size} /> }} />
  </Tabs>;
}
