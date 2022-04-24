//Base de datos en donde se almacenan las conexiones y sus valores.
var baseDatos = [];

//Estos arrays sirven para verificar que un nodo tenga un solo nodo a la izquierda y uno solo a la derecha
var rightConnections=[];
var leftConnections=[];
rightConnections.push({sourceId:123,targetId:456});
leftConnections.push({sourceId:123,targetId:456});

//Buscar el valor actual de la conexion si se lo pusieron previamente.
function valorActual(buscar) {
    let i = 0;
    baseDatos.forEach(function (elemento) {
        if (elemento.llave == buscar) {
            i = 1;
            document.getElementById('valorActual').value = elemento.valor;
        }
    });
    if (i == 0) {
        document.getElementById("valorActual").value = "0";
    }
    document.getElementById("valorNuevo").value = "";
}
//Guardar el valor de la conexion en la base de datos, actualizar si ya existe.
function guardarAtributo(key, value) {
    nuevo = { llave: key, valor: value };
    let i = 0;
    baseDatos.forEach(function (elemento) {
        if (elemento.llave == nuevo.llave) {
            elemento.valor = nuevo.valor;
            i = 1;
        }
    });
    if (i == 0) {
        baseDatos.push(nuevo);
    }
}

//Eliminar las conexiones del nodo que esta siendo eliminado de la base de datos.
function eliminarNodo(idNodo) {
    for (i = 0; i < baseDatos.length; i++) {
        if ((baseDatos[i].llave).includes(idNodo)) {
            baseDatos.splice(i, 1);
            i--;
        }
    }
    for (i = 0; i < rightConnections.length; i++) {
        if (rightConnections[i].sourceId==idNodo || rightConnections[i].targetId==idNodo) {
            rightConnections.splice(i, 1);
            i--;
        }
    }
    for (i = 0; i < leftConnections.length; i++) {
        if (leftConnections[i].sourceId==idNodo || leftConnections[i].targetId==idNodo) {
            leftConnections.splice(i, 1);
            i--;
        }
    }
}

//Validar que ya tiene una conexion de entrada
function tieneConexionEntrada(targetId){
    let val = false;
    for (i = 0; i < rightConnections.length; i++) {
        if (rightConnections[i].targetId==targetId) {
            val=true;
        }
    }
    for (i = 0; i < leftConnections.length; i++) {
        if (leftConnections[i].targetId==targetId) {
            val=true;
        }
    }
    return val;
}

function hasRightNode(info){
    let val = false;
    for(i=0;i<rightConnections.length;i++){
        if(rightConnections[i].sourceId==info.sourceId){
            val=true;
            break;
        }
    }
    if(val==false){
        obj={sourceId:info.sourceId, targetId:info.targetId};
        rightConnections.push(obj);
        console.log("Se agrego la conexion");
        console.log(rightConnections);
    }
    return val;
}

function hasLeftNode(info){
    let val = false;
    for(i=0;i<leftConnections.length;i++){
        if(leftConnections[i].sourceId==info.sourceId){
            val=true;
            break;
        }
    }
    if(val==false){
        obj={sourceId:info.sourceId, targetId:info.targetId};
        leftConnections.push(obj);
        console.log("Se agrego la conexion");
        console.log(leftConnections);
    }
    return val;
}

function validateLeftValue(targetId,value){
    var validacion = false;
    var sourceId="";
    for(i=0;i<leftConnections.length;i++){
        if(leftConnections[i].targetId==targetId){
            sourceId=leftConnections[i].sourceId;
            break;
        }
    }
    var fatherValue=getNodeValue(sourceId);
    if (parseInt(value,10)<parseInt(fatherValue,10)){
        validacion = true;
    }
    return validacion;
}

