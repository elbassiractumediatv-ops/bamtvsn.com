import React from 'react';
import {Linking,Pressable,Text,View} from 'react-native';
import {C,Header,Page} from '../../components/UI';
const links=[{label:'Site officiel BAM TV SN',url:'https://bamtvsn.com'},{label:'Facebook',url:'https://www.facebook.com/voixdusaloum'},{label:'YouTube',url:'https://www.youtube.com/@BAMTVSN'},{label:'Contact',url:'https://bamtvsn.com/contact'}];
export default function MenuScreen(){return <Page><Header title="Menu" subtitle="Retrouvez BAM TV SN sur vos plateformes"/>
<Text style={{fontSize:18,fontWeight:'900',color:C.ink}}>Nos plateformes</Text>
{links.map(x=><Pressable key={x.label} onPress={()=>Linking.openURL(x.url)} style={{backgroundColor:C.white,padding:17,borderRadius:12,borderWidth:1,borderColor:C.line,flexDirection:'row',justifyContent:'space-between'}}><Text style={{fontWeight:'800',color:C.ink}}>{x.label}</Text><Text style={{color:C.green,fontWeight:'900'}}>↗</Text></Pressable>)}
<View style={{padding:16,backgroundColor:C.pale,borderRadius:12}}><Text style={{color:C.green,fontWeight:'900'}}>BAM TV SN</Text><Text style={{color:C.muted,lineHeight:21,marginTop:6}}>L’information, les reportages et les émissions du Sénégal sur votre téléphone.</Text></View>
</Page>;}
