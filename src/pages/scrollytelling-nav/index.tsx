import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { flushSync } from 'react-dom';
import { RouteConfig } from 'react-router-config';
import RichRoute from '@router/rich-route';
import styles from './index.module.css';

interface NavItem {
    path: string;
    label: string;
    badge: string;
}

const NAV_ITEMS: NavItem[] = [
    {
        path: '/scrollytelling',
        label: 'IntersectionObserver',
        badge: '方案 A'
    },
    {
        path: '/scrollytelling/css',
        label: 'CSS scroll-timeline',
        badge: '方案 C'
    },
    {
        path: '/scrollytelling/scroll',
        label: 'Scroll Progress',
        badge: '方案 B'
    }
];

const ScrollytellingLayout: React.FC<{ route: RouteConfig[] }> = ({ route }) => {
    const history = useHistory();
    const location = useLocation();

    const navigateTo = (path: string) => {
        if (path === location.pathname) return;

        if (document.startViewTransition) {
            document.startViewTransition(() => {
                flushSync(() => {
                    history.push(path);
                });
            });
        } else {
            history.push(path);
        }
    };

    return (
        <>
            <nav className={styles.nav}>
                <div className={styles.navInner}>
                    <span className={styles.navTitle}>Scrollytelling</span>
                    <div className={styles.navItems}>
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.path}
                                className={`${styles.navBtn} ${
                                    location.pathname === item.path ? styles.navBtnActive : ''
                                }`}
                                onClick={() => navigateTo(item.path)}
                            >
                                <span className={styles.navBadge}>{item.badge}</span>
                                <span className={styles.navLabel}>{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </nav>
            <RichRoute route={route} />
        </>
    );
};

export default ScrollytellingLayout;
