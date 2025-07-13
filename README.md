
### セットアップ

```bash
# init
npm init -y

# 実行時依存
npm install axios dotenv @modelcontextprotocol/sdk-typescript

# 開発時依存
npm install --save-dev typescript ts-node @types/node
```
* axios: Qiita API呼び出し
* dotenv: .envからトークン読み込み
* @modelcontextprotocol/sdk-typescript：MCP サーバー実装用 SDK
* typescript/ts-node/@types/node：TypeScript 実行環境



### TypeScript 設定

```bash
npx tsc --init --rootDir src --outDir dist --esModuleInterop true --resolveJsonModule true
```


### 認証設定
```bash
nano src/config/credentials.ts
```

```typescript
import dotenv from 'dotenv';
dotenv.config();

export default {
  qiita: {
    accessToken: process.env.QIITA_TOKEN || '',
  },
};
```

### 型定義
```bash
nano src/types/index.ts
```


### build
```typescript
npx tsc
```

### local test
```bash
node dist/server.js
```