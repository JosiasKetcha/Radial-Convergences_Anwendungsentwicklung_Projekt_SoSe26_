let rcd;

function main() {
    try{
        rcd = new ClassRCD();

        // Nodes - 8 europäische Länder
        rcd.addNode('Deutschland',  'Deutschland');
        rcd.addNode('Frankreich',   'Frankreich');
        rcd.addNode('Italien',      'Italien');
        rcd.addNode('Spanien',      'Spanien');
        rcd.addNode('Polen',        'Polen');
        rcd.addNode('Niederlande',  'Niederlande');
        rcd.addNode('Belgien',      'Belgien');
        //rcd.addNode('Spanien',      'Spanien');  Spanien an dieser Stelle und oben löschen, um genau dasselbe wie Projektskizze
        rcd.addNode('Österreich',   'Österreich');


        // Edges - Handelsbeziehungen 2023 (Mrd. EUR)
        rcd.addEdge('Deutschland', 'Frankreich',  209);
        rcd.addEdge('Deutschland', 'Italien',     120);
        rcd.addEdge('Deutschland', 'Polen',       172);
        rcd.addEdge('Deutschland', 'Niederlande', 195);
        rcd.addEdge('Deutschland', 'Belgien',      95);
        rcd.addEdge('Frankreich',  'Italien',     105);
        rcd.addEdge('Frankreich',  'Spanien',      83);
        rcd.addEdge('Frankreich',  'Belgien',      85);
        rcd.addEdge('Italien',     'Spanien',      55);
        rcd.addEdge('Italien',     'Österreich',   48);
        rcd.addEdge('Spanien',     'Polen',        30);
        rcd.addEdge('Niederlande', 'Belgien',     210);

        rcd.show();

    } catch (error){
        alert(error.message);
    }
    
} // main()


/** 
 * @description 		    Load CSV-file data
 */
function load() {
	if (!(file = document.getElementById('inputfile').files[0])) 
        return;

	let reader = new FileReader();
	reader.onload = function(evt) {
        // SVG löschen und neu aufbauen
        rcd = new ClassRCD();
        rcd.build(evt.target.result);
        rcd.show();
	}
	reader.readAsText(file);
} // load();