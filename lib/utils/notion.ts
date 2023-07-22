import {
  NOTION_ASSETS_ADDRESSES,
  SELF_HOSTED_ASSETS_ADDRESSES,
} from '../constants'

export const isNotionAsset = (url: string): boolean => {
  return NOTION_ASSETS_ADDRESSES.some((address) => url.includes(address))
}

export const isSelfHostedAsset = (url: string): boolean => {
  return SELF_HOSTED_ASSETS_ADDRESSES.some((address) => url.includes(address))
}
