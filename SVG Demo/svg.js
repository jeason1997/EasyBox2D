'use strict';

var draw = SVG('drawing')

var group = draw.group()

//var rect = group.rect(200, 200).attr({ fill: '#f06' });

//var link = group.link('http://svgjs.com')
//link.show('replace')
//var rect = link.rect(100, 100)

//var polyline = group.polyline([[0,0], [100,50], [50,100]]).fill('none').stroke({ width: 1 })
//polyline.animate(3000).plot([[0,0], [100,50], [50,100], [150,50], [200,50], [250,100], [300,50], [350,50]])
//polyline.move(200, 200)

//var polygon = draw.polygon('0,0 100,50 50,100').fill('none').stroke({ width: 1 })
//polygon.move(300, 0)

//var path = draw.path()
//path.plot('M 100 200 C 200 100 300  0 400 100 C 500 200 600 300 700 200 C 800 100 900 100 900 100')

//draw.rect(100,100).animate(3000).fill('#f03').move(100,100)
//var rect = draw.rect(100, 100)
var rect = new Rect(group)
    .color(null, 'rgba(200, 100, 100, 1)')
    .position(100, 100);

var child = new Rect(rect)
    .color(null, 'rgba(100, 100, 100, 0.5)')
    .position(50, 50)
    .size(40, 80);



//var cir1 = new Circle(group).color('rgba(0,128,255,1)', 'rgba(0,128,255,0.2)').stytle(5, 'stroke', 'move')