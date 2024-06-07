import DefaultText from "../default/text";

export default class Text extends DefaultText {
  get locale() {
    return "zh-TW";
  }
  get title() {
    return `DanMage: YouTube和Twitch等網站上新增彈幕`;
  }
  get intro() {
    return `DanMage是chrome和firefox的擴充程式，它為多個視頻網站同時提供顯示彈幕的功能。目前支持的網站有Twitch， YouTube，和Crunchyroll。chrome對應：`;
  }
  get intro2() {
    return `firefox對應：`;
  }
  get intro3() {
    return `對應的開源代碼可以在這裡看到：`;
  }
  get introTwitch() {
    return `在Twitch上，該擴充支持直播和錄播，在聊天輸入框附近可以找到自定義設置。你需要保持聊天室不被隱藏起來，否則聊天會和Twitch服務器斷開連接。`;
  }
  get introYouTube() {
    return  `在YouTube上，該擴充支持直播，錄播，首映以及普通的回放視頻。`;
  }
  get introYouTube2() {
    return `對於直播，錄播，和首映，你需要開啟YouTube自帶的聊天室，然後你可以在聊天室周圍找到自定義設置。`;
  }
  get introYouTube3() {
    return `對於普通視頻而言，很遺憾，你可能並不能看到任何彈幕，因為該擴充並沒有火起來 ¯\\_(ツ)_/¯，儘管嚴格來說彈幕功能是存在的。你可以在視頻控制欄裡找到自定義設置，同時也可以用來發送彈幕（需要先登入）。彈幕會被存儲在這個網站上。`;
  }
  get introCrunchyroll() {
    return `該擴充支持Crunchyroll的視頻，儘管你可能並不能看到任何彈幕，因為該擴充並沒有火起來 ¯\\_(ツ)_/¯，你可以在視頻控制欄裡找到自定義設置，同時也可以用來發送彈幕（需要先登入）。彈幕會被存儲在這個網站上。`;
  }
  get directFeedbackSuggestion() {
    return `你可以直接發送反饋至contact@danmage.com或者填寫並提交以下的表單。`;
  }
  get submitFeedbackButton() {
    return `提交`;
  }
  get feedbackInputLabel() {
    return `內容描述`;
  }
  get emailInputLabel() {
    return `郵箱`;
  }
  get emailInputPlaceholder() {
    return `如果您想要收到進一步的回覆，可以選擇留下您的郵箱。`;
  }
  get showMoreChatsButton() {
    return `顯示更多`;
  }
  get chatVideoSiteLabel() {
    return `網站`;
  }
  get chatVideoIdLabel() {
    return `視頻ID`;
  }
  get chatTimestampLabel() {
    return `時間戳`;
  }
  get chatContentLabel() {
    return `內容`;
  }
  get chatPostedDateLabel() {
    return `發出日期`;
  }
  get setNicknameButton() {
    return `設定`;
  }
  get nicknameInputLabel() {
    return `暱稱`;
  }
  get nicknameTab() {
    return `暱稱`;
  }
  get historyTab() {
    return `歷史紀錄`;
  }
  get signOutButton() {
    return `登出`;
  }
  get termsTab() {
    return `條款和條件`;
  }
  get privacyTab() {
    return `隱私政策`;
  }
  get feedbackTab() {
    return `反饋`;
  }
  get signInButton() {
    return `使用Google帳號登入`;
  }
}
