import { useEffect, useRef, useState } from 'react'
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Asterisk,
  Brush,
  CircleDot,
  Code2,
  Mail,
  MoveRight,
  Palette,
  Phone,
  Sparkles,
} from 'lucide-react'
import FallingText from './components/FallingText'
import ScrollExpand from './components/ScrollExpand'

const projects = [
  {
    slug: 'sleepy-owl',
    no: '01',
    title: '小眠鸮APP UI设计',
    homeTitle: '小眠鸮',
    en: 'SLEEPY OWL',
    category: 'UI / UX DESIGN',
    categoryZh: '界面与体验',
    year: '2026',
    desc: '从情绪洞察到高保真原型，构建一款兼顾睡眠记录与内容陪伴的健康应用。',
    tags: ['UI / UX', 'IP DESIGN', '2026'],
    image: '/assets/sleepy-owl-home.png',
    detailImage: '/assets/sleepy-owl-showcase.jpg',
    video: null,
    homeVideoBackdrop: false,
    tone: 'lime',
    transitionColor: '#c0dbae',
    brief: '以年轻用户的睡眠焦虑与记录需求为切入点，探索工具体验与情绪陪伴之间的平衡。',
    approach: '围绕信息架构、睡眠数据呈现和角色陪伴机制建立完整体验，并以柔和绿色与“小眠鸮”IP串联界面。',
    deliverables: '用户研究 / 信息架构 / UI系统 / 高保真原型 / IP形象',
    gallery: [
      { src: '/assets/sleepy-owl-showcase.jpg', alt: '小眠鸮APP视觉设计总览' },
      { src: '/assets/sleepy-owl-flow.jpg', alt: '小眠鸮APP界面流程与原型展示' },
    ],
  },
  {
    slug: 'baiming-packaging',
    no: '02',
    title: '百茗品牌包装设计',
    homeTitle: '百茗',
    en: 'BAIMING PACKAGING',
    category: 'PACKAGING DESIGN',
    categoryZh: '品牌包装',
    year: '2026',
    desc: '围绕“百茗”完成品牌标志、辅助图形与礼盒包装系统，以玫红与绿色构建年轻醒目的茶礼视觉。',
    tags: ['PACKAGING', 'BRAND IDENTITY', '2026'],
    image: '/assets/baiming-home.jpg',
    detailImage: '/assets/baiming-packaging.jpg',
    tone: 'magenta',
    transitionColor: '#d26567',
    brief: '为“百茗”建立兼具传统茶文化联想与年轻传播感的品牌包装识别。',
    approach: '提取茶叶、山水与礼盒结构特征，以高饱和玫红和绿色形成撞色系统，并将标志、纹样与包装结构统一延展。',
    deliverables: '品牌标志 / 辅助图形 / 包装结构 / 礼盒设计 / 应用展示',
    gallery: [
      { src: '/assets/baiming-showcase-board.jpg', alt: '百茗品牌包装设计全案展板', board: true },
      { src: '/assets/baiming-packaging.jpg', alt: '百茗品牌包装设计完整展板' },
    ],
  },
  {
    slug: 'xiang-troupe',
    no: '03',
    title: '项家班品牌视觉',
    homeTitle: '项家班',
    en: 'XIANG TROUPE',
    category: 'BRAND IDENTITY',
    categoryZh: '品牌视觉',
    year: '2026',
    desc: '以太湖安吉非遗项家皮影戏为文化母题，完成品牌定位、标志系统与传统光影语言的当代转译。',
    tags: ['BRAND IDENTITY', 'VI SYSTEM', '2026'],
    image: '/assets/xiang-home.jpg',
    detailImage: '/assets/xiangjiaban/xiang-01.jpg',
    tone: 'burgundy',
    transitionColor: '#44322a',
    brief: '从项家班皮影戏的历史、表演方式与造型语言出发，重新梳理非遗品牌的当代表达。',
    approach: '提炼皮影关节、幕布光影和传统纹样形成识别系统，在保留文化质感的同时建立清晰、现代的传播秩序。',
    deliverables: '品牌定位 / 标志系统 / 标准字 / 色彩规范 / 延展应用',
    gallery: [
      { src: '/assets/xiang-vis-board.jpg', alt: '项家班品牌视觉识别系统完整展板', board: true },
      { src: '/assets/xiangjiaban/xiang-01.jpg', alt: '项家班品牌视觉封面' },
      { src: '/assets/xiangjiaban/xiang-02.jpg', alt: '项家班品牌设计页面一' },
      { src: '/assets/xiangjiaban/xiang-03.jpg', alt: '项家班品牌设计页面二' },
      { src: '/assets/xiangjiaban/xiang-05.jpg', alt: '项家班品牌设计页面四' },
      { src: '/assets/xiangjiaban/xiang-07.jpg', alt: '项家班品牌设计页面六' },
      { src: '/assets/xiangjiaban/xiang-08.jpg', alt: '项家班品牌设计页面七' },
    ],
  },
  {
    slug: 'anzhu-book',
    no: '04',
    title: '《安竹纪》书籍设计',
    homeTitle: '安竹纪',
    en: 'ANZHU CHRONICLE',
    category: 'BOOK DESIGN',
    categoryZh: '书籍装帧',
    year: '2026',
    desc: '以竹文化为主题的书籍装帧与阅读视觉设计。',
    tags: ['BOOK DESIGN', 'EDITORIAL', '2026'],
    image: '/assets/anzhu-home.jpg',
    tone: 'forest',
    transitionColor: '#2e4221',
    brief: '围绕竹文化的自然意象与阅读节奏，构建克制、安静的书籍视觉。',
    approach: '运用竹节比例、竖向构图和纸张肌理形成版式语言，让封面与内页保持统一的东方气质。',
    deliverables: '概念设定 / 封面设计 / 内页版式 / 装帧系统',
    gallery: [
      { src: '/assets/anzhu-book-board.jpg', alt: '安竹纪书籍设计内页完整展板', board: true },
      { src: '/assets/anzhu-home.jpg', alt: '安竹纪书籍设计首页展示' },
    ],
  },
  {
    slug: 'ju-xiaopao',
    no: '05',
    title: '橘小泡IP插画设计',
    homeTitle: '橘小泡',
    en: 'JU XIAOPAO',
    category: 'IP ILLUSTRATION',
    categoryZh: 'IP插画',
    year: '2025',
    desc: '以橘子汽水为灵感展开的角色设定与商业插画。',
    tags: ['IP DESIGN', 'ILLUSTRATION', '2025'],
    image: '/assets/juxiaopao-home.jpg',
    tone: 'orange',
    transitionColor: '#e6c56a',
    brief: '从橘子汽水的清爽、活力与气泡感出发，塑造具有亲和力的原创角色。',
    approach: '以橙色、紫色和亮绿色建立高识别配色，并通过夸张动作与场景插画强化角色性格。',
    deliverables: '角色设定 / 主视觉插画 / 动作延展 / IP应用',
    gallery: [
      { src: '/assets/juxiaopao-showcase-board.jpg', alt: '橘小泡IP插画角色设定完整展板', board: true },
      { src: '/assets/juxiaopao-home.jpg', alt: '橘小泡IP插画设计首页展示' },
    ],
  },
]

