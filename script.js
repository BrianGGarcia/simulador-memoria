// ==============================
// Estado general del simulador
// ==============================
let memoria = [];
let memoriaInicializada = false;
let proximoPid = 1001;

// ==============================
// Referencias a elementos del DOM
// ==============================
const inputMemoriaTotal = document.getElementById("memoria-total");
const btnInicializar = document.getElementById("btn-inicializar");
const resumenTotal = document.getElementById("resumen-total");
const resumenOcupada = document.getElementById("resumen-ocupada");
const resumenLibre = document.getElementById("resumen-libre");
const resumenProcesos = document.getElementById("resumen-procesos");
const resumenHuecos = document.getElementById("resumen-huecos");
const memoriaVisual = document.getElementById("memoria-visual");
const cuerpoTabla = document.getElementById("cuerpo-tabla");
const inputPid = document.getElementById("pid");
const btnGenerarPid = document.getElementById("btn-generar-pid");
const inputTamanoProceso = document.getElementById("tamano-proceso");
const selectAlgoritmo = document.getElementById("algoritmo");
const btnCargar = document.getElementById("btn-cargar");
const btnLiberar = document.getElementById("btn-liberar");
const btnCompactar = document.getElementById("btn-compactar");
const btnReiniciar = document.getElementById("btn-reiniciar");

// ==============================
// Eventos de la interfaz
// ==============================
btnInicializar.addEventListener("click", inicializarMemoria);
btnGenerarPid.addEventListener("click", generarPid);
btnCargar.addEventListener("click", cargarProceso);
btnLiberar.addEventListener("click", liberarProceso);
btnCompactar.addEventListener("click", compactarMemoria);
btnReiniciar.addEventListener("click", reiniciarSimulacion);

// Inicializa la memoria como un único hueco libre con la capacidad ingresada.
function inicializarMemoria() {
    const capacidad = Number(inputMemoriaTotal.value);

    if (!Number.isInteger(capacidad) || capacidad <= 0) {
        alert("Ingresá una capacidad de memoria válida.");
        return;
    }

    if (memoriaInicializada) {
        const confirmar = confirm(
            "Ya existe una simulación en curso. ¿Deseás reinicializar la memoria y perder el estado actual?"
        );

        if (!confirmar) {
            return;
        }
    }

    memoria = [
        {
            inicio: 0,
            tamano: capacidad,
            libre: true,
            pid: null
        }
    ];

    memoriaInicializada = true;

    proximoPid = 1001;
    inputPid.value = "";
    inputTamanoProceso.value = "";
    actualizarInterfaz();
    actualizarEstadoControles();
}

// Genera un PID numérico que no esté siendo utilizado por otro proceso.
function generarPid() {
    while (
        memoria.some(particion => particion.pid === proximoPid)
    ) {
        proximoPid++;
    }

    inputPid.value = proximoPid;
    proximoPid++;
}

// ==============================
// Actualización de la interfaz
// ==============================

// Actualiza todas las representaciones visuales del estado de memoria.
function actualizarInterfaz() {
    actualizarResumen();
    actualizarMapa();
    actualizarTabla();
}

// Calcula y muestra los indicadores generales del sistema.
function actualizarResumen() {
    const memoriaTotal = memoria.reduce(
        (total, particion) => total + particion.tamano,
        0
    );

    const memoriaOcupada = memoria
        .filter(particion => !particion.libre)
        .reduce(
            (total, particion) => total + particion.tamano,
            0
        );

    const memoriaLibre = memoriaTotal - memoriaOcupada;

    const procesosCargados = memoria.filter(
        particion => !particion.libre
    ).length;

    const huecosLibres = memoria.filter(
        particion => particion.libre
    ).length;

    resumenTotal.textContent = `${memoriaTotal} KB`;
    resumenOcupada.textContent = `${memoriaOcupada} KB`;
    resumenLibre.textContent = `${memoriaLibre} KB`;
    resumenProcesos.textContent = procesosCargados;
    resumenHuecos.textContent = huecosLibres;
}

