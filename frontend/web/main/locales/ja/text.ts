import DefaultText from "../default/text";

export default class Text extends DefaultText {
  get locale() {
    return "ja";
  }
  get title() {
    return `DanMage: YouTube や Twitch などでコメントを流す`;
  }
  get intro() {
    return `DanMageは、コメントをニコニコ動画っぽく流するchromeとfirefox拡張機能です。現在、Twitch、YouTube、Crunchyrollをサポートしています。 chrome用：`;
  }
  get intro2() {
    return `firefox用：`;
  }
  get intro3() {
    return `この拡張機能はここでオープンソース化されています：`;
  }
  get introTwitch() {
    return `Twitchでは、ライブストリーミングとレコーディングの両方で機能します。 Twitchのチャットルーム周辺でカスタマイズ可能な設定を見つけてください。 チャットルームを表示したままにしておく必要があります。そうしないと、Twitchのチャットサーバーから切断されます。`;
  }
  get introYouTube() {
    return  `YouTubeでは、ライブストリーミング、ライブレコーディング、プレミア、および通常の動画で機能します。`;
  }
  get introYouTube2() {
    return `ライブストリーミング、ライブレコーディング、プレミアの場合は、YouTubeチャットを表示する必要があります。 YouTubeのチャットルーム周辺でカスタマイズ可能な設定を見つけることができます。`;
  }
  get introYouTube3() {
    return `この拡張機能の人気が十分に得られていないため、残念ながら、通常の動画ではコメントが見つからない可能性があります　¯\\ _（ツ）_ /¯ 動画の進行状況バーの周辺でカスタマイズ可能な設定を見つけることができます。同じ場所でログインした後、コメントの投稿する事ができます。 コメントはこのサイトに保存されます。`;
  }
  get introCrunchyroll() {
    return `この拡張機能はCrunchyrollをサポートしていますが、残念ながら、この拡張機能の人気が十分に得られていないため、コメントが見つからない可能性があります　¯\\ _（ツ）_ /¯ 動画の進行状況バーの周辺でカスタマイズ可能な設定を見つけることができます。同じ場所でログインした後、コメントの投稿する事ができます。 コメントはこのサイトに保存されます。`;
  }
  get directFeedbackSuggestion() {
    return `contact@danmage.comに直接フィードバックを送信するか、以下のフォームに記入して送信してくださ。`;
  }
  get submitFeedbackButton() {
    return `送信`;
  }
  get feedbackInputLabel() {
    return `説明`;
  }
  get emailInputLabel() {
    return `Eメール`;
  }
  get emailInputPlaceholder() {
    return `さらに返信を受け取りたい場合は、メールを残すことをおすすめです。`;
  }
  get showMoreChatsButton() {
    return `もっと見せる`;
  }
  get chatVideoSiteLabel() {
    return `動画サイト`;
  }
  get chatVideoIdLabel() {
    return `動画ID`;
  }
  get chatTimestampLabel() {
    return `タイムスタンプ`;
  }
  get chatContentLabel() {
    return `コンテンツ`;
  }
  get chatPostedDateLabel() {
    return `投稿日`;
  }
  get setNicknameButton() {
    return `セットする`;
  }
  get nicknameInputLabel() {
    return `ニックネーム`;
  }
  get nicknameTab() {
    return `ニックネーム`;
  }
  get historyTab() {
    return `投稿履歴`;
  }
  get signOutButton() {
    return `ログアウト`;
  }
  get termsTab() {
    return `規約と条件`;
  }
  get privacyTab() {
    return `プライバシー`;
  }
  get feedbackTab() {
    return `フィードバック`;
  }
  get signInButton() {
    return `Googleでログイン`;
  }
}
