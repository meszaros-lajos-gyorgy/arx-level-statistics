import { pluck, unnest, reject, groupBy, prop, map, objOf, compose, values } from '../node_modules/ramda/src/index.mjs'
import { limitAll } from './helpers.mjs'

export const getLevelDimensions = json => {
  return {
    width: json.sceneHeader.sizeX,
    height: json.sceneHeader.sizeZ
  }
}

const isEmptyVertex = vertex => {
  const { posX, posY, posZ, texU, texV } = vertex
  return posX === 0 && posY === 0 && posZ === 0 && texU === 0 && texV === 0
}

const getVertices = polygons => {
  return reject(isEmptyVertex, unnest(pluck('vertices', polygons)))
}

export const getPolygonDimensions = json => {
  const vertices = getVertices(json.polygons)
  return {
    x: limitAll(pluck('posX', vertices)),
    y: limitAll(pluck('posY', vertices)),
    z: limitAll(pluck('posZ', vertices))
  }
}

export const getAllRoomDimensions = json => {
  return map(compose(getPolygonDimensions, objOf('polygons')), values(groupBy(prop('room'), json.polygons)))
}
