// Función para abrir el modal con la imagen ampliada
function openModal(imageSrc, title, price) {
  const modal = document.getElementById("modal");
  const modalImage = document.getElementById("modal-image");
  const modalTitle = document.getElementById("modal-title");

  // Configurar contenido del modal
  modalImage.src = imageSrc;
  modalTitle.textContent = title;

  // Añadir la clase 'show' para activar la transición
  modal.classList.add("show");
}

// Función para cerrar el modal
function closeModal() {
  const modal = document.getElementById("modal");
  modal.classList.remove("show"); // Eliminar la clase 'show' para ocultar el modal
}

// Cerrar modal al hacer clic en cualquier parte del modal (excepto en el contenido)
document.getElementById("modal").addEventListener("click", function (e) {
  if (e.target === document.getElementById("modal")) {
    closeModal();
  }
});

//funcion para agregar producto a la lista
document
  .getElementById("add-product-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const nombre = document.getElementById("nombre").value;
    const precio = document.getElementById("precio").value;
    const imagen = document.getElementById("imagen").value;

    // Datos del nuevo producto
    const newProduct = {
      nombre,
      precio,
      imagen,
    };

    try {
      // Enviar producto a JSON Server
      const response = await fetch(
        "https://677e093f94bde1c1252a2044.mockapi.io/api/v1/productos",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProduct),
        }
      );

      if (response.ok) {
        const savedProduct = await response.json();
        renderProduct(savedProduct); // Renderizar el producto en la página
        document.getElementById("add-product-form").reset(); // Limpiar formulario
      } else {
        console.error("Error al guardar el producto");
      }
    } catch (error) {
      console.error("Error de conexión", error);
    }
  });

const precioInput = document.getElementById("precio");

// Validar y formatear el precio en tiempo real
precioInput.addEventListener("input", function () {
  let value = this.value;

  // Reemplazar cualquier carácter que no sea número, coma o punto
  value = value.replace(/[^0-9.,]/g, "");

  // Permitir solo un punto o coma para los decimales
  const parts = value.split(/[,|.]/);
  if (parts.length > 2) {
    value = parts[0] + "." + parts[1];
  }

  // Mostrar siempre "US$" delante del precio
  this.value = value ? `US$${value}` : "";
});

precioInput.addEventListener("focus", function () {
  if (!this.value.startsWith("US$")) {
    this.value = "US$" + this.value;
  }
});

async function loadProducts() {
  try {
    const response = await fetch(
      "https://677e093f94bde1c1252a2044.mockapi.io/api/v1/productos"
    );
    if (response.ok) {
      const productos = await response.json();
      productos.forEach(renderProduct);
    } else {
      console.error("Error al cargar los productos");
    }
  } catch (error) {
    console.error("Error de conexión", error);
  }
}

loadProducts();

function renderProduct(product) {
  // Seleccionar la plantilla oculta
  const template = document.querySelector(".producto-nuevo");

  // Clonar la plantilla
  const newProduct = template.cloneNode(true);
  newProduct.classList.remove("producto-nuevo");
  newProduct.removeAttribute("hidden");
  newProduct.classList.add("producto");

  // Configurar los datos del nuevo producto
  newProduct.querySelector("img").src = product.imagen;
  newProduct.querySelector("img").alt = product.nombre;
  newProduct.querySelector("h3").textContent = product.nombre;
  newProduct.querySelector("p").textContent = product.precio;

  // Evento para ampliar la imagen
  newProduct.querySelector("img").addEventListener("click", function () {
    openModal(product.imagen, product.nombre, product.precio);
  });

  // Agregar funcionalidad al botón eliminar
  newProduct
    .querySelector(".eliminar")
    .addEventListener("click", async function () {
      try {
        const response = await fetch(
          `https://677e093f94bde1c1252a2044.mockapi.io/api/v1/productos/${product.id}`,
          { method: "DELETE" }
        );
        if (response.ok) {
          newProduct.remove(); // Eliminar del DOM
        } else {
          console.error("Error al eliminar el producto");
        }
      } catch (error) {
        console.error("Error de conexión", error);
      }
    });

  // Agregar el nuevo producto a la lista de productos
  document.querySelector(".grid-productos").appendChild(newProduct);
}
