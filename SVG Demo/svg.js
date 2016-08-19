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



//var cir1 = new Circle(group).color('rgba(0,128,255,1)', 'rgba(0,128,255,0.2)').stytle(5, 'stroke', 'move')
let cir = new Circle(group).color('rgba(0,128,255,1)', 'rgba(0,128,255,0.2)').stytle(2, null, 'move').radius(50).position(100, 100)
let cir2 = new Circle(cir).color('rgba(0,128,255,1)', 'rgba(0,128,255,1)').radius(5).position(cir._radius, 0).stytle(1, null, 'pointer')


let rect = new Rect(group).color('rgba(0,128,255,1)', 'rgba(0,128,255,0.2)').stytle(2, null, 'move').position(200, 200)
let p1 = new Circle(rect).color('rgba(0,128,255,1)', 'rgba(0,128,255,1)').radius(5).position(rect._size[0] / 2, rect._size[1] / 2).stytle(1, null, 'pointer')
let p2 = new Circle(rect).color('rgba(0,128,255,1)', 'rgba(0,128,255,1)').radius(5).position(-rect._size[0] / 2, rect._size[1] / 2).stytle(1, null, 'pointer')
let p3 = new Circle(rect).color('rgba(0,128,255,1)', 'rgba(0,128,255,1)').radius(5).position(rect._size[0] / 2, -rect._size[1] / 2).stytle(1, null, 'pointer')
let p4 = new Circle(rect).color('rgba(0,128,255,1)', 'rgba(0,128,255,1)').radius(5).position(-rect._size[0] / 2, -rect._size[1] / 2).stytle(1, null, 'pointer')





//cir1.shape.fill('img.jpg');
let move = false;
let resize = false;
let lx = 0;
let ly = 0;
SVG.on(window, 'mousemove', function (e) {

    if (move) {
        cir.position(cir._position[0] + e.x - lx, cir._position[1] + e.y - ly)

    }

    if (resize) {
        cir.radius(cir._radius + e.x - lx)
        cir2.position(cir._radius, 0)
    }

    lx = e.x;
    ly = e.y;
});

SVG.on(window, 'mouseup', function (e) {
    move = false;
    resize = false;
});

cir.onMousedown(function (e) {
    move = true;
    lx = e.x;
    ly = e.y;
})

cir2.onMousedown(function (e) {
    lx = e.x;
    resize = true;
})


function () {

}