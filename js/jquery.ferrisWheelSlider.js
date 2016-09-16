(function( $ ) {
    $.fn.ferrisWheelSlider = function(options) {
        var settings = {
            arrows: true,
            autoPlay: false,
            duration: 1000,
            speed: 5000,
            radius: 200,
            btnRorate: 0,
            imageRptate: 0,
            offsetX: 0,
            offsetY: 0,
            speedSlide: 500,
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
                var activ = $(this).parent().children("li").index($(this).parent().children("li.active"));

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

                methods.rotate( $(this).parent() );
                methods.changeContent($(this).parent(), $(this).parent().children("li").index($(this)) );
            },
            changeContent : function(obj, index)
            {
                var li = obj.parent().children('.radialSliderContent').children("li");
                li.removeClass("active");
                li.eq( index ).addClass( "active" );
            },
            next : function(obj, activ, li)
            {
                if(property.bodyWidth <= property.widthMobile)
                    methods.animOut(
                        obj, 
                        activ, 
                        -property.widthItem
                    );

                if(activ < property.total-1) 
                    obj.children("li").eq(activ).next().addClass('active');
                else
                    obj.children("li").eq(0).addClass('active');
                
                if(property.bodyWidth <= property.widthMobile)
                {
                    var act = activ < property.total-1 ? activ+1 : 0;
                    methods.animIn(obj, act, 
                        $(window).width() + obj.children('li').eq(act).outerWidth( true ), 
                        $(window).width()/2 - obj.children('li').eq(act).outerWidth( true )/2
                    );
                }

                methods.changeContent(obj, activ++<property.total-1?activ++:0 );
            },
            prev : function(obj, activ, li)
            {
                if(property.bodyWidth <= property.widthMobile)
                    methods.animOut(
                        obj, 
                        activ, 
                        $(window).width() + property.widthItem
                    );

                if(activ > 0) 
                    obj.children("li").eq(activ).prev().addClass('active');
                else
                    obj.children("li").eq(property.total-1).addClass('active');
                
                if(property.bodyWidth <= property.widthMobile)
                {
                    var act = activ > 0 
                                ? activ-1 
                                : property.total-1;
                    methods.animIn(obj, act, -property.widthItem, 
                        $(window).width()/2 - obj.children('li.active').eq(0).outerWidth( true )/2
                    );
                }

                methods.changeContent(obj, activ-->0?activ--:property.total-1 );
            },
            move : function(object, type)
            {
                var type_ = type || $(this).attr('class');
                var obj = type 
                            ? object
                            : $(this).parent().children('ul.radialSlider') ;

                var activ = obj.children("li").index(obj.children("li.active"));

                switch  (type_)
                {
                    case 'next':
                        property.deg -= property.angle;
                        methods.next(obj, activ);
                    break;
                    case 'prev':
                        property.deg += property.angle;
                        methods.prev(obj, activ);
                    break;
                }

                methods.rotate(obj);
            },
            rotate: function(obj)
            {
                obj.css('transform', 'rotate(' + property.deg + 'deg)');
            },
            autoPlay: function(wrapper)
            {
                setInterval(function(){
                    if(property.autoPlay)
                        methods.move($(wrapper).find('ul.radialSlider'), 'next');
                }, settings.speed);
            },
            autoPlaySwitch: function(type)
            {
                switch  (type)
                {
                    case 'over':
                        property.autoPlay = false;
                    break;
                    case 'out':
                        property.autoPlay = true;
                    break;
                }
            },
            animOut: function( obj, index, val )
            {
                obj.children("li").eq(index).animate({
                    left: val,
                }, settings.speedSlide, 
                function(){
                    $(this).removeClass('active'); 
                });
            },
            animIn: function( obj, index, from, to )
            {
                obj.children("li").eq(index).css('left', from +'px').animate({
                    left: to,
                }, settings.speedSlide);
            }
        };

        var property = {
            magicNumber: 7.8554, //-90° angle of rotation
            total: 0,
            alpha: 0,
            angle: 0,
            deg: 0,
            mid: 0,
            autoPlay: false,// TODO : drop
            widthTablet: 960,
            widthMobile: 480,
            bodyWidth: 0,
            widthItem: 0,
        };

        var make = function(){
            if ( options )
                $.extend( settings, options );

            var wrapper = methods.marking(this);

            property.bodyWidth = $(window).width();
            property.total = $(wrapper).children('ul.radialSlider').children('li').length;

            if(property.bodyWidth > property.widthTablet)
            {
                property.alpha = Math.PI * 2 / property.total;
                property.angle = 360 / property.total;
                property.mid = Math.floor(property.total/2);

                methods.wheel(wrapper);

                property.autoPlay = settings.autoPlay;
            } 
            /*else if (property.bodyWidth > property.widthMobile)
            {
                console.log('t ' + property.bodyWidth);
            }*/
            else
            {
                $(wrapper).children('ul.radialSlider').children('li.active').css('left', $(window).width()/2 - ( $('.active').eq(0).outerWidth( true )/2 ) +'px');
                $(wrapper).children('ul.radialSlider').children('li').css('transform', 'rotate(' + (settings.btnRorate) + 'deg)');
                property.widthItem = $(wrapper).children('ul.radialSlider').children('li.active').outerWidth( true );
            }

            

            if(settings.autoPlay)
            {
                methods.autoPlay(wrapper);

                $(wrapper).delegate(wrapper, 'mouseenter', function(e) {
                    methods.autoPlaySwitch('over');
                });

                $(wrapper).delegate(wrapper, 'mouseleave', function(e) {
                    methods.autoPlaySwitch('out');
                });
            }
        };

        return this.each(make);
    };
})(jQuery);