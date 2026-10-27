import { useState, useMemo, useCallback } from 'react';
import { DEFAULT_REPORT_DRAFT } from '../constants.js';
import { validateReportDraft } from '../validation.js';

/**
 * Hook for managing litter report draft state and validation.
 *
 * @param {object} [initialDraft]
 * @returns {object} Draft state, handlers, and validation details
 */
export function useReportDraft(initialDraft = DEFAULT_REPORT_DRAFT) {
  const [draft, setDraft] = useState(initialDraft);
  const [touched, setTouched] = useState({
    severity: false,
    description: false,
  });

  const validation = useMemo(() => {
    return validateReportDraft(draft);
  }, [draft]);

  const setSeverity = useCallback((level) => {
    setDraft((prev) => ({ ...prev, severity: level }));
    setTouched((prev) => ({ ...prev, severity: true }));
  }, []);

  const setDescription = useCallback((text) => {
    setDraft((prev) => ({ ...prev, description: text }));
    setTouched((prev) => ({ ...prev, description: true }));
  }, []);

  const setCoordinates = useCallback((coords) => {
    setDraft((prev) => ({ ...prev, coordinates: coords }));
  }, []);

  const resetDraft = useCallback(() => {
    setDraft(DEFAULT_REPORT_DRAFT);
    setTouched({ severity: false, description: false });
  }, []);

  return {
    draft,
    validation,
    touched,
    setSeverity,
    setDescription,
    setCoordinates,
    resetDraft,
  };
}

export default useReportDraft;
