#! /usr/bin/env node

'use strict'

//---------//
// Imports //
//---------//

const pify = require('pify')

const chalk = require('chalk'),
  path = require('path'),
  pFs = pify(require('fs')),
  resolveFrom = require('resolve-from')

//
//------//
// Init //
//------//

const cwd = process.cwd(),
  licenseFileName = 'license.txt',
  packageJsonFilePath = resolveFrom(cwd, './package.json')

//
//------//
// Main //
//------//

Promise.all([writeLicensePropertyToPackageJson(), writeLicenseFile()])
  // eslint-disable-next-line no-console
  .then(() => console.log(chalk.green('Done!')))
  .catch(err => {
    // eslint-disable-next-line no-console
    console.error(err)
  })

//
//------------------//
// Helper Functions //
//------------------//

function writeLicensePropertyToPackageJson() {
  return readFile(packageJsonFilePath).then(
    flow([
      parseJson,
      mergeLicense,
      jsonStringify,
      writeToFile(packageJsonFilePath),
    ])
  )
}

function writeLicenseFile() {
  return readFile(path.join(__dirname, 'license.txt')).then(
    writeToFile(path.join(cwd, licenseFileName))
  )
}

function jsonStringify(obj) {
  return JSON.stringify(obj, null, 2)
}

function parseJson(str) {
  return JSON.parse(str)
}

function mergeLicense(pjson) {
  return Object.assign(pjson, {
    license: `SEE LICENSE IN ${licenseFileName}`,
  })
}

function flow(functionArray) {
  return arg => functionArray.reduce((res, fn) => fn(res), arg)
}

function readFile(fpath) {
  return pFs.readFile(fpath, 'utf8')
}

function writeToFile(fpath) {
  return contents => pFs.writeFile(fpath, contents)
}
