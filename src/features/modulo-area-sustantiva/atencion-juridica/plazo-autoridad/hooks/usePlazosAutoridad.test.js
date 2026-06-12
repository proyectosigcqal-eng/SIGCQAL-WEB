import { renderHook, waitFor, act } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { usePlazosAutoridad } from './usePlazosAutoridad'
import { controlPlazosAutoridadService } from '../services/controlPlazosAutoridadService'

vi.mock('../services/controlPlazosAutoridadService', () => ({
  controlPlazosAutoridadService: {
    obtenerSemaforo: vi.fn(),
    registrarInformeRecibido: vi.fn(),
  },
}))

describe('usePlazosAutoridad', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('carga el semáforo al inicializar', async () => {
    controlPlazosAutoridadService.obtenerSemaforo.mockResolvedValueOnce({
      estado: 'VERDE',
      diasHabilesRestantes: 3,
    })

    const { result, unmount } = renderHook(() => usePlazosAutoridad(123))

    await waitFor(() => {
      expect(controlPlazosAutoridadService.obtenerSemaforo).toHaveBeenCalledWith(123)
      expect(result.current.cargando).toBe(false)
      expect(result.current.semaforo).toEqual({ estado: 'VERDE', diasHabilesRestantes: 3 })
      expect(result.current.error).toBe(null)
    })

    unmount()
  })

  it('registra informe y refresca el semáforo', async () => {
    controlPlazosAutoridadService.obtenerSemaforo
      .mockResolvedValueOnce({ estado: 'AMARILLO', diasHabilesRestantes: 4 })
      .mockResolvedValueOnce({ estado: 'ROJO', diasHabilesRestantes: 0 })
    controlPlazosAutoridadService.registrarInformeRecibido.mockResolvedValueOnce({ ok: true })

    const { result, unmount } = renderHook(() => usePlazosAutoridad(999))

    await waitFor(() => expect(result.current.cargando).toBe(false))

    await act(async () => {
      await result.current.registrarInforme(
        { numeroOficioRespuesta: 'OF-1', fojas: 1, fechaRecepcion: '2026-06-12' },
        new File(['%PDF-1.4'], 'doc.pdf', { type: 'application/pdf' }),
      )
    })

    await waitFor(() => {
      expect(controlPlazosAutoridadService.registrarInformeRecibido).toHaveBeenCalled()
      expect(controlPlazosAutoridadService.obtenerSemaforo).toHaveBeenCalledTimes(2)
      expect(result.current.semaforo).toEqual({ estado: 'ROJO', diasHabilesRestantes: 0 })
    })

    unmount()
  })
})
