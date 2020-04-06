import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";
// import { map, filter, switchMap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  user: any;

  constructor(private http: HttpClient) { }

  registerUser(user):Observable<any> {
    return this.http.post('http://localhost:3000/users/register', user, httpOptions);
  }

  authenticateUser(user): Observable<any> {
    return this.http.post('http://localhost:3000/users/authenticate', user, httpOptions);
  }

  getProfile() {
    this.loadToken();
    const headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': this.authToken
    });
    return this.http.get('http://localhost:3000/users/profile', {headers: headers});
  }

  storeUserData(token, user){
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;

  }

  loggedIn() {
    const helpers = new JwtHelperService();
    const isExpired = !helpers.isTokenExpired(localStorage.getItem('id_token'));
    return isExpired;
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}