
import { describe, it, expect } from 'vitest';
import { validateFormData } from '../formValidation';
import { FormData } from '@/types/form';

describe('validateFormData', () => {
  it('should return no errors for a valid form', () => {
    const validForm: FormData = {
      role: 'Marketing Manager',
      clientName: 'Acme Corp',
      clientIndustry: 'Technology',
      sponsored: 'No Sponsorship',
      event: '',
      targetAudience: 'Business Professionals',
      location: 'North America',
      productService: 'Software',
      relationalSentiment: 'Trust',
      additionalNotes: ''
    };

    const errors = validateFormData(validForm);
    expect(Object.keys(errors).length).toBe(0);
  });

  it('should identify all required fields when empty', () => {
    const emptyForm: FormData = {
      role: '',
      clientName: '',
      clientIndustry: '',
      sponsored: '',
      event: '',
      targetAudience: '',
      location: '',
      productService: '',
      relationalSentiment: '',
      additionalNotes: ''
    };

    const errors = validateFormData(emptyForm);
    
    // Should have errors for all required fields
    expect(errors.role).toBeDefined();
    expect(errors.clientName).toBeDefined();
    expect(errors.clientIndustry).toBeDefined();
    expect(errors.sponsored).toBeDefined();
    expect(errors.targetAudience).toBeDefined();
    expect(errors.location).toBeDefined();
    expect(errors.productService).toBeDefined();
    expect(errors.relationalSentiment).toBeDefined();
    
    // Event is not required by default
    expect(errors.event).toBeUndefined();
    // additionalNotes is not required
    expect(errors.additionalNotes).toBeUndefined();
  });

  it('should require event field when sponsored is "Yes Sponsored"', () => {
    const sponsoredForm: FormData = {
      role: 'Marketing Manager',
      clientName: 'Acme Corp',
      clientIndustry: 'Technology',
      sponsored: 'Yes Sponsored',
      event: '', // Empty event should trigger error
      targetAudience: 'Business Professionals',
      location: 'North America',
      productService: 'Software',
      relationalSentiment: 'Trust',
      additionalNotes: ''
    };

    const errors = validateFormData(sponsoredForm);
    expect(errors.event).toBeDefined();
    expect(errors.event).toBe('Event is required for sponsored projects');
  });

  it('should not require event field when sponsored is not "Yes Sponsored"', () => {
    const nonSponsoredForm: FormData = {
      role: 'Marketing Manager',
      clientName: 'Acme Corp',
      clientIndustry: 'Technology',
      sponsored: 'No Sponsorship',
      event: '', // Empty event should not trigger error
      targetAudience: 'Business Professionals',
      location: 'North America',
      productService: 'Software',
      relationalSentiment: 'Trust',
      additionalNotes: ''
    };

    const errors = validateFormData(nonSponsoredForm);
    expect(errors.event).toBeUndefined();
  });

  it('should validate partial form data correctly', () => {
    const partialForm: FormData = {
      role: 'Marketing Manager',
      clientName: 'Acme Corp',
      clientIndustry: '',
      sponsored: 'No Sponsorship',
      event: '',
      targetAudience: '',
      location: 'North America',
      productService: '',
      relationalSentiment: 'Trust',
      additionalNotes: ''
    };

    const errors = validateFormData(partialForm);
    
    // These fields are filled
    expect(errors.role).toBeUndefined();
    expect(errors.clientName).toBeUndefined();
    expect(errors.sponsored).toBeUndefined();
    expect(errors.location).toBeUndefined();
    expect(errors.relationalSentiment).toBeUndefined();
    
    // These fields are empty and should have errors
    expect(errors.clientIndustry).toBeDefined();
    expect(errors.targetAudience).toBeDefined();
    expect(errors.productService).toBeDefined();
  });
});
