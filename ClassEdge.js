class ClassEdge {
    /**
     * @description             Define an edge between two nodes
     *
     * @param {Object} rcd      RCD the edge belongs to
     * @param {string} fromId   ID of the source node
     * @param {string} toId     ID of the target node
     * @param {float}  weight   Trade volume in Mrd. EUR
     */
    constructor(rcd, fromId, toId, weight) {
        this.rcd    = rcd;
        this.from   = rcd.findNode(fromId);
        this.to     = rcd.findNode(toId);
        this.weight = weight;

        if (this.from == undefined)
            throw new Error('Node-Id ' + fromId + ' nicht gefunden!');
        if (this.to == undefined)
            throw new Error('Node-Id ' + toId   + ' nicht gefunden!');

        this.line = _addSVG(rcd.svg, 'line', {class: 'edge'});
        //_setAttr(this.line, {'pointer-events': 'stroke', 'stroke-width': '15'}); // unsichtbarer Klickbereich


        // Zeigt beim Hovern über eine Kante das genaue Handelsvolumen an.
        let tooltip = document.getElementById('tooltip');

        this.line.addEventListener('mouseover', (e) => {
            tooltip.style.display = 'block';
            tooltip.textContent   = `${this.from.label} --> ${this.to.label} : ${this.weight} Mrd. €`;
        });

        // Aktualisiert die Position des Tooltip bei jeder Mausbewegung. e.pagex und e.pagey sind die aktuellen
        // Das +12 verschiebt die den Tooltip leicht nach rechts und unten, damit er die Linie nicht verdeckt.
        this.line.addEventListener('mousemove', (e) => { //Arrow function, die das Event-Objekt e als Parameter übernimmt
            tooltip.style.left = (e.pageX + 12) + 'px';
            tooltip.style.top  = (e.pageY + 12) + 'px';
        });

        this.line.addEventListener('mouseout', () => {
            tooltip.style.display = 'none';
        });

    } // constructor

    /**
     * @description     Draw the edge between the two nodes
     *                  Line width is proportional to the trade volume
     *
     * @param {float} maxWeight     Maximum weight in the diagram
     */
    draw(maxWeight) {   // holt die Mittelpunkte der zwei verbundenen Knoten
        let p1 = this.from.center();
        let p2 = this.to.center();

        // strokeWidth = volume / maxVolume * maxWidth
        let maxWidth   = 11;
        let minWidth   = 1;
        let strokeWidth = minWidth + (maxWidth - minWidth) * (this.weight / maxWeight);

        // Color based on trade volume
        let color;
        if (this.weight <= 60)
            color = '#ff7700';  // Orange 30, 48, 55
        else if (this.weight <= 110)
            color = '#ff0000';    // light red 83, 85, 95, 105
        else
            color = '#800000';    // dark red 120, 172, 195, 209, 210

        _setAttr(this.line, {       // setzt alle Attribute der Linie
            x1: p1.x, y1: p1.y,
            x2: p2.x, y2: p2.y,
            'stroke-width': strokeWidth,
            stroke: color
        });
    } // draw()
} // class ClassEdge
