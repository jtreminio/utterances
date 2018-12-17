import { settings } from './app-settings';
import { param } from './deparam';

const authorizeUrl = `${settings.utterances_api}/authorize`;
const tokenUrl = `${settings.utterances_api}/token`;
// tslint:disable-next-line:variable-name
const redirect_uri = `${location.origin}/authorized.html`;

class Token {
  private readonly storageKey = 'OAUTH_TOKEN2';
  private token: string | null = null;

  constructor() {
    try {
      this.token = localStorage.getItem(this.storageKey);
      // tslint:disable-next-line:no-empty
    } catch (e) { }
  }

  get value() {
    return this.token;
  }
  set value(newValue) {
    this.token = newValue;
    try {
      if (newValue === null) {
        localStorage.removeItem(this.storageKey);
      } else {
        localStorage.setItem(this.storageKey, newValue);
      }
      // tslint:disable-next-line:no-empty
    } catch (e) { }
  }
}

export const token = new Token();

export function login() {
  window.open(`${authorizeUrl}?${param({ redirect_uri })}`);
  return new Promise(resolve => (window as any).notifyAuthorized = resolve)
    .then(search => fetch(tokenUrl + search, { mode: 'cors' }))
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      return response.text().then(text => Promise.reject(`Error retrieving token:\n${text}`));
    })
    .then(t => { token.value = t; }, reason => { token.value = null; throw reason; });
}
