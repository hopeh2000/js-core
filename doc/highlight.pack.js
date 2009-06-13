/*
Syntax highlighting with language autodetection.
http://softwaremaniacs.org/soft/highlight/
*/
var hljs=new function(){var n={};var a={};function l(c){return c.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;")}function j(q,p){if(!q){return false}for(var c=0;c<q.length;c++){if(q[c]==p){return true}}return false}function f(I,C){function J(N,M){N.sm=[];for(var L=0;L<N.c.length;L++){for(var r=0;r<M.m.length;r++){if(M.m[r].cN==N.c[L]){N.sm[N.sm.length]=M.m[r]}}}}function y(r,M){if(!M.c){return null}if(!M.sm){J(M,G)}for(var L=0;L<M.sm.length;L++){if(M.sm[L].bR.test(r)){return M.sm[L]}}return null}function v(L,r){if(B[L].e&&B[L].eR.test(r)){return 1}if(B[L].eW){var M=v(L-1,r);return M?M+1:0}return 0}function w(r,L){return L.iR&&L.iR.test(r)}function z(Q,O){var M=[];function P(R){if(!j(M,R)){M[M.length]=R}}if(Q.c){for(var L=0;L<O.m.length;L++){if(j(Q.c,O.m[L].cN)){P(O.m[L].b)}}}var r=B.length-1;do{if(B[r].e){P(B[r].e)}r--}while(B[r+1].eW);if(Q.i){P(Q.i)}var N="("+M[0];for(var L=0;L<M.length;L++){N+="|"+M[L]}N+=")";return d(O,N)}function q(M,L){var N=B[B.length-1];if(!N.t){N.t=z(N,G)}M=M.substr(L);var r=N.t.exec(M);if(!r){return[M,"",true]}if(r.index==0){return["",r[0],false]}else{return[M.substr(0,r.index),r[0],false]}}function p(O,r){var L=G.cI?r[0].toLowerCase():r[0];for(var N in O.keywordGroups){if(!O.keywordGroups.hasOwnProperty(N)){continue}var M=O.keywordGroups[N].hasOwnProperty(L);if(M){return[N,M]}}return false}function E(N,Q){if(!Q.k||!Q.l){return l(N)}if(!Q.lR){var P="("+Q.l[0];for(var M=1;M<Q.l.length;M++){P+="|"+Q.l[M]}P+=")";Q.lR=d(G,P,true)}var O="";var R=0;Q.lR.lastIndex=0;var L=Q.lR.exec(N);while(L){O+=l(N.substr(R,L.index-R));var r=p(Q,L);if(r){s+=r[1];O+='<span class="'+r[0]+'">'+l(L[0])+"</span>"}else{O+=l(L[0])}R=Q.lR.lastIndex;L=Q.lR.exec(N)}O+=l(N.substr(R,N.length-R));return O}function K(r,M){if(M.subLanguage&&a[M.subLanguage]){var L=f(M.subLanguage,r);s+=L.keyword_count;A+=L.r;return L.value}else{return E(r,M)}}function H(M,r){var L=M.nM?"":'<span class="'+M.cN+'">';if(M.rB){c+=L;M.buffer=""}else{if(M.eB){c+=l(r)+L;M.buffer=""}else{c+=L;M.buffer=r}}B[B.length]=M}function D(P,L,Q){var R=B[B.length-1];if(Q){c+=K(R.buffer+P,R);return false}var M=y(L,R);if(M){c+=K(R.buffer+P,R);H(M,L);A+=M.r;return M.rB}var r=v(B.length-1,L);if(r){var O=R.nM?"":"</span>";if(R.rE){c+=K(R.buffer+P,R)+O}else{if(R.eE){c+=K(R.buffer+P,R)+O+l(L)}else{c+=K(R.buffer+P+L,R)+O}}while(r>1){O=B[B.length-2].nM?"":"</span>";c+=O;r--;B.length--}B.length--;B[B.length-1].buffer="";if(R.starts){for(var N=0;N<G.m.length;N++){if(G.m[N].cN==R.starts){H(G.m[N],"");break}}}return R.rE}if(w(L,R)){throw"Illegal"}}var G=n[I];var B=[G.dM];var A=0;var s=0;var c="";try{var u=0;G.dM.buffer="";do{var x=q(C,u);var t=D(x[0],x[1],x[2]);u+=x[0].length;if(!t){u+=x[1].length}}while(!x[2]);if(B.length>1){throw"Illegal"}return{r:A,keyword_count:s,value:c}}catch(F){if(F=="Illegal"){return{r:0,keyword_count:0,value:l(C)}}else{throw F}}}function g(q){var p="";for(var c=0;c<q.childNodes.length;c++){if(q.childNodes[c].nodeType==3){p+=q.childNodes[c].nodeValue}else{if(q.childNodes[c].nodeName=="BR"){p+="\n"}else{throw"No highlight"}}}return p}function b(q){var p=q.className.split(/\s+/);for(var c=0;c<p.length;c++){if(p[c]=="no-highlight"){throw"No highlight"}if(n[p[c]]){return p[c]}}}function o(u){try{var A=g(u);var q=b(u)}catch(v){if(v=="No highlight"){return}}if(q){var x=f(q,A).value}else{var y=0;for(var z in a){if(!a.hasOwnProperty(z)){continue}var p=f(z,A);var c=p.keyword_count+p.r;if(c>y){y=c;var x=p.value;q=z}}}if(x){var t=u.className;if(!t.match(q)){t+=" "+q}var w=document.createElement("div");w.innerHTML='<pre><code class="'+t+'">'+x+"</code></pre>";var s=u.parentNode.parentNode;s.replaceChild(w.firstChild,u.parentNode)}}function d(q,p,c){var r="m"+(q.cI?"i":"")+(c?"g":"");return new RegExp(p,r)}function i(){for(var p in n){if(!n.hasOwnProperty(p)){continue}var q=n[p];for(var c=0;c<q.m.length;c++){if(q.m[c].b){q.m[c].bR=d(q,"^"+q.m[c].b)}if(q.m[c].e){q.m[c].eR=d(q,"^"+q.m[c].e)}if(q.m[c].i){q.m[c].iR=d(q,"^(?:"+q.m[c].i+")")}q.dM.iR=d(q,"^(?:"+q.dM.i+")");if(q.m[c].r==undefined){q.m[c].r=1}}}}function e(){function q(t){if(!t.keywordGroups){for(var s in t.k){if(!t.k.hasOwnProperty(s)){continue}if(t.k[s] instanceof Object){t.keywordGroups=t.k}else{t.keywordGroups={keyword:t.k}}break}}}for(var p in n){if(!n.hasOwnProperty(p)){continue}var r=n[p];q(r.dM);for(var c=0;c<r.m.length;c++){q(r.m[c])}}}function h(p){for(var c=0;c<p.childNodes.length;c++){node=p.childNodes[c];if(node.nodeName=="CODE"){return node}if(!(node.nodeType==3&&node.nodeValue.match(/\s+/))){return null}}}function k(){if(k.called){return}k.called=true;i();e();if(arguments.length){for(var c=0;c<arguments.length;c++){if(n[arguments[c]]){a[arguments[c]]=n[arguments[c]]}}}else{a=n}var q=document.getElementsByTagName("pre");for(var c=0;c<q.length;c++){var p=h(q[c]);if(p){o(p)}}}function m(){var c=arguments;var p=function(){k.apply(null,c)};if(window.addEventListener){window.addEventListener("DOMContentLoaded",p,false);window.addEventListener("load",p,false)}else{if(window.attachEvent){window.attachEvent("onload",p)}else{window.onload=p}}}this.LANGUAGES=n;this.initHighlightingOnLoad=m;this.highlightBlock=o;this.initHighlighting=k;this.IR="[a-zA-Z][a-zA-Z0-9_]*";this.UIR="[a-zA-Z_][a-zA-Z0-9_]*";this.NR="\\b\\d+(\\.\\d+)?";this.CNR="\\b(0x[A-Za-z0-9]+|\\d+(\\.\\d+)?)";this.RSR="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|\\.|-|-=|/|/=|:|;|<|<<|<<=|<=|=|==|===|>|>=|>>|>>=|>>>|>>>=|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~";this.ASM={cN:"string",b:"'",e:"'",i:"\\n",c:["escape"],r:0};this.QSM={cN:"string",b:'"',e:'"',i:"\\n",c:["escape"],r:0};this.BE={cN:"escape",b:"\\\\.",e:"^",nM:true,r:0};this.CLCM={cN:"comment",b:"//",e:"$",r:0};this.CBLCLM={cN:"comment",b:"/\\*",e:"\\*/"};this.HCM={cN:"comment",b:"#",e:"$"};this.CNM={cN:"number",b:this.CNR,e:"^",r:0}}();var initHighlightingOnLoad=hljs.initHighlightingOnLoad;hljs.XML_COMMENT={cN:"comment",b:"<!--",e:"-->"};hljs.XML_ATTR={cN:"attribute",b:"\\s[a-zA-Z\\:-]+=",e:"^",c:["value"]};hljs.XML_VALUE_QUOT={cN:"value",b:'"',e:'"'};hljs.XML_VALUE_APOS={cN:"value",b:"'",e:"'"};hljs.LANGUAGES.xml={dM:{c:["pi","comment","cdata","tag"]},cI:true,m:[{cN:"pi",b:"<\\?",e:"\\?>",r:10},hljs.XML_COMMENT,{cN:"cdata",b:"<\\!\\[CDATA\\[",e:"\\]\\]>"},{cN:"tag",b:"</?",e:">",c:["title","tag_internal"],r:1.5},{cN:"title",b:"[A-Za-z:_][A-Za-z0-9\\._:-]+",e:"^",r:0},{cN:"tag_internal",b:"^",eW:true,nM:true,c:["attribute"],r:0,i:"[\\+\\.]"},hljs.XML_ATTR,hljs.XML_VALUE_QUOT,hljs.XML_VALUE_APOS]};hljs.HTML_TAGS={code:1,kbd:1,font:1,noscript:1,style:1,img:1,title:1,menu:1,tt:1,tr:1,param:1,li:1,tfoot:1,th:1,input:1,td:1,dl:1,blockquote:1,fieldset:1,big:1,dd:1,abbr:1,optgroup:1,dt:1,button:1,isindex:1,p:1,small:1,div:1,dir:1,em:1,frame:1,meta:1,sub:1,bdo:1,label:1,acronym:1,sup:1,body:1,xml:1,basefont:1,base:1,br:1,address:1,strong:1,legend:1,ol:1,script:1,caption:1,s:1,col:1,h2:1,h3:1,h1:1,h6:1,h4:1,h5:1,table:1,select:1,noframes:1,span:1,area:1,dfn:1,strike:1,cite:1,thead:1,head:1,option:1,form:1,hr:1,"var":1,link:1,b:1,colgroup:1,ul:1,applet:1,del:1,iframe:1,pre:1,frameset:1,ins:1,tbody:1,html:1,samp:1,map:1,object:1,a:1,xmlns:1,center:1,textarea:1,i:1,q:1,u:1};hljs.HTML_DOCTYPE={cN:"doctype",b:"<!DOCTYPE",e:">",r:10};hljs.HTML_ATTR={cN:"attribute",b:"\\s[a-zA-Z\\:-]+=",e:"^",c:["value"]};hljs.HTML_SHORT_ATTR={cN:"attribute",b:" [a-zA-Z]+",e:"^"};hljs.HTML_VALUE={cN:"value",b:"[a-zA-Z0-9]+",e:"^"};hljs.LANGUAGES.html={dM:{c:["tag","comment","doctype","vbscript"]},cI:true,m:[hljs.XML_COMMENT,hljs.HTML_DOCTYPE,{cN:"tag",l:[hljs.IR],k:hljs.HTML_TAGS,b:"<style",e:">",c:["attribute"],i:"[\\+\\.]",starts:"css"},{cN:"tag",l:[hljs.IR],k:hljs.HTML_TAGS,b:"<script",e:">",c:["attribute"],i:"[\\+\\.]",starts:"javascript"},{cN:"tag",l:[hljs.IR],k:hljs.HTML_TAGS,b:"<[A-Za-z/]",e:">",c:["attribute"],i:"[\\+\\.]"},{cN:"css",e:"</style>",rE:true,subLanguage:"css"},{cN:"javascript",e:"<\/script>",rE:true,subLanguage:"javascript"},hljs.HTML_ATTR,hljs.HTML_SHORT_ATTR,hljs.XML_VALUE_QUOT,hljs.XML_VALUE_APOS,hljs.HTML_VALUE,{cN:"vbscript",b:"<%",e:"%>",subLanguage:"vbscript"}]};hljs.LANGUAGES.css={dM:{c:["id","class","attr_selector","rules","comment"],k:hljs.HTML_TAGS,l:[hljs.IR],i:"="},cI:true,m:[{cN:"id",b:"\\#[A-Za-z0-9_-]+",e:"^"},{cN:"class",b:"\\.[A-Za-z0-9_-]+",e:"^",r:0},{cN:"attr_selector",b:"\\[",e:"\\]",i:"$"},{cN:"rules",b:"{",e:"}",c:["rule","comment"],i:"[^\\s]"},{cN:"rule",b:"[A-Z\\_\\.\\-]+\\s*:",e:";",eW:true,l:["[A-Za-z-]+"],k:{"play-during":1,"counter-reset":1,"counter-increment":1,"min-height":1,quotes:1,"border-top":1,pitch:1,font:1,pause:1,"list-style-image":1,"border-width":1,cue:1,"outline-width":1,"border-left":1,elevation:1,richness:1,"speech-rate":1,"border-bottom":1,"border-spacing":1,background:1,"list-style-type":1,"text-align":1,"page-break-inside":1,orphans:1,"page-break-before":1,"text-transform":1,"line-height":1,"padding-left":1,"font-size":1,right:1,"word-spacing":1,"padding-top":1,"outline-style":1,bottom:1,content:1,"border-right-style":1,"padding-right":1,"border-left-style":1,"voice-family":1,"background-color":1,"border-bottom-color":1,"outline-color":1,"unicode-bidi":1,"max-width":1,"font-family":1,"caption-side":1,"border-right-width":1,"pause-before":1,"border-top-style":1,color:1,"border-collapse":1,"border-bottom-width":1,"float":1,height:1,"max-height":1,"margin-right":1,"border-top-width":1,speak:1,"speak-header":1,top:1,"cue-before":1,"min-width":1,width:1,"font-variant":1,"border-top-color":1,"background-position":1,"empty-cells":1,direction:1,"border-right":1,visibility:1,padding:1,"border-style":1,"background-attachment":1,overflow:1,"border-bottom-style":1,cursor:1,margin:1,display:1,"border-left-width":1,"letter-spacing":1,"vertical-align":1,clip:1,"border-color":1,"list-style":1,"padding-bottom":1,"pause-after":1,"speak-numeral":1,"margin-left":1,widows:1,border:1,"font-style":1,"border-left-color":1,"pitch-range":1,"background-repeat":1,"table-layout":1,"margin-bottom":1,"speak-punctuation":1,"font-weight":1,"border-right-color":1,"page-break-after":1,position:1,"white-space":1,"text-indent":1,"background-image":1,volume:1,stress:1,outline:1,clear:1,"z-index":1,"text-decoration":1,"margin-top":1,azimuth:1,"cue-after":1,left:1,"list-style-position":1},c:["value"]},hljs.CBLCLM,{cN:"value",b:"^",eW:true,eE:true,c:["function","number","hexcolor","string"]},{cN:"number",b:hljs.NR,e:"^"},{cN:"hexcolor",b:"\\#[0-9A-F]+",e:"^"},{cN:"function",b:hljs.IR+"\\(",e:"\\)",c:["params"]},{cN:"params",b:"^",eW:true,eE:true,c:["number","string"]},hljs.ASM,hljs.QSM]};hljs.LANGUAGES.javascript={dM:{l:[hljs.UIR],c:["string","comment","number","regexp_container","function"],k:{keyword:{"in":1,"if":1,"for":1,"while":1,"finally":1,"var":1,"new":1,"function":1,"do":1,"return":1,"void":1,"else":1,"break":1,"catch":1,"instanceof":1,"with":1,"throw":1,"case":1,"default":1,"try":1,"this":1,"switch":1,"continue":1,"typeof":1,"delete":1},literal:{"true":1,"false":1,"null":1}}},m:[hljs.CLCM,hljs.CBLCLM,hljs.CNM,hljs.ASM,hljs.QSM,hljs.BE,{cN:"regexp_container",b:"("+hljs.RSR+"|case|return|throw)\\s*",e:"^",nM:true,l:[hljs.IR],k:{"return":1,"throw":1,"case":1},c:["comment","regexp"],r:0},{cN:"regexp",b:"/.*?[^\\\\/]/[gim]*",e:"^"},{cN:"function",b:"\\bfunction\\b",e:"{",l:[hljs.UIR],k:{"function":1},c:["title","params"]},{cN:"title",b:"[A-Za-z$_][0-9A-Za-z$_]*",e:"^"},{cN:"params",b:"\\(",e:"\\)",c:["string","comment"]}]};