const featuredProjects = [
  projects[0],
  projects[1],
  projects[4],
  projects[3],
  projects[2],
].map((project, index) => ({
  ...project,
  no: String(index + 1).padStart(2, '0'),
}))

const personalityWords = [
  { zh: '手工重度爱好', en: 'HANDMAKER', style: 'hero-word' },
  { zh: '爱旅行', en: 'WANDERER', style: 'travel-word' },
  { zh: '音乐脑', en: 'MUSIC MIND', style: 'music-word' },
  { zh: '吃货体质', en: 'FOODIE', style: 'food-word' },
  { zh: '游戏玩家', en: 'PLAYER', style: 'game-word' },
  { zh: '好奇心', en: 'CURIOUS', style: 'curious-word' },
  { zh: 'ISFP', en: 'ADVENTURER', style: 'mbti-word' },
]

const sleepyArchitecture = [
  { no: '01', title: '首页', en: 'HOME', text: '推荐内容、呼吸练习、晚安电台与睡前工具，快速进入当晚状态。' },
  { no: '02', title: '社区', en: 'COMMUNITY', text: '精选内容、话题广场与晚安卡片，让经验与情绪被温柔接住。' },
  { no: '03', title: '睡眠', en: 'SLEEP', text: '开始睡眠、记录状态、查看历史数据，并用卡片呈现月度报告。' },
  { no: '04', title: '我的', en: 'PROFILE', text: '集中管理个人资料、睡眠统计、通知、隐私与个性化设置。' },
]

const sleepyScreens = [
  { src: '/assets/sleepy-owl/launch.png', title: '启动页', group: 'BRAND' },
  { src: '/assets/sleepy-owl/onboarding-1.png', title: '引导开场', group: 'ONBOARDING' },
  { src: '/assets/sleepy-owl/onboarding-2.png', title: '睡眠困扰', group: 'ONBOARDING' },
  { src: '/assets/sleepy-owl/onboarding-3.png', title: '期待帮助', group: 'ONBOARDING' },
  { src: '/assets/sleepy-owl/onboarding-4.png', title: '目标选择', group: 'ONBOARDING' },
  { src: '/assets/sleepy-owl/onboarding-5.png', title: '开启管家', group: 'ONBOARDING' },
  { src: '/assets/sleepy-owl/onboarding-6.png', title: '认识小眠鸮', group: 'ONBOARDING' },
  { src: '/assets/sleepy-owl/onboarding-7.png', title: '个性计划', group: 'ONBOARDING' },
  { src: '/assets/sleepy-owl/home-1.png', title: '首页推荐', group: 'HOME' },
  { src: '/assets/sleepy-owl/home-2-1.png', title: '每日推荐', group: 'HOME' },
  { src: '/assets/sleepy-owl/home-2-2.png', title: '心动模式', group: 'HOME' },
  { src: '/assets/sleepy-owl/home-2-3.png', title: '本月新品', group: 'HOME' },
  { src: '/assets/sleepy-owl/home-3-1.png', title: '呼吸吐纳', group: 'CONTENT' },
  { src: '/assets/sleepy-owl/home-3-2.png', title: '睡前故事', group: 'CONTENT' },
  { src: '/assets/sleepy-owl/home-3-3.png', title: '晚安电台', group: 'CONTENT' },
  { src: '/assets/sleepy-owl/home-3-4.png', title: '每日冥想', group: 'CONTENT' },
  { src: '/assets/sleepy-owl/home-3-5.png', title: '番茄闹钟', group: 'CONTENT' },
  { src: '/assets/sleepy-owl/home-3-6.png', title: '助眠好物', group: 'CONTENT' },
  { src: '/assets/sleepy-owl/home-3-7.png', title: '静心入梦', group: 'CONTENT' },
  { src: '/assets/sleepy-owl/home-3-8.png', title: '入眠仪式', group: 'CONTENT' },
  { src: '/assets/sleepy-owl/home-3-9.png', title: '温感夜灯', group: 'CONTENT' },
  { src: '/assets/sleepy-owl/home-3-10.png', title: '伸展解乏', group: 'CONTENT' },
  { src: '/assets/sleepy-owl/community-1.png', title: '社区精选', group: 'COMMUNITY' },
  { src: '/assets/sleepy-owl/community-2.png', title: '社区最新', group: 'COMMUNITY' },
  { src: '/assets/sleepy-owl/player.png', title: '沉浸播放器', group: 'PLAYER' },
  { src: '/assets/sleepy-owl/loading.png', title: '内容加载', group: 'MOTION' },
  { src: '/assets/sleepy-owl/sleep-1.png', title: '开始睡眠', group: 'SLEEP' },
  { src: '/assets/sleepy-owl/sleep-2.png', title: '睡眠月报', group: 'SLEEP' },
  { src: '/assets/sleepy-owl/sleep-2-empty.png', title: '月报空状态', group: 'SLEEP' },
  { src: '/assets/sleepy-owl/profile.png', title: '个人中心', group: 'PROFILE' },
]

