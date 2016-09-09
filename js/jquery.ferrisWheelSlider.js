(function( $ ) {
    $.fn.ferrisWheelSlider = function(options) {
        var settings = {
            arrows: true,
            autoPlay: false,
            duration: 1000,
            speed: 1000,
            radius: 200,
            btnRorate: 0,
            imageRptate: 0,
            offsetX: 0,
            offsetY: 0,
        };

        var methods = {
            marking : function(obj)
            {
                var wrapper = document.createElement('div');
                wrapper.className = "ferrisWheelSlider " + obj.className;

                var ulMenu = document.createElement('ul');
                ulMenu.className = "radialSlider";
                $(ulMenu).css('transition', 'all ' + settings.duration + 'ms' ); 
                
                for( var i = 0; i < obj.getElementsByClassName("title").length; i++ )
                {
                    var li = document.createElement('li');
                    li.innerHTML = obj.getElementsByClassName("title")[i].innerHTML;
                    li.onclick  = this.touch;
                    if(i == 0)
                        li.className += ' active';
                    ulMenu.appendChild(li);
                    $(li).children('img').css('transform', 'rotate(' + settings.imageRptate + 'deg)');
                }

                var ulcontent = document.createElement('ul');
                ulcontent.className = "radialSliderContent";



                for( var i = 0; i < obj.getElementsByClassName("content").length; i++ )
                {
                    var li = document.createElement('li');
                    
                    li.className = 'item';
                    if(i == 0)
                        li.className += ' active';
                    var title = document.createElement('span');
                    title.className = 'titleBlock';

                    var wparContent = document.createElement('div');
                    wparContent.innerHTML = obj.getElementsByClassName("content")[i].innerHTML

                    li.appendChild(title);
                    li.appendChild(wparContent);

                    ulcontent.appendChild(li);
                }
                obj.parentNode.insertBefore(wrapper, obj);
                wrapper.appendChild(ulMenu);
                if(settings.arrows)
                    this.arrows(wrapper);
                wrapper.appendChild(ulcontent);
                obj.remove();
                obj = wrapper;
                return wrapper;
            },
            arrows : function(parent)
            {
                var prev = document.createElement('span');
                prev.className = "prev";
                prev.innerHTML = "prev";
                prev.onclick  = this.move;
                var next = document.createElement('span');
                next.className = "next";
                next.innerHTML = "next";
                next.onclick = this.move;
                parent.appendChild(prev);
                parent.appendChild(next);
            },
            wheel : function(obj)
            {
                $(obj).children('ul.radialSlider').children('li').each(function(index)
                {
                    var theta = property.alpha * index - property.magicNumber;
                    var pointx  =  Math.floor(Math.cos( theta ) * settings.radius );
                    var pointy  = Math.floor(Math.sin( theta ) * settings.radius );

                    $(this).css('left', pointx + settings.offsetX + 'px');
                    $(this).css('top', pointy  + settings.offsetY  + 'px');

                    $(this).css('transform', 'rotate(' + (property.angle*index + settings.btnRorate) + 'deg)');

                    var li = $(obj).children('.radialSliderContent').children("li.item");
                    li.eq( index ).children(".titleBlock").text( $(this).children('b').text() );
                });
            },
            touch : function()
            {
                var curr = $(this).parent().children("li").index($(this));
                var activ = $(this).parent().children("li").index($("li.active"));

                var step = curr - activ;

                $(this).parent().children("li").removeClass("active");
                $(this).addClass("active");


                if(step < 0) 
                    step += property.total;
                
                if( step <= property.mid && step >= 0 )
                {
                    property.deg -= Math.abs(property.angle * step);
                }
                else
                {
                    step -= property.total
                    property.deg += Math.abs(property.angle * step);
                }

                $(this).parent().css('transform', 'rotate(' + property.deg + 'deg)');

                //---------------
                var li = $(this).parent().parent().children('.radialSliderContent').children("li");
                li.removeClass("active");
                li.eq( $(this).parent().children("li").index($(this)) ).addClass( "active" );
                //---------------
                /**/
            },
            next : function(obj)
            {
                var activ = obj.children("li").index($("li.active"));

                obj.children("li").removeClass('active');
                if(activ < property.total-1) 
                    obj.children("li").eq(activ).next().addClass('active');
                else
                    obj.children("li").eq(0).addClass('active');
                //--------------------
                var li = obj.parent().children('.radialSliderContent').children("li");
                li.removeClass("active");
                li.eq( activ++<property.total-1?activ++:0 ).addClass( "active" );
                //--------------------
                obj.css('transform', 'rotate(' + property.deg + 'deg)');
            },
            prev : function(obj)
            {
                var activ = obj.children("li").index($("li.active"));

                obj.children("li").removeClass('active');
                if(activ > 0) 
                    obj.children("li").eq(activ).prev().addClass('active');
                else
                    obj.children("li").eq(property.total-1).addClass('active');
                //--------------------
                var li = obj.parent().children('.radialSliderContent').children("li");
                li.removeClass("active");
                li.eq( activ-->0?activ--:property.total-1 ).addClass( "active" );
                //--------------------
                obj.css('transform', 'rotate(' + property.deg + 'deg)');
            },
            move : function()
            {
                switch  ($(this).attr('class'))
                {
                    case 'next':
                        property.deg -= property.angle;
                        methods.next($(this).parent().children('ul.radialSlider'))
                    break;
                    case 'prev':
                        property.deg += property.angle;
                        methods.prev($(this).parent().children('ul.radialSlider'))
                    break;
                }

            }
        };

        var property = {
            magicNumber: 7.8554, //-90° angle of rotation
            total: 0,
            alpha: 0,
            angle: 0,
            deg: 0,
            mid: 0,
        };

        var make = function(){
            if ( options )
                $.extend( settings, options );

            var wrapper = methods.marking(this);
            property.total = $(wrapper).children('ul.radialSlider').children('li').length;
            property.alpha = Math.PI * 2 / property.total;
            property.angle = 360 / property.total;
            property.mid = Math.floor(property.total/2);

            
            methods.wheel(wrapper);

        };

        return this.each(make);
    };
})(jQuery);