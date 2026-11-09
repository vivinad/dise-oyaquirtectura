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
 * Zona de atención en Lima con su costo de traslado desde la base en Ventanilla. Tabla zona.
 */
@Entity
@Table(name = "zona")
@Getter
@Setter
@NoArgsConstructor
public class Zona {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 60, unique = true)
    private String nombre;

    @Column(length = 400)
    private String distritos;

    @Column(name = "costo_traslado", nullable = false, precision = 10, scale = 2)
    private BigDecimal costoTraslado;

    @Column(nullable = false)
    private Boolean activo = true;
}
