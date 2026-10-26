package com.gestortareas.infrastructure.repository;

import com.gestortareas.domain.model.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TareaRepository extends JpaRepository<Tarea, Long> {
}
