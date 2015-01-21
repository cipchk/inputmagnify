/* ========================================================================
 * input放大镜
 * http://www.asdfblog.com/
 * ======================================================================== */
(function ($) {
    'use strict';

    var InputMagnify = function (element, options) {
        this.enabled = null;
        this.init('inputMagnify', element, options);
    }
    InputMagnify.VERSION = '1.0.0';
    InputMagnify.DEFAULTS = {
        animation: true,
        placement: 'top', // 位置
        first_digit: 3, // 首次位数
        interval_digit: 4, // 间隔位数
        works: ' ',
        template: '<div class="label label-success input-magnify"></div></div>',
        selector: false,
        container: false
    };

    InputMagnify.prototype.init = function (type, element, options) {
        var $this = this;
        $this.type = type;
        $this.$element = $(element);
        $this.options = $.extend({}, InputMagnify.DEFAULTS, $this.$element.data(), options);

        this.$element
            .on('keyup', this.options.selector, $.proxy(this.write, this))
            .on('focus', this.options.selector, $.proxy(this.enter, this))
            .on('blur', this.options.selector, $.proxy(this.leave, this));
    }

    InputMagnify.prototype.write = function (obj) {
        return this.getSelf(obj).show();
    }

    InputMagnify.prototype.enter = function (obj) {
        return this.getSelf(obj).show();
    }

    InputMagnify.prototype.leave = function (obj) {
        return this.getSelf(obj).hide();
    }

    InputMagnify.prototype.show = function (obj) {
        var $this = this;
        if ($this.$element.val().length === 0 || this.enabled === false) {
            $this.hide();
            return;
        }

        var inDom = $.contains(document.documentElement, this.$element[0]);
        if (!inDom) return;

        var $tip = $this.tip(),
            placement = $this.options.placement;

        $this.setContent();

        if ($this.options.animation) $tip.addClass('fade');

        $tip
            .detach()
            .css({ top: 0, left: 0, display: 'block' })
            .addClass(placement)
            .data($this.type, $this);

        $this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter($this.$element);

        var pos = $this.getPosition(),
            actualWidth = $tip[0].offsetWidth,
            actualHeight = $tip[0].offsetHeight;

        var calculatedOffset = $this.getCalculatedOffset(placement, pos, actualWidth, actualHeight),
            marginTop = parseInt($tip.css('margin-top'), 10),
            marginLeft = parseInt($tip.css('margin-left'), 10)

        if (isNaN(marginTop)) marginTop = 0;
        if (isNaN(marginLeft)) marginLeft = 0;

        $.offset.setOffset($tip[0], $.extend({
            using: function (props) {
                $tip.css({
                    top: Math.round(props.top),
                    left: Math.round(props.left)
                })
            }
        }, calculatedOffset), 0)

        $tip.addClass('in');

        var complete = function () {
            $this.$element.trigger('shown.' + $this.type);
            $this.hoverState = null;
        }

        $.support.transition && $this.$tip.hasClass('fade') ?
            $tip.one('bsTransitionEnd', complete).emulateTransitionEnd(150) :
            complete();
    }

    InputMagnify.prototype.setContent = function () {
        var $this = this,
            $tip = $this.tip(),
            text = $this.$element.val(),
            textLength = text.length,
            pos = $this.options.first_digit,
            content = [];

        if (pos > 0 && textLength > pos) {
            content.push(text.substring(0, pos));
        } else {
            content.push(text);
        }

        for (; pos < textLength; pos += $this.options.interval_digit) {
            content.push(text.substring(pos, pos + $this.options.interval_digit));
        }
        if (textLength > pos) content.push(text.substring(pos));

        $tip.html(content.join($this.options.works));
    }

    InputMagnify.prototype.tip = function () {
        return (this.$tip = this.$tip || $(this.options.template))
    }

    InputMagnify.prototype.hide = function (e) {
        var $this = this,
            $tip = $this.tip();

        var complete = function () {
            if ($this.hoverState != 'in') $tip.detach()
            $this.$element.trigger('hidden.' + $this.type)
        }

        $tip.removeClass('in');

        $.support.transition && $this.$tip.hasClass('fade') ?
            $tip.one('bsTransitionEnd', complete).emulateTransitionEnd(150) :
            complete();

        return $this;
    }

    InputMagnify.prototype.getPosition = function ($element) {
        $element = $element || this.$element
        var el = $element[0]
        var isBody = el.tagName == 'BODY'
        return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : null, {
            scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop(),
            width: isBody ? $(window).width() : $element.outerWidth(),
            height: isBody ? $(window).height() : $element.outerHeight()
        }, isBody ? { top: 0, left: 0 } : $element.offset())
    }

    InputMagnify.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
        return placement == 'bottom' ? { top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2 } :
               placement == 'top' ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
               placement == 'left' ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
            /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

    }

    InputMagnify.prototype.getSelf = function (obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget).data(this.type);

        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
            $(obj.currentTarget).data(this.type, self);
        }
        return self;
    }

    InputMagnify.prototype.getDelegateOptions = function () {
        var options = {};

        this._options && $.each(this._options, function (key, value) {
            if (InputMagnify.DEFAULTS[key] != value) options[key] = value
        })

        return options
    }

    InputMagnify.prototype.destroy = function () {
        this.hide().$element.removeData(this.type);
    }

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this),
                dataKey = 'inputMagnify',
                data = $this.data(dataKey),
                options = typeof option == 'object' && option;

            if (!data) $this.data(dataKey, (data = new InputMagnify(this, options)));
            if (typeof option == 'string') data[option]();
        });
    }

    var old = $.fn.inputmagnify

    $.fn.inputmagnify = Plugin
    $.fn.inputmagnify.Constructor = InputMagnify


    // NO CONFLICT
    // ===================

    $.fn.inputmagnify.noConflict = function () {
        $.fn.inputmagnify = old
        return this
    }

    $('[data-cipchk="inputmagnify"]').each(function () {
        var $this = $(this)
        Plugin.call($this, $this.data())
    });

})(jQuery);
