class ClassRCD {
    /**
     * @description     Root container for the Radial Convergences Diagram
     */
    constructor() {
        // Initialize the SVG-Element with filter
        for (let s of document.getElementsByTagName('svg')) 
            document.body.removeChild(s);
        this.svg   = _addSVG(document.body, 'svg', {});

        let d = _addSVG(this.svg, 'defs', {});
        let f = _addSVG(d, 'filter', {id:'f1', width:'200%', height:'200%'});
        _addSVG(f, 'feOffset', {in:'SourceGraphic', result:'offOut', 
            dx:'3', dy:'3'});
        _addSVG(f, 'feColorMatrix', {in:'offOut', result:'matrixOut', 
            type:'matrix', values:'0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 1 0'});
        _addSVG(f, 'feGaussianBlur', {in:'matrixOut', result:'blurOut', 
            stdDeviation:'3'});
        _addSVG(f, 'feBlend', {in:'SourceGraphic', mode:'normal'});

        //remember all nodes and edges
        this.nodes = [];
        this.edges = [];
    } // constructor()

    /**
     * @description             Add a node to the diagram
     *
     * @param {string} id       Internal identifier
     * @param {string} label    Label displayed on the diagram
     */
    addNode(id, label) {
        // angle is computed later in show() once all nodes are known
        this.nodes.push({id: id, label: label, node: null});
    } // addNode()

    /**
     * @description             Add an edge between two nodes
     *
     * @param {string} fromId   ID of the source node
     * @param {string} toId     ID of the target node
     * @param {float}  weight   Trade volume in Mrd. EUR
     */
    addEdge(fromId, toId, weight) {
        this.edges.push({fromId: fromId, toId: toId, weight: weight, edge: null});
    } // addEdge()


    build(fileAsText) {
        let rows = fileAsText.split('\r\n');
        let edges = [];     // erst sammeln, dann erstellen
        let nodeIds = [];   // für unique nodes

        // erste Zeile ist Überschrift, ab i=1
        for (let i = 1; i < rows.length; i++) {
            let node = rows[i].split(';');
            for (let j = 0; j < node.length; j++)
                node[j] = node[j].trim();

            if (node[0] == '') continue;        // leere Zeile überspringen

            //  from-Node
            if (!nodeIds.includes(node[0])) {
                this.addNode(node[0], node[0]);  // id = label
                nodeIds.push(node[0]);
            }
            // to-Node 
            if (!nodeIds.includes(node[1])) {
                this.addNode(node[1], node[1]);
                nodeIds.push(node[1]);
            }

            // Edge merken, genau wie bei arcs.push()
            if (node[2] != '')
                edges.push({fromId: node[0], toId: node[1], weight: parseInt(node[2])});
        }

        // Alle Edges erstellen
        for (let e of edges)
            this.addEdge(e.fromId, e.toId, e.weight);

    } // build()

    /**
     * @description             Find the node object with given id
     *
     * @param {string} id       Internal identifier of the node to be found
     */
    findNode(id) {
        for (let n of this.nodes)
            if (n.id == id)
                return n.node;
    } // findNode()

    /** 
    * @description 		    Mark nodes that match the search term
    */
    highlight(id) {
        // Reset — alle Edges wieder sichtbar
        for (let e of this.edges)
            e.edge.line.classList.remove('edge-hidden');

        // Alle Edges ausblenden die nicht mit dem geklickten Node verbunden sind
        for (let e of this.edges)
            if (e.fromId != id && e.toId != id)
                e.edge.line.classList.add('edge-hidden');
    } // highlight()

    resetHighlight() {
        for (let e of this.edges)
            e.edge.line.classList.remove('edge-hidden');
    } // resetHighlight()


    /**
     * @description     Show the entire Radial Convergences diagram
     */
    show() {
        let n      = this.nodes.length;
        let width  = 900;
        let height = 700;
        let cx     = width  / 2;
        let cy     = height / 2;
        let R      = 250;   // radius of node ring

        _setAttr(this.svg, {width: width, height: height});

        // Compute angles and create ClassNode objects
        for (let i = 0; i < n; i++) {
            let angle = -Math.PI / 2 + i * (2 * Math.PI / n); // start at top
            let nd    = this.nodes[i];
            nd.node   = new ClassNode(this, nd.id, nd.label, angle);
        }

        // Find max weight for proportional line width
        let maxWeight = 0;
        for (let e of this.edges)
            if (e.weight > maxWeight) maxWeight = e.weight;

        // Draw nodes first so x/y coordinates are computed
        for (let nd of this.nodes)
            nd.node.draw(cx, cy, R);

        // Create ClassEdge objects (nodes must exist and have x/y)
        for (let e of this.edges)
            e.edge = new ClassEdge(this, e.fromId, e.toId, e.weight);

        // Draw edges
        for (let e of this.edges)
            e.edge.draw(maxWeight);

        // Bring node circles to front by re-appending them
        for (let nd of this.nodes) {
            this.svg.appendChild(nd.node.circle);
            this.svg.appendChild(nd.node.text);
        }

        // Anfang Legende
        let legendX = 760;
        let legendY = 620;

        // Rechtseck um Legende
        _addSVG(this.svg, 'rect', {
            x: legendX - 8,
            y: legendY - 15,
            width:  140,
            height: 85,
            fill:   '#f4f4f4',
            stroke: '#cccccc',
            'stroke-width': 2,
        });

        
        // Titel
        let titel = _addText(this.svg, 'Handelsvolumen');
        _setAttr(titel, {x: legendX, y: legendY, 'text-anchor': 'start', class: 'legend-label'});
        _setAttr(titel.firstChild, {x: legendX, dy: 0});

        // Linie 1 - orange
        let l1 = _addSVG(this.svg, 'line', {
            x1: legendX, y1: legendY+15, x2: legendX+35, y2: legendY+15,
            stroke: '#ff7700', 'stroke-width': 2});
        let t1 = _addText(this.svg, '≤ 60 Mrd. €');
        _setAttr(t1, {x: legendX+45, y: legendY+19, 'text-anchor': 'start', class: 'legend-label'});
        _setAttr(t1.firstChild, {x: legendX+45, dy: 0});

        // Linie 2 - light red
        let l2 = _addSVG(this.svg, 'line', {
            x1: legendX, y1: legendY+35, x2: legendX+35, y2: legendY+35,
            stroke: '#ff0000', 'stroke-width': 5});
        let t2 = _addText(this.svg, '≤ 110 Mrd. €');
        _setAttr(t2, {x: legendX+45, y: legendY+39, 'text-anchor': 'start', class: 'legend-label'});
        _setAttr(t2.firstChild, {x: legendX+45, dy: 0});

        // Linie 3 - dark red
        let l3 = _addSVG(this.svg, 'line', {
            x1: legendX, y1: legendY+55, x2: legendX+35, y2: legendY+55,
            stroke: '#800000', 'stroke-width': 9});
        let t3 = _addText(this.svg, '> 110 Mrd. €');
        _setAttr(t3, {x: legendX+45, y: legendY+59, 'text-anchor': 'start', class: 'legend-label'});
        _setAttr(t3.firstChild, {x: legendX+45, dy: 0});
    } // show()
} // class ClassRCD
