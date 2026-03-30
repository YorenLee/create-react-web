import { useState, useEffect, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { PATH } from '@router/routes';
import { githubCallback } from '@service/Login';
import type { LoginState, LoginActions, LoginHandlers, GitHubUser } from './types';
import jsCookie from 'js-cookie';
import { TokenKey } from '@/constant/index';


// GitHub OAuth 配置
const GITHUB_CLIENT_ID = 'Ov23li3oG1tO7FAP7Eb3';
const GITHUB_REDIRECT_URI = `${window.location.origin}/auth/github/callback`;
const GITHUB_AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(GITHUB_REDIRECT_URI)}`;

interface UseLoginParams {
    onLoginSuccess?: (user: GitHubUser) => void;
    onLoginError?: (error: string) => void;
}

export const useLogin = (params?: UseLoginParams): LoginState & LoginActions => {
    const history = useHistory();
    const location = useLocation();
    const [state, setState] = useState<LoginState>({
        loading: false,
        error: null,
        user: null
    });

    // 从 localStorage 恢复用户信息
    useEffect(() => {
        // const savedUser = localStorage.getItem('github_user');
        // if (savedUser) {
        //     try {
        //         const user = JSON.parse(savedUser);
        //         setState(prev => ({ ...prev, user }));
        //     } catch (error) {
        //         console.error('Failed to parse saved user:', error);
        //         localStorage.removeItem('github_user');
        //     }
        // }
    }, []);

    // 处理 GitHub 回调
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        console.log('code', code);
        if (error) {
            const errorDescription = searchParams.get('error_description') || '授权失败';
            setState(prev => ({
                ...prev,
                loading: false,
                error: errorDescription
            }));
            params?.onLoginError?.(errorDescription);
            // 清除 URL 中的错误参数
            history.replace(PATH.LOGIN);
            return;
        }

        if (code) {
            handleGitHubCallback(code);
        }
    }, [location.search]);

    // 处理 GitHub 回调，用 code 换取 token 和用户信息
    const handleGitHubCallback = async (code: string) => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            // 调用后端接口，用 code 换取 token 和用户信息
            const response = await githubCallback(code);
            const responseData = response.data;

            // 处理不同的响应格式
            // 格式1: { token: 'xxx', user: {...} }
            // 格式2: { token: 'xxx', ...userInfo } (token 和用户信息在同一层级)
            // 格式3: 直接返回用户信息，token 在响应头中
            const token = responseData.token || responseData.accessToken || responseData.access_token;
            const userData: GitHubUser = responseData.user || responseData;
            
            if (token) {
                jsCookie.set(TokenKey, token, { expires: 7 });
            }
            // 保存用户信息到 localStorage
            localStorage.setItem('github_user', JSON.stringify(userData));
            
            setState(prev => ({
                ...prev,
                loading: false,
                user: userData,
                error: null
            }));

            // 清除 URL 中的 code 参数
            history.replace(PATH.LOGIN);

            // 触发成功回调
            params?.onLoginSuccess?.(userData);

            // 登录成功后跳转到首页
            history.push(PATH.HOME);
        } catch (error: any) {
            // 处理 axios 错误
            const errorMessage = 
                error?.response?.data?.message || 
                error?.message || 
                '登录失败，请重试';
            setState(prev => ({
                ...prev,
                loading: false,
                error: errorMessage
            }));
            params?.onLoginError?.(errorMessage);
            // 清除 URL 中的 code 参数
            history.replace(PATH.LOGIN);
        }
    };

    // 处理 GitHub 登录跳转
    const handleGitHubLogin = useCallback(() => {
        if (!GITHUB_CLIENT_ID) {
            setState(prev => ({
                ...prev,
                error: 'GitHub Client ID 未配置，请联系管理员'
            }));
            return;
        }

        setState(prev => ({ ...prev, loading: true, error: null }));
        // 跳转到 GitHub 授权页面
        window.location.href = GITHUB_AUTH_URL;
    }, []);

    // 处理登出
    const handleLogout = useCallback(() => {
        jsCookie.remove(TokenKey);
        // 清除 localStorage
        localStorage.removeItem('github_user');
        setState({
            loading: false,
            error: null,
            user: null
        });
        history.push(PATH.LOGIN);
    }, [history]);

    return {
        ...state,
        handleGitHubLogin,
        handleLogout
    };
};

