(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{307:function(e,t,a){"use strict";var n=a(0),r=a.n(n),o=a(97),s=a(1),u=a.n(s),c=a(25),i=(a(308),function(e){var t,a,n,s={backgroundImage:"url(".concat(e.user.background,")"),backgroundRepeat:"no-repeat",backgroundAttachment:"scroll",backgroundPosition:"center",minHeight:"421px",position:"relative",backgroundSize:"cover"},u=null;return!e.profile&&e.isAuth&&(u=r.a.createElement(c.a,{type:"button",classes:"redButton",clicked:e.openChat},"userPage.chat")),r.a.createElement("section",{className:"userpage-top",style:s},r.a.createElement("div",{className:"userpage-top__container"},r.a.createElement("div",{className:"userpage-top__text__container"},r.a.createElement("img",{src:e.user.avatar,className:"userpage-top__text__avatar"}),r.a.createElement("div",{className:"userpage-top__text__container2"},r.a.createElement("h3",{className:"userpage-top__name"},e.user.name),r.a.createElement("span",{className:"userpage-top__text"},(n=e.user.birthday,Math.floor((Date.now()-new Date(n))/31536e6)),r.a.createElement(o.a,null,"MainPage.age")),r.a.createElement("span",{className:"userpage-top__text"},e.user.country,", ",e.user.city),e.profile?null:r.a.createElement("span",{className:"userpage-top__text"},r.a.createElement(o.a,null,"community.lastonline")," ",(t=e.user.last_online,(a=Date.now()-new Date(t))<36e5?r.a.createElement(r.a.Fragment,null,Math.floor(a/6e4),r.a.createElement(o.a,null,"community.minAgo")):a<864e5?r.a.createElement(r.a.Fragment,null,Math.floor(a/36e5),r.a.createElement(o.a,null,"community.hoursAgo")):r.a.createElement(r.a.Fragment,null,Math.floor(a/864e5),r.a.createElement(o.a,null,"community.daysAgo")))))),r.a.createElement("div",{className:"userpage-top__buttons__container"},u)))});i.propTypes={user:u.a.shape({id:u.a.number,name:u.a.string,avatar:u.a.string,birthday:u.a.date,country:u.a.string,city:u.a.string,last_online:u.a.date,background:u.a.string}),profile:u.a.bool,openChat:u.a.func,isAuth:u.a.bool},t.a=i},308:function(e,t,a){var n=a(9),r=a(309);"string"==typeof(r=r.__esModule?r.default:r)&&(r=[[e.i,r,""]]);var o={insert:"head",singleton:!1};n(r,o);e.exports=r.locals||{}},309:function(e,t,a){e.exports={"userpage-top":"userpage-top","userpage-top__container":"userpage-top__container","userpage-top__text__container":"userpage-top__text__container","userpage-top__text__avatar":"userpage-top__text__avatar","userpage-top__text__container2":"userpage-top__text__container2","userpage-top__name":"userpage-top__name","userpage-top__text":"userpage-top__text","userpage-top__buttons__container":"userpage-top__buttons__container"}},634:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(12),s=a(10),u=a(1),c=a.n(u),i=a(14),p=a.n(i),l=a(15),h=a.n(l),f=a(307),m=a(310),_=a(16),g=a(7);function d(e){return(d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function y(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function b(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function v(e,t){return(v=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function E(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var a,n=k(e);if(t){var r=k(this).constructor;a=Reflect.construct(n,arguments,r)}else a=n.apply(this,arguments);return x(this,a)}}function x(e,t){return!t||"object"!==d(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function k(e){return(k=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var w=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&v(e,t)}(s,e);var t,a,n,o=E(s);function s(){var e;y(this,s);for(var t=arguments.length,a=new Array(t),n=0;n<t;n++)a[n]=arguments[n];return(e=o.call.apply(o,[this].concat(a))).state={isLoaded:!1,user:{},activeMenu:"main",photoOpened:!1,photoIndex:0,posts:[]},e.menuClick=function(t){return function(){e.setState({activeMenu:t})}},e.photoClick=function(t){return function(){e.setState({photoOpened:!0,photoIndex:t})}},e.photoClose=function(t){t.preventDefault(),e.setState({photoOpened:!1,photoIndex:0})},e.openChat=function(){e.props.addChatParameters(e.props.match.params.id),e.props.history.push("/messages")},e}return t=s,(a=[{key:"componentDidMount",value:function(){var e=this,t={userId:this.props.match.params.id,lng:this.props.lng.short};p()({method:"post",url:"/community/user",headers:{Authorization:"Bearer ".concat(this.props.user.token)},data:h.a.stringify(t)}).then((function(t){e.setState({user:t.data.user,isLoaded:!0,posts:t.data.user.blogs})})).catch((function(t){e.props.addError(t.response.data.message)}))}},{key:"render",value:function(){var e=r.a.createElement(r.a.Fragment,null,r.a.createElement(f.a,{user:this.state.user,openChat:this.openChat,profile:!1,isAuth:this.props.user.isAuth}),r.a.createElement(m.a,{user:this.state.user,activeMenu:this.state.activeMenu,menuClick:this.menuClick,photoClick:this.photoClick,photoOpened:this.state.photoOpened,photoClose:this.photoClose,photoIndex:this.state.photoIndex,posts:this.state.posts,profile:!1}));return this.state.isLoaded?e:r.a.createElement(_.a,null)}}])&&b(t.prototype,a),n&&b(t,n),s}(n.Component),C={addError:g.c,addChatParameters:g.a};w.propTypes={match:c.a.shape({params:c.a.shape({id:c.a.string})}),lng:c.a.shape({short:c.a.string}),user:c.a.shape({userId:c.a.string,token:c.a.string,isAuth:c.a.bool}),addError:c.a.func,addChatParameters:c.a.func,history:c.a.shape()},t.default=Object(s.f)(Object(o.b)((function(e){return{user:e.user,lng:e.lng}}),C)(w))}}]);
//# sourceMappingURL=10.bundle.js.map