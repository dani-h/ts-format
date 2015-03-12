var gulp = require("gulp")
var spawn = require("child_process").spawn

var tsc_opts = []

var error_regex = new RegExp('error', 'i')
function tsc_task() {
  var child = spawn('./node_modules/typescript/bin/tsc', tsc_opts)

}
