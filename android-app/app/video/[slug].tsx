import React,{useEffect,useState} from 'react';
import {Text,Image,Alert,Pressable,Linking,Share} from 'react-native';
import {useLocalSearchParams,useRouter} from 'expo-router';
import {Page,Busy,Empty,COLORS,safeHttpsUrl,safeYoutubeId} from '../../components/UI';
import {getVideoBySlug} from '../../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VideoDetail(){
 const {slug}=useLocalSearchParams<{slug:string}>(); const router=useRouter();
 const [item,setItem]=useState<any>(null),[busy,setBusy]=useState(true),[saved,setSaved]=useState(false);
 useEffect(()=>{(async()=>{try{setItem(await getVideoBySlug(String(slug)));const ids=JSON.parse(await AsyncStorage.getItem('bam-favorites')||'[]');setSaved(ids.includes('video:'+slug));}catch(e:any){Alert.alert('Erreur',e.message)}finally{setBusy(false)}})()},[slug]);
 const toggle=async()=>{const ids:string[]=JSON.parse(await AsyncStorage.getItem('bam-favorites')||'[]');const key='video:'+slug;const next=saved?ids.filter(x=>x!==key):[...ids,key];await AsyncStorage.setItem('bam-favorites',JSON.stringify(next));setSaved(!saved)};
 if(busy)return <Page><Busy/></Page>;
 if(!item)return <Page><Empty>Vidéo introuvable ou non publiée.</Empty></Page>;
 const youtubeId=safeYoutubeId(item.youtube_id);
 const thumbnail=safeHttpsUrl(item.thumbnail_url)||(youtubeId?'https://img.youtube.com/vi/'+youtubeId+'/hqdefault.jpg':null);
 const videoUrl=youtubeId?'https://www.youtube.com/watch?v='+youtubeId:null;
 return <Page>
  <Pressable onPress={()=>router.back()}><Text style={{color:COLORS.green,fontWeight:'800'}}>‹ Retour</Text></Pressable>
  {thumbnail?<Image source={{uri:thumbnail}} style={{width:'100%',height:220,borderRadius:14,marginTop:15}}/>:null}
  <Text style={{fontSize:23,fontWeight:'900',color:COLORS.ink,marginTop:15}}>{item.title}</Text>
  {item.description?<Text style={{color:COLORS.muted,lineHeight:22,marginTop:10}}>{item.description}</Text>:null}
  <Pressable onPress={()=>videoUrl?Linking.openURL(videoUrl):Alert.alert('Lien indisponible','Cette vidéo ne possède pas d’identifiant YouTube valide.')} style={{padding:15,backgroundColor:COLORS.red,borderRadius:10,marginTop:18,alignItems:'center'}}><Text style={{color:'#fff',fontWeight:'900'}}>▶ REGARDER LA VIDÉO</Text></Pressable>
  <Pressable onPress={toggle} style={{padding:12}}><Text style={{color:COLORS.green,fontWeight:'800'}}>{saved?'★ Retirer des favoris':'☆ Ajouter aux favoris'}</Text></Pressable>
  <Pressable onPress={()=>videoUrl?Share.share({message:item.title+'\n'+videoUrl}):Alert.alert('Lien indisponible','Cette vidéo ne possède pas d’identifiant YouTube valide.')} style={{padding:12}}><Text style={{color:COLORS.green,fontWeight:'800'}}>Partager la vidéo</Text></Pressable>
 </Page>;
}