function validateRightValue(targetId,value){
    var sourceId="";
    for(i=0;i<rightConnections.length;i++){
        if(rightConnections[i].targetId==targetId){
            sourceId=rightConnections[i].sourceId;
            break;
        }
    }
    fatherValue=getNodeValue(sourceId);
    if (parseInt(value,10)>parseInt(fatherValue,10)){
        return true;
    }
    return false;
}
// Funcion para eliminar la conexion de los arrays de conexiones
function deleteConnection (targetId){
    for (i = 0; i < rightConnections.length; i++) {
        if (rightConnections[i].targetId==targetId) {
            rightConnections.splice(i, 1);
            i--;
            console.log("Se elimino de right connections");
        }
    }
    for (i = 0; i < leftConnections.length; i++) {
        if (leftConnections[i].targetId==targetId) {
            leftConnections.splice(i, 1);
            i--;
            console.log("Se elimino de left connections");
        }
    }
}
//Funcion para obtener el valor de un nodo;
function getNodeValue(idNodo){
    baseDatos.forEach(function (elemento) {
        if (elemento.llave == idNodo) {
            valor = parseInt(elemento.valor,10);
        }
    });
    return valor;
}
//Activar y desactivar el fondo blanco o cuadriculado.
function funcionFondoCB() {
    var checkBox = document.getElementById("flexCheckDefault");
    var bg = document.getElementById("diagram");
    if (checkBox.checked == true) {
        bg.style.background = "none";
        bg.style.backgroundColor = "#ffffff"
    } else {
        bg.style.backgroundImage = "url('../resources/images/Imagen1.png')";
    }
}

//--------------------------------------------------------------------------------------------------------------
//Guardar graphy
function guardarGrafo(){
    var nombreArchivo=document.getElementById("nombreArchivo").value;
    var data = document.getElementById('diagram').innerHTML;
    var contenidoR = "";
    var contenidoL = "";

    for(dato=1;dato<rightConnections.length;dato++){
        contenidoR+="Src:"+rightConnections[dato].sourceId+",Trg:"+rightConnections[dato].targetId+"|";
    }
    

    for(dato=1;dato<leftConnections.length;dato++){
        contenidoL+="Src:"+leftConnections[dato].sourceId+",Trg:"+leftConnections[dato].targetId+"|";
    }
    data+=`<div class="contenedor-conexiones-right"><!--${contenidoR}--></div>`;
    data+=`<div class="contenedor-conexiones-left"><!--${contenidoL}--></div>`;

    var textFileAsBlob = new Blob([data], {type:'text/txt'});
    // Specify the name of the file to be saved
    var fileNameToSaveAs = nombreArchivo+".txt";

    // create a link for our script to 'click'
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "My Hidden Link";
    
    // allow our code to work in webkit & Gecko based browsers
    // without the need for a if / else block.
    window.URL = window.URL || window.webkitURL;
        
    // Create the link Object.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    // when link is clicked call a function to remove it from
    // the DOM in case user wants to save a second file.
    downloadLink.onclick = destroyClickedElement;
    // make sure the link is hidden.
    downloadLink.style.display = "none";
    // add the link to the DOM
    document.body.appendChild(downloadLink);
    
    // click the new link
    downloadLink.click();

    function destroyClickedElement(event){
    //remove the link from the DOM
        document.body.removeChild(event.target);
    }
}
//--------------------------------------------------------------------------------------------------------------
//Subir grafo
function subirGrafo(evento){
    document.getElementById('diagram').innerHTML='';
    let archivo = evento.target.files[0];
    if(archivo){
        let reader = new FileReader();
        reader.onload = function(e){
            let contenido = e.target.result;
            document.getElementById('diagram').innerHTML = contenido;    
        }
        reader.readAsText(archivo);
        document.querySelector("#habilitar-div").classList.add('habilitar-activo');
    } else {
        window.alert("No se ha seleccionado un archivo.");   
    }
}
// Funcion para detectar la carga del archivo
window.addEventListener('load', () => {
    document.getElementById('file-input').addEventListener('change', subirGrafo);
});

// Funcion para activar el input-file al presionar el boton Subir graphy.
document.getElementById("subirGrafo").addEventListener('click', function() {
    document.getElementById("file-input").click();
});

function agregarValoresNodos(){
    var nodos = document.getElementById('diagram').getElementsByClassName('control');
    for (i = 0; i < nodos.length; i++) {
      var numero = nodos[i].getElementsByTagName('h5')[0].innerText;
      var idNodo = nodos[i].id;
      baseDatos.push({ llave:idNodo, valor: numero});
    } 

  }
