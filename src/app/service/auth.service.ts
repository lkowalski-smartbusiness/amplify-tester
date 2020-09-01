import {Injectable} from '@angular/core';
import {Auth, Cache} from 'aws-amplify';
import {AuthState, CognitoUserInterface} from '@aws-amplify/ui-components';
import {BehaviorSubject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: CognitoUserInterface | undefined;
  authState: AuthState;

  hasAdminRole = false;
  hasWsparcieRole = false;
  hasFinanseRole = false;
  hasRealizacjaRole = false;
  hasInstalatorRole = false;
  hasSalesRole = false;
  public userData = '';
  public userRole = '';
  public greeting = '';
  authStateProcessor = new BehaviorSubject<any>({});

  parseRoles = {
    Administrator: 'Administrator',
    DyrektorSprzedazy: 'Dyrektor Sprzedaży',
    DyrektorHandlowy: 'Dyrektor Handlowy',
    WsparcieSprzedazy: 'Dział wsparcia',
    Finanse: 'Dział rozliczeń i kadr',
    Realizacja: 'Dział realizacji',
    Marketing: 'Dział marketingu',
    SerwisGwarancyjny: 'Serwis Gwarancyjny',
    StarszySpecjalista: 'Starszy specjalista',
    MlodszySpecjalista: 'Młodszy specjalista',
    Instalator: 'Instalator',
    Kandydat: 'Kandydat',
    Uzytkownik: 'Autoryzowany partner'
  };

  constructor() {
    this.authStateProcessor.subscribe(data => {
      this.manageState(data.authState, data.authData);
    });
  }

  manageState(authState = null, authData): void {
    if (authState === 'signedin' && authData) {
      this.hasAdminRole = this.hasRole(authData.getSignInUserSession(), 'Administrator');
      this.hasWsparcieRole = this.hasRole(authData.getSignInUserSession(), 'Wsparcie Sprzedaży');
      this.hasFinanseRole = this.hasRole(authData.getSignInUserSession(), 'Finanse');
      this.hasRealizacjaRole = this.hasRole(authData.getSignInUserSession(), 'Realizacja');
      this.hasInstalatorRole = this.hasRole(authData.getSignInUserSession(), 'Instalator');
      this.hasSalesRole = this.hasRole(authData.getSignInUserSession(), 'MlodszySpecjalista')
        || this.hasRole(authData.getSignInUserSession(), 'StarszySpecjalista')
        || this.hasRole(authData.getSignInUserSession(), 'DyrektorHandlowy')
        || this.hasRole(authData.getSignInUserSession(), 'DyrektorSprzedazy');

      this.userRole = this.getUserRole(authData);
      this.userData = this.getUserData(authData);
      this.greeting = this.getGreeting(authData);
    } else {
      this.user = null;
      this.hasAdminRole = false;
      this.hasWsparcieRole = false;
      this.hasFinanseRole = false;
      this.hasRealizacjaRole = false;
      this.hasInstalatorRole = false;
      this.userData = '';
      this.userRole = '';
    }
  }

  getUserRole(user): string {
    if (user) {
      let group = '';
      if (user.attributes
        && user.attributes['custom:position']
        && user.attributes['custom:position'] !== null) {
        group = user.attributes['custom:position'];
      } else if (user.signInUserSession &&
        user.signInUserSession.accessToken &&
        user.signInUserSession.accessToken.payload['cognito:groups']) {
        group = this.parseRoles[user.signInUserSession.accessToken.payload['cognito:groups'][0]];
      }
      return group;
    } else {
      return '';
    }
  }

  getUserData(user): string {
    if (user) {
      return user.attributes.name + ' ' + user.attributes.family_name;
    } else {
      return '';
    }
  }

  getGreeting(user): string {
    return 'Cześć ' + (user && user.attributes && user.attributes.name ? user.attributes.name : '') + '!';
  }

  hasRole(user, roleName): boolean {
    return user &&
      user.signInUserSession &&
      user.signInUserSession.accessToken &&
      user.signInUserSession.accessToken.payload['cognito:groups'] &&
      user.signInUserSession.accessToken.payload['cognito:groups'].includes(roleName);
  }

  toArrayOfStrings(object): string[] {
    const newObj = {...object};
    Object.keys(object).map((key) => {
      newObj[key] = [object[key]];
    });
    return newObj;
  }

  public signOut(global = false): void {
    Auth.signOut({ global }).then(() => {
      Cache.clear();
    })
      .catch(err => console.log(err));
  }

  signOutGlobal(): void {
    this.signOut(true);
  }
}
