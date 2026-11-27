import React, { useEffect, useState } from 'react';
import { Text, View, Alert, Linking } from 'react-native';
import { Page, Heading, Busy, ContentCard, Empty, COLORS } from '../../components/UI';
import { getArticles, getVideos } from '../../lib/api';
import { isSupabaseConfigured } from '../../lib/supabase';
export default function Home() {
 const [articles,setArticles]=useState<any[]>([]), [videos,setVideos]=useState<any[]>([]), [busy,setBusy]=useState(true);
 const load=async()=>{try{const [a,v]=await Promise.all([getArticles(5),getVideos(5)]);setArticles(a);setVideos(v);}catch(e:any){Alert.alert('Chargement impossible',e.message||'Vérifiez votre connexion.');}finally{setBusy(false);}};
 useEffect(()=>{load();},[]);
 return <Page refreshing={busy} onRefresh={load}>
  <View style={{backgroundColor:COLORS.green,borderRadius:18,padding:24,alignItems:'center'}}><Text style={{fontSize:31,fontWeight:'900',color:'#fff'}}>BAM TV <Text style={{color:'#F04B4B'}}>SN</Text></Text><Text style={{color:'#E8F5EC',fontSize:10,fontWeight:'800',letterSpacing:2,marginTop:5}}>L’INFORMATION EN TEMPS RÉEL</Text></View>
  {!isSupabaseConfigured?<Empty>Configuration Supabase requise : renseignez le fichier .env.</Empty>:null}
  <Heading>À la une</Heading>{busy?<Busy/>:articles.length?articles.slice(0,4).map(x=><ContentCard key={x.id} item={x} onPress={()=>Linking.openURL(`https://bamtvsn.com/article/${x.slug}`)}/>):<Empty>Aucun article publié.</Empty>}
  <Heading>Dernières vidéos</Heading>{videos.map(x=><ContentCard key={x.id} item={x} video onPress={()=>Linking.openURL(`https://www.youtube.com/watch?v=${x.youtube_id}`)}/>)}
 </Page>;
}
