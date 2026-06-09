# 贡献指南

感谢你改进 Test Lane Finder。

## 本地开发

```bash
npm install
npm run check
```

## 开发原则

- 保持路线规划确定性。
- planner 不直接运行测试。
- 修改技术栈检测或路线规则时，请补测试。
- 优先使用项目已有 scripts，而不是凭空发明命令。

## Pull Request

请说明：

- 修改的技术栈或路线规则
- 示例文件列表和改动文件列表
- `npm run check` 的验证结果
