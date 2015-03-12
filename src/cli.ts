///<reference path="./formatter.ts"/>
var argParser = require('minimist')
var formatter = require('./formatter')
var args = argParser(process.argv)
var opts = {
  file: '-'
}

if(args['file'])
  opts.file = args['file']
console.log('opts', opts)
formatter.readText(opts.file)
