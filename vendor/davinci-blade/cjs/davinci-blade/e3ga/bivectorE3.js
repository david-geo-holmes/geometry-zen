var Euclidean3 = require('davinci-blade/Euclidean3');
var bivectorE3 = function (xy, yz, zx) {
    return new Euclidean3(0, 0, 0, 0, xy, yz, zx, 0);
};
module.exports = bivectorE3;
