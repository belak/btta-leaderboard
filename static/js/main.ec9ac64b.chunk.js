(this.webpackJsonpleaderboard=this.webpackJsonpleaderboard||[]).push([[0],{17:function(e,t,a){e.exports=a(36)},23:function(e,t,a){},36:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(13),o=a.n(c),l=(a(22),a(23),a(1)),s=a.n(l),u=a(4),i=a(3),m=a(16),f=a(14),b=a(15),d=a.n(b),p=a(38),v=a(39),E=a(8),h=a.n(E),j=function(e,t){var a=Object(n.useRef)(e);Object(n.useEffect)((function(){a.current=e}),[e]),Object(n.useEffect)((function(){var e=setInterval((function(){a.current()}),t);return function(){return clearTimeout(e)}}),[a,t])};var O=function(e){var t=e.baseURL,a=e.setError,c=Object(n.useState)(0),o=Object(i.a)(c,2),l=o[0],m=o[1],b=Object(n.useState)(1),E=Object(i.a)(b,2),O=E[0],g=E[1],w=Object(n.useState)([]),S=Object(i.a)(w,2),k=S[0],N=S[1],x=Object(n.useRef)(null),C=Object(n.useCallback)(Object(u.a)(s.a.mark((function e(){var n,r,c;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,fetch("".concat(t,"/api/scores"));case 3:if(200!==(n=e.sent).status){e.next=15;break}return e.t0=d.a,e.next=8,n.json();case 8:e.t1=e.sent,e.t2={deep:!0},r=(0,e.t0)(e.t1,e.t2),N(r.map((function(e){return Object(f.a)({},e,{newScore:Object(p.a)(new Date,Object(v.a)(e.modified))<2592e3})}))),a(null),e.next=19;break;case 15:return e.next=17,n.text();case 17:c=e.sent,a("Failed to get scores: "+c);case 19:e.next=24;break;case 21:e.prev=21,e.t3=e.catch(0),a("Failed to get scores: "+e.t3);case 24:case"end":return e.stop()}}),e,null,[[0,21]])}))),[t,N,a]);j(C,3e4),Object(n.useEffect)((function(){C()}),[C]);var y=Object(n.useCallback)((function(){var e=l+O,t=e>=k.length?0:e;t!==l&&m(t)}),[l,O,k,m]);return j(y,1e4),Object(n.useEffect)((function(){var e;if(x.current){var t=x.current.clientHeight,a=null===(e=x.current.firstChild)||void 0===e?void 0:e.firstChild;if(a){var n=Math.floor(t/a.clientHeight);O!==n&&g(n)}}}),[O,g,x,k]),r.a.createElement("div",{className:"scoresContainer",ref:x},r.a.createElement("div",{className:"scores"},k.slice(l,l+O).map((function(e,t){return r.a.createElement(r.a.Fragment,{key:e.id},0!==t&&r.a.createElement("span",{className:"line"}),r.a.createElement("span",{className:h()("gameName",{newScore:e.newScore})},r.a.createElement("img",{src:e.gameBanner,alt:e.gameName})),r.a.createElement("span",{className:h()("playerName",{newScore:e.newScore})},e.playerName),r.a.createElement("span",{className:h()("score",{newScore:e.newScore})},Number(e.playerScore).toLocaleString()))}))))};var g=function(){var e=Object(m.a)(),t=e.handleSubmit,a=e.register,c=e.setValue,o=Object(n.useState)(null),l=Object(i.a)(o,2),f=l[0],b=l[1],d=Object(n.useState)(null),p=Object(i.a)(d,2),v=p[0],E=p[1],h=Object(n.useCallback)(t(function(){var e=Object(u.a)(s.a.mark((function e(t){return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:localStorage.leaderboardUrl=t.url,fetch("".concat(t.url,"/api/scores")).then((function(e){200===e.status?(b(null),E(t.url)):b("Unexpected status code: ".concat(e.status))})).catch((function(e){b("Connection error: ".concat(e))}));case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()),[t,E]),j=Object(n.useCallback)((function(){E(null),v&&window.requestAnimationFrame((function(){c("url",v)}))}),[E,c,v]);return Object(n.useEffect)((function(){var e=localStorage.leaderboardUrl||"";c("url",e),e&&E(e)}),[c,E]),r.a.createElement("div",{className:"App"},r.a.createElement("header",{onClick:j},r.a.createElement("img",{className:"logo",src:"logo.png",alt:"Back to the Arcade"}),r.a.createElement("img",{className:"leaderboard",src:"leaderboard-text.png",alt:"Leaderboard"})),f&&r.a.createElement("div",null,r.a.createElement("h2",null,"Error:"),f),v?r.a.createElement(O,{baseURL:v,setError:b}):r.a.createElement(r.a.Fragment,null,"URL: ",r.a.createElement("input",{name:"url",ref:a}),r.a.createElement("button",{onClick:h},"Connect")))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(g,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[17,1,2]]]);
//# sourceMappingURL=main.ec9ac64b.chunk.js.map