class Producto {
  constructor (id, nombre, precio, cantidad, img){
    this.id = id
    this.nombre = nombre
    this.precio = precio
    this.cantidad = cantidad
    this.img = img
  }

}

class ControladorProducto {

  constructor() {
    this.listaProductos  = []
  }

  agregar(producto) {
    this.listaProductos.push(producto)
  }

  cargarProductos() {
    const primerProducto = new Producto(1, "Conjunto Roma", 25300, 1, "../img/sastrero.png")
    const segundoProducto = new Producto(2, "Sastrero Mia", 11400, 1, "../img/palazoArena.png")
    const tercerProducto = new Producto(3, "Sweater Victoria", 7600, 1, "../img/sweater.png")

    controladorProducto.agregar(primerProducto)
    controladorProducto.agregar(segundoProducto)
    controladorProducto.agregar(tercerProducto)
  }

  mostrar() {
    let contenedorIndumentaria = document.getElementById("contenedor_indumentaria");

    this.listaProductos.forEach((producto) => {
      contenedorIndumentaria.innerHTML += `
        <div class="card" style="width: 20rem; background-color: rgba(239, 228, 224, 0.8784313725);">
          <img src="${producto.img}" class="card-img-top mx-auto" alt="...">
          <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">$${producto.precio}</p>
            <button class="agregarCarrito" style="font-family: Montserrat" id="ap-${producto.id}" 
              data-id="${producto.id}" 
              data-nombre="${producto.nombre}" 
              data-precio="$${producto.precio}">Añadir al carrito</button>
          </div>
        </div>`;
    });

    this.listaProductos.forEach((producto) => {
      const agregarProductoAlCarrito = document.getElementById(`ap-${producto.id}`);
      agregarProductoAlCarrito.addEventListener("click", () => {
        carrito.agregar(producto);
        carrito.actualizarLocalStorage()
        carrito.mostrar();
      });
    });
  }
}

class Carrito {

  constructor() {
    this.listaCarrito = [];
    this.recuperarLocalStorage();
  }

  agregar(producto) {
    this.listaCarrito.push(producto);
    this.actualizarLocalStorage();
  }

  eliminar(productoEliminado) {
    let indice = this.listaCarrito.findIndex(producto => producto.id == productoEliminado.id) 
    this.listaCarrito.splice(indice, 1)
  }

  actualizarLocalStorage() {
    let carritoJSON = JSON.stringify(this.listaCarrito);
    localStorage.setItem("listaCarrito", carritoJSON)
  }

  recuperarLocalStorage() {
    let carritoJSON = localStorage.getItem("listaCarrito")
    if (carritoJSON) {
      this.listaCarrito = JSON.parse(carritoJSON);
    }
  }

  mostrar() {
    let contenedorCarrito = document.getElementById("contenedor_carrito");
    contenedorCarrito.innerHTML = ""
    this.listaCarrito.forEach((producto) => {
      contenedorCarrito.innerHTML += `
        <div class="card mb-3" style="max-width: 540px;">
          <div class="row g-0">
            <div class="col-md-4">
              <img src="${producto.img}" class="img-fluid rounded-start" alt="...">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text">Cantidad: ${producto.cantidad}</p>
                <p class="card-text">Precio: $${producto.precio}</p>
                <button class="btn" id= "ep-${producto.id}">  
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                    </svg>  
                </button>            
              </div>
            </div>
          </div>
        </div>`;
    });

    this.listaCarrito.forEach((producto) => {
      const botonEliminar = document.getElementById(`ep-${producto.id}`)
      botonEliminar.addEventListener("click", () => {    
        this.eliminar(producto)
        this.actualizarLocalStorage()
        this.mostrar()
      })
    });

    this.mostrarPrecioTotalCompra()
  }

  limpiar() {
    this.listaCarrito = []
  }

  finalizarSeleccionProductos() {
    const finalizarCompra = document.getElementById(`finalizarCompra`);
    finalizarCompra.addEventListener ("click", () => {
      localStorage.removeItem("listaCarrito")
      this.limpiar()
      this.mostrar()
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Su compra ha sido realizada con éxito',
        timer: 2000
      })
    })
  }

  calcularPrecioTotal() {
    return this.listaCarrito.reduce((acumulador,producto)=> acumulador + producto.precio * producto.cantidad ,0)
  }
  
  mostrarPrecioTotalCompra() {
    const precioTotal = document.getElementById(`precioTotal`)
    precioTotal.innerText = `Precio Total: $${this.calcularPrecioTotal()}`
  }

}

const controladorProducto = new ControladorProducto();
const carrito = new Carrito();


carrito.recuperarLocalStorage();
carrito.mostrar();
carrito.finalizarSeleccionProductos();

controladorProducto.cargarProductos();
controladorProducto.mostrar();