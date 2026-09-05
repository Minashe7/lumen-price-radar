/* Lumen Supabase client — public URL/key only. Never put service_role here. */
(function(){
  const saved=JSON.parse(localStorage.getItem('lumen:supabase')||'null');
  window.LumenAuth={
    config:saved,
    client:null,
    async init(){
      if(!saved?.url||!saved?.key||!window.supabase)return null;
      try{this.client=window.supabase.createClient(saved.url,saved.key);return this.client}catch(e){console.warn(e);return null}
    },
    async user(){if(!this.client)return null;const r=await this.client.auth.getUser();return r.data?.user||null},
    async login(){if(!this.client)throw Error('CONFIG');return this.client.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin}})},
    async logout(){if(this.client)await this.client.auth.signOut()},
    save(url,key){localStorage.setItem('lumen:supabase',JSON.stringify({url:url.trim().replace(/\/$/,''),key:key.trim()}));location.reload()},
    clear(){localStorage.removeItem('lumen:supabase');location.reload()}
  };
})();
