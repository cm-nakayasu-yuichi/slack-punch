# はじめに ⚡️ Bolt for JavaScript
> 📚 [Bolt for JavaScript チュートリアルで始める][1] からのSlackアプリの例

## 概要

これは [Bolt for JavaScript フレームワーク][2] を使って構築されたSlackアプリで、
イベントやインタラクティブボタンに応答するデモを示しています。

## ローカルでの実行

### 0. 新しいSlackアプリを作成する

- https://api.slack.com/apps にアクセス
- **Create App** をクリック
- ワークスペースを選択
- `manifest.yaml` の内容を使用してApp Manifestを入力
- **Create** をクリック

アプリが作成されたら **Install to Workspace** をクリック
次に Basic Info でスクロールダウンし、両方のスコープで **Generate Token and Scopes** をクリック

### 1. 環境変数を設定する

```zsh
# あなたのボットとアプリのトークンに置き換えてください
export SLACK_BOT_TOKEN=<your-bot-token> # OAuthセクションから
export SLACK_APP_TOKEN=<your-app-level-token> # Basic InfoのApp Tokenセクションから
```

### 2. ローカルプロジェクトを設定する

```zsh
# このプロジェクトをあなたのマシンにクローン
git clone https://github.com/slackapi/bolt-js-getting-started-app.git

# プロジェクトディレクトリに移動
cd bolt-js-getting-started-app/

# 依存関係をインストール
npm install
```

### 3. サーバーを起動する
```zsh
npm run start
```

### 4. テスト

インストールされたワークスペースに移動し、新しいボットにDMで **Hello** と入力してください。ボットが存在するチャンネルでも **Hello** と入力できます。

## コントリビューティング

### 問題および質問

このプロジェクトに関するバグを見つけましたか？質問がありますか？ぜひお聞かせください！

1. [slackapi/bolt-js/issues][4] にアクセス
1. 新しい問題を作成
1. `[x] examples` カテゴリを選択

そこでお会いしましょう。そして、Boltをみんなのために改善するお手伝いをありがとうございます！

[1]: https://slack.dev/bolt-js/tutorial/getting-started
[2]: https://slack.dev/bolt-js/
[3]: https://slack.dev/bolt-js/tutorial/getting-started#setting-up-events
[4]: https://github.com/slackapi/bolt-js/issues/new