export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const cn = (sectionName?: string, ...classNames: (string | undefined | null | false)[]): string => {
  const baseClass = 'unibet-app';
  
  const filteredClassNames = classNames.filter(Boolean);
  
  if (sectionName) {
    return [
      baseClass,
      `${baseClass}-${sectionName}`,
      ...filteredClassNames
    ].filter(Boolean).join(' ');
  }
  
  return [baseClass, ...filteredClassNames].filter(Boolean).join(' ');
};
