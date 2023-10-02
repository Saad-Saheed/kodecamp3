// Exclude keys from oject
export function exclude(obj, keys) {
    return Object.fromEntries(
      Object.entries(obj).filter(([key]) => !keys.includes(key))
    )
}