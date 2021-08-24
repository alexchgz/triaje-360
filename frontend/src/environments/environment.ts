// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { UserRole } from '../app/shared/auth.roles';

export const environment = {
  production: false,
  buyUrl : 'https://1.envato.market/6NV1b',
  SCARF_ANALYTICS : false,
  adminRoot: '/app/dashboards/all',
  apiUrl: 'https://api.coloredstrategies.com',
  base_url: 'http://localhost:3000/api',
  defaultMenuType: 'menu-default',
  subHiddenBreakpoint: 1440,
  menuHiddenBreakpoint: 768,
  themeColorStorageKey: 'vien-themecolor',
  isMultiColorActive: true,
  /*
  Color Options:
  'light.blueyale', 'light.blueolympic', 'light.bluenavy', 'light.greenmoss',
  'light.greenlime', 'light.yellowgranola', 'light.greysteel', 'light.orangecarrot',
  'light.redruby', 'light.purplemonster'

  'dark.blueyale', 'dark.blueolympic', 'dark.bluenavy', 'dark.greenmoss',
  'dark.greenlime', 'dark.yellowgranola', 'dark.greysteel', 'dark.orangecarrot',
  'dark.redruby', 'dark.purplemonster'
  */
  defaultColor: 'light.blueyale',
  isDarkSwitchActive: true,
  defaultDirection: 'ltr',
  themeRadiusStorageKey: 'vien-themeradius',
  isAuthGuardActive: true,
  defaultRole: UserRole.Admin,
  firebase: {
    apiKey: 'AIzaSyCqoNLB_jTw4nncO12qR-eDH9gAeWiZVaw',
    authDomain: 'vien-angular-login.firebaseapp.com',
    databaseURL: 'https://vien-angular-login.firebaseio.com',
    projectId: 'vien-angular-login',
    storageBucket: 'vien-angular-login.appspot.com',
    messagingSenderId: '16217062888',
    appId: '1:16217062888:web:6b08232ca0c9662fedb85d',
    measurementId: 'G-8ETT79WRRN'
  }
};