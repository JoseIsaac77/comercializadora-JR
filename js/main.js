// Carrito persistente
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Elementos del DOM
const cartButton = document.getElementById('cart-button');
const closeCartButton = document.getElementById('close-cart');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const emptyCartMessage = document.getElementById('empty-cart-message');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTotal = document.getElementById('cart-total');
const checkoutButton = document.getElementById('checkout-button');
const cartCount = document.getElementById('cart-count');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const searchButton = document.getElementById('search-button');
const searchBar = document.getElementById('search-bar');
const notification = document.getElementById('notification'); // Acceso a la notificación


// Productos Destacados

var isDragging = false;
var startX;
var scale = 0.5;

var distanceItems = '350px'

var carousel = document.getElementById('carousel');
var items = Array.from(carousel.children);

carousel.addEventListener('mousedown', handleDragStart);
document.addEventListener('mouseup', handleDragEnd);
document.addEventListener('mousemove', handleDragMove);
carousel.addEventListener('selectstart', function (e) {
    e.preventDefault();
});

items.forEach(function (item, index) {
    item.addEventListener('mousedown', function (mousedownEvent) {
        handleItemClick(mousedownEvent, index);
    });
});

function handleDragStart(e) {
    isDragging = true;
    startX = e.clientX;
    document.body.style.cursor = 'grabbing';
}

function handleDragEnd() {
    isDragging = false;
    document.body.style.cursor = 'grab';
}

function handleDragMove(e) {
    if (isDragging) {
        var deltaX = (e.clientX - startX) * scale;
        startX = e.clientX;

        var currentRotation = parseFloat(carousel.style.getPropertyValue('--rotation') || 0);

        if (currentRotation > 360 || currentRotation < -360) {
            currentRotation = 0;
        }

        updateCarouselRotation(deltaX, currentRotation);
    }
}

function handleItemClick(mousedownEvent, index) {
    var isMouseDown = true;
    var startX = mousedownEvent.clientX;

    document.addEventListener('mousemove', function (mousemoveEvent) {
        if (isMouseDown) {
            var currentX = mousemoveEvent.clientX;
            var dragDistance = Math.abs(currentX - startX);

            if (dragDistance > 5) {
                isMouseDown = false;
            }
        }
    });

    document.addEventListener('mouseup', function () {
        if (isMouseDown) {
            handleItemClickEnd(index);
        }

        isMouseDown = false;
    });
}

function handleItemClickEnd(index) {
    var currentRotation = parseFloat(carousel.style.getPropertyValue('--rotation') || 0);

    var anglePerItem = 360 / items.length;
    var targetRotation;

    var val1 = 360 - (index * anglePerItem);
    var val2 = index * -anglePerItem;

    // Calcular las diferencias
    var diff1 = Math.abs(currentRotation - val1);
    var diff2 = Math.abs(currentRotation - val2);

    if (currentRotation === 0 && index === items.length - 1) {

        rotateCarousel(360 / items.length);

    } else if (index === 0 && currentRotation < -180) {
        rotateCarousel(-360);
    } else {
        if (diff1 < diff2) {
            targetRotation = val1;
        } else {
            targetRotation = val2;
        }

        rotateCarousel(targetRotation);
    }
}

function updateCarouselRotation(deltaX, currentRotation) {
    carousel.style.transform = 'rotateY(' + (currentRotation + deltaX) + 'deg)';
    carousel.style.setProperty('--rotation', currentRotation + deltaX);

    items.forEach(function (item, index) {
        var angle = index * (360 / items.length);
        var rotation = angle + currentRotation;
        var translation = 'translateZ(' + distanceItems + ') rotateY(' + -rotation + 'deg)';
        item.style.transform = 'rotateY(' + angle + 'deg) ' + translation;
    });
}

function rotateCarousel(rotation) {
    carousel.style.transition = 'transform 0.5s ease-in-out';
    carousel.style.transform = 'rotateY(' + rotation + 'deg)';
    carousel.style.setProperty('--rotation', rotation);

    var currentRotation = parseFloat(carousel.style.getPropertyValue('--rotation') || 0);

    function handleTransitionEnd() {
        carousel.style.transition = '';
        carousel.removeEventListener('transitionend', handleTransitionEnd);

        items.forEach(function (item) {
            item.style.transition = '';
        });

        if (currentRotation === 360 || currentRotation === -360) {
            resetCarousel(0);
        }
    }

    carousel.addEventListener('transitionend', handleTransitionEnd);

    items.forEach(function (item, index) {
        var angle = index * (360 / items.length);
        var rotation = angle + currentRotation;
        var translation = 'translateZ(' + distanceItems + ') rotateY(' + -rotation + 'deg)';
        item.style.transition = 'transform 0.5s ease-in-out';
        item.style.transform = 'rotateY(' + angle + 'deg) ' + translation;
    });
}

function resetCarousel(rotation) {
    carousel.style.transform = 'rotateY(' + rotation + 'deg)';
    carousel.style.setProperty('--rotation', rotation);

    items.forEach(function (item, index) {
        var angle = index * (360 / items.length);
        var translation = 'translateZ(' + distanceItems + ') rotateY(-' + angle + 'deg)';
        item.style.transform = 'rotateY(' + angle + 'deg) ' + translation;
    });
}

