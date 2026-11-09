package pe.upn.globalfrio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pe.upn.globalfrio.entity.Producto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Repositorio JPA para la entidad Producto.
 * Cumple con las directivas de RF-SEM04-02 y SPEC-SEM04-C (JPQL parametrizado, sin concatenaciones).
 */
@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    /**
     * Búsqueda por coincidencia de nombre ignorando mayúsculas y minúsculas.
     * @param nombre Término a buscar
     * @return Lista de productos coincidentes
     */
    List<Producto> findByNombreContainingIgnoreCase(String nombre);

    /**
     * Búsqueda por categoría exacta y estado activo.
     * @param categoria Categoría del producto
     * @param activo Estado de actividad
     * @return Lista de productos filtrados
     */
    List<Producto> findByCategoriaAndActivo(String categoria, Boolean activo);

    /**
     * Consulta JPQL parametrizada para rango de precios (Mitigación estricta de SQL Injection).
     * @param minimo Precio límite inferior
     * @param maximo Precio límite superior
     * @return Lista de productos dentro del rango
     */
    @Query("SELECT p FROM Producto p WHERE p.precio BETWEEN :minimo AND :maximo ORDER BY p.precio ASC")
    List<Producto> findByRangoPrecio(@Param("minimo") BigDecimal minimo, @Param("maximo") BigDecimal maximo);

    /**
     * RF01: equipos activos del catálogo ordenados por capacidad.
     */
    @Query("SELECT p FROM Producto p WHERE p.categoria = 'EQUIPO' AND p.activo = true ORDER BY p.capacidadBtu ASC")
    List<Producto> buscarEquiposActivos();

    /**
     * RF02: equipos que cubren el área indicada; el primero es el recomendado (menor capacidad suficiente).
     * @param area Área del ambiente en m² (redondeada hacia arriba)
     */
    @Query("SELECT p FROM Producto p WHERE p.categoria = 'EQUIPO' AND p.activo = true AND p.areaMaxM2 >= :area ORDER BY p.capacidadBtu ASC")
    List<Producto> buscarEquiposParaArea(@Param("area") Integer area);

    /**
     * Servicios activos de un tipo (INSTALACION, MANTENIMIENTO, REPARACION) que aplican a una capacidad.
     * Los servicios sin capacidad (por ejemplo, el diagnóstico) aplican a cualquier equipo.
     * @param codigo Código del tipo de servicio
     * @param btu    Capacidad del equipo; si es null se devuelven todos los servicios del tipo
     */
    @Query("SELECT p FROM Producto p JOIN p.tipoServicio t WHERE p.categoria = 'SERVICIO' AND p.activo = true AND t.codigo = :codigo AND (:btu IS NULL OR p.capacidadBtu IS NULL OR p.capacidadBtu = :btu) ORDER BY p.precio ASC")
    List<Producto> buscarServicios(@Param("codigo") String codigo, @Param("btu") Integer btu);
}
