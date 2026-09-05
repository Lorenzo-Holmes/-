# 冰箱清空计划 — 比赛版候选试玩

## 稳定入口

`play.html`

`play.html` 作为兼容入口，通过 iframe 加载 `index.html`；核心事件兼容问题已经在运行代码内正式修复，不再依赖 iframe 点击补丁。

## 本地运行

从仓库根目录启动静态 HTTP server，例如：

```bash
python3 -m http.server 8080
```

然后打开：

```text
http://localhost:8080/game/play.html
```

也可以直接打开：

```text
http://localhost:8080/game/index.html
```

## 当前内容

- 8 个关卡；
- 25 种食材、20 道菜；
- 即期食材 / 时间 / 份数 / 热量四类约束；
- 四格料理区、点击与 Pointer Events 拖拽；
- 菜谱高亮与机会成本反馈；
- 约 800ms 烹饪反馈；
- 三星结算、浪费、营养与冰箱人格；
- 首次推进至少完成 1 道菜，三星不是门槛；
- localStorage 保存教学、最好星级、解锁和 8 / 8 完成态。

## DAY 1 正式视觉

DAY 1 已接入此前验收通过的正式食材和四道菜美术。

运行资产：

- `assets/ingredients/day1/day1_ingredients_atlas.webp`
- `assets/dishes/day1/day1_dishes_atlas.webp`
- `formal-assets.js`

数量、“今天”、预扣、高亮仍是动态 UI 层。

源 PNG 来源、映射和 SHA-256 见 `../docs/12_DAY1_ASSET_MAPPING.md`。

## 验证状态

- 主 QA Chromium Gate：36 / 36。
- 首次推进规则 Gate：20 / 20。
- DAY 1 正式资产 Gate：38 / 38。
- GitHub Actions `static-qa` 持续检查核心脚本和正式图集。

当前仅剩正式部署 URL 的 `index.html / play.html` smoke test；部署验证通过后即可将 PR #1 转为 Ready。