//---------------------------------------------------------------------------------------------------------
function recorridos() {
    var nodosRaiz = document.getElementsByClassName('root');
    var raiz = nodosRaiz[1].id;
    if(raiz!=null){
        var vectorInOrder = inOrder();
        var html1 = '';
        for(i=0; i<vectorInOrder.length-1; i++) {
            html1+=`${vectorInOrder[i]}, `;
        }
        html1+=`${vectorInOrder[vectorInOrder.length-1]}`;
        $('#recorridoInOrder').html(html1);
        var vectorPreOrder = preOrder();
        var html2 = '';
        for(j=0; j<vectorPreOrder.length-1; j++) {
            html2+=`${vectorPreOrder[j]}, `;
        }
        html2+=`${vectorPreOrder[vectorPreOrder.length-1]}`;
        $('#recorridoPreOrder').html(html2);
        var vectorPostOrder = postOrder();
        var html3 = '';
        for(k=0; k<vectorPostOrder.length-1; k++) {
            html3+=`${vectorPostOrder[k]}, `;
        }
        html3+=`${vectorPostOrder[vectorPostOrder.length-1]}`;
        $('#recorridoPostOrder').html(html3);
    }
}
function inOrder() {
    var valoresNodos = [];
    for(i=0; i<baseDatos.length; i++){
        valoresNodos.push(baseDatos[i].valor);
        console.log(baseDatos[i].llave);
    }
    valoresNodos = valoresNodos.sort(function(a, b) {return a - b});
    console.log(valoresNodos);
    return valoresNodos;
}
function preOrder() {
    var preorder = [];
    var nodosRaiz = document.getElementsByClassName('root');
    var raiz = nodosRaiz[1].id;
    llenarPreOrder(preorder, raiz);
    console.log(preorder);
    return preorder;
}
function llenarPreOrder (vector, id){
    if(id!=null){
        vector.push(valorNodo(id));
        llenarPreOrder(vector, hijoIzquierdo(id));
        llenarPreOrder(vector, hijoDerecho(id));
    }
}
function postOrder() {
    var postorder = [];
    var nodosRaiz = document.getElementsByClassName('root');
    var raiz = nodosRaiz[1].id;
    llenarPostOrder(postorder, raiz);
    console.log(postorder);
    return postorder;
}
function llenarPostOrder (vector, id){
    if(id!=null){
        llenarPostOrder(vector, hijoIzquierdo(id));
        llenarPostOrder(vector, hijoDerecho(id));
        vector.push(valorNodo(id));
    }
}
function valorNodo (id){
    var valor = 0;
    for(i=0; i<baseDatos.length; i++){
        if(baseDatos[i].llave==id){
            valor = baseDatos[i].valor;
            break;
        }
    }
    return valor;
}
function hijoIzquierdo(id){
    var aux = null;
    for(i=1; i<leftConnections.length; i++){
        if(leftConnections[i].sourceId == id) {
            aux = leftConnections[i].targetId;
            break;
        }
    }
    return aux;
}
function hijoDerecho(id){
    var aux = null;
    for(i=1; i<rightConnections.length; i++){
        if(rightConnections[i].sourceId == id) {
            aux = rightConnections[i].targetId;
            break;
        }
    }
    return aux;
}
//---------------------------------------------------------------------------------------------------------
function cadenaSeparar () {
    var cadena = document.getElementById("cadenaValores").value;
    console.log(cadena);
    if(cadena!=""){
        var valores = cadena.split(',');
        console.log(valores);
        if(valores.includes('')){
            habilitarMensaje('Error existen espacios en blanco en tu cadena, revísala por favor :(');
        } else {
            if(buscarRepetidos(valores)){
                habilitarMensaje('Error existen elementos repetidos, revisa los valores de tu cadena :(');
            } else {
                document.getElementById("cadenaModal").click();
            }
        }
    } else {
        habilitarMensaje('La cadena que quieres mandar esta vacía :(');
    }
}
function buscarRepetidos(valores){
    var flag = false;
    for(i=0; i<valores.length; i++){
        for(j=i+1; j<valores.length; j++){
            if(parseInt(valores[i])==parseInt(valores[j])){
                flag = true;
                break;
            }
        }
        if(flag==true){
            break;
        }
    }
    return flag;
}
function habilitarMensaje(mensaje){
    $('#mensaje').html(mensaje);
    document.querySelector("#mensaje").classList.add('habilitar-mensaje-activo');
    setTimeout(function(){
        document.querySelector("#mensaje").classList.remove('habilitar-mensaje-activo');
    }, 4000);
}