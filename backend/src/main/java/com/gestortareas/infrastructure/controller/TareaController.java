
package com.gestortareas.infrastructure.controller;

import com.gestortareas.application.service.TareaService;
import com.gestortareas.domain.model.Tarea;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/tareas")
@CrossOrigin(origins = "http://localhost:5173")
public class TareaController {

    private final TareaService tareaService;

    public TareaController(TareaService tareaService) {
        this.tareaService = tareaService;
    }

    @PostMapping
    public ResponseEntity<Tarea> crear(@RequestBody Tarea tarea) {
        Tarea nuevaTarea = tareaService.crear(tarea);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevaTarea);
    }

    @GetMapping
    public ResponseEntity<List<Tarea>> listar(
            @RequestParam(required = false) Boolean completada) {

        List<Tarea> tareas;

        if (completada == null) {
            tareas = tareaService.listarTodas();
        } else {
            tareas = tareaService.listarPorEstado(completada);
        }

        return ResponseEntity.ok(tareas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tarea> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(tareaService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tarea> actualizar(
            @PathVariable Long id,
            @RequestBody Tarea tarea) {

        return ResponseEntity.ok(tareaService.actualizar(id, tarea));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Tarea> cambiarEstado(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> datos) {

        Boolean completada = datos.get("completada");

        if (completada == null) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(
                tareaService.cambiarEstado(id, completada)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        tareaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Map<String, String>> manejarNoEncontrada(
            NoSuchElementException excepcion) {

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", excepcion.getMessage()));
    }
}
