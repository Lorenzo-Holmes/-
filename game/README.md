# 冰箱清空计划 — 比赛版候选试玩

## 线上与本地入口

兼容入口 `play.html` 通过 iframe 加载 `index.html`，不依赖 iframe 点击补丁。

正式 Worker：`https://worker.1106314996.workers.dev/`。

**线上：`/`、`/index.html`、`/play.html`。** 仓库 `game/` 目录已被部署到公网根目录。2026-09-06 实测，旧 `/game/index.html` 和 `/game/play.html` 返回 404；根目录对应运行文件与候选内容一致。文档修正不代表已为旧链接部署兼容跳转。

从仓库根目录本地运行：

```bash
python3 -m http.server 8080
```

**本地：** `http://localhost:8080/game/play.html` 或 `http://localhost:8080/game/index.html`。本地仓库路径与公网路径不同，本地运行不是正式部署验收。

## 运行组成

- `app.js`：数据、规则、核心交互。
- `enhancements.js`：奖励、菜单、结算和首次推进门槛。
- `day3-8-food-assets.js`：后续关卡视觉扩展。
- `formal-assets.js`：正式食材 / 菜品视觉。
- `dish-render-hotfix.js`：菜品部署兼容处理。
- `styles.css`、`enhancements.css`：场景、移动适配与奖励样式。

实际加载顺序以 `index.html` 为准，不能按旧文档删掉后续脚本。`asset-coverage-check.js` 是检查脚本，不是玩家入口。

## 内容与视觉边界

已实现八关、二十五种食材、二十道菜，以及预扣 / 撤回、点击 / 拖拽、配方匹配、开火反馈、机会成本、结算和进度保存。首次推进至少做成一道菜，不要求三星；没有现实倒计时。

DAY 1 正式七种食材与 B03 四道菜已经接入，素材来源见 `../docs/12_DAY1_ASSET_MAPPING.md`。仓库也已有 DAY 2 图集与后续视觉扩展；文件存在不能代替全关卡美术验收。

## 状态与验收

唯一当前状态源：`../docs/08_IMPLEMENTATION_STATUS.md`。

Production Smoke 规程：`../docs/14_PRODUCTION_SMOKE_GATE.md`。

投稿文案与待录分镜：`../docs/15_SUBMISSION_PACKAGE.md`。

自动检查：`.github/workflows/static-qa.yml`；线上只读验收：`.github/workflows/production-smoke.yml`，显式使用 `SMOKE_PUBLIC_PREFIX: /`。历史报告不冒充本次运行结果，测试录像不冒充正式宣传片。
