import React,{useCallback,useEffect,useState} from 'react';
import {RefreshControl,ScrollView,View} from 'react-native';
import {useRouter} from 'expo-router';
import {getVideos} from '../../lib/api';
import {C,Empty,ErrorBox,Header,Loading,VideoCard} from '../../components/UI';
export default function VideosScreen(){
 const router=useRouter();const [items,setItems]=useState<any[]>([]);const [busy,setBusy]=useState(true);const [error,setError]=useState('');const [refreshing,setRefreshing]=useState(false);
 const load=useCallback(async()=>{try{setError('');setItems(await getVideos(100));}catch(e:any){setError(e.message)}finally{setBusy(false);setRefreshing(false)}},[]);
 useEffect(()=>{load()},[load]);
 return <ScrollView style={{flex:1,backgroundColor:C.bg}} contentContainerStyle={{padding:16}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);load()}} tintColor={C.green}/>}>
 <Header title="Vidéos" subtitle="Reportages, interviews et émissions"/>{error?<ErrorBox message={error} onRetry={load}/>:null}{busy?<Loading/>:null}{!busy&&!items.length&&!error?<Empty text="Aucune vidéo publiée pour le moment."/>:null}
 <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',gap:12}}>{items.map(x=><View key={x.id} style={{width:'48%'}}><VideoCard item={x} onPress={()=>router.push({pathname:'/video/[slug]',params:{slug:x.slug}})}/></View>)}</View></ScrollView>;
}
