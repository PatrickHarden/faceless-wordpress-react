// Packages
import React, {PropTypes, Component} from 'react';
import { ReactBootstrap, Grid, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import axios from 'axios';
import $ from 'jquery';

let Entities = require('html-entities').AllHtmlEntities;
let entities = new Entities();
let moment = require('moment');
let momentRange = require('moment-range/dist/moment-range.js');
moment = momentRange.extendMoment(moment);

// Components
import Helmet from 'react-helmet';
import InteriorHeader from '../components/InteriorHeader';
import HolidayHours from '../components/HolidayHours';
import HolidayStoreHours from '../components/HolidayStoreList';
import HolidayEventsList from '../components/HolidayEventsList';
import Signup from '../components/Signup';
import Loader from '../components/Loader';

// Endpoints
const SiteURL = window.location.protocol + '//' + document.location.hostname;
const Pages = SiteURL + '/wp-json/wp/v2/pages';
const PropertyOptions = SiteURL + '/wp-json/acf/v3/options/property_options';

/*
	Base.js, version 1.1a
	Copyright 2006-2010, Dean Edwards
	License: http://www.opensource.org/licenses/mit-license.php
*/

var Base = function() {
    // dummy
};

Base.extend = function(_instance, _static) { // subclass

    "use strict";

    var extend = Base.prototype.extend;

    // build the prototype
    Base._prototyping = true;

    var proto = new this();

    extend.call(proto, _instance);

    proto.base = function() {
        // call this method from any other method to invoke that method's ancestor
    };

    delete Base._prototyping;

    // create the wrapper for the constructor function
    //var constructor = proto.constructor.valueOf(); //-dean
    var constructor = proto.constructor;
    var klass = proto.constructor = function() {
        if (!Base._prototyping) {
            if (this._constructing || this.constructor == klass) { // instantiation
                this._constructing = true;
                constructor.apply(this, arguments);
                delete this._constructing;
            } else if (arguments[0] !== null) { // casting
                return (arguments[0].extend || extend).call(arguments[0], proto);
            }
        }
    };

    // build the class interface
    klass.ancestor = this;
    klass.extend = this.extend;
    klass.forEach = this.forEach;
    klass.implement = this.implement;
    klass.prototype = proto;
    klass.toString = this.toString;
    klass.valueOf = function(type) {
        //return (type == "object") ? klass : constructor; //-dean
        return (type == "object") ? klass : constructor.valueOf();
    };
    extend.call(klass, _static);
    // class initialisation
    if (typeof klass.init == "function") klass.init();
    return klass;
};

Base.prototype = {
    extend: function(source, value) {
        if (arguments.length > 1) { // extending with a name/value pair
            var ancestor = this[source];
            if (ancestor && (typeof value == "function") && // overriding a method?
                // the valueOf() comparison is to avoid circular references
                (!ancestor.valueOf || ancestor.valueOf() != value.valueOf()) &&
                /\bbase\b/.test(value)) {
                // get the underlying method
                var method = value.valueOf();
                // override
                value = function() {
                    var previous = this.base || Base.prototype.base;
                    this.base = ancestor;
                    var returnValue = method.apply(this, arguments);
                    this.base = previous;
                    return returnValue;
                };
                // point to the underlying method
                value.valueOf = function(type) {
                    return (type == "object") ? value : method;
                };
                value.toString = Base.toString;
            }
            this[source] = value;
        } else if (source) { // extending with an object literal
            var extend = Base.prototype.extend;
            // if this object has a customised extend method then use it
            if (!Base._prototyping && typeof this != "function") {
                extend = this.extend || extend;
            }
            var proto = {toSource: null};
            // do the "toString" and other methods manually
            var hidden = ["constructor", "toString", "valueOf"];
            // if we are prototyping then include the constructor
            var i = Base._prototyping ? 0 : 1;
            while (key = hidden[i++]) {
                if (source[key] != proto[key]) {
                    extend.call(this, key, source[key]);

                }
            }
            // copy each of the source object's properties to this object
            for (var key in source) {
                if (!proto[key]) extend.call(this, key, source[key]);
            }
        }
        return this;
    }
};

// initialise
Base = Base.extend({
    constructor: function() {
        this.extend(arguments[0]);
    }
}, {
    ancestor: Object,
    version: "1.1",

    forEach: function(object, block, context) {
        for (var key in object) {
            if (this.prototype[key] === undefined) {
                block.call(context, object[key], key, object);
            }
        }
    },

    implement: function() {
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] == "function") {
                // if it's a function, call it
                arguments[i](this.prototype);
            } else {
                // add the interface using the extend method
                this.prototype.extend(arguments[i]);
            }
        }
        return this;
    },

    toString: function() {
        return String(this.valueOf());
    }
});
/*jshint smarttabs:true */

var FlipClock;

/**
 * FlipClock.js
 *
 * @author     Justin Kimbrell
 * @copyright  2013 - Objective HTML, LLC
 * @licesnse   http://www.opensource.org/licenses/mit-license.php
 */


    FlipClock = function(obj, digit, options) {
        if(digit instanceof Object && digit instanceof Date === false) {
            options = digit;
            digit = 0;
        }

        return new FlipClock.Factory(obj, digit, options);
    };

    /**
     * The global FlipClock.Lang object
     */

    FlipClock.Lang = {};

    /**
     * The Base FlipClock class is used to extend all other FlipFlock
     * classes. It handles the callbacks and the basic setters/getters
     *
     * @param 	object  An object of the default properties
     * @param 	object  An object of properties to override the default
     */

    FlipClock.Base = Base.extend({

        /**
         * Build Date
         */

        buildDate: '2018-12-25',

        /**
         * Version
         */

        version: '0.7.7',

        /**
         * Sets the default options
         *
         * @param	object 	The default options
         * @param	object 	The override options
         */

        constructor: function(_default, options) {
            if(typeof _default !== "object") {
                _default = {};
            }
            if(typeof options !== "object") {
                options = {};
            }
            this.setOptions($.extend(true, {}, _default, options));
        },

        /**
         * Delegates the callback to the defined method
         *
         * @param	object 	The default options
         * @param	object 	The override options
         */

        callback: function(method) {
            if(typeof method === "function") {
                var args = [];

                for(var x = 1; x <= arguments.length; x++) {
                    if(arguments[x]) {
                        args.push(arguments[x]);
                    }
                }

                method.apply(this, args);
            }
        },

        /**
         * Log a string into the console if it exists
         *
         * @param 	string 	The name of the option
         * @return	mixed
         */

        log: function(str) {
            if(window.console && console.log) {
                console.log(str);
            }
        },

        /**
         * Get an single option value. Returns false if option does not exist
         *
         * @param 	string 	The name of the option
         * @return	mixed
         */

        getOption: function(index) {
            if(this[index]) {
                return this[index];
            }
            return false;
        },

        /**
         * Get all options
         *
         * @return	bool
         */

        getOptions: function() {
            return this;
        },

        /**
         * Set a single option value
         *
         * @param 	string 	The name of the option
         * @param 	mixed 	The value of the option
         */

        setOption: function(index, value) {
            this[index] = value;
        },

        /**
         * Set a multiple options by passing a JSON object
         *
         * @param 	object 	The object with the options
         * @param 	mixed 	The value of the option
         */

        setOptions: function(options) {
            for(var key in options) {
                if(typeof options[key] !== "undefined") {
                    this.setOption(key, options[key]);
                }
            }
        }

    });

