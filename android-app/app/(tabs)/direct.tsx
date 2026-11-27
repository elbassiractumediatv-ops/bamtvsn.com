import React from 'react';
import {Linking,Pressable,Text,View} from 'react-native';
import {C,Header,Page} from '../../components/UI';
export default function DirectScreen(){return <Page><Header title="BAM TV SN en direct" subtitle="Retrouvez notre antenne"/>
 <View style={{backgroundColor:'#10251A',borderRadius:18,minHeight:220,alignItems:'center',justifyContent:'center',padding:24,gap:12}}>
 <Text style={{fontSize:32,fontWeight:'900',color:C.white}}>BAM TV <Text style={{color:'#F2C94C'}}>SN</Text></Text><View style={{width:58,height:58,borderRadius:29,backgroundColor:C.red,alignItems:'center',justifyContent:'center'}}><Text style={{color:C.white,fontSize:23}}>▶</Text></View><Text style={{color:C.white,fontWeight:'800',letterSpacing:2}}>ESPACE DIRECT</Text></View>
 <Text style={{fontSize:20,fontWeight:'900',color:C.ink}}>Suivez notre chaîne YouTube</Text><Text style={{color:C.muted,lineHeight:22}}>Ouvrez la chaîne BAM TV SN pour regarder les diffusions disponibles, les reportages et les émissions. Le direct n’est pas affiché comme actif tant qu’une diffusion n’est pas confirmée.</Text>
 <Pressable onPress={()=>Linking.openURL('https://www.youtube.com/@BAMTVSN/live')} style={{backgroundColor:C.green,padding:16,borderRadius:12,alignItems:'center'}}><Text style={{color:C.white,fontWeight:'900'}}>Regarder sur YouTube ↗</Text></Pressable>
 </Page>;}
