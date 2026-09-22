import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const ROOT = "D:/文档文件/ChatGPT/个人网站zyf";
const TEMP_ROOT = "C:/Users/86138/.codex/visualizations/2026/09/03/01a0652b-fdc3-70d1-bc0b-7078053132a5/pptx-build";
const OUT = path.join(TEMP_ROOT, "zyf-portfolio-2026.pptx");
const PREVIEW = path.join(TEMP_ROOT, "rendered");

const W = 1280;
const H = 720;
const C = {
  ink: "#11120F",
  ink2: "#20211C",
  cream: "#EEEADF",
  paper: "#E8E3D5",
  acid: "#CBDD67",
  orange: "#ED8834",
  violet: "#8E7BA8",
  olive: "#73895D",
  wine: "#65101F",
  gray: "#8D8B83",
  white: "#F7F4EC",
};

const assets = {
  portrait: path.join(ROOT, "public/assets/portrait-illustrated-final.png"),
  owlFlow: path.join(ROOT, "public/assets/sleepy-owl-flow.jpg"),
  owlShow: path.join(ROOT, "public/assets/sleepy-owl-showcase.jpg"),
  character: path.join(ROOT, "public/assets/character-views.png"),
  stickers: path.join(ROOT, "public/assets/stickers.png"),
  orangeHero: path.join(ROOT, "public/assets/orange-hero.png"),
  orangeCutout: path.join(ROOT, "public/assets/orange-cutout.png"),
  xiang1: path.join(ROOT, "public/assets/xiangjiaban/xiang-01.jpg"),
  xiang2: path.join(ROOT, "public/assets/xiangjiaban/xiang-02.jpg"),
  xiang3: path.join(ROOT, "public/assets/xiangjiaban/xiang-03.jpg"),
  xiang4: path.join(ROOT, "public/assets/xiangjiaban/xiang-04.jpg"),
  xiang5: path.join(ROOT, "public/assets/xiangjiaban/xiang-05.jpg"),
  xiang6: path.join(ROOT, "public/assets/xiangjiaban/xiang-06.jpg"),
  xiang7: path.join(ROOT, "public/assets/xiangjiaban/xiang-07.jpg"),
  xiang8: path.join(ROOT, "public/assets/xiangjiaban/xiang-08.jpg"),
};

async function bytes(file) {
  const b = await fs.readFile(file);
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
}

async function writeBlob(file, blob) {
  const data = Buffer.from(await blob.arrayBuffer());
  await fs.writeFile(file, data);
}

async function addImage(slide, file, pos, opts = {}) {
  const ext = path.extname(file).toLowerCase();
  const type = ext === ".png" ? "image/png" : "image/jpeg";
  return slide.images.add({
    blob: await bytes(file),
    contentType: type,
    alt: opts.alt || path.basename(file),
    fit: opts.fit || "cover",
    position: pos,
    geometry: opts.geometry || "rect",
    ...(opts.borderRadius ? { borderRadius: opts.borderRadius } : {}),
  });
}

