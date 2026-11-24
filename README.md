# 💾 Simulador de Gestión de Memoria

Simulador interactivo de administración de memoria principal mediante **particiones contiguas variables con reubicación**.

El proyecto permite cargar y liberar procesos, visualizar cómo se distribuye la memoria y comparar distintos algoritmos de asignación.

## Funcionalidades

El simulador permite:

- Definir la capacidad total de la memoria principal.
- Cargar procesos indicando su PID y tamaño en KB.
- Generar automáticamente un PID disponible.
- Liberar procesos mediante su PID.
- Visualizar gráficamente las particiones ocupadas y libres.
- Consultar una tabla con la información de cada partición.
- Utilizar los algoritmos First Fit, Best Fit y Worst Fit.
- Compactar la memoria para eliminar la fragmentación externa mediante la reubicación de procesos.
- Reiniciar completamente la simulación.

## Tecnologías utilizadas

El proyecto fue desarrollado utilizando:

- HTML5
- CSS3
- JavaScript
- IBM Plex Sans
- GitHub

No requiere instalación de dependencias ni frameworks externos.

## Cómo ejecutar el simulador

Se puede ejecutar directamente desde un navegador web.

1. Descargar o clonar el repositorio.
2. Abrir el archivo `index.html` en un navegador.

También puede ejecutarse utilizando una extensión como **Live Server** desde Visual Studio Code.

## Uso del simulador

### 1. Inicializar la memoria

En **Capacidad total de memoria** se debe ingresar la cantidad de memoria que tendrá el simulador, expresada en KB.

Por ejemplo:

```text
1000 KB
```

Luego se debe presionar **Inicializar memoria**.

Al comenzar, toda la capacidad configurada se representa como un único hueco de memoria libre.

### 2. Cargar un proceso

Para cargar un proceso se debe ingresar:

- PID del proceso.
- Tamaño del proceso en KB.
- Algoritmo de asignación.

El PID también puede generarse automáticamente mediante el botón **Generar PID**.

Luego se debe presionar **Cargar proceso**.

Si existe un hueco libre suficientemente grande, el proceso será ubicado en memoria y el espacio restante continuará disponible como un nuevo hueco libre.

No se permite cargar dos procesos con el mismo PID.

### 3. Algoritmos de asignación

El simulador permite elegir entre tres algoritmos.

#### First Fit

Selecciona el primer hueco libre que tenga tamaño suficiente para alojar el proceso.

#### Best Fit

Busca entre todos los huecos disponibles y selecciona el hueco más pequeño que tenga tamaño suficiente.

Su objetivo es dejar el menor espacio sobrante posible.

#### Worst Fit

Selecciona el hueco libre de mayor tamaño.

De esta manera, después de cargar el proceso queda el mayor espacio libre posible dentro de ese hueco.

## Liberar un proceso

Para liberar memoria se debe ingresar el PID correspondiente y presionar **Liberar proceso**.

La partición que ocupaba el proceso vuelve a convertirse en memoria libre.

Si al liberar un proceso quedan dos o más huecos libres consecutivos, el simulador los combina automáticamente formando un único hueco de mayor tamaño.

## Mapa de memoria

El **Mapa de memoria** muestra gráficamente cómo se encuentra distribuida la memoria principal.

- Verde: memoria libre.
- Azul: memoria ocupada por un proceso.

El tamaño de cada bloque es proporcional a la cantidad de memoria que representa.

Por este motivo, algunas particiones extremadamente pequeñas pueden no ser visibles claramente en el gráfico. Sus valores exactos siempre pueden consultarse en la tabla de particiones.

## Tabla de particiones

La tabla muestra el estado actual de todas las particiones de memoria.

Para cada una se informa:

- Inicio.
- Fin.
- Tamaño.
- Estado.
- PID.

Las particiones libres muestran `-` en la columna PID.

Los valores de **Inicio** y **Fin** representan los límites del bloque dentro de la memoria simulada.

Por ejemplo:

```text
Inicio: 0 KB
Fin:    200 KB
Tamaño: 200 KB
```

En este caso el bloque ocupa el intervalo desde 0 KB hasta el límite de 200 KB.

La siguiente partición puede comenzar directamente en 200 KB.

## Fragmentación externa

Al cargar y liberar procesos pueden quedar varios huecos libres separados entre sí.

Por ejemplo:

```text
Proceso
Hueco libre
Proceso
Hueco libre
Proceso
```

Aunque la suma total de memoria libre sea suficiente para un nuevo proceso, puede ocurrir que ningún hueco individual tenga el tamaño necesario.

Esta situación representa **fragmentación externa**.

## Compactación y reubicación

El botón **Compactar memoria** permite resolver la fragmentación externa.

Al compactar:

1. Los procesos ocupados son reubicados de manera contigua desde el inicio de la memoria.
2. Se actualizan sus posiciones de inicio y fin.
3. Toda la memoria libre queda agrupada en un único hueco al final.

Ejemplo previo a la compactación:

```text
Proceso 1001
Hueco libre
Proceso 1003
Hueco libre
Proceso 1005
```

Luego de compactar:

```text
Proceso 1001
Proceso 1003
Proceso 1005
Hueco libre
```

Los procesos mantienen su PID y su tamaño, pero pueden cambiar de ubicación dentro de la memoria.

## Resumen del sistema

En la parte superior de la aplicación se muestran cinco indicadores:

- Memoria total.
- Memoria ocupada.
- Memoria libre.
- Procesos cargados.
- Huecos libres.

Estos valores se actualizan automáticamente después de cada operación.

## Reiniciar la simulación

El botón **Reiniciar simulación** elimina el estado actual y permite comenzar nuevamente desde cero.

También se restablece:

- La memoria configurada.
- Los procesos cargados.
- El PID automático.
- El algoritmo seleccionado.

## Ejemplo de prueba

Un posible escenario para comprobar el funcionamiento es utilizar una memoria de:

```text
1000 KB
```

y cargar:

```text
PID 1001 → 200 KB
PID 1002 → 300 KB
PID 1003 → 150 KB
PID 1004 → 250 KB
```

Luego liberar:

```text
PID 1002
PID 1004
```

Esto genera distintos huecos libres.

Se puede intentar cargar un proceso de mayor tamaño para observar cómo la fragmentación puede impedir su asignación y posteriormente utilizar **Compactar memoria** para reunir todo el espacio libre.

Este ejemplo permite observar:

- Carga de procesos.
- Liberación de memoria.
- Fragmentación externa.
- Reubicación.
- Compactación.
- Actualización de la tabla y del mapa de memoria.

## Versión online

El simulador también se encuentra disponible mediante Vercel:

https://simulador-memoria-dusky.vercel.app/

## Autor

Brian Garcia

Proyecto realizado para la materia **Arquitectura de Sistemas Operativos**.