import { cn } from '@/lib/utils';
import clsx from 'clsx';
import * as React from 'react';
import styles from './ZTranslator.module.css';

interface ZTranslatorProps {
  children: React.ReactElement<{ className: string }>;
}

const ZTranslator = ({ children }: ZTranslatorProps) =>
  React.Children.only(children) && React.isValidElement(children) ? (
    React.cloneElement(children, {
      className: cn(children.props?.className, styles.root),
    })
  ) : (
    <div className={clsx('w-full', styles.root)}>{children}</div>
  );

export default ZTranslator;
