function svg(c: string) {
  return `data:image/svg+xml,${encodeURIComponent(c)}`;
}

const v = '0 0 48 48';

const bg = (c: string) => `<rect x="0" y="0" width="48" height="48" rx="0" fill="${c}"/>`;

const tx = (t: string, c: string, s: number, w = 700) =>
  `<text x="24" y="24.5" text-anchor="middle" dominant-baseline="central" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="${w}" font-size="${s}" letter-spacing="-0.5" fill="${c}">${t}</text>`;

export const brandLogos: Record<string, string> = {
  Apple: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#f5f5f7")}
    <g transform="translate(6,0) scale(0.09375)">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" fill="#1d1d1f"/>
    </g>
  </svg>`),

  Samsung: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#1428A0")}
    ${tx("SAMSUNG", "#fff", 9.5, 700)}
  </svg>`),

  Xiaomi: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#FF6900")}
    ${tx("Xiaomi", "#fff", 11, 700)}
  </svg>`),

  Redmi: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#FF4100")}
    ${tx("Redmi", "#fff", 13, 700)}
  </svg>`),

  POCO: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#F5C518")}
    ${tx("POCO", "#111", 16, 800)}
  </svg>`),

  Huawei: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#CF0A2C")}
    ${tx("HUAWEI", "#fff", 9, 700)}
  </svg>`),

  Honor: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#00A4EF")}
    ${tx("HONOR", "#fff", 12, 700)}
  </svg>`),

  Oppo: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#1BA784")}
    ${tx("OPPO", "#fff", 15, 700)}
  </svg>`),

  Realme: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#1d1d1f")}
    ${tx("realme", "#FFD500", 10.5, 600)}
  </svg>`),

  Vivo: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#415FFF")}
    ${tx("vivo", "#fff", 16, 700)}
  </svg>`),

  OnePlus: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#EB0028")}
    ${tx("OnePlus", "#fff", 9, 700)}
  </svg>`),

  "Google Pixel": svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#f5f5f7")}
    <g transform="translate(2, 10)">
      <circle cx="12" cy="20" r="10" fill="#4285F4"/>
      <circle cx="32" cy="20" r="10" fill="#34A853"/>
      <circle cx="8" cy="12" r="7" fill="#EA4335"/>
      <circle cx="36" cy="12" r="7" fill="#FBBC05"/>
    </g>
  </svg>`),

  Motorola: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#1C1C1C")}
    ${tx("Moto", "#fff", 15, 700)}
  </svg>`),

  Nokia: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#124191")}
    ${tx("NOKIA", "#fff", 12, 700)}
  </svg>`),

  Infinix: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#00B140")}
    ${tx("Infinix", "#fff", 9, 700)}
  </svg>`),

  Tecno: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#003DA5")}
    ${tx("TECNO", "#fff", 11, 700)}
  </svg>`),

  Nothing: svg(`<svg viewBox="${v}" xmlns="http://www.w3.org/2000/svg">
    ${bg("#f5f5f7")}
    ${tx("Nothing", "#000", 13, 400)}
  </svg>`),
};
