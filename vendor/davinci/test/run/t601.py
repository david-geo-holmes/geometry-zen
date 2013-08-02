from e2ga import *
from random import random

def explain(m):
    print str(m) + " is " + repr(m)
    return m

def showValue(name, m):
    print name + " => " + str(m)
    return m

def assertEqual(expect, actual, message):
  if expect != actual:
    print {"expect":expect,"actual":actual,"message":message}

zero  = Euclidean2(0, 0, 0, 0)
one   = Euclidean2(1, 0, 0, 0)
two   = Euclidean2(2, 0, 0, 0)
three = 3
i     = Euclidean2(0, 1, 0, 0)
j     = Euclidean2(0, 0, 1, 0)
I     = Euclidean2(0, 0, 0, 1)

blades = [zero, one, two, three, i, j, I]
# Construction.
M = Euclidean2(1, 2, 3, 4)
assertEqual(1, M.w,  "M.w")
assertEqual(2, M.x,  "M.x")
assertEqual(3, M.y,  "M.y")
assertEqual(4, M.xy, "M.xy")
# Length method.
assertEqual(4, M.length(), "M.length()")
# Mutation
M.w  = 4
M.x  = 3
M.y  = 2
M.xy = 1
assertEqual(4, M.w,  "M.w")
assertEqual(3, M.x,  "M.x")
assertEqual(2, M.y,  "M.y")
assertEqual(1, M.xy, "M.xy")
# Cloning
C = M.clone()
# Change M, C should be unchanged.
M.w  = 1
M.x  = 2
M.y  = 3
M.xy = 4
assertEqual(1, M.w,  "M.w")
assertEqual(2, M.x,  "M.x")
assertEqual(3, M.y,  "M.y")
assertEqual(4, M.xy, "M.xy")
assertEqual(4, C.w,  "M.w")
assertEqual(3, C.x,  "M.x")
assertEqual(2, C.y,  "M.y")
assertEqual(1, C.xy, "M.xy")
# Change C. M should be unchanged.
C.w  = 5
C.x  = 6
C.y  = 7
C.xy = 8
assertEqual(1, M.w,  "M.w")
assertEqual(2, M.x,  "M.x")
assertEqual(3, M.y,  "M.y")
assertEqual(4, M.xy, "M.xy")
assertEqual(5, C.w,  "M.w")
assertEqual(6, C.x,  "M.x")
assertEqual(7, C.y,  "M.y")
assertEqual(8, C.xy, "M.xy")
# Unary Plus
P = +C
assertEqual(+5, P.w,  "M.w")
assertEqual(+6, P.x,  "M.x")
assertEqual(+7, P.y,  "M.y")
assertEqual(+8, P.xy, "M.xy")
# Unary Minus
M = -C
assertEqual(-5, M.w,  "M.w")
assertEqual(-6, M.x,  "M.x")
assertEqual(-7, M.y,  "M.y")
assertEqual(-8, M.xy, "M.xy")
# Reversion
R = ~C
assertEqual(5, R.w,  "M.w")
assertEqual(6, R.x,  "M.x")
assertEqual(7, R.y,  "M.y")
assertEqual(-8, R.xy, "M.xy")

A = Euclidean2(random(), random(), random(), random())
a00 = A.w
a01 = A.x
a10 = A.y
a11 = A.xy

B = Euclidean2(random(), random(), random(), random())
b00 = B.w
b01 = B.x
b10 = B.y
b11 = B.xy

M = A + B
m00 = a00 + b00
m01 = a01 + b01
m10 = a10 + b10
m11 = a11 + b11
assertEqual(m00, M.w,  "(A + B).w")
assertEqual(m01, M.x,  "(A + B).x")
assertEqual(m10, M.y,  "(A + B).y")
assertEqual(m11, M.xy, "(A + B).xy")

M = A - B
m00 = a00 - b00
m01 = a01 - b01
m10 = a10 - b10
m11 = a11 - b11
assertEqual(m00, M.w,  "(A - B).w")
assertEqual(m01, M.x,  "(A - B).x")
assertEqual(m10, M.y,  "(A - B).y")
assertEqual(m11, M.xy, "(A - B).xy")

M = A * B
m00 = a00 * b00 + a01 * b01 + a10 * b10 - a11 * b11
m01 = a00 * b01 + a01 * b00 - a10 * b11 + a11 * b10
m10 = a00 * b10 + a01 * b11 + a10 * b00 - a11 * b01
m11 = a00 * b11 + a01 * b10 - a10 * b01 + a11 * b00
assertEqual(m00, M.w,  "(A * B).w")
assertEqual(m01, M.x,  "(A * B).x")
assertEqual(m10, M.y,  "(A * B).y")
assertEqual(m11, M.xy, "(A * B).xy")

M = A ^ B
m00 = a00 * b00
m01 = a00 * b01 + a01 * b00
m10 = a00 * b10             + a10 * b00
m11 = a00 * b11 + a01 * b10 - a10 * b01 + a11 * b00
assertEqual(m00, M.w,  "(A ^ B).w")
assertEqual(m01, M.x,  "(A ^ B).x")
assertEqual(m10, M.y,  "(A ^ B).y")
assertEqual(m11, M.xy, "(A ^ B).xy")

M = 1.0 << A
m00 = A.w
m01 = A.x
m10 = A.y
m11 = A.xy
assertEqual(m00, A.w,  "(1.0 << A).w")
assertEqual(m01, A.x,  "(1.0 << A).x")
assertEqual(m10, A.y,  "(1.0 << A).y")
assertEqual(m11, A.xy, "(1.0 << A).xy")

M = 1 << A
m00 = A.w
m01 = A.x
m10 = A.y
m11 = A.xy
assertEqual(m00, A.w,  "(1 << A).w")
assertEqual(m01, A.x,  "(1 << A).x")
assertEqual(m10, A.y,  "(1 << A).y")
assertEqual(m11, A.xy, "(1 << A).xy")
