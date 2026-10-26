# Gestor de Tareas Personales

Aplicación web para administrar tareas personales de manera sencilla, organizada e intuitiva. Permite crear tareas, consultar las registradas, buscar y filtrar actividades, editar su información, cambiar su estado de cumplimiento y eliminarlas.

## 1. Objetivo del proyecto

Desarrollar una aplicación web que facilite la organización y el seguimiento de actividades personales, aplicando conceptos de Ingeniería de Software, arquitectura hexagonal, principios SOLID y buenas prácticas de programación.

## 2. Funcionalidades

- Crear tareas con título, descripción y fecha límite.
- Consultar las tareas registradas.
- Buscar tareas mediante el buscador de la interfaz.
- Filtrar tareas según su estado de cumplimiento.
- Editar la información de una tarea.
- Marcar tareas como pendientes o completadas.
- Eliminar tareas.
- Almacenar la información en PostgreSQL.
- Utilizar una interfaz web para gestionar las actividades.

## 3. Tecnologías utilizadas

| Tecnología | Función |
|---|---|
| Java 21 | Lenguaje de programación del backend |
| Spring Boot 4.1.2 | Desarrollo de la API REST |
| Maven | Gestión y ejecución del backend |
| React | Construcción de la interfaz de usuario |
| Vite | Herramienta de desarrollo del frontend |
| PostgreSQL | Sistema de gestión de bases de datos |
| Git y GitHub | Control de versiones y alojamiento del código |
| Visual Studio Code | Entorno de desarrollo |

## 4. Arquitectura del sistema

El backend utiliza una estructura basada en arquitectura hexagonal, que separa el dominio, la lógica de aplicación y los componentes de infraestructura.

### Estructura principal del backend

```text
backend/
└── src/
    └── main/
        ├── java/com/gestortareas/
        │   ├── BackendApplication.java
        │   ├── domain/
        │   │   ├── model/Tarea.java
        │   │   └── port/out/TareaRepositoryPort.java
        │   ├── application/
        │   │   └── service/TareaService.java
        │   └── infrastructure/
        │       ├── controller/TareaController.java
        │       └── repository/
        │           ├── TareaRepository.java
        │           └── TareaRepositoryAdapter.java
        └── resources/
            └── application.properties
```

### Responsabilidades de las capas

- **Dominio:** contiene el modelo `Tarea` y el puerto de salida para las operaciones de persistencia.
- **Aplicación:** contiene `TareaService`, que coordina las operaciones de gestión de tareas.
- **Infraestructura:** contiene el controlador REST, el repositorio de Spring Data JPA y el adaptador de persistencia.
- **Frontend:** presenta la interfaz de usuario y se comunica con el backend mediante solicitudes HTTP.

Esta separación favorece el mantenimiento, las pruebas y la evolución del sistema.

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

Antes de ejecutar el proyecto, se necesita:

- Java Development Kit (JDK) 21.
- PostgreSQL instalado y en funcionamiento.
- Node.js y npm.
- Git, si se desea clonar el repositorio.
- Un navegador web actualizado.

## 7. Obtener el proyecto

El código fuente está disponible en GitHub:

**Repositorio:** https://github.com/Yuranis30/gestor-tareas

Para descargarlo mediante Git, abrir Git Bash y ejecutar:

```bash
git clone https://github.com/Yuranis30/gestor-tareas.git
cd gestor-tareas
```

También se puede descargar el código mediante la opción **Code → Download ZIP** de GitHub y extraer el contenido en una carpeta local.

## 8. Configuración de PostgreSQL

### 8.1. Crear la base de datos

Abrir PostgreSQL mediante pgAdmin o una herramienta de consulta SQL y ejecutar:

```sql
CREATE DATABASE gestor_tareas;
```

Si la base de datos ya existe, no es necesario crearla de nuevo.

El usuario configurado en el ejemplo es `postgres`. Si se utiliza otro usuario, se debe ajustar la variable correspondiente.

### 8.2. Configurar la conexión

El archivo `backend/src/main/resources/application.properties` utiliza estas propiedades:

