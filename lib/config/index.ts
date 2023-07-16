import finalSiteConfig from '../../site-config'

export * from './getters'

function getSiteConfig<
  Key extends keyof typeof finalSiteConfig,
  Value extends (typeof finalSiteConfig)[Key]
>(key: Key, defaultValue?: Value): Value
function getSiteConfig<
  Key extends keyof typeof finalSiteConfig,
  Value extends (typeof finalSiteConfig)[Key]
>(key: Key, defaultValue: Value): NonNullable<Value> {
  const value = finalSiteConfig[key]

  if (typeof value !== 'undefined') {
    return value as NonNullable<Value>
  }

  if (typeof defaultValue !== 'undefined') {
    return defaultValue as NonNullable<Value>
  }

  throw new Error(`Config error: missing required site config value "${key}"`)
}

export { getSiteConfig }
