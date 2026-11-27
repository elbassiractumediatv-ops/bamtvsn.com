import React,{useEffect,useState} from 'react';
import {Text,Image,Alert,Pressable,Share,useWindowDimensions} from 'react-native';
import {useLocalSearchParams,useRouter} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderHtml from '@native-html/render';
import {Page,Busy,Empty,COLORS,safeHttpsUrl} from '../../components/UI';
import {getArticleBySlug} from '../../lib/api';
function articleToHtml(raw:string){
 const value=(raw||'').trim();
 if(/<(p|h[1-6]|ul|ol|li|div|blockquote|br|strong|em)\\b/i.test(value)) return value;
 const escaped=value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
 return escaped.split(/\\n\\s*\\n/).map(p=>'<p>'+p.replace(/\\n/g,'<br/>').replace(/\\*\\*(.+?)\\*\\*/g,'<strong>$1</strong>').replace(/\\*(.+?)\\*/g,'<em>$1</em>')+'</p>').join('');
}
export default function ArticleDetail(){
 const {slug}=useLocalSearchParams<{slug:string}>();const router=useRouter();const {width}=useWindowDimensions();
 const [item,setItem]=useState<any>(null),[busy,setBusy]=useState(true),[saved,setSaved]=useState(false);
 useEffect(()=>{(async()=>{try{setItem(await getArticleBySlug(String(slug)));const ids=JSON.parse(await AsyncStorage.getItem('bam-favorites')||'[]');setSaved(ids.includes('article:'+slug));}catch(e:any){Alert.alert('Erreur',e.message)}finally{setBusy(false)}})()},[slug]);
 const toggle=async()=>{const ids:string[]=JSON.parse(await AsyncStorage.getItem('bam-favorites')||'[]');const key='article:'+slug;await AsyncStorage.setItem('bam-favorites',JSON.stringify(saved?ids.filter(x=>x!==key):[...ids,key]));setSaved(!saved)};
 if(busy)return <Page><Busy/></Page>;if(!item)return <Page><Empty>Article introuvable ou non publié.</Empty></Page>;
 const cover=safeHttpsUrl(item.cover_url);
 return <Page><Pressable onPress={()=>router.back()}><Text style={{color:COLORS.green,fontWeight:'800'}}>‹ Retour</Text></Pressable>
 {cover?<Image source={{uri:cover}} style={{width:'100%',height:220,borderRadius:14,marginTop:15}}/>:null}
 <Text style={{color:COLORS.green,fontWeight:'900',marginTop:16}}>{item.categories?.name||'ACTUALITÉ'}</Text>
 <Text style={{fontSize:24,fontWeight:'900',color:COLORS.ink,marginTop:8}}>{item.title}</Text>
 {item.excerpt?<Text style={{fontSize:16,color:COLORS.muted,marginTop:12}}>{item.excerpt}</Text>:null}
 <Pressable onPress={toggle} style={{padding:12,backgroundColor:'#E6F2EA',borderRadius:10,marginTop:16}}><Text style={{color:COLORS.green,fontWeight:'800'}}>{saved?'★ Retirer des favoris':'☆ Ajouter aux favoris'}</Text></Pressable>
 <Pressable onPress={()=>Share.share({message:item.title+'\\nhttps://bamtvsn.com/actualites/'+item.slug})} style={{padding:12}}><Text style={{color:COLORS.green,fontWeight:'800'}}>Partager l’article</Text></Pressable>
 <RenderHtml contentWidth={width-32} source={{html:articleToHtml(item.content)}} tagsStyles={{p:{fontSize:16,lineHeight:27,color:COLORS.ink,marginBottom:12},h1:{fontSize:24,fontWeight:'bold',color:COLORS.ink},h2:{fontSize:21,fontWeight:'bold',color:COLORS.ink},strong:{fontWeight:'bold'},a:{color:COLORS.green}}}/>
 </Page>;
}