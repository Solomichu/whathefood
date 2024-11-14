import { useEffect } from 'react';

export function usePointerEvents(isOpen: boolean) {
  useEffect(() => {
    const cleanup = () => {
      document.body.style.removeProperty('pointer-events');
    };

    if (!isOpen) {
      // Pequeño delay para asegurar que se ejecute después de las transiciones
      setTimeout(cleanup, 100);
    }

    // Limpiar al desmontar el componente
    return cleanup;
  }, [isOpen]);
}
