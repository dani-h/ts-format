///<reference path="./formatter.ts"/>
var argParser = require('minimist')
var formatter = require('./formatter')
var args = argParser(process.argv)

var opts = {
  'file': '-',
  'format-opts': undefined
}
console.log(args)
if(args['h'] || args['help']) {
  console.log("Helping")
  process.exit()
}

if(args['file']) {
  opts['file'] = args['file']
}
if(args['format-opts'] {
  opts['format-opts'] = args['format-opts']
}


console.log('opts', opts)
formatter.readText(opts['file'])
