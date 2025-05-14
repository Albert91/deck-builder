import { describe, it, expect } from 'vitest';
import { formatDate, formatNumber } from '../format';

describe('Format Utils', () => {
  describe('formatDate', () => {
    it('formatuje datę w domyślnym formacie', () => {
      // Arrange
      const date = new Date('2023-12-31');

      // Act
      const result = formatDate(date);

      // Assert
      expect(result).toBe('31 grudnia 2023');
    });

    it('formatuje datę w zadanym formacie', () => {
      // Arrange
      const date = '2023-12-31T12:34:56Z';

      // Act
      const result = formatDate(date, 'dd.MM.yyyy, HH:mm');

      // Assert
      expect(result).toBe('31.12.2023, 12:34');
    });

    it('obsługuje nieprawidłowy format daty', () => {
      // Arrange
      const invalidDate = 'not-a-date';

      // Act
      const result = formatDate(invalidDate);

      // Assert
      expect(result).toBe('Nieprawidłowa data');
    });
  });

  describe('formatNumber', () => {
    it('formatuje małe liczby bez separatora tysięcznego', () => {
      // Arrange & Act
      const result = formatNumber(123);

      // Assert
      expect(result).toBe('123');
    });

    it('formatuje duże liczby z separatorem tysięcznym', () => {
      // Arrange & Act
      const result = formatNumber(1234567);

      // Assert
      expect(result).toBe('1 234 567');
    });

    it('formatuje liczby ujemne', () => {
      // Arrange & Act
      const result = formatNumber(-1234567);

      // Assert
      expect(result).toBe('-1 234 567');
    });

    it('formatuje liczby z wartościami dziesiętnymi', () => {
      // Arrange & Act
      const result = formatNumber(1234.56);

      // Assert
      expect(result).toBe('1 234,56');
    });
  });
});
