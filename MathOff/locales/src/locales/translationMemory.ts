type Lang = "pt" | "en";

type Pair = {
  src: string;
  srcLang: Lang;
  tgt: string; 
  tgtLang: Lang;
};

const TM: Pair[] = [
  { src: "welcome to mathoff!", srcLang: "en", tgt: "Bem-vindo ao MathOff!", tgtLang: "pt" },
  { src: "choose your challenge level:", srcLang: "en", tgt: "Escolha seu nível de desafio:", tgtLang: "pt" },
  { src: "other modes", srcLang: "en", tgt: "Outros Modos", tgtLang: "pt" },
  { src: "level 1 — easy", srcLang: "en", tgt: "Nível 1 — Fácil", tgtLang: "pt" },
  { src: "level 2 — medium", srcLang: "en", tgt: "Nível 2 — Médio", tgtLang: "pt" },
  { src: "level 3 — hard", srcLang: "en", tgt: "Nível 3 — Difícil", tgtLang: "pt" },
  { src: "bem-vindo ao mathoff!", srcLang: "pt", tgt: "Welcome to MathOff!", tgtLang: "en" },
  { src: "escolha seu nível de desafio:", srcLang: "pt", tgt: "Choose your challenge level:", tgtLang: "en" },
];

function levenshtein(a: string, b: string) {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}


export function translateTM(text: string, target: Lang): string | null {
  if (!text || !text.trim()) return text;
  const srcNorm = normalize(text);


  for (const p of TM) {
    if (p.srcLang !== target && p.tgtLang === target && p.src === srcNorm) {
      return matchCapitalization(text, p.tgt);
    }
  }

  const candidates = TM.filter((p) => p.tgtLang === target);
  let best: { pair?: Pair; score?: number } = {};
  for (const p of candidates) {
    const dist = levenshtein(p.src, srcNorm);
    const rel = dist / Math.max(p.src.length, srcNorm.length);
    if (rel < 0.35) {
      if (!best.score || rel < best.score) {
        best = { pair: p, score: rel };
      }
    }
  }
  if (best.pair) {
    return matchCapitalization(text, best.pair.tgt);
  }
  return null;
}

function matchCapitalization(orig: string, translated: string) {
  if (!orig) return translated;
  const first = orig.trim()[0];
  if (first === first.toUpperCase()) {
    return translated[0].toUpperCase() + translated.slice(1);
  }
  return translated;
}

export function addPair(src: string, srcLang: Lang, tgt: string, tgtLang: Lang) {
  TM.push({ src: normalize(src), srcLang, tgt, tgtLang });
}
