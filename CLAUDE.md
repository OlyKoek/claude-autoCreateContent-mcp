# プロジェクト概要

このリポジトリは「Webアプリ開発」と「調査検討レポート作成」の両方を支援するマルチエージェントテンプレートです。

- **応答言語**：日本語（ユーザーへの回答は必ず日本語で行う）
- **検索・調査**：英語（外部情報収集や検討は英語で実施）

## マルチエージェント環境

### 階層構造とエージェント一覧
```
orchestrator (統括管理・最高優先度)
├── planner (タスク分解)
├── architect (設計)
├── reviewer (相互レビュー)
├── validator (品質検証)
├── naming-checker (命名規則)
├── security-auditor (セキュリティ)
├── performance-analyzer (パフォーマンス)
├── frontend-dev (フロントエンド実装)
├── backend-dev (バックエンド実装)
├── mcp-dev (MCP開発)
├── bot-dev (Discord/Slack/Telegram bot)
├── data-science (機械学習・データ分析)
├── qa (テスト)
├── devops (インフラ)
├── doc-writer (ドキュメント)
├── qiita-writer (技術記事)
└── search-enhancer (情報検索)
```

### 専門開発領域の使用例
```bash
# MCP開発
@orchestrator と @mcp-dev と @reviewer を並列で起動し、
FastMCPを使用したファイルシステムMCPサーバーを開発してください

# Discord Bot開発
@bot-dev と @security-auditor と @qa を並列で起動し、
Discord.jsを使用した管理botを開発してください

# 機械学習プロジェクト
@data-science と @performance-analyzer と @validator を並列で起動し、
Scikit-learnを使用した売上予測モデルを開発してください
```

### ベストプラクティス
1. **並列実行の活用**: `@orchestrator` 経由で複数エージェントを同時実行
2. **コンテキスト分離**: 各エージェントは独立したコンテキストで動作
3. **品質保証**: 多段階チェック（自己→相互→合意形成）
4. **標準化**: 統一された出力フォーマットでスコア付き評価

### 実行例
```bash
# 設計フェーズの並列実行
@orchestrator と @planner と @architect を並列で起動し、
独立したコンテキストで要件分析と設計を実行してください

# 品質チェックの並列実行
@reviewer と @validator と @security-auditor を並列で起動し、
コード品質とセキュリティを総合評価してください
```

### セットアップ
```bash
# 自動セットアップ実行
bash scripts/setup-agents.sh

# 品質チェック
bash scripts/quality-check.sh

# 統計レポート生成
bash scripts/generate-report.sh
```

詳細は [`docs/multiagent-setup-guide.md`](docs/multiagent-setup-guide.md) を参照してください。

セッション終了後、要約と改善点を自動生成し、CLAUDE.md を更新してください。