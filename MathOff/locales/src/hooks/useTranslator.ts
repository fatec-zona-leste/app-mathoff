import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { translateTM } from "../locales/translationMemory";

type Lang = "pt" | "en";

const CACHE_PREFIX = "@translate_cache_";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; 

async function getCache(key: string) {
  try {
    const raw = await AsyncStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const obj = JSON.parse(raw);
    if (Date.now() - obj.ts > CACHE_TTL_MS) {
      await AsyncStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return obj.value;
  } catch {
    return null;
  }
}
async function setCache(key: string, value: string) {
  try {
    await AsyncStorage.setItem(
      CACHE_PREFIX + key,
      JSON.stringify({ ts: Date.now(), value })
    );
  } catch {}
}

function cacheKey(text: string, target: Lang) {
  return `${target}::${text.length}::${text.slice(0, 80)}`;
}

async function translateOnlineLibre(text: string, target: Lang) {
  try {
    const resp = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text, source: "auto", target, format: "text" }),
    });
    const json = await resp.json();
    return json.translatedText || null;
  } catch (e) {
    return null;
  }
}

export function useTranslator() {
  const [loading, setLoading] = useState(false);

  const translate = useCallback(
    async (text: string, target: Lang = "pt") => {
      if (!text) return text;
      // TM (offline) first
      const tm = translateTM(text, target);
      if (tm) return tm;

      const key = cacheKey(text, target);
      const cached = await getCache(key);
      if (cached) return cached;

      setLoading(true);
      try {
        const online = await translateOnlineLibre(text, target);
        if (online) {
          await setCache(key, online);
          return online;
        }
      } catch (e) {
        console.warn("translate error", e);
      } finally {
        setLoading(false);
      }
      // fallback
      return text;
    },
    []
  );

  return { translate, loading };
}