```properties
spring.application.name=gestor-tareas

spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/gestor_tareas}
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

server.port=8080
```

La contraseña se proporciona mediante la variable de entorno `DB_PASSWORD`. No se debe escribir ni publicar una contraseña real en el repositorio.

### 8.3. Configurar las variables en Windows PowerShell

Abrir una terminal de PowerShell y ejecutar:

```powershell
$env:DB_PASSWORD = "TU_CONTRASEÑA_LOCAL"
```

Reemplazar `TU_CONTRASEÑA_LOCAL` por la contraseña configurada en PostgreSQL. Si el usuario o la dirección de la base de datos son diferentes de los valores predeterminados, también se pueden establecer `DB_USERNAME` y `DB_URL`.

Estas variables deben configurarse en la misma sesión de PowerShell desde la que se ejecutará el backend. Al abrir una terminal nueva, será necesario configurarlas de nuevo, salvo que se hayan definido de forma persistente en Windows.

## 9. Instalación y ejecución

Para utilizar la aplicación, PostgreSQL debe estar funcionando y la base de datos debe estar creada.

### 9.1. Ejecutar el backend

1. Abrir el proyecto en Visual Studio Code.
2. Abrir una terminal de PowerShell.
3. Entrar a la carpeta del backend:

```powershell
cd "$HOME\Desktop\gestor-tareas\backend"
```

Si el proyecto está guardado en otra ubicación, sustituir la ruta por la correspondiente.

4. Configurar la contraseña de PostgreSQL en esa misma terminal:

```powershell
$env:DB_PASSWORD = "TU_CONTRASEÑA_LOCAL"
```

5. Iniciar Spring Boot:

```powershell
.\mvnw.cmd spring-boot:run
```

Esperar a que la aplicación indique que se ha iniciado correctamente.

El backend se ejecuta en:

http://localhost:8080

La API de tareas se encuentra en:

http://localhost:8080/api/tareas

Esta última dirección permite comprobar la respuesta de la API cuando el backend y PostgreSQL están funcionando.

**Importante:** mantener abierta la terminal mientras se utiliza la aplicación.

### 9.2. Ejecutar el frontend

1. Abrir una segunda terminal en Visual Studio Code. No cerrar la terminal del backend.
2. Entrar a la carpeta del frontend:

```powershell
cd "$HOME\Desktop\gestor-tareas\frontend"
```

Si la carpeta del proyecto está en otra ubicación, ajustar la ruta.

3. Instalar las dependencias:

```powershell
npm install
```

Este comando instala las dependencias declaradas por el proyecto. Solo es necesario repetirlo cuando se necesite instalar o actualizar las dependencias.

4. Iniciar el servidor de desarrollo de Vite:

```powershell
npm run dev
```

5. Abrir en el navegador la dirección que aparezca en la terminal. En la configuración de desarrollo actual, normalmente es:

http://localhost:5173

**Importante:** mantener abiertas las dos terminales mientras se utiliza la aplicación: una para Spring Boot y otra para Vite.

## 10. Buenas prácticas de desarrollo

El proyecto busca aplicar los siguientes principios:

- **Responsabilidad única:** separar las funciones del controlador, el servicio, el dominio y la persistencia.
- **Inversión de dependencias:** utilizar un puerto de persistencia para desacoplar la lógica de aplicación de la implementación concreta del repositorio.
- **Separación de responsabilidades:** mantener la interfaz, la lógica de negocio y el acceso a los datos en componentes diferenciados.
- **Código limpio:** utilizar nombres comprensibles, métodos con responsabilidades definidas y una estructura organizada.
- **Refactorización:** mejorar la organización interna del código procurando conservar su comportamiento.

## 11. Verificación del funcionamiento

Durante el desarrollo se comprobó el funcionamiento de las operaciones principales de gestión de tareas, los filtros, el buscador y la persistencia en PostgreSQL. También se ejecutó la compilación y verificación del backend mediante Maven.

Las pruebas automatizadas específicas deberán documentarse de acuerdo con los casos implementados en el proyecto.

## 12. Autoría

Proyecto académico desarrollado como parte del proceso de formación en Ingeniería de Software.
