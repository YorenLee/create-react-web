import React, { CSSProperties, useEffect, useMemo, useState } from 'react';
import styles from './index.module.css';

type PresetValue = 'baseline' | 'middle' | 'top' | 'bottom' | 'text-top' | 'text-bottom' | 'sub' | 'super';

interface AlignmentOption {
    value: PresetValue;
    title: string;
    summary: string;
    detail: string;
}

const ALIGNMENT_OPTIONS: AlignmentOption[] = [
    {
        value: 'baseline',
        title: 'baseline',
        summary: '基线对基线（默认值）',
        detail: '让元素自身的基线与父元素的文字基线对齐。没有内部文字的 inline-block，通常可以把它理解为底边贴着基线。'
    },
    {
        value: 'middle',
        title: 'middle',
        summary: '靠近文字的视觉中部',
        detail: '元素中点对齐到“父元素基线 + x-height 的一半”。它不是容器高度的绝对居中。'
    },
    {
        value: 'top',
        title: 'top',
        summary: '贴齐整行的顶部',
        detail: '元素顶部与当前 line box 的顶部对齐。这里比较的是整行，而不是旁边文字字形的顶部。'
    },
    {
        value: 'bottom',
        title: 'bottom',
        summary: '贴齐整行的底部',
        detail: '元素底部与当前 line box 的底部对齐。处理行内图片下方缝隙时经常会用到。'
    },
    {
        value: 'text-top',
        title: 'text-top',
        summary: '贴齐父文字的顶部',
        detail: '元素顶部对齐父元素字体区域的顶部。它关注文字，而 top 关注整行。'
    },
    {
        value: 'text-bottom',
        title: 'text-bottom',
        summary: '贴齐父文字的底部',
        detail: '元素底部对齐父元素字体区域的底部。它关注文字，而 bottom 关注整行。'
    },
    {
        value: 'sub',
        title: 'sub',
        summary: '下标位置',
        detail: '把元素降到下标位置。浏览器会根据当前字体决定具体偏移量。'
    },
    {
        value: 'super',
        title: 'super',
        summary: '上标位置',
        detail: '把元素升到上标位置。浏览器会根据当前字体决定具体偏移量。'
    }
];

const QUICK_RULES = [
    {
        number: '01',
        title: '先确认它是不是行内参与者',
        text: 'vertical-align 主要作用于 inline、inline-block、inline-table，以及 table-cell。普通 block 元素上不会按你期待的方式生效。'
    },
    {
        number: '02',
        title: '它对齐的是“这一行”',
        text: '在行内排版中，它调的是元素在 line box 里的垂直位置；它不是 Flexbox 那种容器级居中工具。'
    },
    {
        number: '03',
        title: '正数向上，负数向下',
        text: '长度和百分比都以 baseline 为起点。vertical-align: 12px 会抬高元素，-12px 则会压低元素。'
    }
];

function BaselineMarker() {
    return <span className={styles.baselineMarker} aria-hidden="true" />;
}

function ComparisonCard({ option }: { option: AlignmentOption }) {
    return (
        <article className={styles.compareCard}>
            <div className={styles.compareHeading}>
                <code>{option.value}</code>
                <span>{option.summary}</span>
            </div>
            <div className={styles.compareStage}>
                <BaselineMarker />
                <span>Ag</span>
                <span className={styles.compareTarget} style={{ verticalAlign: option.value }} aria-hidden="true">
                    <span />
                </span>
                <span>xy</span>
            </div>
        </article>
    );
}

