import { LOCAL_STORAGE_KEY } from "@/constants/local-storage.constant";
import { LocalStorageWithMemory } from "@/lib/local-storage";

export const localAccessToken = new LocalStorageWithMemory<string>(LOCAL_STORAGE_KEY.ACCESS_TOKEN, null);
