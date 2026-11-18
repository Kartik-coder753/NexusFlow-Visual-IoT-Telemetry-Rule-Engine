export type ComparisonOperator = 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'neq' | 'between';

export interface OperatorDefinition {
  id: ComparisonOperator;
  label: string;
  arity: 1 | 2;
}

export const SUPPORTED_OPERATORS: OperatorDefinition[] = [
  { id: 'gt', label: 'Greater Than', arity: 1 },
  { id: 'gte', label: 'Greater Than or Equal', arity: 1 },
  { id: 'lt', label: 'Less Than', arity: 1 },
  { id: 'lte', label: 'Less Than or Equal', arity: 1 },
  { id: 'eq', label: 'Equals', arity: 1 },
  { id: 'neq', label: 'Not Equals', arity: 1 },
  { id: 'between', label: 'Within Range', arity: 2 },
];
