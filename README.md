# A mi ritmo — dos maneras de hacer una bebida

Juego web sobre Why Bother: recibir una bebida automática o dedicar tiempo a crear una propia en una discoteca.

## Jugar
- Izquierda: la máquina prepara y despacha un vaso cada siete segundos. El botón Obtener bebida automática entrega una bebida y suma una recepción.
- Derecha: arrastra las botellas de licor, limón, granadina y soda sobre el vaso vacío. Mantenerlas encima vierte más medidas.
- Arrastra la pala para añadir hielo (máximo cuatro cubos). Mueve la cuchara dentro del vaso para mezclar las capas.
- Puedes servir tu mezcla y empezar otra, o vaciar el vaso. No hay puntuación competitiva ni tiempo límite.
- Sonido opcional, pausa y alternativa de teclado: Tab selecciona herramientas; Enter las usa.

## Ejecutar
Requiere Node.js. Sin dependencias externas ni instalación de paquetes.

    npm run dev

Vista local: http://127.0.0.1:5180/

    npm test
    npm run build

La compilación se guarda en dist. GitHub Pages también puede servir index.html y src desde la raíz.

## Código activo
- src/game.js: ciclo automático, ingredientes, mezcla, hielo, entregas y reglas.
- src/renderer.js: vasos, máquina, cinta de entrega, capas y luces en Canvas.
- src/main.js: arrastre con puntero/táctil, mezcla, teclado, sonido y pausa.
- src/audio.js: síntesis de audio local.
- src/styles.css e index.html: mesa, herramientas SVG y diseño adaptable.
- tests/game.test.js: repetición del ciclo, capacidad, hielo, mezcla y entrega.

Los módulos anteriores de simulación permanecen en el repositorio, pero la entrada actual utiliza game.js.
La obra representa un cóctel alcohólico como parte de una noche de fiesta; las cantidades del juego son expresivas, no una receta real.
