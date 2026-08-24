import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './index.module.css';

type LayerName = 'reset' | 'base' | 'components' | 'utilities';

interface LayerDefinition {
    name: LayerName;
    index: string;
    role: string;
    rule: string;
}

const LAYERS: LayerDefinition[] = [
    {
        name: 'reset',
        index: '01',
        role: '抹平浏览器默认差异',
        rule: 'background: #e4e1da; color: #4c4852; border-radius: 0;'
    },
    {
        name: 'base',
        index: '02',
        role: '定义全站基础外观',
        rule: 'background: #bdf7dc; color: #153d2b; border-radius: 8px;'
    },
    {
        name: 'components',
        index: '03',
        role: '定义具体组件',
        rule: 'background: #7357ff; color: white; border-radius: 999px;'
    },
    {
        name: 'utilities',
        index: '04',
        role: '最后的单一用途覆盖',
        rule: 'background: #202025; color: #f6d365; text-transform: uppercase;'
    }
];

const INITIAL_LAYERS: Record<LayerName, boolean> = {
    reset: true,
    base: true,
    components: true,
    utilities: false
};

const LAYER_CLASS_NAMES: Record<LayerName, string> = {
    reset: styles.resetRule,
    base: styles.baseRule,
    components: styles.componentRule,
    utilities: styles.utilityRule
};

