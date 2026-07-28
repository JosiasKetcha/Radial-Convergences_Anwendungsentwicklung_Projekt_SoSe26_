/** 
 * @description         Apply setAttribute to a DOM object
 * 
 * @param {Object} o    Object of the DOM setAttribute() is applied to
 * @param {Object} a    Object that contains a set of attributes and their values
 */
function _setAttr(o, a) {
    for (let i in a)
        o.setAttribute(i, a[i]);
} // _setAttr(o, a)

/** 
 * @description         Create a SVG element, add it to its context, 
 *                      set its attributes and return it
 * 
 * @param {Object} c    SVG-Context of the element
 * @param {string} f    Form of the SVG to add
 * @param {Object} a    Object with all attributes and their new values
 * 
 * @return              The new SVG element
 */
function _addSVG(c, f, a) {
	let n = document.createElementNS('http://www.w3.org/2000/svg', f);
	_setAttr(n,a);
	return c.appendChild(n);
} // _addSVG(c, f, a)

/** 
 * @description         Create a multi-row SVG-text-field; $ in t indicate a linebreak
 * 
 * @param {Object} c    SVG-Context of the text
 * @param {string} t    Text to be added; a $ indicates a linebreak
 * @param {bool} s      If true, a UNICODE symbol is added with innerHTML
 * 
 * @return              The new SVG element
 */
function _addText(c, t, s) {
    let n = _addSVG(c, 'text', {class:'label'});
    let f = parseInt(window.getComputedStyle(n)['font-size']);
    if (s)
        n.style.fontSize = (f+5)+'px';
    
    for (let r of t.split("$"))
        if (s)
            _addSVG(n, 'tspan', {x:0, dy:(f+6)}).innerHTML = r;
        else
            _addSVG(n, 'tspan', {x:0, dy:(f+1)}).textContent = r;

    return n;
} // _addText(c, t, s)

/** 
 * @description         Put a text in the SVG in place
 * 
 * @param {Object} t    Text object in the DOM that consists of TSPAN elements
 * @param {Object} p    Object with the position attributes x and y
 */
function _positionText(t, p) {
    let b = t.getBBox();
    _setAttr(t, {y:(p.y-(b.height/2)-(2*b.y))});

    for (let n of t.children)
        _setAttr(n, {x:p.x});
} // _positionText(t, p)

// Global variables for the grid-size
var   _gridRows = 0;
var   _gridCols = 0; 
var   _gridWidth = 0; 
var   _gridHeight = 0; 
// Global variables for the node-size
var   _labelWidth = 0; 
var   _labelHeight = 0; 
const _indent = 4;
var   _nodeWidth = 0; 
var   _nodeHeight = 0; 

/** 
 * @description         Display a grid to better understand the layout
 * 
 * @param {Object} c    SVG-Context of the grid
 */
/*function _addGrid(c) {
    let width = (_gridCols+1)*_gridWidth;
    for (let i=0; i<=(_gridRows+1); i++)
        _addSVG(c, 'path', {d:`M0 ${i*_gridHeight} h${width}`, class:'grid'});
        
    let height = (_gridRows+1)*_gridHeight;
    for (let i=0; i<=(_gridCols+1); i++)
        _addSVG(c, 'path', {d:`M${i*_gridWidth} 0 v${height}`, class:'grid'});
} // _addGrid(c)*/