const sleepyIpAssets = [
  { src: 'ip-owl-01.png', label: '基础形象', style: 'is-primary' },
  { src: 'ip-owl-02.png', label: '眉羽变化' },
  { src: 'ip-owl-03.png', label: '圆润形态' },
  { src: 'ip-owl-04.png', label: '展开状态' },
  { src: 'ip-night-green.png', label: '晚睡提醒' },
  { src: 'ip-night-purple.png', label: '夜间变体' },
  { src: 'ip-owl-purple.png', label: '夜间配色' },
  { src: 'ip-sleeping.png', label: '入睡状态', style: 'is-sleeping' },
  { src: 'ip-late-reminder.png', label: '提醒弹窗', style: 'is-reminder' },
]

const sleepyPalette = [
  { value: '#e5eed2', tone: 'light' },
  { value: '#c0dbae', tone: 'light' },
  { value: '#74b86a', tone: 'mid' },
  { value: '#4f9146', tone: 'mid' },
  { value: '#226032', tone: 'dark' },
  { value: '#2e4221', tone: 'dark' },
  { value: '#e6c56a', tone: 'warm' },
  { value: '#d26567', tone: 'warm' },
  { value: '#44322a', tone: 'dark' },
]

const strengths = [
  {
    icon: Palette,
    index: '01',
    title: '视觉系统',
    text: '从色彩、字体到版式秩序，建立完整且有识别度的视觉语言。',
    meta: 'VISUAL IDENTITY',
  },
  {
    icon: CircleDot,
    index: '02',
    title: 'UI / UX',
    text: '关注界面的审美与使用感受，让复杂信息拥有清晰、自然的路径。',
    meta: 'DIGITAL EXPERIENCE',
  },
  {
    icon: Brush,
    index: '03',
    title: '插画与 IP',
    text: '用角色、情绪和故事连接品牌，创造更鲜活、更长久的内容资产。',
    meta: 'IP & ILLUSTRATION',
  },
  {
    icon: Code2,
    index: '04',
    title: '设计落地',
    text: '理解数字媒介与开发边界，让概念真正转化为可用的产品体验。',
    meta: 'DESIGN DELIVERY',
  },
]

const designTools = [
  { short: 'PS', name: 'Photoshop', use: '图像处理' },
  { short: 'AI', name: 'Illustrator', use: '品牌与矢量' },
  { short: 'FIG', name: 'Figma', use: 'UI / UX' },
  { short: 'ID', name: 'InDesign', use: '版式编辑' },
  { short: 'AE', name: 'After Effects', use: '动态视觉' },
  { short: 'PR', name: 'Premiere Pro', use: '视频剪辑' },
  { short: 'BL', name: 'Blender', use: '3D 建模渲染' },
  { short: 'PRO', name: 'Procreate', use: '数字插画' },
]

function DoodleStar({ className = '' }) {
  return <span className={`doodle-star ${className}`} aria-hidden="true">✦</span>
}

function PageWipe({ active, color }) {
  const ink = ['#44322a', '#2e4221', '#226032'].includes(color) ? '#e5eed2' : '#2e4221'
  return (
    <div className={`page-wipe ${active ? 'is-active' : ''}`} style={{ '--wipe-color': color, '--wipe-ink': ink }} aria-hidden="true">
      <span>ZHU YI FEI / PORTFOLIO</span>
    </div>
  )
}

function ReadingProgress({ progress, belowHeader = false, scrolled = false }) {
  return (
    <div className={`reading-progress ${belowHeader ? 'below-header' : ''} ${scrolled ? 'is-scrolled' : ''}`} aria-hidden="true">
      <span style={{ transform: `scaleX(${progress})` }} />
    </div>
  )
}

function PersonalityExperiment() {
  return (
    <section className="personality-section" id="personality" aria-labelledby="personality-title">
      <div className="shell">
        <div className="personality-bar" data-reveal>
          <span>04 / PERSONAL LABELS</span>
          <span>INTERESTS · PERSONALITY</span>
        </div>
        <div className="personality-board" data-reveal="media">
          <div className="personality-intro">
            <span>PERSONAL FILE / ZYF</span>
            <h2 id="personality-title">MY<br /><em>VIBE</em></h2>
            <p>一些兴趣，一点性格，<br />拼成真实的我。</p>
          </div>
          <FallingText items={personalityWords} trigger="scroll" gravity={0.68} />
        </div>
      </div>
    </section>
  )
}

