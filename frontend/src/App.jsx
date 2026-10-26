
import { useCallback, useEffect, useState } from "react";
import "./App.css";


const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/tareas`;


const fechaHoy = () => new Date().toISOString().slice(0, 10);

const formularioVacio = {
  titulo: "",
  descripcion: "",
  fechaLimite: "",
};

function App() {
  const [tareas, setTareas] = useState([]);
  const [filtro, setFiltro] = useState("todas");
  const [formulario, setFormulario] = useState(formularioVacio);
  const [tareaEditando, setTareaEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const cargarTareas = useCallback(async () => {
    try {
      setError("");
      const respuesta = await fetch(API_URL);

      if (!respuesta.ok) {
        throw new Error("No se pudieron cargar las tareas.");
      }

      const datos = await respuesta.json();
      setTareas(datos);
    } catch {
      setError(
        "No fue posible conectar con el servidor. Comprueba que Spring Boot esté ejecutándose en el puerto 8080."
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarTareas();
  }, [cargarTareas]);

  const pendientes = tareas.filter((tarea) => !tarea.completada);
  const completadas = tareas.filter((tarea) => tarea.completada);

  const tareasFiltradas = tareas.filter((tarea) => {
    const coincideEstado =
      filtro === "todas" ||
      (filtro === "pendientes" && !tarea.completada) ||
      (filtro === "completadas" && tarea.completada);

    const texto = `${tarea.titulo} ${tarea.descripcion || ""}`.toLowerCase();
    const coincideBusqueda = texto.includes(busqueda.toLowerCase());

    return coincideEstado && coincideBusqueda;
  });

  const abrirNuevaTarea = () => {
    setTareaEditando(null);
    setFormulario(formularioVacio);
    setMostrarFormulario(true);
    setError("");
  };

  const abrirEdicion = (tarea) => {
    setTareaEditando(tarea);
    setFormulario({
      titulo: tarea.titulo || "",
      descripcion: tarea.descripcion || "",
      fechaLimite: tarea.fechaLimite || "",
    });
    setMostrarFormulario(true);
    setError("");
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setTareaEditando(null);
    setFormulario(formularioVacio);
  };

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
  };

  const guardarTarea = async (evento) => {
    evento.preventDefault();

    if (!formulario.titulo.trim()) {
      setError("Escribe un título para la tarea.");
      return;
    }

    try {
      setGuardando(true);
      setError("");

      const esEdicion = Boolean(tareaEditando);
      const url = esEdicion
        ? `${API_URL}/${tareaEditando.id}`
        : API_URL;

      const respuesta = await fetch(url, {
        method: esEdicion ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: formulario.titulo.trim(),
          descripcion: formulario.descripcion.trim(),
          fechaLimite: formulario.fechaLimite || null,
        }),
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo guardar la tarea.");
      }

      cerrarFormulario();
      await cargarTareas();
    } catch (errorGuardar) {
      setError(errorGuardar.message || "Ocurrió un error al guardar.");
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = async (tarea) => {
    try {
      setError("");

      const respuesta = await fetch(`${API_URL}/${tarea.id}/estado`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completada: !tarea.completada }),
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo cambiar el estado de la tarea.");
      }

      await cargarTareas();
    } catch (errorEstado) {
      setError(errorEstado.message);
    }
  };

  const eliminarTarea = async (tarea) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar "${tarea.titulo}"?`
    );

    if (!confirmar) return;

    try {
      setError("");

      const respuesta = await fetch(`${API_URL}/${tarea.id}`, {
        method: "DELETE",
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo eliminar la tarea.");
      }

      await cargarTareas();
    } catch (errorEliminar) {
      setError(errorEliminar.message);
    }
  };

  const fechaLegible = (fecha) => {
    if (!fecha) return "Sin fecha límite";

    return new Date(`${fecha}T12:00:00`).toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const estaVencida = (tarea) =>
    !tarea.completada && tarea.fechaLimite && tarea.fechaLimite < fechaHoy();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#inicio" aria-label="Inicio">
          <span className="brand-icon">✓</span>
          <span>
            <strong>TaskFlow</strong>
            <small>Gestor personal</small>
          </span>
        </a>

        <div className="side-label">MENÚ PRINCIPAL</div>

        <nav className="side-nav" aria-label="Menú principal">
          <button
            className={`nav-item ${filtro === "todas" ? "active" : ""}`}
            onClick={() => setFiltro("todas")}
          >
            <span>▦</span> Todas las tareas
            <span className="nav-count">{tareas.length}</span>
          </button>
          <button
            className={`nav-item ${filtro === "pendientes" ? "active" : ""}`}
            onClick={() => setFiltro("pendientes")}
          >
            <span>◷</span> Pendientes
            <span className="nav-count">{pendientes.length}</span>
          </button>
          <button
            className={`nav-item ${filtro === "completadas" ? "active" : ""}`}
            onClick={() => setFiltro("completadas")}
          >
            <span>✓</span> Completadas
            <span className="nav-count">{completadas.length}</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span className="tip-icon">✦</span>
            <strong>Un paso a la vez</strong>
            <p>Organiza tus tareas y avanza hacia tus objetivos.</p>
          </div>
          <span className="sidebar-version">GESTOR DE TAREAS · V1.0</span>
        </div>
      </aside>

      <main className="main-content" id="inicio">
        <header className="topbar">
          <div>
            <span className="eyebrow">TU ESPACIO PERSONAL</span>
            <p className="topbar-date">
              {new Date().toLocaleDateString("es-CO", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="avatar" aria-label="Usuario">T</div>
        </header>

        <section className="welcome">
          <div>
            <span className="eyebrow">PANEL DE CONTROL</span>
            <h1>Organiza tu día<span>.</span></h1>
            <p>Planifica tus tareas y convierte tus pendientes en logros.</p>
          </div>
          <button className="primary-button" onClick={abrirNuevaTarea}>
            <span>＋</span> Nueva tarea
          </button>
        </section>

        <section className="stats-grid" aria-label="Resumen de tareas">
          <article className="stat-card">
            <div className="stat-top">
              <span className="stat-icon purple">▦</span>
              <span className="stat-caption">En total</span>
            </div>
            <strong className="stat-number">{tareas.length}</strong>
            <span className="stat-description">Tareas registradas</span>
          </article>
          <article className="stat-card">
            <div className="stat-top">
              <span className="stat-icon orange">◷</span>
              <span className="stat-caption">Por hacer</span>
            </div>
            <strong className="stat-number">{pendientes.length}</strong>
            <span className="stat-description">Tareas pendientes</span>
          </article>
          <article className="stat-card">
            <div className="stat-top">
              <span className="stat-icon green">✓</span>
              <span className="stat-caption">Finalizadas</span>
            </div>
            <strong className="stat-number">{completadas.length}</strong>
            <span className="stat-description">Tareas completadas</span>
          </article>
        </section>

        <section className="tasks-section">
          <div className="section-heading">
            <div>
              <h2>Mis tareas</h2>
              <p>Todo lo que necesitas tener presente.</p>
            </div>
            <span className="task-total">{tareasFiltradas.length} tareas</span>
          </div>

          <div className="toolbar">
            <label className="search-box">
              <span>⌕</span>
              <input
                type="search"
                placeholder="Buscar una tarea..."
                value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)}
                aria-label="Buscar tareas"
              />
            </label>
            <div className="filter-tabs" aria-label="Filtrar tareas">
              {[
                ["todas", "Todas"],
                ["pendientes", "Pendientes"],
                ["completadas", "Completadas"],
              ].map(([valor, etiqueta]) => (
                <button
                  key={valor}
                  className={filtro === valor ? "filter-active" : ""}
                  onClick={() => setFiltro(valor)}
                >
                  {etiqueta}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="error-message" role="alert">
              <span>!</span>
              <p>{error}</p>
              <button onClick={() => setError("")} aria-label="Cerrar error">×</button>
            </div>
          )}

          {cargando ? (
            <div className="empty-state">
              <span className="loading-spinner" />
              <h3>Cargando tus tareas...</h3>
              <p>Estamos consultando tus datos.</p>
            </div>
          ) : tareasFiltradas.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">{busqueda ? "⌕" : "✓"}</div>
              <h3>
                {busqueda
                  ? "No encontramos resultados"
                  : filtro === "completadas"
                    ? "Aún no hay tareas completadas"
                    : filtro === "pendientes"
                      ? "¡No tienes tareas pendientes!"
                      : "Tu lista está lista para empezar"}
              </h3>
              <p>
                {busqueda
                  ? "Prueba con otra palabra."
                  : "Crea una tarea nueva y aparecerá aquí."}
              </p>
              {!busqueda && filtro !== "completadas" && (
                <button className="primary-button" onClick={abrirNuevaTarea}>
                  ＋ Crear tarea
                </button>
              )}
            </div>
          ) : (
            <div className="task-list">
              {tareasFiltradas.map((tarea) => (
                <article
                  className={`task-card ${tarea.completada ? "task-done" : ""}`}
                  key={tarea.id}
                >
                  <button
                    className={`task-check ${tarea.completada ? "checked" : ""}`}
                    onClick={() => cambiarEstado(tarea)}
                    aria-label={
                      tarea.completada
                        ? "Marcar como pendiente"
                        : "Marcar como completada"
                    }
                    title={tarea.completada ? "Marcar pendiente" : "Completar tarea"}
                  >
                    {tarea.completada ? "✓" : ""}
                  </button>

                  <div className="task-info">
                    <h3>{tarea.titulo}</h3>
                    {tarea.descripcion && <p>{tarea.descripcion}</p>}
                    <div className="task-meta">
                      <span className={`task-status ${tarea.completada ? "status-done" : "status-pending"}`}>
                        <span className="status-dot" />
                        {tarea.completada ? "Completada" : "Pendiente"}
                      </span>
                      <span className={`task-date ${estaVencida(tarea) ? "date-overdue" : ""}`}>
                        <span>▦</span>
                        {fechaLegible(tarea.fechaLimite)}
                        {estaVencida(tarea) && " · Vencida"}
                      </span>
                    </div>
                  </div>

                  <div className="task-actions">
                    <button
                      onClick={() => abrirEdicion(tarea)}
                      aria-label={`Editar ${tarea.titulo}`}
                      title="Editar"
                    >
                      ✎
                    </button>
                    <button
                      className="delete-action"
                      onClick={() => eliminarTarea(tarea)}
                      aria-label={`Eliminar ${tarea.titulo}`}
                      title="Eliminar"
                    >
                      ×
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="page-footer">
          <span>TaskFlow <span className="footer-dot">●</span> Tu organización, a tu ritmo.</span>
          <span>Los cambios se guardan en tu base de datos.</span>
        </footer>
      </main>

      {mostrarFormulario && (
        <div
          className="modal-backdrop"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) cerrarFormulario();
          }}
        >
          <section
            className="task-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="modal-heading">
              <div>
                <span className="eyebrow">
                  {tareaEditando ? "ACTUALIZA TUS PENDIENTES" : "NUEVO PENDIENTE"}
                </span>
                <h2 id="modal-title">
                  {tareaEditando ? "Editar tarea" : "Crear tarea"}
                </h2>
              </div>
              <button
                className="modal-close"
                onClick={cerrarFormulario}
                aria-label="Cerrar formulario"
              >
                ×
              </button>
            </div>

            <form onSubmit={guardarTarea}>
              <label className="form-field">
                <span>Título <b>*</b></span>
                <input
                  name="titulo"
                  value={formulario.titulo}
                  onChange={manejarCambio}
                  placeholder="Ej. Terminar actividad de la universidad"
                  maxLength={120}
                  required
                  autoFocus
                />
              </label>

              <label className="form-field">
                <span>Descripción</span>
                <textarea
                  name="descripcion"
                  value={formulario.descripcion}
                  onChange={manejarCambio}
                  placeholder="Añade detalles que te ayuden a completar la tarea..."
                  rows={4}
                />
              </label>

              <label className="form-field">
                <span>Fecha límite</span>
                <input
                  type="date"
                  name="fechaLimite"
                  value={formulario.fechaLimite}
                  onChange={manejarCambio}
                />
              </label>

              {error && <p className="form-error" role="alert">{error}</p>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={cerrarFormulario}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  disabled={guardando}
                >
                  {guardando
                    ? "Guardando..."
                    : tareaEditando
                      ? "Guardar cambios"
                      : "Crear tarea"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