/*jshint smarttabs:true */

/**
 * FlipClock.js
 *
 * @author     Justin Kimbrell
 * @copyright  2013 - Objective HTML, LLC
 * @licesnse   http://www.opensource.org/licenses/mit-license.php
 */


    FlipClock.Face = FlipClock.Base.extend({

        /**
         * Sets whether or not the clock should start upon instantiation
         */

        autoStart: true,

        /**
         * An array of jQuery objects used for the dividers (the colons)
         */

        dividers: [],

        /**
         * An array of FlipClock.List objects
         */

        factory: false,

        /**
         * An array of FlipClock.List objects
         */

        lists: [],

        /**
         * Constructor
         *
         * @param 	object  The parent FlipClock.Factory object
         * @param 	object  An object of properties to override the default
         */

        constructor: function(factory, options) {
            this.dividers = [];
            this.lists = [];
            this.base(options);
            this.factory = factory;
        },

        /**
         * Build the clock face
         */

        build: function() {
            if(this.autoStart) {
                this.start();
            }
        },

        /**
         * Creates a jQuery object used for the digit divider
         *
         * @param	mixed 	The divider label text
         * @param	mixed	Set true to exclude the dots in the divider.
         *					If not set, is false.
         */

        createDivider: function(label, css, excludeDots) {
            if(typeof css == "boolean" || !css) {
                excludeDots = css;
                css = label;
            }

            var dots = [
                '<span class="'+this.factory.classes.dot+' top"></span>',
                '<span class="'+this.factory.classes.dot+' bottom"></span>'
            ].join('');

            if(excludeDots) {
                dots = '';
            }

            label = this.factory.localize(label);

            var html = [
                '<span class="'+this.factory.classes.divider+' '+(css ? css : '').toLowerCase()+'">',
                '<span class="'+this.factory.classes.label+'">'+(label ? label : '')+'</span>',
                dots,
                '</span>'
            ];

            var $html = $(html.join(''));

            this.dividers.push($html);

            return $html;
        },

        /**
         * Creates a FlipClock.List object and appends it to the DOM
         *
         * @param	mixed 	The digit to select in the list
         * @param	object  An object to override the default properties
         */

        createList: function(digit, options) {
            if(typeof digit === "object") {
                options = digit;
                digit = 0;
            }

            var obj = new FlipClock.List(this.factory, digit, options);

            this.lists.push(obj);

            return obj;
        },

        /**
         * Triggers when the clock is reset
         */

        reset: function() {
            this.factory.time = new FlipClock.Time(
                this.factory,
                this.factory.original ? Math.round(this.factory.original) : 0,
                {
                    minimumDigits: this.factory.minimumDigits
                }
            );

            this.flip(this.factory.original, false);
        },

        /**
         * Append a newly created list to the clock
         */

        appendDigitToClock: function(obj) {
            obj.$el.append(false);
        },

        /**
         * Add a digit to the clock face
         */

        addDigit: function(digit) {
            var obj = this.createList(digit, {
                classes: {
                    active: this.factory.classes.active,
                    before: this.factory.classes.before,
                    flip: this.factory.classes.flip
                }
            });

            this.appendDigitToClock(obj);
        },

        /**
         * Triggers when the clock is started
         */

        start: function() {},

        /**
         * Triggers when the time on the clock stops
         */

        stop: function() {},

        /**
         * Auto increments/decrements the value of the clock face
         */

        autoIncrement: function() {
            if(!this.factory.countdown) {
                this.increment();
            }
            else {
                this.decrement();
            }
        },

        /**
         * Increments the value of the clock face
         */

        increment: function() {
            this.factory.time.addSecond();
        },

        /**
         * Decrements the value of the clock face
         */

        decrement: function() {
            if(this.factory.time.getTimeSeconds() == 0) {
                this.factory.stop()
            }
            else {
                this.factory.time.subSecond();
            }
        },

        /**
         * Triggers when the numbers on the clock flip
         */

        flip: function(time, doNotAddPlayClass) {
            var t = this;

            $.each(time, function(i, digit) {
                var list = t.lists[i];

                if(list) {
                    if(!doNotAddPlayClass && digit != list.digit) {
                        list.play();
                    }

                    list.select(digit);
                }
                else {
                    t.addDigit(digit);
                }
            });
        }

    });


/*jshint smarttabs:true */

