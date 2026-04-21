export function escapeXml(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function buildLargeNumberSvg(n: number): string {
    const label = n.toLocaleString('en-US');
    return `<?xml version="1.0" encoding="UTF-8"?>
              <svg xmlns="http://www.w3.org/2000/svg" width="360" height="96" viewBox="0 0 360 96">
                <rect width="100%" height="100%" fill="#f5f5f5"/>
                <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui,Segoe UI,sans-serif" font-size="32" fill="#111111">${escapeXml(label)}</text>
              </svg>`;
}