const CascadeLayersLab: React.FC = () => {
    const [enabledLayers, setEnabledLayers] = useState(INITIAL_LAYERS);
    const [useUnlayeredRule, setUseUnlayeredRule] = useState(false);
    const [showImportantResult, setShowImportantResult] = useState(false);

    useEffect(() => {
        const previousTitle = document.title;
        document.title = '@layer 层叠实验室';
        return () => {
            document.title = previousTitle;
        };
    }, []);

    const winningLayer = useMemo(() => {
        if (useUnlayeredRule) {
            return '未分层样式';
        }

        return [...LAYERS].reverse().find(layer => enabledLayers[layer.name])?.name ?? '浏览器默认样式';
    }, [enabledLayers, useUnlayeredRule]);

    const previewClassName = [
        styles.previewButton,
        ...LAYERS.filter(layer => enabledLayers[layer.name]).map(layer => LAYER_CLASS_NAMES[layer.name]),
        useUnlayeredRule ? styles.unlayeredRule : ''
    ]
        .filter(Boolean)
        .join(' ');

    const toggleLayer = (name: LayerName) => {
        setEnabledLayers(current => ({ ...current, [name]: !current[name] }));
    };

    const resetDemo = () => {
        setEnabledLayers(INITIAL_LAYERS);
        setUseUnlayeredRule(false);
    };

    return (
        <main className={styles.page}>
            <header className={styles.hero}>
                <nav className={styles.lessonNav} aria-label="课程导航">
                    <Link to="/vertical-align">01 · vertical-align</Link>
                    <span>02 · @layer</span>
                </nav>

                <div className={styles.heroCopy}>
                    <p className={styles.eyebrow}>CSS CASCADE LAYERS · LESSON 02</p>
                    <h1>
                        别再和
                        <br />
                        <span>优先级</span>打架。
                    </h1>
                    <p>
                        <code>@layer</code> 给 CSS 规则排队。先决定 reset、base、components
                        谁优先，再去写每一层里的属性。
                    </p>
                    <a href="#layer-order" className={styles.heroAction}>
                        从顺序开始
                        <span aria-hidden="true">↓</span>
                    </a>
                </div>

                <div className={styles.heroStack} aria-label="层叠顺序示意图">
                    <div className={`${styles.stackCard} ${styles.stackUtility}`}>
                        <span>04</span>
                        <strong>utilities</strong>
                        <small>普通规则优先级最高</small>
                    </div>
                    <div className={`${styles.stackCard} ${styles.stackComponent}`}>
                        <span>03</span>
                        <strong>components</strong>
                        <small>按钮、卡片、弹窗</small>
                    </div>
                    <div className={`${styles.stackCard} ${styles.stackBase}`}>
                        <span>02</span>
                        <strong>base</strong>
                        <small>排版和全局基础</small>
                    </div>
                    <div className={`${styles.stackCard} ${styles.stackReset}`}>
                        <span>01</span>
                        <strong>reset</strong>
                        <small>最低优先级</small>
                    </div>
                </div>
            </header>

            <section className={styles.orderSection} id="layer-order">
                <div className={styles.sectionHeading}>
                    <p>01 / ORDER</p>
                    <div>
                        <h2>先用一行，锁定层的顺序</h2>
                        <p>对于普通声明，写在后面的层优先。层里有多少选择器、写在哪个文件，都不会改变这张座次表。</p>
                    </div>
                </div>

                <div className={styles.orderStatement}>
                    <span className={styles.codeLineNumber}>1</span>
                    <code>
                        <b>@layer</b> reset, base, components, utilities;
                    </code>
                </div>

                <div className={styles.orderRail}>
                    <div className={styles.railLabel}>
                        <span>低</span>
                        <span>普通声明的优先级</span>
                        <span>高</span>
                    </div>
                    <div className={styles.railLine} />
                    <div className={styles.orderCards}>
                        {LAYERS.map(layer => (
                            <article key={layer.name}>
                                <span>{layer.index}</span>
                                <code>{layer.name}</code>
                                <p>{layer.role}</p>
                            </article>
                        ))}
                    </div>
                </div>

                <div className={styles.coreRule}>
                    <span>核心规则</span>
                    <strong>先比较 layer，再比较 specificity。</strong>
                    <p>因此后面层里的一个简单类，可以战胜前面层里非常复杂的选择器。</p>
                </div>
            </section>

            <section className={styles.playgroundSection}>
                <div className={styles.sectionHeading}>
                    <p>02 / PLAYGROUND</p>
                    <div>
                        <h2>关掉一层，看谁接管按钮</h2>
                        <p>下面不是动画模拟：按钮真的同时命中了不同 @layer 中的 CSS 规则。</p>
                    </div>
                </div>

                <div className={styles.lab}>
                    <div className={styles.rulePanel}>
                        <div className={styles.panelTop}>
                            <span>启用的规则</span>
                            <button type="button" onClick={resetDemo}>
                                恢复默认
                            </button>
                        </div>

                        <div className={styles.ruleList}>
                            {LAYERS.map(layer => {
                                const enabled = enabledLayers[layer.name];
                                const isWinner = !useUnlayeredRule && winningLayer === layer.name;
                                return (
                                    <article
                                        className={`${styles.ruleItem} ${enabled ? styles.ruleItemEnabled : ''}`}
                                        key={layer.name}
                                    >
                                        <button
                                            type="button"
                                            className={styles.layerToggle}
                                            aria-pressed={enabled}
                                            onClick={() => toggleLayer(layer.name)}
                                        >
                                            <span className={styles.toggleTrack} aria-hidden="true">
                                                <span />
                                            </span>
                                            <code>@layer {layer.name}</code>
                                        </button>
                                        <pre>{`.button { ${layer.rule} }`}</pre>
                                        {isWinner && <span className={styles.winnerBadge}>WINNER</span>}
                                    </article>
                                );
                            })}
                        </div>

                        <label className={styles.unlayeredToggle}>
                            <input
                                type="checkbox"
                                checked={useUnlayeredRule}
                                onChange={event => setUseUnlayeredRule(event.target.checked)}
                            />
                            <span aria-hidden="true" />
                            再添加一条“未分层”的普通规则
                        </label>
                    </div>

                    <div className={styles.previewPanel}>
                        <div className={styles.previewStatus}>
                            <span>当前获胜</span>
                            <strong>{winningLayer}</strong>
                        </div>

                        <div className={styles.previewStage}>
                            <button className={previewClassName} type="button">
                                保存修改
                            </button>
                            <div className={styles.appliedLayers}>
                                {LAYERS.map(layer => (
                                    <span
                                        key={layer.name}
                                        className={enabledLayers[layer.name] ? styles.layerActive : ''}
                                    >
                                        {layer.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className={`${styles.resultNote} ${useUnlayeredRule ? styles.resultWarning : ''}`}>
                            {useUnlayeredRule ? (
                                <>
                                    <strong>未分层的普通样式赢了。</strong>
                                    <p>同一来源中，未放进 @layer 的普通声明，比所有分层的普通声明优先。</p>
                                </>
                            ) : (
                                <>
                                    <strong>越靠后的已启用层获胜。</strong>
                                    <p>关掉 components 后，base 会自动接管；不用增加选择器，也不用写 !important。</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.specificitySection}>
                <div className={styles.sectionHeading}>
                    <p>03 / SPECIFICITY</p>
                    <div>
                        <h2>层级顺序，比选择器权重更早比较</h2>
                        <p>这正是 @layer 最有价值的地方：不用堆叠越来越长的选择器。</p>
                    </div>
                </div>

                <div className={styles.fightCard}>
                    <div className={styles.fightCode}>
                        <div>
                            <span>早期层 · 权重较高</span>
                            <pre>
                                <b>@layer base</b> {'{'}
                                {`\n`}
                                {'  '}.card .toolbar .action {'{'}
                                {`\n`}
                                {'    '}background: tomato;{`\n`}
                                {'  '}
                                {'}'}
                                {`\n`}
                                {'}'}
                            </pre>
                        </div>
                        <div>
                            <span>后期层 · 权重较低</span>
                            <pre>
                                <b>@layer components</b> {'{'}
                                {`\n`}
                                {'  '}.action {'{'}
                                {`\n`}
                                {'    '}background: #7357ff;{`\n`}
                                {'  '}
                                {'}'}
                                {`\n`}
                                {'}'}
                            </pre>
                        </div>
                    </div>
                    <div className={styles.fightResult}>
                        <div className={styles.specificityCard}>
                            <div className={styles.specificityToolbar}>
                                <button
                                    className={`${styles.specificityTarget} ${styles.componentSpecificityTarget}`}
                                    type="button"
                                >
                                    components 获胜
                                </button>
                            </div>
                        </div>
                        <p>
                            <code>.action</code> 虽然更简单，但它所在的 components 层更靠后，所以直接获胜。
                        </p>
                    </div>
                </div>
            </section>

            <section className={styles.organizeSection}>
                <div className={styles.sectionHeading}>
                    <p>04 / HOW TO WRITE</p>
                    <div>
                        <h2>分层很多，属性到底写在哪里？</h2>
                        <p>不用把同一套属性复制到每层。每层只负责一类决策。</p>
                    </div>
                </div>

                <div className={styles.responsibilityGrid}>
                    <article>
                        <code>reset</code>
                        <h3>只做清理</h3>
                        <p>box-sizing、margin 清零、表单继承字体。不要在这里设计按钮颜色。</p>
                    </article>
                    <article>
                        <code>base</code>
                        <h3>只做全局基础</h3>
                        <p>body、标题、链接、排版节奏与设计变量。让没有组件类的 HTML 也可读。</p>
                    </article>
                    <article>
                        <code>components</code>
                        <h3>组件的大部分样式</h3>
                        <p>.button、.card、.dialog 的完整外观通常都写在这里。</p>
                    </article>
                    <article>
                        <code>utilities</code>
                        <h3>一次只解决一件事</h3>
                        <p>.hidden、.text-center、.mt-4 等明确覆盖组件的工具类。</p>
                    </article>
                </div>

                <div className={styles.fileExample}>
                    <div className={styles.fileTree}>
                        <span>styles/</span>
                        <span>├── reset.css</span>
                        <span>├── base.css</span>
                        <span>├── components/</span>
                        <span>│&nbsp;&nbsp; ├── button.css</span>
                        <span>│&nbsp;&nbsp; └── card.css</span>
                        <span>└── utilities.css</span>
                    </div>
                    <div className={styles.importCode}>
                        <span>app.css</span>
                        <pre>
                            <b>@layer</b> reset, base, components, utilities;{`\n\n`}
                            <b>@import</b> url('./reset.css') layer(reset);{`\n`}
                            <b>@import</b> url('./base.css') layer(base);{`\n`}
                            <b>@import</b> url('./components/button.css') layer(components);{`\n`}
                            <b>@import</b> url('./utilities.css') layer(utilities);
                        </pre>
                        <p>@import 必须放在其他样式规则之前；顶部的 @layer 顺序声明可以放在它前面。</p>
                    </div>
                </div>
            </section>

            <section className={styles.importantSection}>
                <div className={styles.sectionHeading}>
                    <p>05 / EXCEPTION</p>
                    <div>
                        <h2>最后认识一个反转规则</h2>
                        <p>
                            使用 !important 时，layer 的优先顺序会反过来。这是为了保护 reset 等早期层中的重要防护规则。
                        </p>
                    </div>
                </div>

                <div className={styles.importantDemo}>
                    <div className={styles.importantCode}>
                        <pre>
                            <span>@layer reset</span> {'{'}
                            {`\n`}
                            {'  '}.demo {'{'} color: #e34c67 <b>!important</b>; {'}'}
                            {`\n`}
                            {'}'}
                            {`\n\n`}
                            <span>@layer utilities</span> {'{'}
                            {`\n`}
                            {'  '}.demo {'{'} color: #7357ff <b>!important</b>; {'}'}
                            {`\n`}
                            {'}'}
                        </pre>
                    </div>
                    <div className={styles.importantResult}>
                        {!showImportantResult ? (
                            <button type="button" onClick={() => setShowImportantResult(true)}>
                                猜猜文字是什么颜色
                            </button>
                        ) : (
                            <>
                                <strong className={`${styles.resetImportantRule} ${styles.utilityImportantRule}`}>
                                    reset 的红色获胜
                                </strong>
                                <p>普通声明：后面的层赢。!important 声明：前面的层赢。</p>
                                <button type="button" onClick={() => setShowImportantResult(false)}>
                                    重新猜
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </section>

            <section className={styles.summarySection}>
                <p>一句话带走</p>
                <h2>
                    <code>@layer</code> 管的是“哪一组规则先赢”，
                    <br />
                    不是“元素显示在哪一层”。
                </h2>
                <div className={styles.summaryLinks}>
                    <a href="#layer-order">再看一次顺序 ↑</a>
                    <Link to="/vertical-align">← 返回第一课</Link>
                </div>
            </section>
        </main>
    );
};

export default CascadeLayersLab;
