import React,{useEffect,useState} from 'react';
import {Alert,Image,Pressable,Share,Text,View} from 'react-native';
import {useLocalSearchParams,useRouter} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getArticleBySlug} from '../../lib/api';
import {C,Empty,formatDate,Loading,Page} from '../../components/UI';
function plainText(html:string){return (html||'').replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<\/(p|div|h[1-6]|li|blockquote)>/gi,'\n\n').replace(/<br\s*\/?\s*>/gi,'\n').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'”').replace(/&#39;/g,'’').replace(/&lt;/g,'<').replace(/&gt;/g,'>').trim();}
export default function ArticleDetail(){
 const {slug}=useLocalSearchParams<{slug:string}>();const router=useRouter();const [item,setItem]=useState<any>(null);const [busy,setBusy]=useState(true);const [saved,setSaved]=useState(false);
 useEffect(()=>{(async()=>{try{setItem(await getArticleBySlug(String(slug)));const ids:string[]=JSON.parse(await AsyncStorage.getItem('bam-favorites')||'[]');setSaved(ids.includes('article:'+slug));}catch(e:any){Alert.alert('Erreur',e.message)}finally{setBusy(false)}})()},[slug]);
 const toggle=async()=>{const ids:string[]=JSON.parse(await AsyncStorage.getItem('bam-favorites')||'[]');const key='article:'+slug;await AsyncStorage.setItem('bam-favorites',JSON.stringify(saved?ids.filter(x=>x!==key):[...ids,key]));setSaved(!saved);};
 if(busy)return <Page><Loading/></Page>;if(!item)return <Page><Pressable onPress={()=>router.back()}><Text style={{color:C.green,fontWeight:'800'}}>‹ Retour</Text></Pressable><Empty text="Article introuvable ou non publié."/></Page>;
 return <Page><Pressable onPress={()=>router.back()}><Text style={{color:C.green,fontWeight:'900'}}>‹ Retour</Text></Pressable>
 {item.cover_url?<Image source={{uri:item.cover_url}} style={{width:'100%',height:220,borderRadius:14}}/>:null}
 <Text style={{color:C.green,fontWeight:'900',fontSize:11,letterSpacing:1}}>{item.category?.name||'ACTUALITÉ'}</Text>
 <Text style={{fontSize:25,fontWeight:'900',color:C.ink,lineHeight:32}}>{item.title}</Text><Text style={{color:C.muted,fontSize:12}}>{formatDate(item.published_at)}</Text>
 {item.excerpt?<Text style={{fontSize:16,color:C.muted,lineHeight:23}}>{item.excerpt}</Text>:null}
 <View style={{flexDirection:'row',gap:10}}><Pressable onPress={toggle} style={{backgroundColor:C.pale,padding:12,borderRadius:10}}><Text style={{color:C.green,fontWeight:'800'}}>{saved?'★ Enregistré':'☆ Favoris'}</Text></Pressable><Pressable onPress={()=>Share.share({message:item.title+'\n'+(item.excerpt||'')})} style={{backgroundColor:C.pale,padding:12,borderRadius:10}}><Text style={{color:C.green,fontWeight:'800'}}>Partager ↗</Text></Pressable></View>
 <Text style={{fontSize:16,lineHeight:27,color:C.ink}}>{plainText(item.content)}</Text></Page>;
}
