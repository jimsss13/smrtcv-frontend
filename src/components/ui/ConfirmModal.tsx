'use client';

import React, { memo } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

/**
 * Properties for the ConfirmModal component.
 */
interface ConfirmModalProps {
  /** Whether the modal is currently open. */
  isOpen: boolean;
  /** Callback function to close the modal. */
  onClose: () => void;
  /** Callback function triggered when the user confirms the action. */
  onConfirm: () => void;
  /** The title of the confirmation dialog. */
  title: string;
  /** The message explaining the action to be confirmed. */
  message: string;
  /** Optional label for the confirm button. Defaults to 'Confirm'. */
  confirmLabel?: string;
  /** Optional label for the cancel button. Defaults to 'Cancel'. */
  cancelLabel?: string;
  /** The visual style of the confirm button. 'destructive' for deletions, 'primary' for others. */
  variant?: 'destructive' | 'primary';
}

/**
 * A specialized modal for confirming critical or destructive actions.
 * Provides consistent styling for 'Cancel' and 'Confirm' buttons.
 * 
 * @example
 * <ConfirmModal 
 *   isOpen={isDeleting} 
 *   onClose={() => setIsDeleting(false)} 
 *   onConfirm={handleDelete}
 *   title="Delete Item?"
 *   message="This action cannot be undone."
 *   variant="destructive"
 * />
 * 
 * @param props - Component properties.
 */
const ConfirmModal = memo(function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary'
}: ConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="outline" onClick={onClose} className="rounded-full px-6 font-bold">
            {cancelLabel}
          </Button>
          <Button 
            variant={variant === 'destructive' ? 'destructive' : 'default'} 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="rounded-full px-6 font-bold"
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-lg text-foreground-secondary">{message}</p>
    </Modal>
  );
});

ConfirmModal.displayName = 'ConfirmModal';

export { ConfirmModal };
export default ConfirmModal;
