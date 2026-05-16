import type { QuoteShareLinkDTO } from "./types";
import { shareLinkIsValid } from "./share-link-policy";

export function canCustomerAcceptQuote(input: {
  shareLink: QuoteShareLinkDTO;
  termsAccepted: boolean;
  quoteExpired: boolean;
  now?: Date;
}): boolean {
  return input.termsAccepted === true && input.quoteExpired === false && shareLinkIsValid(input.shareLink, input.now ?? new Date());
}

export function canCreateOrderFromAcceptance(customerAccepted: boolean): boolean {
  return customerAccepted === true;
}
