import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from './index.module.css';

interface Chapter {
    title: string;
    text: string;
}

interface StoryGroup {
    images: string[];
    chapters: Chapter[];
}

const STORY_DATA: StoryGroup[] = [
    {
        images: [
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=600&fit=crop'
        ],
        chapters: [
            {
                title: '山间晨曦',
                text: '当第一缕阳光穿透薄雾，山谷被镀上了一层金色。远处的雪峰在晨光中闪烁，宛如天地间的灯塔。清风拂过松林，带来泥土与松针混合的芬芳，让人忍不住深深呼吸。'
            },
            {
                title: '溪流与森林',
                text: '沿着蜿蜒的小径深入森林，耳畔是溪水跳跃在石头间的清脆声响。阳光透过树冠洒下斑驳的光影，在苔藓覆盖的地面上跳舞。每一步都踩在厚厚的落叶上，发出沙沙的低语。'
            },
            {
                title: '密林深处',
                text: '越往深处走，树木越发高大茂密，仿佛进入了一座绿色的教堂。巨大的树根盘踞在地面，蕨类植物在阴影中舒展着优雅的叶片。这里的时间仿佛静止了，只有偶尔传来的鸟鸣提醒你世界仍在运转。'
            }
        ]
    },
    {
        images: [
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1476673160081-cf065607f449?w=800&h=600&fit=crop'
        ],
        chapters: [
            {
                title: '海岸线的召唤',
                text: '离开山林，来到了广阔的海岸线。湛蓝的海水在阳光下泛着粼粼波光，白色的浪花一波又一波地拍打着沙滩。海风咸湿而温柔，将发丝吹得四处飘散。'
            },
            {
                title: '浪花与礁石',
                text: '退潮后的礁石间藏着无数小世界——海葵缓缓舒展触手，寄居蟹急匆匆地换了一个壳，海星静静地趴在石头上晒太阳。每一个潮汐池都是一个微型的海洋博物馆。'
            },
            {
                title: '日落海湾',
                text: '傍晚时分，太阳缓缓沉入海平线，天空被染成了壮丽的橙红色。渔船的剪影在金色的海面上缓缓移动，海鸥在暮色中划出优雅的弧线。这一刻，时间仿佛凝固在了永恒。'
            }
        ]
    },
    {
        images: [
            'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=600&fit=crop',
            'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=600&fit=crop'
        ],
        chapters: [
            {
                title: '城市苏醒',
                text: '当黎明的光线触碰到城市的天际线，摩天大楼的玻璃幕墙开始反射出金色的光芒。街道上开始出现早起跑步的人、遛狗的老人、匆匆赶路的上班族。城市，在咖啡的香气中慢慢苏醒。'
            },
            {
                title: '街巷故事',
                text: '走进老城区的街巷，砖墙上爬满了藤蔓，街角的面包店飘出刚出炉的面包香。一位老人坐在门口看报纸，几个孩子在巷子里追逐嬉戏。每一面墙都写满了故事，每一扇窗户后面都有一段生活。'
            },
            {
                title: '霓虹闪烁',
                text: '入夜后的城市换上了另一副面孔。霓虹灯将街道染上了五彩斑斓的色彩，车灯在马路上汇成流动的光河。橱窗里的展品在灯光下显得格外诱人，空气中弥漫着各种美食的香味。'
            },
            {
                title: '城市入眠',
                text: '深夜的城市终于安静下来。街灯投下温暖的光晕，偶尔一辆出租车驶过空旷的大街。远处高楼上零星的灯光，是谁在加班，又是谁在守望这座城市的梦。'
            }
        ]
    }
];

const GROUP_COLORS = ['#0f172a', '#1a1a2e', '#162447'];

function ScrollytellingGroup({ group, groupIndex }: { group: StoryGroup; groupIndex: number }) {
    const [activeChapter, setActiveChapter] = useState(0);
    const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);

    const setChapterRef = useCallback(
        (index: number) => (el: HTMLDivElement | null) => {
            chapterRefs.current[index] = el;
        },
        []
    );

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        chapterRefs.current.forEach((el, index) => {
            if (!el) return;
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setActiveChapter(index);
                    }
                },
                { threshold: 0.5 }
            );
            observer.observe(el);
            observers.push(observer);
        });

        return () => observers.forEach(o => o.disconnect());
    }, []);

    const bgColor = GROUP_COLORS[groupIndex % GROUP_COLORS.length];
    const imageIndex = Math.min(activeChapter, group.images.length - 1);

    return (
        <section className={styles.group} style={{ backgroundColor: bgColor }}>
            <div className={styles.groupInner}>
                {/* 左侧 sticky 图片区 */}
                <div className={styles.stickyLeft}>
                    <div className={styles.imageContainer}>
                        {group.images.map((src, i) => (
                            <img
                                key={src}
                                src={src}
                                alt={`group-${groupIndex}-img-${i}`}
                                className={`${styles.image} ${i === imageIndex ? styles.imageActive : ''}`}
                            />
                        ))}
                        <div className={styles.imageIndicators}>
                            {group.images.map((_, i) => (
                                <span key={i} className={`${styles.dot} ${i === imageIndex ? styles.dotActive : ''}`} />
                            ))}
                        </div>
                        <div className={styles.groupLabel}>
                            {groupIndex + 1} / {STORY_DATA.length}
                        </div>
                    </div>
                </div>

                {/* 右侧叙事滚动区 */}
                <div className={styles.narrativeRight}>
                    {group.chapters.map((chapter, i) => (
                        <div
                            key={i}
                            ref={setChapterRef(i)}
                            className={`${styles.chapter} ${i === activeChapter ? styles.chapterActive : ''}`}
                        >
                            <div className={styles.chapterContent}>
                                <span className={styles.chapterNumber}>{String(i + 1).padStart(2, '0')}</span>
                                <h2 className={styles.chapterTitle}>{chapter.title}</h2>
                                <p className={styles.chapterText}>{chapter.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const Scrollytelling: React.FC = () => {
    return (
        <div className={styles.container}>
            {/* 顶部 Hero */}
            <header className={styles.hero}>
                <h1 className={styles.heroTitle}>滚动叙事</h1>
                <p className={styles.heroSubtitle}>向下滚动，开启一段视觉旅程</p>
                <div className={styles.scrollHint}>
                    <span className={styles.scrollArrow}>↓</span>
                </div>
            </header>

            {/* 多组滚动叙事 */}
            {STORY_DATA.map((group, index) => (
                <ScrollytellingGroup key={index} group={group} groupIndex={index} />
            ))}

            {/* 底部 */}
            <footer className={styles.footer}>
                <p>— 旅程结束 —</p>
                <p className={styles.footerSub}>感谢你的阅读</p>
            </footer>
        </div>
    );
};

export default Scrollytelling;
