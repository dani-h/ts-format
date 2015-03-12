var gulp = require("gulp")
var spawn = require("child_process").spawn
var notifier = require("node-notifier") 

var srcfiles = "./src/**/*.ts"
var bindir = "./bin/"
var main = "./src/cli.ts"

var tsc_opts = ["--outDir", bindir, "--module", "commonjs", "--target", "es5", main]

gulp.task("build", tsc_task)

gulp.task("dev", function() {
  tsc_task()
  gulp.watch(srcfiles, ["build"])
})

gulp.task("default", ["build"])

/** Wrapper build funcs */

function tsc_task() {
  var child = spawn('./node_modules/typescript/bin/tsc', tsc_opts)
  
  var output = ''
  child.stdout.on('data', function(data) {console.log("LOL"); output += data.toString()} )
  child.stdout.on('end', parse_tsc_msg)
}

var error_regex = new RegExp('error', 'i')
function parse_tsc_msg(str) {
  var title, msg

  if(error_regex.test(str)) {
    var strs = str.split('\n')
    title = strs[0]
    msg = strs[1] 
    console.error(msg)
  }

  else {
    title = 'Success'
  }

  notifier.notify({
    title: title,
    message: msg
  })
} 
