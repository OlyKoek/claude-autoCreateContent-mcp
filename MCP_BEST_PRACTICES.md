# Node.js MCP サーバー ベストプラクティス設定

## 🎯 改善されたプロジェクト構成

### 📦 package.json の最適化
```json
{
  "name": "qiita-mcp-server",
  "version": "0.1.0",
  "main": "dist/server.js",
  "bin": {
    "qiita-mcp": "dist/server.js"
  },
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "dev": "npm run build && node dist/server.js"
  }
}
```

### 🔧 TypeScript設定（ES Modules対応）
- `"module": "ES2022"`
- `"target": "ES2022"`
- `"moduleResolution": "bundler"`
- `"type": "module"` をpackage.jsonに追加

### 📁 プロジェクト構造
```
claude-autoCreateContent-mcp/
├── package.json          # CLI化対応、ES modules設定
├── tsconfig.json         # ES2022、bundler moduleResolution
├── dist/                 # ビルド成果物
│   ├── server.js        # shebangあり、実行可能
│   ├── config/
│   ├── tools/
│   └── types/
└── src/                  # TypeScriptソース
    ├── server.ts        # ES modules import (.js拡張子)
    ├── config/
    ├── tools/
    └── types/
```

## 🚀 起動方法の選択肢

### 1. 相対パス運用（推奨：ローカル開発）
```json
{
  "mcpServers": {
    "qiita-mcp-server": {
      "command": "node",
      "args": ["./dist/server.js"],
      "cwd": "D:\\00_GitWorkspace\\claude-autoCreateContent-mcp",
      "env": {
        "QIITA_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}
```

### 2. NPX実行（パッケージ公開後）
```bash
npx qiita-mcp-server@0.1.0
```

### 3. UVX実行（最新のベストプラクティス）
```json
{
  "mcpServers": {
    "qiita-mcp-server": {
      "command": "uvx",
      "args": ["qiita-mcp@0.1.0"],
      "env": {
        "QIITA_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}
```

## ✅ 改善点

### 🔧 技術面
- ✅ ES Modules対応で最新のJavaScript標準に準拠
- ✅ 相対パス使用で環境依存性を削減
- ✅ CLI化でnpx/uvx実行が可能
- ✅ shebang対応で直接実行可能

### 📋 運用面
- ✅ `npm run build`でビルド
- ✅ `npm run start`で起動確認
- ✅ `npm run dev`で開発時の自動ビルド+起動
- ✅ 環境変数で認証情報を分離

### 🔒 セキュリティ
- ✅ 認証トークンは環境変数で管理
- ✅ `.env`ファイルは`.gitignore`に追加済み

## 🎯 次のステップ（オプション）

### NPMパッケージ公開
```bash
npm publish
```

### GitHub Packages公開
```bash
npm publish --registry=https://npm.pkg.github.com
```

### UVX対応の完全版
公開後は以下の設定で依存関係隔離と環境独立性を実現：
```json
{
  "mcpServers": {
    "qiita-mcp-server": {
      "command": "uvx",
      "args": ["qiita-mcp@latest"],
      "env": {
        "QIITA_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}