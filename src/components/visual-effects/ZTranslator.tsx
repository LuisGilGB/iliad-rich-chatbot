import clsx from 'clsx';
import { PropsWithChildren } from 'react';
import styles from './ZTranslator.module.css';

const ZTranslator = ({ children }: PropsWithChildren) => (
  <div className={clsx('w-full', styles.root)}>{children}</div>
);

export default ZTranslator;
