package pe.upn.globalfrio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.upn.globalfrio.entity.TipoCliente;

import java.util.List;
import java.util.Optional;

@Repository
public interface TipoClienteRepository extends JpaRepository<TipoCliente, Long> {

    List<TipoCliente> findByActivoTrueOrderByIdAsc();

    Optional<TipoCliente> findByCodigoAndActivoTrue(String codigo);
}
