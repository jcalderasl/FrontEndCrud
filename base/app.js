const container = document.querySelector("#contenedor");
const modalBody = document.querySelector(".modal .modal-body");

const containerShoppingCart = document.querySelector("#carritoContenedor");
const removeAllProductsCart = document.querySelector("#vaciarCarrito");

const keepBuy = document.querySelector("#procesarCompra");
const totalPrice = document.querySelector("#precioTotal");

const activeFunction = document.querySelector('#activarFuncion')




//parte 1  filtro por categoría

const fetchCategories = async () => {
  try {
    const response = await fetch('https://fakestoreapi.com/products/categories');
    if (!response.ok) {
      throw new Error("no se pudo conectar");
    }

    return await response.json();
  } catch (error) {
    console.log(error.message);
  }
};


const filterProductsByCategory = async (category) => {
  const products = await fetchProducts();
  const filteredProducts = products.filter((product) => product.category === category);

 
  container.innerHTML = '';
  filteredProducts.forEach(addProductsContainer);
};


const categoryFilterDropdown = document.querySelector('#categoryFilter');
categoryFilterDropdown.addEventListener('change', (event) => {
  const selectedCategory = event.target.value;
  filterProductsByCategory(selectedCategory);
});







//parte 2 poner un botón para ordenar los resultados

const orderDropdown = document.querySelector('#orderDropdown');


orderDropdown.addEventListener('change', (event) => {
  const selectedOrder = event.target.value;


  fetch(`https://fakestoreapi.com/products?sort=${selectedOrder}`)
    .then(res => res.json())
    .then(json => {

      container.innerHTML = '';
      json.forEach(addProductsContainer);
    });
});




//parte 3 hacer una pantalla para ingresar nuevos productos al catálogo
const nuevoProductoForm = document.querySelector('#nuevoProductoForm');
nuevoProductoForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const titulo = document.querySelector('#titulo').value;
  const precioInput = document.querySelector('#precio');
  const precio = parseFloat(precioInput.value.replace(',', '.')); // Reemplaza comas por puntos para admitir decimales
  const descripcion = document.querySelector('#descripcion').value;
  const imagen = document.querySelector('#imagen').value;
  const categoria = document.querySelector('#categoria').value;

  if (isNaN(precio)) {
    alert('El precio debe ser un número válido.');
    precioInput.focus();
    return;
  }

  const nuevoProducto = {
    title: titulo,
    price: precio,
    description: descripcion,
    image: imagen,
    category: categoria,
  };

  addNewProduct(nuevoProducto);
  nuevoProductoForm.reset(); // Reinicia el formulario después de agregar el producto
});

function addNewProduct(newProduct) {
  fetch('https://fakestoreapi.com/products', {
    method: 'POST',
    body: JSON.stringify(newProduct),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((json) => {
      alert('Nuevo producto agregado:', json);
      productList.push(json);
      addProductsContainer(json);
    })
    .catch((error) => {
      alert('Error al agregar el nuevo producto:', error);
    });
}









//parte 4  actualización de producto, basado en el id.
const actualizarProductoForm = document.querySelector('#actualizarProductoForm');
actualizarProductoForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const idProducto = document.querySelector('#idProducto').value;
  const nuevoTitulo = document.querySelector('#nuevoTitulo').value;
  const nuevoPrecioInput = document.querySelector('#nuevoPrecio');
  const nuevoPrecio = parseFloat(nuevoPrecioInput.value.replace(',', '.')); // Reemplaza comas por puntos para admitir decimales
  const nuevaDescripcion = document.querySelector('#nuevaDescripcion').value;
  const nuevaImagen = document.querySelector('#nuevaImagen').value;
  const nuevaCategoria = document.querySelector('#nuevaCategoria').value;

  if (isNaN(nuevoPrecio)) {
    alert('El precio debe ser un número válido.');
    nuevoPrecioInput.focus();
    return;
  }

  const datosActualizados = {
    title: nuevoTitulo,
    price: nuevoPrecio,
    description: nuevaDescripcion,
    image: nuevaImagen,
    category: nuevaCategoria,
  };

  actualizarProducto(idProducto, datosActualizados);
  actualizarProductoForm.reset(); // Reinicia el formulario después de actualizar el producto
});

function actualizarProducto(idProducto, datosActualizados) {
  fetch(`https://fakestoreapi.com/products/${idProducto}`, {
    method: 'PUT',
    body: JSON.stringify(datosActualizados),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`No se pudo actualizar el producto: ${res.status}`);
      }
      return res.json();
    })
    .then((json) => {
      alert('Producto actualizado:', json);
      // Actualiza la interfaz aquí
    })
    .catch((error) => {
      alert('Error al actualizar el producto:', error);
    });
}


//parte 5 eliminación de un producto.

const eliminarProductoForm = document.querySelector('#eliminarProductoForm');
eliminarProductoForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const idProductoEliminar = document.querySelector('#idProductoEliminar').value;

  eliminarProducto(idProductoEliminar);
  eliminarProductoForm.reset(); // Reinicia el formulario después de eliminar el producto
});

