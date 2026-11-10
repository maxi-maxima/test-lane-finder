# 变更记录

## 未发布

- 不再把名称中仅仅含有 `ci` 的普通路径误判为 CI 配置。
- 移除未使用且存在漏洞的 Zod 运行时依赖。

## 0.1.0

- 首个公开版本。
- 检测 Node、Python、Ruby、Go、Rust、docs 和 CI 信号。
- 根据改动文件规划确定性的验证路线。
- 写出 JSON 和 Markdown 报告。
- 提供 `scan`、`from-files` 和 `demo` 命令。
