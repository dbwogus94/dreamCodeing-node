import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AuthService from './service/auth';
import TweetService from './service/tweet';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthErrorEventBus } from './context/AuthContext';

/* ### 의존성 관리 */
// 1) HttpClient, TokenStorage 클래스 추가
import HttpClient from './network/http';
import TokenStorage from './db/token';
// 2) HttpClient, TokenStorage 인스턴스화
const baseURL = process.env.REACT_APP_BASE_URL;
const httpClient = new HttpClient(baseURL);
const tokenStorage = new TokenStorage();
// 3) 생성자에 인자로 전달(의존성 주입)
const tweetService = new TweetService(httpClient, tokenStorage);
const authService = new AuthService(httpClient, tokenStorage);

const authErrorEventBus = new AuthErrorEventBus();

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider authService={authService} authErrorEventBus={authErrorEventBus}>
        <App tweetService={tweetService} />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
