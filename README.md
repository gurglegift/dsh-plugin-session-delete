# dsh-plugin-session-delete

你是否困扰于 web 端无法删除对话？是否觉得归档对话键只是隐藏对话，删除得不够彻底？是否在尝试编辑 harness 时遇到对话历史无法同步，而损坏的对话又无法删除？这个插件可以帮你！

**在 DeepSeek Harness 界面里安全地彻底删除会话。** 在会话顶部添加垃圾桶按钮，侧栏会话行 "..." 菜单内添加"删除会话"项，点击后出现风险确认弹窗（需勾选）；确认后会删除会话日志、投影缓存与工作区记账（含归档与置顶集）；运行中的会话会有提示，若仍选择删除会停止运行并删除。可在 web 与桌面客户端中使用。
**添加 agent 工具让 agent 可以删除会话。** 工具名 `workbench_session_delete`。

## 安装

### 本地路径安装

```sh
dsh plugin --profile <profile> add file:C:/path/to/dsh-plugin-session-delete
```

例如桌面客户端：
```sh
dsh plugin --profile desktop add file:C:/Users/dvo/Desktop/Gemini-playground/dsh插件/dsh-plugin-session-delete
```

### GitHub 直装

```sh
dsh plugin --profile <profile> add github:gurglegift/dsh-plugin-session-delete
```

重启对应 profile 或重新打开 DeepSeek Harness 即可生效。

## 功能

- **会话头部垃圾桶按钮**：在顶栏右侧快捷触发删除当前打开的会话。
- **侧栏会话行 "..." 菜单注入**：直接在侧栏菜单点击「删除会话」，无需先切换进会话。
- **`RiskConfirmation` 风险确认**：勾选「我已了解后果」后确认可用，防止误触。
- **完整删除链路**：会话磁盘日志 + 投影缓存 (`session_projcache`) + 工作区记账 (`workspace.json` 中的 `sessionIds`、`archivedSessionIds` 与 `pinnedSessionIds`)。
- **运行保护与停止**：运行中的会话弹窗警示，确认后先取消并终止任务，再行删除。
- **`workbench_session_delete` 工具**：Agent 可直接通过工具调用安全删除指定会话。

## 更新日志

- **v0.4.0（现代 DSH 适配）**：
  - **适配现代 DeepSeek Harness (v0.2.0-rc.2+) 插件规范**：移除已废弃的客户端 `@deepseek-ai/dsh-client-runtime` 注入，解决插件加载阻塞问题。
  - **UI 图标动态探测与安全回退**：适配 `@deepseek-ai/dsh-client-ui-primitives` 图标重构，优先解析 `IconTrashOutlineRegular` / `IconTrashOutlineMedium` / `IconTrashOutline`，并内置 16px SVG 图标回退，彻底解决原 `IconTrashOutline16` 未导出引起的白屏。
  - **置顶会话清理**：在存储层增加对 `workspace.json` 中 `pinnedSessionIds`（置顶会话）的同步清理，避免残留孤儿条目。
  - **会话上下文获取容错**：优化顶栏按钮对 `sessionId` 的探测，支持从活动 session store 动态回退。
  - **包名与标识符标准化**：统一使用 `dsh-plugin-session-delete`，提升在各 profile 和 npm/pnpm 下的兼容性。
  - **新增冒烟测试**：添加 `test/smoke.mjs`，开箱即检。
- **v0.3.1（2026-08-14）**：修复删除会话后残留日志导致会话跑到「未分组」的问题。删除时同时清理原始 id 与 `session-` 前缀两种 id 形式；先删除磁盘日志并确认成功后再解除工作区记账，避免半删除会话脱离原分组；删除前先 flush 活动会话，防止 dispose 阶段回写/重建日志目录。
- **v0.3.0（2026-08-14）**：新增英文适配（i18n）。删除对话框、头部垃圾桶按钮与侧栏「删除会话」菜单项的全部文案接入客户端 zh/en 字典，跟随界面语言（设置中的语言或浏览器语言）自动切换并即时生效；未加载 locale 服务的环境会按浏览器语言回退到内置中英文字典。

---

# dsh-plugin-session-delete

Safely and thoroughly delete sessions from the DeepSeek Harness UI and via Agent tools.

## Installation

```sh
dsh plugin --profile <profile> add file:C:/path/to/dsh-plugin-session-delete
# or directly from GitHub:
dsh plugin --profile <profile> add github:gurglegift/dsh-plugin-session-delete
```

## Features

- Trash button at the top of the conversation header
- "Delete session" item injected into the sidebar session-row "..." menu
- Risk-consent confirmation dialog (checkbox required)
- Complete delete chain: on-disk session logs + projection cache + workspace accounting (`sessionIds`, `archivedSessionIds`, and `pinnedSessionIds`)
- Running agent protection: safely cancels live agent before deletion
- Agent tool: `workbench_session_delete`

## License

MIT
