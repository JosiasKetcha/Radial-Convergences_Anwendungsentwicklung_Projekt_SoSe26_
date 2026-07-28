class ClassNode {
    /**
     * @description             Define a node of a Radial Convergences diagram
     *
     * @param {Object} rcd      RCD the node belongs to
     * @param {string} id       Internal name for the node
     * @param {string} label    Label displayed on the diagram
     * @param {float}  angle    Angle on the circle (in radians)
     */
    constructor(rcd, id, label, angle) {
        this.rcd   = rcd;
        this.id    = id;
        this.label = label;
        this.angle = angle;

        // x/y are computed in draw() once R is known
        this.x = 0;
        this.y = 0;

        // SVG elements
        this.circle = _addSVG(rcd.svg, 'circle', {class: 'node'});
        this.text   = _addText(rcd.svg, label, false);

        // Klick - highlight
        this.circle.addEventListener('click', () => {
            rcd.highlight(id);
        });

        // Doppelklick - reset
        this.circle.addEventListener('dblclick', () => {
            rcd.resetHighlight();
        });
    } // constructor

    /**
     * @description     Center point of the node
     */
    center() {
        return {x: this.x, y: this.y};
    } // center()

    /**
     * @description     Draw the node at its position on the circle
     *
     * @param {float} cx    Center x of the node
     * @param {float} cy    Center y of the node
     * @param {float} R     Radius of the node ring
     */
    draw(cx, cy, R) {
        this.x = cx + R * Math.cos(this.angle);
        this.y = cy + R * Math.sin(this.angle);

        _setAttr(this.circle, {cx: this.x, cy: this.y, r: 13});
       // _positionText(this.text, {x: this.x, y: this.y});

        // Push label outward from center
        let offset = 30;
        let lx = cx + (R + offset) * Math.cos(this.angle);
        let ly = cy + (R + offset) * Math.sin(this.angle);
        _setAttr(this.text, {x: lx, y: ly});
        for (let s of this.text.children)
            _setAttr(s, {x: lx});
        _setAttr(this.text.firstChild, {dy: 0});


        // Text anchor depending on position
        //bestimmt die horizontale Ausrichtung des Labels je nach Position des Knotens auf dem Kreis.
        //Der Schwellenwert 0.1 statt 0 verhindert dass Knoten die fast genau oben oder unten sind (cos ≈ 0.05) falsch zugeordnet werden.
        if (Math.cos(this.angle) < -0.1)
            _setAttr(this.text, {'text-anchor': 'end'}); //'end' = Text endet am angegebenen x-Punkt
        else if (Math.cos(this.angle) > 0.1)
            _setAttr(this.text, {'text-anchor': 'start'}); //'start' = Text beginnt am angegebenen x-Punkt
        else
            _setAttr(this.text, {'text-anchor': 'middle'});
        //Ohne diesen Code würden alle Labels nach rechts zeigen
    } // draw()
} // class ClassNode
