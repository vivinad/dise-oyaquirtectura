package pe.upn.globalfrio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.upn.globalfrio.entity.TipoServicio;

import java.util.List;
import java.util.Optional;

@Repository
public interface TipoServicioRepository extends JpaRepository<TipoServicio, Long> {

    List<TipoServicio> findByActivoTrueOrderByIdAsc();

    Optional<TipoServicio> findByCodigoAndActivoTrue(String codigo);
}
