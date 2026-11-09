package pe.upn.globalfrio.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Paso 1 del cotizador: tipo de servicio que necesita el cliente
 * (INSTALACION, MANTENIMIENTO o REPARACION). Tabla tipo_servicio.
 */
@Entity
@Table(name = "tipo_servicio")
@Getter
@Setter
@NoArgsConstructor
public class TipoServicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20, unique = true)
    private String codigo;

    @Column(nullable = false, length = 60)
    private String nombre;

    @Column(length = 255)
    private String descripcion;

    @Column(nullable = false)
    private Boolean activo = true;
}
