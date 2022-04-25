//Base de datos en donde se almacenan las conexiones y sus valores.
var baseDatos = [];

//Estos arrays sirven para verificar que un nodo tenga un solo nodo a la izquierda y uno solo a la derecha
var rightConnections = [];
var leftConnections = [];
rightConnections.push({ sourceId: 123, targetId: 456 });
leftConnections.push({ sourceId: 123, targetId: 456 });
var casoEspecialCadena = false;
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
        if (rightConnections[i].sourceId == idNodo || rightConnections[i].targetId == idNodo) {
            rightConnections.splice(i, 1);
            i--;
        }
    }
    for (i = 0; i < leftConnections.length; i++) {
        if (leftConnections[i].sourceId == idNodo || leftConnections[i].targetId == idNodo) {
            leftConnections.splice(i, 1);
            i--;
        }
    }
}

//Validar que ya tiene una conexion de entrada
function tieneConexionEntrada(targetId) {
    let val = false;
    for (i = 0; i < rightConnections.length; i++) {
        if (rightConnections[i].targetId == targetId) {
            val = true;
        }
    }
    for (i = 0; i < leftConnections.length; i++) {
        if (leftConnections[i].targetId == targetId) {
            val = true;
        }
    }
    return val;
}

function hasRightNode(info) {
    let val = false;
    for (r = 0; r < rightConnections.length; r++) {
        if (rightConnections[r].sourceId == info.sourceId) {
            val = true;
            break;
        }
    }
    if (val == false) {
        obj = { sourceId: info.sourceId, targetId: info.targetId };
        rightConnections.push(obj);
        console.log("Se agrego la conexion");
        console.log(rightConnections);
    }
    return val;
}

function hasLeftNode(info) {
    let val = false;
    for (l = 0; l < leftConnections.length; l++) {
        if (leftConnections[l].sourceId == info.sourceId) {
            val = true;
            break;
        }
    }
    if (val == false) {
        obj = { sourceId: info.sourceId, targetId: info.targetId };
        leftConnections.push(obj);
        console.log("Se agrego la conexion");
        console.log(leftConnections);
    }
    return val;
}

function validateLeftValue(targetId, value) {
    var validacion = false;
    var sourceId = "";
    for (i = 0; i < leftConnections.length; i++) {
        if (leftConnections[i].targetId == targetId) {
            sourceId = leftConnections[i].sourceId;
            break;
        }
    }
    var fatherValue = getNodeValue(sourceId);
    if (parseInt(value, 10) < parseInt(fatherValue, 10)) {
        validacion = true;
    }
    return validacion;
}

