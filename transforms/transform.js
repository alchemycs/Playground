/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function(){

    //Store the drawing context
    var canvas = document.getElementById('homework');
    var context = canvas.getContext('2d');
    var cellsWide = 10;
    var cellsHigh = 10;
    var width = canvas.width;
    var height = canvas.height;
    var spacing = width/cellsWide;

    function drawGrid() {
        context.clearRect(0, 0, width, height);        
        context.save();
            context.beginPath();
            context.strokeStyle = '#000000';
            context.lineWidth = 1;
            context.moveTo(Math.round(width/2), 0);
            context.lineTo(Math.round(width/2), height);
            context.stroke();
            context.moveTo(0, Math.round(height/2));
            context.lineTo(width, Math.round(height/2));
            context.stroke();
        context.restore();
        
        context.save();
            context.strokeStyle = '#009900';
            context.moveTo(0,0);
            context.translate(width/2, height/2);
            context.beginPath();
            context.arc(0, 0, 5, 0, 2*Math.PI, false);
            context.stroke();
        context.restore();
        for (var x = 0; x < 11; x++) {
            for (var y = 0; y < 11; y++) {
                context.save();
                    context.strokeStyle = '#999999';
                    context.translate(x*spacing, y*spacing);
                    context.moveTo(0, 0);
                    context.beginPath();
                    context.arc(0, 0, 2, 0, 2*Math.PI, false);
                    context.stroke();
                context.restore();
            }
        }
    }
    
    function drawRect() {
        context.save();
        context.fillStyle = '#990000';
        context.translate(spacing*2, 0);
        context.moveTo(0, 0);
        context.fillRect(-5*spacing, -5*spacing, 3*spacing, 5*spacing);
        context.restore();
    }
    

    function redraw() {
        var rotation = $('#rotation').val();

        context.save();
            drawGrid();

            context.translate(width/2, height/2);
            context.save();
                context.rotate(rotation/180*Math.PI);
                drawRect();
            context.restore();
        
            context.save();
                context.rotate(Math.PI);
                context.moveTo(0, 0);
                context.beginPath();
                context.strokeStyle = '#000099';
                context.lineWidth = 5;
                context.arc(0, 0, 40, 0, rotation/180*Math.PI);
                context.stroke();
            context.restore();
        
        context.restore();
    }

    function handleResize() {
        console.log('resize');
        var newWidth = $('#homework').width();
        $('#homework').attr('width', newWidth);
        $('#homework').attr('height', newWidth);
        width = canvas.width;
        height = canvas.height;
        spacing = width/cellsWide;
        redraw();
    }
    handleResize();

    $(window).resize(handleResize);


    $('#update').click(function(){
        redraw();
    });
    
    $('#rotation').change(function(){
        redraw();
    }).keyup(function() {
        redraw();
    });
    
    
    
    redraw();

});