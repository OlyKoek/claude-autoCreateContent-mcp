# GitHub Packages × uvx：Private配布設定ガイド

## 🎯 概要
GitHub PackagesとuvxでPrivate MCPサーバーを無料配布する完全ガイドです。

## 📦 1. package.json設定

既に設定済み：
```json
{
  "name": "@olykoek/qiita-mcp-server",
  "version": "0.1.0",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

## 🔐 2. GitHub Personal Access Token作成

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 「Generate new token (classic)」をクリック
3. 必要な権限：
   - `read:packages` - パッケージ読み取り
   - `write:packages` - パッケージ書き込み
   - `delete:packages` - パッケージ削除（オプション）
   - `repo` - プライベートリポジトリアクセス（Privateリポジトリの場合）

## 📝 3. .npmrc設定

### 開発者側（パッケージ公開用）
`.npmrc`ファイルを作成：
```
//npm.pkg.github.com/:_authToken=ghp_XXXXXXXXXXXXXXX
@olykoek:registry=https://npm.pkg.github.com
```

### 利用者側（パッケージ使用用）
同様の`.npmrc`ファイルが必要：
```
//npm.pkg.github.com/:_authToken=ghp_XXXXXXXXXXXXXXX
@olykoek:registry=https://npm.pkg.github.com
```

## 🚀 4. パッケージ公開手順

```bash
# 1. ビルド
npm run build

# 2. ログイン確認
npm whoami --registry=https://npm.pkg.github.com

# 3. 公開
npm publish
```

## 💻 5. Claude Desktop設定例

### uvx使用（推奨）
```json
{
  "mcpServers": {
    "qiita-mcp-server": {
      "command": "uvx",
      "args": ["@olykoek/qiita-mcp-server@0.1.0"],
      "env": {
        "QIITA_ACCESS_TOKEN": "your_qiita_access_token_here"
      }
    }
  }
}
```

### npx使用（代替案）
```json
{
  "mcpServers": {
    "qiita-mcp-server": {
      "command": "npx",
      "args": ["@olykoek/qiita-mcp-server@0.1.0"],
      "env": {
        "QIITA_ACCESS_TOKEN": "your_qiita_access_token_here"
      }
    }
  }
}
```

## 🔄 6. 他のPCでの利用手順

### 前提条件
1. `.npmrc`ファイルを設定（GitHub tokenを含む）
2. `uvx`または`npx`がインストール済み

### 実行方法
```bash
# uvxで直接実行
uvx @olykoek/qiita-mcp-server@0.1.0

# または特定バージョン指定
uvx @olykoek/qiita-mcp-server@latest
```

## 🏢 7. 社内配布の際の注意点

### セキュリティ考慮事項
- GitHub Personal Access Tokenは各開発者が個別に作成
- `.npmrc`ファイルは`.gitignore`に追加（既に設定済み）
- 最小権限の原則でtoken権限を設定

### 配布方法
1. **推奨**：各開発者がPersonal Access Tokenを個別作成
2. **代替**：Service Account用のtokenを作成して共有

### 社内セットアップ手順書
```markdown
## 新規開発者のセットアップ
1. GitHub Personal Access Token作成
2. `.npmrc`ファイルに認証情報追加
3. Claude Desktopの設定ファイル更新
4. 動作確認
```

## 🔧 8. トラブルシューティング

### 認証エラー
```bash
npm login --registry=https://npm.pkg.github.com
```

### パッケージが見つからない
- `.npmrc`の設定確認
- GitHub tokenの権限確認
- パッケージ名の確認（@username/package-name）

### バージョン管理
```bash
# バージョンアップ
npm version patch  # 0.1.0 → 0.1.1
npm version minor  # 0.1.0 → 0.2.0
npm version major  # 0.1.0 → 1.0.0

# 公開
npm publish
```

## 📊 9. 利点

### ✅ GitHub Packages
- Private配布が無料
- GitHubアカウントで認証
- バージョン管理が簡単
- 依存関係の透明性

### ✅ uvx
- 依存関係の隔離
- バージョン固定
- 環境汚染なし
- 高速実行

## 🎯 10. 次のステップ

### 自動化
- GitHub Actions でCI/CD設定
- 自動テスト＆公開
- セマンティックバージョニング

### モニタリング
- パッケージダウンロード数確認
- 利用状況の把握
- エラーレポート収集