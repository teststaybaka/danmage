import DefaultText from "../default/text";

export default class Text extends DefaultText {
  get locale() {
    return "zh";
  }
  get title() {
    return `DanMage - 为多个视频网站统一提供弹幕功能`;
  }
  get intro() {
    return `DanMage是一个Chrome扩展程序，它为多个视频网站统一提供显示弹幕的功能。目前支持的网站有Twitch， YouTube，和Crunchyroll。这里安装：`;
  }
  get intro2() {
    return `对应的开源代码可以在这里看到：`;
  }
  get introTwitch() {
    return `在Twitch上，该扩展支持直播和录播，在聊天输入框附近可以找到自定义设置。你需要保持聊天室不被隐藏起来，否则聊天室会和Twitch服务器断开连接。`;
  }
  get introYouTube() {
    return  `在YouTube上，该扩展支持直播，录播，首映以及普通的回放视频。`;
  }
  get introYouTube2() {
    return `对于直播，录播，和首映，你需要开启YouTube自带的聊天室，然后你可以在聊天室周围找到自定义设置。`;
  }
  get introYouTube3() {
    return `对于普通视频而言，很遗憾，你可能并不能看到任何弹幕，因为该扩展并没有火起来 ¯\\_(ツ)_/¯，尽管严格来说弹幕功能是存在的。你可以在视频控制栏里找到自定义设置，同时也可以用来发送弹幕（需要先登录）。弹幕会被存储在这个网站上。`;
  }
  get introCrunchyroll() {
    return `该扩展支持Crunchyroll的视频，尽管你可能并不能看到任何弹幕，因为该扩展并没有火起来 ¯\\_(ツ)_/¯. 你可以在视频控制栏里找到自定义设置，同时也可以用来发送弹幕（需要先登录）。弹幕会被存储在这个网站上。`;
  }
  get submitFeedbackButton() {
    return `提交`;
  }
  get feedbackInputLabel() {
    return `内容描述`;
  }
  get emailInputLabel() {
    return `邮箱`;
  }
  get emailInputPlaceholder() {
    return `如果您想要收到进一步的回复，可以选择留下您的邮箱。`;
  }
  get showMoreChatsButton() {
    return `显示更多`;
  }
  get chatVideoSiteLabel() {
    return `网站`;
  }
  get chatVideoIdLabel() {
    return `视频ID`;
  }
  get chatTimestampLabel() {
    return `时间戳`;
  }
  get chatContentLabel() {
    return `内容`;
  }
  get chatPostedDateLabel() {
    return `发出日期`;
  }
  get setNicknameButton() {
    return `设定`;
  }
  get nicknameInputLabel() {
    return `昵称`;
  }
  get nicknameTab() {
    return `昵称`;
  }
  get historyTab() {
    return `历史记录`;
  }
  get signOutButton() {
    return `登出`;
  }
  get termsTab() {
    return `条款和条件`;
  }
  get privacyTab() {
    return `隐私政策`;
  }
  get feedbackTab() {
    return `反馈`;
  }
  get signInButton() {
    return `使用Google账号登录`;
  }
}
