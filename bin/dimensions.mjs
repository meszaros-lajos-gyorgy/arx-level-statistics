#!/usr/bin/env node --experimental-modules

import fs from 'fs'
import { EOL } from 'os'
import minimist from 'minimist'
import { fileExists, getPackageVersion, streamToBuffer } from './helpers.mjs'

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

  if (hasErrors) {
    process.exit(1)
  }

  const file = JSON.parse(await streamToBuffer(input))

  const sizeX = 160
  const sizeZ = 160

  console.log(EOL + 'Level:')
  console.log(`  x: ${sizeX * 100} | z: ${sizeZ * 100}`)

  const x = [5100, 5900]
  const y = [200, 340]
  const z = [10420, 12800]

  console.log(EOL + 'Polygons:')
  console.log(`  X: [ ${format(x[0])} .. ${format(x[1])} ]`)
  console.log(`  Y: [ ${format(y[0])} .. ${format(y[1])} ]`)
  console.log(`  Z: [ ${format(z[0])} .. ${format(z[1])} ]`)

  const rooms = [
    {
      x: [5100, 5900],
      y: [200, 340],
      z: [10420, 12800]
    }
  ]

  console.log(EOL + 'Rooms:')
  rooms.forEach((room, idx) => {
    console.log(`  #${idx + 1}:`)
    console.log(`    X: [ ${format(room.x[0])} .. ${format(room.x[1])} ]`)
    console.log(`    Y: [ ${format(room.y[0])} .. ${format(room.y[1])} ]`)
    console.log(`    Z: [ ${format(room.z[0])} .. ${format(room.z[1])} ]`)
  })
})()