/**
 * FlipClock.js
 *
 * @author     Justin Kimbrell
 * @copyright  2013 - Objective HTML, LLC
 * @licesnse   http://www.opensource.org/licenses/mit-license.php
 */


    FlipClock.Factory = FlipClock.Base.extend({

        /**
         * The clock's animation rate.
         *
         * Note, currently this property doesn't do anything.
         * This property is here to be used in the future to
         * programmaticaly set the clock's animation speed
         */

        animationRate: 1000,

        /**
         * Auto start the clock on page load (True|False)
         */

        autoStart: true,

        /**
         * The callback methods
         */

        callbacks: {
            destroy: false,
            create: false,
            init: false,
            interval: false,
            start: false,
            stop: false,
            reset: false
        },

        /**
         * The CSS classes
         */

        classes: {
            active: 'flip-clock-active',
            before: 'flip-clock-before',
            divider: 'flip-clock-divider',
            dot: 'flip-clock-dot',
            label: 'flip-clock-label',
            flip: 'flip',
            play: 'play',
            wrapper: 'flip-clock-wrapper'
        },

        /**
         * The name of the clock face class in use
         */

        clockFace: 'HourlyCounter',

        /**
         * The name of the clock face class in use
         */

        countdown: false,

        /**
         * The name of the default clock face class to use if the defined
         * clockFace variable is not a valid FlipClock.Face object
         */

        defaultClockFace: 'HourlyCounter',

        /**
         * The default language
         */

        defaultLanguage: 'english',

        /**
         * The jQuery object
         */

        $el: false,

        /**
         * The FlipClock.Face object
         */

        face: true,

        /**
         * The language object after it has been loaded
         */

        lang: false,

        /**
         * The language being used to display labels (string)
         */

        language: 'english',

        /**
         * The minimum digits the clock must have
         */

        minimumDigits: 0,

        /**
         * The original starting value of the clock. Used for the reset method.
         */

        original: false,

        /**
         * Is the clock running? (True|False)
         */

        running: false,

        /**
         * The FlipClock.Time object
         */

        time: false,

        /**
         * The FlipClock.Timer object
         */

        timer: false,

        /**
         * The jQuery object (depcrecated)
         */

        $wrapper: false,

        /**
         * Constructor
         *
         * @param   object  The wrapping jQuery object
         * @param	object  Number of seconds used to start the clock
         * @param	object 	An object override options
         */

        constructor: function(obj, digit, options) {

            if(!options) {
                options = {};
            }

            this.lists = [];
            this.running = false;
            this.base(options);

            this.$el = $(obj).addClass(this.classes.wrapper);

            // Depcrated support of the $wrapper property.
            this.$wrapper = this.$el;

            this.original = (digit instanceof Date) ? digit : (digit ? Math.round(digit) : 0);

            this.time = new FlipClock.Time(this, this.original, {
                minimumDigits: this.minimumDigits,
                animationRate: this.animationRate
            });

            this.timer = new FlipClock.Timer(this, options);

            this.loadLanguage(this.language);

            this.loadClockFace(this.clockFace, options);

            if(this.autoStart) {
                this.start();
            }

        },

        /**
         * Load the FlipClock.Face object
         *
         * @param	object  The name of the FlickClock.Face class
         * @param	object 	An object override options
         */

        loadClockFace: function(name, options) {
            var face, suffix = 'Face', hasStopped = false;

            name = name.ucfirst()+suffix;

            if(this.face.stop) {
                this.stop();
                hasStopped = true;
            }

            this.$el.html('');

            this.time.minimumDigits = this.minimumDigits;

            if(FlipClock[name]) {
                face = new FlipClock[name](this, options);
            }
            else {
                face = new FlipClock[this.defaultClockFace+suffix](this, options);
            }

            face.build();

            this.face = face

            if(hasStopped) {
                this.start();
            }

            return this.face;
        },

        /**
         * Load the FlipClock.Lang object
         *
         * @param	object  The name of the language to load
         */

        loadLanguage: function(name) {
            var lang;

            if(FlipClock.Lang[name.ucfirst()]) {
                lang = FlipClock.Lang[name.ucfirst()];
            }
            else if(FlipClock.Lang[name]) {
                lang = FlipClock.Lang[name];
            }
            else {
                lang = FlipClock.Lang[this.defaultLanguage];
            }

            return this.lang = lang;
        },

        /**
         * Localize strings into various languages
         *
         * @param	string  The index of the localized string
         * @param	object  Optionally pass a lang object
         */

        localize: function(index, obj) {
            var lang = this.lang;

            if(!index) {
                return null;
            }

            var lindex = index.toLowerCase();

            if(typeof obj == "object") {
                lang = obj;
            }

            if(lang && lang[lindex]) {
                return lang[lindex];
            }

            return index;
        },


        /**
         * Starts the clock
         */

        start: function(callback) {
            var t = this;

            if(!t.running && (!t.countdown || t.countdown && t.time.time > 0)) {
                t.face.start(t.time);
                t.timer.start(function() {
                    t.flip();

                    if(typeof callback === "function") {
                        callback();
                    }
                });
            }
            else {
                t.log('Trying to start timer when countdown already at 0');
            }
        },

        /**
         * Stops the clock
         */

        stop: function(callback) {
            this.face.stop();
            this.timer.stop(callback);

            for(var x in this.lists) {
                if (this.lists.hasOwnProperty(x)) {
                    this.lists[x].stop();
                }
            }
        },

        /**
         * Reset the clock
         */

        reset: function(callback) {
            this.timer.reset(callback);
            this.face.reset();
        },

        /**
         * Sets the clock time
         */

        setTime: function(time) {
            this.time.time = time;
            this.flip(true);
        },

        /**
         * Get the clock time
         *
         * @return  object  Returns a FlipClock.Time object
         */

        getTime: function(time) {
            return this.time;
        },

        /**
         * Changes the increment of time to up or down (add/sub)
         */

        setCountdown: function(value) {
            var running = this.running;

            this.countdown = value ? true : false;

            if(running) {
                this.stop();
                this.start();
            }
        },

        /**
         * Flip the digits on the clock
         *
         * @param  array  An array of digits
         */
        flip: function(doNotAddPlayClass) {
            this.face.flip(false, doNotAddPlayClass);
        }

    });

/*jshint smarttabs:true */

/**
 * FlipClock.js
 *
 * @author     Justin Kimbrell
 * @copyright  2013 - Objective HTML, LLC
 * @licesnse   http://www.opensource.org/licenses/mit-license.php
 */


    FlipClock.List = FlipClock.Base.extend({

        /**
         * The digit (0-9)
         */

        digit: 0,

        /**
         * The CSS classes
         */

        classes: {
            active: 'flip-clock-active',
            before: 'flip-clock-before',
            flip: 'flip'
        },

        /**
         * The parent FlipClock.Factory object
         */

        factory: false,

        /**
         * The jQuery object
         */

        $el: false,

        /**
         * The jQuery object (deprecated)
         */

        $obj: false,

        /**
         * The items in the list
         */

        items: [],

        /**
         * The last digit
         */

        lastDigit: 0,

        /**
         * Constructor
         *
         * @param  object  A FlipClock.Factory object
         * @param  int     An integer use to select the correct digit
         * @param  object  An object to override the default properties
         */

        constructor: function(factory, digit, options) {
            this.factory = factory;
            this.digit = digit;
            this.lastDigit = digit;
            this.$el = this.createList();

            // Depcrated support of the $obj property.
            this.$obj = this.$el;

            if(digit > 0) {
                this.select(digit);
            }

            this.factory.$el.append(this.$el);
        },

        /**
         * Select the digit in the list
         *
         * @param  int  A digit 0-9
         */

        select: function(digit) {
            if(typeof digit === "undefined") {
                digit = this.digit;
            }
            else {
                this.digit = digit;
            }

            if(this.digit != this.lastDigit) {
                var $delete = this.$el.find('.'+this.classes.before).removeClass(this.classes.before);

                this.$el.find('.'+this.classes.active).removeClass(this.classes.active)
                    .addClass(this.classes.before);

                this.appendListItem(this.classes.active, this.digit);

                $delete.remove();

                this.lastDigit = this.digit;
            }
        },

        /**
         * Adds the play class to the DOM object
         */

        play: function() {
            this.$el.addClass(this.factory.classes.play);
        },

        /**
         * Removes the play class to the DOM object
         */

        stop: function() {
            var t = this;

            setTimeout(function() {
                t.$el.removeClass(t.factory.classes.play);
            }, this.factory.timer.interval);
        },

        /**
         * Creates the list item HTML and returns as a string
         */

        createListItem: function(css, value) {
            return [
                '<li class="'+(css ? css : '')+'">',
                '<a href="#">',
                '<div class="up">',
                '<div class="shadow"></div>',
                '<div class="inn">'+(value ? value : '')+'</div>',
                '</div>',
                '<div class="down">',
                '<div class="shadow"></div>',
                '<div class="inn">'+(value ? value : '')+'</div>',
                '</div>',
                '</a>',
                '</li>'
            ].join('');
        },

        /**
         * Append the list item to the parent DOM node
         */

        appendListItem: function(css, value) {
            var html = this.createListItem(css, value);

            this.$el.append(html);
        },

        /**
         * Create the list of digits and appends it to the DOM object
         */

        createList: function() {

            var lastDigit = this.getPrevDigit() ? this.getPrevDigit() : this.digit;

            var html = $([
                '<ul class="'+this.classes.flip+' '+(this.factory.running ? this.factory.classes.play : '')+'">',
                this.createListItem(this.classes.before, lastDigit),
                this.createListItem(this.classes.active, this.digit),
                '</ul>'
            ].join(''));

            return html;
        },

        getNextDigit: function() {
            return this.digit == 9 ? 0 : this.digit + 1;
        },

        getPrevDigit: function() {
            return this.digit == 0 ? 9 : this.digit - 1;
        }

    });


