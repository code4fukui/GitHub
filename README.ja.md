# GitHub

GitHub APIとやり取りするためのJavaScriptライブラリです。

## 機能
- ユーザー情報の取得
- ユーザー、Organization、またはすべてのリポジトリの取得
- リポジトリ内のファイル一覧の取得
- リポジトリ内のファイルのダウンロードおよびアップロード

## 要件
[Base64.js](https://code4fukui.github.io/Base64/Base64.js) ライブラリが必要です。

## 使い方
`GitHub` クラスをインポートし、GitHubアクセストークンを使用してインスタンスを作成します。

```javascript
import { GitHub } from "https://code4fukui.github.io/GitHub/GitHub.js";

const gh = new GitHub("your_access_token");
```

その後、以下のようにさまざまなメソッドを使用してGitHub APIとやり取りできます。

```javascript
const user = await gh.getUser("octocat");
console.log(user);

const repos = await gh.getReposByMe();
console.log(repos);

const file = await gh.pull("octocat/Spoon-Knife", "master", "README.md");
console.log(file.text());
```

## ライセンス
MIT License — 詳細は [LICENSE](LICENSE) を参照してください。
