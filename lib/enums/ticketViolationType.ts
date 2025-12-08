export enum ViolationType {
  MeterOrTime = 'MeterOrTime', //! LHS STRINGS get submitted to Supabase! DO NOT CHANGE!
  RestrictedZone = 'RestrictedZone', //! USE violationEnumToUserLabels FOR User-friendly CONVERSION!
  DisabledZone = 'DisabledZone',
  Obstruction = 'Obstruction',
  Registration = 'Registration',
  Other = 'Other',
}

// runtime type guard
export function isValidViolationType(value: any): value is ViolationType {
  return Object.values(ViolationType).includes(value);
}

// Convert type to user-friendly string (for submit ticket dropdown)
export const violationEnumToUserLabels: Record<ViolationType, string> = {
  [ViolationType.MeterOrTime]: 'Meter or Time',
  [ViolationType.RestrictedZone]: 'No Parking Zone',
  [ViolationType.DisabledZone]: 'Disabled Zone',
  [ViolationType.Obstruction]: 'Blocking or Obstruction',
  [ViolationType.Registration]: 'Registration',
  [ViolationType.Other]: 'Other',
};
