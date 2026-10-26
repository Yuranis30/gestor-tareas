# Gestor de Tareas Personales

Aplicación web para administrar tareas personales de manera sencilla, organizada e intuitiva. Permite crear tareas, consultar las registradas, editar su información, cambiar su estado de cumplimiento y eliminarlas.

## 1. Objetivo del proyecto

Desarrollar una aplicación web que facilite la organización y el seguimiento de actividades personales, aplicando conceptos de Ingeniería de Software, arquitectura hexagonal, principios SOLID y buenas prácticas de programación.

## 2. Funcionalidades

- Crear tareas con título, descripción y fecha límite.
- Consultar la lista de tareas registradas.
- Buscar tareas mediante el buscador de la interfaz.
- Filtrar tareas según su estado de cumplimiento.
- Editar la información de una tarea.
- Marcar tareas como pendientes o completadas.
- Eliminar tareas.
- Almacenar la información en una base de datos PostgreSQL.
- Interactuar con el sistema mediante una interfaz web adaptable.

## 3. Tecnologías utilizadas

| Tecnología | Función |
|---|---|
| Java 21 | Lenguaje de programación del backend |
| Spring Boot 4.1.2 | Desarrollo de la API REST |
| Maven | Gestión y compilación del backend |
| React | Construcción de la interfaz de usuario |
| Vite | Herramienta de desarrollo del frontend |
| PostgreSQL | Gestión de la base de datos |
| Git y GitHub | Control de versiones y alojamiento del código |
| Visual Studio Code | Entorno de desarrollo |

## 4. Arquitectura del sistema

El proyecto organiza el backend siguiendo una estructura basada en arquitectura hexagonal, separando las reglas del negocio, los casos de uso y los componentes externos.

### Estructura del backend

```text
backend/
└── src/
    └── main/
        └── java/
            └── com/
                └── gestortareas/
                    ├── BackendApplication.java
                    ├── domain/
                    │   ├── model/
                    │   │   └── Tarea.java
                    │   └── port/
                    │       └── out/
                    │           └── TareaRepositoryPort.java
                    ├── application/
                    │   └── service/
                    │       └── TareaService.java
                    └── infrastructure/
                        ├── controller/
                        │   └── TareaController.java
                        └── repository/
                            ├── TareaRepository.java
                            └── TareaRepositoryAdapter.java
```

### Responsabilidades de las capas

-  **Dominio:** contiene el modelo `Tarea` y el puerto de salida que define las operaciones de persistencia.
- **Aplicación:** contiene `TareaService`, responsable de coordinar las operaciones de gestión de tareas.
- **Infraestructura:** contiene el controlador REST, el repositorio de Spring Data JPA y el adaptador que conecta la aplicación con la persistencia.
- **Frontend:** presenta la interfaz y envía las solicitudes al backend mediante HTTP.

Esta separación facilita el mantenimiento, las pruebas y la evolución del sistema.

## 5. API REST

La API utiliza la ruta base `/api/tareas`.

| Método HTTP | Ruta | Operación |
|---|---|---|
| GET | `/api/tareas` | Consultar todas las tareas |
| GET | `/api/tareas?completada=true` | Consultar tareas completadas |
| GET | `/api/tareas?completada=false` | Consultar tareas pendientes |
| GET | `/api/tareas/{id}` | Consultar una tarea por identificador |
| POST | `/api/tareas` | Crear una tarea |
| PUT | `/api/tareas/{id}` | Actualizar una tarea |
| PATCH | `/api/tareas/{id}/estado` | Cambiar el estado de una tarea |
| DELETE | `/api/tareas/{id}` | Eliminar una tarea |

## 6. Requisitos previos

Para ejecutar el proyecto se necesita:

- Java Development Kit (JDK) 21.
- PostgreSQL.
- Node.js y npm.
- Visual Studio Code u otro editor.
- Los archivos del proyecto.

## 7. Configuración de la base de datos

Crear una base de datos PostgreSQL llamada `gestor_tareas`.

Configurar la conexión del backend mediante variables de entorno o una configuración local que no se publique en el repositorio.

Ejemplo de configuración:

```properties
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/gestor_tareas}
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD}
```

La variable `DB_PASSWORD` debe contener la contraseña local de PostgreSQL. No se debe publicar ninguna contraseña real en GitHub.

## 8. Instalación y ejecución

### Backend

Abrir una terminal en Visual Studio Code y ejecutar:

```powershell
cd backend
```

Configurar las variables de entorno de la conexión a PostgreSQL y ejecutar:

```powershell
.\mvnw.cmd spring-boot:run
```

El backend estará disponible en:

`http://localhost:8080`

La API de tareas estará disponible en:

`http://localhost:8080/api/tareas`

### Frontend

Abrir una segunda terminal y ejecutar:

```powershell
cd frontend
npm install
npm run dev
```

Abrir en el navegador la dirección que indique Vite. En la configuración de desarrollo actual, corresponde a:

`http://localhost:5173`

## 9. Buenas prácticas de desarrollo

El proyecto busca aplicar los siguientes principios:

- **Responsabilidad única:** separar las funciones del controlador, el servicio, el dominio y la persistencia.
- **Inversión de dependencias:** utilizar un puerto de persistencia para desacoplar la lógica de aplicación de la implementación concreta del repositorio.
- **Separación de responsabilidades:** mantener la interfaz, la lógica de negocio y el acceso a los datos en componentes diferenciados.
- **Código limpio:** utilizar nombres comprensibles, métodos con responsabilidades definidas y una estructura organizada.
- **Refactorización:** mejorar la organización interna del código procurando conservar su comportamiento.

## 10. Verificación del funcionamiento

Durante el desarrollo se comprobó el funcionamiento de las operaciones principales de gestión de tareas, los filtros, el buscador y la persistencia en PostgreSQL. También se ejecutó la compilación y verificación del backend mediante Maven.

Las pruebas automatizadas específicas deberán documentarse según los casos implementados en el proyecto.

## 11. Autoría

Proyecto académico desarrollado como parte del proceso de formación en Ingeniería de Software.