function addText(slide, text, pos, style = {}, name = "text") {
  const s = slide.shapes.add({
    geometry: "textbox",
    name,
    position: pos,
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  s.text = text;
  s.text.style = {
    fontFamily: "Microsoft YaHei",
    fontSize: 24,
    color: C.ink,
    ...style,
  };
  return s;
}

function rect(slide, pos, fill, name = "block", line = "none") {
  return slide.shapes.add({
    geometry: "rect",
    name,
    position: pos,
    fill,
    line: { style: "solid", fill: line, width: line === "none" ? 0 : 1 },
  });
}

function circle(slide, pos, fill, name = "circle") {
  return slide.shapes.add({
    geometry: "ellipse",
    name,
    position: pos,
    fill,
    line: { style: "solid", fill: "none", width: 0 },
  });
}

function footer(slide, n, dark = false) {
  const color = dark ? C.cream : C.ink;
  addText(slide, "ZYF / 2026", { left: 48, top: 678, width: 180, height: 18 }, { fontSize: 11, color, characterSpacing: 2, bold: true }, `footer-${n}`);
  addText(slide, String(n).padStart(2, "0"), { left: 1185, top: 675, width: 48, height: 20 }, { fontSize: 12, color, alignment: "right", bold: true }, `page-${n}`);
}

function label(slide, text, x, y, color = C.gray) {
  return addText(slide, text.toUpperCase(), { left: x, top: y, width: 330, height: 22 }, { fontSize: 12, color, characterSpacing: 2, bold: true }, `label-${text}-${y}`);
}

function rule(slide, x, y, w, color = C.gray, h = 1) {
  return rect(slide, { left: x, top: y, width: w, height: h }, color, `rule-${x}-${y}`);
}

const deck = Presentation.create({ slideSize: { width: W, height: H } });

// 01 — Cover
{
  const s = deck.slides.add();
  s.background.fill = C.ink;
  for (let x = 0; x <= W; x += 96) rect(s, { left: x, top: 0, width: 1, height: H }, "#1B1C18", `grid-v-${x}`);
  for (let y = 0; y <= H; y += 96) rect(s, { left: 0, top: y, width: W, height: 1 }, "#1B1C18", `grid-h-${y}`);
  label(s, "Available for work · 2026", 48, 140, C.acid);
  addText(s, "VISUAL", { left: 44, top: 184, width: 610, height: 122 }, { fontSize: 92, bold: true, color: C.cream }, "cover-visual");
  addText(s, "DESIGNER", { left: 178, top: 284, width: 680, height: 112 }, { fontSize: 80, color: C.cream, bold: false }, "cover-designer");
  addText(s, "朱一飞 ZYF", { left: 49, top: 454, width: 500, height: 60 }, { fontSize: 42, bold: true, color: C.acid }, "cover-name");
  addText(s, "品牌视觉 / UI·UX / 插画 / 原创 IP", { left: 51, top: 528, width: 500, height: 30 }, { fontSize: 18, color: C.cream, characterSpacing: 1 }, "cover-focus");
  await addImage(s, assets.orangeCutout, { left: 760, top: 58, width: 500, height: 650 }, { fit: "contain", alt: "橙子角色插画" });
  circle(s, { left: 1098, top: 117, width: 22, height: 22 }, C.acid, "cover-dot");
  addText(s, "↗", { left: 1125, top: 538, width: 88, height: 80 }, { fontSize: 60, color: C.orange, bold: true }, "cover-arrow");
  footer(s, 1, true);
}

// 02 — Profile
{
  const s = deck.slides.add();
  s.background.fill = C.cream;
  rect(s, { left: 0, top: 0, width: 445, height: H }, C.violet, "profile-color-field");
  circle(s, { left: 58, top: 88, width: 330, height: 330 }, C.acid, "profile-acid-circle");
  await addImage(s, assets.portrait, { left: 5, top: 25, width: 500, height: 650 }, { fit: "contain", alt: "朱一飞 2D 绘本风人物肖像" });
  label(s, "Visual designer / IP creator", 548, 70);
  addText(s, "让视觉不只好看，\n也有性格与温度。", { left: 545, top: 112, width: 650, height: 150 }, { fontSize: 53, bold: true, color: C.ink }, "profile-title");
  addText(s, "我是朱一飞，一名关注品牌视觉、数字产品与原创 IP 的视觉设计师。喜欢从真实感受中寻找灵感，通过清晰的系统与鲜活的图形语言，把抽象概念变成能被记住的体验。", { left: 550, top: 300, width: 615, height: 124 }, { fontSize: 20, color: C.ink2 }, "profile-copy");
  rule(s, 550, 455, 620, "#B9B4A8");
  label(s, "Focus", 550, 478, C.gray);
  addText(s, "品牌 / UI·UX / 插画 / IP", { left: 715, top: 474, width: 420, height: 28 }, { fontSize: 20, bold: true }, "profile-focus");
  label(s, "Location", 550, 530, C.gray);
  addText(s, "浙江 杭州", { left: 715, top: 526, width: 420, height: 28 }, { fontSize: 20, bold: true }, "profile-location");
  label(s, "Contact", 550, 582, C.gray);
  addText(s, "138 6814 2319  ·  1131440698@qq.com", { left: 715, top: 578, width: 480, height: 28 }, { fontSize: 18, bold: true }, "profile-contact");
  footer(s, 2, false);
}

// 03 — Capability
{
  const s = deck.slides.add();
  s.background.fill = C.ink;
  label(s, "What I do", 50, 56, C.acid);
  addText(s, "从一个概念，\n到一套完整体验。", { left: 48, top: 95, width: 620, height: 145 }, { fontSize: 55, bold: true, color: C.cream }, "cap-title");
  const rows = [
    ["01", "品牌视觉", "标志、视觉识别、延展与展示系统"],
    ["02", "UI / UX", "信息架构、高保真界面与交互表达"],
    ["03", "原创 IP", "角色设定、三视图、表情与场景叙事"],
    ["04", "插画表达", "绘本感视觉、色彩氛围与传播画面"],
  ];
  let y = 270;
  for (const [n, title, copy] of rows) {
    rule(s, 50, y, 790, "#40413A");
    addText(s, n, { left: 50, top: y + 18, width: 58, height: 32 }, { fontSize: 20, color: C.acid, bold: true }, `cap-n-${n}`);
    addText(s, title, { left: 135, top: y + 13, width: 230, height: 40 }, { fontSize: 28, color: C.cream, bold: true }, `cap-title-${n}`);
    addText(s, copy, { left: 420, top: y + 20, width: 405, height: 30 }, { fontSize: 16, color: "#BDBAAF" }, `cap-copy-${n}`);
    y += 86;
  }
  rect(s, { left: 890, top: 110, width: 330, height: 470 }, C.paper, "cap-image-field");
  await addImage(s, assets.stickers, { left: 885, top: 100, width: 350, height: 490 }, { fit: "cover", alt: "原创角色表情包" });
  rect(s, { left: 1114, top: 76, width: 86, height: 86 }, C.orange, "cap-orange-block");
  addText(s, "✦", { left: 1133, top: 86, width: 55, height: 55 }, { fontSize: 42, color: C.ink, alignment: "center" }, "cap-star");
  footer(s, 3, true);
}

// 04 — Selected works overview
{
  const s = deck.slides.add();
  s.background.fill = C.paper;
  label(s, "Selected projects", 48, 50);
  addText(s, "作品不是单点，\n而是会生长的视觉系统。", { left: 46, top: 88, width: 680, height: 132 }, { fontSize: 49, bold: true }, "works-title");
  await addImage(s, assets.owlShow, { left: 48, top: 270, width: 360, height: 320 }, { fit: "cover", alt: "小眠鸮 APP 视觉方案" });
  await addImage(s, assets.xiang8, { left: 454, top: 225, width: 360, height: 365 }, { fit: "cover", alt: "项家班皮影戏" });
  await addImage(s, assets.character, { left: 860, top: 178, width: 360, height: 412 }, { fit: "cover", alt: "原创角色三视图" });
  const meta = [
    [48, "01", "小眠鸮 APP", "UI / IP / 2025"],
    [454, "02", "项家班", "BRAND / VI / 2026"],
    [860, "03", "角色视觉系统", "CHARACTER / IP / 2025"],
  ];
  for (const [x, n, title, sub] of meta) {
    addText(s, n, { left: x, top: 607, width: 38, height: 22 }, { fontSize: 13, color: C.orange, bold: true }, `work-no-${n}`);
    addText(s, title, { left: x + 48, top: 600, width: 220, height: 30 }, { fontSize: 21, bold: true }, `work-title-${n}`);
    addText(s, sub, { left: x + 48, top: 634, width: 250, height: 20 }, { fontSize: 11, color: C.gray, characterSpacing: 2 }, `work-sub-${n}`);
  }
  footer(s, 4, false);
}

// 05 — Owl opener
{
  const s = deck.slides.add();
  s.background.fill = C.ink;
  await addImage(s, assets.owlShow, { left: 520, top: 0, width: 760, height: 720 }, { fit: "cover", alt: "小眠鸮 APP 高保真展示" });
  rect(s, { left: 0, top: 0, width: 570, height: 720 }, C.ink, "owl-opener-panel");
  label(s, "Project 01 / UI · IP", 48, 66, C.acid);
  addText(s, "小眠鸮\nAPP", { left: 48, top: 142, width: 430, height: 170 }, { fontSize: 72, bold: true, color: C.cream }, "owl-opener-title");
  addText(s, "用温柔的角色语言，\n陪伴每一次入睡。", { left: 50, top: 356, width: 400, height: 80 }, { fontSize: 26, color: C.acid, bold: true }, "owl-opener-tagline");
  addText(s, "睡眠健康产品 · 高保真原型 · 原创 IP", { left: 50, top: 470, width: 400, height: 30 }, { fontSize: 15, color: "#BDBAAF" }, "owl-opener-meta");
  addText(s, "↘", { left: 402, top: 535, width: 88, height: 72 }, { fontSize: 56, color: C.orange, bold: true }, "owl-opener-arrow");
  footer(s, 5, true);
}

// 06 — Owl system
{
  const s = deck.slides.add();
  s.background.fill = C.cream;
  label(s, "Design system", 50, 52);
  addText(s, "从角色到界面，\n建立一致的陪伴感。", { left: 48, top: 91, width: 540, height: 118 }, { fontSize: 46, bold: true }, "owl-system-title");
  addText(s, "低饱和浅绿、圆润轮廓与轻量信息层级，共同构成安静、可信赖的夜间体验。", { left: 51, top: 240, width: 455, height: 80 }, { fontSize: 18, color: C.ink2 }, "owl-system-copy");
  addText(s, "01 视觉语气", { left: 50, top: 365, width: 170, height: 28 }, { fontSize: 16, bold: true, color: C.orange }, "owl-system-1");
  addText(s, "柔和 · 清新 · 治愈", { left: 235, top: 364, width: 265, height: 28 }, { fontSize: 18, bold: true }, "owl-system-1v");
  rule(s, 50, 406, 455, "#BBB6AA");
  addText(s, "02 核心模块", { left: 50, top: 430, width: 170, height: 28 }, { fontSize: 16, bold: true, color: C.orange }, "owl-system-2");
  addText(s, "睡眠记录 · 社区 · 播放器", { left: 235, top: 429, width: 300, height: 28 }, { fontSize: 18, bold: true }, "owl-system-2v");
  await addImage(s, assets.owlFlow, { left: 570, top: 52, width: 650, height: 610 }, { fit: "cover", alt: "小眠鸮 APP 页面流程" });
  rect(s, { left: 532, top: 510, width: 95, height: 95 }, C.violet, "owl-system-violet");
  addText(s, "✦", { left: 552, top: 524, width: 54, height: 52 }, { fontSize: 42, color: C.cream, alignment: "center" }, "owl-system-star");
  footer(s, 6, false);
}

// 07 — Character system
{
  const s = deck.slides.add();
  s.background.fill = C.ink;
  await addImage(s, assets.character, { left: 42, top: 86, width: 760, height: 545 }, { fit: "cover", alt: "橙子角色三视图" });
  label(s, "Character system", 858, 92, C.acid);
  addText(s, "角色视觉\n系统", { left: 854, top: 132, width: 360, height: 125 }, { fontSize: 52, bold: true, color: C.cream }, "character-title");
  addText(s, "以橙子为记忆点，把明亮、俏皮与行动力转化为完整角色语言。", { left: 858, top: 306, width: 330, height: 86 }, { fontSize: 18, color: "#C9C5B9" }, "character-copy");
  rule(s, 858, 435, 330, "#42433D");
  addText(s, "三视图 / 表情 / 场景 / 延展", { left: 858, top: 462, width: 330, height: 28 }, { fontSize: 16, color: C.orange, bold: true }, "character-meta");
  addText(s, "03", { left: 1110, top: 540, width: 90, height: 72 }, { fontSize: 58, color: C.violet, bold: true, alignment: "right" }, "character-number");
  footer(s, 7, true);
}

// 08 — Xiang opener
{
  const s = deck.slides.add();
  s.background.fill = C.wine;
  await addImage(s, assets.xiang8, { left: 0, top: 0, width: W, height: H }, { fit: "cover", alt: "项家班皮影戏演出场景" });
  rect(s, { left: 0, top: 0, width: 520, height: H }, "#3B0B14", "xiang-overlay");
  label(s, "Project 02 / Brand · VI", 50, 66, "#E3C8B9");
  addText(s, "项家班", { left: 48, top: 150, width: 420, height: 95 }, { fontSize: 72, bold: true, color: C.white }, "xiang-title");
  addText(s, "太湖边的\n光影故事", { left: 51, top: 275, width: 410, height: 112 }, { fontSize: 42, bold: true, color: "#E7C575" }, "xiang-subtitle");
  addText(s, "安吉非遗项家皮影戏品牌视觉方案", { left: 52, top: 435, width: 390, height: 36 }, { fontSize: 18, color: C.white }, "xiang-meta");
  addText(s, "TRADITION × CONTEMPORARY", { left: 52, top: 500, width: 400, height: 24 }, { fontSize: 12, color: "#D3B6A6", characterSpacing: 2 }, "xiang-en");
  footer(s, 8, true);
}

// 09 — Xiang research/process
{
  const s = deck.slides.add();
  s.background.fill = C.paper;
  label(s, "Culture & process", 48, 48, C.wine);
  addText(s, "先理解光影，\n再重构品牌。", { left: 46, top: 87, width: 500, height: 118 }, { fontSize: 48, bold: true, color: C.wine }, "xiang-process-title");
  addText(s, "项目从皮影戏的演出、制作工艺与图形结构出发，提炼圆形印记、人物剪影与暖金光感，让非遗文化在当代语境中更易被识别。", { left: 51, top: 248, width: 430, height: 112 }, { fontSize: 18, color: C.ink2 }, "xiang-process-copy");
  await addImage(s, assets.xiang4, { left: 560, top: 58, width: 660, height: 290 }, { fit: "cover", alt: "项家班皮影戏演出调研" });
  await addImage(s, assets.xiang6, { left: 510, top: 382, width: 710, height: 280 }, { fit: "cover", alt: "项家班皮影制作工艺" });
  rect(s, { left: 445, top: 426, width: 96, height: 96 }, C.wine, "xiang-process-block");
  addText(s, "光\n影", { left: 462, top: 440, width: 62, height: 70 }, { fontSize: 26, color: C.white, bold: true, alignment: "center" }, "xiang-process-glyph");
  footer(s, 9, false);
}

// 10 — Xiang identity system
{
  const s = deck.slides.add();
  s.background.fill = C.wine;
  label(s, "Visual identity system", 48, 48, "#E3C8B9");
  addText(s, "传统的形，\n当代的秩序。", { left: 46, top: 86, width: 430, height: 110 }, { fontSize: 47, bold: true, color: C.white }, "xiang-system-title");
  addText(s, "以深酒红与暖米白为主色，结合印章式符号、粗细对比字体与留白，形成沉静而有文化重量的品牌表达。", { left: 50, top: 232, width: 410, height: 100 }, { fontSize: 18, color: "#E4D4C8" }, "xiang-system-copy");
  await addImage(s, assets.xiang1, { left: 540, top: 50, width: 680, height: 250 }, { fit: "cover", alt: "项家班 VIS 品牌手册封面" });
  await addImage(s, assets.xiang2, { left: 520, top: 333, width: 335, height: 300 }, { fit: "cover", alt: "项家班标志设计" });
  await addImage(s, assets.xiang3, { left: 885, top: 333, width: 335, height: 300 }, { fit: "cover", alt: "项家班品牌叙事页" });
  addText(s, "VIS", { left: 48, top: 438, width: 360, height: 108 }, { fontSize: 88, bold: true, color: "#8E3542" }, "xiang-system-vis");
  addText(s, "XIANG TROUPE", { left: 51, top: 558, width: 380, height: 28 }, { fontSize: 15, bold: true, color: "#E7C575", characterSpacing: 2 }, "xiang-system-en");
  footer(s, 10, true);
}

// 11 — Contact
{
  const s = deck.slides.add();
  s.background.fill = C.acid;
  label(s, "Have a project in mind?", 48, 58, C.ink);
  addText(s, "一起做点\n有意思的事。", { left: 42, top: 118, width: 770, height: 210 }, { fontSize: 82, bold: true, color: C.ink }, "contact-title");
  addText(s, "LET'S MAKE\nSOMETHING\nMEMORABLE", { left: 900, top: 62, width: 320, height: 160 }, { fontSize: 32, bold: true, color: "#97A74D", alignment: "right" }, "contact-english");
  rule(s, 48, 412, 1168, C.ink, 2);
  addText(s, "✉", { left: 48, top: 445, width: 45, height: 45 }, { fontSize: 28, bold: true }, "contact-mail-icon");
  addText(s, "1131440698@qq.com", { left: 108, top: 448, width: 500, height: 40 }, { fontSize: 27, bold: true }, "contact-mail");
  addText(s, "↗", { left: 1145, top: 442, width: 70, height: 58 }, { fontSize: 42, bold: true }, "contact-mail-arrow");
  rule(s, 48, 516, 1168, "#A4B548");
  addText(s, "☎", { left: 48, top: 548, width: 45, height: 45 }, { fontSize: 27, bold: true }, "contact-phone-icon");
  addText(s, "138 6814 2319", { left: 108, top: 551, width: 500, height: 40 }, { fontSize: 27, bold: true }, "contact-phone");
  addText(s, "↗", { left: 1145, top: 545, width: 70, height: 58 }, { fontSize: 42, bold: true }, "contact-phone-arrow");
  addText(s, "© 2026 ZHU YIFEI", { left: 48, top: 663, width: 250, height: 18 }, { fontSize: 11, bold: true, characterSpacing: 1 }, "contact-copy");
  addText(s, "VISUAL DESIGN · UI/UX · IP", { left: 480, top: 663, width: 320, height: 18 }, { fontSize: 11, bold: true, alignment: "center", characterSpacing: 1 }, "contact-services");
  addText(s, "BACK TO TOP ↑", { left: 1030, top: 663, width: 190, height: 18 }, { fontSize: 11, bold: true, alignment: "right", characterSpacing: 1 }, "contact-back");
}

await fs.mkdir(PREVIEW, { recursive: true });
for (const [i, s] of deck.slides.items.entries()) {
  const png = await deck.export({ slide: s, format: "png", scale: 1 });
  await writeBlob(path.join(PREVIEW, `slide-${String(i + 1).padStart(2, "0")}.png`), png);
  const layout = await s.export({ format: "layout" });
  await fs.writeFile(path.join(PREVIEW, `slide-${String(i + 1).padStart(2, "0")}.layout.json`), await layout.text());
}
const montage = await deck.export({ format: "webp", montage: true, scale: 1 });
await writeBlob(path.join(PREVIEW, "portfolio-montage.webp"), montage);
const pptx = await PresentationFile.exportPptx(deck);
await pptx.save(OUT);
console.log(OUT);
