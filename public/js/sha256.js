/* =========================================================
   SHA-256 en JavaScript pur (synchrone, sans dépendance).
   Sert au terrain de jeu du jour 20. Les vraies réponses,
   elles, sont vérifiées par le serveur.
   ========================================================= */
(function (global) {
  'use strict';

  function estPremier(n) {
    for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
    return true;
  }

  // Les constantes de SHA-256 sont les décimales des racines carrées et
  // cubiques des premiers nombres premiers : on les recalcule ici.
  const H0 = [];
  const K = [];
  for (let n = 2; K.length < 64; n++) {
    if (!estPremier(n)) continue;
    if (H0.length < 8) H0.push(((Math.sqrt(n) % 1) * 4294967296) >>> 0);
    K.push(((Math.cbrt(n) % 1) * 4294967296) >>> 0);
  }

  const ror = (x, n) => (x >>> n) | (x << (32 - n));

  function sha256(texte) {
    const donnees = new TextEncoder().encode(String(texte));
    const l = donnees.length;
    const total = Math.ceil((l + 9) / 64) * 64;
    const buf = new Uint8Array(total);
    buf.set(donnees);
    buf[l] = 0x80;
    const dv = new DataView(buf.buffer);
    const bits = l * 8;
    dv.setUint32(total - 8, Math.floor(bits / 4294967296));
    dv.setUint32(total - 4, bits >>> 0);

    const h = H0.slice();
    const w = new Uint32Array(64);

    for (let off = 0; off < total; off += 64) {
      for (let i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4);
      for (let i = 16; i < 64; i++) {
        const x = w[i - 15], y = w[i - 2];
        const s0 = ror(x, 7) ^ ror(x, 18) ^ (x >>> 3);
        const s1 = ror(y, 17) ^ ror(y, 19) ^ (y >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
      }
      let [a, b, c, d, e, f, g, hh] = h;
      for (let i = 0; i < 64; i++) {
        const S1 = ror(e, 6) ^ ror(e, 11) ^ ror(e, 25);
        const ch = (e & f) ^ (~e & g);
        const t1 = (hh + S1 + ch + K[i] + w[i]) >>> 0;
        const S0 = ror(a, 2) ^ ror(a, 13) ^ ror(a, 22);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const t2 = (S0 + maj) >>> 0;
        hh = g; g = f; f = e; e = (d + t1) >>> 0;
        d = c; c = b; b = a; a = (t1 + t2) >>> 0;
      }
      h[0] = (h[0] + a) >>> 0; h[1] = (h[1] + b) >>> 0;
      h[2] = (h[2] + c) >>> 0; h[3] = (h[3] + d) >>> 0;
      h[4] = (h[4] + e) >>> 0; h[5] = (h[5] + f) >>> 0;
      h[6] = (h[6] + g) >>> 0; h[7] = (h[7] + hh) >>> 0;
    }
    return h.map(x => x.toString(16).padStart(8, '0')).join('');
  }

  // Met une réponse sous une forme standard : sans accents, sans espaces
  // ni ponctuation, en majuscules. « Télescope ! » → « TELESCOPE ».
  function normaliser(texte) {
    return String(texte)
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
  }


  global.sha256 = sha256;
  global.normaliser = normaliser;
})(window);
