import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Badge from '../components/common/Badge';

describe('Badge Component - Unit Tests', () => {
  it('devrait afficher le libellé pour la catégorie NUMERIQUE', () => {
    render(<Badge categorie="NUMERIQUE" />);
    expect(screen.getByText('Numérique & Innovation')).toBeInTheDocument();
  });

  it('devrait afficher le libellé pour la catégorie ARTISANAT', () => {
    render(<Badge categorie="ARTISANAT" />);
    expect(screen.getByText('Artisanat & Métiers techniques')).toBeInTheDocument();
  });

  it('devrait afficher le libellé pour la catégorie AGRICULTURE', () => {
    render(<Badge categorie="AGRICULTURE" />);
    expect(screen.getByText('Agriculture & Agro-transformation')).toBeInTheDocument();
  });
});
