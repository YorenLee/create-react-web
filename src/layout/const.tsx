import { PATH } from '@router/routes';
export interface NavItem {
    label: string;
    path: string;
}
export const NavList: NavItem[] = [
    {
        label: 'home',
        path: PATH.HOME
    },
    {
        label: 'APP',
        path: PATH.APP
    },
    {
        label: 'Chat',
        path: PATH.CHAT
    }
];
