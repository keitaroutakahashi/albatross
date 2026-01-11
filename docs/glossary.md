# ユビキタス言語定義（Glossary）

## 概要

草野球チーム Albatross（Alba）の管理 Web アプリケーションで使用する用語を定義します。
チーム内およびコード上で統一した用語を使用することで、コミュニケーションの齟齬を防ぎます。

---

## ドメイン用語

### チーム関連

| 用語       | 英語          | 説明                                                           |
| ---------- | ------------- | -------------------------------------------------------------- |
| Albatross  | Albatross     | 草野球チーム名。略称は「Alba」                                 |
| メンバー   | Member        | チームに所属する人。選手・運営・管理者を含む総称               |
| 選手       | Player        | チームに所属し、試合に出場する人                               |
| 運営       | Staff         | 試合スコアやイベントの登録・編集権限を持つメンバー             |
| 管理者     | Admin         | すべての機能にアクセスでき、ユーザー管理も行えるメンバー       |

### 試合関連

| 用語         | 英語          | 説明                                                       |
| ------------ | ------------- | ---------------------------------------------------------- |
| 試合         | Game          | 対戦相手との野球の試合                                     |
| シーズン     | Season        | 1 年間（年度）の活動期間。例: 2024 年度                    |
| リーグ       | League        | 参加している野球リーグ。複数リーグに参加可能               |
| グラウンド   | Ground        | 試合や練習を行う場所                                       |
| 対戦相手     | Opponent Team | 試合で対戦するチーム                                       |
| イニング     | Inning        | 試合の回。通常 5〜9 回で構成                               |
| スコア       | Score         | 試合の得点                                                 |
| 勝敗         | Result        | 試合の結果（勝ち / 負け / 引き分け）                       |
| ホーム       | Home          | 自チームが後攻の試合                                       |
| ビジター     | Visitor       | 自チームが先攻の試合                                       |

### 成績関連

| 用語       | 英語             | 説明                                           |
| ---------- | ---------------- | ---------------------------------------------- |
| 打撃成績   | Batting Stats    | 打者としての成績（打率、打点など）             |
| 投手成績   | Pitching Stats   | 投手としての成績（防御率、勝敗など）           |
| 出場       | Appearance       | 試合に出場すること                             |
| 打順       | Batting Order    | 打席に立つ順番（1〜9 番）                      |
| ポジション | Position         | 守備位置（投手、捕手、内野手、外野手など）     |

#### 打撃成績の項目

| 用語   | 英語              | 略称 | 説明                               |
| ------ | ----------------- | ---- | ---------------------------------- |
| 打席   | Plate Appearances | PA   | バッターボックスに立った回数       |
| 打数   | At Bats           | AB   | 打席から四球・犠打等を除いた回数   |
| 安打   | Hits              | H    | ヒットを打った回数                 |
| 二塁打 | Doubles           | 2B   | 二塁まで到達した安打               |
| 三塁打 | Triples           | 3B   | 三塁まで到達した安打               |
| 本塁打 | Home Runs         | HR   | ホームラン                         |
| 打点   | Runs Batted In    | RBI  | 打撃によって得点させた数           |
| 四球   | Walks             | BB   | フォアボール                       |
| 三振   | Strikeouts        | SO/K | 三振した回数                       |
| 盗塁   | Stolen Bases      | SB   | 盗塁に成功した回数                 |
| 打率   | Batting Average   | AVG  | 安打数 ÷ 打数                      |

#### 投手成績の項目