/*jshint smarttabs:true */

/**
 * FlipClock.js
 *
 * @author     Justin Kimbrell
 * @copyright  2013 - Objective HTML, LLC
 * @licesnse   http://www.opensource.org/licenses/mit-license.php
 */

    String.prototype.ucfirst = function() {
        return this.substr(0, 1).toUpperCase() + this.substr(1);
    };

    /**
     * jQuery helper method
     *
     * @param  int     An integer used to start the clock (no. seconds)
     * @param  object  An object of properties to override the default
     */

    $.fn.FlipClock = function(digit, options) {
        return new FlipClock($(this), digit, options);
    };

    /**
     * jQuery helper method
     *
     * @param  int     An integer used to start the clock (no. seconds)
     * @param  object  An object of properties to override the default
     */

    $.fn.flipClock = function(digit, options) {
        return $.fn.FlipClock(digit, options);
    };


/*jshint smarttabs:true */

/**
 * FlipClock.js
 *
 * @author     Justin Kimbrell
 * @copyright  2013 - Objective HTML, LLC
 * @licesnse   http://www.opensource.org/licenses/mit-license.php
 */

    FlipClock.Time = FlipClock.Base.extend({

        /**
         * The time (in seconds) or a date object
         */

        time: 0,

        /**
         * The parent FlipClock.Factory object
         */

        factory: false,

        /**
         * The minimum number of digits the clock face must have
         */

        minimumDigits: 0,

        /**
         * Constructor
         *
         * @param  object  A FlipClock.Factory object
         * @param  int     An integer use to select the correct digit
         * @param  object  An object to override the default properties
         */

        constructor: function(factory, time, options) {
            if(typeof options != "object") {
                options = {};
            }

            if(!options.minimumDigits) {
                options.minimumDigits = factory.minimumDigits;
            }

            this.base(options);
            this.factory = factory;

            if(time) {
                this.time = time;
            }
        },

        /**
         * Convert a string or integer to an array of digits
         *
         * @param   mixed  String or Integer of digits
         * @return  array  An array of digits
         */

        convertDigitsToArray: function(str) {
            var data = [];

            str = str.toString();

            for(var x = 0;x < str.length; x++) {
                if(str[x].match(/^\d*$/g)) {
                    data.push(str[x]);
                }
            }

            return data;
        },

        /**
         * Get a specific digit from the time integer
         *
         * @param   int    The specific digit to select from the time
         * @return  mixed  Returns FALSE if no digit is found, otherwise
         *				   the method returns the defined digit
         */

        digit: function(i) {
            var timeStr = this.toString();
            var length  = timeStr.length;

            if(timeStr[length - i])	 {
                return timeStr[length - i];
            }

            return false;
        },

        /**
         * Formats any array of digits into a valid array of digits
         *
         * @param   mixed  An array of digits
         * @return  array  An array of digits
         */

        digitize: function(obj) {
            var data = [];

            $.each(obj, function(i, value) {
                value = value.toString();

                if(value.length == 1) {
                    value = '0'+value;
                }

                for(var x = 0; x < value.length; x++) {
                    data.push(value.charAt(x));
                }
            });

            if(data.length > this.minimumDigits) {
                this.minimumDigits = data.length;
            }

            if(this.minimumDigits > data.length) {
                for(var x = data.length; x < this.minimumDigits; x++) {
                    data.unshift('0');
                }
            }

            return data;
        },

        /**
         * Gets a new Date object for the current time
         *
         * @return  array  Returns a Date object
         */

        getDateObject: function() {
            if(this.time instanceof Date) {
                return this.time;
            }

            return new Date((new Date()).getTime() + this.getTimeSeconds() * 1000);
        },

        /**
         * Gets a digitized daily counter
         *
         * @return  object  Returns a digitized object
         */

        getDayCounter: function(includeSeconds) {
            var digits = [
                this.getDays(),
                this.getHours(true),
                this.getMinutes(true)
            ];

            if(includeSeconds) {
                digits.push(this.getSeconds(true));
            }

            return this.digitize(digits);
        },

        /**
         * Gets number of days
         *
         * @param   bool  Should perform a modulus? If not sent, then no.
         * @return  int   Retuns a floored integer
         */

        getDays: function(mod) {
            var days = this.getTimeSeconds() / 60 / 60 / 24;

            if(mod) {
                days = days % 7;
            }

            return Math.floor(days);
        },

        /**
         * Gets an hourly breakdown
         *
         * @return  object  Returns a digitized object
         */

        getHourCounter: function() {
            var obj = this.digitize([
                this.getHours(),
                this.getMinutes(true),
                this.getSeconds(true)
            ]);

            return obj;
        },

        /**
         * Gets an hourly breakdown
         *
         * @return  object  Returns a digitized object
         */

        getHourly: function() {
            return this.getHourCounter();
        },

        /**
         * Gets number of hours
         *
         * @param   bool  Should perform a modulus? If not sent, then no.
         * @return  int   Retuns a floored integer
         */

        getHours: function(mod) {
            var hours = this.getTimeSeconds() / 60 / 60;

            if(mod) {
                hours = hours % 24;
            }

            return Math.floor(hours);
        },

        /**
         * Gets the twenty-four hour time
         *
         * @return  object  returns a digitized object
         */

        getMilitaryTime: function(date, showSeconds) {
            if(typeof showSeconds === "undefined") {
                showSeconds = true;
            }

            if(!date) {
                date = this.getDateObject();
            }

            var data  = [
                date.getHours(),
                date.getMinutes()
            ];

            if(showSeconds === true) {
                data.push(date.getSeconds());
            }

            return this.digitize(data);
        },

        /**
         * Gets number of minutes
         *
         * @param   bool  Should perform a modulus? If not sent, then no.
         * @return  int   Retuns a floored integer
         */

        getMinutes: function(mod) {
            var minutes = this.getTimeSeconds() / 60;

            if(mod) {
                minutes = minutes % 60;
            }

            return Math.floor(minutes);
        },

        /**
         * Gets a minute breakdown
         */

        getMinuteCounter: function() {
            var obj = this.digitize([
                this.getMinutes(),
                this.getSeconds(true)
            ]);

            return obj;
        },

        /**
         * Gets time count in seconds regardless of if targetting date or not.
         *
         * @return  int   Returns a floored integer
         */

        getTimeSeconds: function(date) {
            if(!date) {
                date = new Date();
            }

            if (this.time instanceof Date) {
                if (this.factory.countdown) {
                    return Math.max(this.time.getTime()/1000 - date.getTime()/1000,0);
                } else {
                    return date.getTime()/1000 - this.time.getTime()/1000 ;
                }
            } else {
                return this.time;
            }
        },

        /**
         * Gets the current twelve hour time
         *
         * @return  object  Returns a digitized object
         */

        getTime: function(date, showSeconds) {
            if(typeof showSeconds === "undefined") {
                showSeconds = true;
            }

            if(!date) {
                date = this.getDateObject();
            }


            var hours = date.getHours();
            var merid = hours > 12 ? 'PM' : 'AM';
            var data   = [
                hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours),
                date.getMinutes()
            ];

            if(showSeconds === true) {
                data.push(date.getSeconds());
            }

            return this.digitize(data);
        },

        /**
         * Gets number of seconds
         *
         * @param   bool  Should perform a modulus? If not sent, then no.
         * @return  int   Retuns a ceiled integer
         */

        getSeconds: function(mod) {
            var seconds = this.getTimeSeconds();

            if(mod) {
                if(seconds == 60) {
                    seconds = 0;
                }
                else {
                    seconds = seconds % 60;
                }
            }

            return Math.ceil(seconds);
        },

        /**
         * Gets number of weeks
         *
         * @param   bool  Should perform a modulus? If not sent, then no.
         * @return  int   Retuns a floored integer
         */

        getWeeks: function(mod) {
            var weeks = this.getTimeSeconds() / 60 / 60 / 24 / 7;

            if(mod) {
                weeks = weeks % 52;
            }

            return Math.floor(weeks);
        },

        /**
         * Removes a specific number of leading zeros from the array.
         * This method prevents you from removing too many digits, even
         * if you try.
         *
         * @param   int    Total number of digits to remove
         * @return  array  An array of digits
         */

        removeLeadingZeros: function(totalDigits, digits) {
            var total    = 0;
            var newArray = [];

            $.each(digits, function(i, digit) {
                if(i < totalDigits) {
                    total += parseInt(digits[i], 10);
                }
                else {
                    newArray.push(digits[i]);
                }
            });

            if(total === 0) {
                return newArray;
            }

            return digits;
        },

        /**
         * Adds X second to the current time
         */

        addSeconds: function(x) {
            if(this.time instanceof Date) {
                this.time.setSeconds(this.time.getSeconds() + x);
            }
            else {
                this.time += x;
            }
        },

        /**
         * Adds 1 second to the current time
         */

        addSecond: function() {
            this.addSeconds(1);
        },

        /**
         * Substracts X seconds from the current time
         */

        subSeconds: function(x) {
            if(this.time instanceof Date) {
                this.time.setSeconds(this.time.getSeconds() - x);
            }
            else {
                this.time -= x;
            }
        },

        /**
         * Substracts 1 second from the current time
         */

        subSecond: function() {
            this.subSeconds(1);
        },

        /**
         * Converts the object to a human readable string
         */

        toString: function() {
            return this.getTimeSeconds().toString();
        }

        /*
        getYears: function() {
            return Math.floor(this.time / 60 / 60 / 24 / 7 / 52);
        },

        getDecades: function() {
            return Math.floor(this.getWeeks() / 10);
        }*/
    });


