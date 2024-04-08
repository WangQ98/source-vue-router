import { isBrowser } from '../utils'
import { removeTrailingSlash } from '../location'

export type HistoryLocation = string
/**
 * HTML5 历史状态允许的变量类型。注意 pushState 会克隆传递的状态对象，并不接受所有类型的值：
 * 例如：它不接受符号或函数作为值。它也忽略作为键的符号。
 *
 * @internal
 */
export type HistoryStateValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | HistoryState
  | HistoryStateArray

/**
 * 允许的 HTML history.state
 */
export interface HistoryState {
  [x: number]: HistoryStateValue
  [x: string]: HistoryStateValue
}

/**
 * 允许用于 history.state 的数组。
 *
 * @internal
 */
export interface HistoryStateArray extends Array<HistoryStateValue> { }

export enum NavigationType {
  pop = 'pop',
  push = 'push',
}

export enum NavigationDirection {
  back = 'back',
  forward = 'forward',
  unknown = '',
}

export interface NavigationInformation {
  type: NavigationType
  direction: NavigationDirection
  delta: number
}

export interface NavigationCallback {
  (
    to: HistoryLocation,
    from: HistoryLocation,
    information: NavigationInformation
  ): void
}

/**
 * 历史对象的起始位置
 */
export const START: HistoryLocation = ''

export type ValueContainer<T> = { value: T }

/**
 * 历史实现的接口，可传递给 router 作为 {@link Router.history}
 *
 * @alpha
 */
export interface RouterHistory {
  /**
   * 基础路径，被添加到每个 url 前面。这允许在域的子文件夹（如 `example.com/sub-folder`）中托管 SPA，
   * 通过设置 `base` 为 `/sub-folder`
   */
  readonly base: string
  /**
   * 当前历史位置
   */
  readonly location: HistoryLocation
  /**
   * 当前历史状态
   */
  readonly state: HistoryState

  /**
   * 导航到一个位置。在 HTML5 历史实现中，这将调用 `history.pushState` 来有效地更改 URL。
   *
   * @param to - 要推送的位置
   * @param data - 与导航条目关联的可选 {@link HistoryState}
   */
  push(to: HistoryLocation, data?: HistoryState): void
  /**
   * 与 {@link RouterHistory.push} 相同，但执行 `history.replaceState` 而不是 `history.pushState`
   *
   * @param to - 要设置的位置
   * @param data - 与导航条目关联的可选 {@link HistoryState}
   */
  replace(to: HistoryLocation, data?: HistoryState): void

  /**
   * 在给定方向上遍历历史。
   *
   * @example
   * ```js
   * myHistory.go(-1) // 等同于 window.history.back()
   * myHistory.go(1) // 等同于 window.history.forward()
   * ```
   *
   * @param delta - 要旅行的距离。如果 delta 小于 0，则向后移动，如果大于 0，则向前移动该数量的条目。
   * @param triggerListeners - 是否应触发附加到历史的监听器
   */
  go(delta: number, triggerListeners?: boolean): void

  /**
   * 附加到历史实现的监听器，当从外部触发导航（如浏览器的后退和前进按钮）或当传递 `true` 给 {@link RouterHistory.back} 和 {@link RouterHistory.forward} 时触发。
   *
   * @param callback - 要附加的监听器
   * @returns 移除监听器的回调
   */
  listen(callback: NavigationCallback): () => void

  /**
   * 生成用于锚标签的相应 href。
   *
   * @param location - 应创建 href 的历史位置
   */
  createHref(location: HistoryLocation): string

  /**
   * 清除由于历史实现而附加的任何事件监听器。
  */
  destroy(): void
}

/**
 * 通过移除任何尾随斜杠并读取存在的 base 标签来规范化基础路径。
 *
 * @param base - 要规范化的基础路径
 */
export function normalizeBase(base?: string): string {
  if (!base) {
    if (isBrowser) {
      // 尊重 <base> 标签
      const baseEl = document.querySelector('base')
      base = (baseEl && baseEl.getAttribute('href')) || '/'
      // 去除完整 URL 的起源部分
      base = base.replace(/^\w+:\/\/[^\/]+/, '')
    } else {
      base = '/'
    }
  }

  // 如果通过上面的正则表达式移除了前导斜杠，则确保添加前导斜杠
  // 避免在 hash 前添加斜杠，因为可能从像 file:// 这样的磁盘读取文件
  // 前导斜杠会导致问题
  if (base[0] !== '/' && base[0] !== '#') base = '/' + base

  // 移除尾随斜杠，这样其他方法就可以通过 `base + fullPath` 来构建 href
  return removeTrailingSlash(base)
}

// 移除 hash 前的任何字符
const BEFORE_HASH_RE = /^[^#]+#/
export function createHref(base: string, location: HistoryLocation): string {
  // 构建用于锚点标签的 href
  return base.replace(BEFORE_HASH_RE, '#') + location
}

