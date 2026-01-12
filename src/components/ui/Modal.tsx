'use client';

import React, { ReactNode, useEffect, memo } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Properties for the Modal component.
 */
interface ModalProps {
  /** Whether the modal is currently open. */
  isOpen: boolean;
  /** Callback function to close the modal. */
  onClose: () => void;
  /** The human-readable title of the modal. */
  title: string;
  /** The content to render inside the modal. */
  children: ReactNode;
  /** Optional footer content. */
  footer?: ReactNode;
  /** Optional additional CSS classes. */
  className?: string;
}

/**
 * A reusable modal component with backdrop, title, and optional footer.
 * Handles scroll locking and keyboard accessibility (ESC to close).
 * Built with Framer Motion-like CSS animations for smooth transitions.
 * 
 * @example
 * <Modal isOpen={isOpen} onClose={handleClose} title="Example Modal">
 *   <p>Modal content goes here.</p>
 * </Modal>
 * 
 * @param props - The component properties.
 */
const Modal = memo(function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className
}: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      // Save original overflow style to restore it correctly
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
      
      return () => {
        document.body.style.overflow = originalOverflow || 'unset';
        window.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={cn(
          "bg-white rounded-4xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200",
          className
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
          <button 
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        
        <div className="p-8">
          {children}
        </div>

        {footer && (
          <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';

export { Modal };
export default Modal;