handleItemClickEnd(0);

// Inicializar el carrusel del hero
function initHeroCarousel() {
    const heroCarouselElement = document.querySelector('.hero-carousel');
    if (heroCarouselElement) {
        // Verificar si Glide está disponible
        if (typeof Glide !== 'undefined') {
            new Glide(heroCarouselElement, {
                type: 'carousel',
                autoplay: 4000,
                animationDuration: 2000,
                hoverpause: false,
                perView: 1,
                gap: 0,
                rewind: false,
                rewindDuration: 2000
            }).mount();
            
            // Efecto parallax opcional para mayor modernidad
            heroCarouselElement.querySelectorAll('.glide__slide').forEach(slide => {
                slide.style.transformStyle = 'preserve-3d';
                slide.querySelector('img').style.transform = 'translateZ(-1px) scale(1.1)';
            });
        } else {
            console.error('Glide.js no está cargado. Asegúrate de incluir su script.');
        }
    }
}

// Mostrar/ocultar menú móvil
if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const isHidden = mobileMenu.classList.contains('hidden');
        mobileMenuButton.setAttribute('aria-expanded', !isHidden);
    });
}


// Mostrar/ocultar barra de búsqueda
if (searchButton && searchBar) {
    searchButton.addEventListener('click', () => {
        searchBar.classList.toggle('hidden');
        const isHidden = searchBar.classList.contains('hidden');
        searchButton.setAttribute('aria-expanded', !isHidden);
    });
}

// Mostrar/ocultar carrito
if (cartButton && closeCartButton && cartModal) {
    cartButton.addEventListener('click', showCart);
    closeCartButton.addEventListener('click', hideCart);

    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            hideCart();
        }
    });
}


// Mostrar carrito
function showCart() {
    cartModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Evita el scroll del body
    document.getElementById('main-content')?.setAttribute('aria-hidden', 'true'); // Para accesibilidad
}

// Ocultar carrito
function hideCart() {
    cartModal.classList.add('hidden');
    document.body.style.overflow = 'auto'; // Restaura el scroll del body
    document.getElementById('main-content')?.removeAttribute('aria-hidden'); // Para accesibilidad
}

// Agregar producto al carrito
function addToCart(id, name, price) {
    if (!id || !name || isNaN(price)) {
        console.error('Datos de producto inválidos para añadir al carrito');
        return;
    }

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    updateCart();
    showCart(); // Muestra el carrito al agregar un producto
    showNotification(`"${name}" agregado al carrito.`);
}

// Notificación
function showNotification(message) {
    if (notification) {
        notification.textContent = message;
        notification.classList.remove('hidden');
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            notification.classList.add('fade-out'); // Aplica animación de desvanecimiento
            notification.addEventListener('animationend', () => {
                notification.classList.add('hidden');
                notification.classList.remove('fade-out');
            }, { once: true }); // Elimina el listener después de una vez
        }, 3000);
    }
}


// Actualizar carrito (persistente en localStorage)
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (totalItems > 0) {
        cartCount.textContent = totalItems;
        cartCount.classList.remove('hidden');
        checkoutButton.classList.remove('hidden');
        emptyCartMessage.classList.add('hidden');
    } else {
        cartCount.classList.add('hidden');
        checkoutButton.classList.add('hidden');
        emptyCartMessage.classList.remove('hidden');
    }

    renderCartItems();
    updateCartTotals();
}

