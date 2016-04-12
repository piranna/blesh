#!/usr/bin/env node
//'use strict'

// Not interactive TTY, use plain ol' nsh
// [ToDo] Add option to force interactive mode
if(!process.stdout.isTTY) return require('nsh/server')


const blessed = require('blessed')
const Spinner = require('cli-spinner').Spinner

const eval = require('nsh').eval


const WHEEL_SCROLL = 5
const PAGE_SCROLL = 20


var scrolledUp = false


const screen  = blessed.screen({
  handleUncaughtExceptions: false
})

// Create the interface boxes
const output = blessed.layout({
  bottom: 2,
  width: '100%',
  height: screen.height-2,
  scrollable: true,
  alwaysScroll: true,  // Don't turn this off, or it breaks
  content: 'Line 0',
  wrap: false,
  scrollbar: {
    bg: 'blue'
  },
  style: {
    fg: 'white',
    bg: 'transparent'
  }
});

const input = blessed.box({
  bottom: 0,
  width: '100%',
  content: '▶',
  height: 2,
  style: {
    bg: 'white',
    fg: 'blue'
  }
});

const cli = blessed.textarea({
  width: '100%',
  left: 2,
  bottom: 0,
  content: 'ghost',
  style: {
    bg: 'white',
    fg: 'blue'
  },
  //inputOnFocus: true,
  mouse: true
});

// Prepare the screen contents and render
screen.append(output)
screen.append(input)
input.append(cli)


//// Create the LogList instance
//const logList = new Janeway.LogList(this, screen, output);


// output.on('mouse', function onMouse(e)
// {
//   var scrolled = false
//
//   switch(e.action)
//   {
//     case 'wheelup':
//       output.scroll(-WHEEL_SCROLL)
//       scrolledUp = true
//       scrolled = true
//     break;
//
//     case 'wheeldown':
//       output.scroll(WHEEL_SCROLL)
//       scrolledUp = false
//       scrolled = true
//     break
//   }
//
//   if(scrolled)
//   {
//     that.scrolledManually = output.getScrollPerc() !== 100
//
//     logList.render()
//   }
// })

// /**
//  * Handle mouse clicks
//  *
//  * @author   Jelle De Loecker   <jelle@kipdola.be>
//  * @since    0.1.0
//  * @version  0.1.4
//  */
// output.on('click', function onClick(data) {
//
//   var scrollHeight,
//       bottomIndex,
//       lineIndex,
//       topIndex,
//       gScroll,
//       scroll,
//       line,
//       str;
//
//   // Scroll index of either top or bottom visible line
//   gScroll = output.getScroll()
//
//   // Get the current height of the scroll
//   scrollHeight = that.logList.box.getScrollHeight()
//
//   if(scrolledUp && scrollHeight > output.height)
//     lineIndex = gScroll + data.y
//   else
//   {
//     bottomIndex = gScroll
//
//     if(scrollHeight > output.height)
//       topIndex = bottomIndex - output.height + 1
//     else
//       topIndex = 0
//
//     lineIndex = data.y - output.top + topIndex
//   }
//
//   logList.click(lineIndex, data.x, data.y)
// })

/**
 * Handle input of the CLI
 *
 * @author   Jelle De Loecker   <jelle@kipdola.be>
 * @since    0.1.0
 * @version  0.1.5
 */
cli.on('keypress', function onKeypress(e, key) {

  var result,
      commandLine,
      errorLine,
      evalLine,
      scope,
      path,
      temp,
      dir,
      cmd,
      id;

  switch(key.name)
  {
    case 'pagedown':
//      that.scroll(PAGE_SCROLL);
    break;

    case 'pageup':
//      that.scroll(-PAGE_SCROLL);
    break;

    case 'enter':
      cmd = cli.getValue().trim();

      // // Reset the index
      // that.cli_history_index = -1;
      //
      // // Clear out the stash
      // that.cli_stash = '';

      // Return if the cmd is empty
      if (cmd) {
        cli.clearValue();
      } else {
        return;
      }

      // // If the new command differs from the last one, unshift it onto the array
      // if (cmd != that.cli_history[0]) {
      //   that.cli_history.unshift(cmd);
      // }

      // if (cmd == 'cls') {
      //   logList.clearScreen();
      //
      //   setImmediate(function() {
      //     cli.clearValue();
      //     cli.render();
      //   });
      //   return;
      // } else if (cmd == 'exit') {
      //   process.exit();
      // }

      // Create a line for the input command
//      output.pushLine(cmd)
      var header = blessed.box({
        parent: output,
        width: '100%',
        height: 1
      })
      var command = blessed.text({
        parent: header,
        left: 2,
        width: '100%',
        content: cmd
      })

      var spinner = Spinner()
      spinner.start(function(msg)
      {
        header.content = msg
        header.render()
      })

      var command = blessed.pty({
        parent: output,
        width: '100%',
        height: '100%-3'
      })
//      output.append(command)
//      screen.render()

      var slave = command.pty.slave
      eval(cmd, {input: process.stdin, output: slave}, function()
      {
        spinner.stop()
        header.content = '!'
        header.render()
      })

      // commandLine = new Janeway.CommandLogLine(logList);
      // commandLine.set(esc('38;5;74', cmd));
      //
      // // Add it to the logList
      // logList.pushLine(commandLine);

      // try {
      //
      //   // Run the command in the global scope
      //   result = (1, eval)(cmd);
      //
      //   // Create a line for the output
      //   evalLine = new Janeway.EvalOutputLogLine(logList);
      //   evalLine.set([result]);
      //
      //   logList.insertAfter(evalLine, commandLine.index);
      // } catch (err) {
      //   errorLine = new Janeway.ErrorLogLine(logList);
      //   errorLine.set([err]);
      //
      //   logList.insertAfter(errorLine, commandLine.index);
      // }

      // Even though the input has been cleared,
      // the return gets added afterwards
      setImmediate(function() {
        cli.clearValue();
        cli.render();

//        // Scroll along if needed
//        that.scrollAlong();
      });
    break;

    default:
      cmd = cli.getValue();

      if (key.code || key.name == 'escape') {
        // Ignore keys with codes

        // arrow keys should cycle through the CLI history
        if (key.name == 'up') {
          dir = 1;
        } else if (key.name == 'down') {
          dir = -1;
        }

        if (dir) {
          // // If the current index is -1, stash the current input
          // if (that.cli_history_index == -1 && cmd) {
          //   that.cli_stash = cmd;
          // }
          //
          // id = that.cli_history_index + dir;
          //
          // if (id == -1) {
          //   that.cli_history_index = -1;
          //   cli.setValue(that.cli_stash);
          // } else if (that.cli_history[id] != null) {
          //
          //   // Get the history entry
          //   temp = that.cli_history[id];
          //
          //   // Set the new index
          //   that.cli_history_index = id;
          //
          //   // Set the value in the cli
          //   cli.setValue(temp);
          // }

          screen.render();
        }

        return;
      } else if (key.name === 'backspace') {
        cmd = cmd.slice(0, -1);
      } else {
        cmd += e;
      }
  }
});

// Quit on Control-C.
cli.key(['C-c'], function exitNow(ch, key) {
  return process.exit(0);
});

// The CLI is always in focus
cli.readInput(function recurse(result) {
  cli.readInput(recurse);
});

screen.render();
