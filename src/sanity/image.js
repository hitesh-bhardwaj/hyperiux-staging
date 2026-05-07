import { createImageUrlBuilder } from '@sanity/image-url'
import { client } from './client'

const builder = client ? createImageUrlBuilder(client) : null

export const urlFor = (source) => {
  if (!builder || !source) return null
  return builder.image(source)
}
