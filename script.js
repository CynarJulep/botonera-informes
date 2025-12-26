// Variables globales
let config = null;
let botones = [];
let botonActualConSubopciones = null;

// Cargar configuración al iniciar
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Intentar cargar desde config.json primero (funciona en Vercel/servidores)
        try {
            const response = await fetch('config.json');
            if (response.ok) {
                config = await response.json();
                botones = config.botones || [];
                renderizarBotones();
                return;
            }
        } catch (fetchError) {
            // Si falla, usar configuración embebida (para uso local sin servidor)
            console.log('Usando configuración embebida (modo local)');
        }
        
        // Fallback: usar configuración embebida en el HTML
        if (typeof CONFIG_DATA !== 'undefined') {
            config = CONFIG_DATA;
            botones = config.botones || [];
            renderizarBotones();
        } else {
            mostrarError('No se pudo cargar la configuración.');
        }
    } catch (error) {
        console.error('Error al cargar configuración:', error);
        mostrarError('No se pudo cargar la configuración.');
    }

    // Event listeners para modal personalizado
    const btnPersonalizado = document.getElementById('btnPersonalizado');
    const modal = document.getElementById('modalPersonalizado');
    const closeModal = document.getElementById('closeModal');
    const btnCancelar = document.getElementById('btnCancelar');
    const formPersonalizado = document.getElementById('formPersonalizado');

    btnPersonalizado.addEventListener('click', () => {
        modal.classList.add('show');
    });

    closeModal.addEventListener('click', cerrarModal);
    btnCancelar.addEventListener('click', cerrarModal);

    formPersonalizado.addEventListener('submit', (e) => {
        e.preventDefault();
        generarTicketPersonalizado();
    });

    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            cerrarModal();
        }
    });

    // Event listeners para modal de subopciones
    const modalSubopciones = document.getElementById('modalSubopciones');
    const closeModalSubopciones = document.getElementById('closeModalSubopciones');
    const btnCancelarSubopciones = document.getElementById('btnCancelarSubopciones');
    const btnImprimirCompleto = document.getElementById('btnImprimirCompleto');

    closeModalSubopciones.addEventListener('click', cerrarModalSubopciones);
    btnCancelarSubopciones.addEventListener('click', cerrarModalSubopciones);

    btnImprimirCompleto.addEventListener('click', () => {
        if (botonActualConSubopciones) {
            imprimirTicket(botonActualConSubopciones);
            cerrarModalSubopciones();
        }
    });

    // Cerrar modal de subopciones al hacer clic fuera
    modalSubopciones.addEventListener('click', (e) => {
        if (e.target === modalSubopciones) {
            cerrarModalSubopciones();
        }
    });
});

// Renderizar botones desde la configuración
function renderizarBotones() {
    const botonera = document.getElementById('botonera');
    botonera.innerHTML = '';

    botones.forEach(boton => {
        const botonElement = crearBotonElement(boton);
        botonera.appendChild(botonElement);
    });
}

// Crear elemento de botón
function crearBotonElement(boton) {
    const div = document.createElement('div');
    div.className = 'boton-area';
    
    // Si tiene subopciones, mostrar modal; si no, imprimir directamente
    div.addEventListener('click', () => {
        if (boton.tieneSubopciones && boton.subopciones) {
            mostrarModalSubopciones(boton);
        } else {
            imprimirTicket(boton);
        }
    });

    div.innerHTML = `
        <div class="btn-boton">
            <span class="btn-letra">${boton.id}</span>
        </div>
        <div class="btn-contenido">
            <span class="btn-nombre">${boton.nombre}</span>
            <span class="btn-descripcion">${boton.descripcion || ''}</span>
        </div>
    `;

    return div;
}

