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
                inicializarEventListeners();
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
            inicializarEventListeners();
        } else {
            mostrarError('No se pudo cargar la configuración.');
        }
    } catch (error) {
        console.error('Error al cargar configuración:', error);
        mostrarError('No se pudo cargar la configuración.');
    }
});

// Inicializar todos los event listeners
function inicializarEventListeners() {
    // Event listeners para modal personalizado
    const btnPersonalizado = document.getElementById('btnPersonalizado');
    const modalPersonalizado = document.getElementById('modalPersonalizado');
    const closeModal = document.getElementById('closeModal');
    const btnCancelar = document.getElementById('btnCancelar');
    const formPersonalizado = document.getElementById('formPersonalizado');

    if (btnPersonalizado) {
        btnPersonalizado.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (modalPersonalizado) {
                modalPersonalizado.classList.add('show');
            }
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            cerrarModal();
        });
    }

    if (btnCancelar) {
        btnCancelar.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            cerrarModal();
        });
    }

    if (formPersonalizado) {
        formPersonalizado.addEventListener('submit', (e) => {
            e.preventDefault();
            generarTicketPersonalizado();
        });
    }

    // Cerrar modal personalizado al hacer clic fuera
    if (modalPersonalizado) {
        modalPersonalizado.addEventListener('click', (e) => {
            if (e.target === modalPersonalizado) {
                cerrarModal();
            }
        });
    }

    // Event listeners para modal de subopciones
    const modalSubopciones = document.getElementById('modalSubopciones');
    
    if (modalSubopciones) {
        // Cerrar modal al hacer clic fuera
        modalSubopciones.addEventListener('click', (e) => {
            if (e.target === modalSubopciones) {
                cerrarModalSubopciones();
            }
        });

        // Event delegation para botones dentro del modal-content
        const modalContent = modalSubopciones.querySelector('.modal-content');
        if (modalContent) {
            modalContent.addEventListener('click', (e) => {
                // Botón cerrar (X)
                if (e.target.id === 'closeModalSubopciones' || e.target.closest('#closeModalSubopciones')) {
                    e.preventDefault();
                    e.stopPropagation();
                    cerrarModalSubopciones();
                    return;
                }
                
                // Botón Cancelar
                if (e.target.id === 'btnCancelarSubopciones' || e.target.closest('#btnCancelarSubopciones')) {
                    e.preventDefault();
                    e.stopPropagation();
                    cerrarModalSubopciones();
                    return;
                }
                
                // Botón Imprimir Completo
                if (e.target.id === 'btnImprimirCompleto' || e.target.closest('#btnImprimirCompleto')) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (botonActualConSubopciones) {
                        imprimirTicket(botonActualConSubopciones);
                        cerrarModalSubopciones();
                    }
                    return;
                }
            });
        }
    }

    // Atajos de teclado para modales
    document.addEventListener('keydown', (e) => {
        // Escape para cerrar cualquier modal
        if (e.key === 'Escape') {
            const modalPersonalizado = document.getElementById('modalPersonalizado');
            const modalSubopciones = document.getElementById('modalSubopciones');
            
            if (modalPersonalizado && modalPersonalizado.classList.contains('show')) {
                cerrarModal();
            } else if (modalSubopciones && modalSubopciones.classList.contains('show')) {
                cerrarModalSubopciones();
            }
        }
    });
}

// Renderizar botones desde la configuración
function renderizarBotones() {
    const botonera = document.getElementById('botonera');
    if (!botonera) return;
    
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
    div.addEventListener('click', (e) => {
        e.stopPropagation();
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

    if (!modal || !titulo || !container) return;

    titulo.textContent = `Seleccione una opción - ${boton.nombre}`;
    container.innerHTML = '';

    boton.subopciones.forEach((subopcion, index) => {
        const item = document.createElement('div');
        item.className = 'subopcion-item';
        
        // Obtener dirección del ticket
        const direccion = subopcion.ticket?.direccion || '';
        const direccionHTML = direccion ? `<div class="subopcion-direccion">${direccion}</div>` : '';
        
        item.innerHTML = `
            <div class="subopcion-nombre">${subopcion.nombre}</div>
            ${direccionHTML}
        `;
        item.addEventListener('click', (e) => {
            e.stopPropagation();
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
    if (modal) {
        modal.classList.remove('show');
    }
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
    if (!container) return;
    
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
    const titulo = document.getElementById('tituloPersonalizado');
    const telefono = document.getElementById('telefonoPersonalizado');
    const direccion = document.getElementById('direccionPersonalizado');
    const horario = document.getElementById('horarioPersonalizado');
    const textoAdicional = document.getElementById('textoAdicional');

    if (!titulo) return;

    const ticketData = {
        titulo: titulo.value,
        telefono: telefono ? telefono.value : '',
        direccion: direccion ? direccion.value : '',
        horario: horario ? horario.value : '',
        textoAdicional: textoAdicional ? textoAdicional.value : ''
    };

    generarHTMLTicket(ticketData);
    cerrarModal();
    
    // Limpiar formulario
    const form = document.getElementById('formPersonalizado');
    if (form) {
        form.reset();
    }
    
    // Pequeño delay para asegurar que el HTML se renderice
    setTimeout(() => {
        window.print();
    }, 100);
}

// Cerrar modal
function cerrarModal() {
    const modal = document.getElementById('modalPersonalizado');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Mostrar error
function mostrarError(mensaje) {
    alert(mensaje);
}
