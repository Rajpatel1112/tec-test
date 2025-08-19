import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly AUTH_KEY = 'isAuthenticated';

  constructor() {}

  login(username: string, password: string): boolean {
 
    let _users = localStorage.getItem('users');
    let _usersJson:[] = JSON.parse(_users!);
    if(_usersJson){
      let _res = _usersJson.some((x:any)=>x.username == username && x.password == password);
      if(_res){
        localStorage.setItem(this.AUTH_KEY, 'true');
        return true;  
      }
    }
    else{
      alert('user not register');
    }
    return false;
  }

  register(username: string, password: string): void {
    
    let _users = localStorage.getItem('users');
    let _usersJson = JSON.parse(_users!);
    let _userArr = [];
    if(_usersJson){
      _userArr = _usersJson;
    }
    _userArr.push({username:username,password:password});
    localStorage.setItem('users',JSON.stringify(_userArr));
    console.log(`Registered with username: ${username}`);
  }

  logout(): void {
    localStorage.setItem(this.AUTH_KEY, 'false'); 
  }  

  isAuthenticated(): boolean {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.AUTH_KEY) === 'true';
  }
  return false; 
}
}
