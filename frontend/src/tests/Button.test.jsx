import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from '../components/common/Button';

describe('Button Component - Unit Tests', () => {
  it('devrait afficher correctement le texte du bouton', () => {
    render(<Button>Se connecter</Button>);
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });

  it('devrait déclencher la fonction onClick lors du clic', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Valider</Button>);

    const button = screen.getByRole('button', { name: /valider/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('devrait être désactivé lorsque la prop disabled est vraie', () => {
    render(<Button disabled>Chargement...</Button>);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
  });
});
