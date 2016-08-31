(function( $ ) {
    $.fn.ferrisWheelSlider = function(option) {
        var setting = $.extend({
            arrows: true,
            autoPlay: true,
            duration: 5000,
            radius: 600,
            btnRorate: 0,
            imageRptate: 0,
        });

        var make = function(){
            
            var div = document.createElement('div');
            div.className = "ferrisWheelSlider " + this.className;

            var ulMenu = document.createElement('ul');
            ulMenu.className = "radialSlider";
            for( var i = 0; i < this.getElementsByClassName("title").length; i++ )
            {
                var li = document.createElement('li');
                li.innerHTML = this.getElementsByClassName("title")[i].innerHTML;
                ulMenu.appendChild(li);
            }

            var ulcontent = document.createElement('ul');
            ulcontent.className = "radialSliderContent";
            for( var i = 0; i < this.getElementsByClassName("title").length; i++ )
            {
                var li = document.createElement('li');
                li.innerHTML = this.getElementsByClassName("content")[i].innerHTML;
                ulcontent.appendChild(li);
            }
            
            this.parentNode.insertBefore(div, this);
            div.appendChild(ulMenu);
            div.appendChild(ulcontent);
            div.appendChild(this);

            this.remove();
        };

        return this.each(make);
    };
})(jQuery);