function svg(c: string) {
  return `data:image/svg+xml,${encodeURIComponent(c)}`;
}

const v = '0 0 48 48';

const bg = (c: string, rx = 10) =>
  `<rect x="3" y="3" width="42" height="42" rx="${rx}" fill="${c}"/>`;

const tx = (t: string, c: string, s: number, w = 700) =>
  `<text x="24" y="24.5" text-anchor="middle" dominant-baseline="central" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="${w}" font-size="${s}" fill="${c}">${t}</text>`;

export const brandLogos: Record<string, string> = {
  Apple: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#f5f5f7")}
    <g transform="translate(0.5, 8.5)">
      <path d="M30.5 10.5c-1.9 2-4.8 3.5-7.5 3.3-.4-2.9 1.1-5.9 2.9-7.8C27.9 3.8 30.8 2.5 33.5 2.6c.3 3-1.1 6-3 8z" fill="#555"/>
      <path d="M34.5 13.5c-2.8-1.8-5.8-2.8-8.5-2.8-3.4 0-6.5 1.4-9.5 1.4-2.2 0-4.8-1-7.5-2.8C5 7 0 12.5 0 22c0 5.8 2.5 12 6 15.5 2 2.5 4.5 5.5 7.5 5.5 2.5 0 4-1.5 7-1.5s4 1.5 7 1.5 5.5-3.5 7.5-6c1.5-2 3-4.5 4-7 .5-1.5.5-2 1-2-2.5-1-5-3.5-5-7 0-3 1.5-5.5 4-7-.5-1-2.5-3-4.5-4z" fill="#555"/>
    </g>
  </svg>`),

  Samsung: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#1428A0")}
    ${tx("SAMSUNG", "#fff", 16, 700)}
  </svg>`),

  Xiaomi: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#FF6900")}
    ${tx("Xiaomi", "#fff", 22, 700)}
  </svg>`),

  Redmi: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#FF4100")}
    ${tx("Redmi", "#fff", 22, 700)}
  </svg>`),

  POCO: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#F5C518")}
    ${tx("POCO", "#000", 24, 800)}
  </svg>`),

  Huawei: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#CF0A2C")}
    <g transform="translate(-16, -6)">
      <path d="M40 14c-2 0-4 1-5 3L20 42h8l6-12 6 12h8L45 17c-1-2-3-3-5-3z" fill="#fff"/>
      <path d="M20 46h40v-4H20z" fill="#fff"/>
    </g>
  </svg>`),

  Honor: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#00A4EF")}
    ${tx("HONOR", "#fff", 18, 700)}
  </svg>`),

  Oppo: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#1BA784")}
    ${tx("OPPO", "#fff", 22, 700)}
  </svg>`),

  Realme: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#222")}
    ${tx("realme", "#F5C518", 22, 600)}
  </svg>`),

  Vivo: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#415FFF")}
    ${tx("vivo", "#fff", 24, 700)}
  </svg>`),

  OnePlus: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#EB0028")}
    ${tx("OnePlus", "#fff", 18, 700)}
  </svg>`),

  "Google Pixel": svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#f5f5f7")}
    <g transform="translate(2, 6.5)">
      <circle cx="12" cy="20" r="10" fill="#4285F4"/>
      <circle cx="32" cy="20" r="10" fill="#34A853"/>
      <circle cx="8" cy="12" r="7" fill="#EA4335"/>
      <circle cx="36" cy="12" r="7" fill="#FBBC05"/>
    </g>
  </svg>`),

  Motorola: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#1C1C1C")}
    ${tx("Moto", "#fff", 24, 700)}
  </svg>`),

  Nokia: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#124191")}
    ${tx("NOKIA", "#fff", 16, 700)}
  </svg>`),

  Infinix: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#00B140")}
    ${tx("Infinix", "#fff", 18, 700)}
  </svg>`),

  Tecno: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#003DA5")}
    ${tx("TECNO", "#fff", 18, 700)}
  </svg>`),

  Nothing: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#f5f5f7")}
    ${tx("Nothing", "#000", 22, 400)}
  </svg>`),
};