/*jshint smarttabs:true */

/**
 * FlipClock.js
 *
 * @author     Justin Kimbrell
 * @copyright  2013 - Objective HTML, LLC
 * @licesnse   http://www.opensource.org/licenses/mit-license.php
 */

    FlipClock.Timer = FlipClock.Base.extend({

        /**
         * Callbacks
         */

        callbacks: {
            destroy: false,
            create: false,
            init: false,
            interval: false,
            start: false,
            stop: false,
            reset: false
        },

        /**
         * FlipClock timer count (how many intervals have passed)
         */

        count: 0,

        /**
         * The parent FlipClock.Factory object
         */

        factory: false,

        /**
         * Timer interval (1 second by default)
         */

        interval: 1000,

        /**
         * The rate of the animation in milliseconds (not currently in use)
         */

        animationRate: 1000,

        /**
         * Constructor
         *
         * @return	void
         */

        constructor: function(factory, options) {
            this.base(options);
            this.factory = factory;
            this.callback(this.callbacks.init);
            this.callback(this.callbacks.create);
        },

        /**
         * This method gets the elapsed the time as an interger
         *
         * @return	void
         */

        getElapsed: function() {
            return this.count * this.interval;
        },

        /**
         * This method gets the elapsed the time as a Date object
         *
         * @return	void
         */

        getElapsedTime: function() {
            return new Date(this.time + this.getElapsed());
        },

        /**
         * This method is resets the timer
         *
         * @param 	callback  This method resets the timer back to 0
         * @return	void
         */

        reset: function(callback) {
            clearInterval(this.timer);
            this.count = 0;
            this._setInterval(callback);
            this.callback(this.callbacks.reset);
        },

        /**
         * This method is starts the timer
         *
         * @param 	callback  A function that is called once the timer is destroyed
         * @return	void
         */

        start: function(callback) {
            this.factory.running = true;
            this._createTimer(callback);
            this.callback(this.callbacks.start);
        },

        /**
         * This method is stops the timer
         *
         * @param 	callback  A function that is called once the timer is destroyed
         * @return	void
         */

        stop: function(callback) {
            this.factory.running = false;
            this._clearInterval(callback);
            this.callback(this.callbacks.stop);
            this.callback(callback);
        },

        /**
         * Clear the timer interval
         *
         * @return	void
         */

        _clearInterval: function() {
            clearInterval(this.timer);
        },

        /**
         * Create the timer object
         *
         * @param 	callback  A function that is called once the timer is created
         * @return	void
         */

        _createTimer: function(callback) {
            this._setInterval(callback);
        },

        /**
         * Destroy the timer object
         *
         * @param 	callback  A function that is called once the timer is destroyed
         * @return	void
         */

        _destroyTimer: function(callback) {
            this._clearInterval();
            this.timer = false;
            this.callback(callback);
            this.callback(this.callbacks.destroy);
        },

        /**
         * This method is called each time the timer interval is ran
         *
         * @param 	callback  A function that is called once the timer is destroyed
         * @return	void
         */

        _interval: function(callback) {
            this.callback(this.callbacks.interval);
            this.callback(callback);
            this.count++;
        },

        /**
         * This sets the timer interval
         *
         * @param 	callback  A function that is called once the timer is destroyed
         * @return	void
         */

        _setInterval: function(callback) {
            var t = this;

            t._interval(callback);

            t.timer = setInterval(function() {
                t._interval(callback);
            }, this.interval);
        }

    });


    FlipClock.TwentyFourHourClockFace = FlipClock.Face.extend({

        /**
         * Constructor
         *
         * @param  object  The parent FlipClock.Factory object
         * @param  object  An object of properties to override the default
         */

        constructor: function(factory, options) {
            this.base(factory, options);
        },

        /**
         * Build the clock face
         *
         * @param  object  Pass the time that should be used to display on the clock.
         */

        build: function(time) {
            var t        = this;
            var children = this.factory.$el.find('ul');

            if(!this.factory.time.time) {
                this.factory.original = new Date();

                this.factory.time = new FlipClock.Time(this.factory, this.factory.original);
            }

            var time = time ? time : this.factory.time.getMilitaryTime(false, this.showSeconds);

            if(time.length > children.length) {
                $.each(time, function(i, digit) {
                    t.createList(digit);
                });
            }

            this.createDivider();
            this.createDivider();

            $(this.dividers[0]).insertBefore(this.lists[this.lists.length - 2].$el);
            $(this.dividers[1]).insertBefore(this.lists[this.lists.length - 4].$el);

            this.base();
        },

        /**
         * Flip the clock face
         */

        flip: function(time, doNotAddPlayClass) {
            this.autoIncrement();

            time = time ? time : this.factory.time.getMilitaryTime(false, this.showSeconds);

            this.base(time, doNotAddPlayClass);
        }

    });

    FlipClock.CounterFace = FlipClock.Face.extend({

        /**
         * Tells the counter clock face if it should auto-increment
         */

        shouldAutoIncrement: false,

        /**
         * Constructor
         *
         * @param  object  The parent FlipClock.Factory object
         * @param  object  An object of properties to override the default
         */

        constructor: function(factory, options) {

            if(typeof options != "object") {
                options = {};
            }

            factory.autoStart = options.autoStart ? true : false;

            if(options.autoStart) {
                this.shouldAutoIncrement = true;
            }

            factory.increment = function() {
                factory.countdown = false;
                factory.setTime(factory.getTime().getTimeSeconds() + 1);
            };

            factory.decrement = function() {
                factory.countdown = true;
                var time = factory.getTime().getTimeSeconds();
                if(time > 0) {
                    factory.setTime(time - 1);
                }
            };

            factory.setValue = function(digits) {
                factory.setTime(digits);
            };

            factory.setCounter = function(digits) {
                factory.setTime(digits);
            };

            this.base(factory, options);
        },

        /**
         * Build the clock face
         */

        build: function() {
            var t        = this;
            var children = this.factory.$el.find('ul');
            var time 	 = this.factory.getTime().digitize([this.factory.getTime().time]);

            if(time.length > children.length) {
                $.each(time, function(i, digit) {
                    var list = t.createList(digit);

                    list.select(digit);
                });

            }

            $.each(this.lists, function(i, list) {
                list.play();
            });

            this.base();
        },

        /**
         * Flip the clock face
         */

        flip: function(time, doNotAddPlayClass) {
            if(this.shouldAutoIncrement) {
                this.autoIncrement();
            }

            if(!time) {
                time = this.factory.getTime().digitize([this.factory.getTime().time]);
            }

            this.base(time, doNotAddPlayClass);
        },

        /**
         * Reset the clock face
         */

        reset: function() {
            this.factory.time = new FlipClock.Time(
                this.factory,
                this.factory.original ? Math.round(this.factory.original) : 0
            );

            this.flip();
        }
    });

    FlipClock.DailyCounterFace = FlipClock.Face.extend({

        showSeconds: true,

        /**
         * Constructor
         *
         * @param  object  The parent FlipClock.Factory object
         * @param  object  An object of properties to override the default
         */

        constructor: function(factory, options) {
            this.base(factory, options);
        },

        /**
         * Build the clock face
         */

        build: function(time) {
            var t = this;
            var children = this.factory.$el.find('ul');
            var offset = 0;

            time = time ? time : this.factory.time.getDayCounter(this.showSeconds);

            if(time.length > children.length) {
                $.each(time, function(i, digit) {
                    t.createList(digit);
                });
            }

            if(this.showSeconds) {
                $(this.createDivider('Seconds')).insertBefore(this.lists[this.lists.length - 2].$el);
            }
            else
            {
                offset = 2;
            }

            $(this.createDivider('Minutes')).insertBefore(this.lists[this.lists.length - 4 + offset].$el);
            $(this.createDivider('Hours')).insertBefore(this.lists[this.lists.length - 6 + offset].$el);
            $(this.createDivider('Days', true)).insertBefore(this.lists[0].$el);

            this.base();
        },

        /**
         * Flip the clock face
         */

        flip: function(time, doNotAddPlayClass) {
            if(!time) {
                time = this.factory.time.getDayCounter(this.showSeconds);
            }

            this.autoIncrement();

            this.base(time, doNotAddPlayClass);
        }

    });


    FlipClock.HourlyCounterFace = FlipClock.Face.extend({

        // clearExcessDigits: true,

        /**
         * Constructor
         *
         * @param  object  The parent FlipClock.Factory object
         * @param  object  An object of properties to override the default
         */

        constructor: function(factory, options) {
            this.base(factory, options);
        },

        /**
         * Build the clock face
         */

        build: function(excludeHours, time) {
            var t = this;
            var children = this.factory.$el.find('ul');

            time = time ? time : this.factory.time.getHourCounter();

            if(time.length > children.length) {
                $.each(time, function(i, digit) {
                    t.createList(digit);
                });
            }

            $(this.createDivider('Seconds')).insertBefore(this.lists[this.lists.length - 2].$el);
            $(this.createDivider('Minutes')).insertBefore(this.lists[this.lists.length - 4].$el);

            if(!excludeHours) {
                $(this.createDivider('Hours', true)).insertBefore(this.lists[0].$el);
            }

            this.base();
        },

        /**
         * Flip the clock face
         */

        flip: function(time, doNotAddPlayClass) {
            if(!time) {
                time = this.factory.time.getHourCounter();
            }

            this.autoIncrement();

            this.base(time, doNotAddPlayClass);
        },

        /**
         * Append a newly created list to the clock
         */

        appendDigitToClock: function(obj) {
            this.base(obj);

            this.dividers[0].insertAfter(this.dividers[0].next());
        }

    });


    FlipClock.MinuteCounterFace = FlipClock.HourlyCounterFace.extend({

        clearExcessDigits: false,

        /**
         * Constructor
         *
         * @param  object  The parent FlipClock.Factory object
         * @param  object  An object of properties to override the default
         */

        constructor: function(factory, options) {
            this.base(factory, options);
        },

        /**
         * Build the clock face
         */

        build: function() {
            this.base(true, this.factory.time.getMinuteCounter());
        },

        /**
         * Flip the clock face
         */

        flip: function(time, doNotAddPlayClass) {
            if(!time) {
                time = this.factory.time.getMinuteCounter();
            }

            this.base(time, doNotAddPlayClass);
        }

    });

    FlipClock.TwelveHourClockFace = FlipClock.TwentyFourHourClockFace.extend({

        /**
         * The meridium jQuery DOM object
         */

        meridium: false,

        /**
         * The meridium text as string for easy access
         */

        meridiumText: 'AM',

        /**
         * Build the clock face
         *
         * @param  object  Pass the time that should be used to display on the clock.
         */

        build: function() {
            var t = this;

            var time = this.factory.time.getTime(false, this.showSeconds);

            this.base(time);
            this.meridiumText = this.getMeridium();
            this.meridium = $([
                '<ul class="flip-clock-meridium">',
                '<li>',
                '<a href="#">'+this.meridiumText+'</a>',
                '</li>',
                '</ul>'
            ].join(''));

            this.meridium.insertAfter(this.lists[this.lists.length-1].$el);
        },

        /**
         * Flip the clock face
         */

        flip: function(time, doNotAddPlayClass) {
            if(this.meridiumText != this.getMeridium()) {
                this.meridiumText = this.getMeridium();
                this.meridium.find('a').html(this.meridiumText);
            }
            this.base(this.factory.time.getTime(false, this.showSeconds), doNotAddPlayClass);
        },

        /**
         * Get the current meridium
         *
         * @return  string  Returns the meridium (AM|PM)
         */

        getMeridium: function() {
            return new Date().getHours() >= 12 ? 'PM' : 'AM';
        },

        /**
         * Is it currently in the post-medirium?
         *
         * @return  bool  Returns true or false
         */

        isPM: function() {
            return this.getMeridium() == 'PM' ? true : false;
        },

        /**
         * Is it currently before the post-medirium?
         *
         * @return  bool  Returns true or false
         */

        isAM: function() {
            return this.getMeridium() == 'AM' ? true : false;
        }

    });

    FlipClock.Lang.Arabic = {

        'years'   : 'سنوات',
        'months'  : 'شهور',
        'days'    : 'أيام',
        'hours'   : 'ساعات',
        'minutes' : 'دقائق',
        'seconds' : 'ثواني'

    };

    /* Create various aliases for convenience */

    FlipClock.Lang['ar']      = FlipClock.Lang.Arabic;
    FlipClock.Lang['ar-ar']   = FlipClock.Lang.Arabic;
    FlipClock.Lang['arabic']  = FlipClock.Lang.Arabic;


    FlipClock.Lang.Danish = {

        'years'   : 'År',
        'months'  : 'Måneder',
        'days'    : 'Dage',
        'hours'   : 'Timer',
        'minutes' : 'Minutter',
        'seconds' : 'Sekunder'

    };

    /* Create various aliases for convenience */

    FlipClock.Lang['da']     = FlipClock.Lang.Danish;
    FlipClock.Lang['da-dk']  = FlipClock.Lang.Danish;
    FlipClock.Lang['danish'] = FlipClock.Lang.Danish;


    FlipClock.Lang.German = {

        'years'   : 'Jahre',
        'months'  : 'Monate',
        'days'    : 'Tage',
        'hours'   : 'Stunden',
        'minutes' : 'Minuten',
        'seconds' : 'Sekunden'

    };

    /* Create various aliases for convenience */

    FlipClock.Lang['de']     = FlipClock.Lang.German;
    FlipClock.Lang['de-de']  = FlipClock.Lang.German;
    FlipClock.Lang['german'] = FlipClock.Lang.German;


    FlipClock.Lang.English = {

        'years'   : 'Years',
        'months'  : 'Months',
        'days'    : 'Days',
        'hours'   : 'Hours',
        'minutes' : 'Minutes',
        'seconds' : 'Seconds'

    };

    /* Create various aliases for convenience */

    FlipClock.Lang['en']      = FlipClock.Lang.English;
    FlipClock.Lang['en-us']   = FlipClock.Lang.English;
    FlipClock.Lang['english'] = FlipClock.Lang.English;


    FlipClock.Lang.Spanish = {

        'years'   : 'Años',
        'months'  : 'Meses',
        'days'    : 'Días',
        'hours'   : 'Horas',
        'minutes' : 'Minutos',
        'seconds' : 'Segundos'

    };

    /* Create various aliases for convenience */

    FlipClock.Lang['es']      = FlipClock.Lang.Spanish;
    FlipClock.Lang['es-es']   = FlipClock.Lang.Spanish;
    FlipClock.Lang['spanish'] = FlipClock.Lang.Spanish;


    FlipClock.Lang.Finnish = {

        'years'   : 'Vuotta',
        'months'  : 'Kuukautta',
        'days'    : 'Päivää',
        'hours'   : 'Tuntia',
        'minutes' : 'Minuuttia',
        'seconds' : 'Sekuntia'

    };

    /* Create various aliases for convenience */

    FlipClock.Lang['fi']      = FlipClock.Lang.Finnish;
    FlipClock.Lang['fi-fi']   = FlipClock.Lang.Finnish;
    FlipClock.Lang['finnish'] = FlipClock.Lang.Finnish;

    FlipClock.Lang.French = {

        'years'   : 'Ans',
        'months'  : 'Mois',
        'days'    : 'Jours',
        'hours'   : 'Heures',
        'minutes' : 'Minutes',
        'seconds' : 'Secondes'

    };

    /* Create various aliases for convenience */

    FlipClock.Lang['fr']      = FlipClock.Lang.French;
    FlipClock.Lang['fr-ca']   = FlipClock.Lang.French;
    FlipClock.Lang['french']  = FlipClock.Lang.French;

    FlipClock.Lang.Italian = {

        'years'   : 'Anni',
        'months'  : 'Mesi',
        'days'    : 'Giorni',
        'hours'   : 'Ore',
        'minutes' : 'Minuti',
        'seconds' : 'Secondi'

    };

    /* Create various aliases for convenience */

    FlipClock.Lang['it']      = FlipClock.Lang.Italian;
    FlipClock.Lang['it-it']   = FlipClock.Lang.Italian;
    FlipClock.Lang['italian'] = FlipClock.Lang.Italian;

    FlipClock.Lang.Latvian = {

        'years'   : 'Gadi',
        'months'  : 'Mēneši',
        'days'    : 'Dienas',
        'hours'   : 'Stundas',
        'minutes' : 'Minūtes',
        'seconds' : 'Sekundes'

    };

    /* Create various aliases for convenience */

    FlipClock.Lang['lv']      = FlipClock.Lang.Latvian;
    FlipClock.Lang['lv-lv']   = FlipClock.Lang.Latvian;
    FlipClock.Lang['latvian'] = FlipClock.Lang.Latvian;


    FlipClock.Lang.Dutch = {

        'years'   : 'Jaren',
        'months'  : 'Maanden',
        'days'    : 'Dagen',
        'hours'   : 'Uren',
        'minutes' : 'Minuten',
        'seconds' : 'Seconden'

    };

    /* Create various aliases for convenience */

    FlipClock.Lang['nl']      = FlipClock.Lang.Dutch;
    FlipClock.Lang['nl-be']   = FlipClock.Lang.Dutch;
    FlipClock.Lang['dutch']   = FlipClock.Lang.Dutch;

    FlipClock.Lang.Norwegian = {

        'years'   : 'År',
        'months'  : 'Måneder',
        'days'    : 'Dager',
        'hours'   : 'Timer',
        'minutes' : 'Minutter',
        'seconds' : 'Sekunder'

    };

    /* Create various aliases for convenience */

    FlipClock.Lang['no']      = FlipClock.Lang.Norwegian;
    FlipClock.Lang['nb']      = FlipClock.Lang.Norwegian;
    FlipClock.Lang['no-nb']   = FlipClock.Lang.Norwegian;
    FlipClock.Lang['norwegian'] = FlipClock.Lang.Norwegian;

    FlipClock.Lang.Portuguese = {

        'years'   : 'Anos',
        'months'  : 'Meses',
        'days'    : 'Dias',
        'hours'   : 'Horas',
        'minutes' : 'Minutos',
        'seconds' : 'Segundos'

    };

    /* Create various aliases for convenience */

    FlipClock.Lang['pt']         = FlipClock.Lang.Portuguese;
    FlipClock.Lang['pt-br']      = FlipClock.Lang.Portuguese;
    FlipClock.Lang['portuguese'] = FlipClock.Lang.Portuguese;

    FlipClock.Lang.Russian = {

        'years'   : 'лет',
        'months'  : 'месяцев',
        'days'    : 'дней',
        'hours'   : 'часов',
        'minutes' : 'минут',
        'seconds' : 'секунд'

    };

    /* Create various aliases for convenience */

    FlipClock.Lang['ru']      = FlipClock.Lang.Russian;
    FlipClock.Lang['ru-ru']   = FlipClock.Lang.Russian;
    FlipClock.Lang['russian']  = FlipClock.Lang.Russian;


    FlipClock.Lang.Swedish = {

        'years'   : 'År',
        'months'  : 'Månader',
        'days'    : 'Dagar',
        'hours'   : 'Timmar',
        'minutes' : 'Minuter',
        'seconds' : 'Sekunder'

    };

    /* Create various aliases for convenience */

    FlipClock.Lang['sv']      = FlipClock.Lang.Swedish;
    FlipClock.Lang['sv-se']   = FlipClock.Lang.Swedish;
    FlipClock.Lang['swedish'] = FlipClock.Lang.Swedish;


    FlipClock.Lang.Chinese = {

        'years'   : '年',
        'months'  : '月',
        'days'    : '日',
        'hours'   : '时',
        'minutes' : '分',
        'seconds' : '秒'

    };

    /* Create various aliases for convenience */

    FlipClock.Lang['zh']      = FlipClock.Lang.Chinese;
    FlipClock.Lang['zh-cn']   = FlipClock.Lang.Chinese;
    FlipClock.Lang['chinese'] = FlipClock.Lang.Chinese;

