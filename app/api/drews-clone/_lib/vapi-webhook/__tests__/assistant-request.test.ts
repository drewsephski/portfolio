import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import type { ContactPayload } from "../../contacts";
import {
  buildAssistantRequestResponse,
  buildVipFirstMessage,
  extractInboundCallerPhone,
  GENERIC_FIRST_MESSAGE,
  resolveAssistantRequest,
} from "../assistant-request";
import { DREWS_CLONE_ASSISTANT_ID } from "../constants";

jest.mock("../../contacts", () => ({
  lookupContact: jest.fn(),
}));

const contactsModule = jest.requireMock("../../contacts") as {
  lookupContact: jest.Mock;
};

const drewContact: ContactPayload = {
  phone: "8478599690",
  displayName: "Drew",
  relationship: "self",
  greeting: "Hey Drew",
  context: "",
  preferTransfer: false,
  email: "",
};

describe("extractInboundCallerPhone", () => {
  test("reads message.call.customer.number", () => {
    const phone = extractInboundCallerPhone({
      message: {
        type: "assistant-request",
        call: { customer: { number: "+18478599690" } },
      },
    });
    expect(phone).toBe("8478599690");
  });

  test("reads call.customer.number at root", () => {
    const phone = extractInboundCallerPhone({
      call: { customer: { number: "+1 (847) 859-9690" } },
    });
    expect(phone).toBe("8478599690");
  });

  test("reads call.from.phoneNumber", () => {
    const phone = extractInboundCallerPhone({
      message: {
        call: { from: { phoneNumber: "+18478599690" } },
      },
    });
    expect(phone).toBe("8478599690");
  });

  test("returns null when no phone fields", () => {
    expect(extractInboundCallerPhone({ message: { type: "assistant-request" } })).toBeNull();
  });
});

describe("buildVipFirstMessage", () => {
  test("self relationship uses your AI line", () => {
    expect(buildVipFirstMessage(drewContact)).toBe(
      "Hey Drew — it's your AI. He couldn't grab this. What's up?"
    );
  });

  test("family uses Drew's AI line", () => {
    expect(
      buildVipFirstMessage({
        ...drewContact,
        relationship: "parent",
        greeting: "Hey Dad",
        displayName: "Dad",
      })
    ).toBe("Hey Dad — it's Drew's AI. What's up?");
  });
});

describe("buildAssistantRequestResponse", () => {
  test("unknown caller gets generic opener", () => {
    const res = buildAssistantRequestResponse(undefined);
    expect(res.assistantId).toBe(DREWS_CLONE_ASSISTANT_ID);
    expect(res.assistantOverrides.firstMessage).toBe(GENERIC_FIRST_MESSAGE);
    expect(res.assistantOverrides.variableValues.isVip).toBe("false");
  });

  test("VIP 8478599690 gets Hey Drew deterministic line", () => {
    const res = buildAssistantRequestResponse(drewContact);
    expect(res.assistantOverrides.firstMessage).toBe(
      "Hey Drew — it's your AI. He couldn't grab this. What's up?"
    );
    expect(res.assistantOverrides.variableValues).toMatchObject({
      vipName: "Drew",
      vipGreeting: "Hey Drew",
      vipRelationship: "self",
      isVip: "true",
    });
  });
});

describe("resolveAssistantRequest", () => {
  beforeEach(() => {
    contactsModule.lookupContact.mockReset();
  });

  test("looks up normalized phone for Drew", async () => {
    contactsModule.lookupContact.mockResolvedValueOnce(drewContact);
    const res = await resolveAssistantRequest({
      message: {
        type: "assistant-request",
        call: { customer: { number: "+18478599690" } },
      },
    });
    expect(contactsModule.lookupContact).toHaveBeenCalledWith("8478599690");
    expect(res.assistantOverrides.firstMessage).toContain("Hey Drew");
    expect(res.assistantOverrides.variableValues.isVip).toBe("true");
  });

  test("DB error still returns generic opener", async () => {
    contactsModule.lookupContact.mockRejectedValueOnce(new Error("db down"));
    const res = await resolveAssistantRequest({
      message: {
        type: "assistant-request",
        call: { customer: { number: "+18478599690" } },
      },
    });
    expect(res.assistantOverrides.firstMessage).toBe(GENERIC_FIRST_MESSAGE);
    expect(res.assistantOverrides.variableValues.isVip).toBe("false");
  });
});
