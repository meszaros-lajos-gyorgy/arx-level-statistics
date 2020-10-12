#!/usr/bin/env node --experimental-modules

import fs from 'fs'
import { EOL } from 'os'
import minimist from 'minimist'
import { fileExists, getPackageVersion, streamToBuffer } from './helpers.mjs'
import { getLevelDimensions } from '../src/index.mjs';
import { getPolygonDimensions } from '../src/index.mjs';
import { getAllRoomDimensions } from '../src/index.mjs';

const args = minimist(process.argv.slice(2), {
  boolean: ['version']
});

const format = n => {
  return (n + '').padStart(5, ' ')
}

(async () => {
  if (args.version) {
    console.log(await getPackageVersion())
    process.exit(0)
  }

  let filename = args._[0]

  let hasErrors = false

  let input
  if (filename) {
    if (await fileExists(filename)) {
      input = fs.createReadStream(filename)
    } else {
      console.error('error: input file does not exist')
      hasErrors = true
    }
  } else {
    input = process.openStdin()
  }

  let json = JSON.parse(await streamToBuffer(input))

  if (json.meta.type === 'combined') {
    json = json.fts
  } else if (json.meta.type !== 'fts') {
    console.error('error: unsupported meta type, expected "combined" or "fts"')
    hasErrors = true
  }

  if (hasErrors) {
    process.exit(1)
  }

  const { width, height } = getLevelDimensions(json)

  console.log(EOL + 'Level:')
  console.log(`  width: ${width * 100} | height: ${height * 100}`)

  const { x, y, z } = getPolygonDimensions(json)

  console.log(EOL + 'Polygons:')
  console.log(`  X: [ ${format(x[0])} .. ${format(x[1])} ]`)
  console.log(`  Y: [ ${format(y[0])} .. ${format(y[1])} ]`)
  console.log(`  Z: [ ${format(z[0])} .. ${format(z[1])} ]`)

  const rooms = getAllRoomDimensions(json)

  console.log(EOL + 'Rooms:')
  rooms.forEach((room, idx) => {
    console.log(`  #${idx + 1}:`)
    console.log(`    X: [ ${format(room.x[0])} .. ${format(room.x[1])} ]`)
    console.log(`    Y: [ ${format(room.y[0])} .. ${format(room.y[1])} ]`)
    console.log(`    Z: [ ${format(room.z[0])} .. ${format(room.z[1])} ]`)
  })
})()