// Mostrar modal de subopciones
function mostrarModalSubopciones(boton) {
    botonActualConSubopciones = boton;
    const modal = document.getElementById('modalSubopciones');
    const titulo = document.getElementById('tituloModalSubopciones');
    const container = document.getElementById('subopcionesContainer');

    titulo.textContent = `Seleccione una opción - ${boton.nombre}`;
    container.innerHTML = '';

    boton.subopciones.forEach((subopcion, index) => {
        const item = document.createElement('div');
        item.className = 'subopcion-item';
        item.innerHTML = `
            <div class="subopcion-nombre">${subopcion.nombre}</div>
        `;
        item.addEventListener('click', () => {
            const botonTemporal = { ticket: subopcion.ticket };
            imprimirTicket(botonTemporal);
            cerrarModalSubopciones();
        });
        container.appendChild(item);
    });

    modal.classList.add('show');
}

// Cerrar modal de subopciones
function cerrarModalSubopciones() {
    const modal = document.getElementById('modalSubopciones');
    modal.classList.remove('show');
    botonActualConSubopciones = null;
}

// Imprimir ticket
function imprimirTicket(boton) {
    const ticketData = boton.ticket || {};
    generarHTMLTicket(ticketData);
    
    // Pequeño delay para asegurar que el HTML se renderice
    setTimeout(() => {
        window.print();
    }, 100);
}

// Generar HTML del ticket
function generarHTMLTicket(ticketData) {
    const container = document.getElementById('ticketContainer');
    
    let infoHTML = '';
    
    if (ticketData.telefono) {
        infoHTML += `
            <div class="ticket-info-item telefono">
                <span class="info-text">${ticketData.telefono}</span>
            </div>
        `;
    }
    
    if (ticketData.direccion) {
        infoHTML += `
            <div class="ticket-info-item direccion">
                <span class="info-text">${ticketData.direccion}</span>
            </div>
        `;
    }
    
    if (ticketData.horario) {
        infoHTML += `
            <div class="ticket-info-item horario">
                <span class="info-text">${ticketData.horario}</span>
            </div>
        `;
    }

    let textoAdicionalHTML = '';
    if (ticketData.textoAdicional) {
        textoAdicionalHTML = `
            <div class="ticket-texto-adicional">
                ${ticketData.textoAdicional}
            </div>
        `;
    }

    // Si no hay información, mostrar mensaje
    if (!infoHTML && !textoAdicionalHTML) {
        infoHTML = '<div class="ticket-info-item"><span class="info-text">Para más información, consulte en la oficina correspondiente.</span></div>';
    }

    container.innerHTML = `
        <div class="ticket">
            <div class="ticket-logo">
                <img src="logo_muni.png" alt="Logo Municipalidad" onerror="this.style.display='none'">
            </div>
            <div class="ticket-titulo">${ticketData.titulo || 'INFORMACIÓN'}</div>
            <div class="ticket-info">
                ${infoHTML}
            </div>
            ${textoAdicionalHTML}
            <div class="ticket-footer">
                Municipalidad de Santa Fe Capital
            </div>
        </div>
    `;
}

// Generar ticket personalizado
function generarTicketPersonalizado() {
    const titulo = document.getElementById('tituloPersonalizado').value;
    const telefono = document.getElementById('telefonoPersonalizado').value;
    const direccion = document.getElementById('direccionPersonalizado').value;
    const horario = document.getElementById('horarioPersonalizado').value;
    const textoAdicional = document.getElementById('textoAdicional').value;

    const ticketData = {
        titulo: titulo,
        telefono: telefono || null,
        direccion: direccion || null,
        horario: horario || null,
        textoAdicional: textoAdicional || null
    };

    generarHTMLTicket(ticketData);
    cerrarModal();
    
    // Limpiar formulario
    document.getElementById('formPersonalizado').reset();
    
    // Pequeño delay para asegurar que el HTML se renderice
    setTimeout(() => {
        window.print();
    }, 100);
}

// Cerrar modal
function cerrarModal() {
    const modal = document.getElementById('modalPersonalizado');
    modal.classList.remove('show');
}

// Mostrar error
function mostrarError(mensaje) {
    alert(mensaje);
}

