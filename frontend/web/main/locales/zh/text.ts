import { TextEn } from "../en/text";

export class TextZh extends TextEn {
  public get locale() {
    return "zh";
  }
  public get title() {
    return `DanMage - 为多个视频网站统一提供弹幕功能`;
  }
  public get intro() {
    return `DanMage是一个Chrome扩展程序，它为多个视频网站统一提供显示弹幕的功能。目前支持的网站有Twitch， YouTube，和Crunchyroll。这里安装：`;
  }
  public get intro2() {
    return `对应的开源代码可以在这里看到：`;
  }
  public get introTwitch() {
    return `在Twitch上，该扩展支持直播和录播，在聊天输入框附近可以找到自定义设置。你需要保持聊天室不被隐藏起来，否则聊天室会和Twitch服务器断开连接。`;
  }
  public get introYouTube() {
    return  `在YouTube上，该扩展支持直播，录播，首映以及普通的回放视频。`;
  }
  public get introYouTube2() {
    return `对于直播，录播，和首映，你需要开启YouTube自带的聊天室，然后你可以在聊天室周围找到自定义设置。`;
  }
  public get introYouTube3() {
    return `对于普通视频而言，很遗憾，你可能并不能看到任何弹幕，因为该扩展并没有火起来 ¯\\_(ツ)_/¯，尽管严格来说弹幕功能是存在的。你可以在视频控制栏里找到自定义设置，同时也可以用来发送弹幕（需要先登录）。弹幕会被存储在这个网站上。`;
  }
  public get introCrunchyroll() {
    return `该扩展支持Crunchyroll的视频，尽管你可能并不能看到任何弹幕，因为该扩展并没有火起来 ¯\\_(ツ)_/¯. 你可以在视频控制栏里找到自定义设置，同时也可以用来发送弹幕（需要先登录）。弹幕会被存储在这个网站上。`;
  }
  public get submitFeedbackButton() {
    return `提交`;
  }
  public get feedbackInputLabel() {
    return `内容描述`;
  }
  public get emailInputLabel() {
    return `邮箱`;
  }
  public get emailInputPlaceholder() {
    return `如果您想要收到进一步的回复，可以选择留下您的邮箱。`;
  }
  public get showMoreChatsButton() {
    return `显示更多`;
  }
  public get chatVideoSiteLabel() {
    return `网站`;
  }
  public get chatVideoIdLabel() {
    return `视频ID`;
  }
  public get chatTimestampLabel() {
    return `时间戳`;
  }
  public get chatContentLabel() {
    return `内容`;
  }
  public get chatPostedDateLabel() {
    return `发出日期`;
  }
  public get setNicknameButton() {
    return `设定`;
  }
  public get nicknameInputLabel() {
    return `昵称`;
  }
  public get nicknameTab() {
    return `昵称`;
  }
  public get historyTab() {
    return `历史记录`;
  }
  public get signOutButton() {
    return `登出`;
  }
  public get termsTab() {
    return `条款和条件`;
  }
  public get privacyTab() {
    return `隐私政策`;
  }
  public get feedbackTab() {
    return `反馈`;
  }
  public get signInButton() {
    return `使用Google账号登录`;
  }
}
