package com.gestortareas.application.service;

import com.gestortareas.domain.model.Tarea;
import com.gestortareas.domain.port.out.TareaRepositoryPort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class TareaService {

    private final TareaRepositoryPort tareaRepositoryPort;

    public TareaService(TareaRepositoryPort tareaRepositoryPort) {
        this.tareaRepositoryPort = tareaRepositoryPort;
    }

    public Tarea crear(Tarea tarea) {
        tarea.setCompletada(false);
        return tareaRepositoryPort.guardar(tarea);
    }

    public List<Tarea> listarTodas() {
        return tareaRepositoryPort.listarTodas();
    }

    public Tarea buscarPorId(Long id) {
        return tareaRepositoryPort.buscarPorId(id)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "No se encontró la tarea con ID: " + id
                        )
                );
    }

    public Tarea actualizar(Long id, Tarea datosActualizados) {
        Tarea tareaExistente = buscarPorId(id);

        tareaExistente.setTitulo(datosActualizados.getTitulo());
        tareaExistente.setDescripcion(datosActualizados.getDescripcion());
        tareaExistente.setFechaLimite(datosActualizados.getFechaLimite());

        return tareaRepositoryPort.guardar(tareaExistente);
    }

    public Tarea cambiarEstado(Long id, boolean completada) {
        Tarea tarea = buscarPorId(id);
        tarea.setCompletada(completada);

        return tareaRepositoryPort.guardar(tarea);
    }

    public void eliminar(Long id) {
        buscarPorId(id);
        tareaRepositoryPort.eliminar(id);
    }

    public List<Tarea> listarPorEstado(boolean completada) {
        return tareaRepositoryPort.listarTodas()
                .stream()
                .filter(tarea -> tarea.isCompletada() == completada)
                .toList();
    }
}
