(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{416:function(e,a,t){"use strict";var n=t(0),r=t.n(n),c=t(12),s=t(97),i=t(14),o=t.n(i),u=t(15),p=t.n(u),l=t(1),m=t.n(l),h=t(25),_=t(47),d=(t(614),function(e){var a=Object(_.a)().t,t=null;switch(e.item.type){case"chooseOne":t=r.a.createElement("select",{value:e.value,className:"search-input__input",id:e.item.name,onChange:e.onChange(e.item)},r.a.createElement("option",{value:"",disabled:!0},a("advancedSearch.chooseOne")),e.item.options.map((function(t){return r.a.createElement("option",{key:t,value:t},a("userPage.".concat(e.activeMenu,".").concat(e.item.name,".").concat(t)))})));break;case"chooseMany":t=r.a.createElement("a",{className:"search-input__link",id:e.item.name,onClick:e.itemClick(e.item.name.toLowerCase())},e.value.length>0?e.value.map((function(t){return a("userPage.".concat(e.activeMenu,".").concat(e.item.name,".").concat(t))})).join(", "):r.a.createElement(s.a,null,"userPage.adddescription"),e.menu[e.item.name.toLowerCase()]?r.a.createElement("ul",{className:"search-input__menu"},e.item.options.map((function(a){var t=e.value.includes(a)?"search-input__menu__item--active":"search-input__menu__item";return r.a.createElement("li",{key:a,className:t,onClick:e.onChange(e.item,a)},r.a.createElement(s.a,null,"userPage.",e.activeMenu,".",e.item.name,".",a))}))):null);break;case"input":t="number"===e.item.inputType?r.a.createElement(r.a.Fragment,null,r.a.createElement("input",{type:e.item.inputType,className:"search-input__input--number",value:e.value.from,onChange:e.onChange(e.item,0,"from")}),r.a.createElement("span",{className:"search-input__-"},"-"),r.a.createElement("input",{type:e.item.inputType,className:"search-input__input--number",value:e.value.to,onChange:e.onChange(e.item,0,"to")})):r.a.createElement("input",{type:e.item.inputType,className:"search-input__input",value:e.value,onChange:e.onChange(e.item)});break;case"search":t=r.a.createElement(r.a.Fragment,null,r.a.createElement("input",{type:"text",className:"search-input__input",value:e.search[e.item.name.toLowerCase()].value,onChange:e.searchChangeHandler(e.item.name.toLowerCase())}),e.search[e.item.name.toLowerCase()].results.length>0?r.a.createElement("ul",{className:"search-input__menu"},e.search[e.item.name.toLowerCase()].results.map((function(a){return r.a.createElement("li",{key:a.title,className:"search-input__menu__item",onClick:e.onChange(e.item,a)},a.title)}))):null);break;default:t=r.a.createElement("input",{type:e.item.inputType,className:"search-input__input",value:e.value,onChange:e.onChange(e.item)})}return r.a.createElement("div",{className:"search-input__container"},r.a.createElement("label",{className:"search-input__label",htmlFor:e.item.name},r.a.createElement(s.a,null,"userPage.",e.activeMenu,".",e.item.name,".name")),t)});d.propTypes={item:m.a.shape({name:m.a.string,type:m.a.string,options:m.a.array,inputType:m.a.string}),menu:m.a.shape(),value:m.a.oneOfType([m.a.string,m.a.number,m.a.shape({from:m.a.number,to:m.a.number})]),activeMenu:m.a.string,onChange:m.a.func,itemClick:m.a.func,search:m.a.shape({value:m.a.string,results:m.a.string}),searchChangeHandler:m.a.func,lng:m.a.string};var f=d,v=t(31),g=(t(616),t(7));function y(e){return(y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function b(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);a&&(n=n.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,n)}return t}function C(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{};a%2?b(Object(t),!0).forEach((function(a){E(e,a,t[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):b(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))}))}return e}function E(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function w(e,a){if(!(e instanceof a))throw new TypeError("Cannot call a class as a function")}function k(e,a){for(var t=0;t<a.length;t++){var n=a[t];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function O(e,a){return(O=Object.setPrototypeOf||function(e,a){return e.__proto__=a,e})(e,a)}function P(e){var a=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var t,n=N(e);if(a){var r=N(this).constructor;t=Reflect.construct(n,arguments,r)}else t=n.apply(this,arguments);return S(this,t)}}function S(e,a){return!a||"object"!==y(a)&&"function"!=typeof a?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):a}function N(e){return(N=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var j={main:[{name:"Gender",type:"chooseOne",options:["male","female","another"]},{name:"Age",type:"input",inputType:"number"},{name:"Countries",type:"search"},{name:"City",type:"input",inputType:"text"},{name:"Relationship",type:"chooseOne",options:["single","maried","have"]}],activity:[{name:"Education",type:"chooseOne",options:["School","PhD","Univercitydegree","College"]},{name:"Languages",type:"chooseMany",options:["English","Russian","German","French","Chinese","Ukrainian"]},{name:"Interests",type:"chooseMany",options:["football","pets","guitar","travel","videogames"]},{name:"Smoking",type:"chooseOne",options:["no","sometimes","smoke"]},{name:"Workas",type:"chooseOne",options:["businessman","programmer","engineer","designer","teacher","policeman"]}],appearance:[{name:"Height",type:"input",inputType:"number"},{name:"Weight",type:"input",inputType:"number"},{name:"Bodytype",type:"chooseOne",options:["thick","normal","thin","sport"]},{name:"Eyes",type:"chooseOne",options:["grey","brown","green","blue"]},{name:"Hair",type:"chooseOne",options:["long","bold","verylong","normal"]}]},M=function(e){var a=e.getDate();a<10&&(a="0".concat(a));var t=e.getMonth()+1;t<10&&(t="0".concat(t));var n=e.getFullYear();return"".concat(n,"-").concat(t,"-").concat(a)},D=function(e){!function(e,a){if("function"!=typeof a&&null!==a)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(a&&a.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),a&&O(e,a)}(i,e);var a,t,n,c=P(i);function i(){var e;w(this,i);for(var a=arguments.length,t=new Array(a),n=0;n<a;n++)t[n]=arguments[n];return(e=c.call.apply(c,[this].concat(t))).state={activeMenu:"main",parameters:{gender:"",age:{from:"",to:""},countries:"",city:"",relationship:"",education:"",languages:[],interests:[],smoking:"",workas:"",height:{from:"",to:""},weight:{from:"",to:""},bodytype:"",eyes:"",hair:""},new:!1,menu:{languages:!1,interestss:!1},search:{countries:{value:"",results:[]}}},e.menuClick=function(a){return function(){e.setState({activeMenu:a})}},e.itemClick=function(a){return function(){e.setState((function(e){var t=C({},e.menu);return t[a]=!t[a],{menu:t}}))}},e.fieldChange=function(a,t,n){return function(r){var c=C({},e.state.parameters),s=C({},e.state.search),i=a.name.toLowerCase();"chooseMany"===a.type?c[i].includes(t)?c[i]=c[i].filter((function(e){return e!==t})):c[i].push(t):"number"===a.inputType?c[i][n]=r.target.value:"search"===a.type?(c[i]=t.country_id,s[i].value=t.title,s[i].results=[]):c[i]=r.target.value,e.setState({parameters:c,search:s})}},e.searchChangeHandler=function(a){return function(t){t.preventDefault();var n=t.target.value,r={input:n,lng:e.props.lng.short,type:a},c=C({},e.state.search);o()({method:"post",url:"./searchprofile",data:p.a.stringify(r),headers:{Authorization:"Bearer ".concat(e.props.user.token)}}).then((function(t){c[a].results=t.data.countries,c[a].value=n,e.setState({search:c})})).catch((function(a){e.props.addError(a.response.data.message)}))}},e.menuItemsRender=function(a){return r.a.createElement("ul",{className:"advanced_search__search__navigation"},Object.keys(j).map((function(t){var n=["advanced_search__search__navigation__item__a",a===t?"advanced_search__search__navigation__item__a--active":""];return r.a.createElement("li",{className:"advanced_search__search__navigation__item",key:t},r.a.createElement("a",{className:n.join(" "),onClick:e.menuClick(t)},r.a.createElement(s.a,null,"userPage.",t,".title")))})))},e.newChange=function(){e.setState((function(e){return{new:!e.new}}))},e.searchFildsRender=function(a){return r.a.createElement("div",{className:"advanced_search__search__filds"},"map"===e.props.type?j[a].filter((function(e){return"Gender"!==e.name&&"Age"!==e.name&&"City"!==e.name&&"Countries"!==e.name})).map((function(a){return r.a.createElement(f,{key:a.name,item:a,activeMenu:e.state.activeMenu,onChange:e.fieldChange,value:e.state.parameters[a.name.toLowerCase()],openOptions:e.openOptions,menu:e.state.menu,itemClick:e.itemClick,searchChangeHandler:e.searchChangeHandler,search:e.state.search,lng:e.props.lng.short})})):j[a].map((function(a){return r.a.createElement(f,{key:a.name,item:a,activeMenu:e.state.activeMenu,onChange:e.fieldChange,value:e.state.parameters[a.name.toLowerCase()],openOptions:e.openOptions,menu:e.state.menu,itemClick:e.itemClick,searchChangeHandler:e.searchChangeHandler,search:e.state.search,lng:e.props.lng.short})})))},e.search=function(a){a.preventDefault();for(var t=C({},e.state.parameters),n=Object.keys(t),r=[],c=function(e){if(""===t[n[e]])delete t[n[e]];else if(0===t[n[e]].length)delete t[n[e]];else if(""===t[n[e]].from&&""===t[n[e]].to)delete t[n[e]];else if("age"===n[e]&&""!==t[n[e]].from){var a=new Date(Date.now());a.setFullYear(a.getFullYear()-t[n[e]].from);var c=M(a);if(r.push('birthday <= "'.concat(c,'"')),""!==t.age.to){var s=new Date(Date.now());a.setFullYear(s.getFullYear()-t[n[e]].to);var i=M(a);r.push('birthday >= "'.concat(i,'"'))}}else if("countries"===n[e])r.push('country_id = "'.concat(t[n[e]],'"'));else if("string"==typeof t[n[e]])r.push("".concat(n[e],' = "').concat(t[n[e]],'"'));else if(t[n[e]].length>0){var o=t[n[e]].map((function(a){return"".concat(n[e]," LIKE '%").concat(a,"%'")}));r.push(o.join(" AND "))}else""!==t[n[e]].from?(r.push("".concat(n[e],' >= "').concat(t[n[e]].from,'"')),""!==t[n[e]].to&&r.push("".concat(n[e],' <= "').concat(t[n[e]].to,'"'))):""!==t[n[e]].to&&r.push("".concat(n[e],' <= "').concat(t[n[e]].to,'"'))},s=0;s<n.length;s+=1)c(s);if("map"===e.props.type){if(""!==e.props.mainParameters.searchFrom){var i=new Date(Date.now());i.setFullYear(i.getFullYear()-e.props.mainParameters.searchFrom);var u=M(i);r.push('birthday <= "'.concat(u,'"'))}if(""!==e.props.mainParameters.searchTo){var l=new Date(Date.now());l.setFullYear(l.getFullYear()-e.props.mainParameters.searchTo);var m=M(l);r.push('birthday >= "'.concat(m,'"'))}"mapSearch.man"===e.props.mainParameters.gender&&r.push('gender = "male"'),"mapSearch.woman"===e.props.mainParameters.gender&&r.push('gender = "female"'),""!==e.props.mainParameters.city&&r.push('city = "'.concat(e.props.mainParameters.city,'"'));var h=r.join(" AND "),_={parameters:h,distance:e.props.mainParameters.distance,lat:e.props.mainParameters.center.lat,lng:e.props.mainParameters.center.lng};o()({method:"post",url:"./mapsearch",data:p.a.stringify(_),headers:{Authorization:"Bearer ".concat(e.props.user.token)}}).then((function(a){e.props.updateMainState({users:a.data.users,parameters:h,center:e.props.mainParameters.center})})).catch((function(a){e.props.addError(a.response.data.message)}))}else{var d=r.join(" AND "),f={parameters:d,page:1,sort:"created_at"};o()({method:"post",url:"./advancedsearch",data:p.a.stringify(f),headers:{Authorization:"Bearer ".concat(e.props.user.token)}}).then((function(a){e.props.updateMainState({users:a.data.users,activPage:1,paramsForPage:d,sortType:"created_at",sortDirections:"ASC"})})).catch((function(a){e.props.addError(a.response.data.message)}))}},e}return a=i,(t=[{key:"componentDidMount",value:function(){if(this.props.mapSearchParameters.users.length>0){var e=this.state.parameters;"mapSearch.woman"===this.props.mapSearchParameters.parameters.genderMain.value?e.gender="female":e.gender="male",e.age={from:this.props.mapSearchParameters.parameters.from.value,to:this.props.mapSearchParameters.parameters.to.value},this.setState({parameters:e})}}},{key:"render",value:function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement("section",{className:"advanced_search"},r.a.createElement("div",{className:"advanced_search__title__container"},r.a.createElement("h3",{className:"advanced_search__title"},r.a.createElement(s.a,null,"advancedSearch.searchTitle")),r.a.createElement("img",{src:v.a,alt:""})),r.a.createElement("div",{className:"advanced_search__search"},r.a.createElement("form",null,this.menuItemsRender(this.state.activeMenu),this.searchFildsRender(this.state.activeMenu),r.a.createElement("div",{className:"advanced_search__search__button"},r.a.createElement("input",{type:"checkbox",id:"new",className:"advanced_search__search__checkbox",checked:this.state.new,onChange:this.newChange}),r.a.createElement("label",{htmlFor:"new",className:"advanced_search__search__button__text"},r.a.createElement(s.a,null,"advancedSearch.onlyNew")),r.a.createElement(h.a,{type:"submit",classes:"redButton",clicked:this.search},"advancedSearch.search"))))))}}])&&k(a.prototype,t),n&&k(a,n),i}(n.Component),F={addError:g.c};D.propTypes={user:m.a.shape({id:m.a.number,token:m.a.string}),lng:m.a.shape({short:m.a.string}),updateMainState:m.a.func,users:m.a.array,type:m.a.string,mainParameters:m.a.shape(),center:m.a.shape(),mapSearchParameters:m.a.shape(),addError:m.a.func};a.a=Object(c.b)((function(e){return{user:e.user,lng:e.lng,mapSearchParameters:e.mapSearchParameters}}),F)(D)},614:function(e,a,t){var n=t(9),r=t(615);"string"==typeof(r=r.__esModule?r.default:r)&&(r=[[e.i,r,""]]);var c={insert:"head",singleton:!1};n(r,c);e.exports=r.locals||{}},615:function(e,a,t){e.exports={"search-input__container":"search-input__container","search-input__label":"search-input__label","search-input__input":"search-input__input","search-input__link":"search-input__link","search-input__menu":"search-input__menu","search-input__menu__item":"search-input__menu__item","search-input__-":"search-input__-","search-input__input--number":"search-input__input--number","search-input__menu__item--active":"search-input__menu__item--active"}},616:function(e,a,t){var n=t(9),r=t(617);"string"==typeof(r=r.__esModule?r.default:r)&&(r=[[e.i,r,""]]);var c={insert:"head",singleton:!1};n(r,c);e.exports=r.locals||{}},617:function(e,a,t){e.exports={advanced_search:"advanced_search",advanced_search__title__container:"advanced_search__title__container",advanced_search__title:"advanced_search__title",advanced_search__search:"advanced_search__search",advanced_search__search__navigation:"advanced_search__search__navigation",advanced_search__search__navigation__item__a:"advanced_search__search__navigation__item__a","advanced_search__search__navigation__item__a--active":"advanced_search__search__navigation__item__a--active",advanced_search__search__filds:"advanced_search__search__filds",advanced_search__search__button:"advanced_search__search__button",advanced_search__search__button__text:"advanced_search__search__button__text",advanced_search__search__checkbox:"advanced_search__search__checkbox"}}}]);
//# sourceMappingURL=3.bundle.js.map