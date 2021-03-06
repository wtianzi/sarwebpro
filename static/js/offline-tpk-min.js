define(["dojo/_base/declare","esri/geometry/Extent","dojo/query","esri/SpatialReference","esri/layers/TileInfo","esri/layers/TiledMapServiceLayer","dojo/Deferred","dojo/promise/all","dojo/Evented"],function(a,b,c,d,e,f,g,h,i){return a("O.esri.TPK.TPKLayer",[f,i],{map:null,store:null,MAX_DB_SIZE:75,TILE_PATH:"",RECENTER_DELAY:350,PARSING_ERROR:"parsingError",DB_INIT_ERROR:"dbInitError",DB_FULL_ERROR:"dbFullError",NO_SUPPORT_ERROR:"libNotSupportedError",PROGRESS_START:"start",PROGRESS_END:"end",WINDOW_VALIDATED:"windowValidated",DB_VALIDATED:"dbValidated",DATABASE_ERROR_EVENT:"databaseErrorEvent",VALIDATION_EVENT:"validationEvent",PROGRESS_EVENT:"progress",_maxDBSize:75,_isDBWriteable:!0,_isDBValid:!1,_autoCenter:null,_fileEntriesLength:0,_inMemTilesObject:null,_inMemTilesObjectLength:0,_zeroLengthFileCounter:0,_imageURL:"data:image/png;base64,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pmk0TROPj48Hn3l4eIimaSJN06O3A4NJwDMxm82ibdtXo4D5fB6r1Sp+//4dz8/Pw5H+6ekpdrtdJEkS8/n8S/9f713ie3vaceo9x557QAB451Sgfyin34HKshweunk5HzAej2MymXz5+f9nbjJyI9L39Wu5XP55+XQZ39uxR4Z3u90wSXjqEV0wAjhjx47oaZq63Me/ZhIQBAAQAEAAAAEABAAQAEAAAAEABAAQAEAAAAEABAAQAEAAAAEABAAQAEAAAAEABAAQAEAAAAEABAAQAEAAAAEABAAQAEAAAAEABAAQAEAAAAEAAbAJQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEABAAQAAAAQAEABAAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEABAAAABAAQAEAAQAEAAAAEABAAQAEAAAAEABAAQAEAAAAEABAAQAEAAAAEAvqe/BwCeKjUweoA8pQAAAABJRU5ErkJggg==",constructor:function(){this._self=this,this._inMemTilesIndex=[],this._inMemTilesObject={},this.store=new O.esri.Tiles.TilesStore,this._validate()},extend:function(a){this._fileEntriesLength=a.length,this.emit(this.PROGRESS_EVENT,this.PROGRESS_START),this._parseInMemFiles(a,function(){this._parseConfCdi(function(a){this.initialExtent=this.fullExtent=a,this._parseConfXml(function(a){this.tileInfo=new e(a),this.spatialReference=new d({wkid:this.tileInfo.spatialReference.wkid}),this.loaded=!0,this.onLoad(this),this.emit(this.PROGRESS_EVENT,this.PROGRESS_END)}.bind(this._self))}.bind(this._self))}.bind(this._self))},getTileUrl:function(a,b,d){this.emit(this.PROGRESS_EVENT,this.PROGRESS_START)
var e=this._self.TILE_PATH+"_alllayers",f=this._getCacheFilePath(e,a,b,d)
if(this._inMemTilesObject!={}){var g="void:/"+a+"/"+b+"/"+d
return null==this.map&&(this.map=this.getMap()),null==this._autoCenter&&(this._autoCenter=new O.esri.TPK.autoCenterMap(this.map,this.RECENTER_DELAY),this._autoCenter.init()),this._getInMemTiles(f,e,a,b,d,g,function(a,b,d){var e=c("img[src="+b+"]")[0]
"undefined"==typeof e&&(e=new Image)
var f
if(a){var g="data:image/png;base64,"
switch(this.tileInfo.format){case"JPEG":f="data:image/jpg;base64,"+a
break
case"PNG":f=g+a
break
case"PNG8":f=g+a
break
case"PNG24":f=g+a
break
case"PNG32":f=g+a
break
default:f="data:image/jpg;base64,"+a}e.style.borderColor="blue"}else e.style.borderColor="green",f=this._imageURL
return e.style.visibility="visible",e.src=f,this.emit(this.PROGRESS_EVENT,this.PROGRESS_END),""}.bind(this._self)),g}},setMaxDBSize:function(a){var b=/^\d+$/
b.test(a)&&a<=this.MAX_DB_SIZE&&(this._maxDBSize=a)},getDBSize:function(a){this.store.usedSpace(function(b,c){a(b,c)}.bind(this))},setDBWriteable:function(a){this._isDBWriteable=a},isDBValid:function(){return this._validate(),this._isDBValid},loadFromURL:function(a,b){this.isDBValid()?this.store.store(a,function(a,c){a?b(!0,""):b(!1,c)}):b(!1,"not supported")},_validate:function(){window.File||window.FileReader||window.Blob||window.btoa||window.DataView?this.emit(this.VALIDATION_EVENT,{msg:this.WINDOW_VALIDATED,err:null}):this.emit(this.VALIDATION_EVENT,{msg:this.NO_SUPPORT_ERROR,err:null}),this.store.isSupported()?this.store.init(function(a){a===!1?this.emit(this.DATABASE_ERROR_EVENT,{msg:this.DB_INIT_ERROR,err:null}):this.store.usedSpace(function(a,b){var c=this._bytes2MBs(a.sizeBytes)
c>this.MAX_DB_SIZE&&this.emit(this.DATABASE_ERROR_EVENT,{msg:this.DB_FULL_ERROR,err:b}),this.emit(this.VALIDATION_EVENT,{msg:this.DB_VALIDATED,err:null}),this._isDBValid=!0}.bind(this))}.bind(this)):this.emit(this.VALIDATION_EVENT,{msg:this.NO_SUPPORT_ERROR,err:null})},_parseInMemFiles:function(a,b){var c=this._fileEntriesLength
this._zeroLengthFileCounter=0
for(var d=[],e=0;c>e;e++){var f=new g,i=a[e].filename.toLocaleUpperCase(),j=i.indexOf("_ALLLAYERS",0);-1!=j&&(this.TILE_PATH=i.slice(0,j)),0===a[e].compressedSize&&this._zeroLengthFileCounter++
var k=i.indexOf("CONF.CDI",0),l=i.indexOf("CONF.XML",0),m=i.indexOf("BUNDLE",0),n=i.indexOf("BUNDLX",0);-1!=k||-1!=l?this._unzipConfFiles(a,e,f,function(a,b){a.resolve(b)}):-1!=m||-1!=n?this._unzipTileFiles(a,e,f,function(a,b){a.resolve(b)}):f.resolve(e),d.push(f)}h(d).then(function(a){b&&b(a)})},ObjectSize:function(a){var b,c=0
for(b in a)a.hasOwnProperty(b)&&c++
return c},_unzipConfFiles:function(a,b,c,d){a[b].getData(new O.esri.zip.TextWriter(b),function(b){this._inMemTilesIndex.push("blank")
var e=a[b.token].filename.toLocaleUpperCase()
this._inMemTilesObject[e]=b.string
var f=this.ObjectSize(this._inMemTilesObject)
f>0&&d(c,b.token)}.bind(this))},_unzipTileFiles:function(a,b,c,d){var e=this
a[b].getData(new O.esri.zip.BlobWriter(b),function(b){if(0!==b.size){var f=new FileReader
f.token=b.token,f.onerror=function(a){e.emit(e.PARSING_ERROR,{msg:"Error parsing file: ",err:a.target.error})},f.onloadend=function(g){if(void 0!==f.token){e._inMemTilesIndex.push("blank")
var h=a[f.token].filename.toLocaleUpperCase()
e._inMemTilesObject[h]=f.result
var i=e.ObjectSize(e._inMemTilesObject)
i>0&&d(c,b.token)}},f.readAsArrayBuffer(b)}})},_parseConfCdi:function(a){var c=this._inMemTilesObject[this.TILE_PATH+"CONF.CDI"],e=new O.esri.TPK.X2JS,f=e.xml_str2json(c),g=f.EnvelopeN,h=parseFloat(g.XMin),i=parseFloat(g.YMin),j=parseFloat(g.XMax),k=parseFloat(g.YMax),l=parseInt(g.SpatialReference.WKID),m=new b(h,i,j,k,new d({wkid:l}))
a(m)},_parseConfXml:function(a){var b=this._inMemTilesObject[this.TILE_PATH+"CONF.XML"],c=new O.esri.TPK.X2JS,d=c.xml_str2json(b),e=d.CacheInfo,f={}
f.rows=parseInt(e.TileCacheInfo.TileRows),f.cols=parseInt(e.TileCacheInfo.TileCols),f.dpi=parseInt(e.TileCacheInfo.DPI),f.format=e.TileImageInfo.CacheTileFormat,f.compressionQuality=parseInt(e.TileImageInfo.CompressionQuality),f.origin={x:parseInt(e.TileCacheInfo.TileOrigin.X),y:parseInt(e.TileCacheInfo.TileOrigin.Y)},f.spatialReference={wkid:parseInt(e.TileCacheInfo.SpatialReference.WKID)}
for(var g=e.TileCacheInfo.LODInfos.LODInfo,h=[],i=0;i<g.length;i++)h.push({level:parseFloat(g[i].LevelID),resolution:parseFloat(g[i].Resolution),scale:parseFloat(g[i].Scale)})
f.lods=h,a(f)},_getInMemTiles:function(a,b,c,d,e,f,g){var h=this._self,i=this.store
this.store.retrieve(a,function(j,k){if(j&&""!==k.img)g(k.img,f,a)
else{var l,m=128*Math.floor(d/128),n=128*Math.floor(e/128),o=this._getCacheFilePath(b,c,m,n).toLocaleUpperCase(),p=o+".BUNDLE",q=this._inMemTilesObject[p],r=this._inMemTilesObject[o+".BUNDLX"]
if(void 0!==q||void 0!==r){l=this._getOffset(c,d,e,m,n)
var s=h._getPointer(r,l)
h._buffer2Base64(q,s,function(b){h._isDBWriteable&&h._storeTile(a,b,i,function(a,b){b&&h.emit(h.DATABASE_ERROR_EVENT,{msg:"Error writing to database. ",err:b})}),g(b,f,a)}.bind(h))}else g(null,f,a)}}.bind(h))},_storeTile:function(a,b,c,d){var e={url:a,img:b}
c.store(e,function(a,b){d(a,b)})},_getPointer:function(a,b){var c=a.slice(b),d=new DataView(c,0,5),e=d.getUint8(0,!0),f=d.getUint8(1,!0),g=d.getUint8(2,!0),h=d.getUint8(3,!0),i=d.getUint8(4,!0),j=i
return j=256*j+h,j=256*j+g,j=256*j+f,j=256*j+e},_base64ArrayBuffer:function(a){for(var b,c,d,e,f,g="",h="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",i=new Uint8Array(a),j=i.byteLength,k=j%3,l=j-k,m=0;l>m;m+=3)f=i[m]<<16|i[m+1]<<8|i[m+2],b=(16515072&f)>>18,c=(258048&f)>>12,d=(4032&f)>>6,e=63&f,g+=h[b]+h[c]+h[d]+h[e]
return 1==k?(f=i[l],b=(252&f)>>2,c=(3&f)<<4,g+=h[b]+h[c]+"=="):2==k&&(f=i[l]<<8|i[l+1],b=(64512&f)>>10,c=(1008&f)>>4,d=(15&f)<<2,g+=h[b]+h[c]+h[d]+"="),g},_buffer2Base64:function(a,b,c){var d=new DataView(a,b),e=d.getInt32(0,!0),f=d.buffer.slice(b+4,b+4+e),g=this._base64ArrayBuffer(f)
c(g)},_int2HexString:function(a){var b=a.toString(16).toUpperCase()
return 1===b.length?"000"+b:2===b.length?"00"+b:3===b.length?"0"+b:b.substr(0,b.length)},_getOffset:function(a,b,c,d,e){var f=128*(c-e)+(b-d)
return 16+5*f},_getCacheFilePath:function(a,b,c,d){var e=[]
return e.push(a),e.push("/"),e.push("L"),e.push(10>b?"0"+b:b),e.push("/"),e.push("R"),e.push(this._int2HexString(c)),e.push("C"),e.push(this._int2HexString(d)),e.join("")},_bytes2MBs:function(a){return(a>>>20)+"."+(2046&a)}})}),"undefined"!=typeof O?O.esri.TPK={}:(O={},O.esri={TPK:{},Tiles:{}}),O.esri.Tiles.TilesStore=function(){this._db=null,this.dbName="offline_tile_store",this.objectStoreName="tilepath",this.isSupported=function(){return!(!window.indexedDB&&!window.openDatabase)},this.store=function(a,b){try{var c=this._db.transaction([this.objectStoreName],"readwrite")
c.oncomplete=function(){b(!0)},c.onerror=function(a){b(!1,a.target.error.message)}
var d=c.objectStore(this.objectStoreName)
a.url=O.esri.Tiles.LZString.compress(a.url),a.img=O.esri.Tiles.Base64String.compress(a.img)
var e=d.put(a)
e.onsuccess=function(){}}catch(f){b(!1,f.stack)}},this.retrieve=function(a,b){if(null!==this._db){var c=this._db.transaction([this.objectStoreName]).objectStore(this.objectStoreName),d=c.get(O.esri.Tiles.LZString.compress(a))
d.onsuccess=function(a){var c=a.target.result
void 0===c?b(!1,"not found"):(c.url=O.esri.Tiles.LZString.decompress(c.url),c.img=O.esri.Tiles.Base64String.decompress(c.img),b(!0,c))},d.onerror=function(a){b(!1,a)}}},this.deleteAll=function(a){if(null!==this._db){var b=this._db.transaction([this.objectStoreName],"readwrite").objectStore(this.objectStoreName).clear()
b.onsuccess=function(){a(!0)},b.onerror=function(b){a(!1,b)}}else a(!1,null)},this["delete"]=function(a,b){if(null!==this._db){var c=this._db.transaction([this.objectStoreName],"readwrite").objectStore(this.objectStoreName)["delete"](a)
c.onsuccess=function(){b(!0)},c.onerror=function(a){b(!1,a)}}else b(!1,null)},this.getAllTiles=function(a){if(null!==this._db){var b=this._db.transaction([this.objectStoreName]).objectStore(this.objectStoreName).openCursor()
b.onsuccess=function(b){var c=b.target.result
if(c){var d=c.value.url,e=c.value.img
d=O.esri.Tiles.LZString.decompress(d),e=O.esri.Tiles.Base64String.decompress(e),a(d,e,null),c["continue"]()}else a(null,null,"end")}.bind(this),b.onerror=function(b){a(null,null,b)}}else a(null,null,"no db")},this.usedSpace=function(a){if(null!==this._db){var b={sizeBytes:0,tileCount:0},c=this._db.transaction([this.objectStoreName]).objectStore(this.objectStoreName).openCursor()
c.onsuccess=function(c){var d=c.target.result
if(d){var e=d.value,f=JSON.stringify(e)
b.sizeBytes+=this._stringBytes(f),b.tileCount+=1,d["continue"]()}else a(b,null)}.bind(this),c.onerror=function(b){a(null,b)}}else a(null,null)},this._stringBytes=function(a){return a.length},this.init=function(a){var b=indexedDB.open(this.dbName,4)
a=a||function(a){}.bind(this),b.onerror=function(b){a(!1,b.target.errorCode)}.bind(this),b.onupgradeneeded=function(a){var b=a.target.result
b.objectStoreNames.contains(this.objectStoreName)&&b.deleteObjectStore(this.objectStoreName),b.createObjectStore(this.objectStoreName,{keyPath:"url"})}.bind(this),b.onsuccess=function(b){this._db=b.target.result,a(!0)}.bind(this)}},O.esri.Tiles.LZString=function(){function a(a,b){if(!e[a]){e[a]={}
for(var c=0;c<a.length;c++)e[a][a.charAt(c)]=c}return e[a][b]}var b=String.fromCharCode,c="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",e={},f={compressToBase64:function(a){if(null==a)return""
var b=f._compress(a,6,function(a){return c.charAt(a)})
switch(b.length%4){default:case 0:return b
case 1:return b+"==="
case 2:return b+"=="
case 3:return b+"="}},decompressFromBase64:function(b){return null==b?"":""==b?null:f._decompress(b.length,32,function(d){return a(c,b.charAt(d))})},compressToUTF16:function(a){return null==a?"":f._compress(a,15,function(a){return b(a+32)})+" "},decompressFromUTF16:function(a){return null==a?"":""==a?null:f._decompress(a.length,16384,function(b){return a.charCodeAt(b)-32})},compressToUint8Array:function(a){for(var b=f.compress(a),c=new Uint8Array(2*b.length),d=0,e=b.length;e>d;d++){var g=b.charCodeAt(d)
c[2*d]=g>>>8,c[2*d+1]=g%256}return c},decompressFromUint8Array:function(a){if(null===a||void 0===a)return f.decompress(a)
for(var c=new Array(a.length/2),d=0,e=c.length;e>d;d++)c[d]=256*a[2*d]+a[2*d+1]
var g=[]
return c.forEach(function(a){g.push(b(a))}),f.decompress(g.join(""))},compressToEncodedURIComponent:function(a){return null==a?"":f._compress(a,6,function(a){return d.charAt(a)})},decompressFromEncodedURIComponent:function(b){return null==b?"":""==b?null:(b=b.replace(/ /g,"+"),f._decompress(b.length,32,function(c){return a(d,b.charAt(c))}))},compress:function(a){return f._compress(a,16,function(a){return b(a)})},_compress:function(a,b,c){if(null==a)return""
var d,e,f,g={},h={},i="",j="",k="",l=2,m=3,n=2,o=[],p=0,q=0
for(f=0;f<a.length;f+=1)if(i=a.charAt(f),Object.prototype.hasOwnProperty.call(g,i)||(g[i]=m++,h[i]=!0),j=k+i,Object.prototype.hasOwnProperty.call(g,j))k=j
else{if(Object.prototype.hasOwnProperty.call(h,k)){if(k.charCodeAt(0)<256){for(d=0;n>d;d++)p<<=1,q==b-1?(q=0,o.push(c(p)),p=0):q++
for(e=k.charCodeAt(0),d=0;8>d;d++)p=p<<1|1&e,q==b-1?(q=0,o.push(c(p)),p=0):q++,e>>=1}else{for(e=1,d=0;n>d;d++)p=p<<1|e,q==b-1?(q=0,o.push(c(p)),p=0):q++,e=0
for(e=k.charCodeAt(0),d=0;16>d;d++)p=p<<1|1&e,q==b-1?(q=0,o.push(c(p)),p=0):q++,e>>=1}l--,0==l&&(l=Math.pow(2,n),n++),delete h[k]}else for(e=g[k],d=0;n>d;d++)p=p<<1|1&e,q==b-1?(q=0,o.push(c(p)),p=0):q++,e>>=1
l--,0==l&&(l=Math.pow(2,n),n++),g[j]=m++,k=String(i)}if(""!==k){if(Object.prototype.hasOwnProperty.call(h,k)){if(k.charCodeAt(0)<256){for(d=0;n>d;d++)p<<=1,q==b-1?(q=0,o.push(c(p)),p=0):q++
for(e=k.charCodeAt(0),d=0;8>d;d++)p=p<<1|1&e,q==b-1?(q=0,o.push(c(p)),p=0):q++,e>>=1}else{for(e=1,d=0;n>d;d++)p=p<<1|e,q==b-1?(q=0,o.push(c(p)),p=0):q++,e=0
for(e=k.charCodeAt(0),d=0;16>d;d++)p=p<<1|1&e,q==b-1?(q=0,o.push(c(p)),p=0):q++,e>>=1}l--,0==l&&(l=Math.pow(2,n),n++),delete h[k]}else for(e=g[k],d=0;n>d;d++)p=p<<1|1&e,q==b-1?(q=0,o.push(c(p)),p=0):q++,e>>=1
l--,0==l&&(l=Math.pow(2,n),n++)}for(e=2,d=0;n>d;d++)p=p<<1|1&e,q==b-1?(q=0,o.push(c(p)),p=0):q++,e>>=1
for(;;){if(p<<=1,q==b-1){o.push(c(p))
break}q++}return o.join("")},decompress:function(a){return null==a?"":""==a?null:f._decompress(a.length,32768,function(b){return a.charCodeAt(b)})},_decompress:function(a,c,d){var e,f,g,h,i,j,k,l,m=[],n=4,o=4,p=3,q="",r=[],s={val:d(0),position:c,index:1}
for(f=0;3>f;f+=1)m[f]=f
for(h=0,j=Math.pow(2,2),k=1;k!=j;)i=s.val&s.position,s.position>>=1,0==s.position&&(s.position=c,s.val=d(s.index++)),h|=(i>0?1:0)*k,k<<=1
switch(e=h){case 0:for(h=0,j=Math.pow(2,8),k=1;k!=j;)i=s.val&s.position,s.position>>=1,0==s.position&&(s.position=c,s.val=d(s.index++)),h|=(i>0?1:0)*k,k<<=1
l=b(h)
break
case 1:for(h=0,j=Math.pow(2,16),k=1;k!=j;)i=s.val&s.position,s.position>>=1,0==s.position&&(s.position=c,s.val=d(s.index++)),h|=(i>0?1:0)*k,k<<=1
l=b(h)
break
case 2:return""}for(m[3]=l,g=l,r.push(l);;){if(s.index>a)return""
for(h=0,j=Math.pow(2,p),k=1;k!=j;)i=s.val&s.position,s.position>>=1,0==s.position&&(s.position=c,s.val=d(s.index++)),h|=(i>0?1:0)*k,k<<=1
switch(l=h){case 0:for(h=0,j=Math.pow(2,8),k=1;k!=j;)i=s.val&s.position,s.position>>=1,0==s.position&&(s.position=c,s.val=d(s.index++)),h|=(i>0?1:0)*k,k<<=1
m[o++]=b(h),l=o-1,n--
break
case 1:for(h=0,j=Math.pow(2,16),k=1;k!=j;)i=s.val&s.position,s.position>>=1,0==s.position&&(s.position=c,s.val=d(s.index++)),h|=(i>0?1:0)*k,k<<=1
m[o++]=b(h),l=o-1,n--
break
case 2:return r.join("")}if(0==n&&(n=Math.pow(2,p),p++),m[l])q=m[l]
else{if(l!==o)return null
q=g+g.charAt(0)}r.push(q),m[o++]=g+q.charAt(0),n--,g=q,0==n&&(n=Math.pow(2,p),p++)}}}
return f}(),O.esri.Tiles.Base64String={compressToUTF16:function(a){var b,c,d,e=[],f=0
for(a=this.compress(a),b=0;b<a.length;b++)switch(c=a.charCodeAt(b),f++){case 0:e.push(String.fromCharCode((c>>1)+32)),d=(1&c)<<14
break
case 1:e.push(String.fromCharCode(d+(c>>2)+32)),d=(3&c)<<13
break
case 2:e.push(String.fromCharCode(d+(c>>3)+32)),d=(7&c)<<12
break
case 3:e.push(String.fromCharCode(d+(c>>4)+32)),d=(15&c)<<11
break
case 4:e.push(String.fromCharCode(d+(c>>5)+32)),d=(31&c)<<10
break
case 5:e.push(String.fromCharCode(d+(c>>6)+32)),d=(63&c)<<9
break
case 6:e.push(String.fromCharCode(d+(c>>7)+32)),d=(127&c)<<8
break
case 7:e.push(String.fromCharCode(d+(c>>8)+32)),d=(255&c)<<7
break
case 8:e.push(String.fromCharCode(d+(c>>9)+32)),d=(511&c)<<6
break
case 9:e.push(String.fromCharCode(d+(c>>10)+32)),d=(1023&c)<<5
break
case 10:e.push(String.fromCharCode(d+(c>>11)+32)),d=(2047&c)<<4
break
case 11:e.push(String.fromCharCode(d+(c>>12)+32)),d=(4095&c)<<3
break
case 12:e.push(String.fromCharCode(d+(c>>13)+32)),d=(8191&c)<<2
break
case 13:e.push(String.fromCharCode(d+(c>>14)+32)),d=(16383&c)<<1
break
case 14:e.push(String.fromCharCode(d+(c>>15)+32,(32767&c)+32)),f=0}return e.push(String.fromCharCode(d+32)),e.join("")},decompressFromUTF16:function(a){for(var b,c,d=[],e=0,f=0;f<a.length;){switch(c=a.charCodeAt(f)-32,e++){case 0:b=c<<1
break
case 1:d.push(String.fromCharCode(b|c>>14)),b=(16383&c)<<2
break
case 2:d.push(String.fromCharCode(b|c>>13)),b=(8191&c)<<3
break
case 3:d.push(String.fromCharCode(b|c>>12)),b=(4095&c)<<4
break
case 4:d.push(String.fromCharCode(b|c>>11)),b=(2047&c)<<5
break
case 5:d.push(String.fromCharCode(b|c>>10)),b=(1023&c)<<6
break
case 6:d.push(String.fromCharCode(b|c>>9)),b=(511&c)<<7
break
case 7:d.push(String.fromCharCode(b|c>>8)),b=(255&c)<<8
break
case 8:d.push(String.fromCharCode(b|c>>7)),b=(127&c)<<9
break
case 9:d.push(String.fromCharCode(b|c>>6)),b=(63&c)<<10
break
case 10:d.push(String.fromCharCode(b|c>>5)),b=(31&c)<<11
break
case 11:d.push(String.fromCharCode(b|c>>4)),b=(15&c)<<12
break
case 12:d.push(String.fromCharCode(b|c>>3)),b=(7&c)<<13
break
case 13:d.push(String.fromCharCode(b|c>>2)),b=(3&c)<<14
break
case 14:d.push(String.fromCharCode(b|c>>1)),b=(1&c)<<15
break
case 15:d.push(String.fromCharCode(b|c)),e=0}f++}return this.decompress(d.join(""))},_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",decompress:function(a){for(var b,c,d,e,f,g,h,i=[],j=1,k=a.charCodeAt(0)>>8;j<2*a.length&&(j<2*a.length-1||0===k);)j%2===0?(b=a.charCodeAt(j/2)>>8,c=255&a.charCodeAt(j/2),d=j/2+1<a.length?a.charCodeAt(j/2+1)>>8:NaN):(b=255&a.charCodeAt((j-1)/2),(j+1)/2<a.length?(c=a.charCodeAt((j+1)/2)>>8,d=255&a.charCodeAt((j+1)/2)):c=d=NaN),j+=3,e=b>>2,f=(3&b)<<4|c>>4,g=(15&c)<<2|d>>6,h=63&d,isNaN(c)||j==2*a.length+1&&k?g=h=64:(isNaN(d)||j==2*a.length&&k)&&(h=64),i.push(this._keyStr.charAt(e)),i.push(this._keyStr.charAt(f)),i.push(this._keyStr.charAt(g)),i.push(this._keyStr.charAt(h))
return i.join("")},compress:function(a){var b,c,d,e,f,g,h,i,j=[],k=1,l=0,m=!1
for(a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");l<a.length;)f=this._keyStr.indexOf(a.charAt(l++)),g=this._keyStr.indexOf(a.charAt(l++)),h=this._keyStr.indexOf(a.charAt(l++)),i=this._keyStr.indexOf(a.charAt(l++)),c=f<<2|g>>4,d=(15&g)<<4|h>>2,e=(3&h)<<6|i,k%2===0?(b=c<<8,m=!0,64!=h&&(j.push(String.fromCharCode(b|d)),m=!1),64!=i&&(b=e<<8,m=!0)):(j.push(String.fromCharCode(b|c)),m=!1,64!=h&&(b=d<<8,m=!0),64!=i&&(j.push(String.fromCharCode(b|e)),m=!1)),k+=3
return m?(j.push(String.fromCharCode(b)),j=j.join(""),j=String.fromCharCode(256|j.charCodeAt(0))+j.substring(1)):j=j.join(""),j}},function(a){function b(){var a=-1,b=this
b.append=function(c){var d,e=b.table
for(d=0;d<c.length;d++)a=a>>>8^e[255&(a^c[d])]},b.get=function(){return~a}}function c(a,b,c){return a.slice?a.slice(b,b+c):a.webkitSlice?a.webkitSlice(b,b+c):a.mozSlice?a.mozSlice(b,b+c):a.msSlice?a.msSlice(b,b+c):void 0}function d(a,b){var c,d
return c=new ArrayBuffer(a),d=new Uint8Array(c),b&&d.set(b,0),{buffer:c,array:d,view:new DataView(c)}}function e(){}function f(a){function b(b,c){var f=new Blob([a],{type:M})
d=new h(f),d.init(function(){e.size=d.size,b()},c)}function c(a,b,c,e){d.readUint8Array(a,b,c,e)}var d,e=this
e.size=0,e.init=b,e.readUint8Array=c}function g(b){function c(a){for(var c=b.length;"="==b.charAt(c-1);)c--
f=b.indexOf(",")+1,g.size=Math.floor(.75*(c-f)),a()}function e(c,e,g){var h,i=d(e),j=4*Math.floor(c/3),k=4*Math.ceil((c+e)/3),l=a.atob(b.substring(j+f,k+f)),m=c-3*Math.floor(j/4)
for(h=m;m+e>h;h++)i.array[h-m]=l.charCodeAt(h)
g(i.array)}var f,g=this
g.size=0,g.init=c,g.readUint8Array=e}function h(a){function b(b){this.size=a.size,b()}function d(b,d,e,f){var g=new FileReader
g.onload=function(a){e(new Uint8Array(a.target.result))},g.onerror=f,g.readAsArrayBuffer(c(a,b,d))}var e=this
e.size=0,e.init=b,e.readUint8Array=d}function i(){}function j(a,b){function c(a){f=new Blob([],{type:M}),a()}function d(a,b){f=new Blob([f,A?a:a.buffer],{type:M}),b()}function e(c,d){var e=new FileReader
e.onload=function(b){var d={string:b.target.result,token:a}
c(d)},e.onerror=d,e.readAsText(f,b)}var f,g=this
g.init=c,g.writeUint8Array=d,g.getData=e}function k(b){function c(a){g+="data:"+(b||"")+";base64,",a()}function d(b,c){var d,e=h.length,f=h
for(h="",d=0;d<3*Math.floor((e+b.length)/3)-e;d++)f+=String.fromCharCode(b[d])
for(;d<b.length;d++)h+=String.fromCharCode(b[d])
f.length>2?g+=a.btoa(f):h=f,c()}function e(b){b(g+a.btoa(h))}var f=this,g="",h=""
f.init=c,f.writeUint8Array=d,f.getData=e}function l(a,b){function c(a){f=new Blob([],{type:b}),a()}function d(c,d){f=new Blob([f,A?c:c.buffer],{type:b}),f.token=a,d()}function e(a){a(f)}var f,g=this
g.init=c,g.writeUint8Array=d,g.getData=e}function m(a,b,c,d,e,f,g,h,i,j){function k(){a.removeEventListener(N,l,!1),h(o)}function l(a){var b=a.data,d=b.data
b.onappend&&(o+=d.length,c.writeUint8Array(d,function(){f(!1,d),m()},j)),b.onflush&&(d?(o+=d.length,c.writeUint8Array(d,function(){f(!1,d),k()},j)):k()),b.progress&&g&&g(n+b.current,e)}function m(){n=p*J,e>n?b.readUint8Array(d+n,Math.min(J,e-n),function(b){a.postMessage({append:!0,data:b}),p++,g&&g(n,e),f(!0,b)},i):a.postMessage({flush:!0})}var n,o,p=0
o=0,a.addEventListener(N,l,!1),m()}function n(a,b,c,d,e,f,g,h,i,j){function k(){var o
l=m*J,e>l?b.readUint8Array(d+l,Math.min(J,e-l),function(b){var h=a.append(b,function(){g&&g(d+l,e)})
n+=h.length,f(!0,b),c.writeUint8Array(h,function(){f(!1,h),m++,setTimeout(k,1)},j),g&&g(l,e)},i):(o=a.flush(),o?(n+=o.length,c.writeUint8Array(o,function(){f(!1,o),h(n)},j)):h(n))}var l,m=0,n=0
k()}function o(c,d,e,f,g,h,i,j,k){function l(a,b){g&&!a&&q.append(b)}function o(a){h(a,q.get())}var p,q=new b
return a.zip.useWebWorkers?(p=new Worker(a.zip.workerScriptsPath+K),m(p,c,d,e,f,l,i,o,j,k)):n(new a.zip.Inflater,c,d,e,f,l,i,o,j,k),p}function p(c,d,e,f,g,h,i){function j(a,b){a&&p.append(b)}function k(a){f(a,p.get())}function l(){o.removeEventListener(N,l,!1),m(o,c,d,0,c.size,j,g,k,h,i)}var o,p=new b
return a.zip.useWebWorkers?(o=new Worker(a.zip.workerScriptsPath+L),o.addEventListener(N,l,!1),o.postMessage({init:!0,level:e})):n(new a.zip.Deflater,c,d,0,c.size,j,g,k,h,i),o}function q(a,c,d,e,f,g,h,i,j){function k(){var b=l*J
e>b?a.readUint8Array(d+b,Math.min(J,e-b),function(a){f&&m.append(a),h&&h(b,e,a),c.writeUint8Array(a,function(){l++,k()},j)},i):g(e,m.get())}var l=0,m=new b
k()}function r(a){var b,c,d="",e=["??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","_","_","_","??","??","??","??","??","??","??","??","+","+","??","??","+","+","-","-","+","-","+","??","??","+","+","-","-","??","-","+","??","??","??","??","??","??","i","??","??","??","+","+","_","_","??","??","_","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","??","_","??","??","??","??","??","??","??","??","??","??","??","_"," "]
for(b=0;b<a.length;b++)c=255&a.charCodeAt(b),d+=c>127?e[c-128]:String.fromCharCode(c)
return d}function s(a){return decodeURIComponent(escape(a))}function t(a){var b,c=""
for(b=0;b<a.length;b++)c+=String.fromCharCode(a[b])
return c}function u(a){var b=(4294901760&a)>>16,c=65535&a
try{return new Date(1980+((65024&b)>>9),((480&b)>>5)-1,31&b,(63488&c)>>11,(2016&c)>>5,2*(31&c),0)}catch(d){}}function v(a,b,c,d,e){return a.version=b.view.getUint16(c,!0),a.bitFlag=b.view.getUint16(c+2,!0),a.compressionMethod=b.view.getUint16(c+4,!0),a.lastModDateRaw=b.view.getUint32(c+6,!0),a.lastModDate=u(a.lastModDateRaw),1===(1&a.bitFlag)?void e(C):((d||8!=(8&a.bitFlag))&&(a.crc32=b.view.getUint32(c+10,!0),a.compressedSize=b.view.getUint32(c+14,!0),a.uncompressedSize=b.view.getUint32(c+18,!0)),4294967295===a.compressedSize||4294967295===a.uncompressedSize?void e(D):(a.filenameLength=b.view.getUint16(c+22,!0),void(a.extraFieldLength=b.view.getUint16(c+24,!0))))}function w(a,b){function c(){}function e(c,f){a.readUint8Array(a.size-c,c,function(a){var b=d(a.length,a).view
1347093766!=b.getUint32(0)?e(c+1,f):f(b)},function(){b(E)})}return c.prototype.getData=function(c,e,f,g){function h(a,b){m&&m.terminate(),m=null,a&&a(b)}function i(a){var b=d(4)
return b.view.setUint32(0,a),n.crc32==b.view.getUint32(0)}function j(a,b){g&&!i(b)?k():c.getData(function(a){h(e,a)})}function k(){h(b,H)}function l(){h(b,G)}var m,n=this
a.readUint8Array(n.offset,30,function(e){var h,i=d(e.length,e)
return 1347093252!=i.view.getUint32(0)?void b(B):(v(n,i,4,!1,b),h=n.offset+30+n.filenameLength+n.extraFieldLength,void c.init(function(){0===n.compressionMethod?q(a,c,h,n.compressedSize,g,j,f,k,l):m=o(a,c,h,n.compressedSize,g,j,f,k,l)},l))},k)},{getEntries:function(f){return a.size<22?void b(B):void e(22,function(e){var g,h
g=e.getUint32(16,!0),h=e.getUint16(8,!0),a.readUint8Array(g,a.size-g,function(a){var e,g,i,j,k=0,l=[],m=d(a.length,a)
for(e=0;h>e;e++){if(g=new c,1347092738!=m.view.getUint32(k))return void b(B)
v(g,m,k+6,!0,b),g.commentLength=m.view.getUint16(k+32,!0),g.directory=16==(16&m.view.getUint8(k+38)),g.offset=m.view.getUint32(k+42,!0),i=t(m.array.subarray(k+46,k+46+g.filenameLength)),g.filename=2048===(2048&g.bitFlag)?s(i):r(i),g.directory||"/"!=g.filename.charAt(g.filename.length-1)||(g.directory=!0),j=t(m.array.subarray(k+46+g.filenameLength+g.extraFieldLength,k+46+g.filenameLength+g.extraFieldLength+g.commentLength)),g.comment=2048===(2048&g.bitFlag)?s(j):r(j),l.push(g),k+=46+g.filenameLength+g.extraFieldLength+g.commentLength}f(l)},function(){b(E)})})},close:function(a){a&&a()}}}function x(a){return unescape(encodeURIComponent(a))}function y(a){var b,c=[]
for(b=0;b<a.length;b++)c.push(a.charCodeAt(b))
return c}function z(a,b,c){function e(a,b){h&&h.terminate(),h=null,a&&a(b)}function f(){e(b,F)}function g(){e(b,H)}var h,i={},j=[],k=0
return{add:function(l,m,n,o,r){function s(b){var e
z=r.lastModDate||new Date,v=d(26),i[l]={headerArray:v.array,directory:r.directory,filename:w,offset:k,comment:y(x(r.comment||""))},v.view.setUint32(0,335546376),r.version&&v.view.setUint8(0,r.version),c||0===r.level||r.directory||v.view.setUint16(4,2048),v.view.setUint16(6,(z.getHours()<<6|z.getMinutes())<<5|z.getSeconds()/2,!0),v.view.setUint16(8,(z.getFullYear()-1980<<4|z.getMonth()+1)<<5|z.getDate(),!0),v.view.setUint16(22,w.length,!0),e=d(30+w.length),e.view.setUint32(0,1347093252),e.array.set(v.array,4),e.array.set(w,30),k+=e.array.length,a.writeUint8Array(e.array,b,f)}function t(b,c){var g=d(16)
k+=b||0,g.view.setUint32(0,1347094280),"undefined"!=typeof c&&(v.view.setUint32(10,c,!0),g.view.setUint32(4,c,!0)),m&&(g.view.setUint32(8,b,!0),v.view.setUint32(14,b,!0),g.view.setUint32(12,m.size,!0),v.view.setUint32(18,m.size,!0)),a.writeUint8Array(g.array,function(){k+=16,e(n)},f)}function u(){return r=r||{},l=l.trim(),r.directory&&"/"!=l.charAt(l.length-1)&&(l+="/"),i.hasOwnProperty(l)?void b(I):(w=y(x(l)),j.push(l),void s(function(){m?c||0===r.level?q(m,a,0,m.size,!0,t,o,g,f):h=p(m,a,r.level,t,o,g,f):t()},f))}var v,w,z
m?m.init(u,g):u()},close:function(b){var c,g,h,l=0,m=0
for(g=0;g<j.length;g++)h=i[j[g]],l+=46+h.filename.length+h.comment.length
for(c=d(l+22),g=0;g<j.length;g++)h=i[j[g]],c.view.setUint32(m,1347092738),c.view.setUint16(m+4,5120),c.array.set(h.headerArray,m+6),c.view.setUint16(m+32,h.comment.length,!0),h.directory&&c.view.setUint8(m+38,16),c.view.setUint32(m+42,h.offset,!0),c.array.set(h.filename,m+46),c.array.set(h.comment,m+46+h.filename.length),m+=46+h.filename.length+h.comment.length
c.view.setUint32(m,1347093766),c.view.setUint16(m+8,j.length,!0),c.view.setUint16(m+10,j.length,!0),c.view.setUint32(m+12,l,!0),c.view.setUint32(m+16,k,!0),a.writeUint8Array(c.array,function(){e(function(){a.getData(b)})},f)}}}var A,B="File format is not recognized.",C="File contains encrypted entry.",D="File is using Zip64 (4gb+ file size).",E="Error while reading zip file.",F="Error while writing zip file.",G="Error while writing file data.",H="Error while reading file data.",I="File already exists.",J=524288,K="",L="deflate.js",M="text/plain",N="message"
try{A=0===new Blob([new DataView(new ArrayBuffer(0))]).size}catch(O){}b.prototype.table=function(){var a,b,c,d=[]
for(a=0;256>a;a++){for(c=a,b=0;8>b;b++)1&c?c=c>>>1^3988292384:c>>>=1
d[a]=c}return d}(),f.prototype=new e,f.prototype.constructor=f,g.prototype=new e,g.prototype.constructor=g,h.prototype=new e,h.prototype.constructor=h,i.prototype.getData=function(a){a(this.data)},j.prototype=new i,j.prototype.constructor=j,k.prototype=new i,k.prototype.constructor=k,l.prototype=new i,l.prototype.constructor=l,a.zip={Reader:e,Writer:i,BlobReader:h,Data64URIReader:g,TextReader:f,BlobWriter:l,Data64URIWriter:k,TextWriter:j,createReader:function(a,b,c){a.init(function(){b(w(a,c))},c)},createWriter:function(a,b,c,d){a.init(function(){b(z(a,c,d))},c)},workerScriptsPath:"",useWebWorkers:!0}}(O.esri),O.esri.TPK.autoCenterMap=function(a,b){function c(a){var b="onorientationchange"in window,c=b?"orientationchange":"resize"
window.addEventListener(c,e(function(){d()},a))}function d(){require(["esri/geometry/Point","esri/SpatialReference"],function(b,c){var d=i().split(","),e=a.spatialReference.wkid,f=null
4326==e?f=new b(d[1],d[0]):102100==e&&(f=new b(d[0],d[1],new c({wkid:e}))),a.centerAt(f)})}function e(a,b,c){var d
return function(){var e=this,f=arguments
clearTimeout(d),d=setTimeout(function(){d=null,c||a.apply(e,f)},b),c&&!d&&a.apply(e,f)}}function f(){a.on("pan-end",function(){var b=a.extent.getCenter()
h(b.x,b.y,a.spatialReference.wkid)})}function g(){a.on("zoom-end",function(){var b=a.extent.getCenter()
h(b.x,b.y,a.spatialReference.wkid),a.setZoom(a.getZoom())})}function h(a,b,c){localStorage.setItem("_centerPtX",a),localStorage.setItem("_centerPtY",b),localStorage.setItem("_spatialReference",c)}function i(){var a=null
try{a=localStorage.getItem("_centerPtX")+","+localStorage.getItem("_centerPtY")+","+localStorage.getItem("_spatialReference")}catch(b){}return a}this.init=function(){f(),g(),c(b)
var d=a.extent.getCenter()
h(d.x,d.y,a.spatialReference.wkid)}},O.esri.TPK.inflate=function(a){function b(){function a(a,b,c,d,j,k,l,n,p,r,s){var t,u,v,w,x,y,z,A,C,D,E,F,G,H,I
D=0,x=c
do e[a[b+D]]++,D++,x--
while(0!==x)
if(e[0]==c)return l[0]=-1,n[0]=0,i
for(A=n[0],y=1;B>=y&&0===e[y];y++);for(z=y,y>A&&(A=y),x=B;0!==x&&0===e[x];x--);for(v=x,A>x&&(A=x),n[0]=A,H=1<<y;x>y;y++,H<<=1)if((H-=e[y])<0)return m
if((H-=e[x])<0)return m
for(e[x]+=H,h[1]=y=0,D=1,G=2;0!==--x;)h[G]=y+=e[D],G++,D++
x=0,D=0
do 0!==(y=a[b+D])&&(s[h[y]++]=x),D++
while(++x<c)
for(c=h[v],h[0]=x=0,D=0,w=-1,F=-A,g[0]=0,E=0,I=0;v>=z;z++)for(t=e[z];0!==t--;){for(;z>F+A;){if(w++,F+=A,I=v-F,I=I>A?A:I,(u=1<<(y=z-F))>t+1&&(u-=t+1,G=z,I>y))for(;++y<I&&!((u<<=1)<=e[++G]);)u-=e[G]
if(I=1<<y,r[0]+I>q)return m
g[w]=E=r[0],r[0]+=I,0!==w?(h[w]=x,f[0]=y,f[1]=A,y=x>>>F-A,f[2]=E-g[w-1]-y,p.set(f,3*(g[w-1]+y))):l[0]=E}for(f[1]=z-F,D>=c?f[0]=192:s[D]<d?(f[0]=s[D]<256?0:96,f[2]=s[D++]):(f[0]=k[s[D]-d]+16+64,f[2]=j[s[D++]-d]),u=1<<z-F,y=x>>>F;I>y;y+=u)p.set(f,3*(E+y))
for(y=1<<z-1;0!==(x&y);y>>>=1)x^=y
for(x^=y,C=(1<<F)-1;(x&C)!=h[w];)w--,F-=A,C=(1<<F)-1}return 0!==H&&1!=v?o:i}function b(a){var b
for(c||(c=[],d=[],e=new Int32Array(B+1),f=[],g=new Int32Array(B),h=new Int32Array(B+1)),d.length<a&&(d=[]),b=0;a>b;b++)d[b]=0
for(b=0;B+1>b;b++)e[b]=0
for(b=0;3>b;b++)f[b]=0
g.set(e.subarray(0,B),0),h.set(e.subarray(0,B+1),0)}var c,d,e,f,g,h,j=this
j.inflate_trees_bits=function(e,f,g,h,i){var j
return b(19),c[0]=0,j=a(e,0,19,19,null,null,g,f,h,c,d),j==m?i.msg="oversubscribed dynamic bit lengths tree":j!=o&&0!==f[0]||(i.msg="incomplete dynamic bit lengths tree",j=m),j},j.inflate_trees_dynamic=function(e,f,g,h,j,k,l,p,q){var r
return b(288),c[0]=0,r=a(g,0,e,257,x,y,k,h,p,c,d),r!=i||0===h[0]?(r==m?q.msg="oversubscribed literal/length tree":r!=n&&(q.msg="incomplete literal/length tree",r=m),r):(b(288),r=a(g,e,f,0,z,A,l,j,p,c,d),r!=i||0===j[0]&&e>257?(r==m?q.msg="oversubscribed distance tree":r==o?(q.msg="incomplete distance tree",r=m):r!=n&&(q.msg="empty distance tree with lengths",r=m),r):i)}}function c(){function a(a,b,c,d,e,f,g,h){var k,l,n,o,q,r,s,t,u,v,w,x,y,z,A,B
s=h.next_in_index,t=h.avail_in,q=g.bitb,r=g.bitk,u=g.write,v=u<g.read?g.read-u-1:g.end-u,w=p[a],x=p[b]
do{for(;20>r;)t--,q|=(255&h.read_byte(s++))<<r,r+=8
if(k=q&w,l=c,n=d,B=3*(n+k),0!==(o=l[B]))for(;;){if(q>>=l[B+1],r-=l[B+1],0!==(16&o)){for(o&=15,y=l[B+2]+(q&p[o]),q>>=o,r-=o;15>r;)t--,q|=(255&h.read_byte(s++))<<r,r+=8
for(k=q&x,l=e,n=f,B=3*(n+k),o=l[B];;){if(q>>=l[B+1],r-=l[B+1],0!==(16&o)){for(o&=15;o>r;)t--,q|=(255&h.read_byte(s++))<<r,r+=8
if(z=l[B+2]+(q&p[o]),q>>=o,r-=o,v-=y,u>=z)A=u-z,u-A>0&&2>u-A?(g.window[u++]=g.window[A++],g.window[u++]=g.window[A++],y-=2):(g.window.set(g.window.subarray(A,A+2),u),u+=2,A+=2,y-=2)
else{A=u-z
do A+=g.end
while(0>A)
if(o=g.end-A,y>o){if(y-=o,u-A>0&&o>u-A){do g.window[u++]=g.window[A++]
while(0!==--o)}else g.window.set(g.window.subarray(A,A+o),u),u+=o,A+=o,o=0
A=0}}if(u-A>0&&y>u-A){do g.window[u++]=g.window[A++]
while(0!==--y)}else g.window.set(g.window.subarray(A,A+y),u),u+=y,A+=y,y=0
break}if(0!==(64&o))return h.msg="invalid distance code",y=h.avail_in-t,y=y>r>>3?r>>3:y,t+=y,s-=y,r-=y<<3,g.bitb=q,g.bitk=r,h.avail_in=t,h.total_in+=s-h.next_in_index,h.next_in_index=s,g.write=u,m
k+=l[B+2],k+=q&p[o],B=3*(n+k),o=l[B]}break}if(0!==(64&o))return 0!==(32&o)?(y=h.avail_in-t,y=y>r>>3?r>>3:y,t+=y,s-=y,r-=y<<3,g.bitb=q,g.bitk=r,h.avail_in=t,h.total_in+=s-h.next_in_index,h.next_in_index=s,g.write=u,j):(h.msg="invalid literal/length code",y=h.avail_in-t,y=y>r>>3?r>>3:y,t+=y,s-=y,r-=y<<3,g.bitb=q,g.bitk=r,h.avail_in=t,h.total_in+=s-h.next_in_index,h.next_in_index=s,g.write=u,m)
if(k+=l[B+2],k+=q&p[o],B=3*(n+k),0===(o=l[B])){q>>=l[B+1],r-=l[B+1],g.window[u++]=l[B+2],v--
break}}else q>>=l[B+1],r-=l[B+1],g.window[u++]=l[B+2],v--}while(v>=258&&t>=10)
return y=h.avail_in-t,y=y>r>>3?r>>3:y,t+=y,s-=y,r-=y<<3,g.bitb=q,g.bitk=r,h.avail_in=t,h.total_in+=s-h.next_in_index,h.next_in_index=s,g.write=u,i}var b,c,d,e,f=this,g=0,h=0,k=0,n=0,o=0,q=0,r=0,s=0,t=0,u=0
f.init=function(a,f,g,h,i,j){b=C,r=a,s=f,d=g,t=h,e=i,u=j,c=null},f.proc=function(f,v,w){var x,y,z,A,B,M,N,O=0,P=0,Q=0
for(Q=v.next_in_index,A=v.avail_in,O=f.bitb,P=f.bitk,B=f.write,M=B<f.read?f.read-B-1:f.end-B;;)switch(b){case C:if(M>=258&&A>=10&&(f.bitb=O,f.bitk=P,v.avail_in=A,v.total_in+=Q-v.next_in_index,v.next_in_index=Q,f.write=B,w=a(r,s,d,t,e,u,f,v),Q=v.next_in_index,A=v.avail_in,O=f.bitb,P=f.bitk,B=f.write,M=B<f.read?f.read-B-1:f.end-B,w!=i)){b=w==j?J:L
break}k=r,c=d,h=t,b=D
case D:for(x=k;x>P;){if(0===A)return f.bitb=O,f.bitk=P,v.avail_in=A,v.total_in+=Q-v.next_in_index,v.next_in_index=Q,f.write=B,f.inflate_flush(v,w)
w=i,A--,O|=(255&v.read_byte(Q++))<<P,P+=8}if(y=3*(h+(O&p[x])),O>>>=c[y+1],P-=c[y+1],z=c[y],0===z){n=c[y+2],b=I
break}if(0!==(16&z)){o=15&z,g=c[y+2],b=E
break}if(0===(64&z)){k=z,h=y/3+c[y+2]
break}if(0!==(32&z)){b=J
break}return b=L,v.msg="invalid literal/length code",w=m,f.bitb=O,f.bitk=P,v.avail_in=A,v.total_in+=Q-v.next_in_index,v.next_in_index=Q,f.write=B,f.inflate_flush(v,w)
case E:for(x=o;x>P;){if(0===A)return f.bitb=O,f.bitk=P,v.avail_in=A,v.total_in+=Q-v.next_in_index,v.next_in_index=Q,f.write=B,f.inflate_flush(v,w)
w=i,A--,O|=(255&v.read_byte(Q++))<<P,P+=8}g+=O&p[x],O>>=x,P-=x,k=s,c=e,h=u,b=F
case F:for(x=k;x>P;){if(0===A)return f.bitb=O,f.bitk=P,v.avail_in=A,v.total_in+=Q-v.next_in_index,v.next_in_index=Q,f.write=B,f.inflate_flush(v,w)
w=i,A--,O|=(255&v.read_byte(Q++))<<P,P+=8}if(y=3*(h+(O&p[x])),O>>=c[y+1],P-=c[y+1],z=c[y],0!==(16&z)){o=15&z,q=c[y+2],b=G
break}if(0===(64&z)){k=z,h=y/3+c[y+2]
break}return b=L,v.msg="invalid distance code",w=m,f.bitb=O,f.bitk=P,v.avail_in=A,v.total_in+=Q-v.next_in_index,v.next_in_index=Q,f.write=B,f.inflate_flush(v,w)
case G:for(x=o;x>P;){if(0===A)return f.bitb=O,f.bitk=P,v.avail_in=A,v.total_in+=Q-v.next_in_index,v.next_in_index=Q,f.write=B,f.inflate_flush(v,w)
w=i,A--,O|=(255&v.read_byte(Q++))<<P,P+=8}q+=O&p[x],O>>=x,P-=x,b=H
case H:for(N=B-q;0>N;)N+=f.end
for(;0!==g;){if(0===M&&(B==f.end&&0!==f.read&&(B=0,M=B<f.read?f.read-B-1:f.end-B),0===M&&(f.write=B,w=f.inflate_flush(v,w),B=f.write,M=B<f.read?f.read-B-1:f.end-B,B==f.end&&0!==f.read&&(B=0,M=B<f.read?f.read-B-1:f.end-B),0===M)))return f.bitb=O,f.bitk=P,v.avail_in=A,v.total_in+=Q-v.next_in_index,v.next_in_index=Q,f.write=B,f.inflate_flush(v,w)
f.window[B++]=f.window[N++],M--,N==f.end&&(N=0),g--}b=C
break
case I:if(0===M&&(B==f.end&&0!==f.read&&(B=0,M=B<f.read?f.read-B-1:f.end-B),0===M&&(f.write=B,w=f.inflate_flush(v,w),B=f.write,M=B<f.read?f.read-B-1:f.end-B,B==f.end&&0!==f.read&&(B=0,M=B<f.read?f.read-B-1:f.end-B),0===M)))return f.bitb=O,f.bitk=P,v.avail_in=A,v.total_in+=Q-v.next_in_index,v.next_in_index=Q,f.write=B,f.inflate_flush(v,w)
w=i,f.window[B++]=n,M--,b=C
break
case J:if(P>7&&(P-=8,A++,Q--),f.write=B,w=f.inflate_flush(v,w),B=f.write,M=B<f.read?f.read-B-1:f.end-B,f.read!=f.write)return f.bitb=O,f.bitk=P,v.avail_in=A,v.total_in+=Q-v.next_in_index,v.next_in_index=Q,f.write=B,f.inflate_flush(v,w)
b=K
case K:return w=j,f.bitb=O,f.bitk=P,v.avail_in=A,v.total_in+=Q-v.next_in_index,v.next_in_index=Q,f.write=B,f.inflate_flush(v,w)
case L:return w=m,f.bitb=O,f.bitk=P,v.avail_in=A,v.total_in+=Q-v.next_in_index,v.next_in_index=Q,f.write=B,f.inflate_flush(v,w)
default:return w=l,f.bitb=O,f.bitk=P,v.avail_in=A,v.total_in+=Q-v.next_in_index,v.next_in_index=Q,f.write=B,f.inflate_flush(v,w)}},f.free=function(){}}function d(a,d){var e,f=this,g=N,h=0,k=0,n=0,r=[0],s=[0],t=new c,u=0,v=new Int32Array(3*q),w=0,x=new b
f.bitk=0,f.bitb=0,f.window=new Uint8Array(d),f.end=d,f.read=0,f.write=0,f.reset=function(a,b){b&&(b[0]=w),g==T&&t.free(a),g=N,f.bitk=0,f.bitb=0,f.read=f.write=0},f.reset(a,null),f.inflate_flush=function(a,b){var c,d,e
return d=a.next_out_index,e=f.read,c=(e<=f.write?f.write:f.end)-e,c>a.avail_out&&(c=a.avail_out),0!==c&&b==o&&(b=i),a.avail_out-=c,a.total_out+=c,a.next_out.set(f.window.subarray(e,e+c),d),d+=c,e+=c,e==f.end&&(e=0,f.write==f.end&&(f.write=0),c=f.write-e,c>a.avail_out&&(c=a.avail_out),0!==c&&b==o&&(b=i),a.avail_out-=c,a.total_out+=c,a.next_out.set(f.window.subarray(e,e+c),d),d+=c,e+=c),a.next_out_index=d,f.read=e,b},f.proc=function(a,c){var d,o,q,w,y,z,A,B
for(w=a.next_in_index,y=a.avail_in,o=f.bitb,q=f.bitk,z=f.write,A=z<f.read?f.read-z-1:f.end-z;;)switch(g){case N:for(;3>q;){if(0===y)return f.bitb=o,f.bitk=q,a.avail_in=y,a.total_in+=w-a.next_in_index,a.next_in_index=w,f.write=z,f.inflate_flush(a,c)
c=i,y--,o|=(255&a.read_byte(w++))<<q,q+=8}switch(d=7&o,u=1&d,d>>>1){case 0:o>>>=3,q-=3,d=7&q,o>>>=d,q-=d,g=O
break
case 1:var C=[],D=[],E=[[]],F=[[]]
b.inflate_trees_fixed(C,D,E,F),t.init(C[0],D[0],E[0],0,F[0],0),o>>>=3,q-=3,g=T
break
case 2:o>>>=3,q-=3,g=Q
break
case 3:return o>>>=3,q-=3,g=W,a.msg="invalid block type",c=m,f.bitb=o,f.bitk=q,a.avail_in=y,a.total_in+=w-a.next_in_index,a.next_in_index=w,f.write=z,f.inflate_flush(a,c)}break
case O:for(;32>q;){if(0===y)return f.bitb=o,f.bitk=q,a.avail_in=y,a.total_in+=w-a.next_in_index,a.next_in_index=w,f.write=z,f.inflate_flush(a,c)
c=i,y--,o|=(255&a.read_byte(w++))<<q,q+=8}if((~o>>>16&65535)!=(65535&o))return g=W,a.msg="invalid stored block lengths",c=m,f.bitb=o,f.bitk=q,a.avail_in=y,a.total_in+=w-a.next_in_index,a.next_in_index=w,f.write=z,f.inflate_flush(a,c)
h=65535&o,o=q=0,g=0!==h?P:0!==u?U:N
break
case P:if(0===y)return f.bitb=o,f.bitk=q,a.avail_in=y,a.total_in+=w-a.next_in_index,a.next_in_index=w,f.write=z,f.inflate_flush(a,c)
if(0===A&&(z==f.end&&0!==f.read&&(z=0,A=z<f.read?f.read-z-1:f.end-z),0===A&&(f.write=z,c=f.inflate_flush(a,c),z=f.write,A=z<f.read?f.read-z-1:f.end-z,z==f.end&&0!==f.read&&(z=0,A=z<f.read?f.read-z-1:f.end-z),0===A)))return f.bitb=o,f.bitk=q,a.avail_in=y,a.total_in+=w-a.next_in_index,a.next_in_index=w,f.write=z,f.inflate_flush(a,c)
if(c=i,d=h,d>y&&(d=y),d>A&&(d=A),f.window.set(a.read_buf(w,d),z),w+=d,y-=d,z+=d,A-=d,0!==(h-=d))break
g=0!==u?U:N
break
case Q:for(;14>q;){if(0===y)return f.bitb=o,f.bitk=q,a.avail_in=y,a.total_in+=w-a.next_in_index,a.next_in_index=w,f.write=z,f.inflate_flush(a,c)
c=i,y--,o|=(255&a.read_byte(w++))<<q,q+=8}if(k=d=16383&o,(31&d)>29||(d>>5&31)>29)return g=W,a.msg="too many length or distance symbols",c=m,f.bitb=o,f.bitk=q,a.avail_in=y,a.total_in+=w-a.next_in_index,a.next_in_index=w,f.write=z,f.inflate_flush(a,c)
if(d=258+(31&d)+(d>>5&31),!e||e.length<d)e=[]
else for(B=0;d>B;B++)e[B]=0
o>>>=14,q-=14,n=0,g=R
case R:for(;4+(k>>>10)>n;){for(;3>q;){if(0===y)return f.bitb=o,f.bitk=q,a.avail_in=y,a.total_in+=w-a.next_in_index,a.next_in_index=w,f.write=z,f.inflate_flush(a,c)
c=i,y--,o|=(255&a.read_byte(w++))<<q,q+=8}e[M[n++]]=7&o,o>>>=3,q-=3}for(;19>n;)e[M[n++]]=0
if(r[0]=7,d=x.inflate_trees_bits(e,r,s,v,a),d!=i)return c=d,c==m&&(e=null,g=W),f.bitb=o,f.bitk=q,a.avail_in=y,a.total_in+=w-a.next_in_index,a.next_in_index=w,f.write=z,f.inflate_flush(a,c)
n=0,g=S
case S:for(;;){if(d=k,!(258+(31&d)+(d>>5&31)>n))break
var G,H
for(d=r[0];d>q;){if(0===y)return f.bitb=o,f.bitk=q,a.avail_in=y,a.total_in+=w-a.next_in_index,a.next_in_index=w,f.write=z,f.inflate_flush(a,c)
c=i,y--,o|=(255&a.read_byte(w++))<<q,q+=8}if(d=v[3*(s[0]+(o&p[d]))+1],H=v[3*(s[0]+(o&p[d]))+2],16>H)o>>>=d,q-=d,e[n++]=H
else{for(B=18==H?7:H-14,G=18==H?11:3;d+B>q;){if(0===y)return f.bitb=o,f.bitk=q,a.avail_in=y,a.total_in+=w-a.next_in_index,a.next_in_index=w,f.write=z,f.inflate_flush(a,c)
c=i,y--,o|=(255&a.read_byte(w++))<<q,q+=8}if(o>>>=d,q-=d,G+=o&p[B],o>>>=B,q-=B,B=n,d=k,B+G>258+(31&d)+(d>>5&31)||16==H&&1>B)return e=null,g=W,a.msg="invalid bit length repeat",c=m,f.bitb=o,f.bitk=q,a.avail_in=y,a.total_in+=w-a.next_in_index,a.next_in_index=w,f.write=z,f.inflate_flush(a,c)
H=16==H?e[B-1]:0
do e[B++]=H
while(0!==--G)
n=B}}s[0]=-1
var I=[],J=[],K=[],L=[]
if(I[0]=9,J[0]=6,d=k,d=x.inflate_trees_dynamic(257+(31&d),1+(d>>5&31),e,I,J,K,L,v,a),d!=i)return d==m&&(e=null,g=W),c=d,f.bitb=o,f.bitk=q,a.avail_in=y,a.total_in+=w-a.next_in_index,a.next_in_index=w,f.write=z,f.inflate_flush(a,c)
t.init(I[0],J[0],v,K[0],v,L[0]),g=T
case T:if(f.bitb=o,f.bitk=q,a.avail_in=y,a.total_in+=w-a.next_in_index,a.next_in_index=w,f.write=z,(c=t.proc(f,a,c))!=j)return f.inflate_flush(a,c)
if(c=i,t.free(a),w=a.next_in_index,y=a.avail_in,o=f.bitb,q=f.bitk,z=f.write,A=z<f.read?f.read-z-1:f.end-z,0===u){g=N
break}g=U
case U:if(f.write=z,c=f.inflate_flush(a,c),z=f.write,A=z<f.read?f.read-z-1:f.end-z,f.read!=f.write)return f.bitb=o,f.bitk=q,a.avail_in=y,a.total_in+=w-a.next_in_index,a.next_in_index=w,f.write=z,f.inflate_flush(a,c)
g=V
case V:return c=j,f.bitb=o,f.bitk=q,a.avail_in=y,a.total_in+=w-a.next_in_index,a.next_in_index=w,f.write=z,f.inflate_flush(a,c)
case W:return c=m,f.bitb=o,f.bitk=q,a.avail_in=y,a.total_in+=w-a.next_in_index,a.next_in_index=w,f.write=z,f.inflate_flush(a,c)
default:return c=l,f.bitb=o,f.bitk=q,a.avail_in=y,a.total_in+=w-a.next_in_index,a.next_in_index=w,f.write=z,f.inflate_flush(a,c)}},f.free=function(a){f.reset(a,null),f.window=null,v=null},f.set_dictionary=function(a,b,c){f.window.set(a.subarray(b,b+c),0),f.read=f.write=c},f.sync_point=function(){return g==O?1:0}}function e(){function a(a){return a&&a.istate?(a.total_in=a.total_out=0,a.msg=null,a.istate.mode=ea,a.istate.blocks.reset(a,null),i):l}var b=this
b.mode=0,b.method=0,b.was=[0],b.need=0,b.marker=0,b.wbits=0,b.inflateEnd=function(a){return b.blocks&&b.blocks.free(a),b.blocks=null,i},b.inflateInit=function(c,e){return c.msg=null,b.blocks=null,8>e||e>15?(b.inflateEnd(c),l):(b.wbits=e,c.istate.blocks=new d(c,1<<e),a(c),i)},b.inflate=function(a,b){var c,d
if(!a||!a.istate||!a.next_in)return l
for(b=b==s?o:i,c=o;;)switch(a.istate.mode){case Z:if(0===a.avail_in)return c
if(c=b,a.avail_in--,a.total_in++,(15&(a.istate.method=a.read_byte(a.next_in_index++)))!=Y){a.istate.mode=ga,a.msg="unknown compression method",a.istate.marker=5
break}if((a.istate.method>>4)+8>a.istate.wbits){a.istate.mode=ga,a.msg="invalid window size",a.istate.marker=5
break}a.istate.mode=$
case $:if(0===a.avail_in)return c
if(c=b,a.avail_in--,a.total_in++,d=255&a.read_byte(a.next_in_index++),((a.istate.method<<8)+d)%31!==0){a.istate.mode=ga,a.msg="incorrect header check",a.istate.marker=5
break}if(0===(d&X)){a.istate.mode=ea
break}a.istate.mode=_
case _:if(0===a.avail_in)return c
c=b,a.avail_in--,a.total_in++,a.istate.need=(255&a.read_byte(a.next_in_index++))<<24&4278190080,a.istate.mode=aa
case aa:if(0===a.avail_in)return c
c=b,a.avail_in--,a.total_in++,a.istate.need+=(255&a.read_byte(a.next_in_index++))<<16&16711680,a.istate.mode=ba
case ba:if(0===a.avail_in)return c
c=b,a.avail_in--,a.total_in++,a.istate.need+=(255&a.read_byte(a.next_in_index++))<<8&65280,a.istate.mode=ca
case ca:return 0===a.avail_in?c:(c=b,a.avail_in--,a.total_in++,a.istate.need+=255&a.read_byte(a.next_in_index++),a.istate.mode=da,k)
case da:return a.istate.mode=ga,a.msg="need dictionary",a.istate.marker=0,l
case ea:if(c=a.istate.blocks.proc(a,c),c==m){a.istate.mode=ga,a.istate.marker=0
break}if(c==i&&(c=b),c!=j)return c
c=b,a.istate.blocks.reset(a,a.istate.was),a.istate.mode=fa
case fa:return j
case ga:return m
default:return l}},b.inflateSetDictionary=function(a,b,c){var d=0,e=c
return a&&a.istate&&a.istate.mode==da?(e>=1<<a.istate.wbits&&(e=(1<<a.istate.wbits)-1,d=c-e),a.istate.blocks.set_dictionary(b,d,e),a.istate.mode=ea,i):l},b.inflateSync=function(b){var c,d,e,f,g
if(!b||!b.istate)return l
if(b.istate.mode!=ga&&(b.istate.mode=ga,b.istate.marker=0),0===(c=b.avail_in))return o
for(d=b.next_in_index,e=b.istate.marker;0!==c&&4>e;)b.read_byte(d)==ha[e]?e++:e=0!==b.read_byte(d)?0:4-e,d++,c--
return b.total_in+=d-b.next_in_index,b.next_in_index=d,b.avail_in=c,b.istate.marker=e,4!=e?m:(f=b.total_in,g=b.total_out,a(b),b.total_in=f,b.total_out=g,b.istate.mode=ea,i)},b.inflateSyncPoint=function(a){return a&&a.istate&&a.istate.blocks?a.istate.blocks.sync_point():l}}function f(){}function g(){var a=this,b=new f,c=512,d=r,e=new Uint8Array(c),g=!1
b.inflateInit(),b.next_out=e,a.append=function(a,f){var h,k,l=[],m=0,n=0,p=0
if(0!==a.length){b.next_in_index=0,b.next_in=a,b.avail_in=a.length
do{if(b.next_out_index=0,b.avail_out=c,0!==b.avail_in||g||(b.next_in_index=0,g=!0),h=b.inflate(d),g&&h==o)return-1
if(h!=i&&h!=j)throw"inflating: "+b.msg
if((g||h==j)&&b.avail_in==a.length)return-1
b.next_out_index&&(b.next_out_index==c?l.push(new Uint8Array(e)):l.push(new Uint8Array(e.subarray(0,b.next_out_index)))),p+=b.next_out_index,f&&b.next_in_index>0&&b.next_in_index!=m&&(f(b.next_in_index),m=b.next_in_index)}while(b.avail_in>0||0===b.avail_out)
return k=new Uint8Array(p),l.forEach(function(a){k.set(a,n),n+=a.length}),k}},a.flush=function(){b.inflateEnd()}}var h=15,i=0,j=1,k=2,l=-2,m=-3,n=-4,o=-5,p=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535],q=1440,r=0,s=4,t=9,u=5,v=[96,7,256,0,8,80,0,8,16,84,8,115,82,7,31,0,8,112,0,8,48,0,9,192,80,7,10,0,8,96,0,8,32,0,9,160,0,8,0,0,8,128,0,8,64,0,9,224,80,7,6,0,8,88,0,8,24,0,9,144,83,7,59,0,8,120,0,8,56,0,9,208,81,7,17,0,8,104,0,8,40,0,9,176,0,8,8,0,8,136,0,8,72,0,9,240,80,7,4,0,8,84,0,8,20,85,8,227,83,7,43,0,8,116,0,8,52,0,9,200,81,7,13,0,8,100,0,8,36,0,9,168,0,8,4,0,8,132,0,8,68,0,9,232,80,7,8,0,8,92,0,8,28,0,9,152,84,7,83,0,8,124,0,8,60,0,9,216,82,7,23,0,8,108,0,8,44,0,9,184,0,8,12,0,8,140,0,8,76,0,9,248,80,7,3,0,8,82,0,8,18,85,8,163,83,7,35,0,8,114,0,8,50,0,9,196,81,7,11,0,8,98,0,8,34,0,9,164,0,8,2,0,8,130,0,8,66,0,9,228,80,7,7,0,8,90,0,8,26,0,9,148,84,7,67,0,8,122,0,8,58,0,9,212,82,7,19,0,8,106,0,8,42,0,9,180,0,8,10,0,8,138,0,8,74,0,9,244,80,7,5,0,8,86,0,8,22,192,8,0,83,7,51,0,8,118,0,8,54,0,9,204,81,7,15,0,8,102,0,8,38,0,9,172,0,8,6,0,8,134,0,8,70,0,9,236,80,7,9,0,8,94,0,8,30,0,9,156,84,7,99,0,8,126,0,8,62,0,9,220,82,7,27,0,8,110,0,8,46,0,9,188,0,8,14,0,8,142,0,8,78,0,9,252,96,7,256,0,8,81,0,8,17,85,8,131,82,7,31,0,8,113,0,8,49,0,9,194,80,7,10,0,8,97,0,8,33,0,9,162,0,8,1,0,8,129,0,8,65,0,9,226,80,7,6,0,8,89,0,8,25,0,9,146,83,7,59,0,8,121,0,8,57,0,9,210,81,7,17,0,8,105,0,8,41,0,9,178,0,8,9,0,8,137,0,8,73,0,9,242,80,7,4,0,8,85,0,8,21,80,8,258,83,7,43,0,8,117,0,8,53,0,9,202,81,7,13,0,8,101,0,8,37,0,9,170,0,8,5,0,8,133,0,8,69,0,9,234,80,7,8,0,8,93,0,8,29,0,9,154,84,7,83,0,8,125,0,8,61,0,9,218,82,7,23,0,8,109,0,8,45,0,9,186,0,8,13,0,8,141,0,8,77,0,9,250,80,7,3,0,8,83,0,8,19,85,8,195,83,7,35,0,8,115,0,8,51,0,9,198,81,7,11,0,8,99,0,8,35,0,9,166,0,8,3,0,8,131,0,8,67,0,9,230,80,7,7,0,8,91,0,8,27,0,9,150,84,7,67,0,8,123,0,8,59,0,9,214,82,7,19,0,8,107,0,8,43,0,9,182,0,8,11,0,8,139,0,8,75,0,9,246,80,7,5,0,8,87,0,8,23,192,8,0,83,7,51,0,8,119,0,8,55,0,9,206,81,7,15,0,8,103,0,8,39,0,9,174,0,8,7,0,8,135,0,8,71,0,9,238,80,7,9,0,8,95,0,8,31,0,9,158,84,7,99,0,8,127,0,8,63,0,9,222,82,7,27,0,8,111,0,8,47,0,9,190,0,8,15,0,8,143,0,8,79,0,9,254,96,7,256,0,8,80,0,8,16,84,8,115,82,7,31,0,8,112,0,8,48,0,9,193,80,7,10,0,8,96,0,8,32,0,9,161,0,8,0,0,8,128,0,8,64,0,9,225,80,7,6,0,8,88,0,8,24,0,9,145,83,7,59,0,8,120,0,8,56,0,9,209,81,7,17,0,8,104,0,8,40,0,9,177,0,8,8,0,8,136,0,8,72,0,9,241,80,7,4,0,8,84,0,8,20,85,8,227,83,7,43,0,8,116,0,8,52,0,9,201,81,7,13,0,8,100,0,8,36,0,9,169,0,8,4,0,8,132,0,8,68,0,9,233,80,7,8,0,8,92,0,8,28,0,9,153,84,7,83,0,8,124,0,8,60,0,9,217,82,7,23,0,8,108,0,8,44,0,9,185,0,8,12,0,8,140,0,8,76,0,9,249,80,7,3,0,8,82,0,8,18,85,8,163,83,7,35,0,8,114,0,8,50,0,9,197,81,7,11,0,8,98,0,8,34,0,9,165,0,8,2,0,8,130,0,8,66,0,9,229,80,7,7,0,8,90,0,8,26,0,9,149,84,7,67,0,8,122,0,8,58,0,9,213,82,7,19,0,8,106,0,8,42,0,9,181,0,8,10,0,8,138,0,8,74,0,9,245,80,7,5,0,8,86,0,8,22,192,8,0,83,7,51,0,8,118,0,8,54,0,9,205,81,7,15,0,8,102,0,8,38,0,9,173,0,8,6,0,8,134,0,8,70,0,9,237,80,7,9,0,8,94,0,8,30,0,9,157,84,7,99,0,8,126,0,8,62,0,9,221,82,7,27,0,8,110,0,8,46,0,9,189,0,8,14,0,8,142,0,8,78,0,9,253,96,7,256,0,8,81,0,8,17,85,8,131,82,7,31,0,8,113,0,8,49,0,9,195,80,7,10,0,8,97,0,8,33,0,9,163,0,8,1,0,8,129,0,8,65,0,9,227,80,7,6,0,8,89,0,8,25,0,9,147,83,7,59,0,8,121,0,8,57,0,9,211,81,7,17,0,8,105,0,8,41,0,9,179,0,8,9,0,8,137,0,8,73,0,9,243,80,7,4,0,8,85,0,8,21,80,8,258,83,7,43,0,8,117,0,8,53,0,9,203,81,7,13,0,8,101,0,8,37,0,9,171,0,8,5,0,8,133,0,8,69,0,9,235,80,7,8,0,8,93,0,8,29,0,9,155,84,7,83,0,8,125,0,8,61,0,9,219,82,7,23,0,8,109,0,8,45,0,9,187,0,8,13,0,8,141,0,8,77,0,9,251,80,7,3,0,8,83,0,8,19,85,8,195,83,7,35,0,8,115,0,8,51,0,9,199,81,7,11,0,8,99,0,8,35,0,9,167,0,8,3,0,8,131,0,8,67,0,9,231,80,7,7,0,8,91,0,8,27,0,9,151,84,7,67,0,8,123,0,8,59,0,9,215,82,7,19,0,8,107,0,8,43,0,9,183,0,8,11,0,8,139,0,8,75,0,9,247,80,7,5,0,8,87,0,8,23,192,8,0,83,7,51,0,8,119,0,8,55,0,9,207,81,7,15,0,8,103,0,8,39,0,9,175,0,8,7,0,8,135,0,8,71,0,9,239,80,7,9,0,8,95,0,8,31,0,9,159,84,7,99,0,8,127,0,8,63,0,9,223,82,7,27,0,8,111,0,8,47,0,9,191,0,8,15,0,8,143,0,8,79,0,9,255],w=[80,5,1,87,5,257,83,5,17,91,5,4097,81,5,5,89,5,1025,85,5,65,93,5,16385,80,5,3,88,5,513,84,5,33,92,5,8193,82,5,9,90,5,2049,86,5,129,192,5,24577,80,5,2,87,5,385,83,5,25,91,5,6145,81,5,7,89,5,1537,85,5,97,93,5,24577,80,5,4,88,5,769,84,5,49,92,5,12289,82,5,13,90,5,3073,86,5,193,192,5,24577],x=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],y=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,112,112],z=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],A=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],B=15
b.inflate_trees_fixed=function(a,b,c,d){return a[0]=t,b[0]=u,c[0]=v,d[0]=w,i}
var C=0,D=1,E=2,F=3,G=4,H=5,I=6,J=7,K=8,L=9,M=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],N=0,O=1,P=2,Q=3,R=4,S=5,T=6,U=7,V=8,W=9,X=32,Y=8,Z=0,$=1,_=2,aa=3,ba=4,ca=5,da=6,ea=7,fa=12,ga=13,ha=[0,0,255,255]
f.prototype={inflateInit:function(a){var b=this
return b.istate=new e,a||(a=h),b.istate.inflateInit(b,a)},inflate:function(a){var b=this
return b.istate?b.istate.inflate(b,a):l},inflateEnd:function(){var a=this
if(!a.istate)return l
var b=a.istate.inflateEnd(a)
return a.istate=null,b},inflateSync:function(){var a=this
return a.istate?a.istate.inflateSync(a):l},inflateSetDictionary:function(a,b){var c=this
return c.istate?c.istate.inflateSetDictionary(c,a,b):l},read_byte:function(a){var b=this
return b.next_in.subarray(a,a+1)[0]},read_buf:function(a,b){var c=this
return c.next_in.subarray(a,a+b)}}
var ia
a.zip?a.zip.Inflater=g:(ia=new g,a.addEventListener("message",function(b){var c=b.data
c.append&&a.postMessage({onappend:!0,data:ia.append(c.data,function(b){a.postMessage({progress:!0,current:b})})}),c.flush&&(ia.flush(),a.postMessage({onflush:!0}))},!1))},O.esri.TPK.___test=O.esri.TPK.inflate.toString(),O.esri.TPK.___blobURL=URL.createObjectURL(new Blob(["(",O.esri.TPK.___test,")(this)"],{type:"application/javascript"})),O.esri.zip.workerScriptsPath=O.esri.TPK.___blobURL,O.esri.TPK.X2JS=function(a){"use strict"
function b(){void 0===a.escapeMode&&(a.escapeMode=!0),a.attributePrefix=a.attributePrefix||"_",a.arrayAccessForm=a.arrayAccessForm||"none",a.emptyNodeForm=a.emptyNodeForm||"text",void 0===a.enableToStringFunc&&(a.enableToStringFunc=!0),a.arrayAccessFormPaths=a.arrayAccessFormPaths||[],void 0===a.skipEmptyTextNodesForObj&&(a.skipEmptyTextNodesForObj=!0),void 0===a.stripWhitespaces&&(a.stripWhitespaces=!0),a.datetimeAccessFormPaths=a.datetimeAccessFormPaths||[]}function c(){function a(a){var b=String(a)
return 1===b.length&&(b="0"+b),b}"function"!=typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^\s+|^\n+|(\s|\n)+$/g,"")}),"function"!=typeof Date.prototype.toISOString&&(Date.prototype.toISOString=function(){return this.getUTCFullYear()+"-"+a(this.getUTCMonth()+1)+"-"+a(this.getUTCDate())+"T"+a(this.getUTCHours())+":"+a(this.getUTCMinutes())+":"+a(this.getUTCSeconds())+"."+String((this.getUTCMilliseconds()/1e3).toFixed(3)).slice(2,5)+"Z"})}function d(a){var b=a.localName
return null==b&&(b=a.baseName),null!=b&&""!=b||(b=a.nodeName),b}function e(a){return a.prefix}function f(a){return"string"==typeof a?a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;").replace(/\//g,"&#x2F;"):a}function g(a){return a.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#x27;/g,"'").replace(/&#x2F;/g,"/")}function h(b,c,d){switch(a.arrayAccessForm){case"property":b[c]instanceof Array?b[c+"_asArray"]=b[c]:b[c+"_asArray"]=[b[c]]}if(!(b[c]instanceof Array)&&a.arrayAccessFormPaths.length>0){for(var e=0;e<a.arrayAccessFormPaths.length;e++){var f=a.arrayAccessFormPaths[e]
if("string"==typeof f){if(f==d)break}else if(f instanceof RegExp){if(f.test(d))break}else if("function"==typeof f&&f(b,c,d))break}e!=a.arrayAccessFormPaths.length&&(b[c]=[b[c]])}}function i(a){var b=a.split(/[-T:+Z]/g),c=new Date(b[0],b[1]-1,b[2]),d=b[5].split(".")
if(c.setHours(b[3],b[4],d[0]),d.length>1&&c.setMilliseconds(d[1]),b[6]&&b[7]){var e=60*b[6]+Number(b[7]),f=/\d\d-\d\d:\d\d$/.test(a)?"-":"+"
e=0+("-"==f?-1*e:e),c.setMinutes(c.getMinutes()-e-c.getTimezoneOffset())}else-1!==a.indexOf("Z",a.length-1)&&(c=new Date(Date.UTC(c.getFullYear(),c.getMonth(),c.getDate(),c.getHours(),c.getMinutes(),c.getSeconds(),c.getMilliseconds())))
return c}function j(b,c,d){if(a.datetimeAccessFormPaths.length>0){for(var e=d.split(".#")[0],f=0;f<a.datetimeAccessFormPaths.length;f++){var g=a.datetimeAccessFormPaths[f]
if("string"==typeof g){if(g==e)break}else if(g instanceof RegExp){if(g.test(e))break}else if("function"==typeof g&&g(obj,c,e))break}return f!=a.datetimeAccessFormPaths.length?i(b):b}return b}function k(b,c){if(b.nodeType==w.DOCUMENT_NODE){for(var f=new Object,i=b.childNodes,l=0;l<i.length;l++){var m=i.item(l)
if(m.nodeType==w.ELEMENT_NODE){var n=d(m)
f[n]=k(m,n)}}return f}if(b.nodeType==w.ELEMENT_NODE){var f=new Object
f.__cnt=0
for(var i=b.childNodes,l=0;l<i.length;l++){var m=i.item(l),n=d(m)
m.nodeType!=w.COMMENT_NODE&&(f.__cnt++,null==f[n]?(f[n]=k(m,c+"."+n),h(f,n,c+"."+n)):(null!=f[n]&&(f[n]instanceof Array||(f[n]=[f[n]],h(f,n,c+"."+n))),f[n][f[n].length]=k(m,c+"."+n)))}for(var o=0;o<b.attributes.length;o++){var p=b.attributes.item(o)
f.__cnt++,f[a.attributePrefix+p.name]=p.value}var q=e(b)
return null!=q&&""!=q&&(f.__cnt++,f.__prefix=q),null!=f["#text"]&&(f.__text=f["#text"],f.__text instanceof Array&&(f.__text=f.__text.join("\n")),a.escapeMode&&(f.__text=g(f.__text)),a.stripWhitespaces&&(f.__text=f.__text.trim()),delete f["#text"],"property"==a.arrayAccessForm&&delete f["#text_asArray"],f.__text=j(f.__text,n,c+"."+n)),null!=f["#cdata-section"]&&(f.__cdata=f["#cdata-section"],delete f["#cdata-section"],"property"==a.arrayAccessForm&&delete f["#cdata-section_asArray"]),1==f.__cnt&&null!=f.__text?f=f.__text:0==f.__cnt&&"text"==a.emptyNodeForm?f="":f.__cnt>1&&null!=f.__text&&a.skipEmptyTextNodesForObj&&(a.stripWhitespaces&&""==f.__text||""==f.__text.trim())&&delete f.__text,delete f.__cnt,!a.enableToStringFunc||null==f.__text&&null==f.__cdata||(f.toString=function(){return(null!=this.__text?this.__text:"")+(null!=this.__cdata?this.__cdata:"")}),f}return b.nodeType==w.TEXT_NODE||b.nodeType==w.CDATA_SECTION_NODE?b.nodeValue:void 0}function l(b,c,d,e){var g="<"+(null!=b&&null!=b.__prefix?b.__prefix+":":"")+c
if(null!=d)for(var h=0;h<d.length;h++){var i=d[h],j=b[i]
a.escapeMode&&(j=f(j)),g+=" "+i.substr(a.attributePrefix.length)+"='"+j+"'"}return g+=e?"/>":">"}function m(a,b){return"</"+(null!=a.__prefix?a.__prefix+":":"")+b+">"}function n(a,b){return-1!==a.indexOf(b,a.length-b.length)}function o(b,c){return!!("property"==a.arrayAccessForm&&n(c.toString(),"_asArray")||0==c.toString().indexOf(a.attributePrefix)||0==c.toString().indexOf("__")||b[c]instanceof Function)}function p(a){var b=0
if(a instanceof Object)for(var c in a)o(a,c)||b++
return b}function q(b){var c=[]
if(b instanceof Object)for(var d in b)-1==d.toString().indexOf("__")&&0==d.toString().indexOf(a.attributePrefix)&&c.push(d)
return c}function r(b){var c=""
return null!=b.__cdata&&(c+="<![CDATA["+b.__cdata+"]]>"),null!=b.__text&&(c+=a.escapeMode?f(b.__text):b.__text),c}function s(b){var c=""
return b instanceof Object?c+=r(b):null!=b&&(c+=a.escapeMode?f(b):b),c}function t(a,b,c){var d=""
if(0==a.length)d+=l(a,b,c,!0)
else for(var e=0;e<a.length;e++)d+=l(a[e],b,q(a[e]),!1),d+=u(a[e]),d+=m(a[e],b)
return d}function u(a){var b="",c=p(a)
if(c>0)for(var d in a)if(!o(a,d)){var e=a[d],f=q(e)
if(null==e||void 0==e)b+=l(e,d,f,!0)
else if(e instanceof Object)if(e instanceof Array)b+=t(e,d,f)
else if(e instanceof Date)b+=l(e,d,f,!1),b+=e.toISOString(),b+=m(e,d)
else{var g=p(e)
g>0||null!=e.__text||null!=e.__cdata?(b+=l(e,d,f,!1),b+=u(e),b+=m(e,d)):b+=l(e,d,f,!0)}else b+=l(e,d,f,!1),b+=s(e),b+=m(e,d)}return b+=s(a)}var v="1.1.5",a=a||{}
b(),c()
var w={ELEMENT_NODE:1,TEXT_NODE:3,CDATA_SECTION_NODE:4,COMMENT_NODE:8,DOCUMENT_NODE:9}
this.parseXmlString=function(a){var b=window.ActiveXObject||"ActiveXObject"in window
if(void 0===a)return null
var c
if(window.DOMParser){var d=new window.DOMParser,e=null
if(!b)try{e=d.parseFromString("INVALID","text/xml").childNodes[0].namespaceURI}catch(f){e=null}try{c=d.parseFromString(a,"text/xml"),null!=e&&c.getElementsByTagNameNS(e,"parsererror").length>0&&(c=null)}catch(f){c=null}}else 0==a.indexOf("<?")&&(a=a.substr(a.indexOf("?>")+2)),c=new ActiveXObject("Microsoft.XMLDOM"),c.async="false",c.loadXML(a)
return c},this.asArray=function(a){return a instanceof Array?a:[a]},this.toXmlDateTime=function(a){return a instanceof Date?a.toISOString():"number"==typeof a?new Date(a).toISOString():null},this.asDateTime=function(a){return"string"==typeof a?i(a):a},this.xml2json=function(a){return k(a)},this.xml_str2json=function(a){var b=this.parseXmlString(a)
return null!=b?this.xml2json(b):null},this.json2xml_str=function(a){return u(a)},this.json2xml=function(a){var b=this.json2xml_str(a)
return this.parseXmlString(b)},this.getVersion=function(){return v}}
