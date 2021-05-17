const form = document.querySelector("#formulario");
const result = document.querySelector("#resultado");
const pag = document.querySelector("#paginacion");
const regPorPag = 40;
let totalPag;
let iter;
let pagActual = 1;

window.onload = () => {
	form.addEventListener('submit', validarFormulario);
}

const calcularPag = total => parseFloat(Math.ceil(total / regPorPag));

function validarFormulario(e){
	e.preventDefault();

	const inpTermino = document.querySelector("#termino").value;

	if(inpTermino === ""){
		mostrarError('Agrega un termino de búsqueda');
		return;
	}

	buscarImagenes();
}

function buscarImagenes(){
	const termino = document.querySelector("#termino").value;
	const key = "21519061-7bcaec82018e491ea1d889602";
	const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${regPorPag}&page=${pagActual}`;

	fetch(url)
		.then(r => r.json())
		.then(r => {
			if(r.hits.length === 0){
				mostrarError('No se encontraron imágenes');
				return;
			}
			totalPag = calcularPag(r.totalHits);
			console.log(totalPag)
			mostrarImg(r.hits);
	});
}

function *crearPaginador(total){
	for(let i = 1; i <= total; i++){
		yield i;
	}
}

function imprimirPaginador(){
	iter = crearPaginador(totalPag);

	while(true){
		const {value, done} = iter.next();
		if(done) return;

		const btn = document.createElement('a');
		btn.href = "#";
		btn.dataset.pagina = value;
		btn.textContent = value;
		btn.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'uppercase', 'rounded');

		btn.onclick = () => {
			pagActual = value;
			buscarImagenes();
		}

		paginacion.appendChild(btn);
	}

}

function mostrarImg(imgs){
	limpiarHTML(result);

	imgs.forEach( img => {
		const {previewURL, views, likes, largeImageURL, tags} = img;

		result.innerHTML += `
			<div class="w-1/2 md:w-1/3 lg:w-1/4 p-3">
				<div class="bg-white rounded">
					<img class="w-full rounded" src="${previewURL}" alt="${tags}">
					<div class="p-4">
						<p class="font-bold">${likes} <span class="font-light">Likes</span> </p>
						<p class="font-bold">${views} <span class="font-light">Vistas</span> </p>
						<a class="w-full block bg-yellow-400 font-bold uppercase hover:bg-yellow-500 rounded text-center mt-5 p-1" href="${largeImageURL}" target="_blank" rel="noopener noreferrer">Ver imagen</a>
					</div>
				</div>
			</div>
		`
	});

	limpiarHTML(pag);
	imprimirPaginador();
}

function mostrarError(msj){
	const existeAlerta = document.querySelector(".alerta");

	if(!existeAlerta){
		const alerta = document.createElement('p');
		alerta.classList.add('bg-red-200', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'alerta');
		alerta.innerHTML = `
		<strong class="font-bold">¡Error!</strong>
		<span class="block sm:inline">${msj}</span>`;
		form.appendChild(alerta);

		setTimeout(() => alerta.remove(), 3000);
	}
}

function limpiarHTML(child){
	while(child.firstChild)
		child.removeChild(child.firstChild);
}