(this.webpackJsonpleaderboard=this.webpackJsonpleaderboard||[]).push([[0],{17:function(e,t,n){e.exports=n(36)},23:function(e,t,n){},36:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(13),o=n.n(c),i=(n(22),n(23),n(1)),s=n.n(i),l=n(4),u=n(2),d=n(16),m=n(14),f=n(15),b=n.n(f),w=n(8),p=n.n(w),h=n(5),v=n.n(h),j=function(e,t){var n=Object(a.useRef)(e);Object(a.useEffect)((function(){n.current=e}),[e]),Object(a.useEffect)((function(){var e=setInterval((function(){n.current()}),t);return function(){return clearTimeout(e)}}),[n,t])};function g(){var e="object"===typeof window;return{width:e?window.innerWidth:void 0,height:e?window.innerHeight:void 0}}var E=function(e){var t=e.alt,n=e.src,a=n.split("."),c=a.pop(),o=a.join("."),i=n;return c&&(window.matchMedia&&(window.matchMedia("only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)").matches||window.matchMedia("only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)").matches)||window.devicePixelRatio&&window.devicePixelRatio>1.3)&&(i="".concat(o,"@2x.").concat(c)),r.a.createElement("img",{alt:t,src:i})};var O=function(e){var t=e.baseURL,n=e.setError,c=Object(a.useState)(0),o=Object(u.a)(c,2),i=o[0],d=o[1],f=Object(a.useState)(1),w=Object(u.a)(f,2),h=w[0],O=w[1],S=Object(a.useState)([]),y=Object(u.a)(S,2),x=y[0],k=y[1],N=Object(a.useRef)(null),C=Object(a.useCallback)(Object(l.a)(s.a.mark((function e(){var a,r,c;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,fetch("".concat(t,"/api/scores/"));case 3:if(200!==(a=e.sent).status){e.next=15;break}return e.t0=b.a,e.next=8,a.json();case 8:e.t1=e.sent,e.t2={deep:!0},r=(0,e.t0)(e.t1,e.t2),k(r.map((function(e){return Object(m.a)({},e,{newScore:Math.random()>=.8})}))),n(null),e.next=19;break;case 15:return e.next=17,a.text();case 17:c=e.sent,n("Failed to get scores: "+c);case 19:e.next=24;break;case 21:e.prev=21,e.t3=e.catch(0),n("Failed to get scores: "+e.t3);case 24:case"end":return e.stop()}}),e,null,[[0,21]])}))),[t,k,n]);j(C,3e4),Object(a.useEffect)((function(){C()}),[C]);var L=Object(a.useCallback)((function(){var e=i+h,t=e>=x.length?0:e;t!==i&&d(t)}),[i,h,x,d]);j(L,1e4),Object(a.useEffect)((function(){return v.a.bind("space",L),v.a.bind("enter",L),v.a.bind("right",L),function(){v.a.unbind("space"),v.a.unbind("enter"),v.a.unbind("right")}}),[L]);var R=function(){var e=Object(a.useState)(g),t=Object(u.a)(e,2),n=t[0],r=t[1];return Object(a.useEffect)((function(){if("object"===typeof window)return window.addEventListener("resize",e),function(){window.removeEventListener("resize",e)};function e(){r(g())}}),[]),n}();return Object(a.useLayoutEffect)((function(){R.width&&R.width>1e3&&O(1)}),[R,O]),Object(a.useLayoutEffect)((function(){var e;if(N.current)if((R.width||0)<1e3)O(x.length);else{var t=N.current.clientHeight,n=null===(e=N.current.firstChild)||void 0===e?void 0:e.firstChild;if(n){var a=Math.floor(t/n.clientHeight);h!==a&&O(a)}}}),[h,O,N,x,R]),r.a.createElement("div",{className:"scoresContainer",ref:N},r.a.createElement("div",{className:"scores"},x.slice(i,i+h).map((function(e,t){return r.a.createElement(r.a.Fragment,{key:e.id},0!==t&&r.a.createElement("span",{className:"line"}),r.a.createElement("span",{className:p()("gameName",{newScore:e.newScore})},r.a.createElement(E,{src:e.gameBannerThumbnail,alt:e.gameName})),r.a.createElement("span",{className:p()("playerName",{newScore:e.newScore})},e.playerName),r.a.createElement("span",{className:p()("score",{newScore:e.newScore})},Number(e.playerScore).toLocaleString()))}))))};var S=function(){var e=Object(d.a)(),t=e.handleSubmit,n=e.register,c=e.setValue,o=Object(a.useState)(null),i=Object(u.a)(o,2),m=i[0],f=i[1],b=Object(a.useState)(!1),w=Object(u.a)(b,2),p=w[0],h=w[1],v=function(e,t){var n=Object(a.useState)((function(){try{var n=window.localStorage.getItem(e);return n?JSON.parse(n):t}catch(m){return console.log(m),t}})),r=Object(u.a)(n,2),c=r[0],o=r[1];return[c,function(t){try{o(t),window.localStorage.setItem(e,JSON.stringify(t))}catch(m){console.log(m)}}]}("leaderboardUrl","https://btta-api.elwert.cloud"),j=Object(u.a)(v,2),g=j[0],E=j[1],S=Object(a.useCallback)(t(function(){var e=Object(l.a)(s.a.mark((function e(t){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:localStorage.leaderboardUrl=t.url,h(!0),fetch("".concat(t.url,"/api/scores/")).then((function(e){200===e.status?(f(null),E(t.url)):f("Unexpected status code: ".concat(e.status))})).catch((function(e){f("Connection error: ".concat(e))}));case 3:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()),[t,E,h]),y=Object(a.useCallback)((function(){h(!1),window.requestAnimationFrame((function(){c("url",g)}))}),[h,c,g]);return Object(a.useEffect)((function(){g&&h(!0)}),[]),r.a.createElement("div",{className:"App"},r.a.createElement("header",{onClick:y},r.a.createElement("img",{className:"logo",src:"logo.png",alt:"Back to the Arcade"}),r.a.createElement("img",{className:"leaderboard",src:"leaderboard-text.png",alt:"Leaderboard"})),m&&r.a.createElement("div",null,r.a.createElement("h2",null,"Error:"),m),p?r.a.createElement(O,{baseURL:g,setError:f}):r.a.createElement(r.a.Fragment,null,"URL: ",r.a.createElement("input",{name:"url",ref:n}),r.a.createElement("button",{onClick:S},"Connect")))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(S,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[17,1,2]]]);
//# sourceMappingURL=main.de5d1d39.chunk.js.map