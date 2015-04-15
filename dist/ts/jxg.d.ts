//
// Copyright 2015 David Holmes, https://github.com/geometryzen
//
/**
 * JSXGraph namespace.
 */
declare module JXG {
    /**
     * Converts HSV color to RGB color. Based on C Code in "Computer Graphics -- Principles and Practice," Foley et al, 1996, p. 593. See also http://www.efg2.com/Lab/Graphics/Colors/HSV.htm 
     * @param H value between 0 and 360
     * @param S value between 0.0 (shade of gray) to 1.0 (pure color)
     * @param V value between 0.0 (black) to 1.0 (white)
     * @return RGB color string
     */
    export function hsv2rgb(H: number, S: number, V: number): string;
    /**
     * This is the basic class for geometry elements like points, circles and lines. 
     */
    export interface GeometryElement {
    }
    /**
     *
     */
    export interface CoordsElement {
        /**
         * Getter method for x, this is used by for CAS-points to access point coordinates.
         */
        X(): number;
        /**
         * Getter method for y, this is used by for CAS-points to access point coordinates.
         */
        Y(): number;
    }
    /**
     *
     */
    export interface Curve extends GeometryElement {
    }
    /**
     *
     */
    export interface Sector extends Curve {
    }
    /**
     *
     */
    export interface Angle extends Sector {
        /**
         * Set an angle to a prescribed value given in radians. This is only possible if the third point of the angle, i.e. the anglepoint is a free point.
         * @param val Number or Function which returns the size of the angle in Radians.
         */
        setAngle(val: any): Angle
    }
    /**
     *
     */
    export interface Functiongraph {
    }
    /**
     *
     */
    export interface Point extends CoordsElement {
    }
    /**
     *
     */
    export interface Line extends GeometryElement {
    }
    /**
     *
     */
    export interface Segment extends Line {
    }
    /**
     *
     */
    export interface Tapemeasure extends Segment {
    }
    /**
     *
     */
    export interface Turtle extends GeometryElement {
        /**
         *
         */
        pos: number[];
        /**
         * Move the turtle forward.
         @param len of forward move in user coordinates
         */
        forward(len: number): Turtle;
        /**
         * Moves the turtle to position [0,0].
         */
        home(): Turtle;
        /**
         * Rotate the turtle direction to the left.
         * @param {number} angle of the rotation in degrees
         */
        left(angle: number): Turtle;
        /**
         * Rotate the turtle direction to the right.
         * @param {number} angle of the rotation in degrees
         */
        right(angle: number): Turtle;
        /**
         * Sets the pen color. Equivalent to setAttribute({strokeColor:color}) but affects only the future turtle.
         */
        setPenColor(color: string): Turtle;
        /**
         * Sets the pen size. Equivalent to setAttribute({strokeWidth:size}) but affects only the future turtle.
         */
        setPenSize(size: number): Turtle;
    }
    /**
     *
     */
    export interface Board {
        /**
         *
         */
        create(elementType: "angle", parents: any[], attributes?: {}): Angle;
        /**
         *
         */
        create(elementType: "curve", parents: any[], attributes?: {}): Curve;
        /**
         *
         */
        create(elementType: "line", parents: any[], attributes?: {}): Line;
        /**
         *
         */
        create(elementType: "point", parents: number[], attributes?: {}): Point;
        /**
         *
         */
        create(elementType: "functiongraph", parents: any[], attributes?: {}): Functiongraph;
        /**
         *
         */
        create(elementType: "tapemeasure", parents?: [number[]], attributes?: {}): Tapemeasure;
        /**
         *
         */
        create(elementType: "turtle", parents?: number[], attributes?: {}): Turtle;
        /**
         * Stop updates of the board.
         * @return Reference to the board
         */
        suspendUpdate(): Board;
        /**
         * Enables updates of the board.
         * @return Reference to the board
         */
        unsuspendUpdate(): Board;
    }
    /**
     *
     */
    export interface Graph {
        /**
         * Initialize a new board.
         * @param box Html-ID to the Html-element in which the board is painted.
         * @param attributes An object that sets some of the board properties. Most of these properties can be set via JXG.Options.
         * @returns Reference to the created board.
         */
        initBoard(box: string, attributes: { axis?: boolean; boundingbox?: number[]; showCopyright?: boolean}): Board;
    }
    /**
     *
     */
    var JSXGraph: Graph;
    /**
     *
     */
    var VERSION: string;
}