// Renderizar productos del carrito en el modal
function renderCartItems() {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = ''; // Limpiar antes de renderizar

    if (cart.length === 0) {
        emptyCartMessage.classList.remove('hidden');
        return;
    } else {
        emptyCartMessage.classList.add('hidden');
    }

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'flex justify-between items-center py-4 border-b border-gray-200';
        itemElement.innerHTML = `
            <div class="flex items-center">
                <div class="ml-4">
                    <h4 class="font-medium text-gray-800">${item.name}</h4>
                    <div class="flex items-center mt-2">
                        <button class="change-quantity px-2 text-gray-500 hover:text-orange-600" data-id="${item.id}" data-change="-1" aria-label="Disminuir cantidad de ${item.name}">-</button>
                        <span class="quantity px-2">${item.quantity}</span>
                        <button class="change-quantity px-2 text-gray-500 hover:text-orange-600" data-id="${item.id}" data-change="1" aria-label="Aumentar cantidad de ${item.name}">+</button>
                        <span class="font-bold ml-4">$${(item.quantity * item.price).toFixed(2)}</span>
                    </div>
                </div>
            </div>
            <button class="remove-item text-red-500 hover:text-red-700" data-id="${item.id}" aria-label="Eliminar ${item.name} del carrito">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    // Event listeners para botones de cantidad (delegación para elementos dinámicos)
    cartItemsContainer.querySelectorAll('.change-quantity').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = button.getAttribute('data-id');
            const change = parseInt(button.getAttribute('data-change'));
            updateCartItemQuantity(id, change);
        });
    });

    // Event listeners para botones de eliminar (delegación)
    cartItemsContainer.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', () => {
            removeFromCart(button.getAttribute('data-id'));
        });
    });
}

// Actualizar cantidad de un item en el carrito
function updateCartItemQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== id);
            showNotification(`"${item.name}" eliminado del carrito.`);
        } else {
            showNotification(`Cantidad de "${item.name}" actualizada.`);
        }
        
        updateCart();
    }
}

// Totales del carrito
function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    // Asumiendo que el envío es $2.500 si hay productos en el carrito
    const shipping = subtotal > 0 ? 2500 : 0; 
    const total = subtotal + shipping;

    if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    if (cartTotal) cartTotal.textContent = `$${total.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

// Eliminar producto del carrito
function removeFromCart(id) {
    const removedItem = cart.find(item => item.id === id);
    cart = cart.filter(item => item.id !== id);
    updateCart();
    if (removedItem) {
        showNotification(`"${removedItem.name}" eliminado del carrito.`);
    } else {
        showNotification('Producto eliminado del carrito.');
    }
}

// Checkout
if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
        if (cart.length > 0) {
            alert('¡Gracias por tu compra! Serás redirigido para completar el pago.');
            cart = []; // Vaciar el carrito
            updateCart(); // Actualizar UI y localStorage
            hideCart(); // Ocultar el modal del carrito
            // Aquí podrías redirigir a una pasarela de pago o página de confirmación
            // window.location.href = '/checkout.php'; 
        } else {
            showNotification('Tu carrito está vacío. Añade productos para finalizar la compra.');
        }
    });
}


// Cerrar menú móvil al hacer clic en un enlace
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        if (mobileMenu) {
            mobileMenu.classList.add('hidden');
            mobileMenuButton.setAttribute('aria-expanded', false);
        }
    });
});

// Cargar productos destacados
async function loadFeaturedProducts() {
    const productCarousel = document.getElementById('product-carousel');
    if (!productCarousel) return;

    // Mostrar spinner de carga
    productCarousel.innerHTML = `
        <div class="col-span-full text-center py-8">
            <div class="spinner"></div>
            <p class="text-gray-600 mt-4">Cargando productos...</p>
        </div>
    `;

    try {
        // Asegúrate de que la ruta a tu API sea correcta.
        // Si main.js está en '../js/', y 'productos.php' en '/api/', la ruta absoluta desde la raíz del dominio sería '/api/productos.php'
        // Si el servidor web tiene el proyecto en un subdirectorio, por ejemplo 'web_jr', la ruta sería '/web_jr/api/productos.php'
        const response = await fetch('/api/productos.php'); // Asumiendo que 'api' está en la raíz del sitio
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const productos = await response.json();
        renderProductCarousel(productos);
    } catch (error) {
        console.error('Error cargando productos destacados:', error);
        productCarousel.innerHTML = `
            <p class="text-red-500 text-center py-8">No se pudieron cargar los productos destacados. Por favor intenta más tarde.</p>
        `;
    }
}

// Renderizar carrusel de productos
function renderProductCarousel(productos) {
    const carousel = document.getElementById('product-carousel');
    if (!carousel) return;

    carousel.innerHTML = ''; // Limpiar carrusel después de la carga

    if (productos.length === 0) {
        carousel.innerHTML = `
            <p class="col-span-full text-gray-600 text-center py-8">No hay productos destacados disponibles en este momento.</p>
        `;
        return;
    }

    productos.slice(0, 4).forEach(producto => { // Mostrar solo 4 productos
        const productoCard = document.createElement('div');
        productoCard.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 product-card';
        
        productoCard.innerHTML = `
            <div class="relative overflow-hidden">
                <img src="../images/productos/${producto.id}.jpg" alt="${producto.descripcion}" class="w-full h-48 object-cover">
                ${producto.oferta ? '<div class="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">OFERTA</div>' : ''}
            </div>
            <div class="p-4">
                <h3 class="font-bold text-lg mb-2">${producto.descripcion}</h3>
                <p class="text-gray-600 text-sm mb-4">${producto.medida || 'Paquete estándar'}</p>
                <div class="flex justify-between items-center">
                    <span class="font-bold text-orange-600">$${producto.precio.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                    <button class="add-to-cart bg-orange-600 text-white px-3 py-1 rounded-full hover:bg-orange-700 transition btn-effect" 
                            data-id="${producto.id}" 
                            data-name="${producto.descripcion}" 
                            data-price="${producto.precio}"
                            aria-label="Añadir ${producto.descripcion} al carrito">
                        <i class="fa-solid fa-cart-plus"></i> Añadir
                    </button>
                </div>
            </div>
        `;
        
        carousel.appendChild(productoCard);
    });

    // Los event listeners para los botones "Añadir al carrito" se adjuntan después de renderizar
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            addToCart(id, name, price);
        });
    });
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    // Iniciar carrusel del hero
    initHeroCarousel();
    
    // Cargar productos destacados
    loadFeaturedProducts();
    
    // Actualizar carrito al cargar la página
    updateCart();
});