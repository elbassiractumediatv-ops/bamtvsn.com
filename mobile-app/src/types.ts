export type Article = { id:string; title:string; slug:string; excerpt:string|null; content:string; cover_url:string|null; category_id:string|null; status:string; featured:boolean; views:number; published_at:string|null; created_at:string; };
export type Video = { id:string; title:string; slug:string; description:string|null; youtube_id:string; thumbnail_url:string|null; category_id:string|null; status:string; featured:boolean; published_at:string|null; created_at:string; };
export type Category = { id:string; name:string; slug:string; type:'article'|'video'; position:number; };
