/**
 * ESUI (Enterprise Simple UI)
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @ignore
 * @file 按钮
 * @author dbear, otakustay
 */
define(
    function (require) {
        var u = require('underscore');
        var paint = require('./painters');
        var Control = require('./Control');
        var $ = require('jquery');

        var exports = {
            /**
             * 按钮控件
             *
             * @extends Control
             * @constructor
             */
            constructor: function () {
                this.$super(arguments);
            },

            /**
             * 控件类型，始终为`"Button"`
             *
             * @type {string}
             * @readonly
             * @override
             */
            type: 'Button',

            /**
             * 初始化参数
             *
             * @param {Object} [options] 构造函数传入的参数
             * @protected
             * @override
             */
            initOptions: function (options) {
                /**
                 * 默认选项配置
                 */
                var properties = {
                    content: '', // 按钮的显示文字
                    disabled: false // 控件是否禁用
                };
                u.extend(properties, options);

                if (!properties.content) {
                    properties.content = this.main.innerHTML;
                }

                this.setProperties(properties);
            },

            /**
             * 创建控件主元素，默认使用`<button type="button">`元素
             *
             * 如果需要使用其它类型作为主元素，
             * 需要在始终化时提供{@link Control#main}属性
             *
             * @return {HTMLElement}
             * @protected
             * @override
             */
            createMain: function () {
                return $('<button type="button"></button>')[0];
            },

            /**
             * 初始化事件交互
             *
             * @protected
             * @override
             */
            initEvents: function () {
                /**
                 * @event click
                 *
                 * 点击时触发
                 */
                this.helper.delegateDOMEvent(this.main, 'click');
            },

            /**
             * 重新渲染
             *
             * @method
             * @protected
             * @override
             */
            repaint: paint.createRepaint(
                Control.prototype.repaint,
                /**
                 * @property {number} width
                 *
                 * 宽度
                 */
                paint.style('width'),
                {
                    /**
                     * @property {number} height
                     *
                     * 高度
                     */
                    name: 'height',
                    paint: function (button, value) {
                        if (!value) {
                            return;
                        }
                        var $main = $(button.main);
                        $main.css(
                            {
                                height: value,
                                lineHeight: value + 'px'
                            }
                        );

                        var offsetHeight = $main.height();
                        // 说明是border-box模式
                        if (offsetHeight === value) {
                            var newHeight = value
                                + parseInt($main.css('borderTopWidth'), 10)
                                + parseInt($main.css('borderBottomWidth'), 10);
                            $main.css('height', newHeight);
                        }
                    }
                },

                /**
                 * @property {string} [content=""]
                 *
                 * 按钮的文本内容，不作HTML转义
                 */
                paint.html('content'),
                {
                    name: 'disabled',
                    paint: function (button, disabled) {
                        var $ele = $(button.main);
                        if ($ele.is('button,input')) {
                            $ele.attr('disabled', !!disabled);
                        }
                    }
                }
            ),

            /**
             * 设置内容
             *
             * @param {string} content 要设置的内容
             */
            setContent: function (content) {
                this.setProperties({'content': content});
            }
        };

        var Button = require('eoo').create(Control, exports);
        require('./main').register(Button);

        return Button;
    }
);
