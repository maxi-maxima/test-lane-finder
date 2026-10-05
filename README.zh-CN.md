<div align="center">

# Test Lane Finder

**为一次代码变更找到最小但有用的验证路线。**

[English](README.md)

</div>

AI 编码 agent 改代码很快。慢的地方常常是决定该验证什么。有些 agent 跑得太少。有些每次都跑完整套件。还有些把某个框架的测试命令写死，换一个仓库就失效。

`test-lane-finder` 会检查仓库结构和改动文件，然后给出确定性的测试路线建议。

不需要 API key。不调用 LLM。它不会替你运行测试。

## 30 秒演示

```bash
npx github:maxi-maxima/test-lane-finder demo
```

演示会写出：

```text
reports/demo/test-lane-finder.json
reports/demo/test-lane-finder.md
```

## 扫描 Git 仓库

```bash
npx github:maxi-maxima/test-lane-finder scan origin/main --out reports/test-lanes
```

`scan` 会读取：

- 仓库里的文件
- `package.json` scripts
- `pyproject.toml` 里的常见 Python 工具线索
- `git diff --name-only <base>...HEAD` 得到的改动文件

## 从指定文件规划

```bash
npx github:maxi-maxima/test-lane-finder from-files src/app.ts tests/app.test.ts
```

## 输出示例

```text
Test Lane Finder LANES
Changed files: 2
Stacks: node, python
Lanes: 5
- npm test -- --run
- npm run lint
- npm run build
- py -3 -m pytest
- py -3 -m ruff check .
```

## 支持的信号

| 技术栈 | 信号 | 示例路线 |
| --- | --- | --- |
| Node | `package.json`、锁文件、JS/TS 文件、scripts | `npm test -- --run`、`npm run lint`、`npm run build` |
| Python | `pyproject.toml`、`requirements.txt`、`.py` 文件 | `py -3 -m pytest`、`py -3 -m ruff check .` |
| Ruby | `Gemfile`、`.rb` 文件 | `bundle exec ruby -Itest` |
| Go | `go.mod`、`.go` 文件 | `go test ./...` |
| Rust | `Cargo.toml`、`.rs` 文件 | `cargo test`、`cargo check` |
| Docs | Markdown/docs 变更 | 渲染后的文档审查 |
| CI | workflow/deploy 路径 | workflow 语法和密钥需求审查 |

## 为什么不直接跑全部？

有时候就应该跑全部。合并前，完整 CI 很重要。但在本地 agent 循环里，一个好的 focused lane 更快，也更可能被反复执行。这个工具给这条路线一个名字和理由。

## 开发

```bash
npm install
npm run check
node dist/cli.js demo --out reports/demo
npm pack --dry-run --ignore-scripts
```

## 许可证

MIT
