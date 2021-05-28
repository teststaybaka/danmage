import { USER_SESSION, UserSession } from "../interface/session";
import { AuthedServiceDescriptor } from "@selfage/service_descriptor";
import { AuthedServiceHandler } from "@selfage/service_handler";

export abstract class UserAuthedServiceHandler<ServiceRequest, ServiceResponse>
  implements
    AuthedServiceHandler<ServiceRequest, ServiceResponse, UserSession> {
  public sessionDescriptor = USER_SESSION;
  public abstract serviceDescriptor: AuthedServiceDescriptor<
    ServiceRequest,
    ServiceResponse
  >;
  public abstract handle(
    logContext: string,
    request: ServiceRequest,
    session: UserSession
  ): Promise<ServiceResponse>;
}
