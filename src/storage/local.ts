import { LOCAL_STORAGE_KEY } from "@/constants/local-storage.constant";
import { LocalStorage, LocalStorageWithMemory } from "@/lib/local-storage";

export const localAccessToken = new LocalStorageWithMemory<string>(LOCAL_STORAGE_KEY.ACCESS_TOKEN, null);
export const localNotAsk2FA = (userId: number) => new LocalStorage<boolean>(LOCAL_STORAGE_KEY.NOT_ASK_2FA + userId, null);
