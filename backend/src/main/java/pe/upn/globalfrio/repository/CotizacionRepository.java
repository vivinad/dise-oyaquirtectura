package pe.upn.globalfrio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pe.upn.globalfrio.entity.Cotizacion;

import java.util.Optional;

@Repository
public interface CotizacionRepository extends JpaRepository<Cotizacion, Long> {

    /** Cotización con sus líneas y productos, para el resumen y el documento descargable (RF05). */
    @Query("SELECT DISTINCT c FROM Cotizacion c LEFT JOIN FETCH c.detalles d LEFT JOIN FETCH d.producto WHERE c.codigo = :codigo")
    Optional<Cotizacion> buscarPorCodigoConDetalle(@Param("codigo") String codigo);

    /** Último id usado, para generar el código correlativo COT-AAAA-000001. */
    @Query("SELECT COALESCE(MAX(c.id), 0) FROM Cotizacion c")
    Long obtenerUltimoId();
}
