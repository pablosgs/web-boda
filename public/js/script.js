/*
 * Único script de la web.
 * - Muestra la cuenta atrás hasta la boda.
 * - Permite copiar el número de cuenta.
 * - Menú desplegable (solo visible en los estilos que lo usan).
 * - Probador de estilos: solo se activa abriendo la web con ?estilos
 *   (por ejemplo https://tudominio.com/?estilos). Permite cambiar estilo,
 *   paleta y tipografía al vuelo y genera la etiqueta <html> para pegar en
 *   index.html. También acepta ?estilos&estilo=postal&tema=arena&tipo=maquina
 *   para compartir una combinación concreta.
 * No hace peticiones de red, no usa cookies ni almacenamiento.
 */
(function () {
  "use strict";

  function iniciarCuentaAtras() {
    var elemento = document.getElementById("cuenta-atras");
    if (!elemento) return;

    var fecha = new Date(elemento.getAttribute("data-fecha"));
    if (isNaN(fecha.getTime())) return;

    var hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    var dia = new Date(fecha);
    dia.setHours(0, 0, 0, 0);

    var dias = Math.round((dia - hoy) / 86400000);
    var texto;

    if (dias > 1) {
      texto = "Faltan " + dias + " días";
    } else if (dias === 1) {
      texto = "Es mañana";
    } else if (dias === 0) {
      texto = "Es hoy";
    } else {
      return;
    }

    elemento.textContent = texto;
    elemento.hidden = false;
  }

  function copiarTexto(texto) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(texto);
    }

    return new Promise(function (resolver, rechazar) {
      var area = document.createElement("textarea");
      area.value = texto;
      area.setAttribute("readonly", "");
      area.className = "fuera-de-pantalla";
      document.body.appendChild(area);
      area.select();
      var ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (e) {
        ok = false;
      }
      document.body.removeChild(area);
      if (ok) {
        resolver();
      } else {
        rechazar();
      }
    });
  }

  function iniciarBotonesCopiar() {
    var botones = document.querySelectorAll("[data-copiar]");

    Array.prototype.forEach.call(botones, function (boton) {
      var origen = document.getElementById(boton.getAttribute("data-copiar"));
      if (!origen) return;

      var contenedor = boton.parentElement;
      var aviso = contenedor ? contenedor.querySelector("[role='status']") : null;
      var temporizador;

      boton.hidden = false;

      boton.addEventListener("click", function () {
        var texto = origen.textContent.replace(/\s+/g, " ").trim();

        copiarTexto(texto).then(
          function () {
            mostrarAviso("Número copiado");
          },
          function () {
            mostrarAviso("No se ha podido copiar. Selecciona el número y cópialo a mano.");
          }
        );
      });

      function mostrarAviso(mensaje) {
        if (!aviso) return;
        aviso.textContent = mensaje;
        clearTimeout(temporizador);
        temporizador = setTimeout(function () {
          aviso.textContent = "";
        }, 3000);
      }
    });
  }

  function iniciarMenu() {
    var boton = document.getElementById("menu-boton");
    var menu = document.getElementById("menu");
    var cerrar = document.getElementById("menu-cerrar");
    if (!boton || !menu) return;

    function abrir() {
      menu.hidden = false;
      boton.setAttribute("aria-expanded", "true");
      document.body.classList.add("menu-abierto");
      if (cerrar) cerrar.focus();
    }

    function ocultar(devolverFoco) {
      menu.hidden = true;
      boton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-abierto");
      if (devolverFoco) boton.focus();
    }

    boton.hidden = false;

    boton.addEventListener("click", abrir);

    if (cerrar) {
      cerrar.addEventListener("click", function () {
        ocultar(true);
      });
    }

    Array.prototype.forEach.call(menu.querySelectorAll("a"), function (enlace) {
      enlace.addEventListener("click", function () {
        ocultar(false);
      });
    });

    document.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape" && !menu.hidden) ocultar(true);
    });
  }

  function iniciarProbador() {
    var parametros = new URLSearchParams(window.location.search);
    if (!parametros.has("estilos")) return;

    var raiz = document.documentElement;
    var panel = document.getElementById("probador");
    var campos = {
      estilo: document.getElementById("probador-estilo"),
      tema: document.getElementById("probador-tema"),
      tipo: document.getElementById("probador-tipo")
    };
    var recomendado = document.getElementById("probador-recomendado");
    var codigo = document.getElementById("probador-codigo");
    var aviso = document.getElementById("probador-aviso");
    var botonAzar = document.getElementById("probador-aleatorio");
    var botonCopiar = document.getElementById("probador-copiar");
    var botonPlegar = document.getElementById("probador-plegar");

    if (!panel || !campos.estilo || !campos.tema || !campos.tipo || !codigo) return;

    var ejes = ["estilo", "tema", "tipo"];

    function valores(select) {
      return Array.prototype.map.call(select.options, function (opcion) {
        return opcion.value;
      });
    }

    function etiqueta() {
      return '<html lang="es" data-estilo="' + raiz.getAttribute("data-estilo") +
        '" data-tema="' + raiz.getAttribute("data-tema") +
        '" data-tipo="' + raiz.getAttribute("data-tipo") + '">';
    }

    function aplicar(seleccion) {
      var url = new URL(window.location.href);

      ejes.forEach(function (eje) {
        var valor = seleccion[eje];
        if (valores(campos[eje]).indexOf(valor) !== -1) {
          raiz.setAttribute("data-" + eje, valor);
          campos[eje].value = valor;
        }
        url.searchParams.set(eje, raiz.getAttribute("data-" + eje));
      });

      codigo.textContent = etiqueta();
      if (aviso) aviso.textContent = "";
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    }

    function actual() {
      return {
        estilo: campos.estilo.value,
        tema: campos.tema.value,
        tipo: campos.tipo.value
      };
    }

    function azar(lista) {
      return lista[Math.floor(Math.random() * lista.length)];
    }

    aplicar({
      estilo: parametros.get("estilo") || raiz.getAttribute("data-estilo"),
      tema: parametros.get("tema") || raiz.getAttribute("data-tema"),
      tipo: parametros.get("tipo") || raiz.getAttribute("data-tipo")
    });

    campos.estilo.addEventListener("change", function () {
      var seleccion = actual();
      var opcion = campos.estilo.options[campos.estilo.selectedIndex];
      if (recomendado && recomendado.checked && opcion) {
        seleccion.tema = opcion.getAttribute("data-tema") || seleccion.tema;
        seleccion.tipo = opcion.getAttribute("data-tipo") || seleccion.tipo;
      }
      aplicar(seleccion);
    });

    campos.tema.addEventListener("change", function () {
      aplicar(actual());
    });

    campos.tipo.addEventListener("change", function () {
      aplicar(actual());
    });

    if (botonAzar) {
      botonAzar.addEventListener("click", function () {
        aplicar({
          estilo: azar(valores(campos.estilo)),
          tema: azar(valores(campos.tema)),
          tipo: azar(valores(campos.tipo))
        });
      });
    }

    if (botonCopiar) {
      botonCopiar.addEventListener("click", function () {
        copiarTexto(etiqueta()).then(
          function () {
            if (aviso) aviso.textContent = "Copiada. Sustituye con ella la etiqueta <html> de index.html y 404.html.";
          },
          function () {
            if (aviso) aviso.textContent = "No se ha podido copiar. Copia el texto de arriba a mano.";
          }
        );
      });
    }

    if (botonPlegar) {
      botonPlegar.addEventListener("click", function () {
        var plegado = panel.classList.toggle("probador--plegado");
        botonPlegar.textContent = plegado ? "Mostrar probador" : "Ocultar";
        botonPlegar.setAttribute("aria-expanded", plegado ? "false" : "true");
      });
    }

    panel.hidden = false;
  }

  document.documentElement.classList.add("js");

  document.addEventListener("DOMContentLoaded", function () {
    iniciarMenu();
    iniciarCuentaAtras();
    iniciarBotonesCopiar();
    iniciarProbador();
  });
})();
