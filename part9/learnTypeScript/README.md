# TypeScript 学习环境

这是一个完整的TypeScript开发环境，包含了学习TypeScript所需的所有配置。

## 安装的依赖

- `typescript`: TypeScript编译器
- `ts-node`: 直接运行TypeScript文件，无需编译
- `@types/node`: Node.js的类型定义

## 可用命令

```bash
# 直接运行TypeScript文件
npm run start

# 开发模式（监听文件变化）
npm run dev

# 编译TypeScript到JavaScript
npm run build
```

## 项目结构

- `index.ts`: 主要的TypeScript示例文件
- `tsconfig.json`: TypeScript编译配置
- `package.json`: 项目依赖和脚本
- `.gitignore`: Git忽略文件配置

## TypeScript 配置说明

`tsconfig.json` 包含了严格的类型检查设置：

- **严格模式**: 启用了所有严格类型检查选项
- **目标版本**: ES2022
- **模块系统**: CommonJS
- **输出目录**: `./build`
- **源码映射**: 启用，便于调试

## 开始学习

1. 编辑 `index.ts` 文件
2. 运行 `npm run start` 查看结果
3. 或使用 `npm run dev` 进入监听模式，文件保存时自动重新运行

## TypeScript 核心概念示例

`index.ts` 文件包含了以下TypeScript概念的示例：

- 基本类型（string, number, boolean）
- 数组类型
- 接口（Interface）
- 类（Class）
- 函数类型
- 联合类型（Union Types）
- 泛型（Generics）

祝您学习愉快！
