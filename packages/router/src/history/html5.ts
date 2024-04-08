import { RouterHistory } from "./common"

/**
 * Creates an HTML5 history. Most common history for single page applications.
 * 这个函数用于创建一个基于 HTML5 History API 的路由历史对象，通常用于单页应用程序。
 *
 * @param base - The base URL for all locations. If your app is served from a sub-directory on your server,
 *               you need to set this to the sub-directory.
 *               所有位置的基础 URL。如果你的应用程序是从服务器上的一个子目录提供的，你需要将其设置为这个子目录。
 */
export function createWebHistory(base?: string): RouterHistory {

  const routerHistory: any = {};

  return routerHistory
}
