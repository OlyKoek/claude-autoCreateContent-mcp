
### セットアップ

```bash
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