class Holiday extends Component{
    constructor(props) {
        super(props);

        this.state = {
            data: false,
            siteData: '',
            homeData: '',
            optionsData: '',
            pageData: '',
            heroImage: '',
            navThumbnail: '',
            headerCopy: '',
            enableSignup: false,
            tripleCTAs: '',
        };
    }

    componentWillMount(){
        const component = this;

        axios.all([
                axios.get(SiteURL + '/wp-json'),
                axios.get(Pages + '?slug=home'),
                axios.get(Pages + '?slug=holiday'),
                axios.get(PropertyOptions),
            ])
            .then(axios.spread(function (site, home, holidayPage, options) {

                let tripleCTAs;

                if(holidayPage.data[0].acf.enable_triple_ctas){
                    tripleCTAs = holidayPage.data[0].acf.triple_ctas.map((cta, i) => {
                        let image =
                            <div className="image-container">
                                <div className="gradient">
                                    {cta.title &&
                                        <h3>{cta.title}</h3>
                                    }
                                </div>
                                <img src={cta.cta_image.url} alt={cta.cta_image.alt ? cta.cta_image.alt : 'Holiday CTA ' + i} />
                            </div>;
                        let topText = <span className="top-text">{cta.top_line}</span>;
                        let bottomText = <span className="bottom-text">{cta.bottom_line}</span>;
                        if(cta.link_type === "Internal Link"){
                            return(
                                <Link to={'/' + cta.internal_link.post_name} className="cta link">
                                    {image}
                                    <p className="copy">
                                        {topText}<br/>
                                        {bottomText}
                                    </p>
                                </Link>
                            );

                        }
                        else if(cta.link_type === "External Link"){
                            return(
                                <a href={cta.external_link} className="cta link" target="_blank">
                                    {image}
                                    <p className="copy">
                                        {topText}<br/>
                                        {bottomText}
                                    </p>
                                </a>
                            );

                        }
                        else{
                            return(
                                <div className="cta no-link">
                                    {image}
                                    <p className="copy">
                                        {topText}<br/>
                                        {bottomText}
                                    </p>
                                </div>
                            );
                        }
                    })
                }

                component.setState({
                    data: true,
                    siteData: site.data,
                    homeData: home.data[0],
                    optionsData: options.data,
                    pageData: holidayPage.data[0],
                    heroImage: holidayPage.data[0].acf.hero_image,
                    navThumbnail: holidayPage.data[0].acf.navigation_thumbnail,
                    headerCopy: holidayPage.data[0].acf.header_copy,
                    enableSignup: home.data[0].acf.enable_mail_signup,
                    tripleCTAs: tripleCTAs,
                });
            }))
            .catch((err) => {
                console.log(err);
            });
    }

