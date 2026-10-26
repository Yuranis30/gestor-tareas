package com.gestortareas.domain.port.out;

import com.gestortareas.domain.model.Tarea;

import java.util.List;
import java.util.Optional;

public interface TareaRepositoryPort {

    Tarea guardar(Tarea tarea);

    List<Tarea> listarTodas();

    Optional<Tarea> buscarPorId(Long id);

    void eliminar(Long id);
}
