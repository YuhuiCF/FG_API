(function(){

            var optimizeCb = function(func, context, argCount) {
                if (context === void 0) return func;
                switch (argCount === null ? 3 : argCount) {
                    case 1: return function(value) {
                        return func.call(context, value);
                    };
                    case 2: return function(value, other) {
                        return func.call(context, value, other);
                    };
                    case 3: return function(value, index, collection) {
                        return func.call(context, value, index, collection);
                    };
                    case 4: return function(accumulator, value, index, collection) {
                        return func.call(context, accumulator, value, index, collection);
                    };
                }
                return function() {
                    return func.apply(context, arguments);
                };
            };

            var nativeKeys = Object.keys;
            var nativeIsArray = Array.isArray;

            var ObjProto = Object.prototype;

            var toString = ObjProto.toString;

            var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
            var nonEnumerableProps = [
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'toLocaleString',
                'toString',
                'valueOf'
            ];

            var createAssigner = function(keysFunc, undefinedOnly) {
                return function(obj) {
                    var length = arguments.length;
                    if (length < 2 || obj === null) {return obj;}
                    for (var index = 1; index < length; index++) {
                        var source = arguments[index],
                            keys = keysFunc(source),
                            l = keys.length;
                        for (var i = 0; i < l; i++) {
                            var key = keys[i];
                            if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
                        }
                    }
                    return obj;
                };
            };

            var property = function(key) {
                return function(obj) {
                    return obj === null ? void 0 : obj[key];
                };
            };
            var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
            var getLength = property('length');
            var isArrayLike = function(collection) {
                var length = getLength(collection);
                return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
            };

            function collectNonEnumProps(obj, keys) {
                var nonEnumIdx = nonEnumerableProps.length;
                var constructor = obj.constructor;
                var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

                var prop = 'constructor';
                if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

                while (nonEnumIdx--) {
                    prop = nonEnumerableProps[nonEnumIdx];
                    if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
                        keys.push(prop);
                    }
                }
            }

            var _ = {};

            _.assign = createAssigner(_.keys);

            _.clone = function(obj) {
                if (!_.isObject(obj)) return obj;
                return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
            };

            _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
                if (!isArrayLike(obj)) {
                    obj = _.values(obj);
                }
                if (typeof fromIndex != 'number' || guard) {
                    fromIndex = 0;
                }

                return _.indexOf(obj, item, fromIndex) >= 0;
            };

            _.each = _.forEach = function(obj, iteratee, context) {
                iteratee = optimizeCb(iteratee, context);
                var i, length;
                if (isArrayLike(obj)) {
                    for (i = 0, length = obj.length; i < length; i++) {
                        iteratee(obj[i], i, obj);
                    }
                } else {
                    var keys = _.keys(obj);
                    for (i = 0, length = keys.length; i < length; i++) {
                        iteratee(obj[keys[i]], keys[i], obj);
                    }
                }
                return obj;
            };

            _.extend = createAssigner(_.allKeys);

            _.has = function(obj, key) {
                return obj !== null && hasOwnProperty.call(obj, key);
            };

            _.isArray = nativeIsArray || function(obj) {
                return toString.call(obj) === '[object Array]';
            };

            if (typeof /./ != 'function' && typeof Int8Array != 'object') {
                _.isFunction = function(obj) {
                    return typeof obj == 'function' || false;
                };
            }

            _.isObject = function(obj) {
                var type = typeof obj;
                return type === 'function' || type === 'object' && !!obj;
            };

            _.keys = function(obj) {
                if (!_.isObject(obj)) return [];
                if (nativeKeys) return nativeKeys(obj);
                var keys = [];
                for (var key in obj) if (_.has(obj, key)) keys.push(key);
                if (hasEnumBug) collectNonEnumProps(obj, keys);
                return keys;
            };

            return _;

        })();
