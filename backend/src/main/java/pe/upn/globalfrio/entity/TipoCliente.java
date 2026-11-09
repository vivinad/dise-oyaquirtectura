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

import java.math.BigDecimal;

/**
 * Paso 2 del cotizador: tipo de lugar (HOGAR, NEGOCIO o EMPRESA).
 * El factor de precio ajusta el costo de la mano de obra. Tabla tipo_cliente.
 */
@Entity
@Table(name = "tipo_cliente")
@Getter
@Setter
@NoArgsConstructor
public class TipoCliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20, unique = true)
    private String codigo;

    @Column(nullable = false, length = 60)
    private String nombre;

    @Column(length = 255)
    private String descripcion;

    @Column(name = "factor_precio", nullable = false, precision = 4, scale = 2)
    private BigDecimal factorPrecio;

    @Column(nullable = false)
    private Boolean activo = true;
}
