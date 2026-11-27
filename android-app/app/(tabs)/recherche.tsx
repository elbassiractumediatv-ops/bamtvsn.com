import React,{useState} from 'react';
import {Pressable,ScrollView,Text,TextInput,View} from 'react-native';
import {useRouter} from 'expo-router';
import {searchContent} from '../../lib/api';
import {ArticleCard,C,Empty,ErrorBox,Header,Loading,VideoCard} from '../../components/UI';
export default function SearchScreen(){
 const router=useRouter();const [term,setTerm]=useState('');const [results,setResults]=useState<any>({articles:[],videos:[]});const [busy,setBusy]=useState(false);const [error,setError]=useState('');
 const search=async()=>{if(!term.trim())return;setBusy(true);setError('');try{setResults(await searchContent(term));}catch(e:any){setError(e.message)}finally{setBusy(false)}};
 return <ScrollView style={{flex:1,backgroundColor:C.bg}} contentContainerStyle={{padding:16}}><Header title="Recherche" subtitle="Retrouvez un article ou une vidéo"/>
 <View style={{flexDirection:'row',gap:8}}><TextInput value={term} onChangeText={setTerm} onSubmitEditing={search} placeholder="Rechercher…" returnKeyType="search" style={{flex:1,backgroundColor:C.white,borderColor:C.line,borderWidth:1,borderRadius:12,paddingHorizontal:14,color:C.ink}}/><Pressable onPress={search} style={{backgroundColor:C.green,borderRadius:12,paddingHorizontal:16,justifyContent:'center'}}><Text style={{color:C.white,fontWeight:'800'}}>OK</Text></Pressable></View>
 {busy?<Loading/>:null}{error?<ErrorBox message={error}/>:null}{!busy&&term.trim()&&!results.articles.length&&!results.videos.length&&!error?<Empty text="Aucun résultat trouvé."/>:null}
 {results.articles.map((x:any)=><ArticleCard key={x.id} item={x} onPress={()=>router.push('/article/'+x.slug)}/>)}
 <View style={{gap:10}}>{results.videos.map((x:any)=><VideoCard key={x.id} item={x} onPress={()=>router.push('/video/'+x.slug)}/>)}</View></ScrollView>;
}
