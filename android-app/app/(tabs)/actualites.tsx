import React,{useCallback,useEffect,useState} from 'react';
import {RefreshControl,ScrollView} from 'react-native';
import {useRouter} from 'expo-router';
import {getArticles} from '../../lib/api';
import {ArticleCard,C,Empty,ErrorBox,Header,Loading} from '../../components/UI';
export default function NewsScreen(){
 const router=useRouter();const [items,setItems]=useState<any[]>([]);const [busy,setBusy]=useState(true);const [error,setError]=useState('');const [refreshing,setRefreshing]=useState(false);
 const load=useCallback(async()=>{try{setError('');setItems(await getArticles(100));}catch(e:any){setError(e.message)}finally{setBusy(false);setRefreshing(false)}},[]);
 useEffect(()=>{load()},[load]);
 return <ScrollView style={{flex:1,backgroundColor:C.bg}} contentContainerStyle={{padding:16}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);load()}} tintColor={C.green}/>}>
 <Header title="Actualités" subtitle="Les dernières informations"/>{error?<ErrorBox message={error} onRetry={load}/>:null}{busy?<Loading/>:null}{!busy&&!items.length&&!error?<Empty/>:null}
 {items.map(x=><ArticleCard key={x.id} item={x} onPress={()=>router.push('/article/'+x.slug)}/>)}</ScrollView>;
}