// Genera las filas de la tabla a partir de las particiones actuales.
function actualizarTabla() {
    cuerpoTabla.innerHTML = "";

    memoria.forEach(particion => {
        const fila = document.createElement("tr");

        const fin = particion.inicio + particion.tamano;

        fila.innerHTML = `
            <td>${particion.inicio}</td>
            <td>${fin}</td>
            <td>${particion.tamano}</td>
            <td>
                <span class="estado-particion ${particion.libre ? "estado-libre" : "estado-ocupada"}">
                    ${particion.libre ? "Libre" : "Ocupada"}
                </span>
            </td>
            <td>${particion.pid ?? "-"}</td>
        `;

        cuerpoTabla.appendChild(fila);
    });
}

// Representa gráficamente las particiones respetando su tamaño proporcional.
function actualizarMapa() {
    memoriaVisual.innerHTML = "";

    const memoriaTotal = memoria.reduce(
        (total, particion) => total + particion.tamano,
        0
    );

    memoria.forEach(particion => {
        const bloque = document.createElement("div");

        bloque.classList.add("bloque-memoria");

        const proporcion = particion.tamano / memoriaTotal;

        const texto = particion.libre
            ? `Libre - ${particion.tamano} KB`
            : `PID ${particion.pid} - ${particion.tamano} KB`;

        if (particion.libre) {
            bloque.classList.add("libre");
        } else {
            bloque.classList.add("ocupada");
        }

        if (proporcion >= 0.04) {
            bloque.textContent = texto;

            if (proporcion < 0.06) {
                bloque.classList.add("bloque-pequeno");
            }
        } else {
            bloque.title = texto;
        }

        bloque.style.flex = `${particion.tamano} 1 0`;

        memoriaVisual.appendChild(bloque);
    });
}

// ==============================
// Algoritmos de asignación
// ==============================

// Devuelve el primer hueco libre suficientemente grande.
function buscarFirstFit(tamano) {
    return memoria.findIndex(
        particion => particion.libre && particion.tamano >= tamano
    );
}

// Devuelve el hueco libre más pequeño que pueda alojar el proceso.
function buscarBestFit(tamano) {
    let indiceMejorHueco = -1;
    let menorTamano = Infinity;

    memoria.forEach((particion, indice) => {
        if (
            particion.libre &&
            particion.tamano >= tamano &&
            particion.tamano < menorTamano
        ) {
            indiceMejorHueco = indice;
            menorTamano = particion.tamano;
        }
    });

    return indiceMejorHueco;
}

// Devuelve el hueco libre más grande que pueda alojar el proceso.
function buscarWorstFit(tamano) {
    let indicePeorHueco = -1;
    let mayorTamano = -1;

    memoria.forEach((particion, indice) => {
        if (
            particion.libre &&
            particion.tamano >= tamano &&
            particion.tamano > mayorTamano
        ) {
            indicePeorHueco = indice;
            mayorTamano = particion.tamano;
        }
    });

    return indicePeorHueco;
}

// Ejecuta el algoritmo seleccionado por el usuario y devuelve el índice del hueco elegido.
function buscarHueco(tamano) {
    const algoritmo = selectAlgoritmo.value;

    switch (algoritmo) {
        case "first-fit":
            return buscarFirstFit(tamano);

        case "best-fit":
            return buscarBestFit(tamano);

        case "worst-fit":
            return buscarWorstFit(tamano);

        default:
            return -1;
    }
}

// ==============================
// Gestión de procesos y particiones
// ==============================

// Valida los datos y carga un proceso en el hueco elegido por el algoritmo de asignación.
function cargarProceso() {
    if (!memoriaInicializada) {
        alert("Primero debés inicializar la memoria.");
        return;
    }

    const pid = Number(inputPid.value);
    const tamano = Number(inputTamanoProceso.value);

    if (!Number.isInteger(pid) || pid <= 0) {
        alert("Ingresá un PID válido.");
        return;
    }

    if (!Number.isInteger(tamano) || tamano <= 0) {
        alert("Ingresá un tamaño de proceso válido.");
        return;
    }

    const pidDuplicado = memoria.some(
        particion => particion.pid === pid
    );

    if (pidDuplicado) {
        alert("Ya existe un proceso con ese PID.");
        return;
    }

    const indiceHueco = buscarHueco(tamano);

    if (indiceHueco === -1) {
        alert("No hay un hueco libre suficientemente grande.");
        return;
    }

    const hueco = memoria[indiceHueco];

    const proceso = {
        inicio: hueco.inicio,
        tamano: tamano,
        libre: false,
        pid: pid
    };

    if (hueco.tamano === tamano) {
        memoria[indiceHueco] = proceso;
    } else {
        const nuevoHueco = {
            inicio: hueco.inicio + tamano,
            tamano: hueco.tamano - tamano,
            libre: true,
            pid: null
        };

        memoria.splice(
            indiceHueco,
            1,
            proceso,
            nuevoHueco
        );
    }

    actualizarInterfaz();
}

