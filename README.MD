## discord-bot-cal
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/cbce1fe5cc0140f29be30e8eedc48b92)](https://www.codacy.com/gh/salmonella-team/discord-bot-cal?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=salmonella-team/discord-bot-cal&amp;utm_campaign=Badge_Grade)
[![codebeat badge](https://codebeat.co/badges/6f031607-d740-4e7c-9308-11d6b1531b84)](https://codebeat.co/projects/github-com-salmonella-team-discord-bot-cal-master)

ボイスチャンネルにキャルを呼ぶことができるよ！  

### 使い方

ボイスチャンネルに入ると自動的にキャルも入ってきます。  
キャルがボイスチャンネルに入っている時にコマンドを実行することで、キャルを喋らせることができます。  

#### コマンド
コマンドの一覧は`help`で確認できます。  
`/cal`系統で、キャルに関してのコマンドを実行できます。  
`/yabai`系統で、ボイスチャンネルで喋らせることができます。  

### .env
`.env.sample`を参考に作成してください。  
`CREDS`はGoogleSpreadSheetの`google-generated-creds.json`を改行なしで配置します。  

### ホワイトリスト
存在しないコマンドを打つとキャルが叱ってくれますが、他人の作ったコマンドも巻き込んでしまうのでホワイトリストを作りました。  
`Develop`ロールが付与されているユーザーのみが管理ができます。詳しくは`/cal.help`を参照してください。  
spreadsheet: [discord-bot-cal](https://docs.google.com/spreadsheets/d/1IbkSu3kGxhxy9_rI8p_stEWvqSDAYnEUcVUA02TaPfk/edit?usp=sharing)  

### Link
[discord-bot-cal | Heroku](https://dashboard.heroku.com/apps/discord-bot-cal)  

### npm

- install  
`npm i`

- build  
`npm run build`

- start  
`npm start`
