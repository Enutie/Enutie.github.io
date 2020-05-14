export const color = d3.scaleOrdinal(d3.schemeCategory10)

export var scheme = d3.scaleLinear().domain([0, 100]).range(['#4484CE', '#94618e'])

export var scheme2 = d3.scaleLinear().domain([0, 100]).range(['#F7DBA7', '#C57B57'])

export var scheme3 = d3.scaleLinear().domain([0, 100]).range(['#0091AD', '#F8FA90'])

export var scheme4 = d3.scaleLinear().domain([0, 100]).range(['#C08497', '#06BA63'])

export var scheme5 = d3.scaleLinear().domain([0, 100]).range(['#00CC66', '#F1C40F'])

var colorSchemes = 
[
  scheme,
  scheme2,
  scheme3,
  scheme4,
  scheme5
]

export function setScheme (lowest, highest) {
  scheme = d3.scaleLinear().domain([lowest, highest]).range(['#4484CE', '#94618e'])
}

export var piyg = d3.scaleOrdinal(d3.schemePastel2)
export function getRandomColorScheme() {
  return colorSchemes[Math.floor(Math.random()*colorSchemes.length)]
}

export var bgColors =
  [
    '#FFFFFF',
    '#F5F5F5',
    '#FFFAFA',
    '#F0FFF0',
    '#F5FFFA',
    '#F0FFFF',
    '#F0F8FF',
    '#F8F8FF',
    '#FFF5EE',
    '#F5F5DC',
    '#FDF5E6',
    '#FFFAF0',
    '#FFFFF0',
    '#FAEBD7',
    '#FAF0E6',
    '#FFF0F5'
  ]