function CaseRail({ items, label }) {
  const railRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return undefined

    let frame
    const updateActive = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const center = rail.scrollLeft + rail.clientWidth / 2
        const cards = [...rail.querySelectorAll('.case-rail__card')]
        let nearest = 0
        let distance = Number.POSITIVE_INFINITY
        cards.forEach((card, index) => {
          const cardCenter = card.offsetLeft + card.offsetWidth / 2
          const nextDistance = Math.abs(cardCenter - center)
          if (nextDistance < distance) {
            distance = nextDistance
            nearest = index
          }
        })
        setActiveIndex(nearest)
      })
    }

    const onWheel = (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
      const atStart = rail.scrollLeft <= 2
      const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2
      if ((event.deltaY < 0 && atStart) || (event.deltaY > 0 && atEnd)) return
      event.preventDefault()
      rail.scrollLeft += event.deltaY * 1.15
    }

    rail.addEventListener('scroll', updateActive, { passive: true })
    rail.addEventListener('wheel', onWheel, { passive: false })
    updateActive()
    return () => {
      window.cancelAnimationFrame(frame)
      rail.removeEventListener('scroll', updateActive)
      rail.removeEventListener('wheel', onWheel)
    }
  }, [items])

  const move = (direction) => {
    const rail = railRef.current
    const cards = rail?.querySelectorAll('.case-rail__card')
    const next = Math.max(0, Math.min(items.length - 1, activeIndex + direction))
    cards?.[next]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  return (
    <div className="case-rail-wrap">
      <div
        className={`case-rail ${items.every((item) => item.landscape) ? 'is-landscape-rail' : ''}`}
        ref={railRef}
        aria-label={label}
        tabIndex="0"
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') move(-1)
          if (event.key === 'ArrowRight') move(1)
        }}
      >
        {items.map((item, index) => (
          <figure
            className={`case-rail__card ${item.landscape ? 'is-landscape' : ''} ${index === activeIndex ? 'is-active' : ''}`}
            key={`${item.src}-${index}`}
            aria-current={index === activeIndex ? 'true' : undefined}
          >
            <div className="case-rail__media">
              <img src={item.src} alt={`${item.title}界面展示`} loading={index < 3 ? 'eager' : 'lazy'} />
            </div>
            <figcaption>
              <span>{String(index + 1).padStart(2, '0')} / {item.group}</span>
              <strong>{item.title}</strong>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="case-rail__controls" aria-label="页面切换">
        <span>{String(activeIndex + 1).padStart(2, '0')} — {String(items.length).padStart(2, '0')}</span>
        <div>
          <button type="button" onClick={() => move(-1)} aria-label="上一页"><ArrowLeft size={18} /></button>
          <button type="button" onClick={() => move(1)} aria-label="下一页"><ArrowRight size={18} /></button>
        </div>
      </div>
    </div>
  )
}

function SleepyOwlDetail({ project, nextProject, onBack, onOpenProject }) {
  return (
    <main className="project-detail sleepy-case">
      <header className="detail-header shell">
        <a href="#work" onClick={(event) => onBack(event, 'work')} className="detail-back">
          <ArrowLeft size={18} /> 返回精选项目
        </a>
        <a href="#top" onClick={(event) => onBack(event, 'top')} className="detail-brand">ZHU YI FEI / 2026</a>
      </header>

      <section className="sleepy-case__hero shell" aria-labelledby="sleepy-title">
        <div className="sleepy-case__hero-copy">
          <div className="detail-overline">
            <span>PROJECT / 01</span>
            <span>2026</span>
          </div>
          <span className="sleepy-kicker">SLEEPY OWL · UI / UX</span>
          <h1 id="sleepy-title">小眠鸮<br /><em>APP UI设计</em></h1>
          <p>从情绪洞察到高保真原型，构建一款兼顾睡眠记录与内容陪伴的健康应用。</p>
          <div className="sleepy-case__chips" aria-label="项目范围">
            <span>用户研究</span><span>UI.UX</span><span>IP 设计</span><span>高保真原型</span>
          </div>
        </div>
        <figure className="sleepy-case__hero-media">
          <img src="/assets/sleepy-owl/mockup.jpg" alt="小眠鸮APP多界面手机样机展示" />
          <figcaption><span>Hi！我是小眠鸮</span><strong>愿你一夜好梦</strong></figcaption>
        </figure>
      </section>

      <section className="sleepy-case__statement">
        <div className="shell sleepy-case__statement-grid">
          <div>
            <span className="sleepy-section-no">01 / 设计说明 · DESIGN CONCEPT</span>
            <h2>不是纠正睡眠，<br />而是陪你慢慢入睡。</h2>
          </div>
          <div className="sleepy-case__statement-copy">
            <p>小眠鸮以“温柔陪伴”为核心，把睡眠数据、内容疗愈与睡前工具放进同一条体验路径。用户既能看见自己的睡眠变化，也能在焦虑发生时得到及时、轻柔的回应。</p>
            <div className="sleepy-principles">
              <article><strong>双轨需求</strong><span>数据监测 × 内容陪伴</span></article>
              <article><strong>交互原则</strong><span>接纳优于纠正</span></article>
              <article><strong>视觉情绪</strong><span>浅绿基调 × 黄色点亮</span></article>
            </div>
          </div>
        </div>
      </section>

      <section className="sleepy-case__system shell">
        <div className="sleepy-case__section-head">
          <span className="sleepy-section-no">02 / 图形 IP 与图标设计 · VISUAL SYSTEM</span>
          <p>从陪伴角色到导航图标，建立温柔而清晰的识别系统。</p>
        </div>
        <div className="sleepy-visual-stack">
          <div className="sleepy-brand-row">
            <section className="sleepy-ip-board" aria-labelledby="sleepy-ip-title">
              <div className="sleepy-ip-board__head">
                <span className="sleepy-subsection-label">IP 设计 · CHARACTER SYSTEM</span>
                <div>
                  <h3 id="sleepy-ip-title">一只小眠鸮，<br />多种睡前情绪。</h3>
                  <p>将角色基础、晚睡提醒、夜间变体和入睡状态拆分排列，让形象系统更清晰。</p>
                </div>
              </div>
              <div className="sleepy-ip-grid">
                {sleepyIpAssets.map((item) => (
                  <figure className={item.style ?? ''} key={item.src}>
                    <img src={`/assets/sleepy-owl/${item.src}`} alt={`小眠鸮${item.label}设计`} loading="lazy" />
                    <figcaption>{item.label}</figcaption>
                  </figure>
                ))}
              </div>
            </section>

            <figure className="sleepy-app-mark">
              <span className="sleepy-subsection-label">APP 标志 · APP ICON</span>
              <img src="/assets/sleepy-owl/app-icon.png" alt="小眠鸮APP标志" loading="lazy" />
              <figcaption><strong>第一眼识别</strong><span>提取小眠鸮的大眼睛与头部轮廓，在小尺寸中保持清晰和亲和。</span></figcaption>
            </figure>
          </div>

          <div className="sleepy-system-row">
            <section className="sleepy-color-system" aria-labelledby="sleepy-color-title">
              <div className="sleepy-color-system__head">
                <span className="sleepy-subsection-label">03 / 色彩规范 · COLOR SYSTEM</span>
                <h3 id="sleepy-color-title">色彩规范</h3>
              </div>
              <div className="sleepy-palette" aria-label="小眠鸮品牌色值">
                {sleepyPalette.map((color) => (
                  <div className={`sleepy-swatch is-${color.tone}`} key={color.value}>
                    <span style={{ '--swatch': color.value }} />
                    <strong>{color.value}</strong>
                  </div>
                ))}
              </div>
              <p className="sleepy-color-note">以自然清新的绿色系为核心，从浅绿到深绿建立功能层级；暖黄色、豆沙红与棕色负责提示、奖励和质感点缀，在清爽舒适中保留温度。</p>
            </section>

            <section className="sleepy-nav-design" aria-labelledby="sleepy-nav-title">
              <span className="sleepy-subsection-label">图标 / 导航栏设计</span>
              <h3 id="sleepy-nav-title">选中与默认，<br />一列看清。</h3>
              <p>品牌绿强调当前位置，灰紫线性图标保持轻盈。</p>
              <div className="sleepy-nav-column" aria-label="底部导航状态设计">
                {['nav-1.png', 'nav-2.png', 'nav-3.png', 'nav-4.png'].map((src, index) => (
                  <figure key={src}>
                    <img src={`/assets/sleepy-owl/${src}`} alt={`底部导航第${index + 1}个选中状态`} loading="lazy" />
                    <figcaption>SELECTED / 0{index + 1}</figcaption>
                  </figure>
                ))}
                <figure>
                  <img src="/assets/sleepy-owl/navigation.png" alt="底部导航默认状态" loading="lazy" />
                  <figcaption>DEFAULT / 未选中</figcaption>
                </figure>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="sleepy-case__architecture">
        <div className="shell">
          <div className="sleepy-case__section-head is-light">
            <span className="sleepy-section-no">04 / 产品架构 · PRODUCT ARCHITECTURE</span>
            <p>四个入口，串起睡前到醒后的完整闭环。</p>
          </div>
          <div className="sleepy-architecture-grid">
            {sleepyArchitecture.map((item) => (
              <article key={item.no}>
                <span>{item.no}</span>
                <p>{item.en}</p>
                <h3>{item.title}</h3>
                <small>{item.text}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sleepy-case__journey">
        <div className="shell sleepy-case__journey-intro">
          <span className="sleepy-section-no">05 / 界面展示 · UI SHOWCASE</span>
          <div>
            <h2>从第一次认识小眠鸮，<br />到每晚被它轻轻接住。</h2>
            <p>把鼠标放在界面轨道上滚动，即可左右浏览；当前页面会轻微放大。触屏设备可直接横向滑动。</p>
          </div>
        </div>
        <CaseRail items={sleepyScreens} label="小眠鸮完整界面设计横向浏览" />
      </section>

      <section className="sleepy-case__prototype shell">
        <div className="sleepy-case__section-head">
          <span className="sleepy-section-no">06 / 动态展示 · DESIGN HIGHLIGHTS</span>
          <p>把数据反馈、情绪提醒与交互动效统一为轻柔的睡前节奏。</p>
        </div>
        <div className="sleepy-prototype-grid">
          <div className="sleepy-prototype-copy">
            <span>HIGH-FIDELITY FLOW</span>
            <h2>点击、反馈、切换，<br />都保持轻一点。</h2>
            <p>原型覆盖内容浏览、播放器、睡眠记录与个人中心等核心路径。动效以短距离位移和柔和淡入为主，避免在睡前制造新的兴奋感。</p>
            <div className="sleepy-highlight-list">
              <article><strong>卡片式睡眠报告</strong><span>用表情与颜色快速区分睡眠状态。</span></article>
              <article><strong>晚睡提醒弹窗</strong><span>以小眠鸮情绪反馈替代生硬警告。</span></article>
              <article><strong>沉浸播放器</strong><span>降低界面信息密度，保留必要控制。</span></article>
            </div>
          </div>
          <div className="sleepy-video-frame">
            <div className="sleepy-phone-video">
              <video
                src="/assets/sleepy-owl/prototype-flow.mp4"
                poster="/assets/sleepy-owl/loading.png"
                controls
                playsInline
                preload="metadata"
                aria-label="小眠鸮APP高保真原型交互演示"
              />
            </div>
          </div>
        </div>
      </section>

      <a
        className="detail-next"
        href={`?project=${nextProject.slug}`}
        onClick={(event) => onOpenProject(event, nextProject.slug)}
      >
        <span>NEXT PROJECT / {nextProject.no}</span>
        <strong>{nextProject.title}</strong>
        <ArrowUpRight size={44} strokeWidth={1.2} />
      </a>
    </main>
  )
}

function getProjectSlug() {
  return new URLSearchParams(window.location.search).get('project')
}

function ProjectDetail({ project, onBack, onOpenProject }) {
  const projectIndex = featuredProjects.findIndex((item) => item.slug === project.slug)
  const nextProject = featuredProjects[(projectIndex + 1) % featuredProjects.length]

  if (project.slug === 'sleepy-owl') {
    return <SleepyOwlDetail project={project} nextProject={nextProject} onBack={onBack} onOpenProject={onOpenProject} />
  }

  return (
    <main className={`project-detail ${project.tone}`}>
      <header className="detail-header shell">
        <a href="#work" onClick={(event) => onBack(event, 'work')} className="detail-back">
          <ArrowLeft size={18} /> 返回精选项目
        </a>
        <a href="#top" onClick={(event) => onBack(event, 'top')} className="detail-brand">ZHU YI FEI / 2026</a>
      </header>

      <section className="detail-hero shell">
        <div className="detail-heading">
          <div className="detail-overline">
            <span>PROJECT / {project.no}</span>
            <span>{project.year}</span>
          </div>
          <p>{project.en}</p>
          <h1>{project.title}</h1>
          <p className="detail-lead">{project.desc}</p>
          <div className="detail-tags">
            {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </div>
        <div className="detail-cover">
          <img src={project.detailImage ?? project.image} alt={`${project.title}项目封面`} />
          <span>{project.no}</span>
        </div>
      </section>

      <section className="detail-overview shell">
        <div className="detail-section-label">PROJECT OVERVIEW</div>
        <div className="detail-facts">
          <article>
            <span>01 / 设计背景</span>
            <p>{project.brief}</p>
          </article>
          <article>
            <span>02 / 设计策略</span>
            <p>{project.approach}</p>
          </article>
          <article>
            <span>03 / 设计产出</span>
            <p>{project.deliverables}</p>
          </article>
        </div>
      </section>

      <section className="detail-gallery shell" aria-label={`${project.title}项目图片`}>
        <div className="detail-section-label">SELECTED PAGES</div>
        <div className="detail-gallery-grid">
          {project.video && (
            <figure className="detail-video is-featured" data-reveal="media">
              <div className="detail-video-frame">
                <video
                  src={project.video}
                  poster={project.detailImage ?? project.image}
                  controls
                  playsInline
                  preload="none"
                  aria-label={`${project.title}点击流程演示`}
                />
              </div>
              <figcaption>01 / APP CLICK FLOW</figcaption>
            </figure>
          )}
          {project.gallery.map((image, index) => (
            <figure
              key={image.src}
              className={`${index === 0 ? 'is-featured ' : ''}${image.board ? 'is-board' : ''}`.trim()}
              data-reveal="media"
            >
              <img src={image.src} alt={image.alt} loading={index > 1 ? 'lazy' : 'eager'} />
              <figcaption>
                {String(index + (project.video ? 2 : 1)).padStart(2, '0')} / {project.en}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <a
        className="detail-next"
        href={`?project=${nextProject.slug}`}
        onClick={(event) => onOpenProject(event, nextProject.slug)}
      >
        <span>NEXT PROJECT / {nextProject.no}</span>
        <strong>{nextProject.title}</strong>
        <ArrowUpRight size={44} strokeWidth={1.2} />
      </a>
    </main>
  )
}

function App() {
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeProjectSlug, setActiveProjectSlug] = useState(null)
  const [transitioning, setTransitioning] = useState(false)
  const [transitionColor, setTransitionColor] = useState('#aef5dc')
  const [copyNotice, setCopyNotice] = useState('')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [activeProjectSlug])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting)
      }),
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )
    document.querySelectorAll('[data-reveal]').forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [activeProjectSlug])

  useEffect(() => {
    const onPopState = () => {
      setActiveProjectSlug(getProjectSlug())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    const activeProject = featuredProjects.find((project) => project.slug === activeProjectSlug)
    document.title = activeProject
      ? `${activeProject.title}｜朱一飞作品集`
      : '朱一飞｜视觉设计作品集'
  }, [activeProjectSlug])

  const openProject = (event, slug) => {
    event.preventDefault()
    if (transitioning) return
    const destination = featuredProjects.find((project) => project.slug === slug)
    setTransitionColor(destination?.transitionColor ?? '#c0dbae')
    setTransitioning(true)
    window.setTimeout(() => {
      const url = new URL(window.location.href)
      url.searchParams.set('project', slug)
      url.hash = ''
      window.history.pushState({}, '', url)
      setActiveProjectSlug(slug)
      window.scrollTo({ top: 0 })
    }, 300)
    window.setTimeout(() => setTransitioning(false), 720)
  }

  const closeProject = (event, target = 'work') => {
    event.preventDefault()
    if (transitioning) return
    setTransitionColor('#aef5dc')
    setTransitioning(true)
    window.setTimeout(() => {
      const url = new URL(window.location.href)
      url.searchParams.delete('project')
      url.hash = target
      window.history.pushState({}, '', url)
      setActiveProjectSlug(null)
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          document.querySelector(`#${target}`)?.scrollIntoView({ block: 'start', behavior: 'auto' })
        })
      })
    }, 300)
    window.setTimeout(() => setTransitioning(false), 720)
  }

  const activeProject = featuredProjects.find((project) => project.slug === activeProjectSlug)

  const copyContact = async (value) => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      const field = document.createElement('textarea')
      field.value = value
      field.style.position = 'fixed'
      field.style.opacity = '0'
      document.body.appendChild(field)
      field.select()
      document.execCommand('copy')
      field.remove()
    }
    setCopyNotice('已复制')
    window.setTimeout(() => setCopyNotice(''), 2200)
  }

  if (activeProject) {
    return (
      <>
        <ReadingProgress progress={scrollProgress} />
        <ProjectDetail project={activeProject} onBack={closeProject} onOpenProject={openProject} />
        <PageWipe active={transitioning} color={transitionColor} />
      </>
    )
  }

  return (
    <main>
      <ReadingProgress progress={scrollProgress} belowHeader scrolled={scrolled} />
      <PageWipe active={transitioning} color={transitionColor} />
      <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
        <a className="brand" href="#top" aria-label="返回首页">
          <span>ZYF/2026</span>
        </a>
        <nav aria-label="主导航">
          <a href="#about">关于</a>
          <a href="#work">作品</a>
          <a href="#strengths">能力</a>
        </nav>
        <a className="nav-contact" href="#contact">
          联系我 <ArrowUpRight size={16} />
        </a>
      </header>

      <section className="scroll-opening" id="top" aria-label="滚动开场">
        <ScrollExpand
          mediaType="color"
          alt="灰绿色复古波点与字体构成的梦核开场画面"
          title="ZYF / 2026"
          scrollHint="向下滚动 · SCROLL TO OPEN"
          startWidth={34}
          startHeight={56}
          startRadius={180}
          endRadius={0}
          mediaZoom={1.1}
          scrollDistance={1.12}
          holdDistance={0.22}
          smoothing={0.085}
          overlayScrim={0.1}
        >
          <div className="scroll-opening__content shell">
            <div className="scroll-opening__meta">
              <span>VISUAL DESIGN / 2026</span>
              <span>UI · UX · BRAND · IP</span>
            </div>
            <div className="scroll-opening__title">
              <span>PORT</span><em>FOLIO</em>
              <small>DREAM / SYSTEM / STORY</small>
            </div>
            <div className="scroll-opening__footer">
              <p>ZHU YI FEI</p>
              <a href="#work">VIEW SELECTED WORKS <ArrowDownRight size={20} strokeWidth={1.5} /></a>
            </div>
          </div>
        </ScrollExpand>
      </section>

      <section className="about section shell" id="about">
        <div className="section-label" data-reveal>
          <span>01</span> ABOUT ME <MoveRight size={18} />
        </div>
        <div className="about-layout">
          <div className="portrait-wrap" data-reveal>
            <div className="portrait-card">
              <img className="portrait-main" src="/assets/portrait-zhu-yifei.jpg" alt="视觉设计师朱一飞的个人照片" />
              <span className="portrait-note">HELLO, THIS IS<br />ZHU YIFEI :)</span>
            </div>
            <DoodleStar className="portrait-star" />
            <h2 className="portrait-statement">
              <span>让视觉不只好看，</span>
              <span>也有<strong>性格</strong>与<strong>温度</strong>。</span>
            </h2>
          </div>

          <div className="about-copy" data-reveal>
            <p className="eyebrow">2027 GRADUATE / VISUAL DESIGNER / IP CREATOR</p>
            <h2 className="about-title">
              <span className="about-hi">Hi<i aria-label="，" /></span>
              <span className="about-name"><i>我是</i><strong>朱一飞</strong></span>
            </h2>
            <p className="bio">
              关注品牌视觉、UI、包装与原创 IP，喜欢从真实感受中寻找灵感，再用清晰的系统和有温度的图形，
              把想法变成容易被记住的视觉体验。
            </p>
            <div className="about-meta">
              <div><span>FOCUS</span><b>品牌 / UI / 插画 / IP / 包装</b></div>
              <div><span>EDUCATION</span><b>湖州学院 · 视觉传达设计 · 本科</b></div>
              <div><span>LOCATION</span><b>浙江 杭州 <i className="location-en">HANGZHOU</i></b></div>
              <div><span>STATUS</span><b>开放合作与实习机会</b></div>
            </div>
            <div className="about-contact-mini">
              <a href="tel:13868142319"><span>PHONE</span>138 6814 2319</a>
              <a href="mailto:1131440698@qq.com"><span>EMAIL</span>1131440698@qq.com</a>
              <a className="resume-link" href="/assets/zhu-yifei-resume.pdf" target="_blank" rel="noreferrer">
                <span>查看简历 / VIEW RÉSUMÉ</span><ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>

        <div className="stats" data-reveal>
          <div><strong>05+</strong><span>完整项目<br />SELECTED PROJECTS</span></div>
          <div><strong>A</strong><span>核心能力<br />CORE SKILLS</span></div>
          <div><strong>∞</strong><span>持续探索<br />KEEP CREATING</span></div>
        </div>
      </section>

      <section className="work section" id="work">
        <div className="shell">
          <div className="section-label light" data-reveal>
            <span>02</span> SELECTED WORKS <MoveRight size={18} />
          </div>
          <div className="work-heading" data-reveal>
            <h2>
              <span className="work-title-line"><b>Selected</b><i>精选</i></span>
              <span className="work-title-line"><em>Works</em><i>作品</i></span>
            </h2>
            <p>05 PROJECTS<br />2025—2026</p>
          </div>
          <div className="project-list">
            {featuredProjects.map((project) => (
              <article className={`project-card ${project.tone}`} key={project.title}>
                <a
                  className="project-card-link"
                  href={`?project=${project.slug}`}
                  onClick={(event) => openProject(event, project.slug)}
                  aria-label={`查看${project.title}详情`}
                >
                  <div
                    className={`project-visual ${project.homeVideoBackdrop ? 'has-video-backdrop' : ''}`}
                    data-reveal="media"
                  >
                    <div className="retro-window-bar" aria-hidden="true">
                      <span>PROJECT_{project.no}.HTML</span><span>— □ ×</span>
                    </div>
                    {project.homeVideoBackdrop && (
                      <video
                        className="project-video-backdrop"
                        src={project.video}
                        poster={project.detailImage}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-hidden="true"
                      />
                    )}
                    <img src={project.image} alt={`${project.title}项目展示`} />
                    <span className="project-index">/{project.no}</span>
                    <span className="project-open"><ArrowUpRight size={24} /></span>
                    <div className="project-info" data-reveal="copy">
                      <h3>{project.homeTitle}</h3>
                      <div className="project-card-footer">
                        <span>{project.category}<small>{project.categoryZh}</small></span>
                        <span>{project.year}</span>
                      </div>
                    </div>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="strengths section shell" id="strengths">
        <div className="section-label" data-reveal>
          <span>03</span> WHAT I DO <MoveRight size={18} />
        </div>
        <div className="strengths-heading" data-reveal>
          <h2>我擅长把<br /><em>想法</em>变成视觉。</h2>
          <Sparkles size={54} strokeWidth={1} />
        </div>
        <div className="strength-grid">
          {strengths.map(({ icon: Icon, ...item }) => (
            <article className="strength-card" key={item.title} data-reveal>
              <div className="strength-top">
                <span>{item.index}</span>
                <Icon size={34} strokeWidth={1.4} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <div className="strength-meta">{item.meta} <ArrowUpRight size={15} /></div>
            </article>
          ))}
        </div>
        <div className="toolkit" data-reveal>
          <div className="toolkit-heading">
            <span>DESIGN TOOLKIT</span>
            <p>平面、数字产品、动态视觉与三维表达</p>
          </div>
          <div className="toolkit-grid">
            {designTools.map((tool) => (
              <div className="tool-item" key={tool.name}>
                <span>{tool.short}</span>
                <strong>{tool.name}</strong>
                <small>{tool.use}</small>
              </div>
            ))}
          </div>
          <p className="toolkit-note">同时熟练使用 WPS 与各类 AI 工具，辅助素材生成、创意发散和设计流程提效。</p>
        </div>
      </section>

      <PersonalityExperiment />

      <section className="contact" id="contact">
        <div className="contact-doodles" aria-hidden="true">
          <Asterisk className="contact-asterisk" />
          <span>LET'S MAKE<br />SOMETHING<br />MEMORABLE</span>
        </div>
        <div className="shell contact-inner">
          <p className="contact-kicker" data-reveal>HAVE A PROJECT IN MIND?</p>
          <h2 data-reveal>一起做点<br /><em>有意思</em>的事。</h2>
          <div className="contact-links" data-reveal>
            <button className="mail-link" type="button" onClick={() => copyContact('1131440698@qq.com')}>
              <span><Mail size={24} /> 1131440698@qq.com</span>
              <ArrowUpRight size={44} strokeWidth={1.2} />
            </button>
            <button className="mail-link" type="button" onClick={() => copyContact('13868142319')}>
              <span><Phone size={24} /> 138 6814 2319</span>
              <ArrowUpRight size={44} strokeWidth={1.2} />
            </button>
          </div>
          <div className="contact-footer">
            <span>© 2026 ZHU YIFEI</span>
            <span>VISUAL DESIGN · UI/UX · IP</span>
            <a href="#top">BACK TO TOP ↑</a>
          </div>
        </div>
      </section>
      <div className={`copy-toast ${copyNotice ? 'is-visible' : ''}`} role="status" aria-live="polite">
        {copyNotice}
      </div>
    </main>
  )
}

export default App
