import { useEffect } from 'react';

export function usePointerEvents(isOpen: boolean) {
  useEffect(() => {
    // Función para limpiar el pointer-events
    const cleanup = () => {
      document.body.style.removeProperty('pointer-events');
    };

    if (isOpen) {
      // Si el diálogo está abierto, no hacemos nada con pointer-events
      return;
    } else {
      // Si el diálogo se está cerrando, limpiamos inmediatamente
      cleanup();
    }

    // Limpiar al desmontar el componente
    return cleanup;
  }, [isOpen]);
}