function validateRightValue(targetId, value) {
    var sourceId = "";
    for (i = 0; i < rightConnections.length; i++) {
        if (rightConnections[i].targetId == targetId) {
            sourceId = rightConnections[i].sourceId;
            break;
        }
    }
    fatherValue = getNodeValue(sourceId);
    if (parseInt(value, 10) > parseInt(fatherValue, 10)) {
        return true;
    }
    return false;
}
// Funcion para eliminar la conexion de los arrays de conexiones
function deleteConnection(targetId) {
    for (i = 0; i < rightConnections.length; i++) {
        if (rightConnections[i].targetId == targetId) {
            rightConnections.splice(i, 1);
            i--;
            console.log("Se elimino de right connections");
        }
    }
    for (i = 0; i < leftConnections.length; i++) {
        if (leftConnections[i].targetId == targetId) {
            leftConnections.splice(i, 1);
            i--;
            console.log("Se elimino de left connections");
        }
    }
}
//Funcion para obtener el valor de un nodo;
function getNodeValue(idNodo) {
    baseDatos.forEach(function (elemento) {
        if (elemento.llave == idNodo) {
            valor = parseInt(elemento.valor, 10);
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
function guardarGrafo() {
    var nombreArchivo = document.getElementById("nombreArchivo").value;
    var data = document.getElementById('diagram').innerHTML;
    var contenidoR = "";
    var contenidoL = "";

    for (dato = 1; dato < rightConnections.length; dato++) {
        contenidoR += "Src:" + rightConnections[dato].sourceId + ",Trg:" + rightConnections[dato].targetId + "|";
    }


    for (dato = 1; dato < leftConnections.length; dato++) {
        contenidoL += "Src:" + leftConnections[dato].sourceId + ",Trg:" + leftConnections[dato].targetId + "|";
    }
    data += `<div class="contenedor-conexiones-right"><!--${contenidoR}--></div>`;
    data += `<div class="contenedor-conexiones-left"><!--${contenidoL}--></div>`;

    var textFileAsBlob = new Blob([data], { type: 'text/txt' });
    // Specify the name of the file to be saved
    var fileNameToSaveAs = nombreArchivo + ".txt";

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

    function destroyClickedElement(event) {
        //remove the link from the DOM
        document.body.removeChild(event.target);
    }
}
//--------------------------------------------------------------------------------------------------------------
//Subir grafo
function subirGrafo(evento) {
    document.getElementById('diagram').innerHTML = '';
    let archivo = evento.target.files[0];
    if (archivo) {
        let reader = new FileReader();
        reader.onload = function (e) {
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
document.getElementById("subirGrafo").addEventListener('click', function () {
    document.getElementById("file-input").click();
});

//---------------------------------------------------------------------------------------------------------
function agregarValoresNodos() {
    var nodos = document.getElementById('diagram').getElementsByClassName('control');
    for (i = 0; i < nodos.length; i++) {
        var numero = nodos[i].getElementsByTagName('h5')[0].innerText;
        var idNodo = nodos[i].id;
        baseDatos.push({ llave: idNodo, valor: numero });
    }

}
function recorridos() {
    var nodosRaiz = document.getElementsByClassName('root');
    var raiz = nodosRaiz[1].id;
    if (raiz != null) {
        var vectorInOrder = inOrder();
        var html1 = '';
        for (i = 0; i < vectorInOrder.length - 1; i++) {
            html1 += `${vectorInOrder[i]}, `;
        }
        html1 += `${vectorInOrder[vectorInOrder.length - 1]}`;
        $('#recorridoInOrder').html(html1);
        var vectorPreOrder = preOrder();
        var html2 = '';
        for (j = 0; j < vectorPreOrder.length - 1; j++) {
            html2 += `${vectorPreOrder[j]}, `;
        }
        html2 += `${vectorPreOrder[vectorPreOrder.length - 1]}`;
        $('#recorridoPreOrder').html(html2);
        var vectorPostOrder = postOrder();
        var html3 = '';
        for (k = 0; k < vectorPostOrder.length - 1; k++) {
            html3 += `${vectorPostOrder[k]}, `;
        }
        html3 += `${vectorPostOrder[vectorPostOrder.length - 1]}`;
        $('#recorridoPostOrder').html(html3);
    }
}
function inOrder() {
    var valoresNodos = [];
    for (i = 0; i < baseDatos.length; i++) {
        valoresNodos.push(baseDatos[i].valor);
        console.log(baseDatos[i].llave);
    }
    valoresNodos = valoresNodos.sort(function (a, b) { return a - b });
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
function llenarPreOrder(vector, id) {
    if (id != null) {
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
function llenarPostOrder(vector, id) {
    if (id != null) {
        llenarPostOrder(vector, hijoIzquierdo(id));
        llenarPostOrder(vector, hijoDerecho(id));
        vector.push(valorNodo(id));
    }
}
function valorNodo(id) {
    var valor = 0;
    for (i = 0; i < baseDatos.length; i++) {
        if (baseDatos[i].llave == id) {
            valor = baseDatos[i].valor;
            break;
        }
    }
    return valor;
}
function hijoIzquierdo(id) {
    var aux = null;
    for (i = 1; i < leftConnections.length; i++) {
        if (leftConnections[i].sourceId == id) {
            aux = leftConnections[i].targetId;
            break;
        }
    }
    return aux;
}
function hijoDerecho(id) {
    var aux = null;
    for (i = 1; i < rightConnections.length; i++) {
        if (rightConnections[i].sourceId == id) {
            aux = rightConnections[i].targetId;
            break;
        }
    }
    return aux;
}

//----------------------------------------------------------------------------------------------------------------------------------------
// Cadena a arbol 🦝
function cadenaArbol(valores) {
    limpiar();
    casoEspecialCadena = true;
    agregarNodos(valores);
    posicionarNodos();
    agregarEndPoints();
    crearConexiones();
    agregarValoresNodos();
    instance.draggable($('.control'));
    casoEspecialCadena = false;  
}

function limpiar(){
     //limpiamos
     var diagrama = document.getElementById('diagram');
     diagrama.innerHTML = '';
     baseDatos = [];
     rightConnections = [];
     leftConnections = [];
     rightConnections.push({ sourceId: 123, targetId: 456 });
     leftConnections.push({ sourceId: 123, targetId: 456 });
}

function casoEspecialConexiones(){
    return casoEspecialCadena;
}

function crearConexiones(){
    for(n = 1;n<rightConnections.length;n++){
        crearNuevaFlecha(rightConnections[n].sourceId, rightConnections[n].targetId);
    }
    for(n = 1;n<leftConnections.length;n++){
        crearNuevaFlecha(leftConnections[n].sourceId, leftConnections[n].targetId);
    }
}
function posicionarNodos(){
    anchoDiagrama = document.getElementById('diagram').offsetWidth;
    let y = 20;
    let x = (anchoDiagrama - 80) / 2;
    nodos  = document.getElementsByClassName('control');
    nodoRaiz = nodos[3];
    nodoRaiz.style.top = y + "px";
    nodoRaiz.style.left = x + "px";
    //var nodosPadres = [];
    //Posicionamiento hijos
    for(nodo=4;nodo<nodos.length;nodo++){
        infoNodo = getInfo(nodos[nodo].id); //obtenemos el id del padre y si es hijo izquierdo o derecho
        idNodoPadre = infoNodo.idPadre;
        
        yString = document.getElementById(idNodoPadre).style.top;
        xString = document.getElementById(idNodoPadre).style.left;
        y = parseFloat(yString.substr(0,yString.length-2));
        x = parseFloat(xString.substr(0,xString.length-2));
        nodos[nodo].style.top = (y+110) + 'px';
        
        // if(nodosPadres.includes(idNodoPadre)){ //significa que tiene dos hijos
        //     // nodosHijos = getHijos(idNodoPadre);
        //     // derechaString = document.getElementById(nodosHijos.derecha).style.left;
        //     // izqString = document.getElementById(nodosHijos.izquierda).style.left;
        //     // xDer = parseFloat(derechaString.substr(0,derechaString.length-2));
        //     // xIzq = parseFloat(izqString.substr(0,izqString.length-2));
        //     // document.getElementById(nodosHijos.derecha).style.left = (xDer+100) + 'px';
        //     // document.getElementById(nodosHijos.izquierda).style.left = (xIzq+100) + 'px';
        //     var right = document.getElementById(idNodoPadre).classList.contains('right');
        //     posXString = document.getElementById(idNodoPadre).style.left;
        //     xPadre = parseFloat(posXString.substr(0,posXString.length-2));
        //     if(right){
        //         document.getElementById(idNodoPadre).style.left = (xPadre+80) + 'px';
        //     }else{
        //         document.getElementById(idNodoPadre).style.left = (xPadre-80) + 'px';
        //     }
            
               
        // }else{
        //     nodosPadres.push(idNodoPadre);
        // }
        if(infoNodo.hijoDerecha){
            nodos[nodo].style.left = (x+80) + 'px';
        }else{
            nodos[nodo].style.left = (x-80) + 'px';
        }
        
        
    }
}

function getHijos(idPadre){
    for(n = 0;n<rightConnections.length;n++){
        if(idPadre == rightConnections[n].sourceId){
            idDerecha = rightConnections[n].targetId;
            break;
        }
    }
    for(n = 0;n<leftConnections.length;n++){
        if(idPadre == leftConnections[n].sourceId){
            idIzquierda = leftConnections[n].targetId;
            break;
        }
    }
    return {derecha:idDerecha,izquierda:idIzquierda};
}

function getInfo(idHijo){
    idPadre = '';
    flag = true;
    for(n = 0;n<rightConnections.length;n++){
        if(idHijo == rightConnections[n].targetId){
            idPadre = rightConnections[n].sourceId;
            break;
        }
    }
    if(idPadre==''){
        for(n = 0;n<leftConnections.length;n++){
            if(idHijo == leftConnections[n].targetId){
                idPadre = leftConnections[n].sourceId;
                flag = false;
                break;
            }
        } 
    }
    return {idPadre: idPadre, hijoDerecha: flag};
    
}
function agregarNodos(valores) {
    var diagrama = document.getElementById('diagram');
    var id = uuidv4();  //id para la raiz
    document.getElementById('diagram').innerHTML +=
        `<div class="control new root" id="${id}">
        <!-- Nodo raiz -->
        <img src="../resources/images/viento.png" alt="estacion">
        <h6 style="margin-top: 2px;">Raiz</h6>
        </div>`;
    nodoRaiz = document.getElementById(id);
    nodoRaiz.innerHTML += `<h5 class="etiqueta-nodo" style="position: absolute; top: 45%;right: 37%; width: 25px; font-size: 15px; background-color: rgb(255, 255, 255); border-radius: 5px; border: 1.5px solid rgb(92, 92, 92);">${valores[0]}</h5>`;
    idRaiz = id;
    aux = idRaiz;
    valorRaiz = parseInt(valores[0]);
    //hijos
    for (i = 1; i < valores.length; i++) {
        id = uuidv4();  //id - se va actualizando cada vuelta
        //hijo izquierdo
        flag = true;
        while(flag){            
            if (parseInt(valores[i]) < parseInt(valorRaiz) && !hasLeftNode({sourceId: idRaiz, targetId: id}) ) {
                diagrama.innerHTML +=
                    `<div class="control new left" id="${id}">
                    <!-- Nodo izquierda -->
                    <img src="../resources/images/hojaIzq2.png" alt="estacion" width="70px" height="70px">
                    <h6>Hijo izquierda</h6>
                </div>`;
                document.getElementById(id).innerHTML += `<h5 class="etiqueta-nodo" style="position: absolute; top: 45%;right: 37%; width: 25px; font-size: 15px; background-color: rgb(255, 255, 255); border-radius: 5px; border: 1.5px solid rgb(92, 92, 92);">${valores[i]}</h5>`;
    
                //asignamos raiz - Reestableciendo punto de inicio
                valorRaiz = parseInt(valores[0]);
                idRaiz = aux;
                flag = false;
    
            } else if (parseInt(valores[i]) > parseInt(valorRaiz) && !hasRightNode({sourceId: idRaiz, targetId: id})) { //hijo derecho
                diagrama.innerHTML +=
                    `<div class="control new right" id="${id}">
                    <!-- Nodo derecha -->
                    <img src="../resources/images/hojaDer.png" alt="estacion" width="45px" height="45px">
                    <h6>Hijo derecha</h6>
                </div>`;
                document.getElementById(id).innerHTML += `<h5 class="etiqueta-nodo" style="position: absolute; top: 45%;right: 37%; width: 25px; font-size: 15px; background-color: rgb(255, 255, 255); border-radius: 5px; border: 1.5px solid rgb(92, 92, 92);">${valores[i]}</h5>`;
    
                //asignamos raiz - Reestableciendo punto de inicio
                valorRaiz = parseInt(valores[0]);
                idRaiz = aux;
                flag = false;
            }else{
                //Ambas ramificaciones ocupadas                
                if(parseInt(valores[i])<parseInt(valorRaiz)){   //izquierda
                    idRaiz = getLeftNode(idRaiz);
                }else{
                    //derecha
                    idRaiz = getRightNode(idRaiz);
                }
                valorRaiz = document.getElementById(idRaiz).getElementsByTagName('h5')[0].innerText; //Asignamos nuevo valor raiz
            }
        }
        
    }

}
function getRightNode(idNode){
    let idChild = '';
    for (n = 0; n < rightConnections.length; n++) {
        if (rightConnections[n].sourceId == idNode) {
            idChild = rightConnections[n].targetId;
            break;
        }
    }
    return idChild;   
}

function getLeftNode(idNode){
    let idChild = '';
    for (n = 0; n < leftConnections.length; n++) {
        if (leftConnections[n].sourceId == idNode) {
            idChild = leftConnections[n].targetId;
            break;
        }
    }
    return idChild;   
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
                console.log('todo bien');
                cadenaArbol(valores);
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

//---------------------------------------------------------------------------------------------------------
//Extra
var pre = [];
var post = [];
var inorder = [];
var cadena = [];

function comprobar (){
    pre = [];
    post = [];
    inorder = [];
    cadena = [];
    var cadenapre = document.getElementById("cadenaPreOrder").value;
    pre = cadenapre.split(',');
    var cadenapost = document.getElementById("cadenaPostOrder").value;
    post = cadenapost.split(',');
    var cadenainorder = document.getElementById("cadenaInOrder").value;
    inorder = cadenainorder.split(',');
//1,2,3,4,6,9,11,15,17,21,90
//4,2,1,3,15,9,6,11,21,17,90
    if(pre.length==post.length && post.length==inorder.length){
        var c = 0;
        var menor = 0;
        var mayor = 0;
        console.log('Tamanio '+pre.length);
        while(c<pre.length-1){
            if(c==0){
                cadena.push(pre[c]);
                c++;
                cadena.push(pre[c]);
                menor = cadena[c];
                c++;
                cadena.push(findDerecho(cadena[0]));
                mayor = cadena[c];
                console.log('c '+c);
            } else {
                console.log('Mayor '+mayor);
                console.log('Menor '+menor);
                c = c + findEntre(menor, mayor);
                menor = cadena[c];
                if(cadena.includes(findDerecho(mayor))==false){
                    cadena.push(findDerecho(mayor));
                    c++;
                }
                mayor = cadena[c];
            }
            console.log(cadena);
            console.log('c '+c);
        }
        document.getElementById("cadenaRecorridosModal").click();
        console.log(cadena);
        cadenaArbol(cadena);

    } else {
        habilitarMensajeRecorridos('Error en los recorridos revise por favor.');
    }
}
function findDerecho(num){
    var encontrado = post[0];
    for(i=0; i<post.length-1; i++) {
        if(post[i+1]==num){
            encontrado = post[i];
            break;
        }
    }
    return encontrado;
}
function findEntre (menor, mayor){
    var c = 0;
    for(i=0; i<pre.length; i++){
        if(pre[i]==menor){
            for(j=i+1;j<pre.length;j++){
                if(pre[j]!=mayor){
                    cadena.push(pre[j]);
                    c++;
                } else {
                    if(j+1!=pre.length){
                        cadena.push(pre[j+1]);
                        c++;
                    }
                    break;
                }
            }
            break;
        }
    }
    return c;
}
function habilitarMensajeRecorridos(mensaje){
    $('#mensajeRecorridos').html(mensaje);
    document.querySelector("#mensajeRecorridos").classList.add('habilitar-mensaje-recorridos-activo');
    setTimeout(function(){
        document.querySelector("#mensajeRecorridos").classList.remove('habilitar-mensaje-recorridos-activo');
    }, 4000);
}
