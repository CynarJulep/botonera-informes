# Botonera de Informes - Atención Ciudadana

Aplicación web para generar e imprimir tickets informativos de diferentes áreas municipales. Diseñada para funcionar con impresoras térmicas de 80mm.

## 🚀 Características

- **Botonera interactiva**: Interfaz simple con botones para cada área municipal
- **Impresión optimizada**: Tickets formateados específicamente para impresoras térmicas de 80mm
- **Botones con subopciones**: Algunos botones (Registro del Automotor, Distritos) permiten seleccionar ubicaciones específicas
- **Ticket personalizado**: Opción para crear tickets con información personalizada
- **Diseño responsive**: Funciona en diferentes tamaños de pantalla
- **Logo municipal**: Incluye el logo de Santa Fe Capital en cada ticket

## 📋 Requisitos

- Navegador web moderno (Chrome, Edge, Firefox)
- Impresora térmica de 80mm (opcional, para imprimir tickets)

## 🛠️ Instalación

### Opción 1: Uso Local

1. Clona o descarga este repositorio
2. Abre `index.html` directamente en tu navegador
3. La aplicación funcionará usando la configuración embebida

### Opción 2: Despliegue en Vercel

1. Conecta este repositorio con Vercel
2. Vercel detectará automáticamente la configuración
3. La aplicación usará `config.json` desde el servidor

## 📁 Estructura del Proyecto

```
Botonera_informes/
├── index.html          # Página principal
├── styles.css          # Estilos de la aplicación
├── script.js           # Lógica de la aplicación
├── config.json         # Configuración de botones (usado en Vercel)
├── logo_muni.png       # Logo municipal
├── vercel.json         # Configuración de Vercel
└── README.md           # Este archivo
```

## ⚙️ Configuración

### Agregar o Modificar Botones

Edita el archivo `config.json` para agregar, modificar o eliminar botones. Cada botón tiene la siguiente estructura:

```json
{
  "id": "AS",
  "nombre": "Acción Social",
  "descripcion": "Servicios sociales y asistencia",
  "ticket": {
    "titulo": "ACCIÓN SOCIAL",
    "telefono": "3425 50-3353",
    "direccion": "Casa Beata Clara Bosatta\nBlas Parera 7740",
    "horario": "De 7:30 a 13:00 hrs",
    "textoAdicional": ""
  }
}
```

### Botones con Subopciones

Para crear un botón con subopciones (como Registro del Automotor o Distritos):

```json
{
  "id": "RA",
  "nombre": "Registro del Automotor",
  "descripcion": "Registro del automotor - Múltiples sedes",
  "tieneSubopciones": true,
  "subopciones": [
    {
      "nombre": "Santa Fe Nro. 1",
      "ticket": {
        "titulo": "REGISTRO DEL AUTOMOTOR\nSANTA FE NRO. 1",
        "telefono": "(0342) 4594702",
        "direccion": "San Geronimo 2016",
        "horario": ""
      }
    }
  ],
  "ticket": {
    "titulo": "REGISTRO DEL AUTOMOTOR",
    "textoAdicional": "Información completa de todas las sedes..."
  }
}
```

## 🖨️ Impresión

1. Haz clic en cualquier botón para generar un ticket
2. Se abrirá la ventana de impresión del navegador
3. Selecciona tu impresora térmica de 80mm
4. Ajusta la configuración si es necesario:
   - Tamaño de papel: 80mm
   - Márgenes: Mínimos
   - Escala: 100%

### Botones con Subopciones

- **Seleccionar subopción**: Haz clic en el botón, luego selecciona la opción específica
- **Imprimir completo**: Haz clic en "Imprimir Completo" para imprimir toda la información del área

## 🎨 Personalización

### Cambiar Colores

Edita `styles.css` y modifica los colores en las siguientes secciones:

- Botones principales: `.btn-boton` (gradiente verde/teal)
- Botón personalizado: `.btn-personalizado`
- Botón imprimir completo: `.btn-imprimir-completo`

### Modificar Logo

Reemplaza `logo_muni.png` con tu logo. El logo debe ser:
- Formato PNG con fondo transparente
- Tamaño recomendado: máximo 200px de ancho

## 📱 Responsive

La aplicación es completamente responsive y se adapta a:
- Pantallas de escritorio
- Tablets
- Dispositivos móviles

## 🔧 Solución de Problemas

### Error de CORS al abrir localmente

Si ves errores de CORS al abrir `index.html` directamente, no te preocupes. La aplicación usa una configuración embebida como respaldo que funciona sin servidor.

### Los tickets no se imprimen correctamente

1. Verifica que tu impresora térmica esté configurada para 80mm
2. Ajusta los márgenes en la configuración de impresión
3. Revisa que el tamaño de papel esté configurado correctamente

### Los botones no aparecen

1. Verifica que `config.json` esté presente y sea válido
2. Abre la consola del navegador (F12) para ver errores
3. Asegúrate de que el archivo `script.js` se esté cargando correctamente

## 📝 Notas

- Los botones de turnos (Contribuyentes, Rodados, SEOM, SUBE, Domicilio/Supervivencia) fueron removidos ya que se gestionan desde otra aplicación
- La configuración embebida en `index.html` es un respaldo para uso local
- En Vercel, la aplicación usa `config.json` directamente

## 🚀 Despliegue en Vercel

1. Conecta este repositorio con tu cuenta de Vercel
2. Vercel detectará automáticamente la configuración
3. El despliegue se realizará automáticamente
4. La aplicación estará disponible en la URL proporcionada por Vercel

## 📄 Licencia

Este proyecto es de uso interno para la Municipalidad de Santa Fe Capital.

## 👥 Autor

Desarrollado para la Municipalidad de Santa Fe Capital - Dirección de Atención Ciudadana

---

**Versión**: 1.0.0  
**Última actualización**: 2024

