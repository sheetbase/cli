import * as http from 'http';
import * as url from 'url';
import {pathExists, readJson, remove} from 'fs-extra';
import * as querystring from 'querystring';
import {OAuth2Client} from 'google-auth-library';
import {constantCase} from 'change-case';
const open = require('open');
const config = require('configstore');

export interface GoogleAccountProfile {
  id: string;
  email: string;
  name?: string;
  imageUrl?: string;
}

export interface GoogleAccount {
  refreshToken: string;
  profile: GoogleAccountProfile;
  grantedAt?: number;
  fullDrive?: boolean;
}

export interface GoogleAccounts {
  [id: string]: GoogleAccount;
}

export class GoogleService {
  private configstore = new config('sheetbase_cli');
  private googleRcPath = '.googlerc.json';
  private oauth2ClientSettings = {
    clientId:
      '352194396091-6vcd921aj9g8vaovl20su2trgdhcdocq.apps.googleusercontent.com',
    clientSecret: 'Y_0P-DwQCv_40MQWxM-PlruO',
    redirectUri: 'http://localhost:3160/oauth2callback',
  };

  constructor() {}

  getOauth2Opts(fullDrive = false) {
    return {
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/drive' + (fullDrive ? '' : '.file'),
        'https://www.googleapis.com/auth/script.deployments',
        'https://www.googleapis.com/auth/script.projects',
        'https://www.googleapis.com/auth/cloud-platform.read-only',
        'https://www.googleapis.com/auth/logging.read',
      ],
    };
  }

  async getAllAccounts() {
    const googleAccounts = this.configstore.get(
      'google_accounts'
    ) as GoogleAccounts;
    if (
      !googleAccounts ||
      !(googleAccounts instanceof Object) ||
      Object.keys(googleAccounts).length <= 0
    ) {
      throw new Error('No google accounts');
    }
    return googleAccounts;
  }

  async getAccount(id: string) {
    let googleAccount: GoogleAccount;
    if (id) {
      const googleAccounts = await this.getAllAccounts();
      googleAccount = (googleAccounts || {})[id];
    } else {
      const localAccount = await this.getLocalAccount();
      if (localAccount) {
        googleAccount = localAccount;
      } else {
        googleAccount = await this.getDefaultAccount();
      }
    }
    return googleAccount;
  }

  async getDefaultAccount() {
    const id = this.getDefaultAccountId();
    const googleAccounts = await this.getAllAccounts();
    return (googleAccounts || {})[id];
  }

  async getLocalAccount() {
    let googleAccount: GoogleAccount;
    if (await pathExists(this.googleRcPath)) {
      googleAccount = await readJson(this.googleRcPath);
    } else {
      throw new Error('No local google account.');
    }
    return googleAccount;
  }

  async removeAllAccounts() {
    this.removeTemporaryRefeshToken(); // try remove any not yet retrieve refresh token
    // get all accounts for reporting purpose
    const disconnectedGoogleAccounts: GoogleAccounts = await this.getAllAccounts();
    // delete all accounts
    this.configstore.delete('google_accounts');
    this.removeDefaultAccountId(); // remove default account id
    // report
    return disconnectedGoogleAccounts;
  }

  async removeAccount(id: string) {
    this.removeTemporaryRefeshToken(); // try remove any not yet retrieve refresh token
    // check against default id
    if (id === this.getDefaultAccountId()) {
      return this.removeDefaultAccount();
    }
    // get the account for reporting purpose
    const googleAccount: GoogleAccount = await this.getAccount(id);
    if (!id || !googleAccount) {
      throw new Error('Invalid id.');
    }
    // delete the account
    this.configstore.delete(`google_accounts.${id}`);
    // report
    const disconnectedGoogleAccounts: GoogleAccounts = {};
    disconnectedGoogleAccounts[id] = googleAccount;
    return disconnectedGoogleAccounts;
  }

  async removeDefaultAccount() {
    this.removeTemporaryRefeshToken(); // try remove any not yet retrieve refresh token
    // get the account for reporting purpose
    const defaultAccount: GoogleAccount = await this.getDefaultAccount();
    if (!defaultAccount) {
      throw new Error('No default google account.');
    }
    // delete the account
    const {id} = defaultAccount.profile;
    this.configstore.delete(`google_accounts.${id}`);
    // try to set default account to the first one found if available
    const googleAccounts: GoogleAccounts = await this.getAllAccounts();
    if (googleAccounts) {
      const [firstId] = Object.keys(googleAccounts);
      await this.setDefaultAccountId(firstId);
    } else {
      this.removeDefaultAccountId();
    }
    // report
    const disconnectedGoogleAccounts: GoogleAccounts = {};
    disconnectedGoogleAccounts[id] = defaultAccount;
    return disconnectedGoogleAccounts;
  }

  async removeLocalAccount() {
    const localAccount = await this.getLocalAccount();
    if (!localAccount) {
      throw new Error('No local google account.');
    }
    await remove(this.googleRcPath);
    // report
    const disconnectedGoogleAccounts: GoogleAccounts = {};
    disconnectedGoogleAccounts[localAccount.profile.id] = localAccount;
    return disconnectedGoogleAccounts;
  }

  async setAccount(googleAccount: GoogleAccount) {
    const {id} = googleAccount.profile;
    this.configstore.set(`google_accounts.${id}`, googleAccount);
    if (!this.getDefaultAccountId()) {
      await this.setDefaultAccountId(id); // set default to this account
    }
    return this.getAllAccounts();
  }

  async retrieveTemporaryAccount(fullDrive = false) {
    let account: GoogleAccount;
    const tempRefreshToken = this.getTemporaryRefeshToken();
    if (tempRefreshToken) {
      const profile: GoogleAccountProfile = await this.getUserProfile(
        tempRefreshToken
      );
      const googleAccount: GoogleAccount = {
        refreshToken: tempRefreshToken,
        profile,
        grantedAt: new Date().getTime(),
        fullDrive,
      };
      const accounts = await this.setAccount(googleAccount);
      account = accounts[googleAccount.profile.id];
    } else {
      throw new Error('No google refresh token found.');
    }
    return account;
  }

  getDefaultAccountId() {
    return this.configstore.get('google_accounts_default_id') as string;
  }

  async setDefaultAccountId(id: string) {
    const googleAccounts: GoogleAccounts = await this.getAllAccounts();
    if (!(googleAccounts || {})[id]) throw new Error('Invalid id.');
    this.configstore.set('google_accounts_default_id', id);
    return id;
  }

  removeDefaultAccountId() {
    this.configstore.delete('google_accounts_default_id');
  }

  getTemporaryRefeshToken() {
    const tempRefreshToken = this.configstore.get(
      'google_refresh_token'
    ) as string;
    this.removeTemporaryRefeshToken(); // remove right after retrieve
    return tempRefreshToken;
  }

  removeTemporaryRefeshToken() {
    this.configstore.delete('google_refresh_token');
  }

  async getDefaultOAuth2Client() {
    const id = this.getDefaultAccountId(); // default account
    return this.getOAuth2ClientById(id);
  }

  async getOAuth2Client(id: string, refreshToken: string) {
    if (refreshToken) {
      return this.getOAuth2ClientByRefreshToken(refreshToken);
    } else {
      return this.getOAuth2ClientById(id);
    }
  }

  async getOAuth2ClientById(id: string) {
    const {refreshToken} = await this.getAccount(id);
    return this.getOAuth2ClientByRefreshToken(refreshToken);
  }

  async getOAuth2ClientByRefreshToken(refreshToken: string) {
    const client = new OAuth2Client(this.oauth2ClientSettings);
    client.setCredentials({refresh_token: refreshToken});
    await client.getRequestHeaders();
    return client;
  }

  async getUserProfile(refreshToken: string) {
    const client = await this.getOAuth2ClientByRefreshToken(refreshToken);
    if (!client) {
      throw new Error('No google oauth2 client!');
    }
    const userData = await client.verifyIdToken({
      idToken: client.credentials.id_token as string,
      audience: this.oauth2ClientSettings.clientId,
    });
    const payload = userData.getPayload();
    const {aud, sub, email, name, picture} = payload || {};
    if (aud !== this.oauth2ClientSettings.clientId) {
      throw new Error('Not a valid id token!');
    }
    return {
      id: sub as string,
      email: email as string,
      name: name || constantCase((email as string).split('@')[0]),
      imageUrl: picture,
    };
  }

  authorizeWithLocalhost(fullDrive?: boolean) {
    return new Promise((resolve, reject) => {
      const oAuth2Client = new OAuth2Client(this.oauth2ClientSettings);
      oAuth2Client.on('tokens', tokens => {
        if (tokens.refresh_token) {
          // temporary save to configstore for later use
          this.configstore.set('google_refresh_token', tokens.refresh_token);
        }
      });

      const authorizeUrl = oAuth2Client.generateAuthUrl(
        this.getOauth2Opts(fullDrive)
      );
      const server = http
        .createServer(async (req, res) => {
          if ((req.url as string).indexOf('/oauth2callback') > -1) {
            const qs = querystring.parse(new url.URL(req.url as string).search);
            if (qs.error) {
              res.end(
                this.getOauthMessage(
                  'https://png.icons8.com/dusk/128/000000/cancel.png',
                  'Failed!',
                  'There is something wrong with the authorization process. Please try again!'
                )
              );
            } else {
              res.end(
                this.getOauthMessage(
                  'https://png.icons8.com/dusk/128/000000/ok.png',
                  'Succeed!',
                  'You may close this browser tab and return to the console.'
                )
              );
            }
            server.close();

            if (qs.code) {
              try {
                const r = await oAuth2Client.getToken(qs.code as string);
                oAuth2Client.setCredentials(r.tokens);
                resolve(oAuth2Client);
              } catch (error) {
                reject(error);
              }
            } else {
              reject();
            }
          }
        })
        .listen(3160, () => {
          open(authorizeUrl, {wait: false});
        });
    });
  }

  getOauthMessage(icon: string, title: string, message: string) {
    return (
      '' +
      `
  <style>
    .container {
      text-align: center;
      padding-top: 100px;
    }
    img {
      max-width: 150px;
    }
  </style>
  <div class="container">
    <img src="${icon}">
    <h1>${title}</h1>
    <p>${message}</p>
  </div>
  `
    );
  }
}
