
var fila = "<tr><td class='id'></td><td class='foto'></td><td class='price'></td><td class='title'></td><td class='description'></td><td class='category'></td><td class='eliminar'></td></tr>";
var productos = null;

function codigoCat(catstr) {
	var code = "null";
	switch (catstr) {
		case "electronicos": code = "c1"; break;
		case "joyeria": code = "c2"; break;
		case "caballeros": code = "c3"; break;
		case "damas": code = "c4"; break;
	}
	return code;
}
var orden = 0;


function listarProductos(productos) {
	var precio = document.getElementById("price");
	precio.setAttribute("onclick", "orden*=-1;listarProductos(productos);");

	var num = productos.length;
	var listado = document.getElementById("listado");
	var formagregar = document.getElementById("formagregar");
	var ids, titles, prices, descriptions, categories, fotos;
	var tbody = document.getElementById("tbody"), nfila = 0;
	tbody.innerHTML = "";
	var catcode;
	for (i = 0; i < num; i++) tbody.innerHTML += fila;
	var tr;
	ids = document.getElementsByClassName("id");
	titles = document.getElementsByClassName("title");
	descriptions = document.getElementsByClassName("description");
	categories = document.getElementsByClassName("category");
	fotos = document.getElementsByClassName("foto");
	prices = document.getElementsByClassName("price");
	Accion = document.getElementsByClassName("eliminar");
	
	if (orden === 0) { orden = -1; precio.innerHTML = "Precio" }
	else
		if (orden == 1) { ordenarAsc(productos, "price"); precio.innerHTML = "Precio A"; precio.style.color = "#D8E9A8" }
		else
			if (orden == -1) { ordenarDesc(productos, "price"); precio.innerHTML = "Precio D"; precio.style.color = "#A7D0CD" }

	formagregar.style.display = "block";		
	listado.style.display = "block";
	for (nfila = 0; nfila < num; nfila++) {
		ids[nfila].innerHTML = productos[nfila].id;
		titles[nfila].innerHTML = productos[nfila].title;
		descriptions[nfila].innerHTML = productos[nfila].description;
		categories[nfila].innerHTML = productos[nfila].category;
		catcode = codigoCat(productos[nfila].category);
		tr = categories[nfila].parentElement;
		tr.setAttribute("class", catcode);
		prices[nfila].innerHTML = "$" + productos[nfila].price;
		fotos[nfila].innerHTML = "<img src='" + productos[nfila].image + "'>";
		fotos[nfila].firstChild.setAttribute("onclick", "window.open('" + productos[nfila].image + "');");
		Accion[nfila].innerHTML= "<button>Eliminar</button>"
		Accion[nfila].firstChild.setAttribute("onclick","eliminarProductos('"+productos[nfila].id+"');");
	}

}

function obtenerProductos() {
	 fetch('https://retoolapi.dev/t9lCjr/productos')
		.then(res => res.json())
		.then(data => {
			productos = data;
			productos.forEach(
				function(producto){
					producto.price=parseFloat(producto.price)
				});
				listarProductos(data)});
}

function agregarProductos() {

	var imagenUrl = document.getElementById("AgregarUrl").value;
	var precioTxt = document.getElementById("AgregarPrecio").value;
	var titutoTxt = document.getElementById("AgregarTitulo").value;
	var categoriaTxt = document.getElementById("AgregarCategoria").value;
	var descripcionTxt = document.getElementById("AgregarDescripcion").value;

	precioExReg = /^[0-9]+(\.[0-9]{1,2})?$/;
	urlExReg = /^[a-z]+:[^:]+$/;

	if(imagenUrl === "" || precioTxt === "" || titutoTxt === "" || categoriaTxt === "" || descripcionTxt === ""){
		alert("Favor llenar todos los campos para agregar un producto. Por tal motivo se regresará a la pantalla de inicial");
	}else if(!precioExReg.test(precioTxt)){
		alert("El precio ingresado no es válido. Por tal motivo se regresará a la pantalla de inicial");
		return false;
	}else if(!urlExReg.test(imagenUrl)){
		alert("El URL proporcionada para la imagen del producto no es válida. Por tal motivo se regresará a la pantalla de inicial");
		return false;
	}else{
		var nuevoProducto = {
			image: imagenUrl,
			price: precioTxt,
			title: titutoTxt,
			category: categoriaTxt,
			description: descripcionTxt
		}

		fetch('https://retoolapi.dev/t9lCjr/productos', {
			method: "POST", body: JSON.stringify(nuevoProducto), headers: { 'Accept': 'application/json', 'Content-type': 'application/json; charset=UTF-8', }
		}).then(response => response.json()).then(data => {productos = data; obtenerProductos()});
		alert("Se ha agregado el producto de manera correcta");
	}
}
		
var iden;
function eliminarProductos(iden) {
	fetch('https://retoolapi.dev/t9lCjr/productos/'+iden, { method: "DELETE" })
		.then(response => response.json())
		.then(data =>productos = data);
		obtenerProductos();
		alert("Se ha eliminado el producto N° "+iden); 
}

function ordenarDesc(p_array_json, p_key) {
	p_array_json.sort(function (a, b) {
		if (a[p_key] > b[p_key]) return -1;
		if (a[p_key] < b[p_key]) return 1;
		return 0;
	});
}

function ordenarAsc(p_array_json, p_key) {
	p_array_json.sort(function (a, b) {
		if (a[p_key] > b[p_key]) return 1;
		if (a[p_key] < b[p_key]) return -1;
		return 0;
	});
}