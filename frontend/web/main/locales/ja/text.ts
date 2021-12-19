import { TextEn } from "../en/text";

export class TextJa extends TextEn {
  public get locale() {
    return "ja";
  }
  public get intro() {
    return `DanMageは、コメントをニコニコ動画っぽく流するChrome拡張機能です。現在、Twitch、YouTube、Crunchyrollをサポートしています。 ここで入手してください：`;
  }
  public get intro2() {
    return `この拡張機能はここでオープンソース化されています：`;
  }
  public get introTwitch() {
    return `Twitchでは、ライブストリーミングとレコーディングの両方で機能します。 Twitchのチャットルーム周辺でカスタマイズ可能な設定を見つけてください。 チャットルームを表示したままにしておく必要があります。そうしないと、Twitchのチャットサーバーから切断されます。`;
  }
  public get introYouTube() {
    return  `YouTubeでは、ライブストリーミング、ライブレコーディング、プレミア、および通常の動画で機能します。`;
  }
  public get introYouTube2() {
    return `ライブストリーミング、ライブレコーディング、プレミアの場合は、YouTubeチャットを表示する必要があります。 YouTubeのチャットルーム周辺でカスタマイズ可能な設定を見つけることができます。`;
  }
  public get introYouTube3() {
    return `この拡張機能の人気が十分に得られていないため、残念ながら、通常の動画ではコメントが見つからない可能性があります　¯\\ _（ツ）_ /¯ 動画の進行状況バーの周辺でカスタマイズ可能な設定を見つけることができます。同じ場所でログインした後、コメントの投稿する事ができます。 コメントはこのサイトに保存されます。`;
  }
  public get introCrunchyroll() {
    return `この拡張機能はCrunchyrollをサポートしていますが、残念ながら、この拡張機能の人気が十分に得られていないため、コメントが見つからない可能性があります　¯\\ _（ツ）_ /¯ 動画の進行状況バーの周辺でカスタマイズ可能な設定を見つけることができます。同じ場所でログインした後、コメントの投稿する事ができます。 コメントはこのサイトに保存されます。`;
  }
  public get submitFeedbackButton() {
    return `送信`;
  }
  public get feedbackInputLabel() {
    return `説明`;
  }
  public get emailInputLabel() {
    return `Eメール`;
  }
  public get emailInputPlaceholder() {
    return `さらに返信を受け取りたい場合は、メールを残すことをおすすめです。`;
  }
  public get showMoreChatsButton() {
    return `もっと見せる`;
  }
  public get chatVideoSiteLabel() {
    return `動画サイト`;
  }
  public get chatVideoIdLabel() {
    return `動画ID`;
  }
  public get chatTimestampLabel() {
    return `タイムスタンプ`;
  }
  public get chatContentLabel() {
    return `コンテンツ`;
  }
  public get chatPostedDateLabel() {
    return `投稿日`;
  }
  public get setNicknameButton() {
    return `セットする`;
  }
  public get nicknameInputLabel() {
    return `ニックネーム`;
  }
  public get nicknameTab() {
    return `ニックネーム`;
  }
  public get historyTab() {
    return `投稿履歴`;
  }
  public get signOutButton() {
    return `ログアウト`;
  }
  public get termsTab() {
    return `規約と条件`;
  }
  public get privacyTab() {
    return `プライバシー`;
  }
  public get feedbackTab() {
    return `フィードバック`;
  }
  public get signInButton() {
    return `Googleでログイン`;
  }
}
