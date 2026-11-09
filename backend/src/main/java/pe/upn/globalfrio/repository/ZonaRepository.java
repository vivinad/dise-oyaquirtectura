package pe.upn.globalfrio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.upn.globalfrio.entity.Zona;

import java.util.List;

@Repository
public interface ZonaRepository extends JpaRepository<Zona, Long> {

    List<Zona> findByActivoTrueOrderByCostoTrasladoAsc();
}