function eliminarProducto(idProductoEliminar) {
  fetch(`https://fakestoreapi.com/products/${idProductoEliminar}`, {
    method: 'DELETE',
  })
    .then((res) => {
      if (res.status === 200) {
        alert('Producto eliminado con éxito.');
        eliminarProductoDeInterfaz(idProductoEliminar); // Elimina visualmente el producto
        // Puedes manejar la respuesta de eliminación aquí, por ejemplo, actualizar la lista de productos si es necesario.
      } else {
        console.error('No se pudo eliminar el producto. Código de estado:', res.status);
      }
    })
    .catch((error) => {
      console.error('Error al eliminar el producto:', error);
    });
}

function eliminarProductoDeInterfaz(idProductoEliminar) {
  // Encuentra el elemento del producto en la interfaz y elimínalo
  const productoAEliminar = document.querySelector(`#producto-${idProductoEliminar}`);
  if (productoAEliminar) {
    productoAEliminar.remove();
  }
}


//resto de codigo

const fakeStoreApi = "https://fakestoreapi.com/products";


//definimos un arreglo para guardar los productos que se agreguen al carrito
let shoppingCart = [];

//definimos un arreglo para guardar la lista de productos
let productList = [];

//definimos un contador para saber cuantos productos se agregan al carrito
let counter = 0;
// definimos un arreglo para guardar la cantidad de productos
let quantity = [];


// soticitar y agregar al contenedor
const fetchProducts = async () => {
  try {
    const response = await fetch(fakeStoreApi);
    if (!response.ok) {
      throw new Error("no se pudo conectar");
    }

    return await response.json();
  } catch (error) {
    console.log(error.message);
  }
};

const addProductsContainer = (product) => {
  
  const { id, title, image, price, description } = product;
  container.innerHTML += `
  <div class="card mt-3" style="width: 18rem;">
  <img class="card-img-top mt-2" src="${image}" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">${title}</h5>
      <p class="card-text" style="font-weight: bold">$ ${price}</p>
      <p class="card-text">• ${description}</p>
      <button class="btn btn-primary" onclick="addProduct(${id})">Comprar producto</button>
    </div>
  </div>
  `;
};

const getProducts = async () => {
  const products = await fetchProducts();
  console.table(products);
  products.forEach(addProductsContainer);

  productList = products;
};

// agregando productos al carrito

const addProduct = (id) => {
  const testProductId = shoppingCart.some((item) => item.id === id);

  if (testProductId) {
    Swal.fire({
      title: "Este chunche ya fue seleccionado",
      text: "Por favor seleccione otra cosa",
      icon: "success",
    });
    return;
  }

  shoppingCart.push({
    ...productList.find((item) => item.id === id),
    quantity: 1,
  });

  showShoppingCart();
};

// carrito de compras

const showShoppingCart = () => {
  modalBody.innerHTML = "";

  shoppingCart.forEach((product) => {
    const { title, image, price, id } = product;

    modalBody.innerHTML += `
      <div class="modal-contenedor">
        <div>
          <img class="img-fluid img-carrito" src="${image}"/>
        </div>
        <div>
          <p style="font-weight: bold">${title}</p>
          <p style="font-weight: bold">Precio: R$ ${price}</p>
          <div>
            <button onclick="removeProducts(${id})" class="btn btn-danger">Eliminar produto</button>
          </div>
        </div>
      </div>
    `;
  });

  totalPriceInCart(totalPrice);
  messageEmptyShoppingCart();
  containerShoppingCart.textContent = shoppingCart.length;
  setItemInLocalStorage();
};

//quitar productos del carrito

const removeProducts = (id) => {
  const index = shoppingCart.findIndex((item) => item.id === id);

  if (index !== -1) {
    shoppingCart.splice(index, 1);
    showShoppingCart();
  }
};

// vaciar carrito de compras

removeAllProductsCart.addEventListener("click", () => {
  shoppingCart.length = [];
  showShoppingCart();
});

// mensagem carrinho vazio
const messageEmptyShoppingCart = () => {
  if (shoppingCart.length === 0) {
    modalBody.innerHTML = `
      <p class="text-center text-primary parrafo">No hay nada en el carrito!</p>
    `;
  }
};

// continuar comprando

keepBuy.addEventListener("click", () => {
  if (shoppingCart.length === 0) {
    Swal.fire({
      title: "su carrito está vacío",
      text: "Compre algo para continuar",
      icon: "error",
      confirmButtonText: "Aceptar",
    });
  } else {
    location.href = "index.html";
    finalOrder()
  }
});






// precio total en el carrito
const totalPriceInCart = (totalPriceCart) => {
  totalPriceCart.innerText = shoppingCart.reduce((acc, prod) => {
    return acc + prod.price;
  }, 0);
}; 

// local storage
const setItemInLocalStorage = () => {
  localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
};

const addItemInLocalStorage = () => {
  shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];
  setItemInLocalStorage();
  showShoppingCart();
};

document.addEventListener("DOMContentLoaded", addItemInLocalStorage);
getProducts();


