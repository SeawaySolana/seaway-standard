export * from "./Creator";
export * from "./Establishment";
export * from "./Membership";
export * from "./Subscription";

import { Establishment } from "./Establishment";
import { Creator } from "./Creator";
import { Membership } from "./Membership";
import { Subscription } from "./Subscription";

export const accountProviders = {
  Establishment,
  Creator,
  Membership,
  Subscription,
};
