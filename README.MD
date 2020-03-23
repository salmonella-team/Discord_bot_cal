## discord-bot-cal

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

### ホワイトリスト
存在しないコマンドを打つとキャルが叱ってくれますが、他人の作ったコマンドも巻き込んでしまうのでホワイトリストを作りました。  
[discord-bot-cal](https://docs.google.com/spreadsheets/d/1IbkSu3kGxhxy9_rI8p_stEWvqSDAYnEUcVUA02TaPfk/edit?usp=sharing)ここの`A列`にコマンドを追加してください。  

### npm

- install  
`npm i`

- build  
`npm run build`

- start  
`npm start`
