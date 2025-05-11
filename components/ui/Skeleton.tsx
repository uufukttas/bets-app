'use client';

interface SkeletonProps {
  className?: string;
  height?: string | number;
  width?: string | number;
  animated?: boolean;
  rounded?: boolean | string;
}

const Skeleton = ({ 
  className = '', 
  height, 
  width, 
  animated = true,
  rounded = true 
}: SkeletonProps) => {
  const baseClass = 'bg-gray-200';
  const animationClass = animated ? 'animate-pulse' : '';
  
  let roundedClass = '';
  if (typeof rounded === 'boolean') {
    roundedClass = rounded ? 'rounded-md' : '';
  } else {
    roundedClass = rounded;
  }
  
  const style: Record<string, any> = {};
  
  if (height) {
    style.height = typeof height === 'number' ? `${height}px` : height;
  }
  
  if (width) {
    style.width = typeof width === 'number' ? `${width}px` : width;
  }
  
  return (
    <div 
      className={`${baseClass} ${animationClass} ${roundedClass} ${className}`} 
      style={style}
    />
  );
};

export default Skeleton;

export const SkeletonText = ({ lines = 1, className = '' }: { lines?: number; className?: string }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        className="h-4" 
        width={i === lines - 1 && lines > 1 ? '80%' : '100%'} 
      />
    ))}
  </div>
);

export const SkeletonAvatar = ({ size = 40, className = '' }: { size?: number; className?: string }) => (
  <Skeleton 
    className={`rounded-full ${className}`} 
    width={size} 
    height={size} 
  />
);

export const SkeletonCard = ({ className = '' }: { className?: string }) => (
  <div className={`space-y-3 ${className}`}>
    <Skeleton className="h-40 w-full" />
    <SkeletonText lines={3} />
  </div>
); 