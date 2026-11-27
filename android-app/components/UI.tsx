import React from 'react';
import { View, Text, ScrollView, Image, Pressable, ActivityIndicator, RefreshControl, StyleSheet } from 'react-native';
export const COLORS = { green: '#087A3B', red: '#D62828', ink: '#15231A', muted: '#68756C', paper: '#F5F7F5' };
export function Page({ children, refreshing, onRefresh }: any) {
  return <ScrollView style={{ flex: 1, backgroundColor: COLORS.paper }} contentContainerStyle={{ padding: 16, paddingBottom: 32 }} refreshControl={onRefresh ? <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={COLORS.green} /> : undefined}>{children}</ScrollView>;
}
export function Heading({ children }: any) { return <Text style={{ fontSize: 21, fontWeight: '900', color: COLORS.ink, marginVertical: 14 }}>{children}</Text>; }
export function Busy() { return <ActivityIndicator color={COLORS.green} style={{ padding: 25 }} />; }
export function Empty({ children }: any) { return <Text style={{ padding: 16, color: COLORS.muted, textAlign: 'center' }}>{children}</Text>; }
export function ContentCard({ item, video, onPress }: any) {
  const uri = video ? (item.thumbnail_url || `https://img.youtube.com/vi/${item.youtube_id}/hqdefault.jpg`) : item.cover_url;
  return <Pressable onPress={onPress} style={styles.card}>
    {uri ? <Image source={{ uri }} style={styles.image} /> : <View style={[styles.image, styles.fallback]}><Text style={{ color: COLORS.green, fontWeight: '900' }}>BAM TV SN</Text></View>}
    <View style={{ padding: 13 }}><Text style={styles.tag}>{video ? 'VIDÉO' : item.categories?.name || 'ACTUALITÉ'}</Text><Text style={styles.title}>{item.title}</Text>{item.excerpt ? <Text numberOfLines={2} style={styles.excerpt}>{item.excerpt}</Text> : null}</View>
  </Pressable>;
}
const styles = StyleSheet.create({ card: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', marginBottom: 14, elevation: 2 }, image: { width: '100%', height: 190, backgroundColor: '#E5EEE8' }, fallback: { alignItems: 'center', justifyContent: 'center' }, tag: { color: COLORS.green, fontSize: 10, fontWeight: '900', letterSpacing: 1 }, title: { fontSize: 16, fontWeight: '800', color: COLORS.ink, marginTop: 5, lineHeight: 22 }, excerpt: { color: COLORS.muted, marginTop: 6, lineHeight: 19 } });
