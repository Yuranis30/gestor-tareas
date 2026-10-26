
package com.gestortareas.infrastructure.repository;

import com.gestortareas.domain.model.Tarea;
import com.gestortareas.domain.port.out.TareaRepositoryPort;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class TareaRepositoryAdapter implements TareaRepositoryPort {

    private final TareaRepository tareaRepository;

    public TareaRepositoryAdapter(TareaRepository tareaRepository) {
        this.tareaRepository = tareaRepository;
    }

    @Override
    public Tarea guardar(Tarea tarea) {
        return tareaRepository.save(tarea);
    }

    @Override
    public List<Tarea> listarTodas() {
        return tareaRepository.findAll();
    }

    @Override
    public Optional<Tarea> buscarPorId(Long id) {
        return tareaRepository.findById(id);
    }

    @Override
    public void eliminar(Long id) {
        tareaRepository.deleteById(id);
    }
}
