(this.webpackJsonpleaderboard=this.webpackJsonpleaderboard||[]).push([[0],{18:function(e,t,n){e.exports=n(37)},24:function(e,t,n){},37:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(14),o=n.n(c),i=(n(23),n(24),n(1)),s=n.n(i),l=n(4),u=n(2),d=n(17),m=n(15),f=n(16),b=n.n(f),p=n(40),w=n(39),h=n(9),v=n.n(h),g=n(6),j=n.n(g),O=function(e,t){var n=Object(a.useRef)(e);Object(a.useEffect)((function(){n.current=e}),[e]),Object(a.useEffect)((function(){var e=setInterval((function(){n.current()}),t);return function(){return clearTimeout(e)}}),[n,t])};function E(){var e="object"===typeof window;return{width:e?window.innerWidth:void 0,height:e?window.innerHeight:void 0}}var S=function(e){if(!(window.matchMedia&&(window.matchMedia("only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)").matches||window.matchMedia("only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)").matches)||window.devicePixelRatio&&window.devicePixelRatio>1.3))return e;var t=e.split("."),n=t.pop(),a=t.join(".");return n?"".concat(a,"@2x.").concat(n):e};var y=function(e){var t=e.baseURL,n=e.setError,c=Object(a.useState)(0),o=Object(u.a)(c,2),i=o[0],d=o[1],f=Object(a.useState)(1),h=Object(u.a)(f,2),g=h[0],y=h[1],x=Object(a.useState)([]),k=Object(u.a)(x,2),N=k[0],C=k[1],L=Object(a.useRef)(null),B=Object(a.useCallback)(Object(l.a)(s.a.mark((function e(){var a,r,c,o,i;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,fetch("".concat(t,"/api/scores/"));case 3:if(200!==(a=e.sent).status){e.next=18;break}return e.t0=b.a,e.next=8,a.json();case 8:e.t1=e.sent,e.t2={deep:!0},r=(0,e.t0)(e.t1,e.t2),c=new Date,o=r.map((function(e){var t=Object(p.a)(e.modified),n=t>Object(p.a)(e.created)&&Object(w.a)(c,t)<2592e3;return Object(m.a)({},e,{gameBannerThumbnail:S(e.gameBannerThumbnail),newScore:n})})),C(o),n(null),o.map((function(e){var t=e.gameBannerThumbnail,n=new Image;return n.src=t,n})),e.next=22;break;case 18:return e.next=20,a.text();case 20:i=e.sent,n("Failed to get scores: "+i);case 22:e.next=27;break;case 24:e.prev=24,e.t3=e.catch(0),n("Failed to get scores: "+e.t3);case 27:case"end":return e.stop()}}),e,null,[[0,24]])}))),[t,C,n]);O(B,3e4),Object(a.useEffect)((function(){B()}),[B]);var R=Object(a.useCallback)((function(){var e=i+g,t=e>=N.length?0:e;t!==i&&d(t)}),[i,g,N,d]);O(R,1e4),Object(a.useEffect)((function(){return j.a.bind("space",R),j.a.bind("enter",R),j.a.bind("right",R),function(){j.a.unbind("space"),j.a.unbind("enter"),j.a.unbind("right")}}),[R]);var U=function(){var e=Object(a.useState)(E),t=Object(u.a)(e,2),n=t[0],r=t[1];return Object(a.useEffect)((function(){if("object"===typeof window)return window.addEventListener("resize",e),function(){window.removeEventListener("resize",e)};function e(){r(E())}}),[]),n}();return Object(a.useLayoutEffect)((function(){U.width&&U.width>1e3&&y(1)}),[U,y]),Object(a.useLayoutEffect)((function(){var e;if(L.current)if((U.width||0)<1e3)y(N.length);else{var t=L.current.clientHeight,n=null===(e=L.current.firstChild)||void 0===e?void 0:e.firstChild;if(n){var a=Math.floor(t/(n.clientHeight+1));g!==a&&y(a)}}}),[g,y,L,N,U]),r.a.createElement("div",{className:"scoresContainer",ref:L},r.a.createElement("div",{className:"scores"},N.slice(i,i+g).map((function(e,t){return r.a.createElement(r.a.Fragment,{key:e.id},0!==t&&r.a.createElement("span",{className:"line"}),r.a.createElement("span",{className:v()("gameName",{newScore:e.newScore})},r.a.createElement("img",{src:e.gameBannerThumbnail,alt:e.gameName})),r.a.createElement("span",{className:v()("playerName",{newScore:e.newScore})},e.playerName),r.a.createElement("span",{className:v()("score",{newScore:e.newScore})},Number(e.playerScore).toLocaleString()))}))))};var x=function(){var e=Object(d.a)(),t=e.handleSubmit,n=e.register,c=e.setValue,o=Object(a.useState)(null),i=Object(u.a)(o,2),m=i[0],f=i[1],b=Object(a.useState)(!1),p=Object(u.a)(b,2),w=p[0],h=p[1],v=function(e,t){var n=Object(a.useState)((function(){try{var n=window.localStorage.getItem(e);return n?JSON.parse(n):t}catch(m){return console.log(m),t}})),r=Object(u.a)(n,2),c=r[0],o=r[1];return[c,function(t){try{o(t),window.localStorage.setItem(e,JSON.stringify(t))}catch(m){console.log(m)}}]}("leaderboardUrl","https://btta-api.elwert.cloud"),g=Object(u.a)(v,2),j=g[0],O=g[1],E=Object(a.useCallback)(t(function(){var e=Object(l.a)(s.a.mark((function e(t){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:localStorage.leaderboardUrl=t.url,h(!0),fetch("".concat(t.url,"/api/scores/")).then((function(e){200===e.status?(f(null),O(t.url)):f("Unexpected status code: ".concat(e.status))})).catch((function(e){f("Connection error: ".concat(e))}));case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()),[t,O,h]),S=Object(a.useCallback)((function(){h(!1),window.requestAnimationFrame((function(){c("url",j)}))}),[h,c,j]);return Object(a.useEffect)((function(){j&&h(!0)}),[]),r.a.createElement("div",{className:"App"},r.a.createElement("header",{onClick:S},r.a.createElement("img",{className:"logo",src:"logo.png",alt:"Back to the Arcade"}),r.a.createElement("img",{className:"leaderboard",src:"leaderboard-text.png",alt:"Leaderboard"})),m&&r.a.createElement("div",null,r.a.createElement("h2",null,"Error:"),m),w?r.a.createElement(y,{baseURL:j,setError:f}):r.a.createElement(r.a.Fragment,null,"URL: ",r.a.createElement("input",{name:"url",ref:n}),r.a.createElement("button",{onClick:E},"Connect")),r.a.createElement("footer",null,r.a.createElement("img",{src:"pacman-ghosts.jpg",alt:""})))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(x,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[18,1,2]]]);
//# sourceMappingURL=main.784e35b5.chunk.js.map