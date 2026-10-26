# A mi ritmo — Why Bother?

Obra interactiva de simulación computacional para Diseño y Cultura. Desarrollada desde cero a partir de los dos textos personales aportados: ir solo a una discoteca, la mezcla de nervios y curiosidad, y una bebida de limón, un toque dulce, agua con gas y hielo cuyo sabor cambia durante la noche.

## La idea

**¿Para qué tomarte el trabajo de quedarte cuando todavía no te sientes parte del lugar?**

La obra propone una respuesta abierta: para darte tiempo de encontrar una forma propia de estar. El vaso es un pequeño espacio personal dentro de una discoteca sugerida. No hay puntuaciones, objetivos de consumo ni una interacción obligatoria. La bebida no contiene alcohol.

La experiencia tiene tres momentos, derivados del deshielo: llegar sin conocer a nadie, descubrir que no hace falta seguir a nadie y notar que cambió tu manera de habitar el lugar. No son niveles que debas superar. Puedes quedarte quieto, pausar o empezar otra vez.

## Ejecutar en VS Code

Abre esta carpeta en VS Code. Necesitas Node.js (probado con Node 22).

```powershell
npm.cmd run dev
```

Abre http://127.0.0.1:5180/. No hace falta instalar dependencias: el proyecto usa módulos JavaScript, Canvas 2D y Web Audio nativos. No abras index.html mediante file:// porque el navegador restringe módulos locales.

- `npm.cmd test`: pruebas de simulación.
- `npm.cmd run build`: copia una versión estática a dist/.
- `npm.cmd run preview`: sirve dist/ en el puerto 5180. Detén antes dev con Ctrl+C.

## Interacciones

1. Pulsa **Entrar a mi ritmo**.
2. Arrastra el vaso para inclinarlo y desplazar el hielo. Las flechas izquierda y derecha ofrecen una alternativa de teclado cuando el foco no está en un botón.
3. Pulsa **Marca tu pulso**, toca el vaso sin arrastrar o usa Espacio con el foco en el escenario.
4. Activa **Respira un momento** para disminuir la agitación y el fondo sonoro.
5. También puedes no hacer nada: el tiempo derrite el hielo y cambia el color, el movimiento y las frases.
6. El sonido empieza apagado. **Sonido** activa un ambiente grave suave, pulsaciones y choques sintetizados del hielo. **Pausar** congela la simulación y silencia el ambiente. Al cambiar de pestaña o abrir La obra también se suspende.

## Qué se simula

- Integración temporal con pasos fijos a 120 Hz.
- Inercia de la inclinación del vaso, amortiguación y fuerzas sobre seis cuerpos de hielo.
- Flotación simplificada, colisiones entre cuerpos y límites del recipiente.
- Disminución gradual del tamaño del hielo; el movimiento acelera un poco el deshielo.
- Burbujas que ascienden con distintas velocidades y se regeneran en el fondo.
- Un estado de agitación y adaptación que modifica el entorno visual y sonoro.

Es un modelo expresivo, no un simulador termodinámico ni una medida psicológica. El deshielo se completa aproximadamente en 100 segundos de tiempo activo sin agitación. La preferencia de movimiento reducido elimina el balanceo visual y el movimiento automático del fondo.

## Archivos

| Archivo | Responsabilidad |
| --- | --- |
| index.html | Estructura, controles accesibles y texto de la obra |
| src/main.js | Ciclo de animación y coordinación |
| src/config.js | Frases, límites y utilidades |
| src/simulation.js | Cuerpos, fuerzas, colisiones, burbujas y deshielo |
| src/renderer.js | Ilustración del vaso, hielo, limón, luces y siluetas con Canvas |
| src/gestures.js | Ratón, táctil, teclado y cancelación de gestos |
| src/audio.js | Ambiente y notas sintetizadas, sin archivos musicales |
| src/ui.js | Estados de controles, capítulos, pausa y diálogo |
| src/styles.css | Diseño visual y adaptación a pantallas pequeñas |
| scripts/serve.mjs | Servidor local sin dependencias |
| scripts/build.mjs | Preparación de dist/ |
| tests/simulation.test.js | Cinco pruebas de estabilidad y comportamiento |

## Verificación

Cinco pruebas aprobadas: cambio sin interacción, deshielo por agitación, estabilidad y límites del hielo, respiración/reinicio y rechazo de tiempos inválidos. Composición revisada en escritorio 1365×900 y móvil 390×844. Entrada, sonido opcional, pulsación, arrastre, pausa, respiración y diálogo comprobados en navegador sin errores de consola detectados. La apreciación del volumen y timbre requiere escucharlos en el equipo de presentación.

No hay analítica, peticiones externas, fuentes remotas, grabaciones ni recursos con dependencia de conexión. No se modificó el proyecto anterior ni se publicaron cambios en GitHub.
