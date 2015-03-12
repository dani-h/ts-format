/// <reference path="./typedef/node.d.ts" />
/// <reference path="./typedef/typescript.d.ts" />
import ts = require("typescript")
import fs = require("fs")

module formatter {
  var getFormattedText = (filename:string, formatOpts: ts.FormatCodeOptions) => {
    filename = filename === '-' ? '/dev/stdin' : filename
    var input = fs.readFileSync(filename).toString()
    return format(input)
  }

  // Note: this uses ts.formatting which is part of the typescript 1.4 package but is not currently
  //       exposed in the public typescript.d.ts. The typings should be exposed in the next release.
  function format(text: string) {
      var options = getDefaultOptions()
      // Parse the source text
      var sourceFile = ts.createSourceFile("file.ts", text, ts.ScriptTarget.Latest, "0")
      fixupParentReferences(sourceFile)
      // Get the formatting edits on the input sources
      var edits = (<any>ts).formatting.formatDocument(sourceFile, getRuleProvider(options), options)
      // Apply the edits on the input code
      return applyEdits(text, edits)
  }

  function getRuleProvider(options: ts.FormatCodeOptions) {
      // Share this between multiple formatters using the same options.
      // This represents the bulk of the space the formatter uses.
      var ruleProvider = new (<any>ts).formatting.RulesProvider()
      ruleProvider.ensureUpToDate(options)
      return ruleProvider
  }

  function applyEdits(text: string, edits: ts.TextChange[]): string {
      // Apply edits in reverse on the existing text
      var result = text
      for (var i = edits.length - 1; i >= 0; i--) {
          var change = edits[i]
          var head = result.slice(0, change.span.start())
          var tail = result.slice(change.span.start() + change.span.length())
          result = head + change.newText + tail
      }
      return result
  }

  function getDefaultOptions(): ts.FormatCodeOptions {
      return {
          IndentSize: 4,
          TabSize: 4,
          NewLineCharacter: '\r\n',
          ConvertTabsToSpaces: true,
          InsertSpaceAfterCommaDelimiter: true,
          InsertSpaceAfterSemicolonInForStatements: true,
          InsertSpaceBeforeAndAfterBinaryOperators: true,
          InsertSpaceAfterKeywordsInControlFlowStatements: true,
          InsertSpaceAfterFunctionKeywordForAnonymousFunctions: false,
          InsertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis: false,
          PlaceOpenBraceOnNewLineForFunctions: false,
          PlaceOpenBraceOnNewLineForControlBlocks: false,
      }
  }

  function fixupParentReferences(sourceFile: ts.SourceFile) {
      var parent: ts.Node = sourceFile
      function walk(n: ts.Node): void {
          n.parent = parent

          var saveParent = parent
          parent = n
          ts.forEachChild(n, walk)
          parent = saveParent
      }
      ts.forEachChild(sourceFile, walk)
  }
}

export = formatter