| 用語     | 英語            | 略称 | 説明                         |
| -------- | --------------- | ---- | ---------------------------- |
| 勝利     | Win             | W    | 勝ち投手                     |
| 敗戦     | Lose            | L    | 負け投手                     |
| セーブ   | Save            | SV   | セーブを記録した試合         |
| 投球回   | Innings Pitched | IP   | 投げたイニング数             |
| 自責点   | Earned Runs     | ER   | 投手の責任による失点         |
| 失点     | Runs            | R    | 投手がいる間に入った全失点   |
| 被安打   | Hits Allowed    | H    | 打たれたヒットの数           |
| 奪三振   | Strikeouts      | K    | 三振を奪った数               |
| 与四球   | Walks           | BB   | 与えたフォアボールの数       |
| 防御率   | Earned Run Avg  | ERA  | 9 イニングあたりの自責点     |

### イベント関連

| 用語     | 英語     | 説明                                               |
| -------- | -------- | -------------------------------------------------- |
| イベント | Event    | チームの活動全般（試合、練習、懇親会など）         |
| 練習     | Practice | 試合以外のトレーニング活動                         |
| 懇親会   | Party    | チームメンバーの親睦を深める集まり                 |
| 合宿     | Camp     | 泊まりがけの練習や親睦活動                         |

### ドキュメント関連

| 用語           | 英語              | 説明                                 |
| -------------- | ----------------- | ------------------------------------ |
| ドキュメント   | Document          | チーム運営に関する各種資料           |
| チーム規約     | Team Rules        | チームのルールやマナーをまとめた文書 |
| 試合関連資料   | Game Documents    | リーグ規定、グラウンド情報など       |
| 会計資料       | Financial Records | 会費、経費精算、予算などの財務資料   |

---

## ビジネス用語

### ユーザー種別と権限

| 用語         | 英語   | 閲覧 | 作成・編集 | ユーザー管理 | 削除 |
| ------------ | ------ | ---- | ---------- | ------------ | ---- |
| 管理者       | ADMIN  | ○    | ○          | ○            | ○    |
| 運営メンバー | STAFF  | ○    | ○          | ×            | ×    |
| 選手         | PLAYER | ○    | ×          | ×            | ×    |

### 機能カテゴリ

| 用語           | 英語                | 説明                                   |
| -------------- | ------------------- | -------------------------------------- |
| 試合スコア管理 | Game Score Mgmt     | 試合結果とスコアの記録・管理           |
| 選手成績管理   | Player Stats Mgmt   | 選手個人の打撃・投手成績の記録・管理   |
| イベント管理   | Event Mgmt          | チーム活動の予定管理                   |
| ドキュメント管理 | Document Mgmt     | チーム資料の一元管理                   |
| マスタ管理     | Master Data Mgmt    | リーグ、グラウンド、対戦相手の管理     |

---

## UI/UX 用語

### 画面名称

| 日本語             | 英語（パス）       | 説明                       |
| ------------------ | ------------------ | -------------------------- |
| ホーム             | /                  | ダッシュボード画面         |
| 試合一覧           | /games             | 試合のリスト表示           |
| 試合詳細           | /games/[id]        | 試合のスコアと詳細情報     |
| 成績一覧           | /stats             | 選手成績のリスト表示       |
| 選手成績詳細       | /stats/[userId]    | 選手個人の詳細成績         |
| ランキング         | /stats/ranking     | チーム内のランキング表示   |
| イベント一覧       | /events            | イベントのリスト表示       |
| イベントカレンダー | /events/calendar   | カレンダー形式でのイベント |
| ドキュメント一覧   | /documents         | ドキュメントのリスト表示   |

### UI コンポーネント

| 用語             | 英語           | 説明                         |
| ---------------- | -------------- | ---------------------------- |
| ヘッダー         | Header         | 画面上部のナビゲーション領域 |
| ハンバーガーメニュー | Hamburger Menu | 三本線アイコンのメニュー |
| カード           | Card           | 情報をまとめて表示する領域   |
| スコアボード     | Score Board    | イニングごとの得点表示       |
| 成績テーブル     | Stats Table    | 成績を表形式で表示           |
| カレンダー       | Calendar       | 日付ベースのイベント表示     |
| モーダル         | Modal          | 画面上に重ねて表示する UI    |
| トースト         | Toast          | 一時的な通知メッセージ       |

