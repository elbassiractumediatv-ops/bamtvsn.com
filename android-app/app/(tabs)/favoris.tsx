import React,{useCallback,useState} from 'react';
import {ScrollView,View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect,useRouter} from 'expo-router';
import {getArticles,getVideos} from '../../lib/api';
import {ArticleCard,C,Empty,Header,VideoCard} from '../../components/UI';
export default function FavoritesScreen(){
 const router=useRouter();const [articles,setArticles]=useState<any[]>([]);const [videos,setVideos]=useState<any[]>([]);const [busy,setBusy]=useState(true);
 const load=useCallback(async()=>{try{const ids:string[]=JSON.parse(await AsyncStorage.getItem('bam-favorites')||'[]');const [a,v]=await Promise.all([getArticles(100),getVideos(100)]);setArticles(a.filter(x=>ids.includes('article:'+x.slug)));setVideos(v.filter(x=>ids.includes('video:'+x.slug)));}catch{setArticles([]);setVideos([])}finally{setBusy(false)}},[]);
 useFocusEffect(useCallback(()=>{load()},[load]));
 return <ScrollView style={{flex:1,backgroundColor:C.bg}} contentContainerStyle={{padding:16}}><Header title="Mes favoris" subtitle="Vos contenus enregistrés sur ce téléphone"/>
 {!busy&&!articles.length&&!videos.length?<Empty text="Enregistrez un article ou une vidéo pour le retrouver ici."/>:null}
 {articles.map(x=><ArticleCard key={x.id} item={x} onPress={()=>router.push({pathname:'/article/[slug]',params:{slug:x.slug}})}/>)}
 {videos.map(x=><View key={x.id} style={{marginBottom:12}}><VideoCard item={x} onPress={()=>router.push({pathname:'/video/[slug]',params:{slug:x.slug}})}/></View>)}
 </ScrollView>;
}
