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



function Color(r, g, b, a) {
    this.rgb = new SVG.Color({ r: r, g: g, b: b });
    this.a = a;
    return this;
}

var c1 = new Color(122, 2, 100, 0.3);
var c2 = new Color(255, 100, 100, 0.2);




//var rect = draw.rect(100, 100)
var cir1 = new Circle(group);
var rec = new Path(group).color(c1, c2).stytle(2)

SVG.on(window, 'mousemove', function(event) {
    rec.position(event.x, event.y);
});

var symbol = draw.symbol()
symbol.rect(100, 100).fill('#f09')

var use  = draw.use(symbol).move(200, 200)

