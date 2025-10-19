import * as Icons from 'lucide-react';

export type IconName = keyof typeof Icons;

interface DynamicIconProps {
  name: IconName;
  className?: string;
}

const DynamicIcon = ({ name, className }: DynamicIconProps) => {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    return <Icons.HelpCircle className={className} />;
  }

  return <IconComponent className={className} />;
};

export default DynamicIcon;
