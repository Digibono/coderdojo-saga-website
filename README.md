# CoderDojo さが

CoderDojo さが のホームページ（GitHub Pages で公開）。

現在は関係者向けにパスワード保護しています。公開用の `index.html` `about.html` `support.html` は
**ビルドで生成される暗号化ファイル**なので、直接編集しないでください。

## ディレクトリ構成

- `src/*.html` … **編集するのはここ**（平文のページ）
- `style.css` `assets/` … スタイルと画像（`src/` のページから相対パスで参照）
- `scripts/build.js` … `src/` を暗号化して、ルートの `*.html` を生成
- `scripts/dev.js` … ローカル確認用サーバー

## 開発の流れ

1. `main` からブランチを切る（`feature/○○`、`fix/○○` など）
2. `src/` を編集し、ローカルで確認する

   ```bash
   node scripts/dev.js   # http://localhost:8000/ （パスワード不要・平文で表示）
   ```

3. 公開用ファイルを生成する（パスワードはコミットしないこと。チームで共有された値を使う）

   ```bash
   SITE_PASSWORD=＜パスワード＞ node scripts/build.js
   ```

4. `src/` と生成された `*.html` をコミットして push し、Pull Request を作る

> 暗号化は毎回ランダムな値を使うため、ビルドするたびにルートの `*.html` は全体が変わります。
> 複数人が同時に編集するとルートの `*.html` は必ずコンフリクトするので、コンフリクトしたら
> 解消せず `src/` をマージしたうえで再ビルドしてください。

`◯` や `XX` の部分はダミーです。実際の開催情報に書き換えてください。
