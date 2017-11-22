
(function (scope, undef) {
    'use strict';

   
    (function (definition) {
        if (typeof module === 'object' && module !== null && module.exports) {
            module.exports = exports = definition(require('jquery'), require('cookies'));
        } else if (typeof define === 'function' && define.amd) {
            define(['jquery', 'cookies'], definition);
        } else {
            definition(scope.jQuery, scope.cookies);
        }
    }(function ($, cookies) {
        var NameTokenIterator,
            nti;

        NameTokenIterator = function () {
            this.rewind();
        };

        NameTokenIterator.prototype = {
            next: function () {
                this.current = this.name_token_attrs.shift();

                return this.current !== undef;
            },
            rewind: function () {
                this.current = undef;

                this.name_token_attrs = [
                    'name',
                    'id'
                ];
            }
        };

        nti = new NameTokenIterator();

        
        $.cookies = cookies;

        
        $.extend($.fn, {
            
            cookify: function (options) {
                return this
                    
                    .filter(':radio, :checkbox').each($.noop)
                    .end()
                    
                    .not(':radio, :checkbox').each(function () {
                        var $this,
                            name_token_value,
                            value;

                        $this = $(this);

                        nti.rewind();

                        while (nti.next()) {
                            name_token_value = $this.attr(nti.current);

                            if (typeof name_token_value === 'string' && name_token_value !== '') {
                                value = $this.is(':input') ? $this.val() : $this.html();

                                cookies.set(
                                    name_token_value,
                                    (typeof value === 'string' && value !== '') ? value : null,
                                    options
                                );

                                break;
                            }
                        }
                    })
                    .end();
            },
            
            cookieFill: function () {
                return this
                   
                    .filter(':radio, :checkbox').each($.noop)
                    .end()
                    
                    .not(':radio, :checkbox').each(function () {
                        var $this,
                            name_token_value,
                            value;

                        $this = $(this);

                        nti.rewind();

                        while (nti.next()) {
                            name_token_value = $this.attr(nti.current);

                            if (typeof name_token_value === 'string' && name_token_value !== '') {
                                value = cookies.get(name_token_value);

                                if (value !== null) {
                                    if ($this.is(':input')) {
                                        $this.val(value);
                                    } else {
                                        $this.html(value);
                                    }
                                }

                                break;
                            }
                        }
                    })
                    .end();
            },
            
            cookieBind: function (options) {
                return this
                    
                    .filter(':input').each(function () {
                        var $this = $(this);

                        $this.cookieFill().on('change', function () {
                            $this.cookify(options);
                        });
                    })
                    .end();
            }
        });
    }));
}(this));