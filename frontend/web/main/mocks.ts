import { HostApp } from "../../../interface/chat_entry";
import {
  GetChatHistoryResponse,
  GetUserResponse,
} from "../../../interface/service";
import { HistoryPage } from "./history_page";
import { HomePage } from "./home_page";
import { NicknamePage } from "./nickname_page";
import { WebServiceClientMock } from "@selfage/web_service_client/client_mock";

export class HomePageMock extends HomePage {
  public constructor() {
    super();
  }
}

export class HistoryPageMock extends HistoryPage {
  public constructor() {
    super(
      new (class extends WebServiceClientMock {
        public async send(request: any): Promise<any> {
          return {
            chatEntries: [
              {
                hostApp: HostApp.YouTube,
                hostContentId: "piavxf",
                timestamp: 80000,
                content: "Chashu!",
                created: 100000,
              },
            ],
            cursor: "a cursor",
          } as GetChatHistoryResponse as any;
        }
      })(),
    );
  }
}

export class NicknamePageMock extends NicknamePage {
  public constructor() {
    super(
      new (class extends WebServiceClientMock {
        public async send(request: any): Promise<any> {
          return {
            user: {},
          } as GetUserResponse as any;
        }
      })(),
    );
  }
}
