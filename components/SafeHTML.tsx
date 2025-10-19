import React from 'react';

interface SafeHTMLProps {
  html: string;
  className?: string;
  dir?: 'rtl' | 'ltr';
}

const SafeHTML: React.FC<SafeHTMLProps> = ({ html, ...props }) => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div
      {...props}
      dangerouslySetInnerHTML={{ __html: isClient ? html : '' }}
    />
  );
};

export default SafeHTML;
