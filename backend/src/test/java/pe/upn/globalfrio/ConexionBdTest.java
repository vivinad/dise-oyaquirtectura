package pe.upn.globalfrio;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import pe.upn.globalfrio.entity.Producto;
import pe.upn.globalfrio.repository.ProductoRepository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Prueba de integración: verifica la conexión con la base de datos del perfil activo.
 * - Perfil dev (por defecto): H2 en memoria, no requiere instalar nada.
 * - Perfil sqlserver: requiere SQL Server con el script database/EJECUTAR_BD_GLOBALFRIO.sql
 *   ejecutado y las variables DB_USUARIO / DB_CLAVE configuradas.
 */
@SpringBootTest
class ConexionBdTest {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private ProductoRepository productoRepository;

    @Test
    @DisplayName("La aplicación abre una conexión válida con la base de datos")
    void conexionConBaseDeDatos() throws Exception {
        try (Connection conexion = dataSource.getConnection()) {
            DatabaseMetaData meta = conexion.getMetaData();
            System.out.println("Conectado a: " + meta.getDatabaseProductName() + " " + meta.getDatabaseProductVersion());
            System.out.println("Base de datos: " + conexion.getCatalog());

            assertTrue(conexion.isValid(2), "La conexión no es válida");
        }
    }

    @Test
    @DisplayName("La entidad Producto lee el catálogo de equipos desde la tabla productos (RF01)")
    void leerCatalogoDesdeSqlServer() {
        long total = productoRepository.count();
        System.out.println("Registros en la tabla productos (equipos y servicios): " + total);

        List<Producto> equipos = productoRepository.findByCategoriaAndActivo("EQUIPO", true);
        equipos.forEach(p -> System.out.println(" - " + p.getNombre() + " | S/ " + p.getPrecio()));

        assertFalse(equipos.isEmpty(), "No hay equipos en la tabla productos: revisa los datos iniciales");
    }
}
