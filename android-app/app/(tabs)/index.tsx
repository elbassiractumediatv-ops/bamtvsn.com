import React,{useCallback,useEffect,useState} from 'react';
import {Image,Pressable,RefreshControl,ScrollView,Text,View} from 'react-native';
import {useRouter} from 'expo-router';
import {getArticles,getVideos} from '../../lib/api';
import {ArticleCard,C,Empty,ErrorBox,Header,Loading,SectionTitle,VideoCard} from '../../components/UI';
export default function HomeScreen(){
 const router=useRouter();const [articles,setArticles]=useState<any[]>([]);const [videos,setVideos]=useState<any[]>([]);const [busy,setBusy]=useState(true);const [refreshing,setRefreshing]=useState(false);const [error,setError]=useState('');
 const load=useCallback(async()=>{try{setError('');const [a,v]=await Promise.all([getArticles(8),getVideos(8)]);setArticles(a);setVideos(v);}catch(e:any){setError(e.message||'Erreur réseau');}finally{setBusy(false);setRefreshing(false);}},[]);
 useEffect(()=>{load()},[load]);const featured=articles.find(x=>x.featured)||articles[0];
 return <ScrollView style={{flex:1,backgroundColor:C.bg}} contentContainerStyle={{padding:16,paddingBottom:30}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);load()}} tintColor={C.green}/>}>
 <Header title="L’actualité du Sénégal" subtitle="Votre média, partout avec vous"/>
 <Pressable onPress={()=>router.push('/(tabs)/recherche')} style={{padding:13,backgroundColor:C.white,borderRadius:12,borderWidth:1,borderColor:C.line}}><Text style={{color:C.muted}}>⌕  Rechercher une actualité ou une vidéo</Text></Pressable>
 {error?<ErrorBox message={error} onRetry={load}/>:null}{busy?<Loading/>:null}
 {featured?<Pressable onPress={()=>router.push('/article/'+featured.slug)} style={{backgroundColor:C.white,borderRadius:16,overflow:'hidden',marginTop:8,borderWidth:1,borderColor:C.line}}>
 {featured.cover_url?<Image source={{uri:featured.cover_url}} style={{width:'100%',height:210}}/>:<View style={{height:155,backgroundColor:'#DDEBE1',alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:25,fontWeight:'900',color:C.green}}>BAM TV SN</Text></View>}
 <View style={{padding:15,gap:7}}><Text style={{color:C.red,fontWeight:'900',fontSize:11,letterSpacing:1}}>À LA UNE</Text><Text style={{fontSize:20,fontWeight:'900',color:C.ink,lineHeight:27}}>{featured.title}</Text><Text style={{color:C.green,fontWeight:'800'}}>Lire l’article ›</Text></View></Pressable>:null}
 {!busy&&!error&&!articles.length?<Empty text="Les prochains articles publiés apparaîtront ici."/>:null}
 <SectionTitle title="Dernières actualités" action="Tout voir" onAction={()=>router.push('/(tabs)/actualites')}/>
 {articles.filter(x=>x.id!==featured?.id).slice(0,5).map(x=><ArticleCard key={x.id} item={x} onPress={()=>router.push('/article/'+x.slug)}/>)}
 <SectionTitle title="Vidéos récentes" action="Toutes les vidéos" onAction={()=>router.push('/(tabs)/videos')}/>
 <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:12}}>{videos.map(v=><VideoCard key={v.id} item={v} onPress={()=>router.push('/video/'+v.slug)}/>)}</ScrollView>
 </ScrollView>;
}
