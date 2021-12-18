

const form = document.querySelector("#form-busqueda")
const inputBusqueda = document.querySelector("#busqueda")
const seccionTarjetas = document.querySelector("#tarjetas")
const seccionDetalle = document.querySelector("#detalle")

const buscarProductos = (busqueda) => {
  fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${busqueda}`)
  .then(res => res.json())
  .then(data => {
    hacerHTMLTarjetas(data.results)
  })
}

const buscarProducto = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then(res => res.json())
  .then(data => {
      crearVistaDetalle(data)
  })
}

const mostrarEnvioGratuito = tipoDeEnvio => {
  if (tipoDeEnvio === true) {
    return `
    <img class="img-detalle" src="https://www.iconpacks.net/icons/1/free-truck-icon-1058-thumb.png">
    <p class='envio-gratis'>Envio gratuito</p>
    `
  }
  else {
    return "<p>Envio normal<p>"
  }
}

const crearVistaDetalle = (data) => {
  seccionTarjetas.style.display = "none"
  seccionDetalle.style.display = "flex"

  seccionDetalle.innerHTML = `
    <article class="detalle-producto">
    <h2>${data.title}</h2>

    ${mostrarEnvioGratuito(data.shipping.free_shipping)}
    </article>
  `
}

const asignarClickATarjetas = () => {
  const tarjetas = document.querySelectorAll(".tarjeta")
  for (let i = 0; i < tarjetas.length; i++) {
    tarjetas[i].onclick = () => {
      const id = tarjetas[i].dataset.id
      buscarProducto(id)
    }  
  }
}

const mostrarImagenTarjeta = img => {
  if (img) {
    return `<img src="${img}"></img>`
  }
  else {
    `<img src="not-found.jpeg">`
  }
}

const hacerHTMLTarjetas = productos => {
  seccionTarjetas.style.display = "flex"
  seccionDetalle.style.display = "none"
  seccionTarjetas.innerHTML = productos.reduce((acc, curr) => {
    return acc + `
      <article class="tarjeta" data-id="${curr.id}">
        <h2>${curr.title}</h2>
        <p>${curr.price}</p>
        ${mostrarImagenTarjeta(curr.thumbnail)}
      </article>
    `
  }, "")

  asignarClickATarjetas()
}

form.onsubmit = (e) => {
  e.preventDefault()
  buscarProductos(inputBusqueda.value)
}