System.register(["jimu-core","jimu-ui/advanced/setting-components","jimu-ui","jimu-theme","jimu-for-builder"],(function(t,e){var o={},n={},i={},r={},l={};return{setters:[function(t){o.Immutable=t.Immutable,o.React=t.React,o.ReactRedux=t.ReactRedux,o.appActions=t.appActions,o.classNames=t.classNames,o.css=t.css,o.getAppStore=t.getAppStore,o.hooks=t.hooks,o.injectIntl=t.injectIntl,o.jsx=t.jsx,o.polished=t.polished},function(t){n.QuickStylePopper=t.QuickStylePopper},function(t){i.Button=t.Button},function(t){r.useTheme=t.useTheme,r.useTheme2=t.useTheme2},function(t){l.appBuilderSync=t.appBuilderSync}],execute:function(){t((()=>{"use strict";var t={79244:t=>{t.exports=o},4108:t=>{t.exports=l},1888:t=>{t.exports=r},14321:t=>{t.exports=i},79298:t=>{t.exports=n}},e={};function s(o){var n=e[o];if(void 0!==n)return n.exports;var i=e[o]={exports:{}};return t[o](i,i.exports,s),i.exports}s.d=(t,e)=>{for(var o in e)s.o(e,o)&&!s.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:e[o]})},s.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),s.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var a={};return(()=>{s.r(a),s.d(a,{default:()=>m});var t,e,o,n,i,r=s(79244);!function(t){t.Regular="REGULAR",t.Hover="HOVER"}(t||(t={})),function(t){t.Horizontal="Horizontal",t.Vertical="Vertical"}(e||(e={})),function(t){t.Style0="Style0",t.Style1="Style1",t.Style2="Style2",t.Style3="Style3",t.Style4="Style4",t.Style5="Style5",t.Style6="Style6",t.Style7="Style7",t.Style8="Style8",t.Style9="Style9",t.Style10="Style10"}(o||(o={})),function(t){t.None="None",t.Point0="Point0",t.Point1="Point1",t.Point2="Point2",t.Point3="Point3",t.Point4="Point4",t.Point5="Point5",t.Point6="Point6",t.Point7="Point7",t.Point8="Point8"}(n||(n={})),function(t){t.None="None",t.Default="Default",t.Style1="Style1",t.Style2="Style2",t.Style3="Style3",t.Style4="Style4",t.Style5="Style5",t.Style6="Style6",t.Style7="Style7",t.Style8="Style8",t.Style9="Style9",t.Style10="Style10",t.Style11="Style11",t.Style12="Style12",t.Style13="Style13",t.Style14="Style14",t.Style15="Style15",t.Style16="Style16",t.Style17="Style17",t.Style18="Style18",t.Style19="Style19"}(i||(i={}));var l=s(79298),p=s(14321),y=s(1888);const S={_widgetLabel:"Divider",quickStyleItem:"Quick style {index}"};function d(t,e=1.5,o=null){if(!t)return"0px";const n=o?Number(o.split("px")[0]):0;let i=Number(t.split("px")[0]);return i=n>i?n:i,i*e<1?"1px":`${Math.round(i*e)}px`}const c=t=>{const{direction:o}=t,{size:n,color:i,type:l}=t.strokeStyle;return function(t,o,n=e.Horizontal,i=!1){const l=n===e.Horizontal,s={},a={};return o=o||"transparent",s.Style0=r.css`
    & {
      border-bottom: ${t} solid ${o};
    }
  `,s.Style1=r.css`
    & {
      border-bottom: ${t} dashed ${o};
    }
  `,s.Style2=r.css`
    & {
      border-bottom: ${t} dotted ${o};
    }
  `,s.Style3=r.css`
    & {
      height: ${t};
      position: relative;
    }
    &:before {
      position: absolute;
      content: '';
      height: ${t};
      left: ${d(t,4)};
      right: 0;
      background-image: repeating-linear-gradient(
        to right,
        ${o} 0,
        ${o} ${d(t,1)},
        transparent 0,
        transparent ${d(t,6)}
      );
    }
    &:after {
      position: absolute;
      content: '';
      height: ${t};
      left: 0;
      right: 0;
      background-image: repeating-linear-gradient(
        to right,
        ${o} 0,
        ${o} ${d(t,3)},
        transparent 0,
        transparent ${d(t,6)}
      );
    }
  `,s.Style6=r.css`
    & {
      height: ${t};
      background-image: repeating-linear-gradient(
        to right,
        ${o} 0,
        ${o} ${d(t,4)},
        transparent 0,
        transparent ${d(t,6)}
      );
    }
  `,s.Style7=r.css`
    & {
      border-color: ${o};
      border-bottom-style: double;
      border-bottom-width: ${i?"4px":t};
    }
  `,s.Style8=r.css`
    & {
      height: ${t};
      min-height: ${i?"6px":"unset"};
      position: relative;
    }
    &:before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: ${d(t,.2,"4px")};
      background: ${o};
    }
    &:after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: ${d(t,.4,"4px")};
      background: ${o};
    }
  `,s.Style9=r.css`
    & {
      height: ${t};
      min-height: ${i?"6px":"unset"};
      position: relative;
    }
    &:before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: ${d(t,.4,"4px")};
      background: ${o};
    }
    &:after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: ${d(t,.2,"4px")};
      background: ${o};
    }
  `,s.Style10=r.css`
    & {
      height: ${t};
      min-height: ${i?"8px":"unset"};
      position: relative;
      background-clip: content-box;
      border-top: ${d(t,.167)} solid ${o};
      border-bottom: ${d(t,.167)} solid ${o};
    }
    &:before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      height: ${i?"2px":d(t,.3)};
      background: ${o};
      transform: translateY(-50%);
    }
  `,a.Style0=r.css`
    & {
      border-left: ${t} solid ${o};
    }
  `,a.Style1=r.css`
    & {
      border-left: ${t} dashed ${o};
    }
  `,a.Style2=r.css`
    & {
      border-left: ${t} dotted ${o};
    }
  `,a.Style3=r.css`
    & {
      width: ${t};
      position: relative;
    }
    &:before {
      position: absolute;
      content: '';
      width: ${t};
      top: ${d(t,3.8)};
      bottom: 0;
      background-image: repeating-linear-gradient(
        to bottom,
        ${o} 0,
        ${o} ${d(t,1)},
        transparent 0,
        transparent ${d(t,6)}
      );
    }
    &:after {
      position: absolute;
      content: '';
      width: ${t};
      top: 0;
      bottom: 0;
      background-image: repeating-linear-gradient(
        to bottom,
        ${o} 0,
        ${o} ${d(t,2.5)},
        transparent 0,
        transparent ${d(t,6)}
      );
    }
  `,a.Style6=r.css`
    & {
      width: ${t};
      background-image: repeating-linear-gradient(
        to bottom,
        ${o} 0,
        ${o} ${d(t,4)},
        transparent 0,
        transparent ${d(t,6)}
      );
    }
  `,a.Style7=r.css`
    & {
      border-left: ${t} double ${o};
    }
  `,a.Style8=r.css`
    & {
      width: ${t};
      position: relative;
    }
    &:before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: ${d(t,.2,"4px")};
      background: ${o};
    }
    &:after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: ${d(t,.4,"4px")};
      background: ${o};
    }
  `,a.Style9=r.css`
    & {
      width: ${t};
      position: relative;
    }
    &:before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: ${d(t,.4,"4px")};
      background: ${o};
    }
    &:after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: ${d(t,.2,"4px")};
      background: ${o};
    }
  `,a.Style10=r.css`
    & {
      width: ${t};
      position: relative;
      background-clip: content-box;
      border-left: ${d(t,.167)} solid ${o};
      border-right: ${d(t,.167)} solid ${o};
    }
    &:before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      width: ${i?"2px":d(t,.3)};
      background: ${o};
      transform: translateX(-50%);
    }
  `,l?s:a}(n,i,o)[l]},u=t=>{const{direction:o,pointEnd:i,pointStart:l,strokeStyle:s}=t,a=o===e.Horizontal,p=l.pointStyle,y=l.pointSize*h(null==s?void 0:s.size),S=i.pointStyle,d=i.pointSize*h(null==s?void 0:s.size);return function(t,e,o,n,i){const l=e?n/2+"px":0,s=e?n/2.5+"px":0,a=o?i/2+"px":0,p=o?i/2.5+"px":0,y=r.css`
    left: ${l};
    right: ${a};
    top: 50%;
    transform: translateY(-50%);
    &.point-start-Point1,
    &.point-start-Point2,
    &.point-start-Point5 {
      left: 0;
    }
    &.point-end-Point1,
    &.point-end-Point2,
    &.point-end-Point5 {
      right: 0;
    }
    &.point-start-Point7 {
      left: ${s};
    }
    &.point-end-Point7 {
      right: ${p};
    }
  `,S=r.css`
    top: ${l};
    bottom: ${a};
    left: 50%;
    transform: translateX(-50%);
    &.point-start-Point1,
    &.point-start-Point2,
    &.point-start-Point5 {
      top: 0;
    }
    &.point-end-Point1,
    &.point-end-Point2,
    &.point-end-Point5 {
      bottom: 0;
    }
  `;return t?y:S}(a,p!==n.None,S!==n.None,y,d)},$=(t,o=!0)=>{const{pointEnd:n,pointStart:i,strokeStyle:l,direction:s}=t,a=Number(h(l.size)),p=(o?i.pointSize*a:n.pointSize*a)+"px",y=null==l?void 0:l.color,S=o?i.pointStyle:n.pointStyle,c=function(t,o,n=e.Horizontal,i=!0){const l=d(t,1),s=d(t,.5),a=d(t,.1),p=d(t,.3);o=o||"transparent";const y=n===e.Horizontal;let S={None:"None"},c={None:"None"};S.Point0=r.css`
    & {
      width: ${l};
      height: ${l};
      border-radius: 50%;
      background-color: ${o};
      left: ${i?0:"unset"};
      right: ${i?"unset":0};
      top: 50%;
      transform: translateY(-50%);
    }
  `,S.Point1=r.css`
    & {
      width: ${p};
      height: ${l};
      background-color: ${o};
      left: ${i?"4%":"unset"};
      right: ${i?"unset":"4%"};
      top: 50%;
      transform: translateY(-50%);
    }
  `,S.Point2=r.css`
    & {
      width: ${p};
      height: ${l};
      background-color: ${o};
      left: ${i?0:"unset"};
      right: ${i?"unset":0};
      top: 50%;
      transform: translateY(-50%);
    }
  `,S.Point3=r.css`
    & {
      width: ${l};
      height: ${l};
      background-color: ${o};
      left: ${i?0:"unset"};
      right: ${i?"unset":0};
      top: 50%;
      transform: translateY(-50%);
    }
  `,S.Point4=r.css`
    & {
      width: ${d(t,.71)};
      height: ${d(t,.71)};
      background-color: ${o};
      left: ${i?d(t,.2):"unset"};
      right: ${i?"unset":d(t,.2)};
      top: 50%;
      transform: translateY(-50%) rotate(45deg);
    }
  `;const u=r.css`
    .jimu-rtl & {
      border-color: transparent ${o} transparent transparent;
    }
    & {
      width: 0;
      height: 0;
      border-width: ${s};
      border-style: solid;
      border-color: transparent transparent transparent ${o};
      left: ${i?0:"unset"};
      right: ${i?"unset":`-${d(t,.5)}`};
      top: 50%;
      transform: translateY(-50%);
    }
  `,$=r.css`
    .jimu-rtl & {
      border-color: transparent transparent transparent ${o};
    }
    & {
      width: 0;
      height: 0;
      border-width: ${s};
      border-style: solid;
      border-color: transparent ${o} transparent transparent;
      left: ${i?`-${d(t,.5)}`:"unset"};
      right: ${i?"unset":0};
      top: 50%;
      transform: translateY(-50%);
    }
  `,h=r.css`
    .jimu-rtl & {
      border-top: ${p} solid ${o};
      border-left: ${p} solid ${o};
    }
    .jimu-ltr & {
      border-bottom: ${p} solid ${o};
      border-left: ${p} solid ${o};
    }
    & {
      width: ${d(t,.8)};
      height: ${d(t,.8)};
      left: ${i?`${d(t,.2)}`:"unset"};
      right: ${i?"unset":`-${d(t,.2)}`};
      top: 50%;
      border-radius: ${a};
      transform: translateY(-50%) rotate(45deg);
    }
  `,b=r.css`
    .jimu-rtl & {
      border-right: ${p} solid ${o};
      border-bottom: ${p} solid ${o};
    }
    .jimu-ltr & {
      border-top: ${p} solid ${o};
      border-right: ${p} solid ${o};
    }
    & {
      width: ${d(t,.8)};
      height: ${d(t,.8)};
      left: ${i?`-${d(t,.2)}`:"unset"};
      right: ${i?"unset":`${d(t,.2)}`};
      top: 50%;
      border-radius: ${a};
      transform: translateY(-50%) rotate(45deg);
    }
  `;c.Point0=r.css`
    & {
      width: ${l};
      height: ${l};
      border-radius: 50%;
      background-color: ${o};
      top: ${i?0:"unset"};
      bottom: ${i?"unset":0};
      left: 50%;
      transform: translateX(-50%);
    }
  `,c.Point1=r.css`
    & {
      width: ${l};
      height: ${p};
      background-color: ${o};
      top: ${i?"4%":"unset"};
      bottom: ${i?"unset":"4%"};
      left: 50%;
      transform: translateX(-50%);
    }
  `,c.Point2=r.css`
    & {
      width: ${l};
      height: ${p};
      background-color: ${o};
      top: ${i?0:"unset"};
      bottom: ${i?"unset":0};
      left: 50%;
      transform: translateX(-50%);
    }
  `,c.Point3=r.css`
    & {
      width: ${l};
      height: ${l};
      background-color: ${o};
      top: ${i?0:"unset"};
      bottom: ${i?"unset":0};
      left: 50%;
      transform: translateX(-50%);
    }
  `,c.Point4=r.css`
    & {
      width: ${d(t,.71)};
      height: ${d(t,.71)};
      background-color: ${o};
      top: ${i?d(t,.2):"unset"};
      bottom: ${i?"unset":d(t,.2)};
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
    }
  `;const m=r.css`
    & {
      width: 0;
      height: 0;
      border-width: ${s};
      border-style: solid;
      border-color: transparent transparent ${o} transparent;
      top: ${i?`-${d(t,.5)}`:"unset"};
      bottom: ${i?"unset":0};
      left: 50%;
      transform: translateX(-50%);
    }
  `,g=r.css`
    & {
      width: 0;
      height: 0;
      border-width: ${s};
      border-style: solid;
      border-color: ${o} transparent transparent transparent;
      top: ${i?0:"unset"};
      bottom: ${i?"unset":`-${d(t,.5)}`};
      left: 50%;
      transform: translateX(-50%);
    }
  `,f=r.css`
    .jimu-rtl & {
      border-bottom: ${p} solid ${o};
      border-left: ${p} solid ${o};
    }
    .jimu-ltr & {
      border-bottom: ${p} solid ${o};
      border-right: ${p} solid ${o};
    }
    & {
      width: ${d(t,.8)};
      height: ${d(t,.8)};
      top: ${i?`-${d(t,.2)}`:"unset"};
      bottom: ${i?"unset":`${d(t,.2)}`};
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
      border-radius: ${a};
    }
  `,k=r.css`
    .jimu-rtl & {
      border-top: ${p} solid ${o};
      border-right: ${p} solid ${o};
    }
    .jimu-ltr & {
      border-top: ${p} solid ${o};
      border-left: ${p} solid ${o};
    }
    & {
      width: ${d(t,.8)};
      height: ${d(t,.8)};
      top: ${i?`${d(t,.2)}`:"unset"};
      bottom: ${i?"unset":`-${d(t,.2)}`};
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
      border-radius: ${a};
    }
  `;let P,z;return i?(P={Point5:u,Point6:$,Point7:h,Point8:b},z={Point5:g,Point6:m,Point7:k,Point8:f}):(P={Point5:$,Point6:u,Point7:b,Point8:h},z={Point5:m,Point6:g,Point7:f,Point8:k}),S=Object.assign(Object.assign({},S),P),c=Object.assign(Object.assign({},c),z),y?S:c}(p,y,s,o);return c[S]},h=t=>{const e=t.split("px")[0];return Number(e)},b=(0,r.injectIntl)((t=>{const{isOpen:s,reference:a,id:d,usePopper:h,onInitResizeHandler:b,onInitDragHandler:m,onSettingChange:g}=t,f=r.React.useRef(null),k=r.ReactRedux.useSelector((t=>{var e,o,n;const i=(null===(e=null==t?void 0:t.appStateInBuilder)||void 0===e?void 0:e.appConfig)||t.appConfig,r=null===(n=null===(o=null==i?void 0:i.widgets)||void 0===o?void 0:o[d])||void 0===n?void 0:n.config;return f.current=r,r})),P=r.hooks.useTranslation(S),z=(0,y.useTheme)(),v=(0,y.useTheme2)(),x=()=>{var t,e,o,n;const i=z;return r.css`
      width: ${r.polished.rem(360)};
      z-index: 1001 !important;
      .quick-style-title {
        color: ${null===(e=null===(t=null==v?void 0:v.ref.palette)||void 0===t?void 0:t.neutral)||void 0===e?void 0:e[1e3]};
        cursor: pointer;
        font-size: ${r.polished.rem(16)};
        div,
        svg {
          color: ${null===(n=null===(o=null==v?void 0:v.ref.palette)||void 0===o?void 0:o.neutral)||void 0===n?void 0:n[1e3]};
        }
      }
      .button-item {
        width: 100%;
        font-size: ${r.polished.rem(13)};
      }
      button {
        border-radius: 0;
      }
      .quick-style-item-container {
        padding-left: 4px;
        padding-right: 4px;
        padding-bottom: 8px;
      }
      .quick-style-item {
        border: 2px solid transparent;
        &.quick-style-item-selected {
          border: 2px solid ${i.sys.color.primary.dark};
        }
        .quick-style-item-inner {
          background-color: ${i.ref.palette.neutral[300]};
          cursor: pointer;
        }
      }
    `},N=()=>{var t;const l=null===(t=null==k?void 0:k.themeStyle)||void 0===t?void 0:t.quickStyleType,s=[],a=function(t){const r="3px",l="6px",s=e.Horizontal;return{Default:{direction:s,strokeStyle:{type:o.Style0,color:t.ref.palette.neutral[1200],size:r},pointStart:{pointStyle:n.None,pointSize:4},pointEnd:{pointStyle:n.None,pointSize:4},themeStyle:{quickStyleType:i.Default}},Style1:{direction:s,strokeStyle:{type:o.Style2,color:t.sys.color.error.dark,size:r},pointStart:{pointStyle:n.None,pointSize:4},pointEnd:{pointStyle:n.None,pointSize:4},themeStyle:{quickStyleType:i.Style1}},Style2:{direction:s,strokeStyle:{type:o.Style3,color:t.sys.color.warning.dark,size:r},pointStart:{pointStyle:n.None,pointSize:4},pointEnd:{pointStyle:n.None,pointSize:4},themeStyle:{quickStyleType:i.Style2}},Style3:{direction:s,strokeStyle:{type:o.Style6,color:t.ref.palette.neutral[1100],size:r},pointStart:{pointStyle:n.None,pointSize:4},pointEnd:{pointStyle:n.None,pointSize:4},themeStyle:{quickStyleType:i.Style3}},Style4:{direction:s,strokeStyle:{type:o.Style1,color:t.ref.palette.neutral[1100],size:r},pointStart:{pointStyle:n.None,pointSize:4},pointEnd:{pointStyle:n.None,pointSize:4},themeStyle:{quickStyleType:i.Style4}},Style5:{direction:s,strokeStyle:{type:o.Style7,color:t.sys.color.info.main,size:l},pointStart:{pointStyle:n.None,pointSize:4},pointEnd:{pointStyle:n.None,pointSize:4},themeStyle:{quickStyleType:i.Style5}},Style6:{direction:s,strokeStyle:{type:o.Style8,color:t.sys.color.success.dark,size:l},pointStart:{pointStyle:n.None,pointSize:4},pointEnd:{pointStyle:n.None,pointSize:4},themeStyle:{quickStyleType:i.Style6}},Style7:{direction:s,strokeStyle:{type:o.Style9,color:t.ref.palette.neutral[1100],size:l},pointStart:{pointStyle:n.None,pointSize:4},pointEnd:{pointStyle:n.None,pointSize:4},themeStyle:{quickStyleType:i.Style7}},Style18:{direction:s,strokeStyle:{type:o.Style0,color:t.ref.palette.neutral[1100],size:r},pointStart:{pointStyle:n.None,pointSize:4},pointEnd:{pointStyle:n.Point7,pointSize:4},themeStyle:{quickStyleType:i.Style18}},Style19:{direction:s,strokeStyle:{type:o.Style0,color:t.sys.color.info.main,size:r},pointStart:{pointStyle:n.Point0,pointSize:2},pointEnd:{pointStyle:n.Point6,pointSize:4},themeStyle:{quickStyleType:i.Style19}},Style8:{direction:s,strokeStyle:{type:o.Style0,color:t.ref.palette.neutral[1100],size:r},pointStart:{pointStyle:n.Point3,pointSize:4},pointEnd:{pointStyle:n.Point3,pointSize:4},themeStyle:{quickStyleType:i.Style8}},Style9:{direction:s,strokeStyle:{type:o.Style0,color:t.sys.color.warning.dark,size:r},pointStart:{pointStyle:n.Point6,pointSize:4},pointEnd:{pointStyle:n.Point6,pointSize:4},themeStyle:{quickStyleType:i.Style9}},Style10:{direction:s,strokeStyle:{type:o.Style0,color:t.sys.color.error.dark,size:r},pointStart:{pointStyle:n.Point4,pointSize:4},pointEnd:{pointStyle:n.Point4,pointSize:4},themeStyle:{quickStyleType:i.Style10}},Style11:{direction:s,strokeStyle:{type:o.Style0,color:t.ref.palette.neutral[1100],size:r},pointStart:{pointStyle:n.Point5,pointSize:4},pointEnd:{pointStyle:n.Point5,pointSize:4},themeStyle:{quickStyleType:i.Style11}},Style12:{direction:s,strokeStyle:{type:o.Style0,color:t.ref.palette.neutral[1100],size:r},pointStart:{pointStyle:n.Point2,pointSize:4},pointEnd:{pointStyle:n.Point2,pointSize:4},themeStyle:{quickStyleType:i.Style12}},Style13:{direction:s,strokeStyle:{type:o.Style0,color:t.sys.color.success.dark,size:r},pointStart:{pointStyle:n.Point7,pointSize:4},pointEnd:{pointStyle:n.Point7,pointSize:4},themeStyle:{quickStyleType:i.Style13}},Style14:{direction:s,strokeStyle:{type:o.Style0,color:t.sys.color.info.main,size:r},pointStart:{pointStyle:n.Point0,pointSize:4},pointEnd:{pointStyle:n.Point0,pointSize:4},themeStyle:{quickStyleType:i.Style14}},Style15:{direction:s,strokeStyle:{type:o.Style0,color:t.ref.palette.neutral[1100],size:r},pointStart:{pointStyle:n.Point8,pointSize:4},pointEnd:{pointStyle:n.Point8,pointSize:4},themeStyle:{quickStyleType:i.Style15}},Style16:{direction:s,strokeStyle:{type:o.Style10,color:t.ref.palette.neutral[1100],size:"8px"},pointStart:{pointStyle:n.None,pointSize:4},pointEnd:{pointStyle:n.None,pointSize:4},themeStyle:{quickStyleType:i.Style16}},Style17:{direction:s,strokeStyle:{type:o.Style0,color:t.sys.color.error.dark,size:r},pointStart:{pointStyle:n.Point1,pointSize:4},pointEnd:{pointStyle:n.Point1,pointSize:4},themeStyle:{quickStyleType:i.Style17}}}}(z);let y=0;for(const t in a){y+=1;const e=a[t],{pointStart:o,pointEnd:i,themeStyle:S}=e,d=c(e),h=u(e),b=$(e,!0),m=$(e,!1),g=(0,r.classNames)("divider-line","position-absolute",`point-start-${o.pointStyle}`,`point-end-${i.pointStyle}`),f=(0,r.jsx)("div",{key:t,className:"col-6 quick-style-item-container"},(0,r.jsx)("div",{className:(0,r.classNames)("quick-style-item",{"quick-style-item-selected":l===S.quickStyleType})},(0,r.jsx)(p.Button,{className:"quick-style-item-inner p-2 w-100",onClick:()=>{w(e)},title:P("quickStyleItem",{index:y})},(0,r.jsx)("div",{className:"quick-style-item-inner p-2 position-relative"},o.pointStyle!==n.None&&(0,r.jsx)("span",{className:"point-start position-absolute",css:b}),(0,r.jsx)("div",{className:g,css:[d,h]}),i.pointStyle!==n.None&&(0,r.jsx)("span",{className:"point-end position-absolute",css:m})))));s.push(f)}return s},w=r.hooks.useEventCallback((t=>{var o;t.direction=(null===(o=f.current)||void 0===o?void 0:o.direction)||e.Horizontal,g((0,r.Immutable)(t))}));return(0,r.jsx)("div",null,h?(0,r.jsx)(l.QuickStylePopper,{reference:a,open:s,placement:"right-start",css:x(),trapFocus:!1,autoFocus:!1,onClose:()=>{((t=!1)=>{(0,r.getAppStore)().dispatch(r.appActions.widgetStatePropChange(d,"showQuickStyle",t))})(!1)},onInitResizeHandler:b,onInitDragHandler:m},(0,r.jsx)("div",{className:"container-fluid mb-2"},(0,r.jsx)("div",{className:"row no-gutters"},N()))):(0,r.jsx)("div",{className:"container-fluid mb-2",css:x()},(0,r.jsx)("div",{className:"row no-gutters"},N())))}));const m={appBuilderSync:s(4108).appBuilderSync,QuickStyle:b}})(),a})())}}}));