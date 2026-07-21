import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProgressBar from '../components/cours/ProgressBar';

describe('ProgressBar Component - Unit Tests', () => {
  it('devrait afficher le pourcentage de progression textuel', () => {
    render(<ProgressBar pourcentage={75} />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('devrait afficher 0% par défaut si aucune valeur n\'est fournie', () => {
    render(<ProgressBar />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });
});
