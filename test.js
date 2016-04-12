const blessed = require('blessed')

const screen  = blessed.screen();


const output = blessed.box({
  parent: screen,
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

var layout = blessed.layout({
  parent: output,
  width: '100%',
  height: '100%',
  border: 'line',
  style: {
    bg: 'red',
    border: {
      fg: 'blue'
    }
  }
});

var boxes = []
for (var i = 0; i < 10; i++) {
  boxes[i] = blessed.box({
    parent: layout,
    width: '100%-2',
//    width: i % 2 === 0 ? 10 : 20,
    height: i % 2 === 0 ? 5 : 10,
    border: 'line'
  });
}

setInterval(function()
{
  boxes[1].toggle()
  screen.render()
}, 1000)

screen.render()
