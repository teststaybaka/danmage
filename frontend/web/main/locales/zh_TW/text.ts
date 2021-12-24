import { TextEn } from "../en/text";

export class TextZhTw extends TextEn {
  public get locale() {
    return "zh-TW";
  }
  public get title() {
    return `DanMage - 為多個視頻網站統一提供彈幕功能`;
  }
  public get intro() {
    return `DanMage是一個Chrome擴展程序，它為多個視頻網站統一提供顯示彈幕的功能。目前支持的網站有Twitch， YouTube，和Crunchyroll。這裡安裝：`;
  }
  public get intro2() {
    return `對應的開源代碼可以在這裡看到：`;
  }
  public get introTwitch() {
    return `在Twitch上，該擴展支持直播和錄播，在聊天輸入框附近可以找到自定義設置。你需要保持聊天室不被隱藏起來，否則聊天會和Twitch服務器斷開連接。`;
  }
  public get introYouTube() {
    return  `在YouTube上，該擴展支持直播，錄播，首映以及普通的回放視頻。`;
  }
  public get introYouTube2() {
    return `對於直播，錄播，和首映，你需要開啟YouTube自帶的聊天室，然後你可以在聊天室周圍找到自定義設置。`;
  }
  public get introYouTube3() {
    return `對於普通視頻而言，很遺憾，你可能並不能看到任何彈幕，因為該擴展並沒有火起來 ¯\\_(ツ)_/¯，儘管嚴格來說彈幕功能是存在的。你可以在視頻控制欄裡找到自定義設置，同時也可以用來發送彈幕（需要先登入）。彈幕會被存儲在這個網站上。`;
  }
  public get introCrunchyroll() {
    return `該擴展支持Crunchyroll的視頻，儘管你可能並不能看到任何彈幕，因為該擴展並沒有火起來 ¯\\_(ツ)_/¯，你可以在視頻控制欄裡找到自定義設置，同時也可以用來發送彈幕（需要先登入）。彈幕會被存儲在這個網站上。`;
  }
  public get submitFeedbackButton() {
    return `提交`;
  }
  public get feedbackInputLabel() {
    return `內容描述`;
  }
  public get emailInputLabel() {
    return `郵箱`;
  }
  public get emailInputPlaceholder() {
    return `如果您想要收到進一步的回覆，可以選擇留下您的郵箱。`;
  }
  public get showMoreChatsButton() {
    return `顯示更多`;
  }
  public get chatVideoSiteLabel() {
    return `網站`;
  }
  public get chatVideoIdLabel() {
    return `視頻ID`;
  }
  public get chatTimestampLabel() {
    return `時間戳`;
  }
  public get chatContentLabel() {
    return `內容`;
  }
  public get chatPostedDateLabel() {
    return `發出日期`;
  }
  public get setNicknameButton() {
    return `設定`;
  }
  public get nicknameInputLabel() {
    return `暱稱`;
  }
  public get nicknameTab() {
    return `暱稱`;
  }
  public get historyTab() {
    return `歷史紀錄`;
  }
  public get signOutButton() {
    return `登出`;
  }
  public get termsTab() {
    return `條款和條件`;
  }
  public get privacyTab() {
    return `隱私政策`;
  }
  public get feedbackTab() {
    return `反饋`;
  }
  public get signInButton() {
    return `使用Google帳號登入`;
  }
}