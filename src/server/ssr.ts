import { AppStateType } from 'src/types/store';

/**
 * Возвращает шаблон HTML
 * @param {String} appHtml,
 * @param {Object} preloadedState
 */
export function getHTMLtemplate({ html, state }: {html: string, state: AppStateType}) {
    return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
      >
      <title>Arcanum</title>
      <link rel="stylesheet" href="/static/dist/main.css">
    </head>
    <body>
      <div id="root">${html}</div>
      <script>
        // WARNING: See the following for security issues around embedding JSON in HTML:
        // http://redux.js.org/recipes/ServerRendering.html#security-considerations
        window.__PRELOADED_STATE__ = ${JSON.stringify(state).replace(/</g, '\\\u003c')}
      </script>
      <script src="/static/dist/client-bundle.js"></script>
    </body>
  </html>
`;
}
