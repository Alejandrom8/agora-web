// src/createEmotionCache.ts
import createCache, { EmotionCache } from '@emotion/cache';

export default function createEmotionCache(): EmotionCache {
  let insertionPoint: HTMLElement | undefined;

  if (typeof document !== 'undefined') {
    const el = document.querySelector<HTMLMetaElement>('meta[name="emotion-insertion-point"]');
    insertionPoint = el ?? undefined;
  }

  // key 'mui' o 'css' funciona; prepend asegura orden predecible
  return createCache({ key: 'mui', insertionPoint, prepend: true });
}
