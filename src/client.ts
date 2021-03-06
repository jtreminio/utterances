import { settings } from './app-settings';
import { param } from './deparam';
import { ResizeMessage } from './measure';

let script = document.currentScript as HTMLScriptElement;
if (script === undefined) {
  // Internet Explorer :(
  // tslint:disable-next-line:max-line-length
  script = document.querySelector(`script[src^="https://${settings.app_root}/client.js"],script[src^="http://localhost:4000/client.js"]`) as HTMLScriptElement;
}

// gather script element's attributes
const attrs: { [name: string]: string; } = {};
for (let i = 0; i < script.attributes.length; i++) {
  const attribute = script.attributes.item(i)!;
  attrs[attribute.name] = attribute.value;
}

// gather page attributes
const canonicalLink = document.querySelector(`link[rel='canonical']`) as HTMLLinkElement;
attrs.url = canonicalLink ? canonicalLink.href : location.origin + location.pathname + location.search;
attrs.origin = location.origin;
attrs.pathname = location.pathname.substr(1).replace(/\.\w+$/, '');
attrs.title = document.title;
const descriptionMeta = document.querySelector(`meta[name='description']`) as HTMLMetaElement;
attrs.description = descriptionMeta ? descriptionMeta.content : '';
const ogtitleMeta = document.querySelector(`meta[property='og:title'],meta[name='og:title']`) as HTMLMetaElement;
attrs['og:title'] = ogtitleMeta ? ogtitleMeta.content : '';

// create the standard utterances styles and insert them at the beginning of the
// <head> for easy overriding.
// NOTE: the craziness with "width" is for mobile safari :(
document.head.insertAdjacentHTML(
  'afterbegin',
  `<style>
    .utterances {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      max-width: 760px;
      margin-left: auto;
      margin-right: auto;
    }
    .utterances-frame {
      position: absolute;
      left: 0;
      right: 0;
      width: 1px;
      min-width: 100%;
      max-width: 100%;
      height: 100%;
      border: 0;
    }
  </style>`);

// create the comments iframe and it's responsive container
const prodUrlRegex = `http://${settings.app_root}`.replace('.', '\\.').replace('//', '\\/\\/');
var re = new RegExp(`^${prodUrlRegex}|http:\/\/localhost:\d+`, 'g');
const utterancesOrigin = script.src.match(re)![0];
const url = `${utterancesOrigin}/utterances.html`;
script.insertAdjacentHTML(
  'afterend',
  `<div class="utterances">
    <iframe class="utterances-frame" title="Comments" scrolling="no" src="${url}?${param(attrs)}"></iframe>
  </div>`);
const container = script.nextElementSibling as HTMLDivElement;
script.parentElement!.removeChild(script);

// adjust the iframe's height when the height of it's content changes
addEventListener('message', event => {
  if (event.origin !== utterancesOrigin) {
    return;
  }
  const data = event.data as ResizeMessage;
  if (data && data.type === 'resize' && data.height) {
    container.style.height = `${data.height}px`;
  }
});
