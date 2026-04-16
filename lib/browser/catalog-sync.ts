export type CatalogSyncPayload = {
  at: number;
  reason: "create" | "update" | "delete" | "promotion";
};

const channelName = "pilarsa-catalog-sync";
const eventName = "pilarsa:catalog-sync";
const storageKey = "pilarsa:catalog-sync";

function getChannel() {
  if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") {
    return null;
  }

  return new BroadcastChannel(channelName);
}

export function broadcastCatalogChange(
  reason: CatalogSyncPayload["reason"] = "update",
) {
  if (typeof window === "undefined") {
    return;
  }

  const payload: CatalogSyncPayload = {
    at: Date.now(),
    reason,
  };

  const channel = getChannel();
  channel?.postMessage(payload);
  channel?.close();

  window.dispatchEvent(new CustomEvent<CatalogSyncPayload>(eventName, { detail: payload }));

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(payload));
  } catch {
    // Best-effort fallback for tabs without BroadcastChannel support.
  }
}

export function subscribeCatalogChanges(
  callback: (payload: CatalogSyncPayload) => void,
) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const channel = getChannel();

  const handleMessage = (event: MessageEvent<CatalogSyncPayload>) => {
    callback(event.data);
  };

  const handleCustomEvent = (event: Event) => {
    const customEvent = event as CustomEvent<CatalogSyncPayload>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    }
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== storageKey || !event.newValue) {
      return;
    }

    try {
      callback(JSON.parse(event.newValue) as CatalogSyncPayload);
    } catch {
      // Ignore malformed payloads.
    }
  };

  channel?.addEventListener("message", handleMessage);
  window.addEventListener(eventName, handleCustomEvent as EventListener);
  window.addEventListener("storage", handleStorage);

  return () => {
    channel?.removeEventListener("message", handleMessage);
    channel?.close();
    window.removeEventListener(eventName, handleCustomEvent as EventListener);
    window.removeEventListener("storage", handleStorage);
  };
}
