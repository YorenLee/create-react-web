import React, { Suspense } from 'react';
import * as Sentry from '@sentry/react';
import { RouteConfig } from 'react-router-config';

import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';
const ScanAuthLogin = React.lazy(() => import('@pages/login/scan_auth_login'));
const Login = React.lazy(() => import('@pages/login'));
const GitHubCallback = React.lazy(() => import('@pages/login/GitHubCallback'));
const Home = React.lazy(() => import('@pages/home'));
const Layout = React.lazy(() => import('@layout/index'));
const App = React.lazy(() => import('@pages/app'));
const ContextDemo = React.lazy(() => import('@pages/contextDemo'));
const FileUpload = React.lazy(() => import('@pages/file-upload'));
const LanguageSwitch = React.lazy(() => import('@pages/language'));
const Chat = React.lazy(() => import('@pages/chat'));
//  / 和/home 应该是同一个，并且点击home 路由应该是/
export enum PATH {
    HOME = '/',
    LOGIN = '/login',
    AUTH_LOGIN = '/scan-auth-login',
    GITHUB_CALLBACK = '/auth/github/callback',
    APP = '/app',
    CONTEXTDEMO = '/contextdemo',
    FILE_UPLOAD = '/file-upload',
    LANGUAGE = '/language',
    CHAT = '/chat',
    CHAT_SESSION = '/chat/:sessionId'
}
const layoutRoutes = [
    {
        path: PATH.APP,
        component: App
    },
    {
        path: PATH.HOME,
        component: Home
    }
] as RouteConfig[];

export const AppRoutes = [
    {
        path: PATH.LOGIN,
        component: Login
    },
    {
        path: PATH.GITHUB_CALLBACK,
        component: GitHubCallback
    },
    {
        path: PATH.AUTH_LOGIN,
        component: ScanAuthLogin
    },
    {
        path: PATH.CONTEXTDEMO,
        component: ContextDemo
    },
    {
        path: PATH.FILE_UPLOAD,
        component: FileUpload
    },
    {
        path: PATH.LANGUAGE,
        component: LanguageSwitch
    },
    {
        path: PATH.CHAT_SESSION,
        component: Chat
    },
    {
        path: PATH.CHAT,
        component: Chat
    },
    {
        path: '/',
        name: 'home',
        component: Layout,
        routes: layoutRoutes
    }

    // {
    //     path: '/about',
    //     Component: About
    // }
] as RouteConfig[];