### アクション

| 日本語   | 英語   | 説明                   |
| -------- | ------ | ---------------------- |
| 登録     | Create | 新規データの作成       |
| 編集     | Edit   | 既存データの変更       |
| 削除     | Delete | データの削除           |
| 保存     | Save   | 変更内容の保存         |
| キャンセル | Cancel | 操作の取り消し       |
| 検索     | Search | データの検索           |
| フィルタ | Filter | 条件による絞り込み     |

---

## コード上の命名規則

### データベースモデル（Prisma）

| 日本語         | モデル名         | テーブル名        |
| -------------- | ---------------- | ----------------- |
| ユーザー       | User             | user              |
| シーズン       | Season           | season            |
| リーグ         | League           | league            |
| グラウンド     | Ground           | ground            |
| 対戦相手チーム | OpponentTeam     | opponent_team     |
| 試合           | Game             | game              |
| イニングスコア | InningScore      | inning_score      |
| 試合出場       | GameAppearance   | game_appearance   |
| 打撃成績       | BattingStats     | batting_stats     |
| 投手成績       | PitchingStats    | pitching_stats    |
| イベント       | Event            | event             |
| ドキュメント   | Document         | document          |
| カテゴリ       | DocumentCategory | document_category |

### Enum 定義

| Enum 名    | 値                                       | 説明           |
| ---------- | ---------------------------------------- | -------------- |
| UserRole   | ADMIN, STAFF, PLAYER                     | ユーザー役割   |
| GameResult | WIN, LOSE, DRAW, TBD                     | 試合結果       |
| Position   | PITCHER, CATCHER, FIRST_BASE, ...        | 守備ポジション |
| EventType  | GAME, PRACTICE, PARTY, OTHER             | イベント種別   |

### ポジション一覧

| 日本語   | 英語         | Enum 値      | 略称 |
| -------- | ------------ | ------------ | ---- |
| 投手     | Pitcher      | PITCHER      | P    |
| 捕手     | Catcher      | CATCHER      | C    |
| 一塁手   | First Base   | FIRST_BASE   | 1B   |
| 二塁手   | Second Base  | SECOND_BASE  | 2B   |
| 三塁手   | Third Base   | THIRD_BASE   | 3B   |
| 遊撃手   | Shortstop    | SHORTSTOP    | SS   |
| 左翼手   | Left Field   | LEFT_FIELD   | LF   |
| 中堅手   | Center Field | CENTER_FIELD | CF   |
| 右翼手   | Right Field  | RIGHT_FIELD  | RF   |
| 指名打者 | Designated   | DESIGNATED   | DH   |

### Server Actions 命名

| カテゴリ   | 命名パターン             | 例                         |
| ---------- | ------------------------ | -------------------------- |
| 取得（複数） | get{Model}s            | getGames, getUsers         |
| 取得（単一） | get{Model}             | getGame, getUser           |
| 作成       | create{Model}            | createGame, createEvent    |
| 更新       | update{Model}            | updateGame, updateUser     |
| 削除       | delete{Model}            | deleteGame, deleteDocument |
| 認証       | signIn, signOut, signUp  | -                          |

### コンポーネント命名

| カテゴリ   | 命名パターン           | ファイル名例       |
| ---------- | ---------------------- | ------------------ |
| 一覧       | {Model}List            | gameList.tsx       |
| 項目       | {Model}Item / {Model}Card | gameItem.tsx    |
| フォーム   | {Model}Form            | gameForm.tsx       |
| 詳細       | {Model}Detail          | gameDetail.tsx     |
| 入力       | {Model}Input           | scoreInput.tsx     |
| テーブル   | {Model}Table           | statsTable.tsx     |

---

## 更新履歴

| 日付       | 更新内容 | 更新者 |
| ---------- | -------- | ------ |
| 2025-01-11 | 初版作成 | -      |
