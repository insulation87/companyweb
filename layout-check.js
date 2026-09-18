// Opt-in, local-only diagnostics. No requests or data collection.
(() => {
  const panel = document.createElement('aside');
  panel.setAttribute('aria-label', '手機版面檢查');
  panel.style.cssText = 'position:fixed;inset:auto 8px 8px;z-index:1000;padding:12px;max-height:42vh;overflow:auto;background:#fff;color:#111;border:2px solid #111;font:13px/1.5 sans-serif;box-sizing:border-box;';
  const heading = document.createElement('strong');
  heading.textContent = '手機版面檢查 L1（只在測試網址顯示）';
  const output = document.createElement('pre');
  output.style.cssText = 'white-space:pre-wrap;overflow-wrap:anywhere;margin:8px 0;font:inherit;';
  const copy = document.createElement('button');
  copy.type = 'button';
  copy.textContent = '複製檢查結果';
  copy.style.cssText = 'padding:8px 12px;background:#111;color:white;border:0;font:inherit;';
  panel.append(heading, output, copy);
  document.body.appendChild(panel);
  const round = value => Math.round(value * 100) / 100;
  let report;
  function measure() {
    const selectors = ['html', 'body', 'main', '#work', '#work > .container', '.projects', '.project[data-category="brand"]', '.project[data-category="brand"] > a', '.project[data-category="brand"] .project-visual', '.project[data-category="brand"] img'];
    const elements = selectors.map(selector => {
      const element = document.querySelector(selector);
      if (!element) return { selector, missing: true };
      const rect = element.getBoundingClientRect();
      const css = getComputedStyle(element);
      return { selector, width: round(rect.width), left: round(rect.left), right: round(rect.right), scrollWidth: element.scrollWidth, display: css.display, cssWidth: css.width, maxWidth: css.maxWidth, gridColumns: css.gridTemplateColumns, gap: css.gap, position: css.position, transform: css.transform, zoom: css.zoom, objectFit: css.objectFit, naturalWidth: element.naturalWidth, naturalHeight: element.naturalHeight };
    });
    report = { version: 'L1', path: location.pathname, innerWidth, clientWidth: document.documentElement.clientWidth, screenWidth: screen.width, devicePixelRatio, visualViewport: window.visualViewport && { width: round(visualViewport.width), scale: visualViewport.scale, offsetLeft: visualViewport.offsetLeft }, mobileQuery: matchMedia('(max-width: 760px)').matches, stylesheet: document.querySelector('link[rel="stylesheet"]')?.getAttribute('href'), userAgent: navigator.userAgent, elements };
    output.textContent = `頁面：${report.path}\nCSS：${report.stylesheet}\n視窗 ${innerWidth} / 可見 ${report.visualViewport?.width} / 縮放 ${report.visualViewport?.scale}\n手機規則：${report.mobileQuery ? '有套用' : '未套用'}\n` + elements.slice(4).map(item => `${item.selector.replace('.project[data-category="brand"]', '卡片').replace('#work > .container', '容器')}：寬 ${item.width}，右界 ${item.right}`).join('\n');
  }
  copy.addEventListener('click', async () => {
    measure();
    try {
      await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
      copy.textContent = '已複製，請貼回對話';
    } catch {
      output.textContent = JSON.stringify(report, null, 2);
      copy.textContent = '請長按選取上方結果';
    }
  });
  measure();
  window.addEventListener('resize', measure);
  window.visualViewport?.addEventListener('resize', measure);
  document.querySelector('.project[data-category="brand"] img')?.addEventListener('load', measure);
})();