const VerticalAlignLab: React.FC = () => {
    const [selected, setSelected] = useState<PresetValue | 'custom'>('baseline');
    const [offset, setOffset] = useState(12);
    const [targetHeight, setTargetHeight] = useState(64);
    const [showGuides, setShowGuides] = useState(true);

    useEffect(() => {
        const previousTitle = document.title;
        document.title = 'vertical-align 直觉实验室';
        return () => {
            document.title = previousTitle;
        };
    }, []);

    const verticalAlign = selected === 'custom' ? `${offset}px` : selected;
    const selectedOption = useMemo(() => ALIGNMENT_OPTIONS.find(option => option.value === selected), [selected]);

    const chooseOffset = (value: number) => {
        setOffset(value);
        setSelected('custom');
    };

    return (
        <main className={styles.page}>
            <header className={styles.hero}>
                <a className={styles.brand} href="#playground" aria-label="跳到实验区">
                    <span className={styles.brandMark}>va</span>
                    <span>CSS 直觉实验室</span>
                </a>
                <div className={styles.heroContent}>
                    <p className={styles.eyebrow}>CSS · INLINE FORMATTING</p>
                    <h1>
                        看懂 <code>vertical-align</code>
                        <br />
                        只需要盯住一条线。
                    </h1>
                    <p className={styles.heroIntro}>
                        它不是“垂直居中”属性。它决定的是：一个行内元素，要怎样站在当前这行文字的基线上。
                    </p>
                    <a className={styles.primaryAction} href="#playground">
                        开始动手试
                        <span aria-hidden="true">↓</span>
                    </a>
                </div>
                <div className={styles.heroDemo} aria-hidden="true">
                    <div className={styles.heroLine}>
                        <BaselineMarker />
                        <span>A</span>
                        <span className={styles.heroShapeOne} />
                        <span>line</span>
                        <span className={styles.heroShapeTwo} />
                    </div>
                    <p>所有故事，都从 baseline 开始</p>
                </div>
            </header>

            <section className={styles.playgroundSection} id="playground">
                <div className={styles.sectionHeading}>
                    <p className={styles.sectionIndex}>01 / PLAYGROUND</p>
                    <div>
                        <h2>亲手移动它</h2>
                        <p>切换属性值，观察紫色元素和文字基线的关系。</p>
                    </div>
                </div>

                <div className={styles.labGrid}>
                    <div className={styles.controlPanel}>
                        <div className={styles.controlGroup}>
                            <div className={styles.controlTitle}>
                                <span>选择属性值</span>
                                <code>vertical-align</code>
                            </div>
                            <div className={styles.optionGrid}>
                                {ALIGNMENT_OPTIONS.map(option => (
                                    <button
                                        className={`${styles.optionButton} ${
                                            selected === option.value ? styles.optionButtonActive : ''
                                        }`}
                                        type="button"
                                        key={option.value}
                                        aria-pressed={selected === option.value}
                                        onClick={() => setSelected(option.value)}
                                    >
                                        {option.title}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.controlGroup}>
                            <div className={styles.controlTitle}>
                                <span>自定义偏移</span>
                                <output>
                                    {offset > 0 ? '+' : ''}
                                    {offset}px
                                </output>
                            </div>
                            <input
                                className={styles.range}
                                type="range"
                                min="-40"
                                max="40"
                                value={offset}
                                onChange={event => chooseOffset(Number(event.target.value))}
                                aria-label="自定义 vertical-align 像素偏移"
                            />
                            <div className={styles.rangeLabels}>
                                <span>向下 -40</span>
                                <span>baseline</span>
                                <span>向上 +40</span>
                            </div>
                        </div>

                        <div className={styles.controlGroup}>
                            <div className={styles.controlTitle}>
                                <span>目标元素高度</span>
                                <output>{targetHeight}px</output>
                            </div>
                            <input
                                className={styles.range}
                                type="range"
                                min="36"
                                max="96"
                                value={targetHeight}
                                onChange={event => setTargetHeight(Number(event.target.value))}
                                aria-label="目标元素高度"
                            />
                        </div>

                        <label className={styles.guideToggle}>
                            <input
                                type="checkbox"
                                checked={showGuides}
                                onChange={event => setShowGuides(event.target.checked)}
                            />
                            <span aria-hidden="true" />
                            显示文字基线
                        </label>
                    </div>

                    <div className={styles.demoPanel}>
                        <div className={styles.demoPanelTop}>
                            <div>
                                <span className={styles.liveDot} />
                                LIVE PREVIEW
                            </div>
                            <code>vertical-align: {verticalAlign};</code>
                        </div>

                        <div className={`${styles.mainStage} ${showGuides ? '' : styles.guidesHidden}`}>
                            <div className={styles.stageLine}>
                                <BaselineMarker />
                                <span className={styles.stageText}>文字 Ay</span>
                                <span
                                    className={styles.target}
                                    style={
                                        {
                                            height: `${targetHeight}px`,
                                            verticalAlign
                                        } as CSSProperties
                                    }
                                >
                                    <span className={styles.targetInner}>
                                        <strong>目标元素</strong>
                                        <small>{verticalAlign}</small>
                                    </span>
                                </span>
                                <span className={styles.stageText}>继续排版</span>
                            </div>
                            <div className={styles.baselineLegend}>
                                <span />
                                这条虚线就是当前文字的 baseline
                            </div>
                        </div>

                        <div className={styles.explanation} aria-live="polite">
                            <span className={styles.explanationNumber}>→</span>
                            <div>
                                <strong>{selectedOption?.summary ?? `${offset}px：相对基线移动`}</strong>
                                <p>
                                    {selectedOption?.detail ??
                                        `${offset}px 是一个长度值：${
                                            offset === 0
                                                ? '元素回到基线位置。'
                                                : offset > 0
                                                  ? '正数让元素向上移动。'
                                                  : '负数让元素向下移动。'
                                        }`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.compareSection}>
                <div className={styles.sectionHeading}>
                    <p className={styles.sectionIndex}>02 / COMPARE</p>
                    <div>
                        <h2>把八个值放在一起</h2>
                        <p>每张卡片使用完全相同的文字、元素高度和行高，只有 vertical-align 不同。</p>
                    </div>
                </div>
                <div className={styles.compareGrid}>
                    {ALIGNMENT_OPTIONS.map(option => (
                        <ComparisonCard key={option.value} option={option} />
                    ))}
                </div>
                <div className={styles.differenceCallout}>
                    <span>最容易混淆</span>
                    <p>
                        <code>top / bottom</code> 对齐整条 line box；<code>text-top / text-bottom</code>{' '}
                        对齐父元素的字体区域。
                    </p>
                </div>
            </section>

            <section className={styles.examplesSection}>
                <div className={styles.sectionHeading}>
                    <p className={styles.sectionIndex}>03 / REAL CASES</p>
                    <div>
                        <h2>它在真实界面里做什么</h2>
                        <p>两个常见场景，能帮你把规则记牢。</p>
                    </div>
                </div>

                <div className={styles.exampleGrid}>
                    <article className={styles.exampleCard}>
                        <div className={styles.exampleMeta}>
                            <span>CASE A</span>
                            <code>图标 + 文字</code>
                        </div>
                        <div className={styles.iconComparison}>
                            <div>
                                <p>baseline</p>
                                <div className={styles.iconLine}>
                                    保存成功 <span className={styles.statusIconBaseline}>✓</span>
                                </div>
                            </div>
                            <div>
                                <p>middle</p>
                                <div className={styles.iconLine}>
                                    保存成功 <span className={styles.statusIconMiddle}>✓</span>
                                </div>
                            </div>
                        </div>
                        <p className={styles.exampleNote}>小图标和文字并排时，middle 往往更接近人眼感受到的居中。</p>
                    </article>

                    <article className={styles.exampleCard}>
                        <div className={styles.exampleMeta}>
                            <span>CASE B</span>
                            <code>图片底部缝隙</code>
                        </div>
                        <div className={styles.imageComparison}>
                            <div>
                                <p>默认 baseline</p>
                                <div className={styles.imageLine}>
                                    <span className={styles.fakeImage} style={{ verticalAlign: 'baseline' }}>
                                        IMG
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p>bottom</p>
                                <div className={styles.imageLine}>
                                    <span className={styles.fakeImage} style={{ verticalAlign: 'bottom' }}>
                                        IMG
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p className={styles.exampleNote}>
                            图片默认站在基线上，下面会给 g、p、y 的“尾巴”预留空间；bottom 可让它贴住行底。
                        </p>
                    </article>
                </div>
            </section>

            <section className={styles.rulesSection}>
                <div className={styles.sectionHeading}>
                    <p className={styles.sectionIndex}>04 / REMEMBER</p>
                    <div>
                        <h2>最后，只记住三件事</h2>
                    </div>
                </div>
                <div className={styles.rulesGrid}>
                    {QUICK_RULES.map(rule => (
                        <article key={rule.number} className={styles.ruleCard}>
                            <span>{rule.number}</span>
                            <h3>{rule.title}</h3>
                            <p>{rule.text}</p>
                        </article>
                    ))}
                </div>
                <div className={styles.syntaxCard}>
                    <div>
                        <span className={styles.syntaxComment}>/* 现代布局请优先考虑 flex / grid */</span>
                        <code>
                            .icon {'{'}
                            <br />
                            &nbsp;&nbsp;display: inline-block;
                            <br />
                            &nbsp;&nbsp;vertical-align: middle;
                            <br />
                            {'}'}
                        </code>
                    </div>
                    <p>
                        <strong>判断口诀：</strong>
                        先问“它是否在一行文字里？”。是，就想 baseline；不是，就考虑 Flexbox 或 Grid。
                    </p>
                </div>
            </section>

            <footer className={styles.footer}>
                <span>CSS 直觉实验室 · vertical-align</span>
                <div className={styles.footerLinks}>
                    <a href="#playground">再试一次 ↑</a>
                    <a href="/css-cascade-layers">下一课：@layer →</a>
                </div>
            </footer>
        </main>
    );
};

export default VerticalAlignLab;
