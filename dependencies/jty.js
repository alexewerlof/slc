// node_modules/jty/lib/index.js
function isDef(x) {
  return x !== void 0;
}
function isNullish(x) {
  return x === null || x === void 0;
}
function isBool(x) {
  return typeof x === "boolean";
}
function isFn(x) {
  return typeof x === "function";
}
function isSym(x) {
  return typeof x === "symbol";
}
function isBigInt(x) {
  return typeof x === "bigint";
}
var { isNaN, isFinite, isInteger } = Number;
function isNum(x) {
  return typeof x === "number" && !isNaN(x);
}
function isInt(x) {
  return isInteger(x);
}
function isFin(x) {
  return isFinite(x);
}
function inRange(x, min, max) {
  if (!isNum(x)) {
    return false;
  }
  if (isDef(min)) {
    if (!isNum(min)) {
      throw new TypeError(`inRange(): "min" must be a number. Got ${min} (${typeof min})`);
    }
    if (isDef(max)) {
      if (!isNum(max)) {
        throw new TypeError(`inRange(): "max" must be a number. Got ${max} (${typeof max})`);
      }
      if (min > max) {
        return max <= x && x <= min;
      }
      return min <= x && x <= max;
    }
    return x >= min;
  } else if (isDef(max)) {
    if (!isNum(max)) {
      throw new TypeError(`inRange(): "max" must be a number. Got ${max} (${typeof max})`);
    }
    return x <= max;
  }
  throw new TypeError(
    `inRange(): expected at least min or max to be defined. Got min=${min} (${typeof min}) and max=${max} (${typeof max})`
  );
}
function inRangeInt(x, min, max) {
  return isInt(x) && inRange(x, min, max);
}
function isIdx(x, length) {
  if (!isInt(length)) {
    throw new TypeError(`isIdx(): "length" must be an integer. Got ${length} (${typeof length})`);
  }
  if (length < 0) {
    throw new RangeError(`isIdx(): "length" must be >= 0. Got ${length} (${typeof length})`);
  }
  return isInt(x) && x >= 0 && x < length;
}
var { isArray } = Array;
function isArr(x) {
  return isArray(x);
}
function isArrLen(x, minLen = 0, maxLen) {
  if (!isArr(x)) {
    return false;
  }
  return inRangeInt(x.length, minLen, maxLen);
}
function isArrIdx(x, arr) {
  if (!isArr(arr)) {
    throw new TypeError(`isArrIdx(): "arr" must be an array. Got ${arr} (${typeof arr})`);
  }
  return isIdx(x, arr.length);
}
function inArr(x, arr) {
  if (!isArr(arr)) {
    throw new TypeError(`inArr(): "arr" must be an array. Got ${arr} (${typeof arr})`);
  }
  return arr.includes(x);
}
var { hasOwnProperty } = Object;
function isObj(x) {
  return Boolean(x) && typeof x === "object";
}
function isPOJO(x) {
  if (!isObj(x)) return false;
  const proto = Object.getPrototypeOf(x);
  return proto === Object.prototype || proto === null;
}
function isInstance(x, classConstructor) {
  if (!isFn(classConstructor)) {
    throw new TypeError(
      `isInstance(): "classConstructor" must be a constructor function. Got ${classConstructor} (${typeof classConstructor})`
    );
  }
  return x instanceof classConstructor;
}
function isOwnInstance(x, classConstructor) {
  if (!isFn(classConstructor)) {
    throw new TypeError(
      `isOwnInstance(): "classConstructor" must be a constructor function. Got ${classConstructor} (${typeof classConstructor})`
    );
  }
  return isObj(x) && Object.getPrototypeOf(x) === classConstructor.prototype;
}
function hasPath(x, ...propNames) {
  if (propNames.length === 0) {
    return false;
  }
  let scope = x;
  for (const propName of propNames) {
    if (isObj(scope) && hasProp(scope, propName)) {
      scope = scope[propName];
    } else {
      return false;
    }
  }
  return true;
}
function hasOwnPath(x, ...propNames) {
  if (propNames.length === 0) {
    return false;
  }
  let scope = x;
  for (const propName of propNames) {
    if (isObj(scope) && hasOwnProp(scope, propName)) {
      scope = scope[propName];
    } else {
      return false;
    }
  }
  return true;
}
function hasProp(x, ...propNames) {
  if (!isObj(x)) {
    return false;
  }
  for (const propName of propNames) {
    if (!(propName in x)) {
      return false;
    }
  }
  return true;
}
function hasOwnProp(x, ...propNames) {
  if (!isObj(x)) {
    return false;
  }
  for (const propName of propNames) {
    if (!hasOwnProperty.call(x, propName)) {
      return false;
    }
  }
  return true;
}
function isSet(x) {
  return isInstance(x, Set);
}
function isPromise(x) {
  return isInstance(x, Promise);
}
function isPromiseLike(x) {
  if (isPromise(x)) {
    return true;
  }
  if (!isObj(x) && !isFn(x)) {
    return false;
  }
  const then = x.then;
  return isFn(then);
}
function isMap(x) {
  return isInstance(x, Map);
}
function isRegExp(x) {
  return isInstance(x, RegExp);
}
function isDate(x) {
  return isInstance(x, Date) && isNum(x.getTime());
}
function isErr(x) {
  return isInstance(x, Error);
}
function isStr(x) {
  return typeof x === "string";
}
function isStrLen(x, minLen = 0, maxLen) {
  if (!isStr(x)) {
    return false;
  }
  return inRangeInt(x.length, minLen, maxLen);
}
function isStrIdx(x, str) {
  if (!isStr(str)) {
    throw new TypeError(`isStrIdx(): "str" must be a string. Got ${str} (${typeof str})`);
  }
  return isIdx(x, str.length);
}
var { hasOwnProperty: hasOwnProperty2 } = Object;
var { isArray: isArray2 } = Array;
function isEqualArr(x, ref) {
  if (!isArray2(ref)) {
    throw new TypeError(`isEqualArr(): "ref" must be an array. Got ${JSON.stringify(ref)} (${typeof ref})`);
  }
  if (!isArray2(x)) {
    return false;
  }
  if (x === ref) {
    return true;
  }
  return x.length === ref.length && x.every((v, i) => v === ref[i]);
}
function isEqualSet(x, ref) {
  if (!isSet(ref)) {
    throw new TypeError(`isEqualSet(): "ref" must be a Set. Got ${ref} (${typeof ref})`);
  }
  if (x === ref) {
    return true;
  }
  if (!isSet(x)) {
    return false;
  }
  if (x.size !== ref.size) {
    return false;
  }
  for (const value of ref) {
    if (!x.has(value)) {
      return false;
    }
  }
  return true;
}
function isEqualMap(x, ref) {
  if (!isMap(ref)) {
    throw new TypeError(`isEqualMap(): "ref" must be a Map. Got ${ref} (${typeof ref})`);
  }
  if (x === ref) {
    return true;
  }
  if (!isMap(x)) {
    return false;
  }
  if (x.size !== ref.size) {
    return false;
  }
  for (const [key, value] of ref) {
    if (!x.has(key) || x.get(key) !== value) {
      return false;
    }
  }
  return true;
}
function isEqualRegExp(x, ref) {
  if (!isRegExp(ref)) {
    throw new TypeError(`isEqualRegExp(): "ref" must be a RegExp. Got ${ref} (${typeof ref})`);
  }
  if (x === ref) {
    return true;
  }
  if (!isRegExp(x)) {
    return false;
  }
  return x.source === ref.source && x.flags === ref.flags;
}
function isEqualDate(x, ref) {
  if (!isDate(ref)) {
    throw new TypeError(`isEqualDate(): "ref" must be a valid Date. Got ${ref} (${typeof ref})`);
  }
  if (x === ref) {
    return true;
  }
  if (!isDate(x)) {
    return false;
  }
  return x.getTime() === ref.getTime();
}
function isEqualErr(x, ref) {
  if (!isErr(ref)) {
    throw new TypeError(`isEqualErr(): "ref" must be an Error. Got ${ref} (${typeof ref})`);
  }
  if (x === ref) {
    return true;
  }
  if (!isErr(x)) {
    return false;
  }
  return x.name === ref.name && x.message === ref.message;
}
function isEqualObj(x, ref) {
  if (!isObj(ref)) {
    throw new TypeError(`isEqualObj(): "ref" must be an object. Got ${ref} (${typeof ref})`);
  }
  if (x === ref) {
    return true;
  }
  if (!isObj(x)) {
    return false;
  }
  if ("constructor" in ref && x?.constructor !== ref.constructor) {
    return false;
  }
  if (isArray2(ref)) {
    return isEqualArr(x, ref);
  }
  if (ref instanceof Set) {
    return isEqualSet(x, ref);
  }
  if (ref instanceof Map) {
    return isEqualMap(x, ref);
  }
  if (ref instanceof Error) {
    return isEqualErr(x, ref);
  }
  if (ref instanceof Date) {
    return isEqualDate(x, ref);
  }
  if (ref instanceof RegExp) {
    return isEqualRegExp(x, ref);
  }
  const xKeys = Object.keys(x);
  const refKeys = Object.keys(ref);
  if (xKeys.length !== refKeys.length) {
    return false;
  }
  for (const xKey of xKeys) {
    if (!hasOwnProperty2.call(ref, xKey) || !isDeepEqual(x[xKey], ref[xKey])) {
      return false;
    }
  }
  return true;
}
function isDeepEqual(x, ref) {
  if (x === ref) {
    return true;
  }
  if (!isObj(x) || !isObj(ref)) {
    return false;
  }
  return isEqualObj(x, ref);
}
export {
  hasOwnPath,
  hasOwnProp,
  hasPath,
  hasProp,
  inArr,
  inRange,
  inRangeInt,
  isArr,
  isArrIdx,
  isArrLen,
  isBigInt,
  isBool,
  isDate,
  isDeepEqual,
  isDef,
  isEqualArr,
  isEqualDate,
  isEqualErr,
  isEqualMap,
  isEqualObj,
  isEqualRegExp,
  isEqualSet,
  isErr,
  isFin,
  isFn,
  isIdx,
  isInstance,
  isInt,
  isMap,
  isNullish,
  isNum,
  isObj,
  isOwnInstance,
  isPOJO,
  isPromise,
  isPromiseLike,
  isRegExp,
  isSet,
  isStr,
  isStrIdx,
  isStrLen,
  isSym
};
