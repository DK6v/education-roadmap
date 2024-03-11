const { range } = require("./ch1.js");

exports.run = function () {

  let respStr = "[+] Chapter 6\n";

  let temp_obj = {
    this_get_keys,
    this_try_map,
    key: "value"
  };

  respStr += "this_get_keys()\n -> ";
  respStr += temp_obj.this_get_keys() + "\n";

  respStr += "this_try_map()\n -> ";
  respStr += temp_obj.this_try_map() + "\n";

  respStr += "get Object.prototype()\n -> ";
  respStr += JSON.stringify(Object.prototype) + "\n";

  let myClass = new MyClass("my_value");
  respStr += "MyClass::get_value()\n -> ";
  respStr += myClass.get_value() + "\n";

  respStr += "MyClass::toString()\n -> ";
  respStr += myClass + "\n";

  myClass.get_value = function () {
    return "myClass: " + this.value;
  };
  respStr += "myClass::toString()\n -> ";
  respStr += myClass + "\n";

  myClass.toString = function () {
    return "myClass::toString " + this.get_value();
  };
  respStr += "myClass::toString()\n -> ";
  respStr += myClass + "\n";

  respStr += "Object.getPrototypeOf(MyClass)\n -> ";
  respStr += Object.getPrototypeOf(MyClass).getName() + "\n"

  respStr += "Object.getPrototypeOf(myClass)\n -> ";
  respStr += Object.getPrototypeOf(myClass).getName() + "\n"

  respStr += "Object.getPrototypeOf(MyClass) -> chain\n";
  respStr += Object.getPrototypeOf(MyClass).getPrototypeChain() + "\n"

  respStr += "Object.getPrototypeOf(myClass) -> chain\n";
  respStr += Object.getPrototypeOf(myClass).getPrototypeChain() + "\n"

  respStr += "range(1,10)[Symbol.iterator]().next()\n -> ";
  respStr += JSON.stringify(range(1, 10)[Symbol.iterator]().next()) + "\n";

  let matrix = new Matrix(5, 5, (x, y) => (x + y * 5));
  respStr += "matrix -> \n";
  respStr += matrix;

  respStr += "matrix iterator -> \n";
  for ({ x, y, value } of matrix) {
    respStr += value + ", "
  }
  respStr += "\n";

  return respStr;
}

// -----------------------------------------------------------------

function this_get_keys() {

  let respStr = "";

  for (key in this) {
    respStr += key.toString() + ',';
  }

  return respStr;
}

function this_try_map() {

  let respStr = "";
  let obj = { array: [], length: 0 };

  obj.array = range(1, 10);
  obj.length = obj.array.length;

  function nomalize() {
    this.array = this.array.map((n) => { return n / this.length; });
  }

  function double() {
    this.array = this.array.map(function (n) { return n * 2; });
  }

  nomalize.call(obj);
  double.call(obj);

  return JSON.stringify(obj);
}

class MyClass {

  constructor(value) {
    this.value = value;
  }

  get_value() { return "MyClass: " + this.value }
}

MyClass.prototype.toString = function () {
  return "toString: " + this.get_value();
};

Object.prototype.getName = function () {
  return (this).constructor.name.toString();
};

Object.prototype.getPrototypeChain = function () {

  var proto = this.constructor.prototype;
  var result = '';

  while (proto) {
    result += ' -> ' + proto.constructor.name + '.prototype';
    proto = Object.getPrototypeOf(proto)
  }

  result += ' -> null';
  return result;
}

// Matrix

class Matrix {

  constructor(width, height, element = (x, y) => undefined) {

    this.width = width;
    this.height = height;
    this.matrix = []

    for (let y = 0; y < this.width; y++) {
      for (let x = 0; x < this.height; x++) {

        this.set(x, y, element(x, y));
      }
    }
  }

  toString() {

    let retval = "";

    for (let y = 0; y < this.width; y++) {
      for (let x = 0; x < this.height; x++) {

        retval += this.get(x, y)
          .toString()
          .padEnd(2, ' ') + " ";
      }
      retval += "\n";
    }

    return retval;
  }

  get(x, y) {
    return this.matrix[x + y * this.width];
  }

  set(x, y, value) {
    this.matrix[x + y * this.width] = value;
  }

  [Symbol.iterator]() {
    return new MatrixIterator(this);
  }
}

class MatrixIterator {

  constructor(matrix) {
    this.x = 0;
    this.y = 0;
    this.matrix = matrix;
  }

  next() {

    if (this.y == this.matrix.height) {
      return { done: true };
    }

    let value = {
      x: this.x,
      y: this.y,
      value: this.matrix.get(this.x, this.y)
    };

    this.x += 1;
    if (this.x == this.matrix.width) {

      this.x = 0;
      this.y += 1;
    }

    return { value, done: false };
  }
}