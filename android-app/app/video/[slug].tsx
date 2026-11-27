import React,{useEffect,useState} from 'react';
import {Alert,Image,Linking,Pressable,Share,Text} from 'react-native';
import {useLocalSearchParams,useRouter} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getVideoBySlug,youtubeThumbnail} from '../../lib/api';
import {C,Empty,formatDate,Loading,Page} from '../../components/UI';
export default function VideoDetail(){
 const {slug}=useLocalSearchParams<{slug:string}>();const router=useRouter();const [item,setItem]=useState<any>(null);const [busy,setBusy]=useState(true);const [saved,setSaved]=useState(false);
 useEffect(()=>{(async()=>{try{setItem(await getVideoBySlug(String(slug)));const ids:string[]=JSON.parse(await AsyncStorage.getItem('bam-favorites')||'[]');setSaved(ids.includes('video:'+slug));}catch(e:any){Alert.alert('Erreur',e.message)}finally{setBusy(false)}})()},[slug]);
 const toggle=async()=>{const ids:string[]=JSON.parse(await AsyncStorage.getItem('bam-favorites')||'[]');const key='video:'+slug;await AsyncStorage.setItem('bam-favorites',JSON.stringify(saved?ids.filter(x=>x!==key):[...ids,key]));setSaved(!saved);};
 if(busy)return <Page><Loading/></Page>;if(!item)return <Page><Empty text="Vidéo introuvable ou non publiée."/></Page>;
 const url=item.youtube_id?'https://www.youtube.com/watch?v='+item.youtube_id:'https://www.youtube.com/@BAMTVSN';const thumb=youtubeThumbnail(item);
 return <Page><Pressable onPress={()=>router.back()}><Text style={{color:C.green,fontWeight:'900'}}>‹ Retour</Text></Pressable>
 {thumb?<Image source={{uri:thumb}} style={{width:'100%',height:220,borderRadius:14}}/>:null}
 <Text style={{color:C.green,fontWeight:'900',fontSize:11}}>{item.category?.name||'VIDÉO'}</Text><Text style={{fontSize:24,fontWeight:'900',color:C.ink}}>{item.title}</Text>
 <Text style={{fontSize:12,color:C.muted}}>{formatDate(item.published_at)}</Text>{item.description?<Text style={{color:C.muted,lineHeight:22}}>{item.description}</Text>:null}
 <Pressable onPress={()=>Linking.openURL(url)} style={{backgroundColor:C.red,padding:16,borderRadius:12,alignItems:'center'}}><Text style={{color:C.white,fontWeight:'900'}}>▶ Regarder sur YouTube</Text></Pressable>
 <Pressable onPress={toggle} style={{backgroundColor:C.pale,padding:13,borderRadius:10}}><Text style={{color:C.green,fontWeight:'800'}}>{saved?'★ Retirer des favoris':'☆ Ajouter aux favoris'}</Text></Pressable>
 <Pressable onPress={()=>Share.share({message:item.title+'\n'+url})}><Text style={{color:C.green,fontWeight:'800'}}>Partager la vidéo ↗</Text></Pressable></Page>;
}