// Libera la partición correspondiente al PID ingresado.
function liberarProceso() {
    if (!memoriaInicializada) {
        alert("Primero debés inicializar la memoria.");
        return;
    }

    const pid = Number(inputPid.value);

    if (!Number.isInteger(pid) || pid <= 0) {
        alert("Ingresá un PID válido.");
        return;
    }

    const indiceProceso = memoria.findIndex(
        particion => !particion.libre && particion.pid === pid
    );

    if (indiceProceso === -1) {
        alert("No existe un proceso con ese PID.");
        return;
    }

    memoria[indiceProceso].libre = true;
    memoria[indiceProceso].pid = null;

    unirHuecosContiguos();

    actualizarInterfaz();
}

// Fusiona huecos libres consecutivos para evitar particiones libres adyacentes innecesarias.
function unirHuecosContiguos() {
    for (let i = 0; i < memoria.length - 1; i++) {
        const actual = memoria[i];
        const siguiente = memoria[i + 1];

        if (actual.libre && siguiente.libre) {
            actual.tamano += siguiente.tamano;

            memoria.splice(i + 1, 1);

            i--;
        }
    }
}

// ==============================
// Compactación y reubicación
// ==============================

// Reubica los procesos de forma contigua desde el inicio de la memoria
// y reúne toda la memoria libre en un único hueco al final.
function compactarMemoria() {
    if (!memoriaInicializada) {
        alert("Primero debés inicializar la memoria.");
        return;
    }

    const primerHuecoLibre = memoria.findIndex(
        particion => particion.libre
    );

    if (primerHuecoLibre === -1) {
        alert("La memoria está completamente ocupada. No hay huecos libres para compactar.");
        return;
    }

    if (primerHuecoLibre === memoria.length - 1) {
        alert("La memoria ya está compactada. No hay huecos intermedios para reubicar.");
        return;
    }

    const procesos = memoria.filter(
        particion => !particion.libre
    );

    const memoriaLibre = memoria
        .filter(particion => particion.libre)
        .reduce(
            (total, particion) => total + particion.tamano,
            0
        );

    let siguienteInicio = 0;

    const memoriaCompactada = procesos.map(particion => {
        const procesoReubicado = {
            inicio: siguienteInicio,
            tamano: particion.tamano,
            libre: false,
            pid: particion.pid
        };

        siguienteInicio += particion.tamano;

        return procesoReubicado;
    });

    if (memoriaLibre > 0) {
        memoriaCompactada.push({
            inicio: siguienteInicio,
            tamano: memoriaLibre,
            libre: true,
            pid: null
        });
    }

    memoria = memoriaCompactada;

    actualizarInterfaz();
}

// ==============================
// Reinicio y estado de controles
// ==============================

// Restablece por completo el simulador a su estado inicial.
function reiniciarSimulacion() {
    memoria = [];
    memoriaInicializada = false;
    actualizarEstadoControles();
    proximoPid = 1001;

    inputMemoriaTotal.value = "";
    inputPid.value = "";
    inputTamanoProceso.value = "";
    selectAlgoritmo.value = "first-fit";

    resumenTotal.textContent = "0 KB";
    resumenOcupada.textContent = "0 KB";
    resumenLibre.textContent = "0 KB";
    resumenProcesos.textContent = "0";
    resumenHuecos.textContent = "0";

    cuerpoTabla.innerHTML = "";

    memoriaVisual.innerHTML = `
        <p>La memoria todavía no fue inicializada.</p>
    `;
}

// Habilita o deshabilita los controles según si la memoria fue inicializada.
function actualizarEstadoControles() {
    btnGenerarPid.disabled = !memoriaInicializada;
    btnCargar.disabled = !memoriaInicializada;
    btnLiberar.disabled = !memoriaInicializada;
    btnCompactar.disabled = !memoriaInicializada;

    inputPid.disabled = !memoriaInicializada;
    inputTamanoProceso.disabled = !memoriaInicializada;
    selectAlgoritmo.disabled = !memoriaInicializada;
}

// Configura el estado inicial de los controles al cargar la página.
actualizarEstadoControles();