// 学習記録はブラウザ内（localStorage）にだけ保存する。
// プライベートウィンドウなどで使えない場合もあるので、失敗しても画面は動くようにしておく。
const PREFIX = 'patent-study:'

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

export function save(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
    window.dispatchEvent(new CustomEvent('patent-study:update'))
  } catch {
    // 保存できなくても学習自体は続けられる
  }
}

export function remove(key: string): void {
  try {
    window.localStorage.removeItem(PREFIX + key)
    window.dispatchEvent(new CustomEvent('patent-study:update'))
  } catch {
    // noop
  }
}

export function normalizePath(path: string): string {
  return path.replace(/\.(html|md)$/, '').replace(/\/index$/, '/').replace(/\/$/, '') || '/'
}