    buildClock(){

        let eventdate = moment(this.state.pageData.acf.santa_date);
        let todaysdate = moment();
        let daysremaining = eventdate.diff(todaysdate, 'seconds');


        setTimeout(function(){

            let clock = new FlipClock($('.clock'), daysremaining, {
                clockFace: 'DailyCounter',
                countdown: true,
                clockFaceOptions: {
                    minimumDigits: 8,
                },
            });

        }, 1000);


    }

    render(){
        if(this.state.data){
            return(
                <div className="template-holiday" data-page="holiday">
                    <Helmet
                        title={entities.decode(this.state.pageData.title.rendered) + ' | ' + this.state.siteData.name + ' | ' + this.state.optionsData.acf.address_1 + ' ' + (this.state.optionsData.acf.address_2 ? this.state.optionsData.acf.address_2 + ' ' : '') + this.state.optionsData.acf.city + ', ' + this.state.optionsData.acf.state}
                        meta={[
                            {'name': 'description', 'content': (this.state.pageData.acf.use_custom_meta_description ? this.state.pageData.acf.meta_description : this.state.optionsData.acf.meta_description)},
                        ]}
                    />

                    <InteriorHeader pageData={this.state.pageData} />

                    {this.state.pageData.acf.enable_santa_countdown &&
                        <div className="santa-countdown">
                            <h2>{this.state.pageData.acf.countdown_grey_text ? this.state.pageData.acf.countdown_grey_text : "Time Remaining to"}<br /><span>{this.state.pageData.acf.countdown_red_text ? this.state.pageData.acf.countdown_red_text : "Santa's Arrival"}</span></h2>
                            <div className="clock">
                                {this.buildClock()}
                            </div>
                        </div>
                    }

                    <HolidayHours optionsData={this.state.optionsData} siteData={this.state.siteData} />

                    <HolidayStoreHours optionsData={this.state.optionsData} pageData={this.state.pageData}/>

                    {this.state.pageData.acf.enable_triple_ctas &&
                        <div className="triple-ctas">
                            {this.state.tripleCTAs}
                        </div>
                    }

                    <HolidayEventsList
                        catFilter={this.state.catFilter}
                        dayFilter={this.state.dayFilter}
                        monthFilter={this.state.monthFilter}
                    />

                    {this.state.enableSignup &&
                        <Signup homeData={this.state.homeData} optionsData={this.state.optionsData} />
                    }
                </div>
            );
        }
        return <Loader />;
    }
}


export default Holiday;
